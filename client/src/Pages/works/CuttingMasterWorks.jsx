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

//   // 🔥 FIXED: loadWorks with proper filter params including IN PROGRESS
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
//       } else if (filter === 'in-progress') {
//         // 🔥 NEW: In Progress filter - multiple statuses
//         params.status = ['cutting-started', 'cutting-completed', 'sewing-started', 'sewing-completed', 'ironing'];
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
//     } else if (filter === 'in-progress') {
//       // 🔥 NEW: In Progress statuses
//       return ['cutting-started', 'cutting-completed', 'sewing-started', 'sewing-completed', 'ironing'].includes(work.status);
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
//     ['cutting-started', 'cutting-completed', 'sewing-started', 'sewing-completed', 'ironing'].includes(w.status)
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

//         {/* 🔥 COMPLETE FILTER TABS with IN PROGRESS */}
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

//           {/* 🔥 NEW: In Progress Button */}
//           <button
//             onClick={() => setFilter('in-progress')}
//             className={`px-4 py-2 rounded-lg font-medium transition-all ${
//               filter === 'in-progress' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
//             }`}
//           >
//             In Progress ({inProgressWorks.length})
//           </button>

//           <button
//             onClick={() => setFilter('accepted')}
//             className={`px-4 py-2 rounded-lg font-medium transition-all ${
//               filter === 'accepted' ? 'bg-blue-500 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
//             }`}
//           >
//             Accepted ({acceptedWorks.length})
//           </button>

//           {/* Unassigned Button */}
//           <button
//             onClick={() => setFilter('unassigned')}
//             className={`px-4 py-2 rounded-lg font-medium transition-all ${
//               filter === 'unassigned' ? 'bg-orange-500 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
//             }`}
//           >
//             Need Tailor ({unassignedCount})
//           </button>

//           {/* Assigned Button */}
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
//                   work.status === 'accepted' ? 'border-blue-200' :
//                   ['cutting-started', 'cutting-completed', 'sewing-started', 'sewing-completed', 'ironing'].includes(work.status) ? 'border-purple-200' :
//                   'border-slate-200'
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




// // Pages/works/CuttingMasterWorks.jsx
// import React, { useState, useEffect, useMemo } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
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
//   User,
//   Search,
//   Filter,
//   Flag,
//   Bell,
//   Activity,
//   Target,
//   TrendingUp,
//   PieChart,
//   Layers,
//   Download,
//   Zap,
//   UserCheck,
//   BarChart3,
//   PlusCircle,
// } from "lucide-react";
// import {
//   fetchMyWorks,
//   acceptWorkById,
//   selectMyWorks,
//   selectWorkPagination,
//   selectWorkLoading,
//   setFilters,
// } from "../../features/work/workSlice";
// import showToast from "../../utils/toast";

// export default function CuttingMasterWorks() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const works = useSelector(selectMyWorks);
//   const pagination = useSelector(selectWorkPagination);
//   const loading = useSelector(selectWorkLoading);
//   const { user } = useSelector((state) => state.auth);

//   // State
//   const [filter, setFilter] = useState("all");
//   const [acceptingId, setAcceptingId] = useState(null);
//   const [showSuccessModal, setShowSuccessModal] = useState(false);
//   const [acceptedWork, setAcceptedWork] = useState(null);

//   // Queue search and filter state
//   const [queueSearch, setQueueSearch] = useState("");
//   const [queueStatus, setQueueStatus] = useState("all");
//   const [sortBy, setSortBy] = useState("priority");
//   const [selectedView, setSelectedView] = useState("all"); // all, new, need-tailor

//   // Load works when filter changes
//   useEffect(() => {
//     loadWorks();
//   }, [filter]);

//   // Load works with proper filter params
//   const loadWorks = async () => {
//     try {
//       let params = {};

//       if (filter === "assigned") {
//         params.hasTailor = "true";
//       } else if (filter === "unassigned") {
//         params.hasTailor = "false";
//         params.status = "accepted";
//       } else if (filter === "in-progress") {
//         params.status = [
//           "cutting-started",
//           "cutting-completed",
//           "sewing-started",
//           "sewing-completed",
//           "ironing",
//         ];
//       } else if (filter !== "all") {
//         params.status = filter;
//       }

//       await dispatch(fetchMyWorks(params)).unwrap();
//     } catch (error) {
//       showToast.error("Failed to load works");
//     }
//   };

//   const handleRefresh = () => {
//     loadWorks();
//     showToast.success("Data refreshed");
//   };

//   // Accept work
//   const handleAcceptWork = async (work) => {
//     setAcceptingId(work._id);

//     if (work.status !== "pending") {
//       showToast.info("This work is no longer available");
//       setAcceptingId(null);
//       loadWorks();
//       return;
//     }

//     if (!window.confirm("Accept this work? It will be assigned to you.")) {
//       setAcceptingId(null);
//       return;
//     }

//     try {
//       const result = await dispatch(acceptWorkById(work._id)).unwrap();

//       showToast.success("Work accepted successfully!");

//       setAcceptedWork({
//         ...work,
//         ...result.data,
//         assignedTo: user?.name,
//       });
//       setShowSuccessModal(true);

//       loadWorks();
//     } catch (error) {
//       console.error("❌ Accept failed:", error);

//       if (
//         error === "This work was already accepted by another cutting master"
//       ) {
//         showToast.error("This work was just taken by another cutting master");
//       } else {
//         showToast.error(error || "Failed to accept work");
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

//   // COMPLETE STATUS COLORS for all 8 statuses
//   const getStatusColor = (status) => {
//     const colors = {
//       pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
//       accepted: "bg-blue-100 text-blue-800 border-blue-200",
//       "cutting-started": "bg-purple-100 text-purple-800 border-purple-200",
//       "cutting-completed": "bg-indigo-100 text-indigo-800 border-indigo-200",
//       "sewing-started": "bg-pink-100 text-pink-800 border-pink-200",
//       "sewing-completed": "bg-teal-100 text-teal-800 border-teal-200",
//       ironing: "bg-orange-100 text-orange-800 border-orange-200",
//       "ready-to-deliver": "bg-green-100 text-green-800 border-green-200",
//     };
//     return colors[status] || "bg-gray-100 text-gray-800 border-gray-200";
//   };

//   // COMPLETE STATUS BADGES with icons
//   const getStatusBadge = (status) => {
//     const badges = {
//       pending: "⏳ Pending",
//       accepted: "✅ Accepted",
//       "cutting-started": "✂️ Cutting Started",
//       "cutting-completed": "✔️ Cutting Completed",
//       "sewing-started": "🧵 Sewing Started",
//       "sewing-completed": "🧵 Sewing Completed",
//       ironing: "🔥 Ironing",
//       "ready-to-deliver": "📦 Ready to Deliver",
//     };
//     return badges[status] || status;
//   };

//   const getStatusIcon = (status) => {
//     switch (status) {
//       case "pending":
//         return <Clock size={16} />;
//       case "accepted":
//         return <CheckCircle size={16} />;
//       case "cutting-started":
//         return <Scissors size={16} />;
//       case "cutting-completed":
//         return <Scissors size={16} />;
//       case "sewing-started":
//         return <Ruler size={16} />;
//       case "sewing-completed":
//         return <Ruler size={16} />;
//       case "ironing":
//         return <Truck size={16} />;
//       case "ready-to-deliver":
//         return <CheckCircle size={16} />;
//       default:
//         return <Briefcase size={16} />;
//     }
//   };

//   // Format date
//   const formatDate = (dateString) => {
//     if (!dateString) return "Not set";
//     return new Date(dateString).toLocaleDateString("en-GB", {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//     });
//   };

//   // Due status helper
//   const getDueStatus = (date) => {
//     if (!date)
//       return {
//         label: "No due date",
//         color: "text-gray-600",
//         icon: <Calendar className="w-4 h-4 text-gray-400" />,
//       };

//     const diff = new Date(date) - new Date();
//     const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

//     if (days === 0) {
//       return {
//         label: "Due Today 🚨",
//         color: "text-red-600 font-bold",
//         icon: <Bell className="w-4 h-4 text-red-500 animate-pulse" />,
//       };
//     }
//     if (days < 0) {
//       return {
//         label: `Overdue by ${Math.abs(days)} days ⚠️`,
//         color: "text-gray-900 font-bold",
//         icon: <AlertCircle className="w-4 h-4 text-gray-700" />,
//       };
//     }
//     if (days === 1) {
//       return {
//         label: "Due Tomorrow",
//         color: "text-orange-600",
//         icon: <Clock className="w-4 h-4 text-orange-500" />,
//       };
//     }
//     return {
//       label: `Due in ${days} days`,
//       color: "text-green-600",
//       icon: <Calendar className="w-4 h-4 text-green-500" />,
//     };
//   };

//   // Filter works based on current filter and search
//   const filteredWorks = useMemo(() => {
//     let filtered = works || [];

//     // Apply status filter from tabs
//     if (filter !== "all") {
//       if (filter === "assigned") {
//         filtered = filtered.filter(
//           (work) => work.tailor !== null && work.tailor !== undefined,
//         );
//       } else if (filter === "unassigned") {
//         filtered = filtered.filter(
//           (work) => work.status === "accepted" && !work.tailor,
//         );
//       } else if (filter === "in-progress") {
//         filtered = filtered.filter((work) =>
//           [
//             "cutting-started",
//             "cutting-completed",
//             "sewing-started",
//             "sewing-completed",
//             "ironing",
//           ].includes(work.status),
//         );
//       } else {
//         filtered = filtered.filter((work) => work.status === filter);
//       }
//     }

//     // Apply search
//     if (queueSearch) {
//       const searchTerm = queueSearch.toLowerCase().trim();
//       filtered = filtered.filter(
//         (item) =>
//           item.workId?.toLowerCase().includes(searchTerm) ||
//           item.garment?.garmentId?.toLowerCase().includes(searchTerm) ||
//           item.garment?.name?.toLowerCase().includes(searchTerm) ||
//           item.order?.customer?.name?.toLowerCase().includes(searchTerm) ||
//           item.order?.orderId?.toLowerCase().includes(searchTerm),
//       );
//     }

//     // Apply queue status filter
//     if (queueStatus !== "all") {
//       filtered = filtered.filter((item) => item.status === queueStatus);
//     }

//     return filtered;
//   }, [works, filter, queueSearch, queueStatus]);

//   // Priority sorting
//   const prioritizedQueue = useMemo(() => {
//     if (!filteredWorks.length) return [];

//     return [...filteredWorks].sort((a, b) => {
//       const getDaysDiff = (date) => {
//         if (!date) return 999;
//         const diff = new Date(date) - new Date();
//         return Math.ceil(diff / (1000 * 60 * 60 * 24));
//       };

//       const daysA = getDaysDiff(a.estimatedDelivery);
//       const daysB = getDaysDiff(b.estimatedDelivery);
//       const priorityWeight = { high: 1, normal: 2, low: 3 };

//       const aPriority = a.order?.priority || "normal";
//       const bPriority = b.order?.priority || "normal";

//       if (sortBy === "priority") {
//         if (priorityWeight[aPriority] !== priorityWeight[bPriority]) {
//           return priorityWeight[aPriority] - priorityWeight[bPriority];
//         }
//         return daysA - daysB;
//       } else {
//         if (daysA !== daysB) return daysA - daysB;
//         return priorityWeight[aPriority] - priorityWeight[bPriority];
//       }
//     });
//   }, [filteredWorks, sortBy]);

//   // Stats calculations with Overdue
//   const stats = useMemo(() => {
//     const allWorks = works || [];
    
//     // Calculate overdue works
//     const overdueCount = allWorks.filter(w => {
//       if (!w.estimatedDelivery) return false;
//       const today = new Date();
//       const deliveryDate = new Date(w.estimatedDelivery);
//       const isOverdue = deliveryDate < today && 
//         !['ready-to-deliver', 'ironing'].includes(w.status);
//       return isOverdue;
//     }).length;
    
//     return {
//       totalWork: allWorks.length,
//       pendingWorks: allWorks.filter((w) => w.status === "pending").length,
//       acceptedWorks: allWorks.filter((w) => w.status === "accepted").length,
//       inProgressWorks: allWorks.filter((w) =>
//         [
//           "cutting-started",
//           "cutting-completed",
//           "sewing-started",
//           "sewing-completed",
//           "ironing",
//         ].includes(w.status),
//       ).length,
//       readyWorks: allWorks.filter((w) => w.status === "ready-to-deliver").length,
//       assignedCount: allWorks.filter((w) => w.tailor).length,
//       unassignedCount: allWorks.filter(
//         (w) => w.status === "accepted" && !w.tailor,
//       ).length,
//       overdueCount: overdueCount,
//     };
//   }, [works]);

//   // Status breakdown
//   const statusBreakdown = useMemo(() => {
//     const allWorks = works || [];
//     return [
//       {
//         status: "pending",
//         count: allWorks.filter((w) => w.status === "pending").length,
//         color: "bg-yellow-500",
//       },
//       {
//         status: "accepted",
//         count: allWorks.filter((w) => w.status === "accepted").length,
//         color: "bg-blue-500",
//       },
//       {
//         status: "cutting-started",
//         count: allWorks.filter((w) => w.status === "cutting-started").length,
//         color: "bg-purple-500",
//       },
//       {
//         status: "cutting-completed",
//         count: allWorks.filter((w) => w.status === "cutting-completed").length,
//         color: "bg-indigo-500",
//       },
//       {
//         status: "sewing-started",
//         count: allWorks.filter((w) => w.status === "sewing-started").length,
//         color: "bg-pink-500",
//       },
//       {
//         status: "sewing-completed",
//         count: allWorks.filter((w) => w.status === "sewing-completed").length,
//         color: "bg-teal-500",
//       },
//       {
//         status: "ironing",
//         count: allWorks.filter((w) => w.status === "ironing").length,
//         color: "bg-orange-500",
//       },
//       {
//         status: "ready-to-deliver",
//         count: allWorks.filter((w) => w.status === "ready-to-deliver").length,
//         color: "bg-green-500",
//       },
//     ];
//   }, [works]);

//   // Today's Due Works
//   const todayDueWorks = useMemo(() => {
//     const today = new Date();
//     const todayStr = today.toDateString();
    
//     return (works || [])
//       .filter(work => {
//         if (!work.estimatedDelivery) return false;
//         const workDate = new Date(work.estimatedDelivery);
//         return workDate.toDateString() === todayStr;
//       })
//       .sort((a, b) => {
//         const priorityWeight = { high: 1, normal: 2, low: 3 };
//         const aPriority = a.order?.priority || 'normal';
//         const bPriority = b.order?.priority || 'normal';
        
//         if (priorityWeight[aPriority] !== priorityWeight[bPriority]) {
//           return priorityWeight[aPriority] - priorityWeight[bPriority];
//         }
        
//         const aTime = new Date(a.estimatedDelivery).getTime();
//         const bTime = new Date(b.estimatedDelivery).getTime();
//         return aTime - bTime;
//       });
//   }, [works]);

//   // Tomorrow's Due Works
//   const tomorrowDueWorks = useMemo(() => {
//     const tomorrow = new Date();
//     tomorrow.setDate(tomorrow.getDate() + 1);
//     const tomorrowStr = tomorrow.toDateString();
    
//     return (works || [])
//       .filter(work => {
//         if (!work.estimatedDelivery) return false;
//         const workDate = new Date(work.estimatedDelivery);
//         return workDate.toDateString() === tomorrowStr;
//       })
//       .sort((a, b) => {
//         const aTime = new Date(a.estimatedDelivery).getTime();
//         const bTime = new Date(b.estimatedDelivery).getTime();
//         return aTime - bTime;
//       });
//   }, [works]);

//   // Priority counts for today
//   const highPriorityToday = useMemo(() => 
//     todayDueWorks.filter(w => w.order?.priority === 'high').length, 
//   [todayDueWorks]);

//   const normalPriorityToday = useMemo(() => 
//     todayDueWorks.filter(w => w.order?.priority === 'normal' || !w.order?.priority).length, 
//   [todayDueWorks]);

//   const lowPriorityToday = useMemo(() => 
//     todayDueWorks.filter(w => w.order?.priority === 'low').length, 
//   [todayDueWorks]);

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 md:p-6">
//       {/* Header */}
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
//         <div>
//           <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
//             <Scissors className="w-8 h-8 text-purple-600" />
//             Cutting Master Work Queue
//           </h1>
//           <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
//             <span>Welcome back, {user?.name || "Cutting Master"}! 👋</span>
//             <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
//               {new Date().toLocaleDateString("en-IN", {
//                 weekday: "long",
//                 day: "numeric",
//                 month: "long",
//               })}
//             </span>
//           </p>
//         </div>

//         <button
//           onClick={handleRefresh}
//           className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center gap-2 shadow-sm"
//         >
//           <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
//           Refresh
//         </button>
//       </div>

//       {/* KPI Cards */}
//       <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-6">
//         {/* 1. Not Accepted - Pending */}
//         <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-gray-500">
//           <p className="text-xs text-gray-500 mb-1">⏳ Not Accepted</p>
//           <p className="text-2xl font-bold text-gray-800">
//             {stats.pendingWorks}
//           </p>
//           <p className="text-xs text-gray-400 mt-1">Pending</p>
//         </div>

//         {/* 2. Accepted */}
//         <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-blue-500">
//           <p className="text-xs text-gray-500 mb-1">✅ Accepted</p>
//           <p className="text-2xl font-bold text-blue-600">
//             {stats.acceptedWorks}
//           </p>
//           <p className="text-xs text-gray-400 mt-1">Accepted works</p>
//         </div>

