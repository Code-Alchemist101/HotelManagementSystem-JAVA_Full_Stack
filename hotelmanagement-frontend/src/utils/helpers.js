import { VALIDATION_RULES } from './constants';

/**
 * Date Formatting Utilities
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

export const formatDateTime = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatDateInput = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
};

/**
 * Currency Formatting
 */
export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount || 0);
};

/**
 * Number Formatting
 */
export const formatNumber = (number, decimals = 0) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(number || 0);
};

export const formatPercentage = (value, decimals = 1) => {
  return `${formatNumber(value, decimals)}%`;
};

/**
 * Date Calculations
 */
export const calculateNights = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return 0;
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export const calculateTotalPrice = (checkIn, checkOut, pricePerNight) => {
  const nights = calculateNights(checkIn, checkOut);
  return nights * (pricePerNight || 0);
};

export const isValidDateRange = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return false;
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  return start < end;
};

export const isFutureDate = (date) => {
  if (!date) return false;
  const inputDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return inputDate >= today;
};

export const isPastDate = (date) => {
  if (!date) return false;
  const inputDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return inputDate < today;
};

export const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const getDaysDifference = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2 - d1);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Validation Utilities
 */
export const validateEmail = (email) => {
  return VALIDATION_RULES.EMAIL_REGEX.test(email);
};

export const validateUsername = (username) => {
  return username && username.length >= VALIDATION_RULES.USERNAME_MIN_LENGTH;
};

export const validatePassword = (password) => {
  return password && password.length >= VALIDATION_RULES.PASSWORD_MIN_LENGTH;
};

export const validateRoomNumber = (roomNumber) => {
  return roomNumber && VALIDATION_RULES.ROOM_NUMBER_REGEX.test(roomNumber);
};

export const validatePhoneNumber = (phone) => {
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  return phone && phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
};

/**
 * String Utilities
 */
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const truncate = (str, maxLength = 50) => {
  if (!str) return '';
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength) + '...';
};

export const slugify = (str) => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const pluralize = (count, singular, plural) => {
  return count === 1 ? singular : (plural || singular + 's');
};

/**
 * Array Utilities
 */
export const sortBy = (array, key, order = 'asc') => {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    if (order === 'asc') {
      return aVal > bVal ? 1 : -1;
    }
    return aVal < bVal ? 1 : -1;
  });
};

export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const group = item[key];
    if (!result[group]) {
      result[group] = [];
    }
    result[group].push(item);
    return result;
  }, {});
};

export const unique = (array, key) => {
  if (!key) {
    return [...new Set(array)];
  }
  const seen = new Set();
  return array.filter(item => {
    const value = item[key];
    if (seen.has(value)) {
      return false;
    }
    seen.add(value);
    return true;
  });
};

/**
 * Object Utilities
 */
export const isEmpty = (obj) => {
  if (!obj) return true;
  if (Array.isArray(obj)) return obj.length === 0;
  if (typeof obj === 'object') return Object.keys(obj).length === 0;
  return !obj;
};

export const pick = (obj, keys) => {
  return keys.reduce((result, key) => {
    if (obj.hasOwnProperty(key)) {
      result[key] = obj[key];
    }
    return result;
  }, {});
};

export const omit = (obj, keys) => {
  const result = { ...obj };
  keys.forEach(key => delete result[key]);
  return result;
};

/**
 * Debounce and Throttle
 */
