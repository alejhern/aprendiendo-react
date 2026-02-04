import { Cart } from './Cart'
import { Filters } from './Filters'
import './styles/Header.css'
export function Header () {
  return (
    <header>
      <Cart />
      <h1> REACT SHOPPING CART 🛒</h1>
      <Filters />
    </header>
  )
}