//         {/* 3. In Progress */}
//         <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-purple-500">
//           <p className="text-xs text-gray-500 mb-1">⚙️ In Progress</p>
//           <p className="text-2xl font-bold text-purple-600">
//             {stats.inProgressWorks}
//           </p>
//           <p className="text-xs text-gray-400 mt-1">Cutting → Ironing</p>
//         </div>

//         {/* 4. Ready to Deliver */}
//         <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-green-500">
//           <p className="text-xs text-gray-500 mb-1">📦 Ready to Deliver</p>
//           <p className="text-2xl font-bold text-green-600">
//             {stats.readyWorks}
//           </p>
//           <p className="text-xs text-gray-400 mt-1">Ready for delivery</p>
//         </div>

//         {/* 5. Assigned to Tailor */}
//         <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-indigo-500">
//           <p className="text-xs text-gray-500 mb-1">👔 Assigned to Tailor</p>
//           <p className="text-2xl font-bold text-indigo-600">
//             {stats.assignedCount}
//           </p>
//           <p className="text-xs text-gray-400 mt-1">Tailor assigned</p>
//         </div>

//         {/* 6. Not Assigned (Need Tailor) */}
//         <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-orange-500">
//           <p className="text-xs text-gray-500 mb-1">⚠️ Not Assigned</p>
//           <p className="text-2xl font-bold text-orange-600">
//             {stats.unassignedCount}
//           </p>
//           <p className="text-xs text-gray-400 mt-1">Need tailor</p>
//         </div>

//         {/* 7. Overdue Works */}
//         <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-red-600">
//           <p className="text-xs text-gray-500 mb-1">🚨 Overdue</p>
//           <p className="text-2xl font-bold text-red-600">
//             {stats.overdueCount}
//           </p>
//           <p className="text-xs text-gray-400 mt-1">Past delivery date</p>
//         </div>

//         {/* 8. Total Works */}
//         <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-cyan-500">
//           <p className="text-xs text-gray-500 mb-1">📊 Total Works</p>
//           <p className="text-2xl font-bold text-cyan-600">{stats.totalWork}</p>
//           <p className="text-xs text-gray-400 mt-1">All works</p>
//         </div>
//       </div>

//       {/* Status Breakdown - Visual representation of all 8 statuses */}
//       <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
//         <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
//           <PieChart size={20} className="text-purple-600" />
//           Production Status Overview
//         </h2>

//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//           {statusBreakdown.map((item) => (
//             <div key={item.status} className="relative">
//               <div className="flex justify-between text-sm mb-1">
//                 <span className="text-gray-600 capitalize">
//                   {item.status.replace(/-/g, " ")}
//                 </span>
//                 <span className="font-bold text-gray-800">{item.count}</span>
//               </div>
//               <div className="w-full bg-gray-200 rounded-full h-2">
//                 <div
//                   className={`${item.color} h-2 rounded-full`}
//                   style={{
//                     width:
//                       stats.totalWork > 0
//                         ? `${(item.count / stats.totalWork) * 100}%`
//                         : "0%",
//                   }}
//                 />
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Today's Focus & Tomorrow's Prep */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//         {/* Today's Focus - Due Today Works */}
//         <div className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 rounded-xl p-6">
//           <div className="flex items-start justify-between mb-4">
//             <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-lg shadow-lg">
//               <Target className="w-6 h-6 text-white" />
//             </div>
            
//             {/* Modern Right Side */}
//             <div className="bg-white/80 backdrop-blur-sm rounded-lg p-2 shadow-sm">
//               <div className="flex items-center gap-3">
//                 {/* Date */}
//                 <div className="text-right">
//                   <p className="text-xs text-gray-500">Today</p>
//                   <p className="text-sm font-bold text-gray-800">
//                     {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
//                   </p>
//                 </div>
                
//                 {/* Divider */}
//                 <div className="w-px h-8 bg-red-200"></div>
                
//                 {/* Count */}
//                 <div className="text-center">
//                   <p className="text-xs text-gray-500">Due Today</p>
//                   <p className="text-xl font-bold text-red-600">{todayDueWorks.length}</p>
//                 </div>
                
//                 {/* Divider */}
//                 <div className="w-px h-8 bg-red-200"></div>
                
//                 {/* Priority Breakdown */}
//                 <div className="flex gap-2">
//                   <div className="text-center">
//                     <p className="text-xs text-red-600">🔴</p>
//                     <p className="text-sm font-bold text-gray-800">{highPriorityToday}</p>
//                   </div>
//                   <div className="text-center">
//                     <p className="text-xs text-orange-600">🟠</p>
//                     <p className="text-sm font-bold text-gray-800">{normalPriorityToday}</p>
//                   </div>
//                   <div className="text-center">
//                     <p className="text-xs text-green-600">🟢</p>
//                     <p className="text-sm font-bold text-gray-800">{lowPriorityToday}</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <h3 className="text-lg font-bold text-gray-800">Today's Deadline</h3>
//           <p className="text-sm text-red-600 mb-4">
//             {new Date().toLocaleDateString('en-IN', { 
//               day: 'numeric', 
//               month: 'long', 
//               year: 'numeric' 
//             })} - {todayDueWorks.length} items due
//           </p>

//           {/* Due Today Works List */}
//           <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
//             {todayDueWorks.length > 0 ? (
//               todayDueWorks.map((work) => {
//                 const priorityColor = 
//                   work.order?.priority === 'high' ? 'border-l-4 border-l-red-600 bg-red-50' :
//                   work.order?.priority === 'normal' ? 'border-l-4 border-l-orange-400 bg-orange-50' :
//                   'border-l-4 border-l-green-600 bg-green-50';
                
//                 const priorityText = 
//                   work.order?.priority === 'high' ? '🔴 High' :
//                   work.order?.priority === 'normal' ? '🟠 Normal' :
//                   '🟢 Low';
                
//                 return (
//                   <div
//                     key={work._id}
//                     onClick={() => navigate(`/cuttingmaster/works/${work._id}`)}
//                     className={`flex items-center justify-between p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer ${priorityColor}`}
//                   >
//                     <div className="flex-1">
//                       <div className="flex items-center gap-2 mb-1">
//                         <span className="font-mono text-xs font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded">
//                           #{work.workId}
//                         </span>
//                         <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
//                           {work.garment?.garmentId || 'N/A'}
//                         </span>
//                         <span className="text-xs font-medium">
//                           {priorityText}
//                         </span>
//                       </div>
//                       <p className="font-medium text-gray-800">
//                         {work.garment?.name || 'Unknown Garment'}
//                       </p>
//                       <p className="text-xs text-gray-500">
//                         👤 {work.order?.customer?.name || 'Unknown'} 
//                         {work.tailor && ` | 👔 Tailor: ${work.tailor.name}`}
//                       </p>
//                       {work.estimatedDelivery && (
//                         <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
//                           <Clock size={12} />
//                           Due by {new Date(work.estimatedDelivery).toLocaleTimeString('en-IN', { 
//                             hour: '2-digit', 
//                             minute: '2-digit' 
//                           })}
//                         </p>
//                       )}
//                     </div>
//                     <ChevronRight size={18} className="text-gray-400" />
//                   </div>
//                 );
//               })
//             ) : (
//               <div className="text-center py-8 bg-white/50 rounded-lg">
//                 <CheckCircle size={32} className="text-green-400 mx-auto mb-2" />
//                 <p className="text-sm text-gray-600">No works due today! 🎉</p>
//                 <p className="text-xs text-gray-400 mt-1">All caught up</p>
//               </div>
//             )}
//           </div>

//           {/* Summary Footer */}
//           {todayDueWorks.length > 0 && (
//             <div className="mt-4 pt-3 border-t border-red-200 flex justify-between items-center text-xs text-gray-600">
//               <div className="flex gap-3">
//                 <span>Total: <span className="font-bold text-gray-800">{todayDueWorks.length}</span></span>
//                 <span>🔴 High: <span className="font-bold text-red-600">{highPriorityToday}</span></span>
//                 <span>🟠 Normal: <span className="font-bold text-orange-600">{normalPriorityToday}</span></span>
//                 <span>🟢 Low: <span className="font-bold text-green-600">{lowPriorityToday}</span></span>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Tomorrow's Prep - Due Tomorrow Works */}
//         <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl p-6">
//           <div className="p-3 bg-blue-500 rounded-lg w-fit mb-4">
//             <Clock className="w-6 h-6 text-white" />
//           </div>

//           <h3 className="text-lg font-bold text-gray-800">Tomorrow's Preparation</h3>
//           <p className="text-sm text-blue-600 mb-4">
//             {new Date(Date.now() + 86400000).toLocaleDateString('en-IN', { 
//               day: 'numeric', 
//               month: 'short', 
//               year: 'numeric' 
//             })} - {tomorrowDueWorks.length} items due
//           </p>

//           {/* Due Tomorrow Works List */}
//           <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
//             {tomorrowDueWorks.length > 0 ? (
//               tomorrowDueWorks.map((work) => (
//                 <div
//                   key={work._id}
//                   onClick={() => navigate(`/cuttingmaster/works/${work._id}`)}
//                   className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer border-l-4 border-blue-400"
//                 >
//                   <div className="flex-1">
//                     <div className="flex items-center gap-2 mb-1">
//                       <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
//                         #{work.workId}
//                       </span>
//                       <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
//                         {work.garment?.garmentId || 'N/A'}
//                       </span>
//                       {work.order?.priority === 'high' && (
//                         <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700">
//                           🔴 High
//                         </span>
//                       )}
//                     </div>
//                     <p className="font-medium text-gray-800">
//                       {work.garment?.name || 'Unknown Garment'}
//                     </p>
//                     <p className="text-xs text-gray-500">
//                       👤 {work.order?.customer?.name || 'Unknown'}
//                     </p>
//                   </div>
//                   <ChevronRight size={18} className="text-gray-400" />
//                 </div>
//               ))
//             ) : (
//               <div className="text-center py-8 bg-white/50 rounded-lg">
//                 <p className="text-sm text-gray-600">No items due tomorrow</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Production Queue with ALL 8 STATUSES */}
//       <div className="bg-white rounded-xl shadow-sm p-6">
//         <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
//           <div className="flex items-center gap-3">
//             <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
//               <Layers className="w-5 h-5 text-purple-600" />
//               Work Queue
//             </h2>
//             <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
//               {prioritizedQueue.length} items
//             </span>
//           </div>

//           <div className="flex flex-wrap gap-3">
//             {/* View Filters */}
//             <div className="flex bg-gray-100 rounded-lg p-1">
//               <button
//                 onClick={() => setSelectedView("all")}
//                 className={`px-3 py-1.5 text-xs rounded-md transition ${
//                   selectedView === "all"
//                     ? "bg-purple-600 text-white"
//                     : "text-gray-600 hover:bg-gray-200"
//                 }`}
//               >
//                 All ({stats.totalWork})
//               </button>
//               <button
//                 onClick={() => setSelectedView("new")}
//                 className={`px-3 py-1.5 text-xs rounded-md transition flex items-center gap-1 ${
//                   selectedView === "new"
//                     ? "bg-yellow-500 text-white"
//                     : "text-gray-600 hover:bg-gray-200"
//                 }`}
//               >
//                 <span>🆕 New / Not Accepted</span>
//                 <span
//                   className={`ml-1 px-1.5 py-0.5 text-xs rounded-full ${
//                     selectedView === "new"
//                       ? "bg-yellow-600 text-white"
//                       : "bg-yellow-100 text-yellow-700"
//                   }`}
//                 >
//                   {stats.pendingWorks}
//                 </span>
//               </button>
//               <button
//                 onClick={() => setSelectedView("need-tailor")}
//                 className={`px-3 py-1.5 text-xs rounded-md transition flex items-center gap-1 ${
//                   selectedView === "need-tailor"
//                     ? "bg-orange-500 text-white"
//                     : "text-gray-600 hover:bg-gray-200"
//                 }`}
//               >
//                 <span>👔 Need Tailor</span>
//                 <span
//                   className={`ml-1 px-1.5 py-0.5 text-xs rounded-full ${
//                     selectedView === "need-tailor"
//                       ? "bg-orange-600 text-white"
//                       : "bg-orange-100 text-orange-700"
//                   }`}
//                 >
//                   {stats.unassignedCount}
//                 </span>
//               </button>
//             </div>

//             {/* Search with placeholder showing all options */}
//             <div className="relative">
//               <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//               <input
//                 type="text"
//                 value={queueSearch}
//                 onChange={(e) => setQueueSearch(e.target.value)}
//                 placeholder="Search by Work ID, Garment ID or Customer..."
//                 className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 w-64"
//                 title="Search by Work ID (WRK-001), Garment ID (GRM-001) or Customer Name"
//               />
//               {queueSearch && (
//                 <button
//                   onClick={() => setQueueSearch("")}
//                   className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                 >
//                   <X size={16} />
//                 </button>
//               )}
//             </div>

//             {/* Status Filter - WITH ALL 8 STATUSES */}
//             <select
//               value={queueStatus}
//               onChange={(e) => setQueueStatus(e.target.value)}
//               className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
//             >
//               <option value="all">🔍 All Status</option>
//               <option value="pending">⏳ Pending</option>
//               <option value="accepted">✅ Accepted</option>
//               <option value="cutting-started">✂️ Cutting Started</option>
//               <option value="cutting-completed">✔️ Cutting Completed</option>
//               <option value="sewing-started">🧵 Sewing Started</option>
//               <option value="sewing-completed">🧵 Sewing Completed</option>
//               <option value="ironing">🔥 Ironing</option>
//               <option value="ready-to-deliver">📦 Ready to Deliver</option>
//             </select>

//             {/* Sort By */}
//             <select
//               value={sortBy}
//               onChange={(e) => setSortBy(e.target.value)}
//               className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
//             >
//               <option value="priority">Sort by Priority</option>
//               <option value="due">Sort by Due Date</option>
//             </select>
//           </div>
//         </div>

//         {/* Queue List - Showing ALL 8 statuses */}
//         {loading ? (
//           <div className="flex justify-center items-center h-64">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
//           </div>
//         ) : (
//           <div className="space-y-3 max-h-[800px] overflow-y-auto pr-2">
//             {prioritizedQueue
//               .filter((item) => {
//                 if (selectedView === "new") {
//                   return item.status === "pending";
//                 }
//                 if (selectedView === "need-tailor") {
//                   return item.status === "accepted" && !item.tailor;
//                 }
//                 return true;
//               })
//               .map((work) => {
//                 const dueStatus = getDueStatus(work.estimatedDelivery);
//                 const isHighPriority = work.order?.priority === "high";

//                 return (
//                   <div
//                     key={work._id}
//                     className={`border-2 rounded-lg p-4 transition-all hover:shadow-md ${getStatusColor(work.status)} ${
//                       isHighPriority ? "border-l-8 border-l-red-500" : ""
//                     }`}
//                   >
//                     <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
//                       <div className="flex-1">
//                         {/* Top Row */}
//                         <div className="flex items-center gap-2 mb-2 flex-wrap">
//                           <span className="font-mono text-sm font-bold text-purple-600 bg-white px-2 py-1 rounded">
//                             #{work.workId}
//                           </span>
//                           <span
//                             className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(work.status)}`}
//                           >
//                             {getStatusBadge(work.status)}
//                           </span>
//                           {isHighPriority && (
//                             <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full flex items-center gap-1">
//                               <Flag size={10} /> High Priority
//                             </span>
//                           )}
//                         </div>

//                         <h3 className="font-bold text-gray-800 text-lg mb-1">
//                           {work.garment?.name || "N/A"}
//                         </h3>

//                         <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
//                           <div className="flex items-center gap-1">
//                             <User size={14} className="text-gray-400" />
//                             <span>
//                               {work.order?.customer?.name || "Unknown"}
//                             </span>
//                           </div>

//                           <div
//                             className={`flex items-center gap-1 ${dueStatus.color}`}
//                           >
//                             {dueStatus.icon}
//                             <span>{dueStatus.label}</span>
//                           </div>

//                           <div className="flex items-center gap-1">
//                             <Package size={14} className="text-purple-500" />
//                             <span>
//                               Garment: {work.garment?.garmentId || "N/A"}
//                             </span>
//                           </div>

//                           {work.tailor && (
//                             <div className="flex items-center gap-1">
//                               <UserCheck size={14} className="text-green-500" />
//                               <span>Tailor: {work.tailor.name}</span>
//                             </div>
//                           )}
//                         </div>
//                       </div>

//                       {/* Action Buttons */}
//                       {work.status === "pending" ? (
//                         <button
//                           onClick={() => handleAcceptWork(work)}
//                           disabled={acceptingId === work._id}
//                           className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
//                             acceptingId === work._id
//                               ? "bg-gray-400 cursor-not-allowed text-white"
//                               : "bg-green-600 hover:bg-green-700 text-white"
//                           }`}
//                         >
//                           {acceptingId === work._id ? (
//                             <>
//                               <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                               Processing...
//                             </>
//                           ) : (
//                             <>
//                               <CheckCircle size={16} />
//                               Accept
//                             </>
//                           )}
//                         </button>
//                       ) : work.status === "accepted" && !work.tailor ? (
//                         <div className="flex gap-2">
//                           <button
//                             onClick={() => handleViewWork(work._id)}
//                             className="px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition flex items-center gap-1"
//                           >
//                             <Eye size={14} /> View
//                           </button>
//                           <button
//                             onClick={() => handleAssignTailor(work._id)}
//                             className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center gap-1"
//                           >
//                             <UserPlus size={14} /> Assign
//                           </button>
//                         </div>
//                       ) : (
//                         <button
//                           onClick={() => handleViewWork(work._id)}
//                           className="px-3 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition flex items-center gap-1"
//                         >
//                           <Eye size={14} /> Details
//                         </button>
//                       )}
//                     </div>
//                   </div>
//                 );
//               })}

