import React, { useState, useEffect } from 'react';
import { BOOKING_STATUS, USER_ROLES } from '../../utils/constants';
import { calculateNights, formatCurrency } from '../../utils/helpers';
import Modal from '../common/Modal';
import Button from '../common/Button';

const BookingModal = ({ isOpen, onClose, onSubmit, rooms, users, currentUser }) => {
  const [formData, setFormData] = useState({
    userId: '',
    roomId: '',
    checkInDate: '',
    checkOutDate: '',
    status: BOOKING_STATUS.BOOKED
  });

  const [selectedRoom, setSelectedRoom] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && currentUser) {
      // Set default userId based on role
      const defaultUserId = currentUser.role === USER_ROLES.ADMIN ? '' : currentUser.userId || '';
      setFormData({
        userId: defaultUserId,
        roomId: '',
        checkInDate: '',
        checkOutDate: '',
        status: BOOKING_STATUS.BOOKED
      });
      setSelectedRoom(null);
      setError('');
    }
  }, [isOpen, currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    setError('');

    if (name === 'roomId') {
      const room = rooms.find(r => r.id === parseInt(value));
      setSelectedRoom(room);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.userId) {
      setError('Please select a user');
      return;
    }

    if (!formData.roomId) {
      setError('Please select a room');
      return;
    }

    if (!formData.checkInDate || !formData.checkOutDate) {
      setError('Please select check-in and check-out dates');
      return;
    }
    
    if (new Date(formData.checkInDate) >= new Date(formData.checkOutDate)) {
      setError('Check-out date must be after check-in date');
      return;
    }

    // Convert string IDs to numbers
    const bookingData = {
      userId: parseInt(formData.userId),
      roomId: parseInt(formData.roomId),
      checkInDate: formData.checkInDate,
      checkOutDate: formData.checkOutDate,
      status: formData.status
    };

    onSubmit(bookingData);
  };

  const nights = formData.checkInDate && formData.checkOutDate 
    ? calculateNights(formData.checkInDate, formData.checkOutDate)
    : 0;

  const totalPrice = selectedRoom && nights > 0
    ? nights * selectedRoom.price
    : 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="New Booking"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {currentUser?.role === USER_ROLES.ADMIN ? (
          <div>
            <label className="block text-sm font-medium mb-1">User *</label>
            <select
              name="userId"
              required
              value={formData.userId}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select User</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.username} ({user.email})
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium mb-1">User</label>
            <input
              type="text"
              value={currentUser?.username || 'Loading...'}
              disabled
              className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-700"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">Room *</label>
          <select
            name="roomId"
            required
            value={formData.roomId}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Room</option>
            {rooms.filter(r => r.available).map(room => (
              <option key={room.id} value={room.id}>
                {room.roomNumber} - {room.type} ({formatCurrency(room.price)}/night)
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Check-in Date *</label>
          <input
            type="date"
            name="checkInDate"
            required
            min={new Date().toISOString().split('T')[0]}
            value={formData.checkInDate}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Check-out Date *</label>
          <input
            type="date"
            name="checkOutDate"
            required
            min={formData.checkInDate || new Date().toISOString().split('T')[0]}
            value={formData.checkOutDate}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {nights > 0 && selectedRoom && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Nights:</span>
              <span className="font-semibold">{nights}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Price per night:</span>
              <span className="font-semibold">{formatCurrency(selectedRoom.price)}</span>
            </div>
            <div className="border-t border-blue-200 pt-2 mt-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-800">Total:</span>
                <span className="font-bold text-blue-600 text-lg">
                  {formatCurrency(totalPrice)}
                </span>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="p-3 rounded-lg text-sm bg-red-100 text-red-700 border border-red-200">
            {error}
          </div>
        )}

        <div className="flex gap-2 pt-4">
          <Button
            type="submit"
            variant="primary"
            fullWidth
          >
            Create Booking
          </Button>
          <Button
            type="button"
            onClick={onClose}
            variant="outline"
            fullWidth
          >
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default BookingModal;