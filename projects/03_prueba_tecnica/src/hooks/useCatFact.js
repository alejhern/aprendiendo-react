import { useState, useEffect } from 'react'
import { getRandomCatFact } from '../services/facts.js'

export const useCatFact = () => {
  const [fact, setFact] = useState(null)
  const refreshFact = () => {
    getRandomCatFact().then(newFact => setFact(newFact)).catch(err => console.error(err))
  }
  useEffect(() => {
    refreshFact()
  }, [])
  return { fact, refreshFact }
}
