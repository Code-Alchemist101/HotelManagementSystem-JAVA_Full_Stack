const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';

// Token management (localStorage)
const api = {
  setToken: (token) => {
    localStorage.setItem('token', token);
  },

  getToken: () => localStorage.getItem('token'),

  setCurrentUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  clearAuth: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getHeaders: () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  },

  // Enhanced error handling
  handleResponse: async (response) => {
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || error.message || `HTTP ${response.status}`);
    }
    return response.json();
  },

  // Auth endpoints
  register: async (data) => {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return api.handleResponse(response);
  },

  login: async (data) => {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return api.handleResponse(response);
  },

  // Room endpoints
  getRooms: async () => {
    const response = await fetch(`${API_BASE}/rooms`, {
      headers: api.getHeaders()
    });
    return api.handleResponse(response);
  },

  getRoom: async (id) => {
    const response = await fetch(`${API_BASE}/rooms/${id}`, {
      headers: api.getHeaders()
    });
    return api.handleResponse(response);
  },

  createRoom: async (data) => {
    const response = await fetch(`${API_BASE}/rooms`, {
      method: 'POST',
      headers: api.getHeaders(),
      body: JSON.stringify(data)
    });
    return api.handleResponse(response);
  },

  updateRoom: async (id, data) => {
    const response = await fetch(`${API_BASE}/rooms/${id}`, {
      method: 'PUT',
      headers: api.getHeaders(),
      body: JSON.stringify(data)
    });
    return api.handleResponse(response);
  },

  deleteRoom: async (id) => {
    const response = await fetch(`${API_BASE}/rooms/${id}`, {
      method: 'DELETE',
      headers: api.getHeaders()
    });
    if (!response.ok) {
      throw new Error('Failed to delete room');
    }
    return true;
  },

  // Booking endpoints
  getBookings: async () => {
    const response = await fetch(`${API_BASE}/bookings`, {
      headers: api.getHeaders()
    });
    return api.handleResponse(response);
  },

  getBooking: async (id) => {
    const response = await fetch(`${API_BASE}/bookings/${id}`, {
      headers: api.getHeaders()
    });
    return api.handleResponse(response);
  },

  createBooking: async (data) => {
    const response = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: api.getHeaders(),
      body: JSON.stringify(data)
    });
    return api.handleResponse(response);
  },

  updateBooking: async (id, data) => {
    const response = await fetch(`${API_BASE}/bookings/${id}`, {
      method: 'PUT',
      headers: api.getHeaders(),
      body: JSON.stringify(data)
    });
    return api.handleResponse(response);
  },

  deleteBooking: async (id) => {
    const response = await fetch(`${API_BASE}/bookings/${id}`, {
      method: 'DELETE',
      headers: api.getHeaders()
    });
    if (!response.ok) {
      throw new Error('Failed to delete booking');
    }
    return true;
  },

  getUserBookings: async (userId) => {
    const response = await fetch(`${API_BASE}/bookings/user/${userId}`, {
      headers: api.getHeaders()
    });
    return api.handleResponse(response);
  },

  getRoomBookings: async (roomId) => {
    const response = await fetch(`${API_BASE}/bookings/room/${roomId}`, {
      headers: api.getHeaders()
    });
    return api.handleResponse(response);
  },

  // User endpoints
  getUsers: async () => {
    const response = await fetch(`${API_BASE}/users`, {
      headers: api.getHeaders()
    });
    return api.handleResponse(response);
  },

  getUser: async (id) => {
    const response = await fetch(`${API_BASE}/users/${id}`, {
      headers: api.getHeaders()
    });
    return api.handleResponse(response);
  },

  getCurrentUserInfo: async (username) => {
    const users = await api.getUsers();
    return users.find(u => u.username === username);
  },

  updateUser: async (id, data) => {
    const response = await fetch(`${API_BASE}/users/${id}`, {
      method: 'PUT',
      headers: api.getHeaders(),
      body: JSON.stringify(data)
    });
    return api.handleResponse(response);
  },

  deleteUser: async (id) => {
    const response = await fetch(`${API_BASE}/users/${id}`, {
      method: 'DELETE',
      headers: api.getHeaders()
    });
    return api.handleResponse(response);
  }
};

export default api;