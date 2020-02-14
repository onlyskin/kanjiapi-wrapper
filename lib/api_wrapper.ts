export interface IKanji {
  kanji: string;
  grade: number;
  stroke_count: number;
  meanings: string[];
  kun_readings: string[];
  on_readings: string[];
  name_readings: string[];
  jlpt: number;
  unicode: string;
  heisig_en: string;
}

export interface IReading {
  reading: string;
  main_kanji: string[];
  name_kanji: string[];
}

export interface IWord {
  meanings: IMeaning[];
  variants: IVariant[];
}

export interface IMeaning {
  glosses: string[];
}

export interface IVariant {
  written: string;
  pronounced: string;
  priorities: string[];
}

export interface IResult<T> {
  status: Result;
  value: T | null | ErrorCode;
}

export type IApiResponse = IKanji | IReading | Set<string> | string[] | IWord[] | null;

export type ErrorCode = number;

export enum Result {
    ERROR = 'ERROR',
    LOADING = 'LOADING',
    SUCCESS = 'SUCCESS',
}

const KANJI_PATH = 'kanji'
const READING_PATH = 'reading'
const WORDS_PATH = 'words'
const API_VERSION = 'v1'

export class ApiWrapper {
    private _fetch: any
    private _apiUrl: string
    private _listeners: Map<string, () => any>
    private _cache: Map<string, IResult<IApiResponse>>
    private _pending: Set<string>

    constructor(fetch: any, apiUrl: string) {
        this._fetch = fetch
        this._apiUrl = apiUrl
        this._listeners = new Map<string, () => any>()
        this._cache = new Map<string, IResult<IApiResponse>>()
        this._pending = new Set<string>()
    }

    addListener(name: string, listener: () => any): void {
        this._listeners.set(name, listener)
    }

    removeListener(name: string): void {
        this._listeners.delete(name)
    }

    getKanji(kanji: string): IResult<IKanji> {
        return this._fromCache(`/${KANJI_PATH}/${kanji}`) as IResult<IKanji>
    }

    getReading(reading: string): IResult<IReading> {
        return this._fromCache(`/${READING_PATH}/${reading}`) as IResult<IReading>
    }

    getJoyoSet(): IResult<Set<string>> {
        return this._asSet(this._fromCache(`/${KANJI_PATH}/joyo`))
    }

    getJinmeiyoSet(): IResult<Set<string>> {
        return this._asSet(this._fromCache(`/${KANJI_PATH}/jinmeiyo`))
    }

    getListForGrade(grade: number): IResult<Set<string>> {
        return this._asSet(this._fromCache(`/${KANJI_PATH}/grade-${grade}`))
    }

    getWordsForKanji(kanji: string): IResult<IWord[]> {
        return this._fromCache(`/${WORDS_PATH}/${kanji}`) as IResult<IWord[]>
    }

    getUrl(url: string): IResult<IApiResponse> {
        return this._fromCache(url)
    }

    private _fromCache(path: string): IResult<IApiResponse> {
        if (this._cache.has(path)) {
            return this._cache.get(path)!
        }

        if (!this._pending.has(path)) {
            this._apiFetch(path)
        }

        return {
            status: Result.LOADING,
            value: null,
        }
    }

    private async _apiFetch(path: string): Promise<void> {
        this._pending.add(path)

        const response = await this._fetch(
            `${this._apiUrl}/${API_VERSION}${path}`);

        this._cache = this._cache.set(
            path,
            {
                status: response.status === 200 ? Result.SUCCESS : Result.ERROR,
                value: response.status === 200 ?
                await response.json() :
                response.status,
            },
        )

        for (const listener of this._listeners.values()) {
            listener()
        }
    }

    private _asSet(result: IResult<any>): IResult<Set<string>> {
        if (result.status === Result.SUCCESS) {
            return {
                status: result.status,
                value: new Set(result.value),
            }
        } else {
            return result
        }
    }
}
