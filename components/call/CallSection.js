// CallSection.js
import React from 'react';
import { 
  Phone, 
  PhoneIncoming, 
  PhoneOutgoing, 
  Users, 
  Clock,
  Pause,
  ArrowRightCircle,
  UserPlus,
  PhoneForwarded,
  Play,
  ListTree,
  PhoneCall,
  ArrowLeftRight,
  Combine,
  X
} from 'lucide-react';
import { useEffect, useRef } from 'react';
import ConsultDrawer from './ConsultDrawer';
import IVRTransferDrawer from '../transfer/IVRTransferDrawer';

const CallSection = ({ 
  calls, 
  activeCallId, 
  onCallSelect,
  onCallAction,
  onStateChange,
  onClearCalls
}) => {
  const [showTransferMenu, setShowTransferMenu] = React.useState(false);
  const [showConferenceMenu, setShowConferenceMenu] = React.useState(false);
  const [showConsultDrawer, setShowConsultDrawer] = React.useState(false);
  const [showIVRTransferDrawer, setShowIVRTransferDrawer] = React.useState(false);
  const [selectedIVROption, setSelectedIVROption] = React.useState(null);
  
  const transferMenuRef = useRef(null);
  const conferenceMenuRef = useRef(null);

  const activeCall = calls.find(call => call.id === activeCallId);
  const hasActiveCalls = calls.length > 0;
  const hasConsultCall = calls.length > 1;

  // State for tracking call timers
  const [callTimers, setCallTimers] = React.useState({});

  // Create a wrapped version of onCallAction that includes consult
  const wrappedCallActions = {
    ...onCallAction,
    consult: (number) => {
      console.log('Initiating consult call to:', number);
      // First put the current call on hold
      if (activeCall) {
        onCallAction.hold?.(activeCall.id);
      }
      // Then make the call using the same method as transfer
      onCallAction.transfer?.(activeCall.id, number, 'consult');
      // Close the drawer
      setShowConsultDrawer(false);
    }
  };

  // Handle call selection without state switching
  const handleCallSelect = (callId) => {
    // Just select the call without any state changes
    onCallSelect(callId);
  };

  // Effect to handle timers for all active calls
  React.useEffect(() => {
    const timerInterval = setInterval(() => {
      setCallTimers(prevTimers => {
        const newTimers = { ...prevTimers };
        
        calls.forEach(call => {
          // Initialize timer if it doesn't exist
          if (!newTimers[call.id]) {
            newTimers[call.id] = {
              startTime: Date.now(),
              lastState: call.state
            };
          }
          
          // Reset timer if state changed
          if (newTimers[call.id].lastState !== call.state) {
            newTimers[call.id] = {
              startTime: Date.now(),
              lastState: call.state
            };
          }
        });

        // Clean up timers for ended calls
        Object.keys(newTimers).forEach(id => {
          if (!calls.find(call => call.id === id)) {
            delete newTimers[id];
          }
        });
        
        return newTimers;
      });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [calls]);

  // Format time duration
  const formatDuration = (startTime) => {
    if (!startTime) return '00:00';
    const seconds = Math.floor((Date.now() - startTime) / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (transferMenuRef.current && !transferMenuRef.current.contains(event.target)) {
        setShowTransferMenu(false);
      }
      if (conferenceMenuRef.current && !conferenceMenuRef.current.contains(event.target)) {
        setShowConferenceMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menus when active call changes
  useEffect(() => {
    setShowTransferMenu(false);
    setShowConferenceMenu(false);
  }, [activeCallId]);

  const handleSwapCalls = () => {
    // Find the held call
    const heldCall = calls.find(call => call.state === 'Hold');
    const activeCall = calls.find(call => call.state !== 'Hold');
    
    if (heldCall && activeCall) {
      // Hold the active call
      onCallAction.hold?.(activeCall.id);
      // Unhold the held call
      onCallAction.hold?.(heldCall.id);
    }
  };

  const handleCompleteTransfer = async () => {
    try {
      // Hang up both calls to complete the transfer
      calls.forEach(call => {
        onCallAction.hangup?.(call.id);
      });
      
      // Clear all calls
      onClearCalls?.();
      
      // Clear active call selection
      onCallSelect(null);
      
      // Try to set agent state to ACW if onStateChange is available
      if (onStateChange) {
        console.log('Setting agent state to ACW');
        onStateChange('ACW');
      } else {
        // If onStateChange is not available, try to use onCallAction.setState if it exists
        console.log('Attempting to set state through onCallAction');
        onCallAction.setState?.('ACW');
      }

      // Clear local timers
      setCallTimers({});
      
    } catch (error) {
      console.error('Complete Transfer failed:', error);
    }
  };

  const handleIVRTransferComplete = async (selectedOption) => {
    // Store the selected option
    setSelectedIVROption(selectedOption);
    
    try {
      // Perform the IVR transfer
      await onCallAction.ivrTransfer?.(selectedOption);
      
      // Hang up both calls to complete the transfer (same as complete transfer)
      calls.forEach(call => {
        onCallAction.hangup?.(call.id);
      });
      
      // Clear all calls
      onClearCalls?.();
      
      // Clear active call selection
      onCallSelect(null);
      
      // Set agent state to ACW
      if (onStateChange) {
        console.log('Setting agent state to ACW');
        onStateChange('ACW');
      } else {
        console.log('Attempting to set state through onCallAction');
        onCallAction.setState?.('ACW');
      }

      // Clear local timers
      setCallTimers({});
      
    } catch (error) {
      console.error('IVR Transfer failed:', error);
    }
    
    // Close the drawer
    setShowIVRTransferDrawer(false);
  };

  const handleCompleteConference = async () => {
    try {
      console.log('Starting conference process...');
      console.log('Available calls:', calls);
      console.log('Active Call ID:', activeCallId);
      
      // Get the held call and active call
      const heldCall = calls.find(call => call.state === 'Hold');
      const activeCall = calls.find(call => call.id === activeCallId);

      console.log('Held Call:', heldCall);
      console.log('Active Call:', activeCall);

      if (!heldCall || !activeCall) {
        console.error('Cannot complete conference: missing calls');
        return;
      }

      // Use consultConference since it's available in onCallAction
      console.log('Attempting to complete conference with:', {
        activeCallId: activeCall.id,
        heldCallId: heldCall.id
      });
      
      await onCallAction.consultConference(activeCall.id, heldCall.id);
      
      console.log('Conference completed successfully');

    } catch (error) {
      console.error('Conference failed:', error);
      console.error('Error details:', error.message);
    }
  };

  const handleDropParty = async (callId) => {
    try {
      await onCallAction.dropParty?.(callId);
      console.log('Dropped party from conference:', callId);
    } catch (error) {
      console.error('Failed to drop party:', error);
    }
  };

  // Check if calls are in conference state
  const isConferenced = calls.some(call => call.state === 'Conference');

  console.log('CallSection onCallAction:', onCallAction); // Debug log

  return (
    <div className="flex flex-col h-full">
      {/* Call Information Section - Reduced height from 120px to 80px */}
      <div className="h-[80px] bg-white border-b">
        <div className="h-full">
          {calls.length > 0 ? (
            <div className="flex flex-col divide-y h-full">
              {calls.map((call) => (
                <div 
                  key={call.id}
                  onClick={() => handleCallSelect(call.id)}
                  className={`
                    px-3 cursor-pointer transition-all duration-200 h-[40px] flex items-center
                    ${call.state === 'Hold' 
                      ? 'bg-blue-50/80 hover:bg-blue-50' 
                      : 'bg-green-50/80 hover:bg-green-50'
                    }
                    ${call.id === activeCallId ? 'ring-1 ring-inset ring-gray-300' : ''}
                  `}
                >
                  <div className="flex items-center justify-between w-full">
                    {/* Left side - Calling Party Number */}
                    <div className="flex items-center space-x-2 min-w-[100px] max-w-[120px]">
                      {call.direction === 'Inbound' ? (
                        <PhoneIncoming className="h-4 w-4 text-green-600 flex-shrink-0" />
                      ) : (
                        <PhoneOutgoing className="h-4 w-4 text-purple-600 flex-shrink-0" />
                      )}
                      <span className="text-xs font-semibold text-gray-900 truncate" title={call.callingNumber}>
                        {call.callingNumber}
                      </span>
                    </div>

                    {/* Right side - Queue, Timer, and State */}
                    <div className="flex items-center space-x-2">
                      {/* Queue Name */}
                      <div className="flex items-center space-x-1 text-xs w-[100px] overflow-hidden">
                        <Users className="h-3 w-3 text-gray-500 flex-shrink-0" />
                        <div className="relative overflow-hidden">
                          <div className="whitespace-nowrap animate-marquee hover:[animation-play-state:paused]">
                            <span className="font-medium text-gray-900 inline-block pr-4">
                              {call.queueName}
                            </span>
                            <span className="font-medium text-gray-900 inline-block">
                              {call.queueName}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Timer */}
                      <div className="flex items-center space-x-1 text-xs">
                        <Clock className="h-3 w-3 text-gray-500 flex-shrink-0" />
                        <span className="font-medium text-gray-900">
                          {callTimers[call.id] ? formatDuration(callTimers[call.id].startTime) : '00:00'}
                        </span>
                      </div>

                      {/* Call State Icon */}
                      <div className={`flex items-center justify-center h-6 w-6 rounded-full 
                        ${call.state === 'Hold' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {call.state === 'Hold' ? (
                          <Pause className="h-3.5 w-3.5" />
                        ) : (
                          <Phone className="h-3.5 w-3.5" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-sm text-gray-500 font-medium">
              No active calls
            </div>
          )}
        </div>
      </div>

      {/* Call Controls Section - Same height */}
      <div className="h-[60px] bg-white border-t border-b flex-shrink-0">
        <div className="h-full flex items-center justify-between px-4 space-x-4">
          {/* Hangup Button */}
          <button 
            onClick={() => onCallAction.hangup?.(activeCallId)}
            disabled={!activeCall}
            className={`p-1.5 rounded group relative duration-200 ${
              !activeCall ? 'bg-red-50 text-red-300 cursor-not-allowed' : 'bg-red-50 hover:bg-red-100 text-red-600'
            }`}
          >
            <Phone className="h-5 w-5 fill-current" />
            <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 
              text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-10 font-medium">
              Hangup
            </span>
          </button>

          {/* Initiate/Consult Button */}
          {!hasConsultCall && (
            <button 
              onClick={() => {
                if (activeCall) {
                  setShowConsultDrawer(true);
                } else {
                  onCallAction.initiate();
                }
              }}
              className="p-1.5 rounded bg-gray-100 hover:bg-gray-300 text-gray-700 group relative duration-200"
            >
              {activeCall ? (
                <PhoneCall className="h-5 w-5 fill-current" />
              ) : (
                <PhoneOutgoing className="h-5 w-5 fill-current" />
              )}
              <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 
                text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-10 font-medium">
                {activeCall ? 'Consult' : 'Initiate'}
              </span>
            </button>
          )}

          {/* Hold/Resume Button */}
          <button 
            onClick={() => onCallAction.hold?.(activeCallId)}
            disabled={!activeCall}
            className={`p-1.5 rounded group relative duration-200 ${
              !activeCall 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : activeCall?.state === 'Hold'
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-gray-100 hover:bg-gray-300 text-gray-700'
            }`}
          >
            {activeCall?.state === 'Hold' ? (
              <Play className="h-5 w-5 fill-current" />
            ) : (
              <Pause className="h-5 w-5 fill-current" />
            )}
            <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 
              text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-10 font-medium">
              {activeCall?.state === 'Hold' ? 'Resume' : 'Hold'}
            </span>
          </button>

          {!hasConsultCall && activeCall ? (
            <>
              {/* Transfer Button */}
              <button 
                onClick={() => setShowTransferMenu(prev => !prev)}
                disabled={!activeCall}
                className={`p-1.5 rounded group relative duration-200 ${
                  !activeCall ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-100 hover:bg-gray-300 text-gray-700'
                }`}
              >
                <ArrowRightCircle className="h-5 w-5 fill-current" />
                <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 
                  text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-10 font-medium">
                  Transfer
                </span>
              </button>

              {/* Conference Button */}
              <button 
                onClick={() => setShowConferenceMenu(prev => !prev)}
                disabled={!activeCall}
                className={`p-1.5 rounded group relative duration-200 ${
                  !activeCall ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-100 hover:bg-gray-300 text-gray-700'
                }`}
              >
                <Users className="h-5 w-5 fill-current" />
                <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 
                  text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-10 font-medium">
                  Conference
                </span>
              </button>

              {/* IVR Transfer Button */}
              <button 
                onClick={() => setShowIVRTransferDrawer(true)}
                disabled={!activeCall}
                className={`p-1.5 rounded group relative duration-200 ${
                  !activeCall ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-100 hover:bg-gray-300 text-gray-700'
                }`}
              >
                <ListTree className="h-5 w-5 fill-current" />
                <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 
                  text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-10 font-medium">
                  IVR Transfer
                </span>
              </button>
            </>
          ) : hasConsultCall && (
            <>
              {/* Swap Calls Button */}
              <button 
                onClick={handleSwapCalls}
                className="p-1.5 rounded bg-gray-100 hover:bg-gray-300 text-gray-700 group relative duration-200"
              >
                <ArrowLeftRight className="h-5 w-5 fill-current" />
                <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 
                  text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-10 font-medium">
                  Swap Calls
                </span>
              </button>

              {/* Complete as Conference Button */}
              <button 
                onClick={handleCompleteConference}
                className="p-1.5 rounded bg-gray-100 hover:bg-gray-300 text-gray-700 group relative duration-200"
              >
                <Combine className="h-5 w-5 fill-current" />
                <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 
                  text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-10 font-medium">
                  Complete Conference
                </span>
              </button>

              {/* Complete as Transfer Button */}
              <button 
                onClick={handleCompleteTransfer}
                className="p-1.5 rounded bg-gray-100 hover:bg-gray-300 text-gray-700 group relative duration-200"
              >
                <PhoneForwarded className="h-5 w-5 fill-current" />
                <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 
                  text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-10 font-medium">
                  Complete Transfer
                </span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Conference Call Section - New Design */}
      {isConferenced && (
        <div className="bg-purple-50 p-4 border-b">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-purple-900">Active Conference Call</h3>
            <span className="text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded-full">
              {calls.length} Participants
            </span>
          </div>
          
          {/* Conference Participants */}
          <div className="space-y-2">
            {calls.map(call => (
              <div 
                key={call.id}
                className="flex items-center justify-between bg-white p-2 rounded-lg border border-purple-200"
              >
                <div className="flex items-center space-x-3">
                  <Users className="h-4 w-4 text-purple-600" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {call.callingNumber}
                    </div>
                    <div className="text-xs text-gray-500">
                      Duration: {formatDuration(callTimers[call.id]?.startTime)}
                    </div>
                  </div>
                </div>
                
                {/* Drop Party Button */}
                <button
                  onClick={() => handleDropParty(call.id)}
                  className="p-1.5 hover:bg-red-100 text-red-600 rounded-full
                    transition-colors duration-200 group relative"
                >
                  <X className="h-4 w-4" />
                  <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 
                    bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 
                    group-hover:opacity-100 whitespace-nowrap">
                    Drop from Conference
                  </span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Call Details Section - Adjusted calculation (80px + 60px = 140px) */}
      <div className="h-[calc(100%-140px)] bg-white flex flex-col flex-shrink-0">
        {/* Tab Headers - Reduced height */}
        <div className="h-[32px] border-b bg-gray-50 px-1 flex items-center space-x-1 flex-shrink-0">
          {calls.map(call => (
            <div 
              key={call.id}
              onClick={() => handleCallSelect(call.id)}
              className={`
                relative h-[30px] inline-flex items-center px-2.5 text-xs font-semibold 
                border-t border-x rounded-t-md cursor-pointer
                ${call.id === activeCallId 
                  ? 'bg-white border-gray-200 shadow-sm translate-y-px' 
                  : 'bg-gray-100 border-transparent hover:bg-gray-200'
                }
                ${isConferenced ? 'pr-8' : ''}
              `}
            >
              <div className="flex items-center justify-between w-full min-w-[120px]">
                <span className="text-gray-900">
                  {call.callingNumber}
                  {isConferenced && ' (Conference)'}
                </span>
                <span className={`ml-2 px-1.5 py-0.5 rounded-full text-[10px] font-medium
                  ${isConferenced 
                    ? 'bg-purple-100 text-purple-800'
                    : call.state === 'Hold' 
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-green-100 text-green-800'
                  }`}
                >
                  {isConferenced ? 'Conference' : call.state}
                </span>
              </div>

              {/* Drop Party Button - Only show in conference mode */}
              {isConferenced && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDropParty(call.id);
                  }}
                  className="absolute right-1 top-1/2 -translate-y-1/2
                    p-1 rounded-full hover:bg-red-100 text-red-600"
                  title="Drop from conference"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Call Details Table - Scrollable content */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-xs">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="text-left px-2 py-2 font-semibold text-gray-900 border-b">Field</th>
                <th className="text-left px-2 py-2 font-semibold text-gray-900 border-b">Value</th>
              </tr>
            </thead>
            <tbody>
              {activeCall && (
                <>
                  {/* Conference Status Row */}
                  {isConferenced && (
                    <tr className="border-b bg-purple-50">
                      <td className="px-2 py-1.5 font-semibold text-gray-900">Conference Status</td>
                      <td className="px-2 py-1.5 font-medium text-gray-900">
                        Active Conference ({calls.length} Participants)
                      </td>
                    </tr>
                  )}
                  {/* Regular call details */}
                  {Object.entries(activeCall.callDetails).map(([key, value]) => (
                    <tr key={key} className="border-b hover:bg-gray-50">
                      <td className="px-2 py-1.5 border-r bg-gray-50 font-semibold text-gray-900">{key}</td>
                      <td className="px-2 py-1.5 font-medium text-gray-900">{value || '-'}</td>
                    </tr>
                  ))}
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Consult Drawer */}
      {showConsultDrawer && (
        <ConsultDrawer 
          onClose={() => setShowConsultDrawer(false)}
          onCallAction={wrappedCallActions}
          activeCall={activeCall}
        />
      )}

      {/* IVR Transfer Drawer */}
      <IVRTransferDrawer 
        isOpen={showIVRTransferDrawer} 
        onClose={() => setShowIVRTransferDrawer(false)}
        onTransfer={handleIVRTransferComplete}
      />
    </div>
  );
};

export default CallSection;