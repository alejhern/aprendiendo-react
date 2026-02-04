const addToCar = (state, action) => {
  const productInCartIndex = state.findIndex(item => item.id === action.payload.id)
  if (productInCartIndex >= 0) {
    const newCart = structuredClone(state)
    newCart[productInCartIndex].quantity += 1
    return newCart
  } 
  return [...state, { ...action.payload, quantity: 1 }]
}

const removeFromCar = (state, action) => {
  const productInCartIndex = state.findIndex(item => item.id === action.payload)
  if (productInCartIndex >= 0) {
    const newCart = structuredClone(state)
    const productInCart = newCart[productInCartIndex]
    if (productInCart.quantity > 1) {
      productInCart.quantity -= 1
      return newCart
    } 
    newCart.splice(productInCartIndex, 1)
    return newCart
  }
  return state
}

const removeItemFromCart = (state, action) => {
  return state.filter(item => item.id !== action.payload)
}

const clearCart = () => {
  return []
}

export const CartProviderReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      return addToCar(state, action)
    }
    case 'REMOVE_FROM_CART': {
      return removeFromCar(state, action)
    }
    case 'REMOVE_ITEM_FROM_CART': {
      return removeItemFromCart(state, action)
    }
    case 'CLEAR_CART': {
      return clearCart()
    }
    default:
      return state
  }
}