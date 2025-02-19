import React from 'react';
import { X, Phone, Delete } from 'lucide-react';

const InitiateCallDrawer = ({ onClose, onCall }) => {
  const [inputValue, setInputValue] = React.useState('');

  const handleKeyPress = (key) => {
    setInputValue(prev => prev + key);
  };

  const handleDelete = () => {
    setInputValue(prev => prev.slice(0, -1));
  };

  const handleClear = () => {
    setInputValue('');
  };

  return (
    <div className="fixed inset-y-0 right-0 w-[420px] bg-white shadow-xl flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <h2 className="text-xl font-semibold text-gray-900">Make a Call</h2>
        <button 
          onClick={onClose}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <X className="h-6 w-6 text-gray-500" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Number Display */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Enter Number
            </label>
            <div className="relative">
              <input
                type="tel"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full px-4 py-3 text-xl font-medium text-gray-900 border border-gray-300 
                  rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter phone number"
              />
              {inputValue && (
                <button
                  onClick={handleClear}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              )}
            </div>
          </div>

          {/* Dialpad */}
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, '*', 0, '#'].map((key) => (
              <button
                key={key}
                onClick={() => handleKeyPress(key)}
                className="aspect-square flex items-center justify-center text-2xl font-medium
                  bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
              >
                {key}
              </button>
            ))}
          </div>

          {/* Delete Button */}
          <div className="flex justify-center">
            <button
              onClick={handleDelete}
              disabled={!inputValue}
              className="p-3 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Delete className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 border-t bg-gray-50">
        <button
          onClick={() => onCall(inputValue)}
          disabled={!inputValue}
          className="w-full px-4 py-4 bg-blue-600 text-white rounded-xl text-base font-medium
            hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
            disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          <div className="flex items-center justify-center space-x-2">
            <Phone className="h-5 w-5" />
            <span>Make Call</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default InitiateCallDrawer; 