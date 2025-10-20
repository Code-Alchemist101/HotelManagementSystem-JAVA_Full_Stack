// FIXED: Updated to include ALL room types from the database
export const ROOM_TYPES = [
  'Single',
  'Double',
  'Twin',
  'Suite',
  'Deluxe',
  'Deluxe Single',
  'Deluxe Double',
  'Deluxe Twin',
  'Family Room',
  'Executive Single',
  'Executive Double',
  'Executive Suite',
  'Business Suite',
  'Junior Suite',
  'Luxury Suite',
  'Presidential Suite',
  'Honeymoon Suite',
  'Penthouse Suite',
  'Royal Suite',
  'Studio Apartment',
  'One Bedroom Suite',
  'Two Bedroom Suite',
  'Garden View Room',
  'Ocean View Room',
  'Mountain View Room',
  'Accessible Room',
  'Economy Single',
  'Economy Double',
  'Budget Twin',
  'Dormitory 4-Bed',
  'Dormitory 6-Bed',
  'Dormitory 8-Bed'
];

// Booking Status
export const BOOKING_STATUS = {
  BOOKED: 'BOOKED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED'
};

// User Roles
export const USER_ROLES = {
  USER: 'USER',
  ADMIN: 'ADMIN'
};

// Status Colors for UI
export const STATUS_COLORS = {
  BOOKED: 'bg-blue-100 text-blue-800 border border-blue-200',
  COMPLETED: 'bg-green-100 text-green-800 border border-green-200',
  CANCELLED: 'bg-red-100 text-red-800 border border-red-200'
};

// Availability Colors
export const AVAILABILITY_COLORS = {
  available: 'bg-green-100 text-green-800 border border-green-200',
  occupied: 'bg-red-100 text-red-800 border border-red-200'
};

// Price Ranges for Filtering
export const PRICE_RANGES = {
  LOW: { min: 0, max: 100, label: '< $100' },
  MEDIUM: { min: 100, max: 200, label: '$100 - $200' },
  HIGH: { min: 200, max: Infinity, label: '> $200' }
};

// Validation Rules
export const VALIDATION_RULES = {
  USERNAME_MIN_LENGTH: 3,
  PASSWORD_MIN_LENGTH: 6,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  ROOM_NUMBER_REGEX: /^[A-Z0-9-]+$/i
};

// API Configuration
export const API_CONFIG = {
  BASE_URL: 'http://localhost:8080/api',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100]
};

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  INPUT: 'yyyy-MM-dd',
  FULL: 'MMMM dd, yyyy, hh:mm a'
};

// Toast Types
export const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

// Toast Duration (milliseconds)
export const TOAST_DURATION = {
  SHORT: 3000,
  MEDIUM: 5000,
  LONG: 7000
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  TOKEN_EXPIRED: 'Your session has expired. Please login again.',
  BOOKING_CONFLICT: 'Room is not available for selected dates.',
  INVALID_CREDENTIALS: 'Invalid username or password.',
  USER_EXISTS: 'Username or email already exists.'
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN: 'Login successful!',
  LOGOUT: 'Logged out successfully',
  REGISTER: 'Registration successful! Please login.',
  ROOM_CREATED: 'Room created successfully!',
  ROOM_UPDATED: 'Room updated successfully!',
  ROOM_DELETED: 'Room deleted successfully!',
  BOOKING_CREATED: 'Booking created successfully!',
  BOOKING_UPDATED: 'Booking updated successfully!',
  BOOKING_CANCELLED: 'Booking cancelled successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!'
};

// Feature Flags
export const FEATURES = {
  ENABLE_NOTIFICATIONS: true,
  ENABLE_ANALYTICS: true,
  ENABLE_EXPORT: false,
  ENABLE_DARK_MODE: false,
  ENABLE_MULTI_LANGUAGE: false
};

// Keyboard Shortcuts
export const SHORTCUTS = {
  SEARCH: 'ctrl+k',
  NEW_BOOKING: 'ctrl+n',
  LOGOUT: 'ctrl+l',
  DASHBOARD: 'ctrl+d'
};

// Chart Colors
export const CHART_COLORS = {
  PRIMARY: '#3B82F6',
  SUCCESS: '#10B981',
  WARNING: '#F59E0B',
  DANGER: '#EF4444',
  INFO: '#6366F1',
  PURPLE: '#8B5CF6'
};

// Breakpoints
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536
};

// Animation Durations
export const ANIMATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500
};

// Local Storage Keys
export const STORAGE_KEYS = {
  THEME: 'hotel_theme',
  LANGUAGE: 'hotel_language',
  PREFERENCES: 'hotel_preferences'
};

export default {
  ROOM_TYPES,
  BOOKING_STATUS,
  USER_ROLES,
  STATUS_COLORS,
  AVAILABILITY_COLORS,
  PRICE_RANGES,
  VALIDATION_RULES,
  API_CONFIG,
  PAGINATION,
  DATE_FORMATS,
  TOAST_TYPES,
  TOAST_DURATION,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  FEATURES,
  SHORTCUTS,
  CHART_COLORS,
  BREAKPOINTS,
  ANIMATION,
  STORAGE_KEYS
};