const findBoxHtml = `
<div style="position: relative;">
    <input class="search" type="text" autofocus>
    <span class="label"></span>
    </div>
<div id="up" class="icon">
    <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8">
        <path d="M4 0l-4 4 1.5 1.5 2.5-2.5 2.5 2.5 1.5-1.5-4-4z" transform="translate(0 1)" />
    </svg>
</div>
<div id="down" class="icon">
    <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8">
        <path d="M1.5 0l-1.5 1.5 4 4 4-4-1.5-1.5-2.5 2.5-2.5-2.5z" transform="translate(0 1)" />
    </svg>
</div>
<div id="close" class="icon">
    <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8">
        <path d="M1.41 0l-1.41 1.41.72.72 1.78 1.81-1.78 1.78-.72.69 1.41 1.44.72-.72 1.81-1.81 1.78 1.81.69.72 1.44-1.44-.72-.69-1.81-1.78 1.81-1.81.72-.72-1.44-1.41-.69.72-1.78 1.78-1.81-1.78-.72-.72z" />
    </svg>
</div>
`

class Find {
  constructor(app, findContainer) {
    this.findContainer = findContainer
    this.findContainer.innerHTML = findBoxHtml
    this.findContainer.hidden = true
    this.app = app
    this.searchEl = findContainer.querySelector(".search")
    this.labelEl = findContainer.querySelector(".label")

    this.searchEl.focus()
    this.registerListeners()
  }

  focus() {
    this.searchEl.focus()
    this.searchEl.select()
  }

  find(value, options) {
    if (!value) return
    this.app.findInPage(value, options)
  }

  stop() {
    this.app.stopFindInPage("clearSelection")
    this.labelEl.innerText = ""
  }

  updateMatches(result) {
    if (!this.searchEl.value.length) return
    if (!result) {
      this.labelEl.innerText = ""
    } else {
      this.labelEl.innerText =
        result.activeMatchOrdinal + " of " + result.matches
    }
  }

  toggle(event) {
    if (event && event.which === 114 && !this.findContainer.hidden) {
      // F3 should not close find box
      return
    }
    this.findContainer.hidden = !this.findContainer.hidden
    if (!this.findContainer.hidden) {
      this.focus()
      this.find(this.searchEl.value)
    }
  }

  registerListeners() {
    this.app.addEventListener("found-in-page", event => {
      if (event.result && !event.result.finalUpdate) {
        return
      }
      this.updateMatches(event.result)
    })

    window.addEventListener("keydown", event => {
      // F is 70, F3 is 114
      if ((event.which === 70 && event.ctrlKey) || event.which === 114) {
        if (!this.findContainer.hidden) {
          if (this.searchEl !== document.activeElement) {
            this.focus()
            return false
          }
        } else {
          document.activeElement.blur()
        }
        this.toggle(event)
        return false
      }
    })

    this.searchEl.addEventListener("input", event => {
      if (!this.searchEl.value.length) {
        this.stop()
        return
      }
      this.find(this.searchEl.value)
    })

    this.searchEl.addEventListener("keydown", event => {
      switch (event.which) {
        case 114: // F3
        case 13: // Enter
          this.find(this.searchEl.value, {
            findNext: true,
            forward: !event.shiftKey
          })
          break
        case 27: // Escape
          this.stop()
          this.toggle()
          break
      }
    })

    document.getElementById("down").addEventListener("click", event => {
      this.find(this.searchEl.value, {
        findNext: true,
        forward: true
      })
    })

    document.getElementById("up").addEventListener("click", event => {
      this.find(this.searchEl.value, {
        findNext: true,
        forward: false
      })
    })

    document.getElementById("close").addEventListener("click", event => {
      this.stop()
      this.toggle()
    })
  }
}

module.exports = {
  Find
}
