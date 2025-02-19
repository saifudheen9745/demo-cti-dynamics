import React from 'react';
import { Phone } from 'lucide-react';

const ConsultForm = ({ onClose, onSubmit }) => {
  const [inputValue, setInputValue] = React.useState('');
  const [selectedSkill, setSelectedSkill] = React.useState(null);

  const skillGroups = [
    { id: 'sales', name: 'Sales Team', number: '1001' },
    { id: 'support', name: 'Technical Support', number: '1002' },
    { id: 'customer_service', name: 'Customer Service', number: '1003' },
    { id: 'billing', name: 'Billing Department', number: '1004' }
  ];

  const handleKeyPress = (key) => {
    if (selectedSkill) {
      setSelectedSkill(null);
    }
    setInputValue(prev => prev + key);
  };

  const handleSubmit = () => {
    const numberToCall = selectedSkill ? selectedSkill.number : inputValue;
    onSubmit(numberToCall);
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-4 space-y-4">
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
              setInputValue('');
            }}
            disabled={!!inputValue}
            className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 
              rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
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
        <input
          type="text"
          value={inputValue}
          onChange={(e) => {
            setSelectedSkill(null);
            setInputValue(e.target.value);
          }}
          placeholder="Enter phone number"
          disabled={!!selectedSkill}
          className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 
            rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        />

        {/* Dialpad */}
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, '*', 0, '#'].map((key) => (
            <button
              key={key}
              onClick={() => handleKeyPress(key)}
              disabled={!!selectedSkill}
              className="aspect-square flex items-center justify-center text-base font-medium
                bg-gray-50 rounded-md hover:bg-gray-100 text-gray-900 
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {key}
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 
              rounded-md hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!selectedSkill && !inputValue}
            className="px-4 py-2 text-sm font-medium text-white bg-gray-400 
              rounded-md hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed
              flex items-center justify-center gap-2"
          >
            <Phone className="h-4 w-4" />
            <span>Consult</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConsultForm; 