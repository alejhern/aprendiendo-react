// Translator.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi, test, expect } from 'vitest'
import { TextArea } from './components/TextArea'
import { LangSelectType } from './const'
import { LangSelector } from './components/LangSelector'

test('TextArea displays the text correctly', () => {
  render(
    <TextArea
      type={LangSelectType.SOURCE}
      value="Hello world"
      onChange={() => {}}
      lang="en"
    />
  )

  const textarea = screen.getByRole('textbox') as HTMLTextAreaElement
  expect(textarea).toHaveValue('Hello world')
})

test('TextArea displays the placeholder correctly', () => {
  render(
    <TextArea
      type={LangSelectType.SOURCE}
      value=""
      onChange={() => {}}
      placeholder="Type here"
      lang="en"
    />
  )

  expect(screen.getByPlaceholderText('Type here')).toBeInTheDocument()
})

test('TextArea shows loading state correctly', () => {
  render(
    <TextArea
      type={LangSelectType.TARGET}
      value=""
      onChange={() => {}}
      loading={true}
      lang="en"
    />
  )

  expect(screen.getByText('Translating...')).toBeInTheDocument()
})

test('TextArea calls onChange when text is modified', async () => {
  const handleChange = vi.fn()
  render(
    <TextArea
      type={LangSelectType.SOURCE}
      value=""
      onChange={handleChange}
      lang="en"
    />
  )

  const textarea = screen.getByRole('textbox') as HTMLTextAreaElement
  await userEvent.type(textarea, 'New text')

  // Reconstruir texto acumulado de todos los llamados
  const finalText = handleChange.mock.calls.join('')
  expect(finalText).toContain('New text')
})

test('TextArea copies to clipboard when the copy button is clicked', async () => {
  const writeTextMock = vi.fn()
  Object.defineProperty(navigator, 'clipboard', {
    value: { writeText: writeTextMock },
    writable: true,
  })

  render(
    <TextArea
      type={LangSelectType.SOURCE}
      value="Text to copy"
      onChange={() => {}}
      lang="en"
    />
  )

  const copyButton = screen.getByRole('button', { name: /Copy to clipboard/i })
  await userEvent.click(copyButton)

  expect(writeTextMock).toHaveBeenCalledWith('Text to copy')
})

test('TextArea uses SpeechSynthesis when the speak button is clicked', async () => {
  // Use a regular function so it can be used as a constructor
  global.SpeechSynthesisUtterance = vi.fn().mockImplementation(function (text) {
    this.text = text;
    this.lang = '';
    this.onend = vi.fn(); // Useful if your code listens for the end of speech
  })

  const speakMock = vi.fn()
  Object.defineProperty(window, 'speechSynthesis', {
    value: { speak: speakMock, getVoices: vi.fn().mockReturnValue([]) },
    writable: true,
  })

  render(
    <TextArea
      type={LangSelectType.SOURCE}
      value="Text to speak"
      onChange={() => {}}
      lang="en"
    />
  )

  const speakButton = screen.getByRole('button', { name: /speak/i })
  await userEvent.click(speakButton)

  expect(speakMock).toHaveBeenCalled()
  
  // The first argument of the first call is the utterance object
  const utterance = speakMock.mock.calls[0][0]
  expect(utterance.text).toBe('Text to speak')
})

test('LangSelector calls onChange with the correct language code', async () => {
  const handleChange = vi.fn()
  render(<LangSelector type={LangSelectType.SOURCE} onChange={handleChange} />)

  const select = screen.getByRole('combobox') as HTMLSelectElement
  await userEvent.selectOptions(select, 'es')

  expect(handleChange).toHaveBeenCalledWith('es')
})

test('LangSelector includes "Detect Language" option for source type', () => {
  render(<LangSelector type={LangSelectType.SOURCE} onChange={() => {}} />)

  const detectOption = screen.getByRole('option', { name: /detect language/i })
  expect(detectOption).toBeInTheDocument()
})

test('LangSelector does not include "Detect Language" option for target type', () => {
  render(<LangSelector type={LangSelectType.TARGET} onChange={() => {}} />)

  const detectOption = screen.queryByRole('option', { name: /detect language/i })
  expect(detectOption).not.toBeInTheDocument()
})
