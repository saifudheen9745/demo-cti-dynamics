import React from 'react';
import { X, Phone } from 'lucide-react';

const ConsultDrawer = ({ onClose, onCallAction, activeCall }) => {
  const [number, setNumber] = React.useState('');
  const [selectedSkill, setSelectedSkill] = React.useState(null);

  const skillGroups = [
    { id: 'sales', name: 'Sales Team', number: '1001' },
    { id: 'support', name: 'Technical Support', number: '1002' },
    { id: 'customer_service', name: 'Customer Service', number: '1003' },
    { id: 'billing', name: 'Billing Department', number: '1004' }
  ];

  const handleSubmit = (e) => {
    e?.preventDefault();
    const numberToCall = selectedSkill ? selectedSkill.number : number;
    if (!numberToCall) return;

    if (activeCall) {
      onCallAction.hold?.(activeCall.id);
    }
    onCallAction.initiate(numberToCall);
    onClose();
  };

  const handleKeyPress = (num) => {
    if (selectedSkill) {
      setSelectedSkill(null);
    }
    setNumber(prev => prev + num);
  };

  return (
    <div className="absolute inset-0 bg-black bg-opacity-50 z-50">
      <div className="absolute right-0 top-0 h-full w-[300px] bg-white shadow-lg flex flex-col">
        {/* Header */}
        <div className="px-4 py-3 border-b flex items-center justify-between flex-shrink-0">
          <h2 className="text-base font-semibold">Consult Call</h2>
          <button 
            onClick={onClose}
            className="p-0.5 hover:bg-gray-100 rounded-full"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col h-full">
          <form onSubmit={handleSubmit} className="space-y-4 flex-1">
            {/* Skill Group Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Skill Group
              </label>
              <select
                value={selectedSkill?.id || ''}
                onChange={(e) => {
                  const skill = skillGroups.find(s => s.id === e.target.value);
                  setSelectedSkill(skill);
                  setNumber('');
                }}
                disabled={!!number}
                className="w-full px-3 py-2 text-sm border rounded-md
                  focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a skill group</option>
                {skillGroups.map(skill => (
                  <option key={skill.id} value={skill.id}>
                    {skill.name} ({skill.number})
                  </option>
                ))}
              </select>
            </div>

            <div className="text-sm font-medium text-gray-700">Or Enter Number</div>

            {/* Number Input */}
            <div>
              <input
                type="tel"
                value={number}
                onChange={(e) => {
                  setSelectedSkill(null);
                  setNumber(e.target.value);
                }}
                className="w-full px-3 py-2 border rounded-md text-sm font-medium 
                  focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter phone number"
                disabled={!!selectedSkill}
              />
            </div>

            {/* Keypad */}
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, '*', 0, '#'].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleKeyPress(num)}
                  disabled={!!selectedSkill}
                  className="h-10 rounded-md bg-gray-50 hover:bg-gray-100 
                    text-gray-900 text-sm font-medium flex items-center justify-center
                    transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
                disabled={!!selectedSkill}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-md 
                  text-sm font-medium hover:bg-gray-200 transition-colors duration-200
                  disabled:opacity-50 disabled:cursor-not-allowed"
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
                disabled={!selectedSkill && !number}
              >
                Call
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ConsultDrawer; 