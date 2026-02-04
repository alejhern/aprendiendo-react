import './styles/Filters.css'
import { useId, useContext } from 'react'
import { FiltersContext } from '../context/Filters'

export function Filters() {
  const { filters, setFilters } =  useContext(FiltersContext)
  const minPriceId = useId()
  const categoryId = useId()


  const handleOnChangeMinPrice = (e) => {
    setFilters({
      ...filters,
      minPrice: Number(e.target.value)
    })
  }

  const handleOnChangeCategory = (e) => {
    setFilters({
      ...filters,
      category: e.target.value
    })
  }

  return (
    <section className="filters">
      <h3>Filters</h3>

      {/* Precio */}
      <div className="filter-group">
        <label htmlFor={minPriceId}>
          Min price: <span>${filters.minPrice}</span>
        </label>
        <input
          id={minPriceId}
          type="range"
          min="0"
          max="2000"
          step="50"
          value={filters.minPrice}
          onChange={handleOnChangeMinPrice}
        />
      </div>

      {/* Categorías */}
      <div className="filter-group">
        <label htmlFor={categoryId}>Category</label>
        <select
          id={categoryId}
          value={filters.category}
          onChange={handleOnChangeCategory}
        >
          <option value="all">All</option>
          <option value="smartphones">Smartphones</option>
          <option value="laptops">Laptops</option>
          <option value="fragrances">Fragrances</option>
          <option value="skincare">Skincare</option>
          <option value="groceries">Groceries</option>
          <option value="home-decoration">Home Decoration</option>
        </select>
      </div>
    </section>
  )
}
