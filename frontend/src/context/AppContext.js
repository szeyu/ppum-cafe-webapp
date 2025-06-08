import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import ApiService from '../services/api';

const AppContext = createContext();

// Load cart from localStorage
const loadCartFromStorage = () => {
  try {
    const savedCart = localStorage.getItem('ppum_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  } catch (error) {
    console.error('Error loading cart from localStorage:', error);
    return [];
  }
};

// Save cart to localStorage
const saveCartToStorage = (cart) => {
  try {
    localStorage.setItem('ppum_cart', JSON.stringify(cart));
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  }
};

const initialState = {
  language: 'English',
  cart: loadCartFromStorage(),
  orders: [],
  currentOrder: null,
  user: null,
  isAuthenticated: false,
  stalls: [],
  menuItems: [],
  loading: false,
  error: null,
  cartAnimation: null, // For cart add animations
  notifications: [],
  orderTracking: null // For detailed order tracking
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    
    case 'SET_USER':
      return { ...state, user: action.payload };
    
    case 'SET_AUTHENTICATED':
      return { ...state, isAuthenticated: action.payload };
    
    case 'SET_LANGUAGE':
      return { ...state, language: action.payload };
    
    case 'SET_STALLS':
      return { ...state, stalls: action.payload };
    
    case 'SET_MENU_ITEMS':
      return { ...state, menuItems: action.payload };
    
    case 'SET_ORDERS':
      return { ...state, orders: action.payload };
    
    case 'SET_ORDER_TRACKING':
      return { ...state, orderTracking: action.payload };
    
    case 'SET_NOTIFICATIONS':
      return { ...state, notifications: action.payload };
    
    case 'ADD_TO_CART':
      const existingItem = state.cart.find(item => item.id === action.payload.id);
      let newCart;
      
      if (existingItem) {
        newCart = state.cart.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
        );
      } else {
        newCart = [...state.cart, { ...action.payload, quantity: 1 }];
      }
      
      // Save to localStorage
      saveCartToStorage(newCart);
      
      return {
        ...state,
        cart: newCart,
        cartAnimation: {
          type: 'add',
          itemId: action.payload.id,
          itemName: action.payload.name,
          timestamp: Date.now()
        }
      };
    
    case 'REMOVE_FROM_CART':
      const cartAfterRemove = state.cart.filter(item => item.id !== action.payload);
      saveCartToStorage(cartAfterRemove);
      return {
        ...state,
        cart: cartAfterRemove
      };
    
    case 'UPDATE_CART_QUANTITY':
      const cartAfterUpdate = state.cart.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
      saveCartToStorage(cartAfterUpdate);
      return {
        ...state,
        cart: cartAfterUpdate
      };
    
    case 'CLEAR_CART':
      saveCartToStorage([]);
      return { ...state, cart: [] };
    
    case 'CLEAR_CART_ANIMATION':
      return { ...state, cartAnimation: null };
    
    case 'ADD_ORDER':
      // Clear cart from localStorage when order is placed
      saveCartToStorage([]);
      return {
        ...state,
        orders: [action.payload, ...state.orders],
        currentOrder: action.payload,
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
    
    case 'LOGOUT':
      // Clear cart from localStorage on logout
      saveCartToStorage([]);
      return {
        ...initialState,
        language: state.language, // Preserve language preference
        cart: [] // Ensure cart is empty
      };
    
    case 'RESTORE_CART':
      return {
        ...state,
        cart: action.payload
      };
    
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Check authentication on app load
  useEffect(() => {
    checkAuthentication();
  }, []);

  // Load initial data when authenticated
  useEffect(() => {
    if (state.isAuthenticated && state.user) {
      loadInitialData();
      // Restore cart from localStorage if it exists and current cart is empty
      const savedCart = loadCartFromStorage();
      if (savedCart.length > 0 && state.cart.length === 0) {
        dispatch({ type: 'RESTORE_CART', payload: savedCart });
      }
    }
  }, [state.isAuthenticated, state.user]);

  // Poll for order updates and notifications
  useEffect(() => {
    if (state.isAuthenticated && state.user) {
    const interval = setInterval(() => {
        loadUserOrders();
        loadNotifications();
      }, 30000); // Check every 30 seconds

      return () => clearInterval(interval);
    }
  }, [state.isAuthenticated, state.user]);

  // Clear cart animation after 3 seconds
  useEffect(() => {
    if (state.cartAnimation) {
      const timer = setTimeout(() => {
        dispatch({ type: 'CLEAR_CART_ANIMATION' });
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [state.cartAnimation]);

  const checkAuthentication = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        dispatch({ type: 'SET_AUTHENTICATED', payload: false });
        dispatch({ type: 'SET_USER', payload: null });
        return;
      }
      
      // Set the token in the API service
      ApiService.setToken(token);
      
      // Get current user info
      const userData = await ApiService.getCurrentUser();
      if (userData) {
        dispatch({ type: 'SET_USER', payload: userData });
        dispatch({ type: 'SET_AUTHENTICATED', payload: true });
        
        // Set language preference from user
        if (userData.language_preference) {
          dispatch({ type: 'SET_LANGUAGE', payload: userData.language_preference });
        }
      }
    } catch (error) {
      console.error('Authentication check failed:', error);
      localStorage.removeItem('token');
      dispatch({ type: 'SET_AUTHENTICATED', payload: false });
      dispatch({ type: 'SET_USER', payload: null });
    }
  };

  const loadInitialData = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Load stalls
      await loadStalls();
      
      // Load user orders
      await loadUserOrders();
      
      // Load notifications
      await loadNotifications();
      
    } catch (error) {
      console.error('Error loading initial data:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const loadUserOrders = async () => {
    if (!state.user) return;
    
    try {
      const orders = await ApiService.getUserOrders(state.user.id);
      dispatch({ type: 'SET_ORDERS', payload: orders });
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  const loadNotifications = async () => {
    if (!state.user) return;
    
    try {
      const notifications = await ApiService.getUserNotifications(state.user.id);
      dispatch({ type: 'SET_NOTIFICATIONS', payload: notifications });
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const loadStalls = async () => {
    try {
      const stalls = await ApiService.getStalls();
      dispatch({ type: 'SET_STALLS', payload: stalls });
    } catch (error) {
      console.error('Error loading stalls:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const loadMenuItems = useCallback(async (stallId, category = null) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const items = await ApiService.getMenuItems(stallId, category);
      dispatch({ type: 'SET_MENU_ITEMS', payload: items });
    } catch (error) {
      console.error('Error loading menu items:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const updateLanguage = async (language) => {
    if (!state.user) return;
    
    try {
      // Update language preference in backend
      await ApiService.updateUserLanguage(state.user.id, language);
      
      // Update language in state
      dispatch({ type: 'SET_LANGUAGE', payload: language });
      
      // Immediately update localStorage so API requests use the new language
      const appState = JSON.parse(localStorage.getItem('appState') || '{}');
      appState.language = language;
      localStorage.setItem('appState', JSON.stringify(appState));
      
      // Reload stalls data to get the content in the new language
      await loadStalls();
      
      // If there are menu items currently loaded, reload them too
      if (state.menuItems.length > 0) {
        // Get the current stall ID from the first menu item
        const currentStallId = state.menuItems[0]?.stall_id;
        if (currentStallId) {
          const items = await ApiService.getMenuItems(currentStallId);
          dispatch({ type: 'SET_MENU_ITEMS', payload: items });
        }
      }
      
    } catch (error) {
      console.error('Error updating language:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const createOrder = async (paymentMethod) => {
    if (!state.user) {
      throw new Error('User not authenticated');
    }
    
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const orderData = {
        user_id: state.user.id,
        payment_method: paymentMethod,
        items: state.cart.map(item => ({
          menu_item_id: item.id,
          quantity: item.quantity
        }))
      };
      
      const orderTracking = await ApiService.createOrder(orderData);
      dispatch({ type: 'ADD_ORDER', payload: orderTracking.order });
      dispatch({ type: 'SET_ORDER_TRACKING', payload: orderTracking });
      
      return orderTracking;
    } catch (error) {
      console.error('Error creating order:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const getOrderTracking = async (orderId) => {
    try {
      const tracking = await ApiService.getOrderTracking(orderId);
      dispatch({ type: 'SET_ORDER_TRACKING', payload: tracking });
      return tracking;
    } catch (error) {
      console.error('Error getting order tracking:', error);
      
      // If it's an authentication error, try to refresh the authentication
      if (error.message === 'Authentication required') {
        console.log('Authentication required for order tracking, attempting to refresh...');
        
        try {
          // Try to refresh authentication by checking if token is still valid
          const token = localStorage.getItem('access_token');
          if (token) {
            // Try to get current user to verify token is still valid
            const user = await ApiService.getCurrentUser();
            if (user) {
              console.log('Authentication refreshed, retrying order tracking...');
              // Retry the original request
              const tracking = await ApiService.getOrderTracking(orderId);
              dispatch({ type: 'SET_ORDER_TRACKING', payload: tracking });
              return tracking;
            }
          }
        } catch (refreshError) {
          console.error('Failed to refresh authentication:', refreshError);
        }
        
        // If refresh failed, clear the token and let the auth system handle it
        localStorage.removeItem('access_token');
        ApiService.setToken(null);
        dispatch({ type: 'SET_AUTHENTICATED', payload: false });
        dispatch({ type: 'SET_USER', payload: null });
        return null;
      }
      
      dispatch({ type: 'SET_ERROR', payload: error.message });
      return null;
    }
  };

  const searchStalls = async (query) => {
    try {
      if (!query.trim()) {
        const stalls = await ApiService.getStalls();
        dispatch({ type: 'SET_STALLS', payload: stalls });
        return;
      }
      
      const results = await ApiService.searchStalls(query);
      dispatch({ type: 'SET_STALLS', payload: results });
    } catch (error) {
      console.error('Error searching stalls:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const logout = async () => {
    try {
      await ApiService.logout();
      localStorage.removeItem('token');
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const markNotificationRead = async (notificationId) => {
    try {
      await ApiService.markNotificationRead(notificationId);
      // Reload notifications
      await loadNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const contextValue = {
    state,
    dispatch,
    loadStalls,
    loadMenuItems,
    updateLanguage,
    createOrder,
    getOrderTracking,
    searchStalls,
    loadUserOrders,
    loadNotifications,
    logout,
    markNotificationRead
  };

  return (
    <AppContext.Provider value={contextValue}>
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