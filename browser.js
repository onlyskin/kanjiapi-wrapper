"use strict"

var { Kanjiapi } = require("./dist/kanjiapi-wrapper.js")
if (typeof module !== "undefined") module["exports"] = { Kanjiapi }
else window.Kanjiapi = Kanjiapi
