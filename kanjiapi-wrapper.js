const { ApiWrapper, ERROR, SUCCESS, LOADING } = require('./api_wrapper')

const API_URL = 'https://kanjiapi.dev'

Kanjiapi = {
    build: (api_url = API_URL) => new ApiWrapper(window.fetch.bind(window), api_url),
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
