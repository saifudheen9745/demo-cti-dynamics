import React from 'react';
import { X } from 'lucide-react';

const Sidebar = ({ title, isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50">
      <div className="absolute inset-0 bg-black bg-opacity-50" />
      <div className="absolute right-0 top-0 h-full w-[300px] bg-white shadow-lg">
        <div className="flex flex-col h-full">
          <div className="p-4 border-b flex-shrink-0">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              <button 
                onClick={onClose}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;