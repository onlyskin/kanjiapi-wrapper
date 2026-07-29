export as namespace Kanjiapi

export interface IKanji {
  kanji: string;
  grade: number | null;
  stroke_count: number;
  meanings: string[];
  kun_readings: string[];
  on_readings: string[];
  name_readings: string[];
  jlpt: number | null;
  unicode: string;
  heisig_en: string | null;
  freq_mainichi_shinbun: number | null;
  notes: string[];
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
  value: T;
}

export interface ApiWrapper {
  addListener(name: string, listener: () => any): void;
  removeListener(name: string): void;
  getKanji(kanji: string): IResult<IKanji>;
  getReading(reading: string): IResult<IReading>;
  getJoyoSet(): IResult<Set<String>>;
  getJinmeiyoSet(): IResult<Set<String>>;
  getHeisigSet(): IResult<Set<String>>;
  getAllSet(): IResult<Set<String>>;
  getKyoikuSet(): IResult<Set<String>>;
  getListForGrade(grade: number): IResult<Set<String>>;
  getListForJlpt(level: number): IResult<Set<String>>;
  getJoyoEnriched(): IResult<IKanji[]>;
  getJinmeiyoEnriched(): IResult<IKanji[]>;
  getHeisigEnriched(): IResult<IKanji[]>;
  getAllEnriched(): IResult<IKanji[]>;
  getKyoikuEnriched(): IResult<IKanji[]>;
  getListForGradeEnriched(grade: number): IResult<IKanji[]>;
  getListForJlptEnriched(level: number): IResult<IKanji[]>;
  getWordsForKanji(kanji: string): IResult<IWord[]>;
  getUrl(url: string): IResult<IKanji|IReading|Set<String>|IKanji[]|IWord[]>;
}

export namespace Kanjiapi {
    export function build(apiUrl?: string): ApiWrapper;
    export const ERROR: string
    export const SUCCESS: string
    export const LOADING: string
}

export enum Result {
    ERROR = 'ERROR',
    LOADING = 'LOADING',
    SUCCESS = 'SUCCESS',
}
