import { Form, Spinner } from 'react-bootstrap'
import { LangSelectType } from '../const.ts'
import { Clipboard, Speaker } from 'react-bootstrap-icons'
import { type Language } from '../types.d'

type Props = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  type : LangSelectType
  loading?: boolean
  lang: Language
}

export function TextArea ({ type, value, onChange, placeholder, loading, lang }: Props) {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value)
  }
  const handlerClipboard = () => {
    navigator.clipboard.writeText(value).catch(() => {})
  }

  const handlerSpeak = () => {
    const utterance = new SpeechSynthesisUtterance(value)
    utterance.lang = lang
    speechSynthesis.speak(utterance)
  }

  if (loading && type === LangSelectType.TARGET) {
    return (
      <div className="d-flex align-items-center gap-2">
        <Spinner size="sm" />Translating...
      </div>
    )
  }

  return (
    <div className="position-relative">
      <button
        className="position-absolute bottom-0 end-0 m-2 btn btn-light btn-sm"
        aria-label="Copy to clipboard"
        type="button"
        onClick={handlerClipboard}
      >
        <Clipboard size={18} />
      </button>
      <button
        className="position-absolute bottom-0 end-5 m-2 btn btn-light btn-sm"
        aria-label="Speak text"
        type="button"
        onClick={handlerSpeak}
      >
        <Speaker size={18} />
      </button>

      <Form.Control
        as="textarea"
        rows={6}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        autoFocus={type === LangSelectType.SOURCE}
        disabled={type === LangSelectType.TARGET}
      />
    </div>
  )
}