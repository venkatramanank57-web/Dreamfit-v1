// // components/works/UpdateStatusModal.jsx
// import React, { useState } from 'react';
// import { 
//   X, 
//   Clock, 
//   Scissors, 
//   Ruler, 
//   Truck, 
//   CheckCircle,
//   AlertCircle,
//   FileText,
//   UserCheck,
//   CheckSquare
// } from 'lucide-react';
// import showToast from '../../utils/toast';

// // ✅ Complete status workflow for Cutting Master
// const STATUS_OPTIONS = [
//   { 
//     value: 'cutting-started', 
//     label: 'Start Cutting', 
//     icon: Scissors, 
//     color: 'purple',
//     description: 'Begin cutting the fabric',
//     stage: 'cutting'
//   },
//   { 
//     value: 'cutting-completed', 
//     label: 'Complete Cutting', 
//     icon: CheckSquare, 
//     color: 'indigo',
//     description: 'Cutting work finished',
//     stage: 'cutting'
//   },
//   { 
//     value: 'sewing-started', 
//     label: 'Start Sewing', 
//     icon: Ruler, 
//     color: 'pink',
//     description: 'Begin sewing the garment',
//     stage: 'sewing'
//   },
//   { 
//     value: 'sewing-completed', 
//     label: 'Complete Sewing', 
//     icon: CheckSquare, 
//     color: 'teal',
//     description: 'Sewing work finished',
//     stage: 'sewing'
//   },
//   { 
//     value: 'ironing', 
//     label: 'Ironing', 
//     icon: Truck, 
//     color: 'orange',
//     description: 'Iron and finish the garment',
//     stage: 'finishing'
//   },
//   { 
//     value: 'ready-to-deliver', 
//     label: 'Ready to Deliver', 
//     icon: CheckCircle, 
//     color: 'green',
//     description: 'Garment is ready for delivery',
//     stage: 'finishing'
//   }
// ];

// // ✅ Workflow order - defines which status comes next
// const WORKFLOW_ORDER = [
//   'pending',
//   'accepted',
//   'cutting-started',
//   'cutting-completed',
//   'sewing-started',
//   'sewing-completed',
//   'ironing',
//   'ready-to-deliver'
// ];

// export default function UpdateStatusModal({ work, onClose, onUpdate }) {
//   const [selectedStatus, setSelectedStatus] = useState('');
//   const [notes, setNotes] = useState('');
//   const [loading, setLoading] = useState(false);

//   // ✅ Get current status index in workflow
//   const currentStatusIndex = WORKFLOW_ORDER.indexOf(work?.status);
  
//   // ✅ Filter statuses based on workflow (only show next logical statuses)
//   const getAvailableStatuses = () => {
//     // If no work or no status, show all
//     if (!work?.status) return STATUS_OPTIONS;
    
//     // Based on current status, determine what's next
//     switch(work.status) {
//       case 'accepted':
//         // After acceptance, can only start cutting
//         return STATUS_OPTIONS.filter(opt => opt.value === 'cutting-started');
      
//       case 'cutting-started':
//         // After starting cutting, can only complete cutting
//         return STATUS_OPTIONS.filter(opt => opt.value === 'cutting-completed');
      
//       case 'cutting-completed':
//         // After cutting completed, can start sewing
//         return STATUS_OPTIONS.filter(opt => opt.value === 'sewing-started');
      
//       case 'sewing-started':
//         // After starting sewing, can only complete sewing
//         return STATUS_OPTIONS.filter(opt => opt.value === 'sewing-completed');
      
//       case 'sewing-completed':
//         // After sewing completed, can iron
//         return STATUS_OPTIONS.filter(opt => opt.value === 'ironing');
      
//       case 'ironing':
//         // After ironing, can mark ready
//         return STATUS_OPTIONS.filter(opt => opt.value === 'ready-to-deliver');
      
//       case 'ready-to-deliver':
//         // Terminal state - no further updates
//         return [];
      
//       default:
//         // For any other status (like pending), show all
//         return STATUS_OPTIONS;
//     }
//   };

//   const availableStatuses = getAvailableStatuses();

//   // ✅ Check if status is allowed based on workflow
//   const isStatusAllowed = (statusValue) => {
//     const statusIndex = WORKFLOW_ORDER.indexOf(statusValue);
//     return statusIndex > currentStatusIndex; // Only allow forward progress
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault(); // Prevent any default form submission
    
