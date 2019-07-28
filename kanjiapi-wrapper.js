const { ApiWrapper, ERROR, SUCCESS, LOADING } = require('./api_wrapper')

const API_URL = 'https://kanjiapi.dev'

Kanjiapi = {
    build: (notify) => new ApiWrapper(window.fetch.bind(window), API_URL, notify),
    ERROR,
    SUCCESS,
    LOADING,
}

module.exports = {
    Kanjiapi,
}
