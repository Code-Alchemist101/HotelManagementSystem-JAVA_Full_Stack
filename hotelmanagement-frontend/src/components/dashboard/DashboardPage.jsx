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

      // FIXED: Count only truly available rooms (available = true in DB)
      const availableRooms = rooms.filter(r => r.available === true).length;
      
      // FIXED: Count only active bookings (status = BOOKED)
      const activeBookings = bookings.filter(b => b.status === 'BOOKED').length;
      
      // Calculate revenue (only completed bookings)
      const revenue = bookings
        .filter(b => b.status === 'COMPLETED')
        .reduce((sum, b) => {
          const nights = Math.ceil(
            (new Date(b.checkOutDate) - new Date(b.checkInDate)) / (1000 * 60 * 60 * 24)
          );
          return sum + (nights * (b.room?.price || 0));
        }, 0);

      // FIXED: Calculate occupancy rate correctly
      // Occupancy = (Total Rooms - Available Rooms) / Total Rooms * 100
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

      // Get recent bookings (last 5)
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
        <div className="text-xl text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  const StatCard = ({ icon: Icon, label, value, color, suffix = '' }) => (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4" style={{ borderColor: color }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{label}</p>
          <p className="text-3xl font-bold text-gray-800">
            {value}{suffix}
          </p>
        </div>
        <div className="bg-gray-100 rounded-full p-3">
          <Icon className="w-8 h-8" style={{ color }} />
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Welcome back, {user.username}!
        </h2>
        <p className="text-gray-600">Here's what's happening with your hotel today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard
          icon={Hotel}
          label="Total Rooms"
          value={stats.totalRooms}
          color="#3B82F6"
        />
        <StatCard
          icon={Hotel}
          label="Available Rooms"
          value={stats.availableRooms}
          color="#10B981"
        />
        <StatCard
          icon={Calendar}
          label="Active Bookings"
          value={stats.activeBookings}
          color="#F59E0B"
        />
        {user.role === USER_ROLES.ADMIN && (
          <>
            <StatCard
              icon={DollarSign}
              label="Total Revenue"
              value={formatCurrency(stats.totalRevenue)}
              color="#8B5CF6"
            />
            <StatCard
              icon={TrendingUp}
              label="Occupancy Rate"
              value={stats.occupancyRate}
              color="#EC4899"
              suffix="%"
            />
            <StatCard
              icon={Users}
              label="Total Bookings"
              value={stats.totalBookings}
              color="#6366F1"
            />
          </>
        )}
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-6 h-6 text-blue-600" />
          <h3 className="text-xl font-bold text-gray-800">Recent Bookings</h3>
        </div>
        
        {recentBookings.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No bookings yet</p>
        ) : (
          <div className="space-y-4">
            {recentBookings.map(booking => (
              <div
                key={booking.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
              >
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">
                    {booking.room?.roomNumber} - {booking.room?.type}
                  </p>
                  <p className="text-sm text-gray-600">
                    {user.role === USER_ROLES.ADMIN && booking.user?.username}
                    {user.role === USER_ROLES.ADMIN && ' • '}
                    {new Date(booking.checkInDate).toLocaleDateString()} to{' '}
                    {new Date(booking.checkOutDate).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    booking.status === 'BOOKED'
                      ? 'bg-blue-100 text-blue-800'
                      : booking.status === 'COMPLETED'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {booking.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;