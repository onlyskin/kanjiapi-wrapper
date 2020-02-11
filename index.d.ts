export as namespace Kanjiapi

export enum Result {
    ERROR = 'ERROR',
    LOADING = 'LOADING',
    SUCCESS = 'SUCCESS',
}

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
  value: T;
}

export interface ApiWrapper {
  addListener(name: string, listener: () => any): void;
  removeListener(name: string): void;
  getKanji(kanji: string): IResult<IKanji>;
  getReading(reading: string): IResult<IReading>;
  getJoyoSet(): IResult<Set<String>>;
  getJinmeiyoSet(): IResult<Set<String>>;
  getListForGrade(grade: number): IResult<Set<String>>;
  getWordsForKanji(kanji: string): IResult<List<IWord>>;
  getUrl(url: string): IResult<IKanji|IReading|Set<String>|List<IWord>>;
}

export namespace Kanjiapi {
    export function build(): ApiWrapper;
    export const ERROR: string
    export const SUCCESS: string
    export const LOADING: string
}
