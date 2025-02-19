import React from 'react';
import { X } from 'lucide-react';
import TransferForm from '../call/TransferForm';

const IVRTransferDrawer = ({ isOpen, onClose, onTransfer }) => {
  if (!isOpen) return null;

  const handleTransfer = async (selectedOption) => {
    // Just pass the selected option up to the parent
    onTransfer?.(selectedOption);
    onClose();
  };

  return (
    <div className="absolute inset-0 bg-black bg-opacity-50 z-50">
      <div className="absolute right-0 top-0 h-full w-[300px] bg-white shadow-lg flex flex-col">
        <div className="p-4 border-b flex items-center justify-between flex-shrink-0">
          <h2 className="text-lg font-semibold">Transfer to IVR</h2>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <TransferForm 
            onClose={onClose} 
            onSubmit={handleTransfer}
            type="ivr"
          />
        </div>
      </div>
    </div>
  );
};

export default IVRTransferDrawer; 