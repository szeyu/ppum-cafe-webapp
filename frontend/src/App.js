import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';

// Import pages
import Splash from './pages/Splash';
import LanguageSelect from './pages/LanguageSelect';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import StallMenu from './pages/StallMenu';
import Cart from './pages/Cart';
import Payment from './pages/Payment';
import Orders from './pages/Orders';
import Notification from './pages/Notification';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import StallManagement from './pages/StallManagement';

// Import components
import { FloatingCartButton } from './components';

// Protected Route Component
function ProtectedRoute({ children }) {
  const { state } = useApp();
  
  if (!state.isAuthenticated) {
    console.log('ProtectedRoute: User not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

// Public Route Component (redirect to home if authenticated)
function PublicRoute({ children }) {
  const { state } = useApp();
  
  if (state.isAuthenticated) {
    return <Navigate to="/home" replace />;
  }
  
  return children;
}

function AppContent() {
  const { state } = useApp();
  const location = useLocation();
  
  // show floating cart button on home and stall menu pages
  const showFloatingCart = location.pathname === '/home' || location.pathname.startsWith('/stall/');

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Splash />} />
        <Route path="/language" element={<LanguageSelect />} />
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } 
        />
        <Route 
          path="/register" 
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          } 
        />

        {/* Protected routes */}
        <Route 
          path="/home" 
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/stall/:stallId" 
          element={
            <ProtectedRoute>
              <StallMenu />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/cart" 
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/payment" 
          element={
            <ProtectedRoute>
              <Payment />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/orders" 
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/notifications" 
          element={
            <ProtectedRoute>
              <Notification />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/stall-management" 
          element={
            <ProtectedRoute>
              <StallManagement />
            </ProtectedRoute>
          } 
        />

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Floating Cart Button - show on home and stall menu pages */}
      {state.isAuthenticated && showFloatingCart && <FloatingCartButton />}
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <Router>
        <AppContent />
      </Router>
    </AppProvider>
  );
}

export default App;
