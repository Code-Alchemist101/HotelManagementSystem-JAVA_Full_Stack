import React from 'react';
import { Calendar, User, Hotel, DollarSign, Clock } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { formatDate, formatCurrency, calculateNights } from '../../utils/helpers';
import { BOOKING_STATUS, STATUS_COLORS } from '../../utils/constants';

const BookingDetailsModal = ({ booking, isOpen, onClose, onStatusChange, isAdmin }) => {
  if (!booking) return null;

  const nights = calculateNights(booking.checkInDate, booking.checkOutDate);
  const totalPrice = nights * (booking.room?.price || 0);

  const statusOptions = [
    { value: BOOKING_STATUS.BOOKED, label: 'Booked', color: 'blue' },
    { value: BOOKING_STATUS.COMPLETED, label: 'Completed', color: 'green' },
    { value: BOOKING_STATUS.CANCELLED, label: 'Cancelled', color: 'red' }
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Booking Details"
      size="lg"
    >
      <div className="space-y-6">
        {/* Booking ID and Status */}
        <div className="flex items-center justify-between pb-4 border-b">
          <div>
            <p className="text-sm text-gray-600">Booking ID</p>
            <p className="text-2xl font-bold text-gray-800">#{booking.id}</p>
          </div>
          <span className={`px-4 py-2 rounded-full text-sm font-semibold ${STATUS_COLORS[booking.status]}`}>
            {booking.status}
          </span>
        </div>

        {/* Guest Information */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <User className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-800">Guest Information</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Room Type</p>
              <p className="font-medium text-gray-800">{booking.room?.type || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Price per Night</p>
              <p className="font-medium text-gray-800">{formatCurrency(booking.room?.price || 0)}</p>
            </div>
          </div>
        </div>

        {/* Booking Dates */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-800">Booking Period</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Check-in</p>
              <p className="font-medium text-gray-800">{formatDate(booking.checkInDate)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Check-out</p>
              <p className="font-medium text-gray-800">{formatDate(booking.checkOutDate)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Duration</p>
              <p className="font-medium text-gray-800">{nights} {nights === 1 ? 'night' : 'nights'}</p>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center gap-2 mb-3">
            <DollarSign className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-800">Pricing Details</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Rate per night:</span>
              <span className="font-medium">{formatCurrency(booking.room?.price || 0)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Number of nights:</span>
              <span className="font-medium">{nights}</span>
            </div>
            <div className="border-t border-blue-200 pt-2 mt-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-800">Total Amount:</span>
                <span className="text-2xl font-bold text-blue-600">{formatCurrency(totalPrice)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Status Management (Admin Only) */}
        {isAdmin && booking.status !== BOOKING_STATUS.CANCELLED && (
          <div className="bg-gray-50 rounded-lg p-4 border-2 border-dashed border-gray-300">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold text-gray-800">Update Status</h3>
            </div>
            <div className="flex gap-2">
              {statusOptions
                .filter(option => option.value !== booking.status)
                .map(option => (
                  <Button
                    key={option.value}
                    onClick={() => onStatusChange(booking.id, option.value)}
                    variant={option.color === 'green' ? 'success' : option.color === 'red' ? 'danger' : 'primary'}
                    size="sm"
                  >
                    Mark as {option.label}
                  </Button>
                ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-4 border-t">
          <Button
            onClick={onClose}
            variant="outline"
            fullWidth
          >
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default BookingDetailsModal;