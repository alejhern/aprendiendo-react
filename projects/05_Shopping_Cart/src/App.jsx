import { Header } from './components/Header'
import { Products } from './components/Products'
import { products as initialProducts } from './mocks/results.json'
import { useProductsFilter } from './hooks/useProductsFilter'
import { CartProvider } from './context/CartProvider'
import './App.css'

function App() {
  const { products } = useProductsFilter({ products: initialProducts })
  
  return (
    <>
      <CartProvider>
        <Header  />
        <Products products={products} />
      </CartProvider>
    </>
  )
}

export default App
