import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { BottomNav } from '../shared';

// Import home components
import LoadingState from './LoadingState';
import ErrorState from './ErrorState';
import SearchBar from './SearchBar';
import StallsGrid from './StallsGrid';

function Home() {
  const navigate = useNavigate();
  const { state, searchStalls } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = async (value) => {
    setSearchTerm(value);
    await searchStalls(value);
  };

  const handleStallClick = (stallId) => {
    navigate(`/stall/${stallId}`);
  };

  const handleRetry = () => {
    window.location.reload();
  };

  if (state.loading) {
    return <LoadingState />;
  }

  if (state.error) {
    return <ErrorState error={state.error} onRetry={handleRetry} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-primary-600 text-white p-4">
        <h1 className="text-xl font-bold text-center">PPUM CAFÉ</h1>
      </div>

      {/* Search Bar */}
      <SearchBar searchTerm={searchTerm} onSearch={handleSearch} />

      {/* Stalls Grid */}
      <StallsGrid stalls={state.stalls} onStallClick={handleStallClick} />

      <BottomNav />
    </div>
  );
}

export default Home;
