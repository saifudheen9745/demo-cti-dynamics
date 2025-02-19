import React from 'react';
import { X } from 'lucide-react';

const TransferDrawer = ({ isOpen, onClose }) => {
  const [selectedOption, setSelectedOption] = React.useState('');
  const [formData, setFormData] = React.useState({
    tpinOption: '',
    language: '',
    referenceId: '',
    icNumber: '',
    agentGroup: '',
    ivrDeclaration: '',
    opportunityId: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTransfer = () => {
    console.log('Transfer with data:', { selectedOption, formData });
    onClose();
  };

  const renderFormFields = () => {
    switch (selectedOption) {
      case 'TPIN':
        return (
          <>
            <div className="space-y-2">
              <label className="block text-sm text-gray-700">TPIN Option</label>
              <select
                name="tpinOption"
                value={formData.tpinOption}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm
                  focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Select TPIN Option</option>
                <option value="verify">TPIN Verification</option>
                <option value="create">TPIN Creation</option>
                <option value="reset">TPIN Reset</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm text-gray-700">Language</label>
              <select
                name="language"
                value={formData.language}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm
                  focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Select Language</option>
                <option value="english">English</option>
                <option value="malay">Malay</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm text-gray-700">Reference ID</label>
              <input
                type="text"
                name="referenceId"
                value={formData.referenceId}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm
                  focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm text-gray-700">IC Number</label>
              <input
                type="text"
                name="icNumber"
                value={formData.icNumber}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm
                  focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </>
        );

      case 'OTP':
        return (
          <>
            <div className="space-y-2">
              <label className="block text-sm text-gray-700">IC Number</label>
              <input
                type="text"
                name="icNumber"
                value={formData.icNumber}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm
                  focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm text-gray-700">Language</label>
              <select
                name="language"
                value={formData.language}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm
                  focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Select Language</option>
                <option value="english">English</option>
                <option value="malay">Malay</option>
              </select>
            </div>
          </>
        );

      case 'CROSS_SELL':
        return (
          <>
            <div className="space-y-2">
              <label className="block text-sm text-gray-700">IVR Declaration</label>
              <input
                type="text"
                name="ivrDeclaration"
                value={formData.ivrDeclaration}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm
                  focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm text-gray-700">Opportunity ID</label>
              <input
                type="text"
                name="opportunityId"
                value={formData.opportunityId}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm
                  focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm text-gray-700">Language</label>
              <select
                name="language"
                value={formData.language}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm
                  focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Select Language</option>
                <option value="english">English</option>
                <option value="malay">Malay</option>
              </select>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
      <div 
        className="absolute right-0 top-0 h-full w-80 bg-white shadow-lg"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="text-lg font-medium">Transfer to IVR</h3>
            <button 
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Form Content */}
          <div className="flex-1 p-4 space-y-4 overflow-y-auto">
            {/* Transfer Option */}
            <div className="space-y-2">
              <label className="block text-sm text-gray-700">Option</label>
              <select
                value={selectedOption}
                onChange={(e) => setSelectedOption(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm
                  focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Select Option</option>
                <option value="TPIN">TPIN Transfer</option>
                <option value="OTP">OTP IVR</option>
                <option value="CROSS_SELL">CROSS SELL</option>
              </select>
            </div>

            {/* Dynamic Form Fields */}
            {renderFormFields()}

            {/* Agent Group - Common for all options */}
            {selectedOption && (
              <div className="space-y-2">
                <label className="block text-sm text-gray-700">Agent Group</label>
                <select
                  name="agentGroup"
                  value={formData.agentGroup}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm
                    focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">Select Agent Group</option>
                  <option value="creditCard_MY">CreditCard_MY</option>
                  <option value="general">General</option>
                </select>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t bg-gray-50">
            <div className="flex space-x-3">
              <button
                onClick={handleTransfer}
                className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md
                  hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Transfer
              </button>
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded-md
                  border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 
                  focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransferDrawer;