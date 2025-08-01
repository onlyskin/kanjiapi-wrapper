const ERROR = 'ERROR'
const SUCCESS = 'SUCCESS'
const LOADING = 'LOADING'
const KANJI_PATH = 'kanji'
const READING_PATH = 'reading'
const WORDS_PATH = 'words'
const API_VERSION = 'v1'

class ApiWrapper {
    constructor(fetch, apiUrl) {
        this._fetch = fetch
        this._apiUrl = apiUrl
        this._listeners = new Map()

        this._cache = new Map()
        this._pending = new Set()
    }

    addListener(name, listener) {
        this._listeners.set(name, listener)
    }

    removeListener(name) {
        this._listeners.delete(name)
    }

    getKanji(kanji) {
        return this._fromCache(`/${KANJI_PATH}/${kanji}`)
    }

    getReading(reading) {
        return this._fromCache(`/${READING_PATH}/${reading}`)
    }

    getJoyoSet() {
        return this._asSet(this._fromCache(`/${KANJI_PATH}/joyo`))
    }

    getJinmeiyoSet() {
        return this._asSet(this._fromCache(`/${KANJI_PATH}/jinmeiyo`))
    }

    getHeisigSet() {
        return this._asSet(this._fromCache(`/${KANJI_PATH}/heisig`))
    }

    getAllSet() {
        return this._asSet(this._fromCache(`/${KANJI_PATH}/all`))
    }

    getKyoikuSet() {
        return this._asSet(this._fromCache(`/${KANJI_PATH}/kyoiku`))
    }

    getListForGrade(grade) {
        return this._asSet(this._fromCache(`/${KANJI_PATH}/grade-${grade}`))
    }

    getListForJlpt(level) {
        return this._asSet(this._fromCache(`/${KANJI_PATH}/jlpt-${level}`))
    }

    getWordsForKanji(kanji) {
        return this._fromCache(`/${WORDS_PATH}/${kanji}`)
    }

    getUrl(url) {
        return this._fromCache(url)
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

        for (const listener of this._listeners.values()) {
            listener()
        }
    }

    _asSet(result) {
        if (result.status === SUCCESS) {
            return {
                status: result.status,
                value: new Set(result.value),
            }
        } else {
            return result
        }
    }
}

module.exports = {
    ApiWrapper,
    ERROR,
    SUCCESS,
    LOADING,
}
