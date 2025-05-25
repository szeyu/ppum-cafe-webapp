import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';

// Pages
import Splash from './pages/Splash';
import LanguageSelect from './pages/LanguageSelect';
import Home from './pages/Home';
import StallMenu from './pages/StallMenu';
import Cart from './pages/Cart';
import Payment from './pages/Payment';
import Orders from './pages/Orders';
import Notification from './pages/Notification';
import Profile from './pages/Profile';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Navigate to="/splash" replace />} />
            <Route path="/splash" element={<Splash />} />
            <Route path="/language" element={<LanguageSelect />} />
            <Route path="/home" element={<Home />} />
            <Route path="/stall/:stallId" element={<StallMenu />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/notification" element={<Notification />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
