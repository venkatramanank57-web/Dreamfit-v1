// // Pages/works/CuttingMasterWorks.jsx
// import React, { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import {
//   Briefcase,
//   RefreshCw,
//   Clock,
//   CheckCircle,
//   Scissors,
//   Ruler,
//   Truck,
//   Eye,
//   UserPlus,
//   ChevronLeft,
//   ChevronRight
// } from 'lucide-react';
// import { 
//   fetchMyWorks,
//   acceptWorkById,
//   updateWorkStatusById,
//   selectMyWorks,
//   selectWorkPagination,
//   selectWorkLoading,
//   setFilters
// } from '../../features/work/workSlice';
// import UpdateStatusModal from '../../components/works/UpdateStatusModal';
// import showToast from '../../utils/toast';

// export default function CuttingMasterWorks() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
  
//   const works = useSelector(selectMyWorks);
//   const pagination = useSelector(selectWorkPagination);
//   const loading = useSelector(selectWorkLoading);
//   const { user } = useSelector((state) => state.auth);

//   // State for filter and modals
//   const [filter, setFilter] = useState('all');
//   const [showStatusModal, setShowStatusModal] = useState(false);
//   const [selectedWorkForStatus, setSelectedWorkForStatus] = useState(null);
//   const [debugInfo, setDebugInfo] = useState({
//     apiCalled: false,
//     response: null,
//     error: null,
//     worksCount: 0
//   });

//   // Debug logging
//   useEffect(() => {
//     console.log('🔍 ===== CUTTING MASTER WORKS PAGE LOADED =====');
//     console.log('👤 Current user from Redux:', user);
//     console.log('🔑 User ID:', user?._id || user?.id);
//     console.log('🎭 User Role:', user?.role);
//     console.log('📦 Initial works from Redux:', works);
//     console.log('📊 Initial pagination:', pagination);
//     console.log('🔄 Loading state:', loading);
//   }, []);

//   useEffect(() => {
//     console.log('📦 Works updated:', works);
//     console.log('📊 Count:', works?.length || 0);
//     setDebugInfo(prev => ({ ...prev, worksCount: works?.length || 0 }));
    
//     if (works && works.length > 0) {
//       console.log('📋 First work sample:', works[0]);
//     }
//   }, [works]);

//   useEffect(() => {
//     console.log('📄 Pagination updated:', pagination);
//   }, [pagination]);

//   useEffect(() => {
//     console.log('🔄 Loading state:', loading);
//   }, [loading]);

//   // Load works when filter changes
//   useEffect(() => {
//     console.log(`🎯 Filter changed to: ${filter}, loading works...`);
//     loadWorks();
//   }, [filter]);

//   const loadWorks = async () => {
//     console.log(`🚀 Calling fetchMyWorks with filter: ${filter}`);
//     setDebugInfo(prev => ({ ...prev, apiCalled: true, error: null }));
    
//     try {
//       // ✅ FIXED: Don't send status filter when 'all' is selected
//       const params = filter !== 'all' ? { status: filter } : {};
//       const result = await dispatch(fetchMyWorks(params)).unwrap();
//       console.log('✅ fetchMyWorks successful!');
//       console.log('📦 Result data:', result);
//       setDebugInfo(prev => ({ ...prev, response: result, error: null }));
//       return result;
//     } catch (error) {
//       console.error('❌ fetchMyWorks failed:', error);
//       setDebugInfo(prev => ({ ...prev, error: error.toString() }));
//       showToast.error('Failed to load works');
//     }
//   };

//   const handleRefresh = () => {
//     console.log('🔄 Manual refresh triggered');
//     loadWorks();
//     showToast.success('Data refreshed');
//   };

//   const handleAcceptWork = (id) => {
//     console.log(`✅ Accept work clicked for ID: ${id}`);
//     if (window.confirm('Accept this work?')) {
//       console.log(`📤 Dispatching acceptWorkById for: ${id}`);
//       dispatch(acceptWorkById(id)).then(() => {
//         console.log(`✅ Work ${id} accepted, reloading works...`);
//         loadWorks();
//         showToast.success('Work accepted successfully');
//       }).catch((error) => {
//         console.error('❌ Accept work failed:', error);
//         showToast.error('Failed to accept work');
//       });
//     }
//   };

//   const handleViewWork = (id) => {
//     console.log(`👁️ View work clicked for ID: ${id}`);
//     navigate(`/cuttingmaster/works/${id}`);
//   };

//   const handleUpdateStatus = (work) => {
//     console.log(`🔄 Update status clicked for work:`, work);
//     setSelectedWorkForStatus(work);
//     setShowStatusModal(true);
//   };

//   const handleStatusUpdate = async (newStatus, notes) => {
//     console.log(`📤 Updating work ${selectedWorkForStatus?._id} to status: ${newStatus}`);
//     console.log(`📝 Notes: ${notes}`);
    
//     if (selectedWorkForStatus) {
//       try {
//         await dispatch(updateWorkStatusById({ 
//           id: selectedWorkForStatus._id, 
//           status: newStatus,
//           notes 
//         })).unwrap();
        
//         setShowStatusModal(false);
//         setSelectedWorkForStatus(null);
//         await loadWorks();
//         showToast.success(`Status updated to ${newStatus.replace(/-/g, ' ')}`);
//       } catch (error) {
//         console.error('❌ Status update failed:', error);
//         showToast.error('Failed to update status');
//       }
//     }
//   };

//   const getStatusColor = (status) => {
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

//   const getStatusIcon = (status) => {
//     switch(status) {
//       case 'pending': return <Clock size={16} />;
//       case 'accepted': return <CheckCircle size={16} />;
//       case 'cutting-started': return <Scissors size={16} />;
//       case 'cutting-completed': return <Scissors size={16} />;
//       case 'sewing-started': return <Ruler size={16} />;
//       case 'sewing-completed': return <Ruler size={16} />;
//       case 'ironing': return <Truck size={16} />;
//       case 'ready-to-deliver': return <CheckCircle size={16} />;
//       default: return <Briefcase size={16} />;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-slate-50 p-6">
//       {/* Debug Panel */}
//       {process.env.NODE_ENV === 'development' && (
//         <div className="mb-6 p-4 bg-slate-800 text-white rounded-xl text-xs font-mono">
//           <details>
//             <summary className="cursor-pointer font-bold text-sm mb-2">🔧 Debug Info</summary>
//             <div className="mt-2 space-y-1">
//               <div>👤 User ID: {user?._id || user?.id || 'Not logged in'}</div>
//               <div>🎭 User Role: {user?.role || 'Unknown'}</div>
//               <div>📦 Works Count: {works?.length || 0}</div>
//               <div>📊 Pagination: {JSON.stringify(pagination)}</div>
//               <div>🔄 Loading: {loading ? 'true' : 'false'}</div>
//               <div>🎯 Current Filter: {filter}</div>
//               <div>📡 API Called: {debugInfo.apiCalled ? 'Yes' : 'No'}</div>
//               {debugInfo.error && <div>❌ Error: {debugInfo.error}</div>}
//             </div>
//           </details>
//         </div>
//       )}

//       {/* Header */}
//       <div className="mb-8">
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-3xl font-black text-slate-800 mb-2">My Works</h1>
//             <p className="text-slate-600">Manage your assigned cutting works</p>
//           </div>
//           <button
//             onClick={handleRefresh}
//             className="p-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-all"
//             title="Refresh"
//           >
//             <RefreshCw size={20} className={loading ? 'animate-spin text-blue-600' : 'text-slate-600'} />
//           </button>
//         </div>

