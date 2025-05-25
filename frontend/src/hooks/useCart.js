import { useMemo } from 'react';
import { useApp } from '../context/AppContext';

export function useCart() {
  const { state, dispatch } = useApp();

  // Group cart items by stall
  const groupedCart = useMemo(() => {
    return state.cart.reduce((groups, item) => {
      const stallName = item.stall?.name || 'Unknown Stall';
      
      if (!groups[stallName]) {
        groups[stallName] = [];
      }
      groups[stallName].push(item);
      return groups;
    }, {});
  }, [state.cart]);

  // Calculate totals
  const calculations = useMemo(() => {
    const subtotal = state.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const serviceFee = 1.50;
    const total = subtotal + serviceFee;
    const totalCalories = state.cart.reduce((total, item) => {
      const calories = item.calories || 0;
      return total + (calories * item.quantity);
    }, 0);
    const itemCount = state.cart.reduce((total, item) => total + item.quantity, 0);

    return {
      subtotal,
      serviceFee,
      total,
      totalCalories,
      itemCount
    };
  }, [state.cart]);

  // Cart actions
  const addToCart = (item) => {
    dispatch({ type: 'ADD_TO_CART', payload: item });
  };

  const removeFromCart = (itemId) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: itemId });
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(itemId);
    } else {
      dispatch({ type: 'UPDATE_CART_QUANTITY', payload: { id: itemId, quantity: newQuantity } });
    }
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getItemQuantity = (itemId) => {
    const cartItem = state.cart.find(item => item.id === itemId);
    return cartItem ? cartItem.quantity : 0;
  };

  return {
    // State
    cart: state.cart,
    groupedCart,
    calculations,
    cartAnimation: state.cartAnimation,
    
    // Actions
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getItemQuantity,
    
    // Utilities
    isEmpty: state.cart.length === 0,
    hasItems: state.cart.length > 0
  };
} 