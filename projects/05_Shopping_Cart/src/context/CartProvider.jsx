import { CartContext } from "./Cart"
import { useEffect, useReducer } from "react"
import { CartProviderReducer } from "./reducers/cart.js"

const initialState = []

function useCartReducer() {
  const [ state, dispatch ] = useReducer(CartProviderReducer, (() => {
    const localStorageCart = window.localStorage.getItem('cart')
    return localStorageCart ? JSON.parse(localStorageCart) : initialState
  })())

  const addToCart = product => dispatch({
    type: 'ADD_TO_CART',
    payload: product
  })
  const removeFromCart = productId => dispatch({
    type: 'REMOVE_FROM_CART',
    payload: productId
  })
  const clearCart = () => dispatch({
    type: 'CLEAR_CART'
  })
  const removeItemFromCart = product => dispatch({
    type: 'REMOVE_ITEM_FROM_CART',
    payload: product
  })

  return { state, addToCart, removeFromCart, clearCart, removeItemFromCart }
}

export function CartProvider({ children }) {
  const { state, addToCart, removeFromCart, clearCart, removeItemFromCart } = useCartReducer()
  
  useEffect(() => {
    window.localStorage.setItem('cart', JSON.stringify(state))
  }, [state])

  return (
    <CartContext.Provider value={{
        cart: state,
        addToCart,
        removeFromCart,
        clearCart,
        removeItemFromCart 
      }}>
      {children}
    </CartContext.Provider>
  )
}