import { type fromLanguage, type Language } from '../types.d'

export async function translate (
  text: string,
  sourceLang: fromLanguage,
  targetLang: Language
){
  if (sourceLang === targetLang) return text
  if (!import.meta.env.VITE_TRANSLATE_DEEPL_API_KEY) {
      throw new Error('No DeepL API key provided')
  }
  const res = await fetch('/deepl/v2/translate', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `DeepL-Auth-Key ${import.meta.env.VITE_TRANSLATE_DEEPL_API_KEY}`
    },
    body: new URLSearchParams({
        text,
        target_lang: targetLang.toUpperCase(),
        ...(sourceLang !== 'auto' ? { source_lang: sourceLang.toUpperCase() } : {})
    })
  })

  const data = await res.json()
  return data.translations[0].text
}