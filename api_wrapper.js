const ERROR = 'ERROR'
const SUCCESS = 'SUCCESS'
const LOADING = 'LOADING'
const KANJI_PATH = 'kanji'
const READING_PATH = 'reading'
const WORDS_PATH = 'words'
const ENRICHED_SUFFIX = '-enriched'
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
        return this._fromCache(`/${KANJI_PATH}/joyo`, this._asSet)
    }

    getJinmeiyoSet() {
        return this._fromCache(`/${KANJI_PATH}/jinmeiyo`, this._asSet)
    }

    getHeisigSet() {
        return this._fromCache(`/${KANJI_PATH}/heisig`, this._asSet)
    }

    getAllSet() {
        return this._fromCache(`/${KANJI_PATH}/all`, this._asSet)
    }

    getKyoikuSet() {
        return this._fromCache(`/${KANJI_PATH}/kyoiku`, this._asSet)
    }

    getListForGrade(grade) {
        return this._fromCache(`/${KANJI_PATH}/grade-${grade}`, this._asSet)
    }

    getListForJlpt(level) {
        return this._fromCache(`/${KANJI_PATH}/jlpt-${level}`, this._asSet)
    }

    getJoyoEnriched() {
        return this._fromCache(`/${KANJI_PATH}/joyo${ENRICHED_SUFFIX}`)
    }

    getJinmeiyoEnriched() {
        return this._fromCache(`/${KANJI_PATH}/jinmeiyo${ENRICHED_SUFFIX}`)
    }

    getHeisigEnriched() {
        return this._fromCache(`/${KANJI_PATH}/heisig${ENRICHED_SUFFIX}`)
    }

    getAllEnriched() {
        return this._fromCache(`/${KANJI_PATH}/all${ENRICHED_SUFFIX}`)
    }

    getKyoikuEnriched() {
        return this._fromCache(`/${KANJI_PATH}/kyoiku${ENRICHED_SUFFIX}`)
    }

    getListForGradeEnriched(grade) {
        return this._fromCache(
            `/${KANJI_PATH}/grade-${grade}${ENRICHED_SUFFIX}`)
    }

    getListForJlptEnriched(level) {
        return this._fromCache(
            `/${KANJI_PATH}/jlpt-${level}${ENRICHED_SUFFIX}`)
    }

    getWordsForKanji(kanji) {
        return this._fromCache(`/${WORDS_PATH}/${kanji}`)
    }

    getUrl(url) {
        return this._fromCache(url)
    }

    _fromCache(path, transform) {
        if (this._cache.has(path)) {
            return this._cache.get(path)
        }

        if (!this._pending.has(path)) {
            this._apiFetch(path, transform)
        }

        return {
            status: LOADING,
            value: null,
        }
    }

    async _apiFetch(path, transform) {
        if (transform === undefined) {
          transform = a => a;
        }

        this._pending.add(path)

        const response = await this._fetch(
            `${this._apiUrl}/${API_VERSION}${path}`);

        this._cache = this._cache.set(
            path,
            transform({
                status: response.status === 200 ? SUCCESS : ERROR,
                value: response.status === 200 ?
                await response.json() :
                response.status,
            }),
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
