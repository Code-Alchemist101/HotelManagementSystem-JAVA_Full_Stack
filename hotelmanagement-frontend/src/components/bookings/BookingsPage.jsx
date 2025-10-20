import React, { useState, useEffect } from 'react';
import { Plus, Filter } from 'lucide-react';
import api from '../../api/apiService';
import BookingTable from './BookingTable';
import BookingModal from './BookingModal';
import BookingDetailsModal from './BookingDetailsModal';
import { USER_ROLES, BOOKING_STATUS } from '../../utils/constants';
import SearchBar from '../common/SearchBar';

const BookingsPage = ({ user, showToast }) => {
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [bookingsData, roomsData, usersData] = await Promise.all([
        user.role === USER_ROLES.ADMIN 
          ? api.getBookings() 
          : api.getUserBookings(user.userId),
        api.getRooms(),
        user.role === USER_ROLES.ADMIN ? api.getUsers() : Promise.resolve([])
      ]);
      
      setBookings(bookingsData);
      setRooms(roomsData);
      setUsers(usersData);
    } catch (error) {
      showToast('Failed to load data: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      await api.createBooking(formData);
      showToast('Booking created successfully!', 'success');
      await loadData();
      setShowModal(false);
    } catch (error) {
      showToast('Error creating booking: ' + error.message, 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await api.deleteBooking(id);
        showToast('Booking cancelled successfully!', 'success');
        await loadData();
      } catch (error) {
        showToast('Error cancelling booking: ' + error.message, 'error');
      }
    }
  };

  const handleView = (booking) => {
    setSelectedBooking(booking);
    setShowDetailsModal(true);
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await api.updateBooking(bookingId, { status: newStatus });
      showToast('Booking status updated!', 'success');
      await loadData();
      setShowDetailsModal(false);
    } catch (error) {
      showToast('Error updating status: ' + error.message, 'error');
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.room?.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.user?.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.id.toString().includes(searchTerm);

    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: bookings.length,
    booked: bookings.filter(b => b.status === BOOKING_STATUS.BOOKED).length,
    completed: bookings.filter(b => b.status === BOOKING_STATUS.COMPLETED).length,
    cancelled: bookings.filter(b => b.status === BOOKING_STATUS.CANCELLED).length
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-gray-600">Loading bookings...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Bookings Management</h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-md"
        >
          <Plus className="w-4 h-4" />
          New Booking
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500">
          <p className="text-sm text-gray-600">Total</p>
          <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-500">
          <p className="text-sm text-gray-600">Active</p>
          <p className="text-2xl font-bold text-gray-800">{stats.booked}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-purple-500">
          <p className="text-sm text-gray-600">Completed</p>
          <p className="text-2xl font-bold text-gray-800">{stats.completed}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-red-500">
          <p className="text-sm text-gray-600">Cancelled</p>
          <p className="text-2xl font-bold text-gray-800">{stats.cancelled}</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search by booking ID, room, or guest..."
              size="md"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value={BOOKING_STATUS.BOOKED}>Booked</option>
            <option value={BOOKING_STATUS.COMPLETED}>Completed</option>
            <option value={BOOKING_STATUS.CANCELLED}>Cancelled</option>
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4">
        <p className="text-gray-600">
          Showing <span className="font-semibold">{filteredBookings.length}</span> of{' '}
          <span className="font-semibold">{bookings.length}</span> bookings
        </p>
      </div>

      <BookingTable
        bookings={filteredBookings}
        onDelete={handleDelete}
        onView={handleView}
      />

      <BookingModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
        rooms={rooms}
        users={users}
        currentUser={user}
      />

      {showDetailsModal && selectedBooking && (
        <BookingDetailsModal
          booking={selectedBooking}
          isOpen={showDetailsModal}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedBooking(null);
          }}
          onStatusChange={handleStatusChange}
          isAdmin={user.role === USER_ROLES.ADMIN}
        />
      )}
    </div>
  );
};

export default BookingsPage;