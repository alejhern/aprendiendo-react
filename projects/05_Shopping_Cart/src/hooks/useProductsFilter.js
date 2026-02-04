import { useContext, useMemo } from 'react'
import { FiltersContext } from '../context/Filters'

export function useProductsFilter({ products }) {
  const { filters } = useContext(FiltersContext)

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      return (
        (filters.category === 'all' ||
          product.category === filters.category) &&
        product.price >= filters.minPrice
      )
    })
  }, [products, filters])

  return { products: filteredProducts }
}
