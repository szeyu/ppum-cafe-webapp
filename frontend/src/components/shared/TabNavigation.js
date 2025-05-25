import React from 'react';

function TabNavigation({ 
  tabs = [], 
  activeTab, 
  onTabChange, 
  className = "",
  tabClassName = "",
  activeTabClassName = "",
  inactiveTabClassName = ""
}) {
  if (!tabs || tabs.length === 0) return null;

  const defaultTabClasses = "px-6 py-3 whitespace-nowrap font-medium";
  const defaultActiveClasses = "text-primary-600 border-b-2 border-primary-600";
  const defaultInactiveClasses = "text-gray-500";

  return (
    <div className={`bg-white border-b ${className}`}>
      <div className="flex overflow-x-auto">
        {tabs.map(tab => {
          const isActive = activeTab === tab;
          const tabClasses = `
            ${defaultTabClasses} 
            ${tabClassName}
            ${isActive 
              ? `${defaultActiveClasses} ${activeTabClassName}` 
              : `${defaultInactiveClasses} ${inactiveTabClassName}`
            }
          `.trim();

          return (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={tabClasses}
            >
              {tab}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default TabNavigation; 