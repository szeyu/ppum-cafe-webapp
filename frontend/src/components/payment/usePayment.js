import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

function usePayment() {
  const navigate = useNavigate();
  const { state, createOrder } = useApp();
  const [paymentMethod, setPaymentMethod] = useState('Online Payment');
  const [isProcessing, setIsProcessing] = useState(false);

  // Calculate grouped cart
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

    return { subtotal, serviceFee, total };
  }, [state.cart]);

  const handlePayment = async () => {
    if (state.cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    try {
      setIsProcessing(true);
      
      // Create order via API
      const order = await createOrder(paymentMethod);

      // Navigate to order tracking
      navigate('/orders');
      
      // Show notification after a delay (simulating order processing)
      setTimeout(() => {
        navigate('/notification');
      }, 15000);
      
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    paymentMethod,
    setPaymentMethod,
    isProcessing,
    groupedCart,
    calculations,
    handlePayment,
    isEmpty: state.cart.length === 0
  };
}

export default usePayment; 