import { useCatFact } from './hooks/useCatFact.js'
import { useCatImage } from './hooks/useCatImage.js'
import './App.css'

export function App () {
  const { fact, refreshFact } = useCatFact()
  const { imageUrl } = useCatImage({ fact })

  const handlerClick = () => {
    refreshFact()
  }

  return (
    <main>
      <section>
        <h1>Proyecto de prueba técnica</h1>
      </section>
      <button onClick={handlerClick}>New Fact</button>
      <section>
        <p>{fact}</p>
        {imageUrl && <img src={imageUrl} alt={`Image of a cat saying the fact ${fact}`} />}
      </section>
    </main>
  )
}
