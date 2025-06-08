import React from 'react';

function FoodTracking({ 
  foodTrackers, 
  onRefresh, 
  onUpdateStatus, 
  getStatusColor, 
  formatTime 
}) {
  const formatMenuItemName = (menuItem) => {
    if (!menuItem) return 'Unknown Item';
    
    const englishName = menuItem.name;
    const bmName = menuItem.name_bm;
    
    // If both names exist and are different, show both
    if (bmName && bmName.trim() && bmName !== englishName) {
      return `${englishName} / ${bmName}`;
    }
    
    // Otherwise just show the English name
    return englishName;
  };

  const formatStallName = (stall) => {
    if (!stall) return 'Unknown Stall';
    
    const englishName = stall.name;
    const bmName = stall.name_bm;
    
    // If both names exist and are different, show both
    if (bmName && bmName.trim() && bmName !== englishName) {
      return `${englishName} / ${bmName}`;
    }
    
    // Otherwise just show the English name
    return englishName;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Food Tracking</h2>
        <button
          onClick={onRefresh}
          className="bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700"
        >
          Refresh
        </button>
      </div>

      {foodTrackers.length === 0 ? (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No items to track</h3>
          <p className="mt-1 text-sm text-gray-500">No food items are currently being prepared.</p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {foodTrackers.map((tracker) => (
              <li key={tracker.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">
                        {formatMenuItemName(tracker.menu_item)} (Item #{tracker.item_number})
                      </p>
                      <div className="ml-2 flex-shrink-0 flex">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(tracker.status)}`}>
                          {tracker.status}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm text-gray-600">
                        Order #{tracker.order?.order_number} • Customer: {tracker.order?.user?.name || 'Unknown'}
                      </p>
                      <p className="text-sm text-gray-500">
                        Queue Position: {tracker.queue_position} • 
                        Est. Ready: {formatTime(tracker.estimated_ready_time)}
                      </p>
                      {tracker.prep_start_time && (
                        <p className="text-sm text-gray-500">
                          Started: {formatTime(tracker.prep_start_time)}
                        </p>
                      )}
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="mt-3 flex space-x-2">
                      {tracker.status === 'Queued' && (
                        <button
                          onClick={() => onUpdateStatus(tracker.id, 'Preparing')}
                          className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-blue-700"
                        >
                          Start Preparing
                        </button>
                      )}
                      {tracker.status === 'Preparing' && (
                        <button
                          onClick={() => onUpdateStatus(tracker.id, 'Ready')}
                          className="bg-green-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-green-700"
                        >
                          Mark Ready
                        </button>
                      )}
                      {tracker.status === 'Ready' && (
                        <button
                          onClick={() => onUpdateStatus(tracker.id, 'Collected')}
                          className="bg-gray-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-gray-700"
                        >
                          Mark Collected
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default FoodTracking; 