//         {/* Filter Tabs */}
//         <div className="flex gap-2 mt-4 bg-white p-1 rounded-lg inline-flex">
//           <button
//             onClick={() => setFilter('all')}
//             className={`px-4 py-2 rounded-lg font-medium transition-all ${
//               filter === 'all' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
//             }`}
//           >
//             All
//           </button>
//           <button
//             onClick={() => setFilter('pending')}
//             className={`px-4 py-2 rounded-lg font-medium transition-all ${
//               filter === 'pending' ? 'bg-yellow-500 text-white' : 'text-slate-600 hover:bg-slate-100'
//             }`}
//           >
//             Pending
//           </button>
//           <button
//             onClick={() => setFilter('accepted')}
//             className={`px-4 py-2 rounded-lg font-medium transition-all ${
//               filter === 'accepted' ? 'bg-blue-500 text-white' : 'text-slate-600 hover:bg-slate-100'
//             }`}
//           >
//             Accepted
//           </button>
//           <button
//             onClick={() => setFilter('cutting-started')}
//             className={`px-4 py-2 rounded-lg font-medium transition-all ${
//               filter === 'cutting-started' ? 'bg-purple-500 text-white' : 'text-slate-600 hover:bg-slate-100'
//             }`}
//           >
//             Cutting
//           </button>
//           <button
//             onClick={() => setFilter('cutting-completed')}
//             className={`px-4 py-2 rounded-lg font-medium transition-all ${
//               filter === 'cutting-completed' ? 'bg-indigo-500 text-white' : 'text-slate-600 hover:bg-slate-100'
//             }`}
//           >
//             Completed
//           </button>
//           <button
//             onClick={() => setFilter('ready-to-deliver')}
//             className={`px-4 py-2 rounded-lg font-medium transition-all ${
//               filter === 'ready-to-deliver' ? 'bg-green-500 text-white' : 'text-slate-600 hover:bg-slate-100'
//             }`}
//           >
//             Ready
//           </button>
//         </div>
//       </div>

//       {/* Works Grid */}
//       {loading ? (
//         <div className="flex justify-center items-center h-64">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//         </div>
//       ) : works.length > 0 ? (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {works.map((work) => (
//             <div
//               key={work._id}
//               className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden border border-slate-200"
//             >
//               <div className="p-6">
//                 <div className="flex items-start justify-between mb-4">
//                   <div>
//                     <p className="text-xs text-slate-500 mb-1">Work ID</p>
//                     <p className="font-mono text-sm font-bold text-blue-600">{work.workId}</p>
//                   </div>
//                   <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(work.status)}`}>
//                     {getStatusIcon(work.status)}
//                     {work.status?.replace(/-/g, ' ')}
//                   </span>
//                 </div>

//                 <div className="mb-4">
//                   <h3 className="font-bold text-slate-800 text-lg mb-1">{work.garment?.name}</h3>
//                   <p className="text-sm text-slate-600">Order: {work.order?.orderId}</p>
//                   <p className="text-sm text-slate-600">Customer: {work.order?.customer?.name}</p>
//                 </div>

//                 <div className="space-y-2 mb-4">
//                   <div className="flex justify-between text-sm">
//                     <span className="text-slate-500">Est. Delivery:</span>
//                     <span className="font-medium text-slate-800">
//                       {work.estimatedDelivery ? new Date(work.estimatedDelivery).toLocaleDateString() : 'Not set'}
//                     </span>
//                   </div>
//                   {work.tailor && (
//                     <div className="flex justify-between text-sm">
//                       <span className="text-slate-500">Tailor:</span>
//                       <span className="font-medium text-slate-800">{work.tailor.name}</span>
//                     </div>
//                   )}
//                 </div>

//                 <div className="flex flex-col gap-2">
//                   {/* View Details Button */}
//                   <button
//                     onClick={() => handleViewWork(work._id)}
//                     className="w-full px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-medium hover:bg-blue-100 transition-all flex items-center justify-center gap-2"
//                   >
//                     <Eye size={16} />
//                     View Details
//                   </button>

//                   {/* Action Buttons */}
//                   <div className="flex gap-2">
//                     {work.status === 'pending' && (
//                       <button
//                         onClick={() => handleAcceptWork(work._id)}
//                         className="flex-1 px-4 py-2 bg-green-50 text-green-600 rounded-lg font-medium hover:bg-green-100 transition-all flex items-center justify-center gap-2"
//                       >
//                         <CheckCircle size={16} />
//                         Accept
//                       </button>
//                     )}

//                     {work.status === 'accepted' && !work.tailor && (
//                       <button
//                         onClick={() => navigate(`/cuttingmaster/works/${work._id}?assign=true`)}
//                         className="flex-1 px-4 py-2 bg-purple-50 text-purple-600 rounded-lg font-medium hover:bg-purple-100 transition-all flex items-center justify-center gap-2"
//                       >
//                         <UserPlus size={16} />
//                         Assign
//                       </button>
//                     )}

//                     {work.status !== 'pending' && 
//                      work.status !== 'ready-to-deliver' && 
//                      work.status !== 'accepted' && (
//                       <button
//                         onClick={() => handleUpdateStatus(work)}
//                         className="flex-1 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-medium hover:bg-blue-100 transition-all flex items-center justify-center gap-2"
//                       >
//                         <Clock size={16} />
//                         Update
//                       </button>
//                     )}

//                     {work.status === 'ready-to-deliver' && (
//                       <div className="flex-1 px-4 py-2 bg-green-100 text-green-700 rounded-lg font-medium text-center">
//                         ✓ Ready
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <div className="text-center py-12 bg-white rounded-xl">
//           <Briefcase size={48} className="text-slate-300 mx-auto mb-4" />
//           <p className="text-slate-500 text-lg mb-2">No works found</p>
//           <p className="text-sm text-slate-400 mb-4">You don't have any assigned works yet</p>
//           <button
//             onClick={handleRefresh}
//             className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all"
//           >
//             Refresh
//           </button>
//         </div>
//       )}

//       {/* Pagination */}
//       {pagination?.pages > 1 && (
//         <div className="mt-6 flex items-center justify-center gap-2">
//           <button
//             onClick={() => dispatch(setFilters({ page: pagination.page - 1 }))}
//             disabled={pagination.page === 1}
//             className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50"
//           >
//             <ChevronLeft size={18} />
//           </button>
//           <span className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg">
//             Page {pagination.page} of {pagination.pages}
//           </span>
//           <button
//             onClick={() => dispatch(setFilters({ page: pagination.page + 1 }))}
//             disabled={pagination.page === pagination.pages}
//             className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50"
//           >
//             <ChevronRight size={18} />
//           </button>
//         </div>
//       )}

//       {/* Update Status Modal */}
//       {showStatusModal && selectedWorkForStatus && (
//         <UpdateStatusModal
//           work={selectedWorkForStatus}
//           onClose={() => {
//             setShowStatusModal(false);
//             setSelectedWorkForStatus(null);
//           }}
//           onUpdate={handleStatusUpdate}
//         />
//       )}
//     </div>
//   );
// }




// // Pages/works/CuttingMasterWorks.jsx
// import React, { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import {
//   Briefcase,
//   RefreshCw,
//   Clock,
//   CheckCircle,
//   Scissors,
//   Ruler,
//   Truck,
//   Eye,
//   UserPlus,
//   ChevronLeft,
//   ChevronRight,
//   Check,
//   AlertCircle,
//   X,
//   Calendar,
//   Hash,
//   Package,
//   User
// } from 'lucide-react';
// import { 
//   fetchMyWorks,
//   acceptWorkById,
//   selectMyWorks,
//   selectWorkPagination,
//   selectWorkLoading,
//   setFilters
// } from '../../features/work/workSlice';
// import showToast from '../../utils/toast';

// export default function CuttingMasterWorks() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
  
//   const works = useSelector(selectMyWorks);
//   const pagination = useSelector(selectWorkPagination);
//   const loading = useSelector(selectWorkLoading);
//   const { user } = useSelector((state) => state.auth);

//   // State
//   const [filter, setFilter] = useState('all');
//   const [acceptingId, setAcceptingId] = useState(null);
//   const [showSuccessModal, setShowSuccessModal] = useState(false);
//   const [acceptedWork, setAcceptedWork] = useState(null);

