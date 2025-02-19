import React from 'react';
import { Phone } from 'lucide-react';

const TransferConsultForm = ({ type, onClose, onSubmit }) => {
  const [number, setNumber] = React.useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!number) return;
    onSubmit(number);
  };

  const handleKeyPress = (num) => {
    setNumber(prev => prev + num);
  };

  return (
    <div className="p-4 flex flex-col h-full">
      <form onSubmit={handleSubmit} className="space-y-4 flex-1">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Enter Number
          </label>
          <input
            type="tel"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            className="w-full px-3 py-2 border rounded-md text-sm font-medium 
              focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter phone number"
            required
          />
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, '*', 0, '#'].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => handleKeyPress(num)}
              className="h-10 rounded-md bg-gray-50 hover:bg-gray-100 
                text-gray-900 text-sm font-medium flex items-center justify-center
                transition-colors duration-200"
            >
              {num}
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2 mt-4">
          <button
            type="button"
            onClick={() => setNumber(prev => prev.slice(0, -1))}
            className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-md 
              text-sm font-medium hover:bg-gray-200 transition-colors duration-200"
          >
            Delete
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md 
              text-sm font-medium hover:bg-gray-50 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md 
              text-sm font-medium hover:bg-blue-700 transition-colors duration-200
              disabled:bg-gray-300 disabled:cursor-not-allowed"
            disabled={!number}
          >
            {type.includes('transfer') ? 'Transfer' : 'Conference'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TransferConsultForm; 