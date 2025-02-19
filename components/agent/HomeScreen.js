import React from 'react';
import { 
  Phone, 
  X, 
  CheckCircle2, 
  LogOut, 
  Clock, 
  PhoneIncoming,
  Pause,
  PhoneOutgoing,
  ArrowRightCircle,
  Users,
  UserPlus,
  PhoneForwarded,
  PhoneCall,
  UserCircle2 as UserCircle,
  CupSoda as Coffee
} from 'lucide-react';
import CallSection from '../call/CallSection';
import TransferForm from '../call/TransferForm';
import Sidebar from '../shared/Sidebar';
import TransferConsultForm from '../call/TransferConsultForm';

const HomeScreen = ({ agentInfo, onLogout }) => {
  // Agent states
  const [agentState, setAgentState] = React.useState('Aux');
  const [pendingState, setPendingState] = React.useState(null);
  const [selectedAuxReason, setSelectedAuxReason] = React.useState('Default');
  const [acwTimeLeft, setAcwTimeLeft] = React.useState(0);
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [pendingAuxReason, setPendingAuxReason] = React.useState(null);

  // Call states
  const [calls, setCalls] = React.useState([]);
  const [activeCallId, setActiveCallId] = React.useState(null);
  const [dialerOpen, setDialerOpen] = React.useState(false);
  const [phoneNumber, setPhoneNumber] = React.useState('');

  // Add transfer drawer state
  const [isTransferOpen, setIsTransferOpen] = React.useState(false);

  // Add new states
  const [transferType, setTransferType] = React.useState(null);
  const [isTransferConsultOpen, setIsTransferConsultOpen] = React.useState(false);

  const activeCall = calls.find(call => call.id === activeCallId);

  const auxReasons = [
    'Default',
    'Break',
    'Lunch',
    'Training',
    'Meeting',
    'System Issues',
    'Administrative Work'
  ];

  const handleStateChange = (newState) => {
    if (newState === 'Logout' && agentState === 'Aux') {
      onLogout();
      return;
    }

    if (newState === 'Logout' && agentState !== 'Aux') return;
    
    if (calls.length > 0) {
      if (newState === 'ACW' || newState === 'Aux') {
        setPendingState(newState);
        if (newState === 'Aux') {
          setSidebarOpen(true);
        }
      }
      return;
    }

    if (newState === 'Aux') {
      setSidebarOpen(true);
      return;
    }

    if (agentState === 'ACW') {
      if (newState === 'Logout') return;
      setAgentState(newState);
      setAcwTimeLeft(0);
    } else if (agentState === 'Aux') {
      setAgentState(newState);
      setSelectedAuxReason('Default');
      setPendingAuxReason(null);
    } else if (agentState === 'Ready') {
      if (newState === 'Logout') return;
      setAgentState(newState);
    }

    setPendingState(null);
  };

  const handleInitiateCall = () => {
    if (!phoneNumber) return;
    
    // Check if already at maximum calls
    if (calls.length >= 2) {
      alert('Maximum number of calls (2) reached. Please end one call before making another.');
      setDialerOpen(false);
      return;
    }
    
    // Put existing calls on hold
    if (calls.length > 0) {
      setCalls(prev => prev.map(call => ({
        ...call,
        state: 'Hold'
      })));
    }

    // Create new outbound call
    const newCall = {
      id: Date.now().toString(),
      state: 'InCall',
      callingNumber: phoneNumber,
      direction: 'Outbound',
      queueName: 'Outbound',
      timeStamp: new Date().toLocaleTimeString(),
      callDetails: {
        'Direction': 'Outbound',
        'Called Number': phoneNumber,
        'Start Time': new Date().toLocaleTimeString(),
        'Agent ID': agentInfo.agentId
      }
    };

    setCalls(prev => [...prev, newCall]);
    setActiveCallId(newCall.id);
    setDialerOpen(false);
    setPhoneNumber('');
  };

  const simulateIncomingCall = async() => {
    if (calls.length >= 2) {
      alert('Maximum number of calls (2) reached. Cannot accept new incoming call.');
      return;
    }

    const incomingCall = {
      id: Date.now().toString(),
      state: 'InCall',
      callingNumber: '9012523035',
      direction: 'Inbound',
      queueName: 'Premium Support',
      timeStamp: new Date().toLocaleTimeString(),
      callDetails: {
        'Ref ID - Agent': '8168746',
        'Cust IC - Agent': '',
        'Cust or Nominee Name': 'RUBIK CTI TWO 890605123902',
        'TPIN Process Status': 'Success',
        'ANI': '58001',
        'Cust or Nominee IC': '890605123902',
        'Account No': '',
        'TPIN Request Type': 'TPIN Verification',
        'IVR Host Response': '000 - GOOD, ACCEPTED',
        'IVR Last Txn': '',
        'TPIN Verify Status': 'Verified',
        'IVR Flow': '',
        'Phone Login ID': 'aicuatagent19',
        'Language': 'English',
        'Placeholder 1': '',
        'Placeholder 2': '',
        'Placeholder 3': '',
        'Placeholder 4': '',
        'Placeholder 5': '',
        'Placeholder 6': '',
        'Placeholder 7': ''
      }
    };

    // Put existing calls on hold
    if (calls.length > 0) {
      setCalls(prev => prev.map(call => ({
        ...call,
        state: 'Hold'
      })));

      try {
        const result = await searchAndDisplayContact(phoneNumber);
        
        if (result.success) {
            console.log('Found contacts:', result.contacts);
        } else {
            // Handle no contacts found
            console.log(result.message);
            
            // Optionally, you could open a new contact form
            await Microsoft.CIFramework.openForm({
                entityName: "contact",
                createFromEntity: true,
                data: {
                    telephone1: phoneNumber
                }
            });
        }
    } catch (error) {
        console.error('Error handling incoming call:', error);
    }
    }

    setCalls(prev => [...prev, incomingCall]);
    setActiveCallId(incomingCall.id);
  };

  const handleCallActions = {
    hangup: (callId) => {
      handleCallEnd(callId);
    },
    hold: (callId) => {
      setCalls(prevCalls => 
        prevCalls.map(call => {
          if (call.id === callId) {
            return {
              ...call,
              state: call.state === 'Hold' ? 'InCall' : 'Hold'
            };
          }
          return call;
        })
      );
    },
    initiate: () => {
      if (calls.length >= 2) {
        alert('Maximum number of calls reached. Please end one call before making another.');
        return;
      }
      setDialerOpen(true);
    },
    ivrTransfer: () => {
      setIsTransferOpen(true);
    },
    ivrMenu: () => {
      setTransferType('ivr-menu');
      setIsTransferOpen(true);
    },
    blindTransfer: () => {
      setTransferType('blind-transfer');
      setIsTransferConsultOpen(true);
    },
    consultTransfer: () => {
      setTransferType('consult-transfer');
      setIsTransferConsultOpen(true);
    },
    blindConference: () => {
      setTransferType('blind-conference');
      setIsTransferConsultOpen(true);
    },
    consultConference: () => {
      setTransferType('consult-conference');
      setIsTransferConsultOpen(true);
    }
  };

  const handleCallSelect = (callId) => {
    setCalls(prevCalls => 
      prevCalls.map(call => {
        if (call.id === callId) {
          return {
            ...call,
            state: 'InCall',
            stateChangeTime: Date.now()
          };
        } else if (call.state === 'InCall') {
          return {
            ...call,
            state: 'Hold',
            stateChangeTime: Date.now()
          };
        }
        return call;
      })
    );
    setActiveCallId(callId);
  };

  const handleCallEnd = (callId) => {
    setCalls(prevCalls => prevCalls.filter(call => call.id !== callId));
    if (activeCallId === callId) {
      const remainingCalls = calls.filter(call => call.id !== callId);
      setActiveCallId(remainingCalls.length > 0 ? remainingCalls[0].id : null);
    }
  };

  const handleAuxReasonSelect = (reason) => {
    if (calls.length > 0) {
      setPendingAuxReason(reason);
    } else {
      setSelectedAuxReason(reason);
    }
    setAgentState('Aux');
    setSidebarOpen(false);
  };

  // Add handler for transfer/conference actions
  const handleTransferConsult = (number) => {
    const activeCall = calls.find(call => call.id === activeCallId);
    if (!activeCall) return;

    switch(transferType) {
      case 'blind-transfer':
        console.log(`Initiating blind transfer to ${number}`);
        // Add blind transfer logic
        break;
      case 'consult-transfer':
        console.log(`Initiating consult transfer to ${number}`);
        // Add consult transfer logic
        break;
      case 'blind-conference':
        console.log(`Initiating blind conference with ${number}`);
        // Add blind conference logic
        break;
      case 'consult-conference':
        console.log(`Initiating consult conference with ${number}`);
        // Add consult conference logic
        break;
    }

    setIsTransferConsultOpen(false);
    setTransferType(null);
  };

  return (
    <div className="relative w-[350px] min-h-[600px] max-h-[800px] h-[90vh] bg-gray-50 flex flex-col overflow-hidden border border-gray-200 rounded-lg shadow-sm">
      {/* Header Section */}
      <div className="bg-white p-3 border-b min-h-[120px]">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">Agent ID: {agentInfo.agentId}</h2>
            <p className="text-xs font-medium text-gray-900">Ext: {agentInfo.extension}</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={simulateIncomingCall}
              className="px-2 py-1 rounded-md text-xs bg-blue-100 text-blue-800 hover:bg-blue-200"
            >
              <PhoneIncoming className="h-3 w-3" />
            </button>
            <button
              disabled={agentState !== 'Aux'}
              onClick={() => handleStateChange('Logout')}
              className={`flex items-center space-x-1 px-3 py-1 rounded-md text-xs ${
                agentState === 'Aux'
                  ? 'bg-red-100 text-red-800 hover:bg-red-200'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <LogOut className="h-3 w-3" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-2 mb-2">
          <button
            onClick={() => handleStateChange('Ready')}
            className={`flex-1 px-3 py-1 rounded-full text-xs font-medium ${
              agentState === 'Ready' 
                ? 'bg-green-100 text-green-800' 
                : pendingState === 'Ready'
                ? 'bg-green-100 text-green-800 animate-pulse'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Ready
          </button>
          <button
            onClick={() => handleStateChange('Aux')}
            className={`flex-1 px-3 py-1 rounded-full text-xs font-medium ${
              agentState === 'Aux' 
                ? 'bg-yellow-100 text-yellow-800' 
                : pendingState === 'Aux'
                ? 'bg-yellow-100 text-yellow-800 animate-pulse'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Aux
          </button>
          <button
            onClick={() => handleStateChange('ACW')}
            className={`flex-1 px-3 py-1 rounded-full text-xs font-medium ${
              agentState === 'ACW' 
                ? 'bg-blue-100 text-blue-800' 
                : pendingState === 'ACW'
                ? 'bg-blue-100 text-blue-800 animate-pulse'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            ACW
          </button>
        </div>

        {agentState === 'Aux' && selectedAuxReason && (
          <div className="mt-1 mb-1 flex items-center text-xs text-yellow-800 bg-yellow-50 rounded-md p-1.5">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            <span className="truncate">Aux Reason: {selectedAuxReason}</span>
          </div>
        )}
        {agentState === 'ACW' && acwTimeLeft > 0 && (
          <div className="mt-1 mb-1 flex items-center text-xs text-blue-800 bg-blue-50 rounded-md p-1.5">
            <Clock className="h-3 w-3 mr-1" />
            <span className="truncate">ACW Time Remaining: {acwTimeLeft}s</span>
          </div>
        )}

        {pendingState === 'Aux' && pendingAuxReason && (
          <div className="mt-1 mb-1 flex items-center text-xs text-yellow-800 bg-yellow-50/50 rounded-md p-1.5">
            <Clock className="h-3 w-3 mr-1" />
            <span className="truncate">Pending Aux ({pendingAuxReason})</span>
          </div>
        )}
      </div>

      <CallSection 
        calls={calls}
        activeCallId={activeCallId}
        onCallSelect={handleCallSelect}
        onCallAction={handleCallActions}
      />

      {/* Add Dialer Sidebar */}
      {dialerOpen && (
        <div className="absolute inset-0 bg-black bg-opacity-20 flex justify-end z-10">
          <div className="w-[262px] h-full bg-white flex flex-col shadow-lg animate-slide-in">
            <div className="p-3 border-b flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">Initiate Call</h3>
              <button 
                onClick={() => setDialerOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="h-4 w-4 text-gray-500" />
              </button>
            </div>
            <div className="p-3 flex-1">
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Enter phone number"
                className="w-full px-3 py-2 border rounded-md text-sm font-medium text-gray-900 mb-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
              
              {/* Keypad Grid */}
              <div className="grid grid-cols-3 gap-1.5 mb-3">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, '*', 0, '#'].map((num) => (
                  <button
                    key={num}
                    onClick={() => setPhoneNumber(prev => prev + num)}
                    className="h-10 rounded-md bg-gray-50 hover:bg-gray-100 
                      text-gray-900 text-sm font-semibold flex items-center justify-center
                      transition-colors duration-200"
                  >
                    {num}
                  </button>
                ))}
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => setPhoneNumber(prev => prev.slice(0, -1))}
                  className="flex-1 h-9 rounded-md bg-gray-100 text-gray-700 
                    text-sm font-semibold hover:bg-gray-200 transition-colors duration-200"
                >
                  Delete
                </button>
                <button
                  onClick={handleInitiateCall}
                  disabled={!phoneNumber}
                  className="flex-1 h-9 rounded-md bg-blue-600 text-white 
                    text-sm font-semibold hover:bg-blue-700 disabled:bg-gray-300 
                    disabled:cursor-not-allowed transition-colors duration-200"
                >
                  Call
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transfer Drawer - Updated to use shared Sidebar */}
      <Sidebar
        isOpen={isTransferOpen}
        onClose={() => setIsTransferOpen(false)}
        title="Transfer to IVR"
      >
        <div className="p-4">
          <TransferForm onClose={() => setIsTransferOpen(false)} />
        </div>
      </Sidebar>

      {/* Aux Reason Sidebar - Already using shared component */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        title="Select Aux Reason"
      >
        <div className="p-4">
          <div className="space-y-2">
            {auxReasons.map((reason) => (
              <button
                key={reason}
                onClick={() => handleAuxReasonSelect(reason)}
                className="w-full px-4 py-2 text-left text-sm font-medium text-gray-900 
                  hover:bg-gray-50 rounded-md transition-colors duration-200"
              >
                {reason}
              </button>
            ))}
          </div>
        </div>
      </Sidebar>

      {/* Transfer Consult Sidebar */}
      <Sidebar
        isOpen={isTransferConsultOpen}
        onClose={() => {
          setIsTransferConsultOpen(false);
          setTransferType(null);
        }}
        title={transferType ? transferType.split('-').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ') : ''}
      >
        <TransferConsultForm
          type={transferType}
          onClose={() => {
            setIsTransferConsultOpen(false);
            setTransferType(null);
          }}
          onSubmit={handleTransferConsult}
        />
      </Sidebar>
    </div>
  );
};

export default HomeScreen;