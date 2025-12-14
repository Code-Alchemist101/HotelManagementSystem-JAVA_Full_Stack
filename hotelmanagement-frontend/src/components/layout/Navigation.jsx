import React from 'react';
import { Hotel, Calendar, LayoutDashboard, User } from 'lucide-react';
import { USER_ROLES } from '../../utils/constants';

const Navigation = ({ currentPage, onNavigate, userRole }) => {
  const navigation = [
    { id: 'dashboard', name: 'Overview', icon: LayoutDashboard, roles: [USER_ROLES.USER, USER_ROLES.ADMIN] },
    { id: 'rooms', name: 'Rooms', icon: Hotel, roles: [USER_ROLES.USER, USER_ROLES.ADMIN] },
    { id: 'bookings', name: 'Bookings', icon: Calendar, roles: [USER_ROLES.USER, USER_ROLES.ADMIN] },
    { id: 'profile', name: 'Settings', icon: User, roles: [USER_ROLES.USER, USER_ROLES.ADMIN] },
  ];

  const visibleNav = navigation.filter(item => item.roles.includes(userRole));

  return (
    <nav className="hidden md:flex space-x-1 bg-gray-100/50 p-1.5 rounded-full border border-gray-200/50 w-fit backdrop-blur-sm">
      {visibleNav.map(item => {
        const isActive = currentPage === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 relative ${isActive
                ? 'bg-white text-[#007AFF] shadow-sm'
                : 'text-gray-500 hover:text-gray-900 hover:bg-white/50'
              }`}
          >
            <item.icon className={`w-4 h-4 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
            <span>{item.name}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default Navigation;