import React, { useEffect } from "react";
import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react";

const Toast = ({ message, type = "success", isVisible, onClose, duration = 5000 }) => {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle size={20} className="text-green-600" />;
      case "error":
        return <XCircle size={20} className="text-red-600" />;
      case "warning":
        return <AlertCircle size={20} className="text-yellow-600" />;
      case "info":
        return <Info size={20} className="text-blue-600" />;
      default:
        return <CheckCircle size={20} className="text-green-600" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200";
      case "error":
        return "bg-red-50 border-red-200";
      case "warning":
        return "bg-yellow-50 border-yellow-200";
      case "info":
        return "bg-blue-50 border-blue-200";
      default:
        return "bg-green-50 border-green-200";
    }
  };

  const getTextColor = () => {
    switch (type) {
      case "success":
        return "text-green-800";
      case "error":
        return "text-red-800";
      case "warning":
        return "text-yellow-800";
      case "info":
        return "text-blue-800";
      default:
        return "text-green-800";
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 animate-fadeIn">
      <div className={`flex items-center p-4 border rounded-lg shadow-lg max-w-sm ${getBgColor()}`}>
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        <div className={`ml-3 text-sm font-medium ${getTextColor()}`}>
          {message}
        </div>
        <button
          onClick={onClose}
          className={`ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 hover:bg-opacity-20 hover:bg-gray-600 ${getTextColor()}`}
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default Toast;
