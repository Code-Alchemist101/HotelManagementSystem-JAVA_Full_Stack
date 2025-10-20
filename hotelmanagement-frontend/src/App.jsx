import React, { useState, useEffect } from 'react';
import api from './api/apiService';
import LoginPage from './components/auth/LoginPage';
import Header from './components/layout/Header';
import Navigation from './components/layout/Navigation';
import MobileMenu from './components/layout/MobileMenu';
import RoomsPage from './components/rooms/RoomsPage';
import BookingsPage from './components/bookings/BookingsPage';
import DashboardPage from './components/dashboard/DashboardPage';
import ProfilePage from './components/profile/ProfilePage';
import ErrorBoundary from './components/common/ErrorBoundary';
import Toast from './components/common/Toast';

function App() {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // Session persistence check (token still valid on page refresh)
  useEffect(() => {
    const token = api.getToken();
    const storedUser = api.getCurrentUser();
    if (token && storedUser) {
      setUser(storedUser);
    }
  }, []);

  const showToast = (message, type = 'info') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => setToast(null), 5000);
  };

  const handleLogin = (userData) => {
    setUser(userData);
    api.setCurrentUser(userData);
    showToast('Login successful!', 'success');
  };

  const handleLogout = () => {
    api.clearAuth();
    setUser(null);
    setCurrentPage('dashboard');
    showToast('Logged out successfully', 'info');
  };

  const handleNavigate = (page) => {
    setCurrentPage(page);
    setMobileMenuOpen(false);
  };

  if (!user) {
    return <LoginPage onLogin={handleLogin} showToast={showToast} />;
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        <Header 
          user={user} 
          onLogout={handleLogout}
          onToggleMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
        />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Navigation 
            currentPage={currentPage}
            onNavigate={handleNavigate}
            userRole={user.role}
          />
        </div>

        <MobileMenu
          isOpen={mobileMenuOpen}
          currentPage={currentPage}
          onNavigate={handleNavigate}
          onClose={() => setMobileMenuOpen(false)}
          userRole={user.role}
        />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {currentPage === 'dashboard' && <DashboardPage user={user} showToast={showToast} />}
          {currentPage === 'rooms' && <RoomsPage user={user} showToast={showToast} />}
          {currentPage === 'bookings' && <BookingsPage user={user} showToast={showToast} />}
          {currentPage === 'profile' && <ProfilePage user={user} setUser={setUser} showToast={showToast} />}
        </main>

        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </ErrorBoundary>
  );
}

export default App;