//             {prioritizedQueue.length === 0 && (
//               <div className="text-center py-12 text-gray-500">
//                 <Scissors className="w-12 h-12 text-gray-300 mx-auto mb-3" />
//                 <p className="font-medium">No items in work queue</p>
//                 <p className="text-sm text-gray-400 mt-1">
//                   Try adjusting your filters
//                 </p>
//               </div>
//             )}
//           </div>
//         )}
//       </div>

//       {/* Pagination */}
//       {pagination?.pages > 1 && (
//         <div className="mt-6 flex items-center justify-center gap-2">
//           <button
//             onClick={() => dispatch(setFilters({ page: pagination.page - 1 }))}
//             disabled={pagination.page === 1}
//             className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
//           >
//             <ChevronLeft size={18} />
//           </button>
//           <span className="px-4 py-2 bg-purple-50 text-purple-600 rounded-lg">
//             Page {pagination.page} of {pagination.pages}
//           </span>
//           <button
//             onClick={() => dispatch(setFilters({ page: pagination.page + 1 }))}
//             disabled={pagination.page === pagination.pages}
//             className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
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

//             <h2 className="text-xl font-bold text-center mb-2">
//               Work Accepted Successfully!
//             </h2>

//             <div className="bg-green-50 p-4 rounded-lg mb-4">
//               <p className="text-sm text-green-700 mb-2">
//                 This work is now assigned to:
//               </p>
//               <p className="font-bold text-lg text-green-800">
//                 {acceptedWork.assignedTo}
//               </p>
//               <p className="text-xs text-green-600 mt-1">
//                 Work ID: {acceptedWork.workId}
//               </p>
//             </div>

//             <div className="flex gap-3">
//               <button
//                 onClick={() => {
//                   setShowSuccessModal(false);
//                   navigate(
//                     `/cuttingmaster/works/${acceptedWork._id}?assign=true`,
//                   );
//                 }}
//                 className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
//               >
//                 Assign Tailor Now
//               </button>
//               <button
//                 onClick={() => setShowSuccessModal(false)}
//                 className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
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
// import React, { useState, useEffect, useMemo } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
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
//   User,
//   Search,
//   Filter,
//   Flag,
//   Bell,
//   Activity,
//   Target,
//   TrendingUp,
//   PieChart,
//   Layers,
//   Download,
//   Zap,
//   UserCheck,
//   BarChart3,
//   PlusCircle,
// } from "lucide-react";
// import {
//   fetchMyWorks,
//   acceptWorkById,
//   selectMyWorks,
//   selectWorkPagination,
//   selectWorkLoading,
//   setFilters,
// } from "../../features/work/workSlice";
// import showToast from "../../utils/toast";

// export default function CuttingMasterWorks() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const works = useSelector(selectMyWorks);
//   const pagination = useSelector(selectWorkPagination);
//   const loading = useSelector(selectWorkLoading);
//   const { user } = useSelector((state) => state.auth);

//   // State
//   const [filter, setFilter] = useState("all");
//   const [acceptingId, setAcceptingId] = useState(null);
//   const [showSuccessModal, setShowSuccessModal] = useState(false);
//   const [acceptedWork, setAcceptedWork] = useState(null);

//   // Queue search and filter state
//   const [queueSearch, setQueueSearch] = useState("");
//   const [queueStatus, setQueueStatus] = useState("all");
//   const [sortBy, setSortBy] = useState("priority");
//   const [selectedView, setSelectedView] = useState("all"); // all, new, need-tailor

//   // Load works when filter changes
//   useEffect(() => {
//     loadWorks();
//   }, [filter]);

//   // Load works with proper filter params
//   const loadWorks = async () => {
//     try {
//       let params = {};

//       if (filter === "assigned") {
//         params.hasTailor = "true";
//       } else if (filter === "unassigned") {
//         params.hasTailor = "false";
//         params.status = "accepted";
//       } else if (filter === "in-progress") {
//         params.status = [
//           "cutting-started",
//           "cutting-completed",
//           "sewing-started",
//           "sewing-completed",
//           "ironing",
//         ];
//       } else if (filter !== "all") {
//         params.status = filter;
//       }

//       await dispatch(fetchMyWorks(params)).unwrap();
//     } catch (error) {
//       showToast.error("Failed to load works");
//     }
//   };

//   const handleRefresh = () => {
//     loadWorks();
//     showToast.success("Data refreshed");
//   };

//   // Accept work
//   const handleAcceptWork = async (work) => {
//     setAcceptingId(work._id);

//     if (work.status !== "pending") {
//       showToast.info("This work is no longer available");
//       setAcceptingId(null);
//       loadWorks();
//       return;
//     }

//     if (!window.confirm("Accept this work? It will be assigned to you.")) {
//       setAcceptingId(null);
//       return;
//     }

//     try {
//       const result = await dispatch(acceptWorkById(work._id)).unwrap();

//       showToast.success("Work accepted successfully!");

//       setAcceptedWork({
//         ...work,
//         ...result.data,
//         assignedTo: user?.name,
//       });
//       setShowSuccessModal(true);

//       loadWorks();
//     } catch (error) {
//       console.error("❌ Accept failed:", error);

//       if (
//         error === "This work was already accepted by another cutting master"
//       ) {
//         showToast.error("This work was just taken by another cutting master");
//       } else {
//         showToast.error(error || "Failed to accept work");
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

//   // COMPLETE STATUS COLORS for all 8 statuses
//   const getStatusColor = (status) => {
//     const colors = {
//       pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
//       accepted: "bg-blue-100 text-blue-800 border-blue-200",
//       "cutting-started": "bg-purple-100 text-purple-800 border-purple-200",
//       "cutting-completed": "bg-indigo-100 text-indigo-800 border-indigo-200",
//       "sewing-started": "bg-pink-100 text-pink-800 border-pink-200",
//       "sewing-completed": "bg-teal-100 text-teal-800 border-teal-200",
//       ironing: "bg-orange-100 text-orange-800 border-orange-200",
//       "ready-to-deliver": "bg-green-100 text-green-800 border-green-200",
//     };
//     return colors[status] || "bg-gray-100 text-gray-800 border-gray-200";
//   };

//   // COMPLETE STATUS BADGES with icons
//   const getStatusBadge = (status) => {
//     const badges = {
//       pending: "⏳ Pending",
//       accepted: "✅ Accepted",
//       "cutting-started": "✂️ Cutting Started",
//       "cutting-completed": "✔️ Cutting Completed",
//       "sewing-started": "🧵 Sewing Started",
//       "sewing-completed": "🧵 Sewing Completed",
//       ironing: "🔥 Ironing",
//       "ready-to-deliver": "📦 Ready to Deliver",
//     };
//     return badges[status] || status;
//   };

//   const getStatusIcon = (status) => {
//     switch (status) {
//       case "pending":
//         return <Clock size={16} />;
//       case "accepted":
//         return <CheckCircle size={16} />;
//       case "cutting-started":
//         return <Scissors size={16} />;
//       case "cutting-completed":
//         return <Scissors size={16} />;
//       case "sewing-started":
//         return <Ruler size={16} />;
//       case "sewing-completed":
//         return <Ruler size={16} />;
//       case "ironing":
//         return <Truck size={16} />;
//       case "ready-to-deliver":
//         return <CheckCircle size={16} />;
//       default:
//         return <Briefcase size={16} />;
//     }
//   };

//   // Format date
//   const formatDate = (dateString) => {
//     if (!dateString) return "Not set";
//     return new Date(dateString).toLocaleDateString("en-GB", {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//     });
//   };

//   // Due status helper
//   const getDueStatus = (date) => {
//     if (!date)
//       return {
//         label: "No due date",
//         color: "text-gray-600",
//         icon: <Calendar className="w-4 h-4 text-gray-400" />,
//       };

//     const diff = new Date(date) - new Date();
//     const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

//     if (days === 0) {
//       return {
//         label: "Due Today 🚨",
//         color: "text-red-600 font-bold",
//         icon: <Bell className="w-4 h-4 text-red-500 animate-pulse" />,
//       };
//     }
//     if (days < 0) {
//       return {
//         label: `Overdue by ${Math.abs(days)} days ⚠️`,
//         color: "text-gray-900 font-bold",
//         icon: <AlertCircle className="w-4 h-4 text-gray-700" />,
//       };
//     }
//     if (days === 1) {
//       return {
//         label: "Due Tomorrow",
//         color: "text-orange-600",
//         icon: <Clock className="w-4 h-4 text-orange-500" />,
//       };
//     }
//     return {
//       label: `Due in ${days} days`,
//       color: "text-green-600",
//       icon: <Calendar className="w-4 h-4 text-green-500" />,
//     };
//   };

//   // Filter works based on current filter and search
//   const filteredWorks = useMemo(() => {
//     let filtered = works || [];

//     // Apply status filter from tabs
//     if (filter !== "all") {
//       if (filter === "assigned") {
//         filtered = filtered.filter(
//           (work) => work.tailor !== null && work.tailor !== undefined,
//         );
//       } else if (filter === "unassigned") {
//         filtered = filtered.filter(
//           (work) => work.status === "accepted" && !work.tailor,
//         );
//       } else if (filter === "in-progress") {
//         filtered = filtered.filter((work) =>
//           [
//             "cutting-started",
//             "cutting-completed",
//             "sewing-started",
//             "sewing-completed",
//             "ironing",
//           ].includes(work.status),
//         );
//       } else {
//         filtered = filtered.filter((work) => work.status === filter);
//       }
//     }

//     // Apply search
//     if (queueSearch) {
//       const searchTerm = queueSearch.toLowerCase().trim();
//       filtered = filtered.filter(
//         (item) =>
//           item.workId?.toLowerCase().includes(searchTerm) ||
//           item.garment?.garmentId?.toLowerCase().includes(searchTerm) ||
//           item.garment?.name?.toLowerCase().includes(searchTerm) ||
//           item.order?.customer?.name?.toLowerCase().includes(searchTerm) ||
//           item.order?.orderId?.toLowerCase().includes(searchTerm),
//       );
//     }

//     // Apply queue status filter
//     if (queueStatus !== "all") {
//       filtered = filtered.filter((item) => item.status === queueStatus);
//     }

//     return filtered;
//   }, [works, filter, queueSearch, queueStatus]);

//   // 🔥 FIXED: Priority sorting with due date - BOTH OPTIONS WORK NOW
//   const prioritizedQueue = useMemo(() => {
//     if (!filteredWorks.length) return [];

//     return [...filteredWorks].sort((a, b) => {
//       // Helper function to get days difference (with null check)
//       const getDaysDiff = (date) => {
//         if (!date) return 999999; // No date = put at very end
//         const diff = new Date(date) - new Date();
//         return Math.ceil(diff / (1000 * 60 * 60 * 24));
//       };

//       const daysA = getDaysDiff(a.estimatedDelivery);
//       const daysB = getDaysDiff(b.estimatedDelivery);
      
//       // Priority weights (lower number = higher priority)
//       const priorityWeight = { 
//         high: 1, 
//         normal: 2, 
//         low: 3 
//       };

//       const aPriority = a.order?.priority || 'normal';
//       const bPriority = b.order?.priority || 'normal';

//       // ✅ FIX 1: Sort by selected option
//       if (sortBy === "priority") {
//         // First sort by priority (high → normal → low)
//         if (priorityWeight[aPriority] !== priorityWeight[bPriority]) {
//           return priorityWeight[aPriority] - priorityWeight[bPriority];
//         }
//         // Then by due date (earliest first)
//         return daysA - daysB;
//       } 
//       else if (sortBy === "due") {
//         // First sort by due date (earliest first)
//         if (daysA !== daysB) {
//           return daysA - daysB;
//         }
//         // Then by priority (high → normal → low)
//         return priorityWeight[aPriority] - priorityWeight[bPriority];
//       }
      
//       return 0;
//     });
//   }, [filteredWorks, sortBy]);

//   // Stats calculations with Overdue
//   const stats = useMemo(() => {
//     const allWorks = works || [];
    
//     // Calculate overdue works
//     const overdueCount = allWorks.filter(w => {
//       if (!w.estimatedDelivery) return false;
//       const today = new Date();
//       const deliveryDate = new Date(w.estimatedDelivery);
//       const isOverdue = deliveryDate < today && 
//         !['ready-to-deliver', 'ironing'].includes(w.status);
//       return isOverdue;
//     }).length;
    
//     return {
//       totalWork: allWorks.length,
//       pendingWorks: allWorks.filter((w) => w.status === "pending").length,
//       acceptedWorks: allWorks.filter((w) => w.status === "accepted").length,
//       inProgressWorks: allWorks.filter((w) =>
//         [
//           "cutting-started",
//           "cutting-completed",
//           "sewing-started",
//           "sewing-completed",
//           "ironing",
//         ].includes(w.status),
//       ).length,
//       readyWorks: allWorks.filter((w) => w.status === "ready-to-deliver").length,
//       assignedCount: allWorks.filter((w) => w.tailor).length,
//       unassignedCount: allWorks.filter(
//         (w) => w.status === "accepted" && !w.tailor,
//       ).length,
//       overdueCount: overdueCount,
//     };
//   }, [works]);

//   // Status breakdown
//   const statusBreakdown = useMemo(() => {
//     const allWorks = works || [];
//     return [
//       {
//         status: "pending",
//         count: allWorks.filter((w) => w.status === "pending").length,
//         color: "bg-yellow-500",
//       },
//       {
//         status: "accepted",
//         count: allWorks.filter((w) => w.status === "accepted").length,
//         color: "bg-blue-500",
//       },
//       {
//         status: "cutting-started",
//         count: allWorks.filter((w) => w.status === "cutting-started").length,
//         color: "bg-purple-500",
//       },
//       {
//         status: "cutting-completed",
//         count: allWorks.filter((w) => w.status === "cutting-completed").length,
//         color: "bg-indigo-500",
//       },
//       {
//         status: "sewing-started",
//         count: allWorks.filter((w) => w.status === "sewing-started").length,
//         color: "bg-pink-500",
//       },
//       {
//         status: "sewing-completed",
//         count: allWorks.filter((w) => w.status === "sewing-completed").length,
//         color: "bg-teal-500",
//       },
//       {
//         status: "ironing",
//         count: allWorks.filter((w) => w.status === "ironing").length,
//         color: "bg-orange-500",
//       },
//       {
//         status: "ready-to-deliver",
//         count: allWorks.filter((w) => w.status === "ready-to-deliver").length,
//         color: "bg-green-500",
//       },
//     ];
//   }, [works]);

//   // Today's Due Works
//   const todayDueWorks = useMemo(() => {
//     const today = new Date();
//     const todayStr = today.toDateString();
    
//     return (works || [])
//       .filter(work => {
//         if (!work.estimatedDelivery) return false;
//         const workDate = new Date(work.estimatedDelivery);
//         return workDate.toDateString() === todayStr;
//       })
//       .sort((a, b) => {
//         const priorityWeight = { high: 1, normal: 2, low: 3 };
//         const aPriority = a.order?.priority || 'normal';
//         const bPriority = b.order?.priority || 'normal';
        
//         if (priorityWeight[aPriority] !== priorityWeight[bPriority]) {
//           return priorityWeight[aPriority] - priorityWeight[bPriority];
//         }
        
//         const aTime = new Date(a.estimatedDelivery).getTime();
//         const bTime = new Date(b.estimatedDelivery).getTime();
//         return aTime - bTime;
//       });
//   }, [works]);

//   // Tomorrow's Due Works
//   const tomorrowDueWorks = useMemo(() => {
//     const tomorrow = new Date();
//     tomorrow.setDate(tomorrow.getDate() + 1);
//     const tomorrowStr = tomorrow.toDateString();
    
//     return (works || [])
//       .filter(work => {
//         if (!work.estimatedDelivery) return false;
//         const workDate = new Date(work.estimatedDelivery);
//         return workDate.toDateString() === tomorrowStr;
//       })
//       .sort((a, b) => {
//         const aTime = new Date(a.estimatedDelivery).getTime();
//         const bTime = new Date(b.estimatedDelivery).getTime();
//         return aTime - bTime;
//       });
//   }, [works]);

//   // Priority counts for today
//   const highPriorityToday = useMemo(() => 
//     todayDueWorks.filter(w => w.order?.priority === 'high').length, 
//   [todayDueWorks]);

//   const normalPriorityToday = useMemo(() => 
//     todayDueWorks.filter(w => w.order?.priority === 'normal' || !w.order?.priority).length, 
//   [todayDueWorks]);

//   const lowPriorityToday = useMemo(() => 
//     todayDueWorks.filter(w => w.order?.priority === 'low').length, 
//   [todayDueWorks]);

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 md:p-6">
//       {/* Header */}
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
//         <div>
//           <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
//             <Scissors className="w-8 h-8 text-purple-600" />
//             Cutting Master Work Queue
//           </h1>
//           <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
//             <span>Welcome back, {user?.name || "Cutting Master"}! 👋</span>
//             <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
//               {new Date().toLocaleDateString("en-IN", {
//                 weekday: "long",
//                 day: "numeric",
//                 month: "long",
//               })}
//             </span>
//           </p>
//         </div>

//         <button
//           onClick={handleRefresh}
//           className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center gap-2 shadow-sm"
//         >
//           <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
//           Refresh
//         </button>
//       </div>