//     console.log('🔘 Submit clicked - selectedStatus:', selectedStatus);
//     console.log('📝 Notes:', notes);
//     console.log('📦 Work:', work);
    
//     if (!selectedStatus) {
//       console.log('❌ No status selected');
//       showToast.error('Please select a status');
//       return;
//     }

//     // ✅ Validate workflow
//     if (!isStatusAllowed(selectedStatus)) {
//       showToast.error('Invalid status transition. Please follow the workflow order.');
//       return;
//     }
    
//     setLoading(true);
//     try {
//       console.log('📤 Calling onUpdate with:', selectedStatus, notes);
//       await onUpdate(selectedStatus, notes);
//       console.log('✅ Update successful');
//       showToast.success(`Status updated to ${selectedStatus.replace(/-/g, ' ')}`);
//       onClose(); // Close modal on success
//     } catch (error) {
//       console.error('❌ Update failed:', error);
//       showToast.error(error?.message || 'Failed to update status');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ Get status badge color based on status
//   const getStatusBadgeColor = (status) => {
//     const colors = {
//       'pending': 'bg-yellow-100 text-yellow-700',
//       'accepted': 'bg-blue-100 text-blue-700',
//       'cutting-started': 'bg-purple-100 text-purple-700',
//       'cutting-completed': 'bg-indigo-100 text-indigo-700',
//       'sewing-started': 'bg-pink-100 text-pink-700',
//       'sewing-completed': 'bg-teal-100 text-teal-700',
//       'ironing': 'bg-orange-100 text-orange-700',
//       'ready-to-deliver': 'bg-green-100 text-green-700'
//     };
//     return colors[status] || 'bg-slate-100 text-slate-700';
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
//       <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl animate-in zoom-in duration-300">
        
//         {/* Header */}
//         <div className="p-6 bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-2xl">
//           <div className="flex items-center justify-between">
//             <div>
//               <h2 className="text-xl font-black text-white">Update Work Status</h2>
//               <p className="text-sm text-white/80 mt-1 flex items-center gap-2">
//                 <span className="font-mono">{work?.workId}</span>
//                 <span>•</span>
//                 <span>{work?.garment?.name}</span>
//               </p>
//             </div>
//             <button
//               onClick={onClose}
//               className="p-2 hover:bg-white/20 rounded-lg transition-all"
//             >
//               <X size={20} className="text-white" />
//             </button>
//           </div>
//         </div>

//         {/* Current Status Info */}
//         <div className="px-6 pt-4">
//           <div className="bg-slate-50 rounded-lg p-3 flex items-center justify-between">
//             <span className="text-sm text-slate-600">Current Status:</span>
//             <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusBadgeColor(work?.status)}`}>
//               {work?.status?.replace(/-/g, ' ') || 'Unknown'}
//             </span>
//           </div>

//           {/* Work Progress Indicator */}
//           <div className="mt-4">
//             <div className="flex justify-between text-xs text-slate-500 mb-1">
//               <span>Progress</span>
//               <span>{Math.round((currentStatusIndex / (WORKFLOW_ORDER.length - 1)) * 100)}%</span>
//             </div>
//             <div className="w-full bg-slate-200 rounded-full h-2">
//               <div 
//                 className="bg-blue-600 h-2 rounded-full transition-all duration-500"
//                 style={{ width: `${(currentStatusIndex / (WORKFLOW_ORDER.length - 1)) * 100}%` }}
//               ></div>
//             </div>
//           </div>
//         </div>

//         {/* Status Options */}
//         <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[400px] overflow-y-auto">
//           <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
//             <Clock size={16} className="text-blue-600" />
//             Select Next Status
//           </h3>
          
//           {availableStatuses.length === 0 ? (
//             <div className="text-center py-8">
//               <AlertCircle size={40} className="text-slate-300 mx-auto mb-3" />
//               <p className="text-slate-500">No further status updates available</p>
//               <p className="text-xs text-slate-400 mt-2">This work is already completed</p>
//             </div>
//           ) : (
//             availableStatuses.map((status) => {
//               const Icon = status.icon;
//               const isSelected = selectedStatus === status.value;
//               const isAllowed = isStatusAllowed(status.value);
              
