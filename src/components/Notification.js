import React, { useEffect } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

export default function Notification({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const isSuccess = type === 'success';
  const bgColor = isSuccess ? 'bg-green-500' : 'bg-red-500';
  const Icon = isSuccess ? CheckCircle : XCircle;

  if (!message) return null;

  return (
    <div className={`fixed top-5 right-5 text-white px-6 py-4 rounded-lg shadow-lg flex items-center z-[9999] transition-transform transform-gpu animate-slide-in ${bgColor}`}>
      <Icon className="mr-3 h-6 w-6" />
      <span>{message}</span>
    </div>
  );
}
