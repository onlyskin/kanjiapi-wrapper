const ERROR = 'ERROR'
const SUCCESS = 'SUCCESS'
const LOADING = 'LOADING'
const KANJI_PATH = 'kanji'
const READING_PATH = 'reading'
const WORDS_PATH = 'words'
const API_VERSION = 'v1'

class ApiWrapper {
    constructor(fetch, apiUrl, notify = () => {}) {
        this._fetch = fetch
        this._apiUrl = apiUrl
        this._notify = notify

        this._cache = new Map()
        this._pending = new Set()
    }

    async _apiFetch(path) {
        this._pending.add(path)

        const response = await this._fetch(
            `${this._apiUrl}/${API_VERSION}${path}`);

        this._cache = this._cache.set(
            path,
            {
                status: response.status === 200 ? SUCCESS : ERROR,
                value: response.status === 200 ?
                await response.json() :
                response.status,
            },
        )

        this._notify()
    }

    _fromCache(path) {
        if (this._cache.has(path)) {
            return this._cache.get(path)
        }

        if (!this._pending.has(path)) {
            this._apiFetch(path)
        }

        return {
            status: LOADING,
            value: null,
        }
    }

    getKanji(kanji) {
        return this._fromCache(`/${KANJI_PATH}/${kanji}`)
    }

    getReading(reading) {
        return this._fromCache(`/${READING_PATH}/${reading}`)
    }

    getJoyoList() {
        return this._fromCache(`/${KANJI_PATH}/joyo`)
    }

    getJinmeiyoList() {
        return this._fromCache(`/${KANJI_PATH}/jinmeiyo`)
    }

    getListForGrade(grade) {
        return this._fromCache(`/${KANJI_PATH}/grade-${grade}`)
    }

    getWordsForKanji(kanji) {
        return this._fromCache(`/${WORDS_PATH}/${kanji}`)
    }
}

module.exports = {
    ApiWrapper,
}
