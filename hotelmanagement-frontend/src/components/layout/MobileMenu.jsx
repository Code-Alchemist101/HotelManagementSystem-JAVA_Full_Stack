import React from 'react';
import { Hotel, Calendar, LayoutDashboard, User, X } from 'lucide-react';
import { USER_ROLES } from '../../utils/constants';

const MobileMenu = ({ isOpen, currentPage, onNavigate, onClose, userRole }) => {
  const navigation = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard, roles: [USER_ROLES.USER, USER_ROLES.ADMIN] },
    { id: 'rooms', name: 'Rooms', icon: Hotel, roles: [USER_ROLES.USER, USER_ROLES.ADMIN] },
    { id: 'bookings', name: 'Bookings', icon: Calendar, roles: [USER_ROLES.USER, USER_ROLES.ADMIN] },
    { id: 'profile', name: 'Profile', icon: User, roles: [USER_ROLES.USER, USER_ROLES.ADMIN] },
  ];

  const visibleNav = navigation.filter(item => item.roles.includes(userRole));

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      
      {/* Menu */}
      <div className="md:hidden fixed top-0 right-0 bottom-0 w-64 bg-white shadow-2xl z-50 transform transition-transform">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="font-bold text-lg text-gray-800">Menu</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-4 space-y-2">
          {visibleNav.map(item => (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                onClose();
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                currentPage === item.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default MobileMenu;