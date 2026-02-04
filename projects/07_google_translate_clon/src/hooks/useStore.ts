import { useReducer, useState } from 'react'
import { type State, type Action, type Language, type fromLanguage } from '../types.d'

const initialState: State = {
  sourceLanguage: 'auto',
  targetLanguage: 'en',
  textToTranslate: '',
  translatedText: '',
  loading: false,
};

function reducer (state: State, action: Action) {
  const { type, payload } = action

  if (type === 'SET_SOURCE_LANGUAGE') {
    const loading = state.textToTranslate ? true : false
    return { ...state, sourceLanguage: payload, loading }
  }

  if (type === 'SET_TARGET_LANGUAGE') {
    const loading = state.textToTranslate ? true : false
    return { ...state, targetLanguage: payload, loading }
  }

  if (type === 'SET_TEXT_TO_TRANSLATE') {
    return { ...state, loading:true, textToTranslate: payload }
  }

  if (type === 'SET_TRANSLATED_TEXT') {
    return { ...state, loading:false, translatedText: payload }
  }

  if (type === 'SWAP_LANGUAGES') {
    return {
      ...state,
      sourceLanguage: state.targetLanguage,
      targetLanguage: state.sourceLanguage,
      textToTranslate: state.translatedText,
      translatedText: state.textToTranslate
    }
  }

  return state
}

export function useStore () {
  const [{
    sourceLanguage,
    targetLanguage,
    textToTranslate,
    translatedText,
    loading
  }, dispatch] = useReducer(reducer as React.Reducer<State, Action>, initialState)
  const [ shouldTranslate, setShouldTranslate ] = useState(true)

  const swapLanguages = () => {
    dispatch({ type: 'SWAP_LANGUAGES'})
    setShouldTranslate(false)
  }
  const setSourceLanguage = (language: fromLanguage) => {
    dispatch({ type: 'SET_SOURCE_LANGUAGE', payload: language })
    setShouldTranslate(true)
  }
  const setTargetLanguage = (language: Language) => {
    dispatch({ type: 'SET_TARGET_LANGUAGE', payload: language })
    setShouldTranslate(true)
  }
  const setTextToTranslate = (text: string) => {
    dispatch({ type: 'SET_TEXT_TO_TRANSLATE', payload: text })
    setShouldTranslate(true)
  }
  const setTranslatedText = (text: string) => {
    dispatch({ type: 'SET_TRANSLATED_TEXT', payload: text })
  }

  return { 
    sourceLanguage,
    targetLanguage,
    textToTranslate,
    translatedText,
    loading,
    swapLanguages,
    setSourceLanguage,
    setTargetLanguage,
    setTextToTranslate,
    setTranslatedText,
    shouldTranslate,
    dispatch
  }
}