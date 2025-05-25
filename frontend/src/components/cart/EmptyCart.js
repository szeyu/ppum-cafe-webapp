import React from 'react';
import { useNavigate } from 'react-router-dom';
import { EmptyState } from '../shared';

function EmptyCart() {
  const navigate = useNavigate();

  return (
    <EmptyState
      icon="🛒"
      title="Your cart is empty"
      message="Add some delicious items to get started!"
      actionText="Browse Stalls"
      onAction={() => navigate('/home')}
    />
  );
}

export default EmptyCart; 