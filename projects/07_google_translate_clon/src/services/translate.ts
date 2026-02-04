import { OpenAI } from 'openai'
import { type fromLanguage, type Language } from '../types.d'
import { LANGUAGES } from '../const'

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_TRANSLATE_API_KEY,
  dangerouslyAllowBrowser: true, // Note: Be cautious when using this in a production environment
  maxRetries: 0
})

export async function translate (
  text: string,
  sourceLang: fromLanguage,
  targetLang: Language
){
  if (!import.meta.env.VITE_TRANSLATE_API_KEY) {
    throw new Error('No API key provided')
  }
  if (sourceLang === targetLang) return text
  
  const response = await openai.chat.completions.create({
    model: 'gpt-4.1-mini',
    messages: [
      {
        role: 'user',
        content: `Translate the following text from ${
          sourceLang === 'auto' ? 'any language' : LANGUAGES[sourceLang]
        } to ${LANGUAGES[targetLang]}:\n\n${text}`
      }
    ],
    temperature: 0.3,
    max_tokens: 1000
  })

  const translatedText = response.choices[0].message?.content?.trim()
  if (!translatedText) {
    throw new Error('No translation found in the response')
  }
  return translatedText
}