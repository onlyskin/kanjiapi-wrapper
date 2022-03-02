const { ApiWrapper, ERROR, SUCCESS, LOADING } = require('./api_wrapper')

const API_URL = 'https://kanjiapi.dev'

Kanjiapi = {
    build: () => new ApiWrapper(window.fetch.bind(window), API_URL),
    ERROR,
    SUCCESS,
    LOADING,
}

module.exports = {
    Kanjiapi,
    Result: {
        ERROR,
        SUCCESS,
        LOADING,
    },
}
