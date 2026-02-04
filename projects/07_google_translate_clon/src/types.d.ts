import { type LANGUAGES, type DEFAULT_SOURCE_LANGUAGE } from './const.ts'

export type Language = keyof typeof LANGUAGES;
export type AutoLanguage = typeof DEFAULT_SOURCE_LANGUAGE;
export type fromLanguage = Language | AutoLanguage;

export interface State {
  sourceLanguage: fromLanguage;
  targetLanguage: Language;
  textToTranslate: string;
  translatedText: string;
  loading: boolean;
}

export type Action =
  | { type: 'SET_SOURCE_LANGUAGE'; payload: fromLanguage }
  | { type: 'SET_TARGET_LANGUAGE'; payload: Language }
  | { type: 'SET_TEXT_TO_TRANSLATE'; payload: string }
  | { type: 'SET_TRANSLATED_TEXT'; payload: string }
  | { type: 'SWAP_LANGUAGES'; payload?: undefined };