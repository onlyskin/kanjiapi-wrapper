const { ApiWrapper } = require('./src/api_wrapper')

const API_URL = 'https://kanjiapi.dev'

const Kanjiapi = {
    build: (notify) => new ApiWrapper(window.fetch, API_URL, notify),
}

module.exports = {
    Kanjiapi
}