//   // Load works when filter changes
//   useEffect(() => {
//     loadWorks();
//   }, [filter]);

//   const loadWorks = async () => {
//     try {
//       const params = filter !== 'all' ? { status: filter } : {};
//       await dispatch(fetchMyWorks(params)).unwrap();
//     } catch (error) {
//       showToast.error('Failed to load works');
//     }
//   };

//   const handleRefresh = () => {
//     loadWorks();
//     showToast.success('Data refreshed');
//   };

//   // Accept work
//   const handleAcceptWork = async (work) => {
//     console.log(`✅ Attempting to accept work: ${work._id}`);
    
//     setAcceptingId(work._id);
    
//     if (work.status !== 'pending') {
//       showToast.info('This work is no longer available');
//       setAcceptingId(null);
//       loadWorks();
//       return;
//     }
    
//     if (!window.confirm('Accept this work? It will be assigned to you.')) {
//       setAcceptingId(null);
//       return;
//     }
    
//     try {
//       const result = await dispatch(acceptWorkById(work._id)).unwrap();
      
//       showToast.success('Work accepted successfully!');
      
//       setAcceptedWork({
//         ...work,
//         ...result.data,
//         assignedTo: user?.name
//       });
//       setShowSuccessModal(true);
      
//       loadWorks();
      
//     } catch (error) {
//       console.error('❌ Accept failed:', error);
      
//       if (error === 'This work was already accepted by another cutting master') {
//         showToast.error('This work was just taken by another cutting master');
//       } else {
//         showToast.error(error || 'Failed to accept work');
//       }
      
//       loadWorks();
      
//     } finally {
//       setAcceptingId(null);
//     }
//   };

//   // View work details
//   const handleViewWork = (id) => {
//     navigate(`/cuttingmaster/works/${id}`);
//   };

//   // Assign tailor
//   const handleAssignTailor = (workId) => {
//     navigate(`/cuttingmaster/works/${workId}?assign=true`);
//   };

//   const getStatusColor = (status) => {
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

//   const getStatusIcon = (status) => {
//     switch(status) {
//       case 'pending': return <Clock size={16} />;
//       case 'accepted': return <CheckCircle size={16} />;
//       case 'cutting-started': return <Scissors size={16} />;
//       case 'cutting-completed': return <Scissors size={16} />;
//       case 'sewing-started': return <Ruler size={16} />;
//       case 'sewing-completed': return <Ruler size={16} />;
//       case 'ironing': return <Truck size={16} />;
//       case 'ready-to-deliver': return <CheckCircle size={16} />;
//       default: return <Briefcase size={16} />;
//     }
//   };

//   // Format date
//   const formatDate = (dateString) => {
//     if (!dateString) return 'Not set';
//     return new Date(dateString).toLocaleDateString('en-GB', {
//       day: '2-digit',
//       month: 'short',
//       year: 'numeric'
//     });
//   };

//   // Separate works
//   const pendingWorks = works?.filter(w => w.status === 'pending') || [];
//   const acceptedWorks = works?.filter(w => w.status === 'accepted') || [];
//   const inProgressWorks = works?.filter(w => 
//     w.status !== 'pending' && 
//     w.status !== 'accepted' && 
//     w.status !== 'ready-to-deliver'
//   ) || [];
//   const readyWorks = works?.filter(w => w.status === 'ready-to-deliver') || [];

//   return (
//     <div className="min-h-screen bg-slate-50 p-6">
//       {/* Header */}
//       <div className="mb-8">
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-3xl font-black text-slate-800 mb-2">Cutting Master Works</h1>
//             <p className="text-slate-600">Accept available works and assign tailors</p>
//           </div>
//           <button
//             onClick={handleRefresh}
//             className="p-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-all"
//             title="Refresh"
//           >
//             <RefreshCw size={20} className={loading ? 'animate-spin text-blue-600' : 'text-slate-600'} />
//           </button>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-4 gap-4 mt-6">
//           <div className="bg-white p-4 rounded-xl shadow-sm">
//             <div className="flex items-center gap-3">
//               <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
//                 <Clock size={20} className="text-yellow-600" />
//               </div>
//               <div>
//                 <p className="text-sm text-slate-500">Available</p>
//                 <p className="text-2xl font-bold">{pendingWorks.length}</p>
//               </div>
//             </div>
//           </div>
//           <div className="bg-white p-4 rounded-xl shadow-sm">
//             <div className="flex items-center gap-3">
//               <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
//                 <CheckCircle size={20} className="text-blue-600" />
//               </div>
//               <div>
//                 <p className="text-sm text-slate-500">Accepted</p>
//                 <p className="text-2xl font-bold">{acceptedWorks.length}</p>
//               </div>
//             </div>
//           </div>
//           <div className="bg-white p-4 rounded-xl shadow-sm">
//             <div className="flex items-center gap-3">
//               <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
//                 <Scissors size={20} className="text-purple-600" />
//               </div>
//               <div>
//                 <p className="text-sm text-slate-500">In Progress</p>
//                 <p className="text-2xl font-bold">{inProgressWorks.length}</p>
//               </div>
//             </div>
//           </div>
//           <div className="bg-white p-4 rounded-xl shadow-sm">
//             <div className="flex items-center gap-3">
//               <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
//                 <Truck size={20} className="text-green-600" />
//               </div>
//               <div>
//                 <p className="text-sm text-slate-500">Ready</p>
//                 <p className="text-2xl font-bold">{readyWorks.length}</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Filter Tabs */}
//         <div className="flex gap-2 mt-6 bg-white p-1 rounded-lg inline-flex">
//           <button
//             onClick={() => setFilter('all')}
//             className={`px-4 py-2 rounded-lg font-medium transition-all ${
//               filter === 'all' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
//             }`}
//           >
//             All ({works?.length || 0})
//           </button>
//           <button
//             onClick={() => setFilter('pending')}
//             className={`px-4 py-2 rounded-lg font-medium transition-all ${
//               filter === 'pending' ? 'bg-yellow-500 text-white' : 'text-slate-600 hover:bg-slate-100'
//             }`}
//           >
//             Available ({pendingWorks.length})
//           </button>
//           <button
//             onClick={() => setFilter('accepted')}
//             className={`px-4 py-2 rounded-lg font-medium transition-all ${
//               filter === 'accepted' ? 'bg-blue-500 text-white' : 'text-slate-600 hover:bg-slate-100'
//             }`}
//           >
//             Accepted ({acceptedWorks.length})
//           </button>
//         </div>
//       </div>

//       {/* Loading State */}
//       {loading && (
//         <div className="flex justify-center items-center h-64">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//         </div>
//       )}

//       {/* Available Works Section */}
//       {!loading && pendingWorks.length > 0 && (
//         <div className="mb-8">
//           <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
//             <Clock size={20} className="text-yellow-600" />
//             Available Works ({pendingWorks.length})
//           </h2>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {pendingWorks.map((work) => (
//               <div
//                 key={work._id}
//                 className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden border-2 border-yellow-200"
//               >
//                 <div className="p-6">
//                   {/* Header with Work ID and Status */}
//                   <div className="flex items-start justify-between mb-4">
//                     <div className="space-y-1">
//                       <p className="text-xs text-slate-500 flex items-center gap-1">
//                         <Hash size={12} />
//                         Work ID
//                       </p>
//                       <p className="font-mono text-sm font-bold text-yellow-600">{work.workId}</p>
//                     </div>
//                     <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
//                       <Clock size={14} />
//                       Available
//                     </span>
//                   </div>

//                   {/* Garment Details */}
//                   <div className="mb-4">
//                     <h3 className="font-bold text-slate-800 text-lg mb-1">{work.garment?.name || 'N/A'}</h3>
                    
//                     {/* Garment ID */}
//                     <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
//                       <Package size={14} className="text-purple-500" />
//                       <span>Garment ID: {work.garment?.garmentId || 'N/A'}</span>
//                     </div>

