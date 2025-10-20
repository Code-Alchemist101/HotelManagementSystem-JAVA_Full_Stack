import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import api from '../../api/apiService';
import RoomCard from './RoomCard';
import RoomModal from './RoomModal';
import { USER_ROLES, ROOM_TYPES } from '../../utils/constants';
import SearchBar from '../common/SearchBar';

const RoomsPage = ({ user, showToast }) => {
  const [rooms, setRooms] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: 'all',
    availability: 'all',
    priceRange: 'all'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      setLoading(true);
      const data = await api.getRooms();
      setRooms(data);
    } catch (error) {
      showToast('Failed to load rooms: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingRoom) {
        await api.updateRoom(editingRoom.id, formData);
        showToast('Room updated successfully!', 'success');
      } else {
        await api.createRoom(formData);
        showToast('Room created successfully!', 'success');
      }
      await loadRooms();
      setShowModal(false);
      setEditingRoom(null);
    } catch (error) {
      showToast('Error saving room: ' + error.message, 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      try {
        await api.deleteRoom(id);
        showToast('Room deleted successfully!', 'success');
        await loadRooms();
      } catch (error) {
        showToast('Error deleting room: ' + error.message, 'error');
      }
    }
  };

  const openEditModal = (room) => {
    setEditingRoom(room);
    setShowModal(true);
  };

  const openCreateModal = () => {
    setEditingRoom(null);
    setShowModal(true);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const filteredRooms = rooms.filter(room => {
    // Search filter
    const matchesSearch = 
      room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.type.toLowerCase().includes(searchTerm.toLowerCase());

    // Type filter
    const matchesType = filters.type === 'all' || room.type === filters.type;

    // Availability filter
    const matchesAvailability = 
      filters.availability === 'all' ||
      (filters.availability === 'available' && room.available) ||
      (filters.availability === 'occupied' && !room.available);

    // Price range filter
    let matchesPrice = true;
    if (filters.priceRange === 'low') matchesPrice = room.price < 100;
    else if (filters.priceRange === 'medium') matchesPrice = room.price >= 100 && room.price < 200;
    else if (filters.priceRange === 'high') matchesPrice = room.price >= 200;

    return matchesSearch && matchesType && matchesAvailability && matchesPrice;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-gray-600">Loading rooms...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Room Management</h2>
        {user.role === USER_ROLES.ADMIN && (
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-md"
          >
            <Plus className="w-4 h-4" />
            Add Room
          </button>
        )}
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-2">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search by room number or type..."
              size="md"
            />
          </div>

          <select
            value={filters.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            {ROOM_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>

          <select
            value={filters.availability}
            onChange={(e) => handleFilterChange('availability', e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="occupied">Occupied</option>
          </select>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-600" />
          <span className="text-sm text-gray-600">Price Range:</span>
          <div className="flex gap-2">
            {[
              { value: 'all', label: 'All' },
              { value: 'low', label: '< $100' },
              { value: 'medium', label: '$100-$200' },
              { value: 'high', label: '> $200' }
            ].map(option => (
              <button
                key={option.value}
                onClick={() => handleFilterChange('priceRange', option.value)}
                className={`px-3 py-1 rounded-full text-sm transition ${
                  filters.priceRange === option.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4">
        <p className="text-gray-600">
          Showing <span className="font-semibold">{filteredRooms.length}</span> of{' '}
          <span className="font-semibold">{rooms.length}</span> rooms
        </p>
      </div>

      {filteredRooms.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <p className="text-gray-500 text-lg">
            {searchTerm || filters.type !== 'all' || filters.availability !== 'all' || filters.priceRange !== 'all'
              ? 'No rooms found matching your filters.'
              : 'No rooms available.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.map(room => (
            <RoomCard
              key={room.id}
              room={room}
              onEdit={openEditModal}
              onDelete={handleDelete}
              isAdmin={user.role === USER_ROLES.ADMIN}
            />
          ))}
        </div>
      )}

      <RoomModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingRoom(null);
        }}
        onSubmit={handleSubmit}
        editingRoom={editingRoom}
      />
    </div>
  );
};

export default RoomsPage;