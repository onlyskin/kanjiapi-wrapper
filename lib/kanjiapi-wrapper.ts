import { ApiWrapper, Result } from './api_wrapper'

const API_URL = 'https://kanjiapi.dev'

export const Kanjiapi = {
    build: () => new ApiWrapper(window.fetch.bind(window), API_URL),
    Result: Result,
}