//               return (
//                 <button
//                   key={status.value}
//                   type="button"
//                   onClick={() => {
//                     if (isAllowed) {
//                       console.log('📌 Status selected:', status.value);
//                       setSelectedStatus(status.value);
//                     } else {
//                       showToast.warning('Please follow the workflow order');
//                     }
//                   }}
//                   className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
//                     isSelected
//                       ? `border-${status.color}-500 bg-${status.color}-50`
//                       : isAllowed
//                         ? 'border-slate-200 hover:border-blue-200 hover:bg-slate-50'
//                         : 'border-slate-100 opacity-50 cursor-not-allowed'
//                   }`}
//                   disabled={!isAllowed}
//                 >
//                   <div className="flex items-start gap-3">
//                     <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
//                       isSelected ? `bg-${status.color}-100` : 'bg-slate-100'
//                     }`}>
//                       <Icon size={20} className={isSelected ? `text-${status.color}-600` : 'text-slate-600'} />
//                     </div>
//                     <div className="flex-1">
//                       <p className={`font-bold ${isSelected ? `text-${status.color}-700` : 'text-slate-700'}`}>
//                         {status.label}
//                       </p>
//                       <p className="text-xs text-slate-500 mt-1">{status.description}</p>
//                     </div>
//                     {isSelected && (
//                       <div className={`w-5 h-5 rounded-full bg-${status.color}-500 flex items-center justify-center`}>
//                         <CheckCircle size={12} className="text-white" />
//                       </div>
//                     )}
//                   </div>
//                 </button>
//               );
//             })
//           )}

//           {/* Notes Section */}
//           <div className="mt-6">
//             <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
//               <FileText size={14} />
//               Notes (Optional)
//             </label>
//             <textarea
//               value={notes}
//               onChange={(e) => setNotes(e.target.value)}
//               placeholder="Add any notes about this status update (measurements, issues, special instructions, etc.)"
//               className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none"
//               rows="3"
//             />
//           </div>

//           {/* Footer */}
//           <div className="flex gap-3 pt-4 border-t border-slate-100">
//             <button
//               type="button"
//               onClick={onClose}
//               className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-all"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={!selectedStatus || loading}
//               className={`flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all flex items-center justify-center gap-2 ${
//                 (!selectedStatus || loading) ? 'opacity-50 cursor-not-allowed' : ''
//               }`}
//             >
//               {loading ? (
//                 <>
//                   <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                   Updating...
//                 </>
//               ) : (
//                 <>
//                   Update Status
//                   <CheckCircle size={18} />
//                 </>
//               )}
//             </button>
//           </div>

//           {/* Workflow Hint */}
//           <div className="text-xs text-slate-400 text-center mt-2">
//             <Clock size={12} className="inline mr-1" />
//             Following workflow: Accepted → Cutting → Sewing → Ironing → Ready
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// components/works/UpdateStatusModal.jsx
import React, { useState, useEffect } from 'react';
import { 
  X, 
  Clock, 
  Scissors, 
  Ruler, 
  Truck, 
  CheckCircle,
  AlertCircle,
  FileText,
  UserCheck,
  CheckSquare
} from 'lucide-react';
import showToast from '../../utils/toast';

// ✅ Complete status workflow for Cutting Master
const STATUS_OPTIONS = [
  { 
    value: 'cutting-started', 
    label: 'Start Cutting', 
    icon: Scissors, 
    color: 'purple',
    description: 'Begin cutting the fabric',
    stage: 'cutting'
  },
  { 
    value: 'cutting-completed', 
    label: 'Complete Cutting', 
    icon: CheckSquare, 
    color: 'indigo',
    description: 'Cutting work finished',
    stage: 'cutting'
  },
  { 
    value: 'sewing-started', 
    label: 'Start Sewing', 
    icon: Ruler, 
    color: 'pink',
    description: 'Begin sewing the garment',
    stage: 'sewing'
  },
  { 
    value: 'sewing-completed', 
    label: 'Complete Sewing', 
    icon: CheckSquare, 
    color: 'teal',
    description: 'Sewing work finished',
    stage: 'sewing'
  },
  { 
    value: 'ironing', 
    label: 'Ironing', 
    icon: Truck, 
    color: 'orange',
    description: 'Iron and finish the garment',
    stage: 'finishing'
  },
  { 
    value: 'ready-to-deliver', 
    label: 'Ready to Deliver', 
    icon: CheckCircle, 
    color: 'green',
    description: 'Garment is ready for delivery',
    stage: 'finishing'
  }
];

