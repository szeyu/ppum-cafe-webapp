import React from 'react';

function OrderSummaryCard({ groupedCart, subtotal, serviceFee, total }) {
  return (
    <div className="card">
      <h3 className="font-semibold text-gray-800 mb-4">Order Summary</h3>
      
      {Object.entries(groupedCart).map(([stallName, items]) => (
        <div key={stallName} className="mb-4 p-3 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-800 mb-2">
            {stallName}: {items.length} item{items.length > 1 ? 's' : ''}
          </h4>
          {items.map(item => (
            <div key={item.id} className="text-sm text-gray-600">
              {item.name} (x{item.quantity}) - RM {(item.price * item.quantity).toFixed(2)}
            </div>
          ))}
        </div>
      ))}
      
      <div className="border-t pt-4 mt-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Subtotal</span>
          <span>RM {subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Service Fee</span>
          <span>RM {serviceFee.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-semibold text-lg">
          <span>Total</span>
          <span className="text-primary-600">RM {total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}

export default OrderSummaryCard; 