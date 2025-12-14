import React, { useState } from 'react';
import { Hotel, Eye, EyeOff, AlertCircle } from 'lucide-react';
import api from '../../api/apiService';
import { USER_ROLES } from '../../utils/constants';

const LoginPage = ({ onLogin, showToast }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: USER_ROLES.USER
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    if (apiError) setApiError('');
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = 'Username is required';
    else if (formData.username.length < 3) newErrors.username = 'Min 3 chars required';

    if (!isLogin) {
      if (!formData.email) newErrors.email = 'Email is required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email address';
    }

    if (!formData.password) newErrors.password = 'Password is required';
    else if (!isLogin && formData.password.length < 6) newErrors.password = 'Min 6 chars required';

    if (!isLogin) {
      if (!formData.confirmPassword) newErrors.confirmPassword = 'Confirmation required';
      else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (isLogin) {
        const data = await api.login({ username: formData.username, password: formData.password });
        api.setToken(data.token);

        // Fixed: Use ID from login response
        onLogin({ ...data, userId: data.userId });
      } else {
        await api.register({ ...formData });
        showToast('Registration successful! Please login.', 'success');
        setIsLogin(true);
        setFormData({ username: '', email: '', password: '', confirmPassword: '', role: USER_ROLES.USER });
      }
    } catch (err) {
      const errorMessage = err.message || 'An error occurred';
      setApiError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F2F2F7] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-blue-400/20 rounded-full blur-[100px] animate-float" />
        <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] bg-purple-400/20 rounded-full blur-[100px] animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <div className="glass-card w-full max-w-[440px] p-8 md:p-12 relative z-10 animate-slide-up">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-500/30">
            <Hotel className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-[#1D1D1F] tracking-tight mb-2">
            Welcome Back
          </h1>
          <p className="text-[#86868B]">
            Sign in to manage your property
          </p>
        </div>

        {/* Custom Toggle */}
        <div className="bg-gray-100/50 p-1.5 rounded-full flex mb-8 relative">
          <div
            className="absolute top-1.5 bottom-1.5 bg-white rounded-full shadow-sm transition-all duration-300 ease-out"
            style={{
              left: isLogin ? '6px' : '50%',
              width: 'calc(50% - 9px)'
            }}
          />
          <button
            type="button"
            onClick={() => setIsLogin(true)}
            className={`flex-1 relative z-10 py-2.5 text-sm font-medium transition-colors duration-300 ${isLogin ? 'text-[#1D1D1F]' : 'text-[#86868B]'}`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setIsLogin(false)}
            className={`flex-1 relative z-10 py-2.5 text-sm font-medium transition-colors duration-300 ${!isLogin ? 'text-[#1D1D1F]' : 'text-[#86868B]'}`}
          >
            Create Account
          </button>
        </div>

        {apiError && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50/80 border border-red-100 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-[#FF3B30] mt-0.5 flex-shrink-0" />
            <p className="text-sm text-[#FF3B30] font-medium leading-relaxed">{apiError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-5">
            <div>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={`input-primary ${errors.username ? 'bg-red-50 text-red-900 placeholder-red-400' : ''}`}
                placeholder="Username"
                disabled={loading}
              />
              {errors.username && <p className="mt-2 text-xs text-[#FF3B30] ml-1">{errors.username}</p>}
            </div>

            {!isLogin && (
              <div className="animate-fade-in">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`input-primary ${errors.email ? 'bg-red-50 text-red-900 placeholder-red-400' : ''}`}
                  placeholder="Email address"
                  disabled={loading}
                />
                {errors.email && <p className="mt-2 text-xs text-[#FF3B30] ml-1">{errors.email}</p>}
              </div>
            )}

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`input-primary pr-12 ${errors.password ? 'bg-red-50 text-red-900 placeholder-red-400' : ''}`}
                placeholder="Password"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                disabled={loading}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
              {errors.password && <p className="mt-2 text-xs text-[#FF3B30] ml-1">{errors.password}</p>}
            </div>

            {!isLogin && (
              <div className="animate-fade-in space-y-5">
                <div>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`input-primary ${errors.confirmPassword ? 'bg-red-50 text-red-900 placeholder-red-400' : ''}`}
                    placeholder="Confirm password"
                    disabled={loading}
                  />
                  {errors.confirmPassword && <p className="mt-2 text-xs text-[#FF3B30] ml-1">{errors.confirmPassword}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#86868B] uppercase tracking-wider mb-2 ml-1">
                    Account Type
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: USER_ROLES.USER, label: 'Guest' },
                      { value: USER_ROLES.ADMIN, label: 'Admin' }
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, role: option.value }))}
                        className={`py-3 rounded-2xl text-sm font-medium transition-all duration-200 border ${formData.role === option.value
                          ? 'bg-blue-50 border-blue-200 text-[#007AFF]'
                          : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                          }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn btn-primary mt-8 shadow-blue-500/25 hover:shadow-blue-500/40"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing...
              </span>
            ) : (
              isLogin ? 'Sign In' : 'Create Account'
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100">
          <p className="text-xs text-center text-[#86868B]">
            Demo Access: <span className="font-medium text-[#1D1D1F]">admin/admin123</span> or <span className="font-medium text-[#1D1D1F]">user/user123</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;