//       {/* KPI Cards */}
//       <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-6">
//         {/* 1. Not Accepted - Pending */}
//         <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-gray-500">
//           <p className="text-xs text-gray-500 mb-1">⏳ Not Accepted</p>
//           <p className="text-2xl font-bold text-gray-800">
//             {stats.pendingWorks}
//           </p>
//           <p className="text-xs text-gray-400 mt-1">Pending</p>
//         </div>

//         {/* 2. Accepted */}
//         <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-blue-500">
//           <p className="text-xs text-gray-500 mb-1">✅ Accepted</p>
//           <p className="text-2xl font-bold text-blue-600">
//             {stats.acceptedWorks}
//           </p>
//           <p className="text-xs text-gray-400 mt-1">Accepted works</p>
//         </div>

//         {/* 3. In Progress */}
//         <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-purple-500">
//           <p className="text-xs text-gray-500 mb-1">⚙️ In Progress</p>
//           <p className="text-2xl font-bold text-purple-600">
//             {stats.inProgressWorks}
//           </p>
//           <p className="text-xs text-gray-400 mt-1">Cutting → Ironing</p>
//         </div>

//         {/* 4. Ready to Deliver */}
//         <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-green-500">
//           <p className="text-xs text-gray-500 mb-1">📦 Ready to Deliver</p>
//           <p className="text-2xl font-bold text-green-600">
//             {stats.readyWorks}
//           </p>
//           <p className="text-xs text-gray-400 mt-1">Ready for delivery</p>
//         </div>

//         {/* 5. Assigned to Tailor */}
//         <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-indigo-500">
//           <p className="text-xs text-gray-500 mb-1">👔 Assigned to Tailor</p>
//           <p className="text-2xl font-bold text-indigo-600">
//             {stats.assignedCount}
//           </p>
//           <p className="text-xs text-gray-400 mt-1">Tailor assigned</p>
//         </div>

//         {/* 6. Not Assigned (Need Tailor) */}
//         <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-orange-500">
//           <p className="text-xs text-gray-500 mb-1">⚠️ Not Assigned</p>
//           <p className="text-2xl font-bold text-orange-600">
//             {stats.unassignedCount}
//           </p>
//           <p className="text-xs text-gray-400 mt-1">Need tailor</p>
//         </div>

//         {/* 7. Overdue Works */}
//         <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-red-600">
//           <p className="text-xs text-gray-500 mb-1">🚨 Overdue</p>
//           <p className="text-2xl font-bold text-red-600">
//             {stats.overdueCount}
//           </p>
//           <p className="text-xs text-gray-400 mt-1">Past delivery date</p>
//         </div>

//         {/* 8. Total Works */}
//         <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-cyan-500">
//           <p className="text-xs text-gray-500 mb-1">📊 Total Works</p>
//           <p className="text-2xl font-bold text-cyan-600">{stats.totalWork}</p>
//           <p className="text-xs text-gray-400 mt-1">All works</p>
//         </div>
//       </div>

//       {/* Status Breakdown - Visual representation of all 8 statuses */}
//       <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
//         <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
//           <PieChart size={20} className="text-purple-600" />
//           Production Status Overview
//         </h2>

//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//           {statusBreakdown.map((item) => (
//             <div key={item.status} className="relative">
//               <div className="flex justify-between text-sm mb-1">
//                 <span className="text-gray-600 capitalize">
//                   {item.status.replace(/-/g, " ")}
//                 </span>
//                 <span className="font-bold text-gray-800">{item.count}</span>
//               </div>
//               <div className="w-full bg-gray-200 rounded-full h-2">
//                 <div
//                   className={`${item.color} h-2 rounded-full`}
//                   style={{
//                     width:
//                       stats.totalWork > 0
//                         ? `${(item.count / stats.totalWork) * 100}%`
//                         : "0%",
//                   }}
//                 />
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Today's Focus & Tomorrow's Prep */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//         {/* Today's Focus - Due Today Works */}
//         <div className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 rounded-xl p-6">
//           <div className="flex items-start justify-between mb-4">
//             <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-lg shadow-lg">
//               <Target className="w-6 h-6 text-white" />
//             </div>
            
//             {/* Modern Right Side */}
//             <div className="bg-white/80 backdrop-blur-sm rounded-lg p-2 shadow-sm">
//               <div className="flex items-center gap-3">
//                 {/* Date */}
//                 <div className="text-right">
//                   <p className="text-xs text-gray-500">Today</p>
//                   <p className="text-sm font-bold text-gray-800">
//                     {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
//                   </p>
//                 </div>
                
//                 {/* Divider */}
//                 <div className="w-px h-8 bg-red-200"></div>
                
//                 {/* Count */}
//                 <div className="text-center">
//                   <p className="text-xs text-gray-500">Due Today</p>
//                   <p className="text-xl font-bold text-red-600">{todayDueWorks.length}</p>
//                 </div>
                
//                 {/* Divider */}
//                 <div className="w-px h-8 bg-red-200"></div>
                
//                 {/* Priority Breakdown */}
//                 <div className="flex gap-2">
//                   <div className="text-center">
//                     <p className="text-xs text-red-600">🔴</p>
//                     <p className="text-sm font-bold text-gray-800">{highPriorityToday}</p>
//                   </div>
//                   <div className="text-center">
//                     <p className="text-xs text-orange-600">🟠</p>
//                     <p className="text-sm font-bold text-gray-800">{normalPriorityToday}</p>
//                   </div>
//                   <div className="text-center">
//                     <p className="text-xs text-green-600">🟢</p>
//                     <p className="text-sm font-bold text-gray-800">{lowPriorityToday}</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <h3 className="text-lg font-bold text-gray-800">Today's Deadline</h3>
//           <p className="text-sm text-red-600 mb-4">
//             {new Date().toLocaleDateString('en-IN', { 
//               day: 'numeric', 
//               month: 'long', 
//               year: 'numeric' 
//             })} - {todayDueWorks.length} items due
//           </p>

//           {/* Due Today Works List */}
//           <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
//             {todayDueWorks.length > 0 ? (
//               todayDueWorks.map((work) => {
//                 const priorityColor = 
//                   work.order?.priority === 'high' ? 'border-l-4 border-l-red-600 bg-red-50' :
//                   work.order?.priority === 'normal' ? 'border-l-4 border-l-orange-400 bg-orange-50' :
//                   'border-l-4 border-l-green-600 bg-green-50';
                
//                 const priorityText = 
//                   work.order?.priority === 'high' ? '🔴 High' :
//                   work.order?.priority === 'normal' ? '🟠 Normal' :
//                   '🟢 Low';
                
//                 return (
//                   <div
//                     key={work._id}
//                     onClick={() => navigate(`/cuttingmaster/works/${work._id}`)}
//                     className={`flex items-center justify-between p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer ${priorityColor}`}
//                   >
//                     <div className="flex-1">
//                       <div className="flex items-center gap-2 mb-1">
//                         <span className="font-mono text-xs font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded">
//                           #{work.workId}
//                         </span>
//                         <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
//                           {work.garment?.garmentId || 'N/A'}
//                         </span>
//                         <span className="text-xs font-medium">
//                           {priorityText}
//                         </span>
//                       </div>
//                       <p className="font-medium text-gray-800">
//                         {work.garment?.name || 'Unknown Garment'}
//                       </p>
//                       <p className="text-xs text-gray-500">
//                         👤 {work.order?.customer?.name || 'Unknown'} 
//                         {work.tailor && ` | 👔 Tailor: ${work.tailor.name}`}
//                       </p>
//                       {work.estimatedDelivery && (
//                         <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
//                           <Clock size={12} />
//                           Due by {new Date(work.estimatedDelivery).toLocaleTimeString('en-IN', { 
//                             hour: '2-digit', 
//                             minute: '2-digit' 
//                           })}
//                         </p>
//                       )}
//                     </div>
//                     <ChevronRight size={18} className="text-gray-400" />
//                   </div>
//                 );
//               })
//             ) : (
//               <div className="text-center py-8 bg-white/50 rounded-lg">
//                 <CheckCircle size={32} className="text-green-400 mx-auto mb-2" />
//                 <p className="text-sm text-gray-600">No works due today! 🎉</p>
//                 <p className="text-xs text-gray-400 mt-1">All caught up</p>
//               </div>
//             )}
//           </div>

//           {/* Summary Footer */}
//           {todayDueWorks.length > 0 && (
//             <div className="mt-4 pt-3 border-t border-red-200 flex justify-between items-center text-xs text-gray-600">
//               <div className="flex gap-3">
//                 <span>Total: <span className="font-bold text-gray-800">{todayDueWorks.length}</span></span>
//                 <span>🔴 High: <span className="font-bold text-red-600">{highPriorityToday}</span></span>
//                 <span>🟠 Normal: <span className="font-bold text-orange-600">{normalPriorityToday}</span></span>
//                 <span>🟢 Low: <span className="font-bold text-green-600">{lowPriorityToday}</span></span>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Tomorrow's Prep - Due Tomorrow Works */}
//         <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl p-6">
//           <div className="p-3 bg-blue-500 rounded-lg w-fit mb-4">
//             <Clock className="w-6 h-6 text-white" />
//           </div>

//           <h3 className="text-lg font-bold text-gray-800">Tomorrow's Preparation</h3>
//           <p className="text-sm text-blue-600 mb-4">
//             {new Date(Date.now() + 86400000).toLocaleDateString('en-IN', { 
//               day: 'numeric', 
//               month: 'short', 
//               year: 'numeric' 
//             })} - {tomorrowDueWorks.length} items due
//           </p>

//           {/* Due Tomorrow Works List */}
//           <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
//             {tomorrowDueWorks.length > 0 ? (
//               tomorrowDueWorks.map((work) => (
//                 <div
//                   key={work._id}
//                   onClick={() => navigate(`/cuttingmaster/works/${work._id}`)}
//                   className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer border-l-4 border-blue-400"
//                 >
//                   <div className="flex-1">
//                     <div className="flex items-center gap-2 mb-1">
//                       <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
//                         #{work.workId}
//                       </span>
//                       <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
//                         {work.garment?.garmentId || 'N/A'}
//                       </span>
//                       {work.order?.priority === 'high' && (
//                         <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700">
//                           🔴 High
//                         </span>
//                       )}
//                     </div>
//                     <p className="font-medium text-gray-800">
//                       {work.garment?.name || 'Unknown Garment'}
//                     </p>
//                     <p className="text-xs text-gray-500">
//                       👤 {work.order?.customer?.name || 'Unknown'}
//                     </p>
//                   </div>
//                   <ChevronRight size={18} className="text-gray-400" />
//                 </div>
//               ))
//             ) : (
//               <div className="text-center py-8 bg-white/50 rounded-lg">
//                 <p className="text-sm text-gray-600">No items due tomorrow</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Production Queue with ALL 8 STATUSES */}
//       <div className="bg-white rounded-xl shadow-sm p-6">
//         <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
//           <div className="flex items-center gap-3">
//             <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
//               <Layers className="w-5 h-5 text-purple-600" />
//               Work Queue
//             </h2>
//             <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
//               {prioritizedQueue.length} items
//             </span>
//           </div>

//           <div className="flex flex-wrap gap-3">
//             {/* View Filters */}
//             <div className="flex bg-gray-100 rounded-lg p-1">
//               <button
//                 onClick={() => setSelectedView("all")}
//                 className={`px-3 py-1.5 text-xs rounded-md transition ${
//                   selectedView === "all"
//                     ? "bg-purple-600 text-white"
//                     : "text-gray-600 hover:bg-gray-200"
//                 }`}
//               >
//                 All ({stats.totalWork})
//               </button>
//               <button
//                 onClick={() => setSelectedView("new")}
//                 className={`px-3 py-1.5 text-xs rounded-md transition flex items-center gap-1 ${
//                   selectedView === "new"
//                     ? "bg-yellow-500 text-white"
//                     : "text-gray-600 hover:bg-gray-200"
//                 }`}
//               >
//                 <span>🆕 New / Not Accepted</span>
//                 <span
//                   className={`ml-1 px-1.5 py-0.5 text-xs rounded-full ${
//                     selectedView === "new"
//                       ? "bg-yellow-600 text-white"
//                       : "bg-yellow-100 text-yellow-700"
//                   }`}
//                 >
//                   {stats.pendingWorks}
//                 </span>
//               </button>
//               <button
//                 onClick={() => setSelectedView("need-tailor")}
//                 className={`px-3 py-1.5 text-xs rounded-md transition flex items-center gap-1 ${
//                   selectedView === "need-tailor"
//                     ? "bg-orange-500 text-white"
//                     : "text-gray-600 hover:bg-gray-200"
//                 }`}
//               >
//                 <span>👔 Need Tailor</span>
//                 <span
//                   className={`ml-1 px-1.5 py-0.5 text-xs rounded-full ${
//                     selectedView === "need-tailor"
//                       ? "bg-orange-600 text-white"
//                       : "bg-orange-100 text-orange-700"
//                   }`}
//                 >
//                   {stats.unassignedCount}
//                 </span>
//               </button>
//             </div>

//             {/* Search with placeholder showing all options */}
//             <div className="relative">
//               <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//               <input
//                 type="text"
//                 value={queueSearch}
//                 onChange={(e) => setQueueSearch(e.target.value)}
//                 placeholder="Search by Work ID, Garment ID or Customer..."
//                 className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 w-64"
//                 title="Search by Work ID (WRK-001), Garment ID (GRM-001) or Customer Name"
//               />
//               {queueSearch && (
//                 <button
//                   onClick={() => setQueueSearch("")}
//                   className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                 >
//                   <X size={16} />
//                 </button>
//               )}
//             </div>

//             {/* Status Filter - WITH ALL 8 STATUSES */}
//             <select
//               value={queueStatus}
//               onChange={(e) => setQueueStatus(e.target.value)}
//               className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
//             >
//               <option value="all">🔍 All Status</option>
//               <option value="pending">⏳ Pending</option>
//               <option value="accepted">✅ Accepted</option>
//               <option value="cutting-started">✂️ Cutting Started</option>
//               <option value="cutting-completed">✔️ Cutting Completed</option>
//               <option value="sewing-started">🧵 Sewing Started</option>
//               <option value="sewing-completed">🧵 Sewing Completed</option>
//               <option value="ironing">🔥 Ironing</option>
//               <option value="ready-to-deliver">📦 Ready to Deliver</option>
//             </select>

//             {/* Sort By - BOTH OPTIONS WORK NOW */}
//             <select
//               value={sortBy}
//               onChange={(e) => setSortBy(e.target.value)}
//               className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
//             >
//               <option value="priority">Sort by Priority</option>
//               <option value="due">Sort by Due Date</option>
//             </select>
//           </div>
//         </div>

//         {/* Queue List - Showing ALL 8 statuses */}
//         {loading ? (
//           <div className="flex justify-center items-center h-64">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
//           </div>
//         ) : (
//           <div className="space-y-3 max-h-[800px] overflow-y-auto pr-2">
//             {prioritizedQueue
//               .filter((item) => {
//                 if (selectedView === "new") {
//                   return item.status === "pending";
//                 }
//                 if (selectedView === "need-tailor") {
//                   return item.status === "accepted" && !item.tailor;
//                 }
//                 return true;
//               })
//               .map((work) => {
//                 const dueStatus = getDueStatus(work.estimatedDelivery);
//                 const isHighPriority = work.order?.priority === "high";

//                 return (
//                   <div
//                     key={work._id}
//                     className={`border-2 rounded-lg p-4 transition-all hover:shadow-md ${getStatusColor(work.status)} ${
//                       isHighPriority ? "border-l-8 border-l-red-500" : ""
//                     }`}
//                   >
//                     <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
//                       <div className="flex-1">
//                         {/* Top Row */}
//                         <div className="flex items-center gap-2 mb-2 flex-wrap">
//                           <span className="font-mono text-sm font-bold text-purple-600 bg-white px-2 py-1 rounded">
//                             #{work.workId}
//                           </span>
//                           <span
//                             className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(work.status)}`}
//                           >
//                             {getStatusBadge(work.status)}
//                           </span>
//                           {isHighPriority && (
//                             <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full flex items-center gap-1">
//                               <Flag size={10} /> High Priority
//                             </span>
//                           )}
//                         </div>

//                         <h3 className="font-bold text-gray-800 text-lg mb-1">
//                           {work.garment?.name || "N/A"}
//                         </h3>

//                         <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
//                           <div className="flex items-center gap-1">
//                             <User size={14} className="text-gray-400" />
//                             <span>
//                               {work.order?.customer?.name || "Unknown"}
//                             </span>
//                           </div>

//                           <div
//                             className={`flex items-center gap-1 ${dueStatus.color}`}
//                           >
//                             {dueStatus.icon}
//                             <span>{dueStatus.label}</span>
//                           </div>

//                           <div className="flex items-center gap-1">
//                             <Package size={14} className="text-purple-500" />
//                             <span>
//                               Garment: {work.garment?.garmentId || "N/A"}
//                             </span>
//                           </div>

//                           {work.tailor && (
//                             <div className="flex items-center gap-1">
//                               <UserCheck size={14} className="text-green-500" />
//                               <span>Tailor: {work.tailor.name}</span>
//                             </div>
//                           )}
//                         </div>
//                       </div>

