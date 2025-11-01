
import React from 'react';
import { CheckIcon } from './icons/Icons';

interface ToastProps {
  message: string;
  isVisible: boolean;
}

export const Toast: React.FC<ToastProps> = ({ message, isVisible }) => {
  return (
    <div
      className={`fixed bottom-10 right-10 z-[100] flex items-center gap-3 rounded-lg px-6 py-3 text-white shadow-lg transition-all duration-500 ease-in-out transform-gpu bg-gray-800 border border-purple-500/50
        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0 pointer-events-none'}`}
      role="alert"
      aria-live="assertive"
    >
      <CheckIcon className="h-6 w-6 text-purple-400" />
      <span className="font-medium">{message}</span>
    </div>
  );
};