//                     {/* Order ID and Customer */}
//                     <div className="space-y-1 text-sm">
//                       <p className="text-slate-600">Order: {work.order?.orderId || 'N/A'}</p>
//                       {work.order?.customer && (
//                         <p className="text-slate-600 flex items-center gap-1">
//                           <User size={14} className="text-blue-500" />
//                           {work.order.customer.name}
//                         </p>
//                       )}
//                     </div>
//                   </div>

//                   {/* Estimated Delivery */}
//                   <div className="flex items-center gap-2 text-sm text-slate-600 mb-4">
//                     <Calendar size={14} className="text-orange-500" />
//                     <span>Est. Delivery: {formatDate(work.estimatedDelivery)}</span>
//                   </div>

//                   {/* Accept Button */}
//                   <button
//                     onClick={() => handleAcceptWork(work)}
//                     disabled={acceptingId === work._id}
//                     className={`w-full px-4 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
//                       acceptingId === work._id
//                         ? 'bg-gray-400 cursor-not-allowed'
//                         : 'bg-green-600 hover:bg-green-700 text-white'
//                     }`}
//                   >
//                     {acceptingId === work._id ? (
//                       <>
//                         <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                         Processing...
//                       </>
//                     ) : (
//                       <>
//                         <CheckCircle size={18} />
//                         Accept Work
//                       </>
//                     )}
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Accepted Works Section */}
//       {!loading && acceptedWorks.length > 0 && (
//         <div className="mb-8">
//           <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
//             <CheckCircle size={20} className="text-blue-600" />
//             Accepted Works - Need Tailor ({acceptedWorks.length})
//           </h2>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {acceptedWorks.map((work) => (
//               <div
//                 key={work._id}
//                 className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden border-2 border-blue-200"
//               >
//                 <div className="p-6">
//                   {/* Header with Work ID and Status */}
//                   <div className="flex items-start justify-between mb-4">
//                     <div className="space-y-1">
//                       <p className="text-xs text-slate-500 flex items-center gap-1">
//                         <Hash size={12} />
//                         Work ID
//                       </p>
//                       <p className="font-mono text-sm font-bold text-blue-600">{work.workId}</p>
//                     </div>
//                     <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
//                       <CheckCircle size={14} />
//                       Accepted
//                     </span>
//                   </div>

//                   {/* Garment Details */}
//                   <div className="mb-4">
//                     <h3 className="font-bold text-slate-800 text-lg mb-1">{work.garment?.name || 'N/A'}</h3>
                    
//                     {/* Garment ID */}
//                     <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
//                       <Package size={14} className="text-purple-500" />
//                       <span>Garment ID: {work.garment?.garmentId || 'N/A'}</span>
//                     </div>

//                     {/* Order ID and Customer */}
//                     <div className="space-y-1 text-sm">
//                       <p className="text-slate-600">Order: {work.order?.orderId || 'N/A'}</p>
//                       {work.order?.customer && (
//                         <p className="text-slate-600 flex items-center gap-1">
//                           <User size={14} className="text-blue-500" />
//                           {work.order.customer.name}
//                         </p>
//                       )}
//                     </div>
//                   </div>

//                   {/* Estimated Delivery */}
//                   <div className="flex items-center gap-2 text-sm text-slate-600 mb-4">
//                     <Calendar size={14} className="text-orange-500" />
//                     <span>Est. Delivery: {formatDate(work.estimatedDelivery)}</span>
//                   </div>

//                   {/* Action Buttons */}
//                   <div className="flex gap-2">
//                     {/* View Details Button - EYE ICON */}
//                     <button
//                       onClick={() => handleViewWork(work._id)}
//                       className="flex-1 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-medium hover:bg-blue-100 transition-all flex items-center justify-center gap-2"
//                     >
//                       <Eye size={16} />
//                       View
//                     </button>
                    
//                     {/* Assign Tailor Button */}
//                     <button
//                       onClick={() => handleAssignTailor(work._id)}
//                       className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-all flex items-center justify-center gap-2"
//                     >
//                       <UserPlus size={16} />
//                       Assign
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* In Progress Works Section */}
//       {!loading && inProgressWorks.length > 0 && (
//         <div className="mb-8">
//           <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
//             <Scissors size={20} className="text-purple-600" />
//             In Progress ({inProgressWorks.length})
//           </h2>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {inProgressWorks.map((work) => (
//               <div
//                 key={work._id}
//                 className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden border border-purple-200"
//               >
//                 <div className="p-6">
//                   {/* Header with Work ID and Status */}
//                   <div className="flex items-start justify-between mb-4">
//                     <div className="space-y-1">
//                       <p className="text-xs text-slate-500 flex items-center gap-1">
//                         <Hash size={12} />
//                         Work ID
//                       </p>
//                       <p className="font-mono text-sm font-bold text-purple-600">{work.workId}</p>
//                     </div>
//                     <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(work.status)}`}>
//                       {getStatusIcon(work.status)}
//                       {work.status?.replace(/-/g, ' ')}
//                     </span>
//                   </div>

//                   {/* Garment Details */}
//                   <div className="mb-4">
//                     <h3 className="font-bold text-slate-800 text-lg mb-1">{work.garment?.name || 'N/A'}</h3>
                    
//                     {/* Garment ID */}
//                     <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
//                       <Package size={14} className="text-purple-500" />
//                       <span>Garment ID: {work.garment?.garmentId || 'N/A'}</span>
//                     </div>

//                     {/* Order ID and Customer */}
//                     <div className="space-y-1 text-sm">
//                       <p className="text-slate-600">Order: {work.order?.orderId || 'N/A'}</p>
//                       {work.order?.customer && (
//                         <p className="text-slate-600 flex items-center gap-1">
//                           <User size={14} className="text-blue-500" />
//                           {work.order.customer.name}
//                         </p>
//                       )}
//                       {work.tailor && (
//                         <p className="text-slate-600 flex items-center gap-1 mt-1">
//                           <Scissors size={14} className="text-green-500" />
//                           Tailor: {work.tailor.name}
//                         </p>
//                       )}
//                     </div>
//                   </div>

//                   {/* Estimated Delivery */}
//                   <div className="flex items-center gap-2 text-sm text-slate-600 mb-4">
//                     <Calendar size={14} className="text-orange-500" />
//                     <span>Est. Delivery: {formatDate(work.estimatedDelivery)}</span>
//                   </div>

//                   {/* View Details Button - EYE ICON */}
//                   <button
//                     onClick={() => handleViewWork(work._id)}
//                     className="w-full px-4 py-2 bg-purple-50 text-purple-600 rounded-lg font-medium hover:bg-purple-100 transition-all flex items-center justify-center gap-2"
//                   >
//                     <Eye size={16} />
//                     View Details
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Ready Works Section */}
//       {!loading && readyWorks.length > 0 && (
//         <div className="mb-8">
//           <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
//             <Truck size={20} className="text-green-600" />
//             Ready to Deliver ({readyWorks.length})
//           </h2>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {readyWorks.map((work) => (
//               <div
//                 key={work._id}
//                 className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden border-2 border-green-200"
//               >
//                 <div className="p-6">
//                   {/* Header with Work ID and Status */}
//                   <div className="flex items-start justify-between mb-4">
//                     <div className="space-y-1">
//                       <p className="text-xs text-slate-500 flex items-center gap-1">
//                         <Hash size={12} />
//                         Work ID
//                       </p>
//                       <p className="font-mono text-sm font-bold text-green-600">{work.workId}</p>
//                     </div>
//                     <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
//                       <Check size={14} />
//                       Ready
//                     </span>
//                   </div>

//                   {/* Garment Details */}
//                   <div className="mb-4">
//                     <h3 className="font-bold text-slate-800 text-lg mb-1">{work.garment?.name || 'N/A'}</h3>
                    
