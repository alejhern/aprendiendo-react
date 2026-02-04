import { FiltersContext  } from './Filters'
import { useState } from 'react'

export function FiltersProvider({ children }) {
  const [filters, setFilters] = useState({
    minPrice: 0,
    category: 'all'
  })
  return (
    <FiltersContext.Provider value={{
        filters,
        setFilters
    }}>
      {children}
    </FiltersContext.Provider>
  )
}
