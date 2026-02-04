import { AddToCartIcon, RemoveFromCartIcon } from './icons'
import { useCart } from '../hooks/useCart.js'
import './styles/Products.css'

export function Products({ products }) {
  const { cart, addToCart, removeItemFromCart } = useCart()

  const checkProductInCart = (productId) => {
    return cart.some(item => item.id === productId)
  }
  return (
    <main>
      <ul>
        {products.map(product => (
          <li key={product.id}>
            <img
                src={product.thumbnail}
                alt={product.title}
            />
            <div>
                <strong>{product.title}</strong>
            </div>
            <div>${product.price}</div>
            <div>
              {checkProductInCart(product.id) ? 
                <button className='removeItem' onClick={() => removeItemFromCart(product.id)}><RemoveFromCartIcon /> Remove</button> : 
                <button className='addItem' onClick={() => addToCart(product)}><AddToCartIcon /> Add to Cart</button>
              }
            </div>
          </li>
        ))}
        </ul>
    </main>
    )
}