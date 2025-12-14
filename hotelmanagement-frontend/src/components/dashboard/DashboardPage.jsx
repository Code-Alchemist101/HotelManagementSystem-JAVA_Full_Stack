import React, { useState, useEffect } from 'react';
import { Hotel, Calendar, Users, DollarSign, TrendingUp, Clock } from 'lucide-react';
import api from '../../api/apiService';
import { formatCurrency } from '../../utils/helpers';
import { USER_ROLES } from '../../utils/constants';

const DashboardPage = ({ user, showToast }) => {
  const [stats, setStats] = useState({
    totalRooms: 0,
    availableRooms: 0,
    totalBookings: 0,
    activeBookings: 0,
    totalRevenue: 0,
    occupancyRate: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [rooms, bookings] = await Promise.all([
        api.getRooms(),
        user.role === USER_ROLES.ADMIN ? api.getBookings() : api.getUserBookings(user.userId)
      ]);

      const availableRooms = rooms.filter(r => r.available === true).length;
      const activeBookings = bookings.filter(b => b.status === 'BOOKED').length;

      const revenue = bookings
        .filter(b => b.status === 'COMPLETED')
        .reduce((sum, b) => {
          const nights = Math.ceil(
            (new Date(b.checkOutDate) - new Date(b.checkInDate)) / (1000 * 60 * 60 * 24)
          );
          return sum + (nights * (b.room?.price || 0));
        }, 0);

      const occupancyRate = rooms.length > 0
        ? (((rooms.length - availableRooms) / rooms.length) * 100).toFixed(1)
        : 0;

      setStats({
        totalRooms: rooms.length,
        availableRooms,
        totalBookings: bookings.length,
        activeBookings,
        totalRevenue: revenue,
        occupancyRate
      });

      const sorted = [...bookings].sort((a, b) => b.id - a.id).slice(0, 5);
      setRecentBookings(sorted);
    } catch (error) {
      showToast('Failed to load dashboard data: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-gray-400">Loading your data...</p>
        </div>
      </div>
    );
  }

  const StatCard = ({ icon: Icon, label, value, color, suffix = '' }) => (
    <div className="glass-card p-6 flex items-center justify-between hover:scale-[1.02] transition-transform duration-300">
      <div>
        <p className="text-sm font-medium text-[#86868B] mb-1">{label}</p>
        <p className="text-3xl font-bold text-[#1D1D1F] tracking-tight">
          {value}{suffix}
        </p>
      </div>
      <div className={`p-3 rounded-2xl ${color.replace('text-', 'bg-').replace('600', '100')}`}>
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
    </div>
  );

  return (
    <div className="animate-fade-in">
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-[#1D1D1F] mb-1">
          Welcome back, {user.username}
        </h2>
        <p className="text-[#86868B]">Here's an overview of your property today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <StatCard
          icon={Hotel}
          label="Total Rooms"
          value={stats.totalRooms}
          color="text-blue-600"
        />
        <StatCard
          icon={Hotel}
          label="Available Rooms"
          value={stats.availableRooms}
          color="text-emerald-500"
        />
        <StatCard
          icon={Calendar}
          label="Active Bookings"
          value={stats.activeBookings}
          color="text-amber-500"
        />
        {user.role === USER_ROLES.ADMIN && (
          <>
            <StatCard
              icon={DollarSign}
              label="Total Revenue"
              value={formatCurrency(stats.totalRevenue)}
              color="text-violet-600"
            />
            <StatCard
              icon={TrendingUp}
              label="Occupancy Rate"
              value={stats.occupancyRate}
              color="text-pink-500"
              suffix="%"
            />
            <StatCard
              icon={Users}
              label="Total Bookings"
              value={stats.totalBookings}
              color="text-indigo-500"
            />
          </>
        )}
      </div>

      {/* Recent Bookings */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <Clock className="w-5 h-5 text-[#86868B]" />
          <h3 className="text-lg font-bold text-[#1D1D1F]">Recent Activity</h3>
        </div>

        {recentBookings.length === 0 ? (
          <div className="glass-card p-10 text-center">
            <p className="text-[#86868B]">No bookings found yet.</p>
          </div>
        ) : (
          <div className="glass-card overflow-hidden">
            {recentBookings.map((booking, index) => (
              <div
                key={booking.id}
                className={`p-5 flex items-center justify-between hover:bg-gray-50/50 transition duration-200 ${index !== recentBookings.length - 1 ? 'border-b border-gray-100' : ''
                  }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${booking.status === 'BOOKED' ? 'bg-blue-100 text-blue-600' :
                      booking.status === 'COMPLETED' ? 'bg-green-100 text-green-600' :
                        'bg-gray-100 text-gray-500'
                    }`}>
                    {booking.room?.roomNumber?.substring(0, 2) || '#'}
                  </div>
                  <div>
                    <p className="font-semibold text-[#1D1D1F]">
                      {booking.room?.type} • Room {booking.room?.roomNumber}
                    </p>
                    <p className="text-xs text-[#86868B] mt-0.5">
                      {new Date(booking.checkInDate).toLocaleDateString()} — {new Date(booking.checkOutDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${booking.status === 'BOOKED'
                        ? 'bg-blue-50 text-blue-600 border border-blue-100'
                        : booking.status === 'COMPLETED'
                          ? 'bg-green-50 text-green-600 border border-green-100'
                          : 'bg-red-50 text-red-600 border border-red-100'
                      }`}
                  >
                    {booking.status}
                  </span>
                  {user.role === USER_ROLES.ADMIN && (
                    <p className="text-xs text-[#86868B] mt-1 pr-1">{booking.user?.username}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;