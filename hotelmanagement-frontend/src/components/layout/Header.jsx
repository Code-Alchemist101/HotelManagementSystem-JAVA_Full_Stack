import React from 'react';
import { Hotel, LogOut, Menu } from 'lucide-react';

const Header = ({ user, onLogout, onToggleMenu }) => {
  return (
    <header className="glass sticky top-0 z-50 border-b border-white/20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <div className="bg-blue-500/10 p-2.5 rounded-xl">
              <Hotel className="w-6 h-6 text-[#007AFF]" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#1D1D1F]">Hotel Manager</h1>
              <p className="text-[10px] uppercase tracking-wider font-semibold text-[#86868B]">Enterprise</p>
            </div>
          </div>

          {/* User & Actions */}
          <div className="flex items-center gap-6">
            <div className="hidden md:block text-right">
              <p className="text-sm font-semibold text-[#1D1D1F]">{user.username}</p>
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-600">
                {user.role}
              </span>
            </div>
            
            <button
              onClick={onLogout}
              className="flex items-center gap-2 bg-red-50 text-[#FF3B30] px-4 py-2 rounded-full hover:bg-red-100 transition-all active:scale-95 text-sm font-medium"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden md:inline">Sign Out</span>
            </button>
            
            <button
              onClick={onToggleMenu}
              className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-full transition"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;