//                       {/* Action Buttons */}
//                       {work.status === "pending" ? (
//                         <button
//                           onClick={() => handleAcceptWork(work)}
//                           disabled={acceptingId === work._id}
//                           className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
//                             acceptingId === work._id
//                               ? "bg-gray-400 cursor-not-allowed text-white"
//                               : "bg-green-600 hover:bg-green-700 text-white"
//                           }`}
//                         >
//                           {acceptingId === work._id ? (
//                             <>
//                               <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                               Processing...
//                             </>
//                           ) : (
//                             <>
//                               <CheckCircle size={16} />
//                               Accept
//                             </>
//                           )}
//                         </button>
//                       ) : work.status === "accepted" && !work.tailor ? (
//                         <div className="flex gap-2">
//                           <button
//                             onClick={() => handleViewWork(work._id)}
//                             className="px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition flex items-center gap-1"
//                           >
//                             <Eye size={14} /> View
//                           </button>
//                           <button
//                             onClick={() => handleAssignTailor(work._id)}
//                             className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center gap-1"
//                           >
//                             <UserPlus size={14} /> Assign
//                           </button>
//                         </div>
//                       ) : (
//                         <button
//                           onClick={() => handleViewWork(work._id)}
//                           className="px-3 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition flex items-center gap-1"
//                         >
//                           <Eye size={14} /> Details
//                         </button>
//                       )}
//                     </div>
//                   </div>
//                 );
//               })}

//             {prioritizedQueue.length === 0 && (
//               <div className="text-center py-12 text-gray-500">
//                 <Scissors className="w-12 h-12 text-gray-300 mx-auto mb-3" />
//                 <p className="font-medium">No items in work queue</p>
//                 <p className="text-sm text-gray-400 mt-1">
//                   Try adjusting your filters
//                 </p>
//               </div>
//             )}
//           </div>
//         )}
//       </div>

//       {/* Pagination */}
//       {pagination?.pages > 1 && (
//         <div className="mt-6 flex items-center justify-center gap-2">
//           <button
//             onClick={() => dispatch(setFilters({ page: pagination.page - 1 }))}
//             disabled={pagination.page === 1}
//             className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
//           >
//             <ChevronLeft size={18} />
//           </button>
//           <span className="px-4 py-2 bg-purple-50 text-purple-600 rounded-lg">
//             Page {pagination.page} of {pagination.pages}
//           </span>
//           <button
//             onClick={() => dispatch(setFilters({ page: pagination.page + 1 }))}
//             disabled={pagination.page === pagination.pages}
//             className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
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

//             <h2 className="text-xl font-bold text-center mb-2">
//               Work Accepted Successfully!
//             </h2>

//             <div className="bg-green-50 p-4 rounded-lg mb-4">
//               <p className="text-sm text-green-700 mb-2">
//                 This work is now assigned to:
//               </p>
//               <p className="font-bold text-lg text-green-800">
//                 {acceptedWork.assignedTo}
//               </p>
//               <p className="text-xs text-green-600 mt-1">
//                 Work ID: {acceptedWork.workId}
//               </p>
//             </div>

//             <div className="flex gap-3">
//               <button
//                 onClick={() => {
//                   setShowSuccessModal(false);
//                   navigate(
//                     `/cuttingmaster/works/${acceptedWork._id}?assign=true`,
//                   );
//                 }}
//                 className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
//               >
//                 Assign Tailor Now
//               </button>
//               <button
//                 onClick={() => setShowSuccessModal(false)}
//                 className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
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
// import React, { useState, useEffect, useMemo } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
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
//   User,
//   Search,
//   Filter,
//   Flag,
//   Bell,
//   Activity,
//   Target,
//   TrendingUp,
//   PieChart,
//   Layers,
//   Download,
//   Zap,
//   UserCheck,
//   BarChart3,
//   PlusCircle,
// } from "lucide-react";
// import {
//   fetchMyWorks,
//   acceptWorkById,
//   selectMyWorks,
//   selectWorkPagination,
//   selectWorkLoading,
//   setFilters,
// } from "../../features/work/workSlice";
// import showToast from "../../utils/toast";

// export default function CuttingMasterWorks() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const works = useSelector(selectMyWorks);
//   const pagination = useSelector(selectWorkPagination);
//   const loading = useSelector(selectWorkLoading);
//   const { user } = useSelector((state) => state.auth);

//   // State
//   const [filter, setFilter] = useState("all");
//   const [acceptingId, setAcceptingId] = useState(null);
//   const [showSuccessModal, setShowSuccessModal] = useState(false);
//   const [acceptedWork, setAcceptedWork] = useState(null);

//   // Queue search and filter state
//   const [queueSearch, setQueueSearch] = useState("");
//   const [queueStatus, setQueueStatus] = useState("all");
//   const [sortBy, setSortBy] = useState("priority");
//   const [selectedView, setSelectedView] = useState("all"); // all, new, need-tailor

//   // Load works when filter changes
//   useEffect(() => {
//     loadWorks();
//   }, [filter]);

//   // Load works with proper filter params
//   const loadWorks = async () => {
//     try {
//       let params = {};

//       if (filter === "assigned") {
//         params.hasTailor = "true";
//       } else if (filter === "unassigned") {
//         params.hasTailor = "false";
//         params.status = "accepted";
//       } else if (filter === "in-progress") {
//         params.status = [
//           "cutting-started",
//           "cutting-completed",
//           "sewing-started",
//           "sewing-completed",
//           "ironing",
//         ];
//       } else if (filter !== "all") {
//         params.status = filter;
//       }

//       await dispatch(fetchMyWorks(params)).unwrap();
//     } catch (error) {
//       showToast.error("Failed to load works");
//     }
//   };

//   const handleRefresh = () => {
//     loadWorks();
//     showToast.success("Data refreshed");
//   };

//   // Accept work
//   const handleAcceptWork = async (work) => {
//     setAcceptingId(work._id);

//     if (work.status !== "pending") {
//       showToast.info("This work is no longer available");
//       setAcceptingId(null);
//       loadWorks();
//       return;
//     }

//     if (!window.confirm("Accept this work? It will be assigned to you.")) {
//       setAcceptingId(null);
//       return;
//     }

//     try {
//       const result = await dispatch(acceptWorkById(work._id)).unwrap();

//       showToast.success("Work accepted successfully!");

//       setAcceptedWork({
//         ...work,
//         ...result.data,
//         assignedTo: user?.name,
//       });
//       setShowSuccessModal(true);

//       loadWorks();
//     } catch (error) {
//       console.error("❌ Accept failed:", error);

//       if (
//         error === "This work was already accepted by another cutting master"
//       ) {
//         showToast.error("This work was just taken by another cutting master");
//       } else {
//         showToast.error(error || "Failed to accept work");
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

//   // COMPLETE STATUS COLORS for all 8 statuses
//   const getStatusColor = (status) => {
//     const colors = {
//       pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
//       accepted: "bg-blue-100 text-blue-800 border-blue-200",
//       "cutting-started": "bg-purple-100 text-purple-800 border-purple-200",
//       "cutting-completed": "bg-indigo-100 text-indigo-800 border-indigo-200",
//       "sewing-started": "bg-pink-100 text-pink-800 border-pink-200",
//       "sewing-completed": "bg-teal-100 text-teal-800 border-teal-200",
//       ironing: "bg-orange-100 text-orange-800 border-orange-200",
//       "ready-to-deliver": "bg-green-100 text-green-800 border-green-200",
//     };
//     return colors[status] || "bg-gray-100 text-gray-800 border-gray-200";
//   };

//   // COMPLETE STATUS BADGES with icons
//   const getStatusBadge = (status) => {
//     const badges = {
//       pending: "⏳ Pending",
//       accepted: "✅ Accepted",
//       "cutting-started": "✂️ Cutting Started",
//       "cutting-completed": "✔️ Cutting Completed",
//       "sewing-started": "🧵 Sewing Started",
//       "sewing-completed": "🧵 Sewing Completed",
//       ironing: "🔥 Ironing",
//       "ready-to-deliver": "📦 Ready to Deliver",
//     };
//     return badges[status] || status;
//   };

//   const getStatusIcon = (status) => {
//     switch (status) {
//       case "pending":
//         return <Clock size={16} />;
//       case "accepted":
//         return <CheckCircle size={16} />;
//       case "cutting-started":
//         return <Scissors size={16} />;
//       case "cutting-completed":
//         return <Scissors size={16} />;
//       case "sewing-started":
//         return <Ruler size={16} />;
//       case "sewing-completed":
//         return <Ruler size={16} />;
//       case "ironing":
//         return <Truck size={16} />;
//       case "ready-to-deliver":
//         return <CheckCircle size={16} />;
//       default:
//         return <Briefcase size={16} />;
//     }
//   };

//   // Format date
//   const formatDate = (dateString) => {
//     if (!dateString) return "Not set";
//     return new Date(dateString).toLocaleDateString("en-GB", {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//     });
//   };

//   // Due status helper
//   const getDueStatus = (date) => {
//     if (!date)
//       return {
//         label: "No due date",
//         color: "text-gray-600",
//         icon: <Calendar className="w-4 h-4 text-gray-400" />,
//       };

//     const diff = new Date(date) - new Date();
//     const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

//     if (days === 0) {
//       return {
//         label: "Due Today 🚨",
//         color: "text-red-600 font-bold",
//         icon: <Bell className="w-4 h-4 text-red-500 animate-pulse" />,
//       };
//     }
//     if (days < 0) {
//       return {
//         label: `Overdue by ${Math.abs(days)} days ⚠️`,
//         color: "text-gray-900 font-bold",
//         icon: <AlertCircle className="w-4 h-4 text-gray-700" />,
//       };
//     }
//     if (days === 1) {
//       return {
//         label: "Due Tomorrow",
//         color: "text-orange-600",
//         icon: <Clock className="w-4 h-4 text-orange-500" />,
//       };
//     }
//     return {
//       label: `Due in ${days} days`,
//       color: "text-green-600",
//       icon: <Calendar className="w-4 h-4 text-green-500" />,
//     };
//   };

//   // Filter works based on current filter and search
//   const filteredWorks = useMemo(() => {
//     let filtered = works || [];

//     // Apply status filter from tabs
//     if (filter !== "all") {
//       if (filter === "assigned") {
//         filtered = filtered.filter(
//           (work) => work.tailor !== null && work.tailor !== undefined,
//         );
//       } else if (filter === "unassigned") {
//         filtered = filtered.filter(
//           (work) => work.status === "accepted" && !work.tailor,
//         );
//       } else if (filter === "in-progress") {
//         filtered = filtered.filter((work) =>
//           [
//             "cutting-started",
//             "cutting-completed",
//             "sewing-started",
//             "sewing-completed",
//             "ironing",
//           ].includes(work.status),
//         );
//       } else {
//         filtered = filtered.filter((work) => work.status === filter);
//       }
//     }

//     // Apply search
//     if (queueSearch) {
//       const searchTerm = queueSearch.toLowerCase().trim();
//       filtered = filtered.filter(
//         (item) =>
//           item.workId?.toLowerCase().includes(searchTerm) ||
//           item.garment?.garmentId?.toLowerCase().includes(searchTerm) ||
//           item.garment?.name?.toLowerCase().includes(searchTerm) ||
//           item.order?.customer?.name?.toLowerCase().includes(searchTerm) ||
//           item.order?.orderId?.toLowerCase().includes(searchTerm),
//       );
//     }

//     // Apply queue status filter
//     if (queueStatus !== "all") {
//       filtered = filtered.filter((item) => item.status === queueStatus);
//     }

//     return filtered;
//   }, [works, filter, queueSearch, queueStatus]);

//   // 🔥 FIXED: Priority sorting with due date - USING GARMENT PRIORITY
//   const prioritizedQueue = useMemo(() => {
//     if (!filteredWorks.length) return [];

//     return [...filteredWorks].sort((a, b) => {
//       // Helper function to get days difference (with null check)
//       const getDaysDiff = (date) => {
//         if (!date) return 999999; // No date = put at very end
//         const diff = new Date(date) - new Date();
//         return Math.ceil(diff / (1000 * 60 * 60 * 24));
//       };

//       const daysA = getDaysDiff(a.estimatedDelivery);
//       const daysB = getDaysDiff(b.estimatedDelivery);
      
//       // Priority weights (lower number = higher priority)
//       const priorityWeight = { 
//         high: 1, 
//         normal: 2, 
//         low: 3 
//       };

//       // ✅ FIX: Get priority from garment (not from order)
//       const aPriority = a.garment?.priority || 'normal';
//       const bPriority = b.garment?.priority || 'normal';

//       if (sortBy === "priority") {
//         // First sort by priority (high → normal → low)
//         if (priorityWeight[aPriority] !== priorityWeight[bPriority]) {
//           return priorityWeight[aPriority] - priorityWeight[bPriority];
//         }
//         // Then by due date (earliest first)
//         return daysA - daysB;
//       } 
//       else if (sortBy === "due") {
//         // First sort by due date (earliest first)
//         if (daysA !== daysB) {
//           return daysA - daysB;
//         }
//         // Then by priority (high → normal → low)
//         return priorityWeight[aPriority] - priorityWeight[bPriority];
//       }
      
//       return 0;
//     });
//   }, [filteredWorks, sortBy]);

//   // Stats calculations with Overdue
//   const stats = useMemo(() => {
//     const allWorks = works || [];
    
//     // Calculate overdue works
//     const overdueCount = allWorks.filter(w => {
//       if (!w.estimatedDelivery) return false;
//       const today = new Date();
//       const deliveryDate = new Date(w.estimatedDelivery);
//       const isOverdue = deliveryDate < today && 
//         !['ready-to-deliver', 'ironing'].includes(w.status);
//       return isOverdue;
//     }).length;
    
//     return {
//       totalWork: allWorks.length,
//       pendingWorks: allWorks.filter((w) => w.status === "pending").length,
//       acceptedWorks: allWorks.filter((w) => w.status === "accepted").length,
//       inProgressWorks: allWorks.filter((w) =>
//         [
//           "cutting-started",
//           "cutting-completed",
//           "sewing-started",
//           "sewing-completed",
//           "ironing",
//         ].includes(w.status),
//       ).length,
//       readyWorks: allWorks.filter((w) => w.status === "ready-to-deliver").length,
//       assignedCount: allWorks.filter((w) => w.tailor).length,
//       unassignedCount: allWorks.filter(
//         (w) => w.status === "accepted" && !w.tailor,
//       ).length,
//       overdueCount: overdueCount,
//     };
//   }, [works]);

//   // Status breakdown
//   const statusBreakdown = useMemo(() => {
//     const allWorks = works || [];
//     return [
//       {
//         status: "pending",
//         count: allWorks.filter((w) => w.status === "pending").length,
//         color: "bg-yellow-500",
//       },
//       {
//         status: "accepted",
//         count: allWorks.filter((w) => w.status === "accepted").length,
//         color: "bg-blue-500",
//       },
//       {
//         status: "cutting-started",
//         count: allWorks.filter((w) => w.status === "cutting-started").length,
//         color: "bg-purple-500",
//       },
//       {
//         status: "cutting-completed",
//         count: allWorks.filter((w) => w.status === "cutting-completed").length,
//         color: "bg-indigo-500",
//       },
//       {
//         status: "sewing-started",
//         count: allWorks.filter((w) => w.status === "sewing-started").length,
//         color: "bg-pink-500",
//       },
//       {
//         status: "sewing-completed",
//         count: allWorks.filter((w) => w.status === "sewing-completed").length,
//         color: "bg-teal-500",
//       },
//       {
//         status: "ironing",
//         count: allWorks.filter((w) => w.status === "ironing").length,
//         color: "bg-orange-500",
//       },
//       {
//         status: "ready-to-deliver",
//         count: allWorks.filter((w) => w.status === "ready-to-deliver").length,
//         color: "bg-green-500",
//       },
//     ];
//   }, [works]);

//   // Today's Due Works - FIXED with garment priority
//   const todayDueWorks = useMemo(() => {
//     const today = new Date();
//     const todayStr = today.toDateString();
    
//     return (works || [])
//       .filter(work => {
//         if (!work.estimatedDelivery) return false;
//         const workDate = new Date(work.estimatedDelivery);
//         return workDate.toDateString() === todayStr;
//       })
//       .sort((a, b) => {
//         const priorityWeight = { high: 1, normal: 2, low: 3 };
//         // ✅ FIX: Get priority from garment
//         const aPriority = a.garment?.priority || 'normal';
//         const bPriority = b.garment?.priority || 'normal';
        
//         if (priorityWeight[aPriority] !== priorityWeight[bPriority]) {
//           return priorityWeight[aPriority] - priorityWeight[bPriority];
//         }
        
//         const aTime = new Date(a.estimatedDelivery).getTime();
//         const bTime = new Date(b.estimatedDelivery).getTime();
//         return aTime - bTime;
//       });
//   }, [works]);

//   // Tomorrow's Due Works
//   const tomorrowDueWorks = useMemo(() => {
//     const tomorrow = new Date();
//     tomorrow.setDate(tomorrow.getDate() + 1);
//     const tomorrowStr = tomorrow.toDateString();
    
//     return (works || [])
//       .filter(work => {
//         if (!work.estimatedDelivery) return false;
//         const workDate = new Date(work.estimatedDelivery);
//         return workDate.toDateString() === tomorrowStr;
//       })
//       .sort((a, b) => {
//         const aTime = new Date(a.estimatedDelivery).getTime();
//         const bTime = new Date(b.estimatedDelivery).getTime();
//         return aTime - bTime;
//       });
//   }, [works]);

//   // Priority counts for today - FIXED with garment priority
//   const highPriorityToday = useMemo(() => 
//     todayDueWorks.filter(w => w.garment?.priority === 'high').length, 
//   [todayDueWorks]);

//   const normalPriorityToday = useMemo(() => 
//     todayDueWorks.filter(w => w.garment?.priority === 'normal' || !w.garment?.priority).length, 
//   [todayDueWorks]);

