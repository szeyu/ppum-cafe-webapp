import React from 'react';

function SearchBar({ searchTerm, onSearch, placeholder = "Search stalls or menu items..." }) {
  return (
    <div className="p-4">
      <div className="relative">
        <input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => onSearch(e.target.value)}
          className="input-field pl-10"
        />
        <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>
  );
}

export default SearchBar; 