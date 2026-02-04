import './styles/Cart.css'
import { useCart } from '../hooks/useCart'

function CartItem({ item, onAdd, onRemove }) {
  return (
    <li key={item.id} className="cart-item">
      <img src={item.thumbnail} alt={item.title} />
      <div className="cart-item-info">
        <strong>{item.title}</strong>
        <span>${item.price}</span>
      </div>
      <div className="cart-item-actions">
        <button onClick={() => onRemove(item.id)}>-</button>
        <span>{item.quantity}</span>
        <button onClick={() => onAdd(item)}>+</button>
      </div>
    </li>
  )
}

export function Cart () {
  const { cart, addToCart, removeFromCart, clearCart } = useCart()
  
  return (
    <div className="cart-wrapper">
    {/* checkbox oculto */}
    <input type="checkbox" id="cart-toggle" className="cart-toggle" />

    {/* botón que actúa como label */}
    <label htmlFor="cart-toggle" className="cart-button">
      🛒 Cart
    </label>

    {/* overlay */}
    <div className="cart-overlay"></div>

    {/* carrito */}
    <aside className="cart">
      <header className="cart-header">
        <h3>Your Cart</h3>
        <label htmlFor="cart-toggle" className="cart-close">×</label>
      </header>

      <ul className="cart-items">
        {cart.map(item => (
          <CartItem 
            key={item.id} 
            item={item} 
            onAdd={addToCart} 
            onRemove={removeFromCart} 
          />
        ))}
      </ul>

      <footer className="cart-footer">
        <div className="cart-total">
          <span>Total</span>
          <span>${cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}</span>
        </div>
        <div className="cart-actions">
          <button className="cart-checkout">Checkout</button>
          <button onClick={clearCart}>Clear</button>
        </div>
      </footer>
    </aside>
  </div>
  )
}