//   const lowPriorityToday = useMemo(() => 
//     todayDueWorks.filter(w => w.garment?.priority === 'low').length, 
//   [todayDueWorks]);

//   // Function to get priority display
//   const getPriorityDisplay = (work) => {
//     const priority = work.garment?.priority || 'normal';
//     if (priority === 'high') return '🔴 High';
//     if (priority === 'normal') return '🟠 Normal';
//     return '🟢 Low';
//   };

//   const getPriorityColor = (work) => {
//     const priority = work.garment?.priority || 'normal';
//     if (priority === 'high') return 'border-l-4 border-l-red-600 bg-red-50';
//     if (priority === 'normal') return 'border-l-4 border-l-orange-400 bg-orange-50';
//     return 'border-l-4 border-l-green-600 bg-green-50';
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 md:p-6">
//       {/* Header */}
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
//         <div>
//           <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
//             <Scissors className="w-8 h-8 text-purple-600" />
//             Cutting Master Work Queue
//           </h1>
//           <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
//             <span>Welcome back, {user?.name || "Cutting Master"}! 👋</span>
//             <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
//               {new Date().toLocaleDateString("en-IN", {
//                 weekday: "long",
//                 day: "numeric",
//                 month: "long",
//               })}
//             </span>
//           </p>
//         </div>

//         <button
//           onClick={handleRefresh}
//           className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center gap-2 shadow-sm"
//         >
//           <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
//           Refresh
//         </button>
//       </div>

//       {/* KPI Cards */}
//       <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-6">
//         {/* 1. Not Accepted - Pending */}
//         <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-gray-500">
//           <p className="text-xs text-gray-500 mb-1">⏳ Not Accepted</p>
//           <p className="text-2xl font-bold text-gray-800">
//             {stats.pendingWorks}
//           </p>
//           <p className="text-xs text-gray-400 mt-1">Pending</p>
//         </div>

//         {/* 2. Accepted */}
//         <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-blue-500">
//           <p className="text-xs text-gray-500 mb-1">✅ Accepted</p>
//           <p className="text-2xl font-bold text-blue-600">
//             {stats.acceptedWorks}
//           </p>
//           <p className="text-xs text-gray-400 mt-1">Accepted works</p>
//         </div>

//         {/* 3. In Progress */}
//         <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-purple-500">
//           <p className="text-xs text-gray-500 mb-1">⚙️ In Progress</p>
//           <p className="text-2xl font-bold text-purple-600">
//             {stats.inProgressWorks}
//           </p>
//           <p className="text-xs text-gray-400 mt-1">Cutting → Ironing</p>
//         </div>

//         {/* 4. Ready to Deliver */}
//         <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-green-500">
//           <p className="text-xs text-gray-500 mb-1">📦 Ready to Deliver</p>
//           <p className="text-2xl font-bold text-green-600">
//             {stats.readyWorks}
//           </p>
//           <p className="text-xs text-gray-400 mt-1">Ready for delivery</p>
//         </div>

//         {/* 5. Assigned to Tailor */}
//         <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-indigo-500">
//           <p className="text-xs text-gray-500 mb-1">👔 Assigned to Tailor</p>
//           <p className="text-2xl font-bold text-indigo-600">
//             {stats.assignedCount}
//           </p>
//           <p className="text-xs text-gray-400 mt-1">Tailor assigned</p>
//         </div>

//         {/* 6. Not Assigned (Need Tailor) */}
//         <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-orange-500">
//           <p className="text-xs text-gray-500 mb-1">⚠️ Not Assigned</p>
//           <p className="text-2xl font-bold text-orange-600">
//             {stats.unassignedCount}
//           </p>
//           <p className="text-xs text-gray-400 mt-1">Need tailor</p>
//         </div>

//         {/* 7. Overdue Works */}
//         <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-red-600">
//           <p className="text-xs text-gray-500 mb-1">🚨 Overdue</p>
//           <p className="text-2xl font-bold text-red-600">
//             {stats.overdueCount}
//           </p>
//           <p className="text-xs text-gray-400 mt-1">Past delivery date</p>
//         </div>

//         {/* 8. Total Works */}
//         <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-cyan-500">
//           <p className="text-xs text-gray-500 mb-1">📊 Total Works</p>
//           <p className="text-2xl font-bold text-cyan-600">{stats.totalWork}</p>
//           <p className="text-xs text-gray-400 mt-1">All works</p>
//         </div>
//       </div>

//       {/* Status Breakdown - Visual representation of all 8 statuses */}
//       <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
//         <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
//           <PieChart size={20} className="text-purple-600" />
//           Production Status Overview
//         </h2>

//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//           {statusBreakdown.map((item) => (
//             <div key={item.status} className="relative">
//               <div className="flex justify-between text-sm mb-1">
//                 <span className="text-gray-600 capitalize">
//                   {item.status.replace(/-/g, " ")}
//                 </span>
//                 <span className="font-bold text-gray-800">{item.count}</span>
//               </div>
//               <div className="w-full bg-gray-200 rounded-full h-2">
//                 <div
//                   className={`${item.color} h-2 rounded-full`}
//                   style={{
//                     width:
//                       stats.totalWork > 0
//                         ? `${(item.count / stats.totalWork) * 100}%`
//                         : "0%",
//                   }}
//                 />
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Today's Focus & Tomorrow's Prep */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//         {/* Today's Focus - Due Today Works */}
//         <div className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 rounded-xl p-6">
//           <div className="flex items-start justify-between mb-4">
//             <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-lg shadow-lg">
//               <Target className="w-6 h-6 text-white" />
//             </div>
            
//             {/* Modern Right Side */}
//             <div className="bg-white/80 backdrop-blur-sm rounded-lg p-2 shadow-sm">
//               <div className="flex items-center gap-3">
//                 {/* Date */}
//                 <div className="text-right">
//                   <p className="text-xs text-gray-500">Today</p>
//                   <p className="text-sm font-bold text-gray-800">
//                     {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
//                   </p>
//                 </div>
                
//                 {/* Divider */}
//                 <div className="w-px h-8 bg-red-200"></div>
                
//                 {/* Count */}
//                 <div className="text-center">
//                   <p className="text-xs text-gray-500">Due Today</p>
//                   <p className="text-xl font-bold text-red-600">{todayDueWorks.length}</p>
//                 </div>
                
//                 {/* Divider */}
//                 <div className="w-px h-8 bg-red-200"></div>
                
//                 {/* Priority Breakdown */}
//                 <div className="flex gap-2">
//                   <div className="text-center">
//                     <p className="text-xs text-red-600">🔴</p>
//                     <p className="text-sm font-bold text-gray-800">{highPriorityToday}</p>
//                   </div>
//                   <div className="text-center">
//                     <p className="text-xs text-orange-600">🟠</p>
//                     <p className="text-sm font-bold text-gray-800">{normalPriorityToday}</p>
//                   </div>
//                   <div className="text-center">
//                     <p className="text-xs text-green-600">🟢</p>
//                     <p className="text-sm font-bold text-gray-800">{lowPriorityToday}</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <h3 className="text-lg font-bold text-gray-800">Today's Deadline</h3>
//           <p className="text-sm text-red-600 mb-4">
//             {new Date().toLocaleDateString('en-IN', { 
//               day: 'numeric', 
//               month: 'long', 
//               year: 'numeric' 
//             })} - {todayDueWorks.length} items due
//           </p>

//           {/* Due Today Works List */}
//           <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
//             {todayDueWorks.length > 0 ? (
//               todayDueWorks.map((work) => {
//                 const priorityColor = getPriorityColor(work);
//                 const priorityText = getPriorityDisplay(work);
                
//                 return (
//                   <div
//                     key={work._id}
//                     onClick={() => navigate(`/cuttingmaster/works/${work._id}`)}
//                     className={`flex items-center justify-between p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer ${priorityColor}`}
//                   >
//                     <div className="flex-1">
//                       <div className="flex items-center gap-2 mb-1">
//                         <span className="font-mono text-xs font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded">
//                           #{work.workId}
//                         </span>
//                         <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
//                           {work.garment?.garmentId || 'N/A'}
//                         </span>
//                         <span className="text-xs font-medium">
//                           {priorityText}
//                         </span>
//                       </div>
//                       <p className="font-medium text-gray-800">
//                         {work.garment?.name || 'Unknown Garment'}
//                       </p>
//                       <p className="text-xs text-gray-500">
//                         👤 {work.order?.customer?.name || 'Unknown'} 
//                         {work.tailor && ` | 👔 Tailor: ${work.tailor.name}`}
//                       </p>
//                       {work.estimatedDelivery && (
//                         <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
//                           <Clock size={12} />
//                           Due by {new Date(work.estimatedDelivery).toLocaleTimeString('en-IN', { 
//                             hour: '2-digit', 
//                             minute: '2-digit' 
//                           })}
//                         </p>
//                       )}
//                     </div>
//                     <ChevronRight size={18} className="text-gray-400" />
//                   </div>
//                 );
//               })
//             ) : (
//               <div className="text-center py-8 bg-white/50 rounded-lg">
//                 <CheckCircle size={32} className="text-green-400 mx-auto mb-2" />
//                 <p className="text-sm text-gray-600">No works due today! 🎉</p>
//                 <p className="text-xs text-gray-400 mt-1">All caught up</p>
//               </div>
//             )}
//           </div>

//           {/* Summary Footer */}
//           {todayDueWorks.length > 0 && (
//             <div className="mt-4 pt-3 border-t border-red-200 flex justify-between items-center text-xs text-gray-600">
//               <div className="flex gap-3">
//                 <span>Total: <span className="font-bold text-gray-800">{todayDueWorks.length}</span></span>
//                 <span>🔴 High: <span className="font-bold text-red-600">{highPriorityToday}</span></span>
//                 <span>🟠 Normal: <span className="font-bold text-orange-600">{normalPriorityToday}</span></span>
//                 <span>🟢 Low: <span className="font-bold text-green-600">{lowPriorityToday}</span></span>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Tomorrow's Prep - Due Tomorrow Works */}
//         <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl p-6">
//           <div className="p-3 bg-blue-500 rounded-lg w-fit mb-4">
//             <Clock className="w-6 h-6 text-white" />
//           </div>

//           <h3 className="text-lg font-bold text-gray-800">Tomorrow's Preparation</h3>
//           <p className="text-sm text-blue-600 mb-4">
//             {new Date(Date.now() + 86400000).toLocaleDateString('en-IN', { 
//               day: 'numeric', 
//               month: 'short', 
//               year: 'numeric' 
//             })} - {tomorrowDueWorks.length} items due
//           </p>

//           {/* Due Tomorrow Works List */}
//           <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
//             {tomorrowDueWorks.length > 0 ? (
//               tomorrowDueWorks.map((work) => (
//                 <div
//                   key={work._id}
//                   onClick={() => navigate(`/cuttingmaster/works/${work._id}`)}
//                   className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer border-l-4 border-blue-400"
//                 >
//                   <div className="flex-1">
//                     <div className="flex items-center gap-2 mb-1">
//                       <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
//                         #{work.workId}
//                       </span>
//                       <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
//                         {work.garment?.garmentId || 'N/A'}
//                       </span>
//                       {work.garment?.priority === 'high' && (
//                         <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700">
//                           🔴 High
//                         </span>
//                       )}
//                     </div>
//                     <p className="font-medium text-gray-800">
//                       {work.garment?.name || 'Unknown Garment'}
//                     </p>
//                     <p className="text-xs text-gray-500">
//                       👤 {work.order?.customer?.name || 'Unknown'}
//                     </p>
//                   </div>
//                   <ChevronRight size={18} className="text-gray-400" />
//                 </div>
//               ))
//             ) : (
//               <div className="text-center py-8 bg-white/50 rounded-lg">
//                 <p className="text-sm text-gray-600">No items due tomorrow</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Production Queue with ALL 8 STATUSES */}
//       <div className="bg-white rounded-xl shadow-sm p-6">
//         <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
//           <div className="flex items-center gap-3">
//             <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
//               <Layers className="w-5 h-5 text-purple-600" />
//               Work Queue
//             </h2>
//             <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
//               {prioritizedQueue.length} items
//             </span>
//           </div>

//           <div className="flex flex-wrap gap-3">
//             {/* View Filters */}
//             <div className="flex bg-gray-100 rounded-lg p-1">
//               <button
//                 onClick={() => setSelectedView("all")}
//                 className={`px-3 py-1.5 text-xs rounded-md transition ${
//                   selectedView === "all"
//                     ? "bg-purple-600 text-white"
//                     : "text-gray-600 hover:bg-gray-200"
//                 }`}
//               >
//                 All ({stats.totalWork})
//               </button>
//               <button
//                 onClick={() => setSelectedView("new")}
//                 className={`px-3 py-1.5 text-xs rounded-md transition flex items-center gap-1 ${
//                   selectedView === "new"
//                     ? "bg-yellow-500 text-white"
//                     : "text-gray-600 hover:bg-gray-200"
//                 }`}
//               >
//                 <span>🆕 New / Not Accepted</span>
//                 <span
//                   className={`ml-1 px-1.5 py-0.5 text-xs rounded-full ${
//                     selectedView === "new"
//                       ? "bg-yellow-600 text-white"
//                       : "bg-yellow-100 text-yellow-700"
//                   }`}
//                 >
//                   {stats.pendingWorks}
//                 </span>
//               </button>
//               <button
//                 onClick={() => setSelectedView("need-tailor")}
//                 className={`px-3 py-1.5 text-xs rounded-md transition flex items-center gap-1 ${
//                   selectedView === "need-tailor"
//                     ? "bg-orange-500 text-white"
//                     : "text-gray-600 hover:bg-gray-200"
//                 }`}
//               >
//                 <span>👔 Need Tailor</span>
//                 <span
//                   className={`ml-1 px-1.5 py-0.5 text-xs rounded-full ${
//                     selectedView === "need-tailor"
//                       ? "bg-orange-600 text-white"
//                       : "bg-orange-100 text-orange-700"
//                   }`}
//                 >
//                   {stats.unassignedCount}
//                 </span>
//               </button>
//             </div>

//             {/* Search with placeholder showing all options */}
//             <div className="relative">
//               <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//               <input
//                 type="text"
//                 value={queueSearch}
//                 onChange={(e) => setQueueSearch(e.target.value)}
//                 placeholder="Search by Work ID, Garment ID or Customer..."
//                 className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 w-64"
//                 title="Search by Work ID (WRK-001), Garment ID (GRM-001) or Customer Name"
//               />
//               {queueSearch && (
//                 <button
//                   onClick={() => setQueueSearch("")}
//                   className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                 >
//                   <X size={16} />
//                 </button>
//               )}
//             </div>

//             {/* Status Filter - WITH ALL 8 STATUSES */}
//             <select
//               value={queueStatus}
//               onChange={(e) => setQueueStatus(e.target.value)}
//               className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
//             >
//               <option value="all">🔍 All Status</option>
//               <option value="pending">⏳ Pending</option>
//               <option value="accepted">✅ Accepted</option>
//               <option value="cutting-started">✂️ Cutting Started</option>
//               <option value="cutting-completed">✔️ Cutting Completed</option>
//               <option value="sewing-started">🧵 Sewing Started</option>
//               <option value="sewing-completed">🧵 Sewing Completed</option>
//               <option value="ironing">🔥 Ironing</option>
//               <option value="ready-to-deliver">📦 Ready to Deliver</option>
//             </select>

//             {/* Sort By */}
//             <select
//               value={sortBy}
//               onChange={(e) => setSortBy(e.target.value)}
//               className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
//             >
//               <option value="priority">Sort by Priority</option>
//               <option value="due">Sort by Due Date</option>
//             </select>
//           </div>
//         </div>

//         {/* Queue List - Showing ALL 8 statuses */}
//         {loading ? (
//           <div className="flex justify-center items-center h-64">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
//           </div>
//         ) : (
//           <div className="space-y-3 max-h-[800px] overflow-y-auto pr-2">
//             {prioritizedQueue
//               .filter((item) => {
//                 if (selectedView === "new") {
//                   return item.status === "pending";
//                 }
//                 if (selectedView === "need-tailor") {
//                   return item.status === "accepted" && !item.tailor;
//                 }
//                 return true;
//               })
//               .map((work) => {
//                 const dueStatus = getDueStatus(work.estimatedDelivery);
//                 // ✅ FIX: Get priority from garment
//                 const isHighPriority = work.garment?.priority === "high";

//                 return (
//                   <div
//                     key={work._id}
//                     className={`border-2 rounded-lg p-4 transition-all hover:shadow-md ${getStatusColor(work.status)} ${
//                       isHighPriority ? "border-l-8 border-l-red-500" : ""
//                     }`}
//                   >
//                     <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
//                       <div className="flex-1">
//                         {/* Top Row */}
//                         <div className="flex items-center gap-2 mb-2 flex-wrap">
//                           <span className="font-mono text-sm font-bold text-purple-600 bg-white px-2 py-1 rounded">
//                             #{work.workId}
//                           </span>
//                           <span
//                             className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(work.status)}`}
//                           >
//                             {getStatusBadge(work.status)}
//                           </span>
//                           {isHighPriority && (
//                             <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full flex items-center gap-1">
//                               <Flag size={10} /> High Priority
//                             </span>
//                           )}
//                         </div>

//                         <h3 className="font-bold text-gray-800 text-lg mb-1">
//                           {work.garment?.name || "N/A"}
//                         </h3>

