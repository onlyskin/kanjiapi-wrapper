const { ApiWrapper } = require('./src/api_wrapper')

const API_URL = 'https://kanjiapi.dev'

Kanjiapi = {
    build: (notify) => new ApiWrapper(window.fetch.bind(window), API_URL, notify),
}

module.exports = {
    Kanjiapi,
}