// ✅ Workflow order - defines which status comes next
const WORKFLOW_ORDER = [
  'pending',
  'accepted',
  'cutting-started',
  'cutting-completed',
  'sewing-started',
  'sewing-completed',
  'ironing',
  'ready-to-deliver'
];

export default function UpdateStatusModal({ work, onClose, onUpdate }) {
  // Debug: Log props when component mounts
  useEffect(() => {
    console.log('🔵 ===== UPDATESTATUSMODAL MOUNTED =====');
    console.log('📦 Work prop:', work);
    console.log('📦 Work ID:', work?._id);
    console.log('📦 Work Status:', work?.status);
    console.log('📦 Work WorkId:', work?.workId);
    console.log('🔵 =====================================');
  }, [work]);

  const [selectedStatus, setSelectedStatus] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState({
    mountTime: new Date().toISOString(),
    selectedStatus: '',
    notes: '',
    submitAttempts: 0,
    lastSubmitTime: null,
    workflowCheck: null
  });

  // Debug: Log state changes
  useEffect(() => {
    console.log('🟡 selectedStatus changed:', selectedStatus);
    setDebugInfo(prev => ({ ...prev, selectedStatus }));
  }, [selectedStatus]);

  useEffect(() => {
    console.log('🟡 notes changed:', notes);
    setDebugInfo(prev => ({ ...prev, notes }));
  }, [notes]);

  // ✅ Get current status index in workflow
  const currentStatusIndex = WORKFLOW_ORDER.indexOf(work?.status);
  
  // Debug: Log current status info
  useEffect(() => {
    console.log('🟢 Current Status Index:', currentStatusIndex);
    console.log('🟢 Current Status:', work?.status);
    console.log('🟢 Workflow Order:', WORKFLOW_ORDER);
  }, [currentStatusIndex, work?.status]);

  // ✅ Filter statuses based on workflow (only show next logical statuses)
  const getAvailableStatuses = () => {
    console.log('🔍 Getting available statuses for current status:', work?.status);
    
    // If no work or no status, show all
    if (!work?.status) {
      console.log('🔍 No work status, showing all options');
      return STATUS_OPTIONS;
    }
    
    // Based on current status, determine what's next
    let filtered;
    switch(work.status) {
      case 'accepted':
        filtered = STATUS_OPTIONS.filter(opt => opt.value === 'cutting-started');
        console.log('🔍 Status: accepted → showing cutting-started only:', filtered);
        return filtered;
      
      case 'cutting-started':
        filtered = STATUS_OPTIONS.filter(opt => opt.value === 'cutting-completed');
        console.log('🔍 Status: cutting-started → showing cutting-completed only:', filtered);
        return filtered;
      
      case 'cutting-completed':
        filtered = STATUS_OPTIONS.filter(opt => opt.value === 'sewing-started');
        console.log('🔍 Status: cutting-completed → showing sewing-started only:', filtered);
        return filtered;
      
      case 'sewing-started':
        filtered = STATUS_OPTIONS.filter(opt => opt.value === 'sewing-completed');
        console.log('🔍 Status: sewing-started → showing sewing-completed only:', filtered);
        return filtered;
      
      case 'sewing-completed':
        filtered = STATUS_OPTIONS.filter(opt => opt.value === 'ironing');
        console.log('🔍 Status: sewing-completed → showing ironing only:', filtered);
        return filtered;
      
      case 'ironing':
        filtered = STATUS_OPTIONS.filter(opt => opt.value === 'ready-to-deliver');
        console.log('🔍 Status: ironing → showing ready-to-deliver only:', filtered);
        return filtered;
      
      case 'ready-to-deliver':
        console.log('🔍 Status: ready-to-deliver → no further options');
        return [];
      
      default:
        console.log('🔍 Status: default → showing all options');
        return STATUS_OPTIONS;
    }
  };

  const availableStatuses = getAvailableStatuses();

  // Debug: Log available statuses
  useEffect(() => {
    console.log('🟣 Available Statuses:', availableStatuses.map(s => s.value));
  }, [availableStatuses]);

  // ✅ Check if status is allowed based on workflow
  const isStatusAllowed = (statusValue) => {
    const statusIndex = WORKFLOW_ORDER.indexOf(statusValue);
    const isAllowed = statusIndex > currentStatusIndex;
    console.log(`🔎 Checking if ${statusValue} (index ${statusIndex}) > current ${work?.status} (index ${currentStatusIndex}): ${isAllowed}`);
    return isAllowed;
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent any default form submission
    
    console.log('🚨 ===== FORM SUBMISSION ATTEMPT =====');
    console.log('🔘 Submit clicked at:', new Date().toISOString());
    console.log('🔘 selectedStatus:', selectedStatus);
    console.log('📝 notes:', notes);
    console.log('📦 work object:', work);
    console.log('📦 work._id:', work?._id);
    console.log('📦 work.workId:', work?.workId);
    console.log('📦 work.status:', work?.status);
    
    setDebugInfo(prev => ({ 
      ...prev, 
      submitAttempts: prev.submitAttempts + 1,
      lastSubmitTime: new Date().toISOString(),
      lastSelectedStatus: selectedStatus,
      lastNotes: notes
    }));
    
    if (!selectedStatus) {
      console.log('❌ Validation failed: No status selected');
      showToast.error('Please select a status');
      return;
    }

    // ✅ Validate workflow
    if (!isStatusAllowed(selectedStatus)) {
      console.log('❌ Validation failed: Invalid workflow transition');
      showToast.error('Invalid status transition. Please follow the workflow order.');
      return;
    }
    
    setLoading(true);
    try {
      console.log('📤 Calling onUpdate with:');
      console.log('   - status:', selectedStatus);
      console.log('   - notes:', notes);
      console.log('   - workId:', work?._id);
      
      // Check if onUpdate is a function
      console.log('📤 onUpdate type:', typeof onUpdate);
      console.log('📤 onUpdate function:', onUpdate);
      
      if (typeof onUpdate !== 'function') {
        console.error('❌ onUpdate is not a function!');
        showToast.error('Internal error: Update function not available');
        setLoading(false);
        return;
      }
      
      const result = await onUpdate(selectedStatus, notes);
      console.log('✅ Update successful, result:', result);
      console.log('🚨 ===== SUBMISSION COMPLETE =====');
      
      showToast.success(`Status updated to ${selectedStatus.replace(/-/g, ' ')}`);
      
      // Small delay to ensure toast is shown before closing
      setTimeout(() => {
        console.log('⏰ Closing modal after successful update');
        onClose(); // Close modal on success
      }, 500);
      
    } catch (error) {
      console.error('❌ Update failed with error:', error);
      console.error('❌ Error message:', error?.message);
      console.error('❌ Error stack:', error?.stack);
      console.log('🚨 ===== SUBMISSION FAILED =====');
      
      showToast.error(error?.message || 'Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  // Debug function to manually test the update
  const handleTestUpdate = () => {
    console.log('🧪 Running test update with current values');
    handleSubmit(new Event('submit'));
  };

  // ✅ Get status badge color based on status
  const getStatusBadgeColor = (status) => {
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-700',
      'accepted': 'bg-blue-100 text-blue-700',
      'cutting-started': 'bg-purple-100 text-purple-700',
      'cutting-completed': 'bg-indigo-100 text-indigo-700',
      'sewing-started': 'bg-pink-100 text-pink-700',
      'sewing-completed': 'bg-teal-100 text-teal-700',
      'ironing': 'bg-orange-100 text-orange-700',
      'ready-to-deliver': 'bg-green-100 text-green-700'
    };
    return colors[status] || 'bg-slate-100 text-slate-700';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl animate-in zoom-in duration-300">
        
        {/* Debug Panel */}
        {process.env.NODE_ENV === 'development' && (
          <div className="p-3 bg-slate-800 text-white rounded-t-2xl text-xs font-mono border-b border-slate-700">
            <details>
              <summary className="cursor-pointer font-bold mb-1">🔧 Debug Info (Click to expand)</summary>
              <div className="mt-2 space-y-1 p-2 bg-slate-900 rounded">
                <div>📦 Work ID: {work?._id || 'N/A'}</div>
                <div>📦 Work WorkId: {work?.workId || 'N/A'}</div>
                <div>📦 Current Status: {work?.status || 'N/A'}</div>
                <div>📊 Status Index: {currentStatusIndex}</div>
                <div>🎯 Selected Status: {selectedStatus || 'None'}</div>
                <div>📝 Notes Length: {notes.length}</div>
                <div>🔄 Loading: {loading ? 'true' : 'false'}</div>
                <div>📋 Available Statuses: {availableStatuses.map(s => s.value).join(', ') || 'None'}</div>
                <div>🔢 Submit Attempts: {debugInfo.submitAttempts}</div>
                {debugInfo.lastSubmitTime && <div>⏱️ Last Submit: {debugInfo.lastSubmitTime}</div>}
                <div>
                  <button
                    onClick={handleTestUpdate}
                    className="mt-2 px-2 py-1 bg-yellow-500 text-black rounded text-xs font-bold"
                  >
                    🧪 Test Update
                  </button>
                </div>
              </div>
            </details>
          </div>
        )}

        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-blue-600 to-blue-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-white">Update Work Status</h2>
              <p className="text-sm text-white/80 mt-1 flex items-center gap-2">
                <span className="font-mono">{work?.workId}</span>
                <span>•</span>
                <span>{work?.garment?.name}</span>
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-all"
            >
              <X size={20} className="text-white" />
            </button>
          </div>
        </div>

        {/* Current Status Info */}
        <div className="px-6 pt-4">
          <div className="bg-slate-50 rounded-lg p-3 flex items-center justify-between">
            <span className="text-sm text-slate-600">Current Status:</span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusBadgeColor(work?.status)}`}>
              {work?.status?.replace(/-/g, ' ') || 'Unknown'}
            </span>
          </div>

          {/* Work Progress Indicator */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-slate-500 mb-1">
              <span>Progress</span>
              <span>{Math.round((currentStatusIndex / (WORKFLOW_ORDER.length - 1)) * 100)}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(currentStatusIndex / (WORKFLOW_ORDER.length - 1)) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Status Options */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[400px] overflow-y-auto">
          <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
            <Clock size={16} className="text-blue-600" />
            Select Next Status
          </h3>
          
          {availableStatuses.length === 0 ? (
            <div className="text-center py-8">
              <AlertCircle size={40} className="text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">No further status updates available</p>
              <p className="text-xs text-slate-400 mt-2">This work is already completed</p>
            </div>
          ) : (
            availableStatuses.map((status) => {
              const Icon = status.icon;
              const isSelected = selectedStatus === status.value;
              const isAllowed = isStatusAllowed(status.value);
              
              return (
                <button
                  key={status.value}
                  type="button"
                  onClick={() => {
                    console.log(`📌 Status button clicked: ${status.value}`);
                    if (isAllowed) {
                      console.log('✅ Status allowed, setting selectedStatus to:', status.value);
                      setSelectedStatus(status.value);
                    } else {
                      console.log('❌ Status not allowed:', status.value);
                      showToast.warning('Please follow the workflow order');
                    }
                  }}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                    isSelected
                      ? `border-${status.color}-500 bg-${status.color}-50`
                      : isAllowed
                        ? 'border-slate-200 hover:border-blue-200 hover:bg-slate-50'
                        : 'border-slate-100 opacity-50 cursor-not-allowed'
                  }`}
                  disabled={!isAllowed}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      isSelected ? `bg-${status.color}-100` : 'bg-slate-100'
                    }`}>
                      <Icon size={20} className={isSelected ? `text-${status.color}-600` : 'text-slate-600'} />
                    </div>
                    <div className="flex-1">
                      <p className={`font-bold ${isSelected ? `text-${status.color}-700` : 'text-slate-700'}`}>
                        {status.label}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">{status.description}</p>
                    </div>
                    {isSelected && (
                      <div className={`w-5 h-5 rounded-full bg-${status.color}-500 flex items-center justify-center`}>
                        <CheckCircle size={12} className="text-white" />
                      </div>
                    )}
                  </div>
                </button>
              );
            })
          )}

          {/* Notes Section */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
              <FileText size={14} />
              Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => {
                console.log('📝 Notes changed:', e.target.value);
                setNotes(e.target.value);
              }}
              placeholder="Add any notes about this status update (measurements, issues, special instructions, etc.)"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              rows="3"
            />
          </div>

          {/* Footer */}
          <div className="flex gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedStatus || loading}
              onClick={() => console.log('🚀 Update button clicked, selectedStatus:', selectedStatus)}
              className={`flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all flex items-center justify-center gap-2 ${
                (!selectedStatus || loading) ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Updating...
                </>
              ) : (
                <>
                  Update Status
                  <CheckCircle size={18} />
                </>
              )}
            </button>
          </div>

          {/* Workflow Hint */}
          <div className="text-xs text-slate-400 text-center mt-2">
            <Clock size={12} className="inline mr-1" />
            Following workflow: Accepted → Cutting → Sewing → Ironing → Ready
          </div>
        </form>
      </div>
    </div>
  );
}