//                     {/* Garment ID */}
//                     <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
//                       <Package size={14} className="text-purple-500" />
//                       <span>Garment ID: {work.garment?.garmentId || 'N/A'}</span>
//                     </div>

//                     {/* Order ID and Customer */}
//                     <div className="space-y-1 text-sm">
//                       <p className="text-slate-600">Order: {work.order?.orderId || 'N/A'}</p>
//                       {work.order?.customer && (
//                         <p className="text-slate-600 flex items-center gap-1">
//                           <User size={14} className="text-blue-500" />
//                           {work.order.customer.name}
//                         </p>
//                       )}
//                     </div>
//                   </div>

//                   {/* View Details Button - EYE ICON */}
//                   <button
//                     onClick={() => handleViewWork(work._id)}
//                     className="w-full px-4 py-2 bg-green-50 text-green-600 rounded-lg font-medium hover:bg-green-100 transition-all flex items-center justify-center gap-2"
//                   >
//                     <Eye size={16} />
//                     View Details
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* No Works State */}
//       {!loading && works?.length === 0 && (
//         <div className="text-center py-12 bg-white rounded-xl">
//           <Briefcase size={48} className="text-slate-300 mx-auto mb-4" />
//           <p className="text-slate-500 text-lg mb-2">No works found</p>
//           <p className="text-sm text-slate-400 mb-4">There are no works available at the moment</p>
//           <button
//             onClick={handleRefresh}
//             className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all"
//           >
//             Refresh
//           </button>
//         </div>
//       )}

//       {/* Pagination */}
//       {pagination?.pages > 1 && (
//         <div className="mt-6 flex items-center justify-center gap-2">
//           <button
//             onClick={() => dispatch(setFilters({ page: pagination.page - 1 }))}
//             disabled={pagination.page === 1}
//             className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50"
//           >
//             <ChevronLeft size={18} />
//           </button>
//           <span className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg">
//             Page {pagination.page} of {pagination.pages}
//           </span>
//           <button
//             onClick={() => dispatch(setFilters({ page: pagination.page + 1 }))}
//             disabled={pagination.page === pagination.pages}
//             className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50"
//           >
//             <ChevronRight size={18} />
//           </button>
//         </div>
//       )}

//       {/* Success Modal */}
//       {showSuccessModal && acceptedWork && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-xl max-w-md w-full p-6 animate-in zoom-in duration-300">
//             <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
//               <CheckCircle size={32} className="text-green-600" />
//             </div>
            
//             <h2 className="text-xl font-bold text-center mb-2">Work Accepted Successfully!</h2>
            
//             <div className="bg-green-50 p-4 rounded-lg mb-4">
//               <p className="text-sm text-green-700 mb-2">
//                 This work is now assigned to:
//               </p>
//               <p className="font-bold text-lg text-green-800">{acceptedWork.assignedTo}</p>
//               <p className="text-xs text-green-600 mt-1">
//                 Work ID: {acceptedWork.workId}
//               </p>
//             </div>

//             <div className="flex gap-3">
//               <button
//                 onClick={() => {
//                   setShowSuccessModal(false);
//                   navigate(`/cuttingmaster/works/${acceptedWork._id}?assign=true`);
//                 }}
//                 className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
//               >
//                 Assign Tailor Now
//               </button>
//               <button
//                 onClick={() => setShowSuccessModal(false)}
//                 className="flex-1 px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300"
//               >
//                 Later
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }






// // Pages/works/CuttingMasterWorks.jsx
// import React, { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import {
//   Briefcase,
//   RefreshCw,
//   Clock,
//   CheckCircle,
//   Scissors,
//   Ruler,
//   Truck,
//   Eye,
//   UserPlus,
//   ChevronLeft,
//   ChevronRight,
//   Check,
//   AlertCircle,
//   X,
//   Calendar,
//   Hash,
//   Package,
//   User
// } from 'lucide-react';
// import { 
//   fetchMyWorks,
//   acceptWorkById,
//   selectMyWorks,
//   selectWorkPagination,
//   selectWorkLoading,
//   setFilters
// } from '../../features/work/workSlice';
// import showToast from '../../utils/toast';

// export default function CuttingMasterWorks() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
  
//   const works = useSelector(selectMyWorks);
//   const pagination = useSelector(selectWorkPagination);
//   const loading = useSelector(selectWorkLoading);
//   const { user } = useSelector((state) => state.auth);

//   // State
//   const [filter, setFilter] = useState('all');
//   const [acceptingId, setAcceptingId] = useState(null);
//   const [showSuccessModal, setShowSuccessModal] = useState(false);
//   const [acceptedWork, setAcceptedWork] = useState(null);

//   // Load works when filter changes
//   useEffect(() => {
//     loadWorks();
//   }, [filter]);

//   // 🔥 FIXED: loadWorks with proper filter params
//   const loadWorks = async () => {
//     try {
//       let params = {};
      
//       if (filter === 'assigned') {
//         // Works that have a tailor assigned
//         params.hasTailor = 'true';
//       } else if (filter === 'unassigned') {
//         // Works accepted by cutting master but no tailor assigned yet
//         params.hasTailor = 'false';
//         params.status = 'accepted';
//       } else if (filter !== 'all') {
//         params.status = filter;
//       }

//       console.log('🔍 Loading works with params:', params);
//       await dispatch(fetchMyWorks(params)).unwrap();
//     } catch (error) {
//       showToast.error('Failed to load works');
//     }
//   };

//   const handleRefresh = () => {
//     loadWorks();
//     showToast.success('Data refreshed');
//   };

//   // Accept work
//   const handleAcceptWork = async (work) => {
//     console.log(`✅ Attempting to accept work: ${work._id}`);
    
//     setAcceptingId(work._id);
    
//     if (work.status !== 'pending') {
//       showToast.info('This work is no longer available');
//       setAcceptingId(null);
//       loadWorks();
//       return;
//     }
    
//     if (!window.confirm('Accept this work? It will be assigned to you.')) {
//       setAcceptingId(null);
//       return;
//     }
    
//     try {
//       const result = await dispatch(acceptWorkById(work._id)).unwrap();
      
//       showToast.success('Work accepted successfully!');
      
//       setAcceptedWork({
//         ...work,
//         ...result.data,
//         assignedTo: user?.name
//       });
//       setShowSuccessModal(true);
      
//       loadWorks();
      
//     } catch (error) {
//       console.error('❌ Accept failed:', error);
      
//       if (error === 'This work was already accepted by another cutting master') {
//         showToast.error('This work was just taken by another cutting master');
//       } else {
//         showToast.error(error || 'Failed to accept work');
//       }
      
//       loadWorks();
      
//     } finally {
//       setAcceptingId(null);
//     }
//   };

//   // View work details
//   const handleViewWork = (id) => {
//     navigate(`/cuttingmaster/works/${id}`);
//   };

//   // Assign tailor
//   const handleAssignTailor = (workId) => {
//     navigate(`/cuttingmaster/works/${workId}?assign=true`);
//   };

//   const getStatusColor = (status) => {
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

//   const getStatusIcon = (status) => {
//     switch(status) {
//       case 'pending': return <Clock size={16} />;
//       case 'accepted': return <CheckCircle size={16} />;
//       case 'cutting-started': return <Scissors size={16} />;
//       case 'cutting-completed': return <Scissors size={16} />;
//       case 'sewing-started': return <Ruler size={16} />;
//       case 'sewing-completed': return <Ruler size={16} />;
//       case 'ironing': return <Truck size={16} />;
//       case 'ready-to-deliver': return <CheckCircle size={16} />;
//       default: return <Briefcase size={16} />;
//     }
//   };

//   // Format date
//   const formatDate = (dateString) => {
//     if (!dateString) return 'Not set';
//     return new Date(dateString).toLocaleDateString('en-GB', {
//       day: '2-digit',
//       month: 'short',
//       year: 'numeric'
//     });
//   };

//   // Filter works based on current filter
//   const filteredWorks = works?.filter(work => {
//     if (filter === 'assigned') {
//       return work.tailor !== null && work.tailor !== undefined;
//     } else if (filter === 'unassigned') {
//       return work.status === 'accepted' && !work.tailor;
//     } else if (filter === 'all') {
//       return true;
//     } else {
//       return work.status === filter;
//     }
//   }) || [];

//   // Separate works for stats
//   const pendingWorks = works?.filter(w => w.status === 'pending') || [];
//   const acceptedWorks = works?.filter(w => w.status === 'accepted') || [];
//   const inProgressWorks = works?.filter(w => 
//     w.status !== 'pending' && 
//     w.status !== 'accepted' && 
//     w.status !== 'ready-to-deliver'
//   ) || [];
//   const readyWorks = works?.filter(w => w.status === 'ready-to-deliver') || [];

//   // Count for assigned/unassigned
//   const assignedCount = works?.filter(w => w.tailor).length || 0;
//   const unassignedCount = works?.filter(w => w.status === 'accepted' && !w.tailor).length || 0;

//   return (
//     <div className="min-h-screen bg-slate-50 p-6">
//       {/* Header */}
//       <div className="mb-8">
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-3xl font-black text-slate-800 mb-2">Cutting Master Works</h1>
//             <p className="text-slate-600">Accept available works and assign tailors</p>
//           </div>
//           <button
//             onClick={handleRefresh}
//             className="p-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-all"
//             title="Refresh"
//           >
//             <RefreshCw size={20} className={loading ? 'animate-spin text-blue-600' : 'text-slate-600'} />
//           </button>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-4 gap-4 mt-6">
//           <div className="bg-white p-4 rounded-xl shadow-sm">
//             <div className="flex items-center gap-3">
//               <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
//                 <Clock size={20} className="text-yellow-600" />
//               </div>
//               <div>
//                 <p className="text-sm text-slate-500">Available</p>
//                 <p className="text-2xl font-bold">{pendingWorks.length}</p>
//               </div>
//             </div>
//           </div>
//           <div className="bg-white p-4 rounded-xl shadow-sm">
//             <div className="flex items-center gap-3">
//               <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
//                 <CheckCircle size={20} className="text-blue-600" />
//               </div>
//               <div>
//                 <p className="text-sm text-slate-500">Accepted</p>
//                 <p className="text-2xl font-bold">{acceptedWorks.length}</p>
//               </div>
//             </div>
//           </div>
//           <div className="bg-white p-4 rounded-xl shadow-sm">
//             <div className="flex items-center gap-3">
//               <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
//                 <Scissors size={20} className="text-purple-600" />
//               </div>
//               <div>
//                 <p className="text-sm text-slate-500">In Progress</p>
//                 <p className="text-2xl font-bold">{inProgressWorks.length}</p>
//               </div>
//             </div>
//           </div>
//           <div className="bg-white p-4 rounded-xl shadow-sm">
//             <div className="flex items-center gap-3">
//               <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
//                 <Truck size={20} className="text-green-600" />
//               </div>
//               <div>
//                 <p className="text-sm text-slate-500">Ready</p>
//                 <p className="text-2xl font-bold">{readyWorks.length}</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* 🔥 FIXED: Filter Tabs with Assigned/Unassigned */}
//         <div className="flex flex-wrap gap-2 mt-6 bg-white p-1 rounded-lg inline-flex shadow-sm border">
//           <button
//             onClick={() => setFilter('all')}
//             className={`px-4 py-2 rounded-lg font-medium transition-all ${
//               filter === 'all' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
//             }`}
//           >
//             All ({works?.length || 0})
//           </button>
          
//           <button
//             onClick={() => setFilter('pending')}
//             className={`px-4 py-2 rounded-lg font-medium transition-all ${
//               filter === 'pending' ? 'bg-yellow-500 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
//             }`}
//           >
//             Available ({pendingWorks.length})
//           </button>

//           <button
//             onClick={() => setFilter('accepted')}
//             className={`px-4 py-2 rounded-lg font-medium transition-all ${
//               filter === 'accepted' ? 'bg-blue-500 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
//             }`}
//           >
//             Accepted ({acceptedWorks.length})
//           </button>

//           {/* 🔥 NEW: Unassigned Button */}
//           <button
//             onClick={() => setFilter('unassigned')}
//             className={`px-4 py-2 rounded-lg font-medium transition-all ${
//               filter === 'unassigned' ? 'bg-orange-500 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
//             }`}
//           >
//             Need Tailor ({unassignedCount})
//           </button>

//           {/* 🔥 NEW: Assigned Button */}
//           <button
//             onClick={() => setFilter('assigned')}
//             className={`px-4 py-2 rounded-lg font-medium transition-all ${
//               filter === 'assigned' ? 'bg-green-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
//             }`}
//           >
//             Assigned ({assignedCount})
//           </button>
//         </div>
//       </div>

//       {/* Loading State */}
//       {loading && (
//         <div className="flex justify-center items-center h-64">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//         </div>
//       )}

//       {/* 🔥 FIXED: Dynamic Work List Based on Filter */}
//       {!loading && filteredWorks.length > 0 ? (
//         <div className="mb-8">
//           <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2 capitalize">
//             {filter.replace(/-/g, ' ')} Works ({filteredWorks.length})
//           </h2>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {filteredWorks.map((work) => (
//               <div
//                 key={work._id}
//                 className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden border-2 ${
//                   work.status === 'pending' ? 'border-yellow-200' : 
//                   work.tailor ? 'border-green-200' : 
//                   work.status === 'accepted' ? 'border-blue-200' : 'border-slate-200'
//                 }`}
//               >
//                 <div className="p-6">
//                   {/* Header with Work ID and Status */}
//                   <div className="flex items-start justify-between mb-4">
//                     <div className="space-y-1">
//                       <p className="text-xs text-slate-500 flex items-center gap-1">
//                         <Hash size={12} />
//                         Work ID
//                       </p>
//                       <p className="font-mono text-sm font-bold text-blue-600">{work.workId}</p>
//                     </div>
//                     <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(work.status)}`}>
//                       {getStatusIcon(work.status)}
//                       {work.status?.replace(/-/g, ' ')}
//                     </span>
//                   </div>

//                   {/* Garment Details */}
//                   <div className="mb-4">
//                     <h3 className="font-bold text-slate-800 text-lg mb-1">{work.garment?.name || 'N/A'}</h3>
                    
//                     {/* Garment ID */}
//                     <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
//                       <Package size={14} className="text-purple-500" />
//                       <span>Garment ID: {work.garment?.garmentId || 'N/A'}</span>
//                     </div>

//                     {/* Order ID and Customer */}
//                     <div className="space-y-1 text-sm">
//                       <p className="text-slate-600">Order: {work.order?.orderId || 'N/A'}</p>
//                       {work.order?.customer && (
//                         <p className="text-slate-600 flex items-center gap-1">
//                           <User size={14} className="text-blue-500" />
//                           {work.order.customer.name}
//                         </p>
//                       )}
//                       {work.tailor && (
//                         <p className="text-slate-600 flex items-center gap-1 mt-1">
//                           <Scissors size={14} className="text-green-500" />
//                           Tailor: {work.tailor.name}
//                         </p>
//                       )}
//                     </div>
//                   </div>

//                   {/* Estimated Delivery */}
//                   <div className="flex items-center gap-2 text-sm text-slate-600 mb-4">
//                     <Calendar size={14} className="text-orange-500" />
//                     <span>Est. Delivery: {formatDate(work.estimatedDelivery)}</span>
//                   </div>

//                   {/* Action Buttons - Based on Work Status */}
//                   {work.status === 'pending' ? (
//                     <button
//                       onClick={() => handleAcceptWork(work)}
//                       disabled={acceptingId === work._id}
//                       className={`w-full px-4 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
//                         acceptingId === work._id
//                           ? 'bg-gray-400 cursor-not-allowed'
//                           : 'bg-green-600 hover:bg-green-700 text-white'
//                       }`}
//                     >
//                       {acceptingId === work._id ? (
//                         <>
//                           <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                           Processing...
//                         </>
//                       ) : (
//                         <>
//                           <CheckCircle size={18} />
//                           Accept Work
//                         </>
//                       )}
//                     </button>
//                   ) : work.status === 'accepted' && !work.tailor ? (
//                     <div className="flex gap-2">
//                       <button
//                         onClick={() => handleViewWork(work._id)}
//                         className="flex-1 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-medium hover:bg-blue-100 transition-all flex items-center justify-center gap-2"
//                       >
//                         <Eye size={16} />
//                         View
//                       </button>
//                       <button
//                         onClick={() => handleAssignTailor(work._id)}
//                         className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-all flex items-center justify-center gap-2"
//                       >
//                         <UserPlus size={16} />
//                         Assign
//                       </button>
//                     </div>
//                   ) : (
//                     <button
//                       onClick={() => handleViewWork(work._id)}
//                       className="w-full px-4 py-2 bg-purple-50 text-purple-600 rounded-lg font-medium hover:bg-purple-100 transition-all flex items-center justify-center gap-2"
//                     >
//                       <Eye size={16} />
//                       View Details
//                     </button>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       ) : !loading && (
//         <div className="text-center py-12 bg-white rounded-xl">
//           <Briefcase size={48} className="text-slate-300 mx-auto mb-4" />
//           <p className="text-slate-500 text-lg mb-2">No works found</p>
//           <p className="text-sm text-slate-400 mb-4">There are no works matching the selected filter</p>
//           <button
//             onClick={handleRefresh}
//             className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all"
//           >
//             Refresh
//           </button>
//         </div>
//       )}

//       {/* Pagination */}
//       {pagination?.pages > 1 && (
//         <div className="mt-6 flex items-center justify-center gap-2">
//           <button
//             onClick={() => dispatch(setFilters({ page: pagination.page - 1 }))}
//             disabled={pagination.page === 1}
//             className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50"
//           >
//             <ChevronLeft size={18} />
//           </button>
//           <span className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg">
//             Page {pagination.page} of {pagination.pages}
//           </span>
//           <button
//             onClick={() => dispatch(setFilters({ page: pagination.page + 1 }))}
//             disabled={pagination.page === pagination.pages}
//             className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50"
//           >
//             <ChevronRight size={18} />
//           </button>
//         </div>
//       )}

//       {/* Success Modal */}
//       {showSuccessModal && acceptedWork && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-xl max-w-md w-full p-6 animate-in zoom-in duration-300">
//             <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
//               <CheckCircle size={32} className="text-green-600" />
//             </div>
            
//             <h2 className="text-xl font-bold text-center mb-2">Work Accepted Successfully!</h2>
            
//             <div className="bg-green-50 p-4 rounded-lg mb-4">
//               <p className="text-sm text-green-700 mb-2">
//                 This work is now assigned to:
//               </p>
//               <p className="font-bold text-lg text-green-800">{acceptedWork.assignedTo}</p>
//               <p className="text-xs text-green-600 mt-1">
//                 Work ID: {acceptedWork.workId}
//               </p>
//             </div>

//             <div className="flex gap-3">
//               <button
//                 onClick={() => {
//                   setShowSuccessModal(false);
//                   navigate(`/cuttingmaster/works/${acceptedWork._id}?assign=true`);
//                 }}
//                 className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
//               >
//                 Assign Tailor Now
//               </button>
//               <button
//                 onClick={() => setShowSuccessModal(false)}
//                 className="flex-1 px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300"
//               >
//                 Later
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }




// Pages/works/CuttingMasterWorks.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase,
  RefreshCw,
  Clock,
  CheckCircle,
  Scissors,
  Ruler,
  Truck,
  Eye,
  UserPlus,
  ChevronLeft,
  ChevronRight,
  Check,
  AlertCircle,
  X,
  Calendar,
  Hash,
  Package,
  User
} from 'lucide-react';
import { 
  fetchMyWorks,
  acceptWorkById,
  selectMyWorks,
  selectWorkPagination,
  selectWorkLoading,
  setFilters
} from '../../features/work/workSlice';
import showToast from '../../utils/toast';

export default function CuttingMasterWorks() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const works = useSelector(selectMyWorks);
  const pagination = useSelector(selectWorkPagination);
  const loading = useSelector(selectWorkLoading);
  const { user } = useSelector((state) => state.auth);

  // State
  const [filter, setFilter] = useState('all');
  const [acceptingId, setAcceptingId] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [acceptedWork, setAcceptedWork] = useState(null);

  // Load works when filter changes
  useEffect(() => {
    loadWorks();
  }, [filter]);

  // 🔥 FIXED: loadWorks with proper filter params including IN PROGRESS
  const loadWorks = async () => {
    try {
      let params = {};
      
      if (filter === 'assigned') {
        // Works that have a tailor assigned
        params.hasTailor = 'true';
      } else if (filter === 'unassigned') {
        // Works accepted by cutting master but no tailor assigned yet
        params.hasTailor = 'false';
        params.status = 'accepted';
      } else if (filter === 'in-progress') {
        // 🔥 NEW: In Progress filter - multiple statuses
        params.status = ['cutting-started', 'cutting-completed', 'sewing-started', 'sewing-completed', 'ironing'];
      } else if (filter !== 'all') {
        params.status = filter;
      }

      console.log('🔍 Loading works with params:', params);
      await dispatch(fetchMyWorks(params)).unwrap();
    } catch (error) {
      showToast.error('Failed to load works');
    }
  };

  const handleRefresh = () => {
    loadWorks();
    showToast.success('Data refreshed');
  };

  // Accept work
  const handleAcceptWork = async (work) => {
    console.log(`✅ Attempting to accept work: ${work._id}`);
    
    setAcceptingId(work._id);
    
    if (work.status !== 'pending') {
      showToast.info('This work is no longer available');
      setAcceptingId(null);
      loadWorks();
      return;
    }
    
    if (!window.confirm('Accept this work? It will be assigned to you.')) {
      setAcceptingId(null);
      return;
    }
    
    try {
      const result = await dispatch(acceptWorkById(work._id)).unwrap();
      
      showToast.success('Work accepted successfully!');
      
      setAcceptedWork({
        ...work,
        ...result.data,
        assignedTo: user?.name
      });
      setShowSuccessModal(true);
      
      loadWorks();
      
    } catch (error) {
      console.error('❌ Accept failed:', error);
      
      if (error === 'This work was already accepted by another cutting master') {
        showToast.error('This work was just taken by another cutting master');
      } else {
        showToast.error(error || 'Failed to accept work');
      }
      
      loadWorks();
      
    } finally {
      setAcceptingId(null);
    }
  };

  // View work details
  const handleViewWork = (id) => {
    navigate(`/cuttingmaster/works/${id}`);
  };

  // Assign tailor
  const handleAssignTailor = (workId) => {
    navigate(`/cuttingmaster/works/${workId}?assign=true`);
  };

  const getStatusColor = (status) => {
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

  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending': return <Clock size={16} />;
      case 'accepted': return <CheckCircle size={16} />;
      case 'cutting-started': return <Scissors size={16} />;
      case 'cutting-completed': return <Scissors size={16} />;
      case 'sewing-started': return <Ruler size={16} />;
      case 'sewing-completed': return <Ruler size={16} />;
      case 'ironing': return <Truck size={16} />;
      case 'ready-to-deliver': return <CheckCircle size={16} />;
      default: return <Briefcase size={16} />;
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Filter works based on current filter
  const filteredWorks = works?.filter(work => {
    if (filter === 'assigned') {
      return work.tailor !== null && work.tailor !== undefined;
    } else if (filter === 'unassigned') {
      return work.status === 'accepted' && !work.tailor;
    } else if (filter === 'in-progress') {
      // 🔥 NEW: In Progress statuses
      return ['cutting-started', 'cutting-completed', 'sewing-started', 'sewing-completed', 'ironing'].includes(work.status);
    } else if (filter === 'all') {
      return true;
    } else {
      return work.status === filter;
    }
  }) || [];

  // Separate works for stats
  const pendingWorks = works?.filter(w => w.status === 'pending') || [];
  const acceptedWorks = works?.filter(w => w.status === 'accepted') || [];
  const inProgressWorks = works?.filter(w => 
    ['cutting-started', 'cutting-completed', 'sewing-started', 'sewing-completed', 'ironing'].includes(w.status)
  ) || [];
  const readyWorks = works?.filter(w => w.status === 'ready-to-deliver') || [];

  // Count for assigned/unassigned
  const assignedCount = works?.filter(w => w.tailor).length || 0;
  const unassignedCount = works?.filter(w => w.status === 'accepted' && !w.tailor).length || 0;

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-slate-800 mb-2">Cutting Master Works</h1>
            <p className="text-slate-600">Accept available works and assign tailors</p>
          </div>
          <button
            onClick={handleRefresh}
            className="p-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-all"
            title="Refresh"
          >
            <RefreshCw size={20} className={loading ? 'animate-spin text-blue-600' : 'text-slate-600'} />
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4 mt-6">
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock size={20} className="text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Available</p>
                <p className="text-2xl font-bold">{pendingWorks.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <CheckCircle size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Accepted</p>
                <p className="text-2xl font-bold">{acceptedWorks.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Scissors size={20} className="text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">In Progress</p>
                <p className="text-2xl font-bold">{inProgressWorks.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Truck size={20} className="text-green-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Ready</p>
                <p className="text-2xl font-bold">{readyWorks.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 🔥 COMPLETE FILTER TABS with IN PROGRESS */}
        <div className="flex flex-wrap gap-2 mt-6 bg-white p-1 rounded-lg inline-flex shadow-sm border">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === 'all' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All ({works?.length || 0})
          </button>
          
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === 'pending' ? 'bg-yellow-500 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Available ({pendingWorks.length})
          </button>

          {/* 🔥 NEW: In Progress Button */}
          <button
            onClick={() => setFilter('in-progress')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === 'in-progress' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            In Progress ({inProgressWorks.length})
          </button>

          <button
            onClick={() => setFilter('accepted')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === 'accepted' ? 'bg-blue-500 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Accepted ({acceptedWorks.length})
          </button>

          {/* Unassigned Button */}
          <button
            onClick={() => setFilter('unassigned')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === 'unassigned' ? 'bg-orange-500 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Need Tailor ({unassignedCount})
          </button>

          {/* Assigned Button */}
          <button
            onClick={() => setFilter('assigned')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === 'assigned' ? 'bg-green-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Assigned ({assignedCount})
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* 🔥 FIXED: Dynamic Work List Based on Filter */}
      {!loading && filteredWorks.length > 0 ? (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2 capitalize">
            {filter.replace(/-/g, ' ')} Works ({filteredWorks.length})
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorks.map((work) => (
              <div
                key={work._id}
                className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden border-2 ${
                  work.status === 'pending' ? 'border-yellow-200' : 
                  work.tailor ? 'border-green-200' : 
                  work.status === 'accepted' ? 'border-blue-200' : 
                  ['cutting-started', 'cutting-completed', 'sewing-started', 'sewing-completed', 'ironing'].includes(work.status) ? 'border-purple-200' :
                  'border-slate-200'
                }`}
              >
                <div className="p-6">
                  {/* Header with Work ID and Status */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="space-y-1">
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <Hash size={12} />
                        Work ID
                      </p>
                      <p className="font-mono text-sm font-bold text-blue-600">{work.workId}</p>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(work.status)}`}>
                      {getStatusIcon(work.status)}
                      {work.status?.replace(/-/g, ' ')}
                    </span>
                  </div>

                  {/* Garment Details */}
                  <div className="mb-4">
                    <h3 className="font-bold text-slate-800 text-lg mb-1">{work.garment?.name || 'N/A'}</h3>
                    
                    {/* Garment ID */}
                    <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
                      <Package size={14} className="text-purple-500" />
                      <span>Garment ID: {work.garment?.garmentId || 'N/A'}</span>
                    </div>

                    {/* Order ID and Customer */}
                    <div className="space-y-1 text-sm">
                      <p className="text-slate-600">Order: {work.order?.orderId || 'N/A'}</p>
                      {work.order?.customer && (
                        <p className="text-slate-600 flex items-center gap-1">
                          <User size={14} className="text-blue-500" />
                          {work.order.customer.name}
                        </p>
                      )}
                      {work.tailor && (
                        <p className="text-slate-600 flex items-center gap-1 mt-1">
                          <Scissors size={14} className="text-green-500" />
                          Tailor: {work.tailor.name}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Estimated Delivery */}
                  <div className="flex items-center gap-2 text-sm text-slate-600 mb-4">
                    <Calendar size={14} className="text-orange-500" />
                    <span>Est. Delivery: {formatDate(work.estimatedDelivery)}</span>
                  </div>

                  {/* Action Buttons - Based on Work Status */}
                  {work.status === 'pending' ? (
                    <button
                      onClick={() => handleAcceptWork(work)}
                      disabled={acceptingId === work._id}
                      className={`w-full px-4 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                        acceptingId === work._id
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-green-600 hover:bg-green-700 text-white'
                      }`}
                    >
                      {acceptingId === work._id ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <CheckCircle size={18} />
                          Accept Work
                        </>
                      )}
                    </button>
                  ) : work.status === 'accepted' && !work.tailor ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewWork(work._id)}
                        className="flex-1 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-medium hover:bg-blue-100 transition-all flex items-center justify-center gap-2"
                      >
                        <Eye size={16} />
                        View
                      </button>
                      <button
                        onClick={() => handleAssignTailor(work._id)}
                        className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-all flex items-center justify-center gap-2"
                      >
                        <UserPlus size={16} />
                        Assign
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleViewWork(work._id)}
                      className="w-full px-4 py-2 bg-purple-50 text-purple-600 rounded-lg font-medium hover:bg-purple-100 transition-all flex items-center justify-center gap-2"
                    >
                      <Eye size={16} />
                      View Details
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : !loading && (
        <div className="text-center py-12 bg-white rounded-xl">
          <Briefcase size={48} className="text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 text-lg mb-2">No works found</p>
          <p className="text-sm text-slate-400 mb-4">There are no works matching the selected filter</p>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all"
          >
            Refresh
          </button>
        </div>
      )}

      {/* Pagination */}
      {pagination?.pages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <button
            onClick={() => dispatch(setFilters({ page: pagination.page - 1 }))}
            disabled={pagination.page === 1}
            className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg">
            Page {pagination.page} of {pagination.pages}
          </span>
          <button
            onClick={() => dispatch(setFilters({ page: pagination.page + 1 }))}
            disabled={pagination.page === pagination.pages}
            className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && acceptedWork && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 animate-in zoom-in duration-300">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} className="text-green-600" />
            </div>
            
            <h2 className="text-xl font-bold text-center mb-2">Work Accepted Successfully!</h2>
            
            <div className="bg-green-50 p-4 rounded-lg mb-4">
              <p className="text-sm text-green-700 mb-2">
                This work is now assigned to:
              </p>
              <p className="font-bold text-lg text-green-800">{acceptedWork.assignedTo}</p>
              <p className="text-xs text-green-600 mt-1">
                Work ID: {acceptedWork.workId}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  navigate(`/cuttingmaster/works/${acceptedWork._id}?assign=true`);
                }}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Assign Tailor Now
              </button>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="flex-1 px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300"
              >
                Later
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}