//                         <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
//                           <div className="flex items-center gap-1">
//                             <User size={14} className="text-gray-400" />
//                             <span>
//                               {work.order?.customer?.name || "Unknown"}
//                             </span>
//                           </div>

//                           <div
//                             className={`flex items-center gap-1 ${dueStatus.color}`}
//                           >
//                             {dueStatus.icon}
//                             <span>{dueStatus.label}</span>
//                           </div>

//                           <div className="flex items-center gap-1">
//                             <Package size={14} className="text-purple-500" />
//                             <span>
//                               Garment: {work.garment?.garmentId || "N/A"}
//                             </span>
//                           </div>

//                           {work.tailor && (
//                             <div className="flex items-center gap-1">
//                               <UserCheck size={14} className="text-green-500" />
//                               <span>Tailor: {work.tailor.name}</span>
//                             </div>
//                           )}
//                         </div>
//                       </div>

//                       {/* Action Buttons */}
//                       {work.status === "pending" ? (
//                         <button
//                           onClick={() => handleAcceptWork(work)}
//                           disabled={acceptingId === work._id}
//                           className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
//                             acceptingId === work._id
//                               ? "bg-gray-400 cursor-not-allowed text-white"
//                               : "bg-green-600 hover:bg-green-700 text-white"
//                           }`}
//                         >
//                           {acceptingId === work._id ? (
//                             <>
//                               <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                               Processing...
//                             </>
//                           ) : (
//                             <>
//                               <CheckCircle size={16} />
//                               Accept
//                             </>
//                           )}
//                         </button>
//                       ) : work.status === "accepted" && !work.tailor ? (
//                         <div className="flex gap-2">
//                           <button
//                             onClick={() => handleViewWork(work._id)}
//                             className="px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition flex items-center gap-1"
//                           >
//                             <Eye size={14} /> View
//                           </button>
//                           <button
//                             onClick={() => handleAssignTailor(work._id)}
//                             className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center gap-1"
//                           >
//                             <UserPlus size={14} /> Assign
//                           </button>
//                         </div>
//                       ) : (
//                         <button
//                           onClick={() => handleViewWork(work._id)}
//                           className="px-3 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition flex items-center gap-1"
//                         >
//                           <Eye size={14} /> Details
//                         </button>
//                       )}
//                     </div>
//                   </div>
//                 );
//               })}

//             {prioritizedQueue.length === 0 && (
//               <div className="text-center py-12 text-gray-500">
//                 <Scissors className="w-12 h-12 text-gray-300 mx-auto mb-3" />
//                 <p className="font-medium">No items in work queue</p>
//                 <p className="text-sm text-gray-400 mt-1">
//                   Try adjusting your filters
//                 </p>
//               </div>
//             )}
//           </div>
//         )}
//       </div>

//       {/* Pagination */}
//       {pagination?.pages > 1 && (
//         <div className="mt-6 flex items-center justify-center gap-2">
//           <button
//             onClick={() => dispatch(setFilters({ page: pagination.page - 1 }))}
//             disabled={pagination.page === 1}
//             className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
//           >
//             <ChevronLeft size={18} />
//           </button>
//           <span className="px-4 py-2 bg-purple-50 text-purple-600 rounded-lg">
//             Page {pagination.page} of {pagination.pages}
//           </span>
//           <button
//             onClick={() => dispatch(setFilters({ page: pagination.page + 1 }))}
//             disabled={pagination.page === pagination.pages}
//             className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
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

//             <h2 className="text-xl font-bold text-center mb-2">
//               Work Accepted Successfully!
//             </h2>

//             <div className="bg-green-50 p-4 rounded-lg mb-4">
//               <p className="text-sm text-green-700 mb-2">
//                 This work is now assigned to:
//               </p>
//               <p className="font-bold text-lg text-green-800">
//                 {acceptedWork.assignedTo}
//               </p>
//               <p className="text-xs text-green-600 mt-1">
//                 Work ID: {acceptedWork.workId}
//               </p>
//             </div>

//             <div className="flex gap-3">
//               <button
//                 onClick={() => {
//                   setShowSuccessModal(false);
//                   navigate(
//                     `/cuttingmaster/works/${acceptedWork._id}?assign=true`,
//                   );
//                 }}
//                 className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
//               >
//                 Assign Tailor Now
//               </button>
//               <button
//                 onClick={() => setShowSuccessModal(false)}
//                 className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
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
import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
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
  User,
  Search,
  Filter,
  Flag,
  Bell,
  Activity,
  Target,
  TrendingUp,
  PieChart,
  Layers,
  Download,
  Zap,
  UserCheck,
  BarChart3,
  PlusCircle,
} from "lucide-react";
import {
  fetchMyWorks,
  acceptWorkById,
  selectMyWorks,
  selectWorkPagination,
  selectWorkLoading,
  setFilters,
} from "../../features/work/workSlice";
import showToast from "../../utils/toast";

