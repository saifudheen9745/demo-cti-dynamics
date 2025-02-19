import React from 'react';
import { CheckCircle2, Clock } from 'lucide-react';

const AgentStateBar = ({ 
  currentState, 
  pendingState,
  selectedAuxReason,
  acwTimeLeft,
  onStateChange 
}) => {
  return (
    <div className="flex flex-col">
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onStateChange('Ready')}
          className={`flex-1 px-3 py-1 rounded-full text-xs font-medium ${
            currentState === 'Ready' 
              ? 'bg-green-100 text-green-800' 
              : pendingState === 'Ready'
              ? 'bg-green-100 text-green-800 animate-pulse'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Ready
        </button>
        <button
          onClick={() => onStateChange('Aux')}
          className={`flex-1 px-3 py-1 rounded-full text-xs font-medium ${
            currentState === 'Aux' 
              ? 'bg-yellow-100 text-yellow-800' 
              : pendingState === 'Aux'
              ? 'bg-yellow-100 text-yellow-800 animate-pulse'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Aux
        </button>
        <button
          onClick={() => onStateChange('ACW')}
          className={`flex-1 px-3 py-1 rounded-full text-xs font-medium ${
            currentState === 'ACW' 
              ? 'bg-blue-100 text-blue-800' 
              : pendingState === 'ACW'
              ? 'bg-blue-100 text-blue-800 animate-pulse'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          ACW
        </button>
      </div>

      <div className="mt-2 min-h-[28px]">
        {currentState === 'Aux' && selectedAuxReason && (
          <div className="flex items-center text-xs text-yellow-800 bg-yellow-50 rounded-md p-2">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Aux Reason: {selectedAuxReason}
          </div>
        )}
        {currentState === 'ACW' && acwTimeLeft > 0 && (
          <div className="flex items-center text-xs text-blue-800 bg-blue-50 rounded-md p-2">
            <Clock className="h-3 w-3 mr-1" />
            ACW Time Remaining: {acwTimeLeft}s
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentStateBar;