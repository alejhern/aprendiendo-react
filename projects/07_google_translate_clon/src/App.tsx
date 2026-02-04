import 'bootstrap/dist/css/bootstrap.min.css'
import { Container, Row, Col, Card, Button } from 'react-bootstrap'
import { ArrowLeftRight } from 'react-bootstrap-icons'
import { useStore } from './hooks/useStore'
import { LangSelectType } from './const.ts'
import { useEffect } from 'react'
import { LangSelector } from './components/LangSelector'
import { TextArea } from './components/TextArea'
import { translate } from './services/translate_with_deepl.ts'
import { useDebounce } from './hooks/useDebouence.ts'

export function App() {
  const {
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
    shouldTranslate
  } = useStore()

  const debouncedTextToTranslate = useDebounce(textToTranslate, 500)

  useEffect(() => {
    if (debouncedTextToTranslate === '' || !shouldTranslate) return
    translate(debouncedTextToTranslate, sourceLanguage, targetLanguage)
      .then( (translated: string) => {
        if (!translated) return
        setTranslatedText(translated)
      })
      .catch(() => {
        setTranslatedText('Error translating text')
      })

  }, [debouncedTextToTranslate, sourceLanguage, targetLanguage, shouldTranslate])

  return (
    <Container fluid className="bg-light min-vh-100 py-5">
      <Row className="justify-content-center">
        <Col xs={12} lg={10} xl={8}>
          <Card className="shadow-sm border-0">
            <Card.Body className="p-4">
              <h1 className="text-center mb-4 fw-normal">
                Google Translate Clone
              </h1>

              <Row className="g-3 align-items-stretch">
                {/* SOURCE */}
                <Col md={5}>
                  <Card className="h-100 border-0 shadow-sm">
                    <Card.Body>
                      <LangSelector
                        type={LangSelectType.SOURCE}
                        onChange={setSourceLanguage}
                      />
                      <TextArea
                        type={LangSelectType.SOURCE}
                        lang={sourceLanguage === 'auto' ? 'en' : sourceLanguage}
                        value={textToTranslate}
                        onChange={setTextToTranslate}
                        placeholder="Enter text to translate"
                      />
                    </Card.Body>
                  </Card>
                </Col>

                {/* SWITCH */}
                <Col
                  md={2}
                  className="d-flex align-items-center justify-content-center"
                >
                  <Button
                    variant="light"
                    className="rounded-circle shadow-sm"
                    onClick={() => swapLanguages()}
                  >
                    <ArrowLeftRight size={20} />
                  </Button>
                </Col>

                {/* TARGET */}
                <Col md={5}>
                  <Card className="h-100 border-0 shadow-sm bg-white">
                    <Card.Body>
                      <LangSelector
                        type={LangSelectType.TARGET}
                        onChange={setTargetLanguage}
                      />
                      <TextArea
                        type={LangSelectType.TARGET}
                        value={translatedText}
                        lang={targetLanguage}
                        onChange={() => {}}
                        placeholder="Translation will appear here"
                        loading={loading}
                      />
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}
