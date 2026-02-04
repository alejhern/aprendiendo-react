import { Form } from 'react-bootstrap'
import { LANGUAGES, DEFAULT_SOURCE_LANGUAGE, type LangSelectType } from '../const.ts'
import { type Language, type fromLanguage } from '../types'
 
type Props =
  | { type: LangSelectType.SOURCE; onChange: (language: fromLanguage) => void }
  | { type: LangSelectType.TARGET; onChange: (language: Language) => void }

export function LangSelector ({ type, onChange }: Props) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value

    if (type === 'source') {
      onChange(value as fromLanguage)
    } else {
      onChange(value as Language)
    }
  }

  return (
    <Form.Select onChange={handleChange} className="w-100">
      {type === 'source' && (
        <option value={DEFAULT_SOURCE_LANGUAGE}>Detect Language</option>
      )}
      {Object.entries(LANGUAGES).map(([code, name]) => (
        <option key={code} value={code}>
          {name}
        </option>
      ))}
    </Form.Select>
  )
}
