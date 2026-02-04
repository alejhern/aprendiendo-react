
import './App.css'
import { Searcher } from './components/Searcher'
import { MoviesGrid } from './components/MoviesGrid'
import { useSearchMovies } from './hooks/useSearchMovies'
//import { useRef } from 'react'

function App() {
  const { movies, handleSubmit, handlerSort, handlerSearchChange } = useSearchMovies()
  //const inputRef = useRef(null)

  return (
    <>
      <header>
        <Searcher handleSubmit={handleSubmit} sort={handlerSort} handlerSearchChange={handlerSearchChange} />
      </header>
      <MoviesGrid movies={movies} />
    </>
  )
}

export default App
