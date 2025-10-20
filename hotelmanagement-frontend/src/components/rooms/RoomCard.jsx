import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';
import { AVAILABILITY_COLORS } from '../../utils/constants';

const RoomCard = ({ room, onEdit, onDelete, isAdmin }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-800">{room.roomNumber}</h3>
          <p className="text-gray-600">{room.type}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
          room.available ? AVAILABILITY_COLORS.available : AVAILABILITY_COLORS.occupied
        }`}>
          {room.available ? 'Available' : 'Occupied'}
        </span>
      </div>

      <div className="mb-4">
        <p className="text-2xl font-bold text-blue-600">
          {formatCurrency(room.price)}/night
        </p>
      </div>

      {isAdmin && (
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(room)}
            className="flex-1 flex items-center justify-center gap-2 bg-yellow-500 text-white px-3 py-2 rounded-lg hover:bg-yellow-600 transition"
          >
            <Edit2 className="w-4 h-4" />
            Edit
          </button>
          <button
            onClick={() => onDelete(room.id)}
            className="flex-1 flex items-center justify-center gap-2 bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default RoomCard;