import React from 'react';

function EmptyState({ 
  icon = "📭",
  title = "No items found",
  message = "There are no items to display.",
  actionText,
  onAction,
  className = ""
}) {
  return (
    <div className={`text-center py-12 ${className}`}>
      <div className="text-6xl mb-4">{icon}</div>
      <h2 className="text-xl font-semibold text-gray-800 mb-2">{title}</h2>
      <p className="text-gray-600 mb-4">{message}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg transition-colors"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}

export default EmptyState; 