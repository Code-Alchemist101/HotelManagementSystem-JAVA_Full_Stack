import React from 'react';
import { Hotel, Calendar, LayoutDashboard, User } from 'lucide-react';
import { USER_ROLES } from '../../utils/constants';

const Navigation = ({ currentPage, onNavigate, userRole }) => {
  const navigation = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard, roles: [USER_ROLES.USER, USER_ROLES.ADMIN] },
    { id: 'rooms', name: 'Rooms', icon: Hotel, roles: [USER_ROLES.USER, USER_ROLES.ADMIN] },
    { id: 'bookings', name: 'Bookings', icon: Calendar, roles: [USER_ROLES.USER, USER_ROLES.ADMIN] },
    { id: 'profile', name: 'Profile', icon: User, roles: [USER_ROLES.USER, USER_ROLES.ADMIN] },
  ];

  const visibleNav = navigation.filter(item => item.roles.includes(userRole));

  return (
    <nav className="hidden md:flex space-x-2">
      {visibleNav.map(item => (
        <button
          key={item.id}
          onClick={() => onNavigate(item.id)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
            currentPage === item.id
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <item.icon className="w-5 h-5" />
          <span className="font-medium">{item.name}</span>
        </button>
      ))}
    </nav>
  );
};

export default Navigation;