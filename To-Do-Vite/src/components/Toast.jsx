import { useEffect } from 'react';
import { FaCheck, FaTimes, FaInfo, FaExclamationTriangle } from 'react-icons/fa';

const Toast = ({ message, type = 'info', onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: <FaCheck className="text-green-400" />,
    error: <FaTimes className="text-red-400" />,
    info: <FaInfo className="text-blue-400" />,
    warning: <FaExclamationTriangle className="text-yellow-400" />
  };

  const bgColors = {
    success: 'bg-green-500/20 border-green-500',
    error: 'bg-red-500/20 border-red-500',
    info: 'bg-blue-500/20 border-blue-500',
    warning: 'bg-yellow-500/20 border-yellow-500'
  };

  return (
    <div className={`fixed bottom-4 right-4 p-4 rounded-lg border backdrop-blur-lg ${bgColors[type]} text-white shadow-lg flex items-center gap-2 min-w-[200px] max-w-[400px] animate-slide-in`}>
      {icons[type]}
      <p className="flex-1">{message}</p>
      <button
        onClick={onClose}
        className="text-white/60 hover:text-white transition-colors"
      >
        <FaTimes />
      </button>
    </div>
  );
};

export default Toast; 