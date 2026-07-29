var { Kanjiapi } = require("./kanjiapi-wrapper.js")

module["exports"] = { Kanjiapi }

// Browserify always defines `module` inside the bundle, so the global has to be
// assigned unconditionally rather than as a fallback for `module` being absent.
if (typeof window !== "undefined") window.Kanjiapi = Kanjiapi
