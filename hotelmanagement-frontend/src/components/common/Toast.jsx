import React, { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

const Toast = ({ message, type = 'info', onClose, duration = 5000 }) => {
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const config = {
    success: {
      icon: CheckCircle,
      bg: 'bg-green-100',
      border: 'border-green-500',
      text: 'text-green-800',
      iconColor: 'text-green-600'
    },
    error: {
      icon: XCircle,
      bg: 'bg-red-100',
      border: 'border-red-500',
      text: 'text-red-800',
      iconColor: 'text-red-600'
    },
    warning: {
      icon: AlertCircle,
      bg: 'bg-yellow-100',
      border: 'border-yellow-500',
      text: 'text-yellow-800',
      iconColor: 'text-yellow-600'
    },
    info: {
      icon: Info,
      bg: 'bg-blue-100',
      border: 'border-blue-500',
      text: 'text-blue-800',
      iconColor: 'text-blue-600'
    }
  };

  const { icon: Icon, bg, border, text, iconColor } = config[type] || config.info;

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slideInRight">
      <div className={`${bg} ${text} border-l-4 ${border} rounded-lg shadow-lg p-4 max-w-md flex items-start gap-3`}>
        <Icon className={`w-5 h-5 ${iconColor} flex-shrink-0 mt-0.5`} />
        <p className="flex-1 text-sm font-medium">{message}</p>
        <button
          onClick={onClose}
          className={`${text} hover:opacity-70 transition flex-shrink-0`}
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Toast;