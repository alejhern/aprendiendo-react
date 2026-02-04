import { useState, useEffect, useMemo, useCallback } from 'react'
import { searchMovies } from '../services/movies.js'
import debounce from 'just-debounce-it'

export function useSearchMovies() {
  const [movies, setMovies] = useState(null)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState(false)

  // Toggle sort (estable, una sola vez)
  const handlerSort = useCallback(() => {
    setSort(prev => !prev)
  }, [])

  // Submit manual (form)
  const handleSubmit = useCallback((event) => {
    event.preventDefault()
    const fields = new window.FormData(event.target)
    const value = fields.get('search')

    if (!value) {
      alert('Please enter a movie name')
      return
    }

    setSearch(value)
  }, [])

  // Debounced search (VALOR memorizado, no callback)
  const changeSearch = useMemo(() => {
    return debounce((value) => {
      setSearch(value)
    }, 300)
  }, [])

  // Cleanup del debounce
  useEffect(() => {
    return () => {
      changeSearch.cancel()
    }
  }, [changeSearch])

  // Input change
  const handlerSearchChange = useCallback((event) => {
    const value = event.target.value

    if (!value) {
      setMovies(null)
      return
    }

    changeSearch(value)
  }, [changeSearch])

  // Fetch
  useEffect(() => {
    if (!search) return

    searchMovies({ search })
      .then(movies => {
        setMovies(movies || [])
      })
  }, [search])

  // Sorting
  const sortedMovies = useMemo(() => {
    if (!movies) return null

    return sort
      ? [...movies].sort((a, b) => a.title.localeCompare(b.title))
      : movies
  }, [sort, movies])

  return {
    movies: sortedMovies,
    handleSubmit,
    handlerSort,
    handlerSearchChange
  }
}
