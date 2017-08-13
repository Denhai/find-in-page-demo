let { Find } = require('./find')

let app = document.getElementById("app"); // a webview to search
let findContainer = document.getElementById("find-container"); // replaced with the find box

let find = new Find(app, findContainer)
