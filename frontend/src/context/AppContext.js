import React, { createContext, useContext, useReducer, useEffect } from 'react';

const AppContext = createContext();

const initialState = {
  language: 'English',
  cart: [],
  orders: [],
  currentOrder: null,
  user: {
    name: 'John Doe',
    email: 'johndoe@email.com'
  }
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_LANGUAGE':
      return { ...state, language: action.payload };
    
    case 'ADD_TO_CART':
      const existingItem = state.cart.find(item => item.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        };
      }
      return {
        ...state,
        cart: [...state.cart, { ...action.payload, quantity: 1 }]
      };
    
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter(item => item.id !== action.payload)
      };
    
    case 'UPDATE_CART_QUANTITY':
      return {
        ...state,
        cart: state.cart.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      };
    
    case 'CLEAR_CART':
      return { ...state, cart: [] };
    
    case 'ADD_ORDER':
      const newOrder = {
        id: `#${Math.floor(Math.random() * 10000)}`,
        items: action.payload.items,
        total: action.payload.total,
        paymentMethod: action.payload.paymentMethod,
        status: 'Accepted',
        timestamp: new Date().toISOString(),
        estimatedTime: new Date(Date.now() + 15 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      return {
        ...state,
        orders: [newOrder, ...state.orders],
        currentOrder: newOrder,
        cart: []
      };
    
    case 'UPDATE_ORDER_STATUS':
      return {
        ...state,
        orders: state.orders.map(order =>
          order.id === action.payload.orderId
            ? { ...order, status: action.payload.status }
            : order
        )
      };
    
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Simulate order status updates
  useEffect(() => {
    const interval = setInterval(() => {
      state.orders.forEach(order => {
        if (order.status === 'Accepted') {
          setTimeout(() => {
            dispatch({
              type: 'UPDATE_ORDER_STATUS',
              payload: { orderId: order.id, status: 'Preparing' }
            });
          }, 5000);
        } else if (order.status === 'Preparing') {
          setTimeout(() => {
            dispatch({
              type: 'UPDATE_ORDER_STATUS',
              payload: { orderId: order.id, status: 'Ready' }
            });
          }, 10000);
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [state.orders]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
} 