export const debounce = (func, delay = 300) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export const throttle = (func, limit = 300) => {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Status Helpers
 */
export const getStatusBadgeColor = (status) => {
  const colors = {
    BOOKED: 'blue',
    COMPLETED: 'green',
    CANCELLED: 'red',
    PENDING: 'yellow'
  };
  return colors[status] || 'gray';
};

export const isActiveBooking = (booking) => {
  const today = new Date();
  const checkIn = new Date(booking.checkInDate);
  const checkOut = new Date(booking.checkOutDate);
  return checkIn <= today && checkOut >= today && booking.status === 'BOOKED';
};

export const isUpcomingBooking = (booking) => {
  const today = new Date();
  const checkIn = new Date(booking.checkInDate);
  return checkIn > today && booking.status === 'BOOKED';
};

/**
 * Search and Filter Helpers
 */
export const searchInObject = (obj, searchTerm) => {
  if (!searchTerm) return true;
  const term = searchTerm.toLowerCase();
  return Object.values(obj).some(value => {
    if (value === null || value === undefined) return false;
    return value.toString().toLowerCase().includes(term);
  });
};

export const filterByDateRange = (items, startDate, endDate, dateKey = 'createdAt') => {
  if (!startDate && !endDate) return items;
  return items.filter(item => {
    const itemDate = new Date(item[dateKey]);
    if (startDate && itemDate < new Date(startDate)) return false;
    if (endDate && itemDate > new Date(endDate)) return false;
    return true;
  });
};

/**
 * Price Calculations
 */
export const calculateDiscount = (originalPrice, discountPercent) => {
  return originalPrice * (discountPercent / 100);
};

export const applyDiscount = (originalPrice, discountPercent) => {
  return originalPrice - calculateDiscount(originalPrice, discountPercent);
};

export const calculateTax = (amount, taxRate = 0.1) => {
  return amount * taxRate;
};

export const calculateTotal = (subtotal, taxRate = 0.1, discount = 0) => {
  const afterDiscount = applyDiscount(subtotal, discount);
  const tax = calculateTax(afterDiscount, taxRate);
  return afterDiscount + tax;
};

/**
 * Export Utilities
 */
export const downloadJSON = (data, filename = 'data.json') => {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

export const downloadCSV = (data, filename = 'data.csv') => {
  if (!data || data.length === 0) return;
  
  const headers = Object.keys(data[0]).join(',');
  const rows = data.map(row => 
    Object.values(row).map(val => `"${val}"`).join(',')
  ).join('\n');
  
  const csv = `${headers}\n${rows}`;
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

/**
 * Copy to Clipboard
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch (err) {
      document.body.removeChild(textArea);
      return false;
    }
  }
};

/**
 * Local Time Utilities
 */
export const getLocalTime = () => {
  return new Date().toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

export const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};

/**
 * Random Generators
 */
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const generateBookingCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

/**
 * Color Utilities
 */
export const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

export const getContrastColor = (hexColor) => {
  const rgb = hexToRgb(hexColor);
  if (!rgb) return '#000000';
  const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
  return brightness > 128 ? '#000000' : '#FFFFFF';
};

/**
 * Error Handling
 */
export const getErrorMessage = (error) => {
  if (typeof error === 'string') return error;
  if (error?.message) return error.message;
  if (error?.error) return error.error;
  return 'An unexpected error occurred';
};

export const isNetworkError = (error) => {
  return error?.message?.includes('Network') || 
         error?.message?.includes('fetch') ||
         error?.code === 'ECONNREFUSED';
};

/**
 * Browser Detection
 */
export const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

export const getBrowserInfo = () => {
  const ua = navigator.userAgent;
  let browserName = 'Unknown';
  
  if (ua.includes('Firefox')) browserName = 'Firefox';
  else if (ua.includes('Chrome')) browserName = 'Chrome';
  else if (ua.includes('Safari')) browserName = 'Safari';
  else if (ua.includes('Edge')) browserName = 'Edge';
  
  return {
    name: browserName,
    userAgent: ua,
    isMobile: isMobile()
  };
};

/**
 * Storage Helpers (for non-artifact environments)
 */
export const safeJSONParse = (str, fallback = null) => {
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
};

export const safeJSONStringify = (obj, fallback = '{}') => {
  try {
    return JSON.stringify(obj);
  } catch {
    return fallback;
  }
};

/**
 * Performance Helpers
 */
export const measurePerformance = (fn, label = 'Function') => {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  console.log(`${label} took ${(end - start).toFixed(2)}ms`);
  return result;
};

export const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Analytics Helpers
 */
export const calculateOccupancyRate = (totalRooms, occupiedRooms) => {
  if (totalRooms === 0) return 0;
  return (occupiedRooms / totalRooms) * 100;
};

export const calculateAverageRating = (ratings) => {
  if (!ratings || ratings.length === 0) return 0;
  const sum = ratings.reduce((acc, rating) => acc + rating, 0);
  return sum / ratings.length;
};

export const calculateRevenue = (bookings) => {
  return bookings.reduce((total, booking) => {
    if (booking.status === 'COMPLETED') {
      const nights = calculateNights(booking.checkInDate, booking.checkOutDate);
      return total + (nights * (booking.room?.price || 0));
    }
    return total;
  }, 0);
};

/**
 * Booking Helpers
 */
export const getBookingDuration = (checkIn, checkOut) => {
  const nights = calculateNights(checkIn, checkOut);
  return `${nights} ${pluralize(nights, 'night')}`;
};

export const isCheckInToday = (booking) => {
  const today = formatDateInput(new Date());
  const checkIn = formatDateInput(booking.checkInDate);
  return today === checkIn;
};

export const isCheckOutToday = (booking) => {
  const today = formatDateInput(new Date());
  const checkOut = formatDateInput(booking.checkOutDate);
  return today === checkOut;
};

export const getBookingStatus = (booking) => {
  if (booking.status === 'CANCELLED') return 'Cancelled';
  if (booking.status === 'COMPLETED') return 'Completed';
  
  const today = new Date();
  const checkIn = new Date(booking.checkInDate);
  const checkOut = new Date(booking.checkOutDate);
  
  if (today < checkIn) return 'Upcoming';
  if (today >= checkIn && today <= checkOut) return 'Active';
  if (today > checkOut) return 'Expired';
  
  return 'Booked';
};

/**
 * Form Helpers
 */
export const getFormErrors = (formData, rules) => {
  const errors = {};
  
  Object.keys(rules).forEach(field => {
    const rule = rules[field];
    const value = formData[field];
    
    if (rule.required && !value) {
      errors[field] = `${field} is required`;
    } else if (rule.minLength && value.length < rule.minLength) {
      errors[field] = `${field} must be at least ${rule.minLength} characters`;
    } else if (rule.maxLength && value.length > rule.maxLength) {
      errors[field] = `${field} must be less than ${rule.maxLength} characters`;
    } else if (rule.pattern && !rule.pattern.test(value)) {
      errors[field] = rule.message || `${field} is invalid`;
    }
  });
  
  return errors;
};

export const hasErrors = (errors) => {
  return Object.keys(errors).length > 0;
};

/**
 * API Response Helpers
 */
export const isSuccessResponse = (response) => {
  return response && response.status >= 200 && response.status < 300;
};

export const extractErrorMessage = (error) => {
  if (error.response?.data?.message) return error.response.data.message;
  if (error.response?.data?.error) return error.response.data.error;
  if (error.message) return error.message;
  return 'An error occurred';
};

// Export all utilities
export default {
  formatDate,
  formatDateTime,
  formatDateInput,
  formatCurrency,
  formatNumber,
  formatPercentage,
  calculateNights,
  calculateTotalPrice,
  isValidDateRange,
  isFutureDate,
  isPastDate,
  addDays,
  getDaysDifference,
  validateEmail,
  validateUsername,
  validatePassword,
  validateRoomNumber,
  validatePhoneNumber,
  capitalize,
  truncate,
  slugify,
  pluralize,
  sortBy,
  groupBy,
  unique,
  isEmpty,
  pick,
  omit,
  debounce,
  throttle,
  getStatusBadgeColor,
  isActiveBooking,
  isUpcomingBooking,
  searchInObject,
  filterByDateRange,
  calculateDiscount,
  applyDiscount,
  calculateTax,
  calculateTotal,
  downloadJSON,
  downloadCSV,
  copyToClipboard,
  getLocalTime,
  getGreeting,
  generateId,
  generateBookingCode,
  hexToRgb,
  getContrastColor,
  getErrorMessage,
  isNetworkError,
  isMobile,
  getBrowserInfo,
  safeJSONParse,
  safeJSONStringify,
  measurePerformance,
  sleep,
  calculateOccupancyRate,
  calculateAverageRating,
  calculateRevenue,
  getBookingDuration,
  isCheckInToday,
  isCheckOutToday,
  getBookingStatus,
  getFormErrors,
  hasErrors,
  isSuccessResponse,
  extractErrorMessage
};