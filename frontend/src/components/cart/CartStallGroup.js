import React from 'react';
import CartItem from './CartItem';

function CartStallGroup({ 
  stallName, 
  items, 
  onUpdateQuantity, 
  onRemoveItem 
}) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">{stallName}</h2>
      
      {items.map(item => (
        <CartItem
          key={item.id}
          item={item}
          onUpdateQuantity={onUpdateQuantity}
          onRemoveItem={onRemoveItem}
        />
      ))}
    </div>
  );
}

export default CartStallGroup; 