export default function CuttingMasterWorks() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const works = useSelector(selectMyWorks);
  const pagination = useSelector(selectWorkPagination);
  const loading = useSelector(selectWorkLoading);
  const { user } = useSelector((state) => state.auth);

  // State
  const [filter, setFilter] = useState("all");
  const [acceptingId, setAcceptingId] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [acceptedWork, setAcceptedWork] = useState(null);

  // Queue search and filter state
  const [queueSearch, setQueueSearch] = useState("");
  const [queueStatus, setQueueStatus] = useState("all");
  const [sortBy, setSortBy] = useState("priority");
  const [selectedView, setSelectedView] = useState("all"); // all, new, need-tailor

  // 🔍 DEBUG: Log when sortBy changes
  useEffect(() => {
    console.log("%c🔍 SORT OPTION CHANGED TO:", "background: purple; color: white; font-size: 12px", sortBy);
  }, [sortBy]);

  // Load works when filter changes
  useEffect(() => {
    loadWorks();
  }, [filter]);

  // 🔍 DEBUG: Log when works are loaded
  useEffect(() => {
    if (works && works.length > 0) {
      console.log("%c📦 WORKS LOADED:", "background: blue; color: white; font-size: 12px", works.length);
      console.log("First work sample:", {
        workId: works[0].workId,
        garmentPriority: works[0].garment?.priority,
        estimatedDelivery: works[0].estimatedDelivery,
        status: works[0].status
      });
      
      // Log all priorities
      const priorities = works.map(w => ({
        id: w.workId,
        priority: w.garment?.priority || 'normal'
      }));
      console.log("📋 All priorities:", priorities);
    }
  }, [works]);

  // Load works with proper filter params
  const loadWorks = async () => {
    try {
      let params = {};

      if (filter === "assigned") {
        params.hasTailor = "true";
      } else if (filter === "unassigned") {
        params.hasTailor = "false";
        params.status = "accepted";
      } else if (filter === "in-progress") {
        params.status = [
          "cutting-started",
          "cutting-completed",
          "sewing-started",
          "sewing-completed",
          "ironing",
        ];
      } else if (filter !== "all") {
        params.status = filter;
      }

      console.log("🔍 Loading works with params:", params);
      await dispatch(fetchMyWorks(params)).unwrap();
    } catch (error) {
      showToast.error("Failed to load works");
    }
  };

  const handleRefresh = () => {
    loadWorks();
    showToast.success("Data refreshed");
  };

  // Accept work
  const handleAcceptWork = async (work) => {
    setAcceptingId(work._id);

    if (work.status !== "pending") {
      showToast.info("This work is no longer available");
      setAcceptingId(null);
      loadWorks();
      return;
    }

    if (!window.confirm("Accept this work? It will be assigned to you.")) {
      setAcceptingId(null);
      return;
    }

    try {
      const result = await dispatch(acceptWorkById(work._id)).unwrap();

      showToast.success("Work accepted successfully!");

      setAcceptedWork({
        ...work,
        ...result.data,
        assignedTo: user?.name,
      });
      setShowSuccessModal(true);

      loadWorks();
    } catch (error) {
      console.error("❌ Accept failed:", error);

      if (
        error === "This work was already accepted by another cutting master"
      ) {
        showToast.error("This work was just taken by another cutting master");
      } else {
        showToast.error(error || "Failed to accept work");
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

  // COMPLETE STATUS COLORS for all 8 statuses
  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      accepted: "bg-blue-100 text-blue-800 border-blue-200",
      "cutting-started": "bg-purple-100 text-purple-800 border-purple-200",
      "cutting-completed": "bg-indigo-100 text-indigo-800 border-indigo-200",
      "sewing-started": "bg-pink-100 text-pink-800 border-pink-200",
      "sewing-completed": "bg-teal-100 text-teal-800 border-teal-200",
      ironing: "bg-orange-100 text-orange-800 border-orange-200",
      "ready-to-deliver": "bg-green-100 text-green-800 border-green-200",
    };
    return colors[status] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  // COMPLETE STATUS BADGES with icons
  const getStatusBadge = (status) => {
    const badges = {
      pending: "⏳ Pending",
      accepted: "✅ Accepted",
      "cutting-started": "✂️ Cutting Started",
      "cutting-completed": "✔️ Cutting Completed",
      "sewing-started": "🧵 Sewing Started",
      "sewing-completed": "🧵 Sewing Completed",
      ironing: "🔥 Ironing",
      "ready-to-deliver": "📦 Ready to Deliver",
    };
    return badges[status] || status;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock size={16} />;
      case "accepted":
        return <CheckCircle size={16} />;
      case "cutting-started":
        return <Scissors size={16} />;
      case "cutting-completed":
        return <Scissors size={16} />;
      case "sewing-started":
        return <Ruler size={16} />;
      case "sewing-completed":
        return <Ruler size={16} />;
      case "ironing":
        return <Truck size={16} />;
      case "ready-to-deliver":
        return <CheckCircle size={16} />;
      default:
        return <Briefcase size={16} />;
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Due status helper
  const getDueStatus = (date) => {
    if (!date)
      return {
        label: "No due date",
        color: "text-gray-600",
        icon: <Calendar className="w-4 h-4 text-gray-400" />,
      };

    const diff = new Date(date) - new Date();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return {
        label: "Due Today 🚨",
        color: "text-red-600 font-bold",
        icon: <Bell className="w-4 h-4 text-red-500 animate-pulse" />,
      };
    }
    if (days < 0) {
      return {
        label: `Overdue by ${Math.abs(days)} days ⚠️`,
        color: "text-gray-900 font-bold",
        icon: <AlertCircle className="w-4 h-4 text-gray-700" />,
      };
    }
    if (days === 1) {
      return {
        label: "Due Tomorrow",
        color: "text-orange-600",
        icon: <Clock className="w-4 h-4 text-orange-500" />,
      };
    }
    return {
      label: `Due in ${days} days`,
      color: "text-green-600",
      icon: <Calendar className="w-4 h-4 text-green-500" />,
    };
  };

  // Filter works based on current filter and search
  const filteredWorks = useMemo(() => {
    console.log("%c🔍 FILTERING WORKS", "background: orange; color: white; font-size: 12px");
    console.log("Filter params:", { filter, queueSearch, queueStatus, selectedView });
    
    let filtered = works || [];

    // Apply status filter from tabs
    if (filter !== "all") {
      if (filter === "assigned") {
        filtered = filtered.filter(
          (work) => work.tailor !== null && work.tailor !== undefined,
        );
      } else if (filter === "unassigned") {
        filtered = filtered.filter(
          (work) => work.status === "accepted" && !work.tailor,
        );
      } else if (filter === "in-progress") {
        filtered = filtered.filter((work) =>
          [
            "cutting-started",
            "cutting-completed",
            "sewing-started",
            "sewing-completed",
            "ironing",
          ].includes(work.status),
        );
      } else {
        filtered = filtered.filter((work) => work.status === filter);
      }
    }

    // Apply search
    if (queueSearch) {
      const searchTerm = queueSearch.toLowerCase().trim();
      filtered = filtered.filter(
        (item) =>
          item.workId?.toLowerCase().includes(searchTerm) ||
          item.garment?.garmentId?.toLowerCase().includes(searchTerm) ||
          item.garment?.name?.toLowerCase().includes(searchTerm) ||
          item.order?.customer?.name?.toLowerCase().includes(searchTerm) ||
          item.order?.orderId?.toLowerCase().includes(searchTerm),
      );
    }

    // Apply queue status filter
    if (queueStatus !== "all") {
      filtered = filtered.filter((item) => item.status === queueStatus);
    }

    // Apply view filter
    if (selectedView === "new") {
      filtered = filtered.filter((item) => item.status === "pending");
    }
    if (selectedView === "need-tailor") {
      filtered = filtered.filter(
        (item) => item.status === "accepted" && !item.tailor,
      );
    }

    console.log(`✅ After filtering: ${filtered.length} works`);
    return filtered;
  }, [works, filter, queueSearch, queueStatus, selectedView]);

  // 🔥 DEBUG SORTING LOGIC - Shows each comparison
  const prioritizedQueue = useMemo(() => {
    if (!filteredWorks.length) {
      console.log("⚠️ No works to sort");
      return [];
    }

    console.log(`\n%c🔍 SORTING BY: ${sortBy === "priority" ? "PRIORITY" : "DUE DATE"}`, "background: purple; color: white; font-size: 14px");
    console.log(`📊 Total works to sort: ${filteredWorks.length}`);
    
    // Log works before sorting
    console.log("📋 Works BEFORE sorting:");
    filteredWorks.slice(0, 5).forEach((w, i) => {
      console.log(`  ${i+1}. ${w.workId} - Priority: ${w.garment?.priority || 'normal'}, Due: ${w.estimatedDelivery || 'No date'}`);
    });

    const sorted = [...filteredWorks].sort((a, b) => {
      // Priority weights
      const priorityWeight = { high: 1, normal: 2, low: 3 };
      
      const aPri = priorityWeight[a.garment?.priority] || 2;
      const bPri = priorityWeight[b.garment?.priority] || 2;

      const dateA = a.estimatedDelivery ? new Date(a.estimatedDelivery).getTime() : 9999999999999;
      const dateB = b.estimatedDelivery ? new Date(b.estimatedDelivery).getTime() : 9999999999999;

      const aDateStr = a.estimatedDelivery ? new Date(a.estimatedDelivery).toLocaleDateString() : 'No date';
      const bDateStr = b.estimatedDelivery ? new Date(b.estimatedDelivery).toLocaleDateString() : 'No date';

      console.log(`\nComparing:`, {
        a: `${a.workId} (${a.garment?.priority || 'normal'}, ${aDateStr})`,
        b: `${b.workId} (${b.garment?.priority || 'normal'}, ${bDateStr})`,
        aPri, bPri,
        dateA, dateB
      });

      if (sortBy === "priority") {
        // Sort by priority first
        if (aPri !== bPri) {
          const result = aPri - bPri;
          console.log(`  → Priority diff: ${result} (${result < 0 ? 'A comes first' : 'B comes first'})`);
          return result;
        }
        // Then by due date
        const result = dateA - dateB;
        console.log(`  → Same priority, due date diff: ${result} (${result < 0 ? 'A earlier' : result > 0 ? 'B earlier' : 'same'})`);
        return result;
      } 
      else {
        // Sort by due date first
        if (dateA !== dateB) {
          const result = dateA - dateB;
          console.log(`  → Due date diff: ${result} (${result < 0 ? 'A earlier' : 'B earlier'})`);
          return result;
        }
        // Then by priority
        const result = aPri - bPri;
        console.log(`  → Same due date, priority diff: ${result} (${result < 0 ? 'A higher priority' : result > 0 ? 'B higher priority' : 'same'})`);
        return result;
      }
    });

    // Log sorted order
    console.log("\n✅ SORTED ORDER (first 5):");
    sorted.slice(0, 5).forEach((work, i) => {
      console.log(`  ${i+1}. ${work.workId} - Priority: ${work.garment?.priority || 'normal'}, Due: ${work.estimatedDelivery || 'No date'}`);
    });

    return sorted;
  }, [filteredWorks, sortBy]);

  // Stats calculations with Overdue
  const stats = useMemo(() => {
    const allWorks = works || [];
    
    // Calculate overdue works
    const overdueCount = allWorks.filter(w => {
      if (!w.estimatedDelivery) return false;
      const today = new Date();
      const deliveryDate = new Date(w.estimatedDelivery);
      const isOverdue = deliveryDate < today && 
        !['ready-to-deliver', 'ironing'].includes(w.status);
      return isOverdue;
    }).length;
    
    return {
      totalWork: allWorks.length,
      pendingWorks: allWorks.filter((w) => w.status === "pending").length,
      acceptedWorks: allWorks.filter((w) => w.status === "accepted").length,
      inProgressWorks: allWorks.filter((w) =>
        [
          "cutting-started",
          "cutting-completed",
          "sewing-started",
          "sewing-completed",
          "ironing",
        ].includes(w.status),
      ).length,
      readyWorks: allWorks.filter((w) => w.status === "ready-to-deliver").length,
      assignedCount: allWorks.filter((w) => w.tailor).length,
      unassignedCount: allWorks.filter(
        (w) => w.status === "accepted" && !w.tailor,
      ).length,
      overdueCount: overdueCount,
    };
  }, [works]);

  // Status breakdown
  const statusBreakdown = useMemo(() => {
    const allWorks = works || [];
    return [
      {
        status: "pending",
        count: allWorks.filter((w) => w.status === "pending").length,
        color: "bg-yellow-500",
      },
      {
        status: "accepted",
        count: allWorks.filter((w) => w.status === "accepted").length,
        color: "bg-blue-500",
      },
      {
        status: "cutting-started",
        count: allWorks.filter((w) => w.status === "cutting-started").length,
        color: "bg-purple-500",
      },
      {
        status: "cutting-completed",
        count: allWorks.filter((w) => w.status === "cutting-completed").length,
        color: "bg-indigo-500",
      },
      {
        status: "sewing-started",
        count: allWorks.filter((w) => w.status === "sewing-started").length,
        color: "bg-pink-500",
      },
      {
        status: "sewing-completed",
        count: allWorks.filter((w) => w.status === "sewing-completed").length,
        color: "bg-teal-500",
      },
      {
        status: "ironing",
        count: allWorks.filter((w) => w.status === "ironing").length,
        color: "bg-orange-500",
      },
      {
        status: "ready-to-deliver",
        count: allWorks.filter((w) => w.status === "ready-to-deliver").length,
        color: "bg-green-500",
      },
    ];
  }, [works]);

  // Today's Due Works
  const todayDueWorks = useMemo(() => {
    const today = new Date();
    const todayStr = today.toDateString();
    
    return (works || [])
      .filter(work => {
        if (!work.estimatedDelivery) return false;
        const workDate = new Date(work.estimatedDelivery);
        return workDate.toDateString() === todayStr;
      })
      .sort((a, b) => {
        const priorityWeight = { high: 1, normal: 2, low: 3 };
        const aPriority = a.garment?.priority || 'normal';
        const bPriority = b.garment?.priority || 'normal';
        
        if (priorityWeight[aPriority] !== priorityWeight[bPriority]) {
          return priorityWeight[aPriority] - priorityWeight[bPriority];
        }
        
        const aTime = new Date(a.estimatedDelivery).getTime();
        const bTime = new Date(b.estimatedDelivery).getTime();
        return aTime - bTime;
      });
  }, [works]);

  // Tomorrow's Due Works
  const tomorrowDueWorks = useMemo(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toDateString();
    
    return (works || [])
      .filter(work => {
        if (!work.estimatedDelivery) return false;
        const workDate = new Date(work.estimatedDelivery);
        return workDate.toDateString() === tomorrowStr;
      })
      .sort((a, b) => {
        const aTime = new Date(a.estimatedDelivery).getTime();
        const bTime = new Date(b.estimatedDelivery).getTime();
        return aTime - bTime;
      });
  }, [works]);

  // Priority counts for today
  const highPriorityToday = useMemo(() => 
    todayDueWorks.filter(w => w.garment?.priority === 'high').length, 
  [todayDueWorks]);

  const normalPriorityToday = useMemo(() => 
    todayDueWorks.filter(w => w.garment?.priority === 'normal' || !w.garment?.priority).length, 
  [todayDueWorks]);

  const lowPriorityToday = useMemo(() => 
    todayDueWorks.filter(w => w.garment?.priority === 'low').length, 
  [todayDueWorks]);

  // Function to get priority display
  const getPriorityDisplay = (work) => {
    const priority = work.garment?.priority || 'normal';
    if (priority === 'high') return '🔴 High';
    if (priority === 'normal') return '🟠 Normal';
    return '🟢 Low';
  };

  const getPriorityColor = (work) => {
    const priority = work.garment?.priority || 'normal';
    if (priority === 'high') return 'border-l-4 border-l-red-600 bg-red-50';
    if (priority === 'normal') return 'border-l-4 border-l-orange-400 bg-orange-50';
    return 'border-l-4 border-l-green-600 bg-green-50';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
            <Scissors className="w-8 h-8 text-purple-600" />
            Cutting Master Work Queue
          </h1>
          <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
            <span>Welcome back, {user?.name || "Cutting Master"}! 👋</span>
            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
              {new Date().toLocaleDateString("en-IN", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </span>
          </p>
        </div>

        <button
          onClick={handleRefresh}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center gap-2 shadow-sm"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-6">
        {/* 1. Not Accepted - Pending */}
        <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-gray-500">
          <p className="text-xs text-gray-500 mb-1">⏳ Not Accepted</p>
          <p className="text-2xl font-bold text-gray-800">
            {stats.pendingWorks}
          </p>
          <p className="text-xs text-gray-400 mt-1">Pending</p>
        </div>

        {/* 2. Accepted */}
        <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-blue-500">
          <p className="text-xs text-gray-500 mb-1">✅ Accepted</p>
          <p className="text-2xl font-bold text-blue-600">
            {stats.acceptedWorks}
          </p>
          <p className="text-xs text-gray-400 mt-1">Accepted works</p>
        </div>

        {/* 3. In Progress */}
        <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-purple-500">
          <p className="text-xs text-gray-500 mb-1">⚙️ In Progress</p>
          <p className="text-2xl font-bold text-purple-600">
            {stats.inProgressWorks}
          </p>
          <p className="text-xs text-gray-400 mt-1">Cutting → Ironing</p>
        </div>

        {/* 4. Ready to Deliver */}
        <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-green-500">
          <p className="text-xs text-gray-500 mb-1">📦 Ready to Deliver</p>
          <p className="text-2xl font-bold text-green-600">
            {stats.readyWorks}
          </p>
          <p className="text-xs text-gray-400 mt-1">Ready for delivery</p>
        </div>

        {/* 5. Assigned to Tailor */}
        <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-indigo-500">
          <p className="text-xs text-gray-500 mb-1">👔 Assigned to Tailor</p>
          <p className="text-2xl font-bold text-indigo-600">
            {stats.assignedCount}
          </p>
          <p className="text-xs text-gray-400 mt-1">Tailor assigned</p>
        </div>

        {/* 6. Not Assigned (Need Tailor) */}
        <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-orange-500">
          <p className="text-xs text-gray-500 mb-1">⚠️ Not Assigned</p>
          <p className="text-2xl font-bold text-orange-600">
            {stats.unassignedCount}
          </p>
          <p className="text-xs text-gray-400 mt-1">Need tailor</p>
        </div>

        {/* 7. Overdue Works */}
        <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-red-600">
          <p className="text-xs text-gray-500 mb-1">🚨 Overdue</p>
          <p className="text-2xl font-bold text-red-600">
            {stats.overdueCount}
          </p>
          <p className="text-xs text-gray-400 mt-1">Past delivery date</p>
        </div>

        {/* 8. Total Works */}
        <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-cyan-500">
          <p className="text-xs text-gray-500 mb-1">📊 Total Works</p>
          <p className="text-2xl font-bold text-cyan-600">{stats.totalWork}</p>
          <p className="text-xs text-gray-400 mt-1">All works</p>
        </div>
      </div>

      {/* Status Breakdown */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <PieChart size={20} className="text-purple-600" />
          Production Status Overview
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statusBreakdown.map((item) => (
            <div key={item.status} className="relative">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 capitalize">
                  {item.status.replace(/-/g, " ")}
                </span>
                <span className="font-bold text-gray-800">{item.count}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`${item.color} h-2 rounded-full`}
                  style={{
                    width:
                      stats.totalWork > 0
                        ? `${(item.count / stats.totalWork) * 100}%`
                        : "0%",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Today's Focus & Tomorrow's Prep */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Today's Focus */}
        <div className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 rounded-xl p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-lg shadow-lg">
              <Target className="w-6 h-6 text-white" />
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-2 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-xs text-gray-500">Today</p>
                  <p className="text-sm font-bold text-gray-800">
                    {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </p>
                </div>
                
                <div className="w-px h-8 bg-red-200"></div>
                
                <div className="text-center">
                  <p className="text-xs text-gray-500">Due Today</p>
                  <p className="text-xl font-bold text-red-600">{todayDueWorks.length}</p>
                </div>
                
                <div className="w-px h-8 bg-red-200"></div>
                
                <div className="flex gap-2">
                  <div className="text-center">
                    <p className="text-xs text-red-600">🔴</p>
                    <p className="text-sm font-bold text-gray-800">{highPriorityToday}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-orange-600">🟠</p>
                    <p className="text-sm font-bold text-gray-800">{normalPriorityToday}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-green-600">🟢</p>
                    <p className="text-sm font-bold text-gray-800">{lowPriorityToday}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <h3 className="text-lg font-bold text-gray-800">Today's Deadline</h3>
          <p className="text-sm text-red-600 mb-4">
            {new Date().toLocaleDateString('en-IN', { 
              day: 'numeric', 
              month: 'long', 
              year: 'numeric' 
            })} - {todayDueWorks.length} items due
          </p>

          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
            {todayDueWorks.length > 0 ? (
              todayDueWorks.map((work) => {
                const priorityColor = getPriorityColor(work);
                const priorityText = getPriorityDisplay(work);
                
                return (
                  <div
                    key={work._id}
                    onClick={() => navigate(`/cuttingmaster/works/${work._id}`)}
                    className={`flex items-center justify-between p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer ${priorityColor}`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded">
                          #{work.workId}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                          {work.garment?.garmentId || 'N/A'}
                        </span>
                        <span className="text-xs font-medium">
                          {priorityText}
                        </span>
                      </div>
                      <p className="font-medium text-gray-800">
                        {work.garment?.name || 'Unknown Garment'}
                      </p>
                      <p className="text-xs text-gray-500">
                        👤 {work.order?.customer?.name || 'Unknown'} 
                        {work.tailor && ` | 👔 Tailor: ${work.tailor.name}`}
                      </p>
                      {work.estimatedDelivery && (
                        <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                          <Clock size={12} />
                          Due by {new Date(work.estimatedDelivery).toLocaleTimeString('en-IN', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      )}
                    </div>
                    <ChevronRight size={18} className="text-gray-400" />
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 bg-white/50 rounded-lg">
                <CheckCircle size={32} className="text-green-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">No works due today! 🎉</p>
                <p className="text-xs text-gray-400 mt-1">All caught up</p>
              </div>
            )}
          </div>
        </div>

        {/* Tomorrow's Prep */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl p-6">
          <div className="p-3 bg-blue-500 rounded-lg w-fit mb-4">
            <Clock className="w-6 h-6 text-white" />
          </div>

          <h3 className="text-lg font-bold text-gray-800">Tomorrow's Preparation</h3>
          <p className="text-sm text-blue-600 mb-4">
            {new Date(Date.now() + 86400000).toLocaleDateString('en-IN', { 
              day: 'numeric', 
              month: 'short', 
              year: 'numeric' 
            })} - {tomorrowDueWorks.length} items due
          </p>

          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
            {tomorrowDueWorks.length > 0 ? (
              tomorrowDueWorks.map((work) => (
                <div
                  key={work._id}
                  onClick={() => navigate(`/cuttingmaster/works/${work._id}`)}
                  className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer border-l-4 border-blue-400"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                        #{work.workId}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                        {work.garment?.garmentId || 'N/A'}
                      </span>
                      {work.garment?.priority === 'high' && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                          🔴 High
                        </span>
                      )}
                    </div>
                    <p className="font-medium text-gray-800">
                      {work.garment?.name || 'Unknown Garment'}
                    </p>
                    <p className="text-xs text-gray-500">
                      👤 {work.order?.customer?.name || 'Unknown'}
                    </p>
                  </div>
                  <ChevronRight size={18} className="text-gray-400" />
                </div>
              ))
            ) : (
              <div className="text-center py-8 bg-white/50 rounded-lg">
                <p className="text-sm text-gray-600">No items due tomorrow</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Production Queue */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Layers className="w-5 h-5 text-purple-600" />
              Work Queue
            </h2>
            <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
              {prioritizedQueue.length} items
            </span>
          </div>

          <div className="flex flex-wrap gap-3">
            {/* View Filters */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setSelectedView("all")}
                className={`px-3 py-1.5 text-xs rounded-md transition ${
                  selectedView === "all"
                    ? "bg-purple-600 text-white"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                All ({stats.totalWork})
              </button>
              <button
                onClick={() => setSelectedView("new")}
                className={`px-3 py-1.5 text-xs rounded-md transition flex items-center gap-1 ${
                  selectedView === "new"
                    ? "bg-yellow-500 text-white"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                <span>🆕 New / Not Accepted</span>
                <span
                  className={`ml-1 px-1.5 py-0.5 text-xs rounded-full ${
                    selectedView === "new"
                      ? "bg-yellow-600 text-white"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {stats.pendingWorks}
                </span>
              </button>
              <button
                onClick={() => setSelectedView("need-tailor")}
                className={`px-3 py-1.5 text-xs rounded-md transition flex items-center gap-1 ${
                  selectedView === "need-tailor"
                    ? "bg-orange-500 text-white"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                <span>👔 Need Tailor</span>
                <span
                  className={`ml-1 px-1.5 py-0.5 text-xs rounded-full ${
                    selectedView === "need-tailor"
                      ? "bg-orange-600 text-white"
                      : "bg-orange-100 text-orange-700"
                  }`}
                >
                  {stats.unassignedCount}
                </span>
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={queueSearch}
                onChange={(e) => setQueueSearch(e.target.value)}
                placeholder="Search by Work ID, Garment ID or Customer..."
                className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 w-64"
              />
              {queueSearch && (
                <button
                  onClick={() => setQueueSearch("")}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Status Filter */}
            <select
              value={queueStatus}
              onChange={(e) => setQueueStatus(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">🔍 All Status</option>
              <option value="pending">⏳ Pending</option>
              <option value="accepted">✅ Accepted</option>
              <option value="cutting-started">✂️ Cutting Started</option>
              <option value="cutting-completed">✔️ Cutting Completed</option>
              <option value="sewing-started">🧵 Sewing Started</option>
              <option value="sewing-completed">🧵 Sewing Completed</option>
              <option value="ironing">🔥 Ironing</option>
              <option value="ready-to-deliver">📦 Ready to Deliver</option>
            </select>

            {/* Sort By */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
            >
              <option value="priority">Sort by Priority</option>
              <option value="due">Sort by Due Date</option>
            </select>
          </div>
        </div>

        {/* Queue List */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : (
          <div className="space-y-3 max-h-[800px] overflow-y-auto pr-2">
            {prioritizedQueue.length > 0 ? (
              prioritizedQueue.map((work) => {
                const dueStatus = getDueStatus(work.estimatedDelivery);
                const isHighPriority = work.garment?.priority === "high";

                return (
                  <div
                    key={work._id}
                    className={`border-2 rounded-lg p-4 transition-all hover:shadow-md ${getStatusColor(work.status)} ${
                      isHighPriority ? "border-l-8 border-l-red-500" : ""
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="flex-1">
                        {/* Top Row */}
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span className="font-mono text-sm font-bold text-purple-600 bg-white px-2 py-1 rounded">
                            #{work.workId}
                          </span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(work.status)}`}
                          >
                            {getStatusBadge(work.status)}
                          </span>
                          {isHighPriority && (
                            <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full flex items-center gap-1">
                              <Flag size={10} /> High Priority
                            </span>
                          )}
                        </div>

                        <h3 className="font-bold text-gray-800 text-lg mb-1">
                          {work.garment?.name || "N/A"}
                        </h3>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                          <div className="flex items-center gap-1">
                            <User size={14} className="text-gray-400" />
                            <span>
                              {work.order?.customer?.name || "Unknown"}
                            </span>
                          </div>

                          <div
                            className={`flex items-center gap-1 ${dueStatus.color}`}
                          >
                            {dueStatus.icon}
                            <span>{dueStatus.label}</span>
                          </div>

                          <div className="flex items-center gap-1">
                            <Package size={14} className="text-purple-500" />
                            <span>
                              Garment: {work.garment?.garmentId || "N/A"}
                            </span>
                          </div>

                          {work.tailor && (
                            <div className="flex items-center gap-1">
                              <UserCheck size={14} className="text-green-500" />
                              <span>Tailor: {work.tailor.name}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      {work.status === "pending" ? (
                        <button
                          onClick={() => handleAcceptWork(work)}
                          disabled={acceptingId === work._id}
                          className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                            acceptingId === work._id
                              ? "bg-gray-400 cursor-not-allowed text-white"
                              : "bg-green-600 hover:bg-green-700 text-white"
                          }`}
                        >
                          {acceptingId === work._id ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <CheckCircle size={16} />
                              Accept
                            </>
                          )}
                        </button>
                      ) : work.status === "accepted" && !work.tailor ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleViewWork(work._id)}
                            className="px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition flex items-center gap-1"
                          >
                            <Eye size={14} /> View
                          </button>
                          <button
                            onClick={() => handleAssignTailor(work._id)}
                            className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center gap-1"
                          >
                            <UserPlus size={14} /> Assign
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleViewWork(work._id)}
                          className="px-3 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition flex items-center gap-1"
                        >
                          <Eye size={14} /> Details
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Scissors className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="font-medium">No items in work queue</p>
                <p className="text-sm text-gray-400 mt-1">
                  Try adjusting your filters
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination?.pages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <button
            onClick={() => dispatch(setFilters({ page: pagination.page - 1 }))}
            disabled={pagination.page === 1}
            className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="px-4 py-2 bg-purple-50 text-purple-600 rounded-lg">
            Page {pagination.page} of {pagination.pages}
          </span>
          <button
            onClick={() => dispatch(setFilters({ page: pagination.page + 1 }))}
            disabled={pagination.page === pagination.pages}
            className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
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

            <h2 className="text-xl font-bold text-center mb-2">
              Work Accepted Successfully!
            </h2>

            <div className="bg-green-50 p-4 rounded-lg mb-4">
              <p className="text-sm text-green-700 mb-2">
                This work is now assigned to:
              </p>
              <p className="font-bold text-lg text-green-800">
                {acceptedWork.assignedTo}
              </p>
              <p className="text-xs text-green-600 mt-1">
                Work ID: {acceptedWork.workId}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  navigate(
                    `/cuttingmaster/works/${acceptedWork._id}?assign=true`,
                  );
                }}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Assign Tailor Now
              </button>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
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