// // Pages/works/CuttingMasterDashboard.jsx
// import React, { useState, useEffect, useMemo } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import {
//   Calendar,
//   ChevronLeft,
//   ChevronRight,
//   Scissors,
//   Clock,
//   CheckCircle,
//   AlertCircle,
//   Target,
//   TrendingUp,
//   BarChart3,
//   Package,
//   Flag,
//   Users,
//   Eye,
//   Download,
//   RefreshCw,
//   User,
//   Filter,
//   Search,
//   X
// } from "lucide-react";
// import {
//   fetchDashboardStats,
//   fetchWorkStatusBreakdown,
//   fetchTailorPerformance,
//   fetchAvailableTailors,
//   fetchWorkQueue,
//   fetchTodaySummary,
//   fetchHighPriorityWorks,
//   selectDashboardStats,
//   selectStatusBreakdown,
//   selectTailorPerformance,
//   selectAvailableTailors,
//   selectWorkQueue,
//   selectTodaySummary,
//   selectHighPriorityWorks,
//   selectCuttingMasterLoading
// } from "../features/cuttingMaster/cuttingMasterSlice";
// import showToast from "../utils/toast";

// export default function CuttingMasterDashboard() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   // Selectors
//   const dashboardStats = useSelector(selectDashboardStats);
//   const statusBreakdown = useSelector(selectStatusBreakdown);
//   const tailorPerformance = useSelector(selectTailorPerformance);
//   const availableTailors = useSelector(selectAvailableTailors);
//   const workQueue = useSelector(selectWorkQueue);
//   const todaySummary = useSelector(selectTodaySummary);
//   const highPriorityWorks = useSelector(selectHighPriorityWorks);
//   const loading = useSelector(selectCuttingMasterLoading);

//   // Local state
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [currentMonth, setCurrentMonth] = useState(new Date());
//   const [viewMode, setViewMode] = useState("today"); // today, tomorrow, custom
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [showFilters, setShowFilters] = useState(false);

//   // Calendar state
//   const [calendarDays, setCalendarDays] = useState([]);
//   const [selectedCalendarDate, setSelectedCalendarDate] = useState(
//     new Date().toISOString().split('T')[0]
//   );

//   // Load data on mount
//   useEffect(() => {
//     loadDashboardData();
//   }, []);

//   const loadDashboardData = async () => {
//     try {
//       await Promise.all([
//         dispatch(fetchDashboardStats()),
//         dispatch(fetchWorkStatusBreakdown()),
//         dispatch(fetchTailorPerformance()),
//         dispatch(fetchAvailableTailors()),
//         dispatch(fetchWorkQueue({ status: statusFilter, search: searchTerm })),
//         dispatch(fetchTodaySummary()),
//         dispatch(fetchHighPriorityWorks())
//       ]);
//     } catch (error) {
//       showToast.error("Failed to load dashboard data");
//     }
//   };

//   const handleRefresh = () => {
//     loadDashboardData();
//     showToast.success("Dashboard refreshed");
//   };

//   // Generate calendar days
//   useEffect(() => {
//     const year = currentMonth.getFullYear();
//     const month = currentMonth.getMonth();
    
//     const firstDay = new Date(year, month, 1);
//     const lastDay = new Date(year, month + 1, 0);
    
//     const days = [];
//     const startDay = firstDay.getDay(); // 0 = Sunday
    
//     // Add empty cells for days before month starts
//     for (let i = 0; i < startDay; i++) {
//       days.push(null);
//     }
    
//     // Add days of month
//     for (let d = 1; d <= lastDay.getDate(); d++) {
//       const date = new Date(year, month, d);
//       const dateStr = date.toISOString().split('T')[0];
      
//       // Mock data - in real app, this would come from API
//       const hasWork = [5, 10, 15, 20, 25].includes(d);
//       const hasOverdue = [10, 20].includes(d);
      
//       days.push({
//         date,
//         dateStr,
//         day: d,
//         hasWork,
//         hasOverdue
//       });
//     }
    
//     setCalendarDays(days);
//   }, [currentMonth]);

//   const handlePrevMonth = () => {
//     setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)));
//   };

//   const handleNextMonth = () => {
//     setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)));
//   };

//   const handleDateSelect = (date) => {
//     setSelectedCalendarDate(date.dateStr);
//     setSelectedDate(date.date);
//     // Fetch works for this date
//     dispatch(fetchWorkQueue({ date: date.dateStr }));
//   };

//   const handleViewWork = (workId) => {
//     navigate(`/cuttingmaster/works/${workId}`);
//   };

//   const handleStatusFilter = (e) => {
//     const status = e.target.value;
//     setStatusFilter(status);
//     dispatch(fetchWorkQueue({ status, search: searchTerm }));
//   };

//   const handleSearch = (e) => {
//     const term = e.target.value;
//     setSearchTerm(term);
//     if (term.length > 2 || term.length === 0) {
//       dispatch(fetchWorkQueue({ status: statusFilter, search: term }));
//     }
//   };

//   const clearSearch = () => {
//     setSearchTerm("");
//     dispatch(fetchWorkQueue({ status: statusFilter, search: "" }));
//   };

//   // Format date
//   const formatDate = (date) => {
//     return date.toLocaleDateString('en-IN', {
//       day: 'numeric',
//       month: 'long',
//       year: 'numeric'
//     });
//   };

//   // Get status color
//   const getStatusColor = (status) => {
//     const colors = {
//       'pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
//       'accepted': 'bg-blue-100 text-blue-800 border-blue-200',
//       'cutting-started': 'bg-purple-100 text-purple-800 border-purple-200',
//       'cutting-completed': 'bg-indigo-100 text-indigo-800 border-indigo-200',
//       'sewing-started': 'bg-pink-100 text-pink-800 border-pink-200',
//       'sewing-completed': 'bg-teal-100 text-teal-800 border-teal-200',
//       'ironing': 'bg-orange-100 text-orange-800 border-orange-200',
//       'ready-to-deliver': 'bg-green-100 text-green-800 border-green-200'
//     };
//     return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
//   };

//   // Get status badge
//   const getStatusBadge = (status) => {
//     const badges = {
//       'pending': '⏳ Pending',
//       'accepted': '✅ Accepted',
//       'cutting-started': '✂️ Cutting Started',
//       'cutting-completed': '✔️ Cutting Completed',
//       'sewing-started': '🧵 Sewing Started',
//       'sewing-completed': '🧵 Sewing Completed',
//       'ironing': '🔥 Ironing',
//       'ready-to-deliver': '📦 Ready to Deliver'
//     };
//     return badges[status] || status;
//   };

//   // Get priority display
//   const getPriorityDisplay = (priority) => {
//     if (priority === 'high') return '🔴 High';
//     if (priority === 'normal') return '🟠 Normal';
//     return '🟢 Low';
//   };

//   const getPriorityColor = (priority) => {
//     if (priority === 'high') return 'border-l-4 border-l-red-500';
//     if (priority === 'normal') return 'border-l-4 border-l-orange-400';
//     return 'border-l-4 border-l-green-500';
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 md:p-6">
//       {/* Header */}
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
//         <div>
//           <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
//             <Scissors className="w-8 h-8 text-purple-600" />
//             Cutting Master Dashboard
//           </h1>
//           <p className="text-sm text-gray-500 mt-1">
//             {formatDate(new Date())}
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
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//         <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-blue-500">
//           <div className="flex items-center justify-between mb-2">
//             <p className="text-sm text-gray-500">Total Work</p>
//             <Package className="w-5 h-5 text-blue-500" />
//           </div>
//           <p className="text-3xl font-bold text-gray-800">
//             {dashboardStats.totalWork}
//           </p>
//           <p className="text-xs text-gray-400 mt-1">All assigned works</p>
//         </div>

//         <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-green-500">
//           <div className="flex items-center justify-between mb-2">
//             <p className="text-sm text-gray-500">Completed Work</p>
//             <CheckCircle className="w-5 h-5 text-green-500" />
//           </div>
//           <p className="text-3xl font-bold text-gray-800">
//             {dashboardStats.completedWork}
//           </p>
//           <p className="text-xs text-gray-400 mt-1">Ready to deliver</p>
//         </div>

//         <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-purple-500">
//           <div className="flex items-center justify-between mb-2">
//             <p className="text-sm text-gray-500">In Progress</p>
//             <Clock className="w-5 h-5 text-purple-500" />
//           </div>
//           <p className="text-3xl font-bold text-gray-800">
//             {dashboardStats.inProgressWork}
//           </p>
//           <p className="text-xs text-gray-400 mt-1">Cutting/Sewing/Ironing</p>
//         </div>

//         <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-red-500">
//           <div className="flex items-center justify-between mb-2">
//             <p className="text-sm text-gray-500">Overdue</p>
//             <AlertCircle className="w-5 h-5 text-red-500" />
//           </div>
//           <p className="text-3xl font-bold text-gray-800">
//             {dashboardStats.overdueWork}
//           </p>
//           <p className="text-xs text-gray-400 mt-1">Past delivery date</p>
//         </div>
//       </div>

//       {/* Main Grid - Calendar + Work Queue */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
//         {/* Calendar Section */}
//         <div className="lg:col-span-1">
//           <div className="bg-white rounded-xl shadow-sm p-4">
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="font-bold text-gray-800 flex items-center gap-2">
//                 <Calendar className="w-5 h-5 text-purple-600" />
//                 {currentMonth.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
//               </h2>
//               <div className="flex gap-1">
//                 <button
//                   onClick={handlePrevMonth}
//                   className="p-1 hover:bg-gray-100 rounded-lg transition"
//                 >
//                   <ChevronLeft size={18} />
//                 </button>
//                 <button
//                   onClick={handleNextMonth}
//                   className="p-1 hover:bg-gray-100 rounded-lg transition"
//                 >
//                   <ChevronRight size={18} />
//                 </button>
//               </div>
//             </div>

//             {/* Calendar Header */}
//             <div className="grid grid-cols-7 gap-1 mb-2 text-center text-xs font-medium text-gray-500">
//               <div>Su</div>
//               <div>Mo</div>
//               <div>Tu</div>
//               <div>We</div>
//               <div>Th</div>
//               <div>Fr</div>
//               <div>Sa</div>
//             </div>

//             {/* Calendar Days */}
//             <div className="grid grid-cols-7 gap-1">
//               {calendarDays.map((day, index) => (
//                 <div key={index} className="aspect-square">
//                   {day ? (
//                     <button
//                       onClick={() => handleDateSelect(day)}
//                       className={`w-full h-full flex items-center justify-center rounded-lg text-sm transition-all relative
//                         ${selectedCalendarDate === day.dateStr 
//                           ? 'bg-purple-600 text-white font-bold' 
//                           : 'hover:bg-gray-100'
//                         }
//                       `}
//                     >
//                       <span>{day.day}</span>
//                       {day.hasWork && !day.hasOverdue && (
//                         <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"></span>
//                       )}
//                       {day.hasOverdue && (
//                         <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
//                       )}
//                     </button>
//                   ) : (
//                     <div className="w-full h-full"></div>
//                   )}
//                 </div>
//               ))}
//             </div>

//             {/* Legend */}
//             <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-4 text-xs">
//               <div className="flex items-center gap-1">
//                 <span className="w-3 h-3 bg-green-500 rounded-full"></span>
//                 <span>Has Works</span>
//               </div>
//               <div className="flex items-center gap-1">
//                 <span className="w-3 h-3 bg-red-500 rounded-full"></span>
//                 <span>Overdue</span>
//               </div>
//             </div>

//             {/* Selected Date Summary */}
//             {selectedDate && (
//               <div className="mt-4 p-3 bg-purple-50 rounded-lg">
//                 <p className="text-sm font-medium text-purple-700">
//                   {formatDate(selectedDate)}
//                 </p>
//                 <div className="flex justify-between mt-2 text-xs">
//                   <span>Total: <span className="font-bold">5</span></span>
//                   <span>✅ Completed: <span className="font-bold text-green-600">4</span></span>
//                   <span>⏳ Pending: <span className="font-bold text-yellow-600">1</span></span>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Today's Summary Card */}
//           {todaySummary.data && (
//             <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4 mt-4">
//               <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
//                 <Target className="w-4 h-4 text-blue-600" />
//                 Today's Focus
//               </h3>
//               <div className="space-y-2">
//                 <div className="flex justify-between text-sm">
//                   <span>Due Today:</span>
//                   <span className="font-bold text-red-600">{todaySummary.data.dueToday || 0}</span>
//                 </div>
//                 <div className="flex justify-between text-sm">
//                   <span>High Priority:</span>
//                   <span className="font-bold text-red-600">{todaySummary.data.highPriority || 0}</span>
//                 </div>
//                 <div className="flex justify-between text-sm">
//                   <span>Completed Today:</span>
//                   <span className="font-bold text-green-600">{todaySummary.data.completedToday || 0}</span>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Work Queue Section */}
//         <div className="lg:col-span-2">
//           <div className="bg-white rounded-xl shadow-sm p-6">
//             <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
//               <h2 className="font-bold text-gray-800 flex items-center gap-2">
//                 <Package className="w-5 h-5 text-purple-600" />
//                 Work Queue - {formatDate(selectedDate)}
//               </h2>

//               <div className="flex gap-2">
//                 {/* View Mode Toggle */}
//                 <div className="flex bg-gray-100 rounded-lg p-1">
//                   <button
//                     onClick={() => setViewMode("today")}
//                     className={`px-3 py-1.5 text-xs rounded-md transition ${
//                       viewMode === "today" ? "bg-purple-600 text-white" : "text-gray-600"
//                     }`}
//                   >
//                     Today
//                   </button>
//                   <button
//                     onClick={() => setViewMode("tomorrow")}
//                     className={`px-3 py-1.5 text-xs rounded-md transition ${
//                       viewMode === "tomorrow" ? "bg-purple-600 text-white" : "text-gray-600"
//                     }`}
//                   >
//                     Tomorrow
//                   </button>
//                 </div>

//                 {/* Filter Toggle */}
//                 <button
//                   onClick={() => setShowFilters(!showFilters)}
//                   className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
//                 >
//                   <Filter size={16} />
//                 </button>
//               </div>
//             </div>

//             {/* Filters */}
//             {showFilters && (
//               <div className="mb-4 p-3 bg-gray-50 rounded-lg">
//                 <div className="flex flex-col md:flex-row gap-3">
//                   {/* Status Filter */}
//                   <select
//                     value={statusFilter}
//                     onChange={handleStatusFilter}
//                     className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
//                   >
//                     <option value="all">All Status</option>
//                     <option value="pending">Pending</option>
//                     <option value="accepted">Accepted</option>
//                     <option value="cutting-started">Cutting Started</option>
//                     <option value="cutting-completed">Cutting Completed</option>
//                     <option value="sewing-started">Sewing Started</option>
//                     <option value="sewing-completed">Sewing Completed</option>
//                     <option value="ironing">Ironing</option>
//                     <option value="ready-to-deliver">Ready to Deliver</option>
//                   </select>

//                   {/* Search */}
//                   <div className="relative flex-1">
//                     <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                     <input
//                       type="text"
//                       value={searchTerm}
//                       onChange={handleSearch}
//                       placeholder="Search by Work ID or Garment..."
//                       className="w-full pl-9 pr-8 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
//                     />
//                     {searchTerm && (
//                       <button
//                         onClick={clearSearch}
//                         className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                       >
//                         <X size={16} />
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Work List */}
//             <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
//               {workQueue.works.length > 0 ? (
//                 workQueue.works.map((work) => (
//                   <div
//                     key={work._id}
//                     className={`border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer ${getPriorityColor(work.priority)}`}
//                     onClick={() => handleViewWork(work._id)}
//                   >
//                     <div className="flex items-start justify-between mb-2">
//                       <div className="flex items-center gap-2 flex-wrap">
//                         <span className="font-mono text-sm font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded">
//                           #{work.workId}
//                         </span>
//                         <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(work.status)}`}>
//                           {getStatusBadge(work.status)}
//                         </span>
//                         <span className="text-xs font-medium">
//                           {getPriorityDisplay(work.priority)}
//                         </span>
//                       </div>
//                       <button
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           handleViewWork(work._id);
//                         }}
//                         className="p-1 hover:bg-gray-100 rounded-lg transition"
//                       >
//                         <Eye size={16} className="text-gray-600" />
//                       </button>
//                     </div>

//                     <h3 className="font-bold text-gray-800 mb-1">
//                       {work.garment?.name || 'Unknown Garment'}
//                     </h3>

//                     <div className="grid grid-cols-2 gap-2 text-sm">
//                       <div className="flex items-center gap-1">
//                         <User size={14} className="text-gray-400" />
//                         <span>{work.customer?.name || 'Unknown'}</span>
//                       </div>

//                       <div className="flex items-center gap-1">
//                         <Package size={14} className="text-purple-500" />
//                         <span className="text-xs">
//                           Garment: {work.garment?.garmentId || 'N/A'}
//                         </span>
//                       </div>
//                     </div>

//                     {work.tailor && (
//                       <div className="mt-2 text-xs text-gray-500">
//                         👔 Tailor: {work.tailor.name}
//                       </div>
//                     )}
//                   </div>
//                 ))
//               ) : (
//                 <div className="text-center py-12 text-gray-500">
//                   <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
//                   <p className="font-medium">No works found</p>
//                   <p className="text-sm text-gray-400 mt-1">
//                     Try adjusting your filters
//                   </p>
//                 </div>
//               )}
//             </div>

//             {/* Work Queue Stats */}
//             {workQueue.works.length > 0 && (
//               <div className="mt-4 pt-3 border-t border-gray-200 flex justify-between text-xs text-gray-600">
//                 <span>Total: <span className="font-bold">{workQueue.total}</span></span>
//                 <span>✅ Completed: <span className="font-bold text-green-600">
//                   {workQueue.works.filter(w => w.status === 'ready-to-deliver').length}
//                 </span></span>
//                 <span>⏳ Pending: <span className="font-bold text-yellow-600">
//                   {workQueue.works.filter(w => w.status !== 'ready-to-deliver').length}
//                 </span></span>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* High Priority Works Section */}
//       {highPriorityWorks.works.length > 0 && (
//         <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
//           <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
//             <Flag className="w-5 h-5 text-red-500" />
//             High Priority Works ({highPriorityWorks.count})
//           </h2>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//             {highPriorityWorks.works.map((work) => (
//               <div
//                 key={work._id}
//                 className="border border-red-200 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer bg-red-50"
//                 onClick={() => handleViewWork(work._id)}
//               >
//                 <div className="flex items-start justify-between mb-2">
//                   <span className="font-mono text-sm font-bold text-red-600">
//                     #{work.workId}
//                   </span>
//                   <span className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded-full">
//                     🔴 High
//                   </span>
//                 </div>
//                 <h3 className="font-bold text-gray-800 mb-1">
//                   {work.garment?.name || 'Unknown'}
//                 </h3>
//                 <p className="text-xs text-gray-500">
//                   👤 {work.customer?.name || 'Unknown'}
//                 </p>
//                 {work.estimatedDelivery && (
//                   <p className="text-xs text-red-600 mt-2">
//                     Due: {new Date(work.estimatedDelivery).toLocaleDateString()}
//                   </p>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Tailor Performance Section */}
//       <div className="bg-white rounded-xl shadow-sm p-6">
//         <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
//           <Users className="w-5 h-5 text-purple-600" />
//           Tailor Performance
//           {availableTailors.count > 0 && (
//             <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
//               {availableTailors.count} Available
//             </span>
//           )}
//         </h2>

//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead>
//               <tr className="border-b border-gray-200">
//                 <th className="text-left py-3 px-2 text-xs font-medium text-gray-500">Tailor</th>
//                 <th className="text-center py-3 px-2 text-xs font-medium text-gray-500">Assigned</th>
//                 <th className="text-center py-3 px-2 text-xs font-medium text-gray-500">Completed</th>
//                 <th className="text-center py-3 px-2 text-xs font-medium text-gray-500">Pending</th>
//                 <th className="text-center py-3 px-2 text-xs font-medium text-gray-500">In Progress</th>
//                 <th className="text-right py-3 px-2 text-xs font-medium text-gray-500">Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {tailorPerformance.tailors.length > 0 ? (
//                 tailorPerformance.tailors.map((tailor) => (
//                   <tr key={tailor._id} className="border-b border-gray-100 hover:bg-gray-50">
//                     <td className="py-3 px-2">
//                       <div className="font-medium text-gray-800">{tailor.name}</div>
//                       <div className="text-xs text-gray-500">{tailor.employeeId}</div>
//                     </td>
//                     <td className="text-center py-3 px-2 font-bold">{tailor.assigned}</td>
//                     <td className="text-center py-3 px-2 text-green-600 font-bold">{tailor.completed}</td>
//                     <td className="text-center py-3 px-2 text-yellow-600 font-bold">{tailor.pending}</td>
//                     <td className="text-center py-3 px-2 text-purple-600 font-bold">{tailor.inProgress}</td>
//                     <td className="text-right py-3 px-2">
//                       <button
//                         onClick={() => navigate(`/cuttingmaster/tailors/${tailor._id}`)}
//                         className="text-xs px-3 py-1 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition"
//                       >
//                         View
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="6" className="text-center py-8 text-gray-500">
//                     No tailors found
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }






// // Pages/works/CuttingMasterDashboard.jsx
// import React, { useState, useEffect, useMemo } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import {
//   Calendar,
//   ChevronLeft,
//   ChevronRight,
//   Scissors,
//   Clock,
//   CheckCircle,
//   AlertCircle,
//   Target,
//   TrendingUp,
//   BarChart3,
//   Package,
//   Flag,
//   Users,
//   Eye,
//   Download,
//   RefreshCw,
//   User,
//   Filter,
//   Search,
//   X
// } from "lucide-react";
// import {
//   fetchDashboardStats,
//   fetchWorkStatusBreakdown,
//   fetchTailorPerformance,
//   fetchAvailableTailors,
//   fetchWorkQueue,
//   fetchTodaySummary,
//   fetchHighPriorityWorks,
//   selectDashboardStats,
//   selectStatusBreakdown,
//   selectTailorPerformance,
//   selectAvailableTailors,
//   selectWorkQueue,
//   selectTodaySummary,
//   selectHighPriorityWorks,
//   selectCuttingMasterLoading
// } from "../features/cuttingMaster/cuttingMasterSlice";
// import showToast from "../utils/toast";

// export default function CuttingMasterDashboard() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   // Selectors
//   const dashboardStats = useSelector(selectDashboardStats);
//   const statusBreakdown = useSelector(selectStatusBreakdown);
//   const tailorPerformance = useSelector(selectTailorPerformance);
//   const availableTailors = useSelector(selectAvailableTailors);
//   const workQueue = useSelector(selectWorkQueue);
//   const todaySummary = useSelector(selectTodaySummary);
//   const highPriorityWorks = useSelector(selectHighPriorityWorks);
//   const loading = useSelector(selectCuttingMasterLoading);

//   // Local state
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [currentMonth, setCurrentMonth] = useState(new Date());
//   const [viewMode, setViewMode] = useState("today"); // today, tomorrow, custom
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [showFilters, setShowFilters] = useState(false);

//   // Calendar state
//   const [calendarDays, setCalendarDays] = useState([]);
//   const [selectedCalendarDate, setSelectedCalendarDate] = useState(
//     new Date().toISOString().split('T')[0]
//   );

//   // Mock data for overdue works
//   const [overdueWorks] = useState([
//     {
//       _id: "ov1",
//       workId: "WRK-1773475878265-9jf2a",
//       status: "pending",
//       priority: "high",
//       garment: {
//         name: "sample",
//         garmentId: "GRM20260314-7929-1039"
//       },
//       customer: {
//         name: "Mrs. Divya R"
//       },
//       estimatedDelivery: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
//       overdueBy: 3
//     },
//     {
//       _id: "ov2",
//       workId: "WRK-1773470363621-8ctzk",
//       status: "pending",
//       priority: "high",
//       garment: {
//         name: "sample test",
//         garmentId: "GRM20260314-8555-3168"
//       },
//       customer: {
//         name: "Mr. Raj"
//       },
//       estimatedDelivery: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
//       overdueBy: 1
//     }
//   ]);

//   // Load data on mount
//   useEffect(() => {
//     loadDashboardData();
//   }, []);

//   const loadDashboardData = async () => {
//     try {
//       await Promise.all([
//         dispatch(fetchDashboardStats()),
//         dispatch(fetchWorkStatusBreakdown()),
//         dispatch(fetchTailorPerformance()),
//         dispatch(fetchAvailableTailors()),
//         dispatch(fetchWorkQueue({ status: statusFilter, search: searchTerm })),
//         dispatch(fetchTodaySummary()),
//         dispatch(fetchHighPriorityWorks())
//       ]);
//     } catch (error) {
//       showToast.error("Failed to load dashboard data");
//     }
//   };

//   const handleRefresh = () => {
//     loadDashboardData();
//     showToast.success("Dashboard refreshed");
//   };

//   // Generate calendar days
//   useEffect(() => {
//     const year = currentMonth.getFullYear();
//     const month = currentMonth.getMonth();
    
//     const firstDay = new Date(year, month, 1);
//     const lastDay = new Date(year, month + 1, 0);
    
//     const days = [];
//     const startDay = firstDay.getDay(); // 0 = Sunday
    
//     // Add empty cells for days before month starts
//     for (let i = 0; i < startDay; i++) {
//       days.push(null);
//     }
    
//     // Add days of month
//     for (let d = 1; d <= lastDay.getDate(); d++) {
//       const date = new Date(year, month, d);
//       const dateStr = date.toISOString().split('T')[0];
      
//       // Mock data - in real app, this would come from API
//       const hasWork = [5, 10, 15, 20, 25].includes(d);
//       const hasOverdue = [10, 20].includes(d);
      
//       days.push({
//         date,
//         dateStr,
//         day: d,
//         hasWork,
//         hasOverdue
//       });
//     }
    
//     setCalendarDays(days);
//   }, [currentMonth]);

//   const handlePrevMonth = () => {
//     setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)));
//   };

//   const handleNextMonth = () => {
//     setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)));
//   };

//   const handleDateSelect = (date) => {
//     setSelectedCalendarDate(date.dateStr);
//     setSelectedDate(date.date);
//     // Fetch works for this date
//     dispatch(fetchWorkQueue({ date: date.dateStr }));
//   };

//   const handleViewWork = (workId) => {
//     navigate(`/cuttingmaster/works/${workId}`);
//   };

//   const handleStatusFilter = (e) => {
//     const status = e.target.value;
//     setStatusFilter(status);
//     dispatch(fetchWorkQueue({ status, search: searchTerm }));
//   };

//   const handleSearch = (e) => {
//     const term = e.target.value;
//     setSearchTerm(term);
//     if (term.length > 2 || term.length === 0) {
//       dispatch(fetchWorkQueue({ status: statusFilter, search: term }));
//     }
//   };

//   const clearSearch = () => {
//     setSearchTerm("");
//     dispatch(fetchWorkQueue({ status: statusFilter, search: "" }));
//   };

//   // Format date
//   const formatDate = (date) => {
//     return date.toLocaleDateString('en-IN', {
//       day: 'numeric',
//       month: 'long',
//       year: 'numeric'
//     });
//   };

//   // Get status color
//   const getStatusColor = (status) => {
//     const colors = {
//       'pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
//       'accepted': 'bg-blue-100 text-blue-800 border-blue-200',
//       'cutting-started': 'bg-purple-100 text-purple-800 border-purple-200',
//       'cutting-completed': 'bg-indigo-100 text-indigo-800 border-indigo-200',
//       'sewing-started': 'bg-pink-100 text-pink-800 border-pink-200',
//       'sewing-completed': 'bg-teal-100 text-teal-800 border-teal-200',
//       'ironing': 'bg-orange-100 text-orange-800 border-orange-200',
//       'ready-to-deliver': 'bg-green-100 text-green-800 border-green-200'
//     };
//     return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
//   };

//   // Get status badge
//   const getStatusBadge = (status) => {
//     const badges = {
//       'pending': '⏳ Pending',
//       'accepted': '✅ Accepted',
//       'cutting-started': '✂️ Cutting Started',
//       'cutting-completed': '✔️ Cutting Completed',
//       'sewing-started': '🧵 Sewing Started',
//       'sewing-completed': '🧵 Sewing Completed',
//       'ironing': '🔥 Ironing',
//       'ready-to-deliver': '📦 Ready to Deliver'
//     };
//     return badges[status] || status;
//   };

//   // Get priority display
//   const getPriorityDisplay = (priority) => {
//     if (priority === 'high') return '🔴 High';
//     if (priority === 'normal') return '🟠 Normal';
//     return '🟢 Low';
//   };

//   const getPriorityColor = (priority) => {
//     if (priority === 'high') return 'border-l-4 border-l-red-500';
//     if (priority === 'normal') return 'border-l-4 border-l-orange-400';
//     return 'border-l-4 border-l-green-500';
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 md:p-6">
//       {/* Header */}
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
//         <div>
//           <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
//             <Scissors className="w-8 h-8 text-purple-600" />
//             Cutting Master Dashboard
//           </h1>
//           <p className="text-sm text-gray-500 mt-1">
//             {formatDate(new Date())}
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
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//         <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-blue-500">
//           <div className="flex items-center justify-between mb-2">
//             <p className="text-sm text-gray-500">Total Work</p>
//             <Package className="w-5 h-5 text-blue-500" />
//           </div>
//           <p className="text-3xl font-bold text-gray-800">
//             {dashboardStats.totalWork}
//           </p>
//           <p className="text-xs text-gray-400 mt-1">All assigned works</p>
//         </div>

//         <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-green-500">
//           <div className="flex items-center justify-between mb-2">
//             <p className="text-sm text-gray-500">Completed Work</p>
//             <CheckCircle className="w-5 h-5 text-green-500" />
//           </div>
//           <p className="text-3xl font-bold text-gray-800">
//             {dashboardStats.completedWork}
//           </p>
//           <p className="text-xs text-gray-400 mt-1">Ready to deliver</p>
//         </div>

//         <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-purple-500">
//           <div className="flex items-center justify-between mb-2">
//             <p className="text-sm text-gray-500">In Progress</p>
//             <Clock className="w-5 h-5 text-purple-500" />
//           </div>
//           <p className="text-3xl font-bold text-gray-800">
//             {dashboardStats.inProgressWork}
//           </p>
//           <p className="text-xs text-gray-400 mt-1">Cutting/Sewing/Ironing</p>
//         </div>

//         <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-red-500">
//           <div className="flex items-center justify-between mb-2">
//             <p className="text-sm text-gray-500">Overdue</p>
//             <AlertCircle className="w-5 h-5 text-red-500" />
//           </div>
//           <p className="text-3xl font-bold text-gray-800">
//             {dashboardStats.overdueWork}
//           </p>
//           <p className="text-xs text-gray-400 mt-1">Past delivery date</p>
//         </div>
//       </div>

//       {/* Main Grid - Calendar + Work Queue */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
//         {/* Calendar Section */}
//         <div className="lg:col-span-1">
//           <div className="bg-white rounded-xl shadow-sm p-4">
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="font-bold text-gray-800 flex items-center gap-2">
//                 <Calendar className="w-5 h-5 text-purple-600" />
//                 {currentMonth.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
//               </h2>
//               <div className="flex gap-1">
//                 <button
//                   onClick={handlePrevMonth}
//                   className="p-1 hover:bg-gray-100 rounded-lg transition"
//                 >
//                   <ChevronLeft size={18} />
//                 </button>
//                 <button
//                   onClick={handleNextMonth}
//                   className="p-1 hover:bg-gray-100 rounded-lg transition"
//                 >
//                   <ChevronRight size={18} />
//                 </button>
//               </div>
//             </div>

//             {/* Calendar Header */}
//             <div className="grid grid-cols-7 gap-1 mb-2 text-center text-xs font-medium text-gray-500">
//               <div>Su</div>
//               <div>Mo</div>
//               <div>Tu</div>
//               <div>We</div>
//               <div>Th</div>
//               <div>Fr</div>
//               <div>Sa</div>
//             </div>

//             {/* Calendar Days */}
//             <div className="grid grid-cols-7 gap-1">
//               {calendarDays.map((day, index) => (
//                 <div key={index} className="aspect-square">
//                   {day ? (
//                     <button
//                       onClick={() => handleDateSelect(day)}
//                       className={`w-full h-full flex items-center justify-center rounded-lg text-sm transition-all relative
//                         ${selectedCalendarDate === day.dateStr 
//                           ? 'bg-purple-600 text-white font-bold' 
//                           : 'hover:bg-gray-100'
//                         }
//                       `}
//                     >
//                       <span>{day.day}</span>
//                       {day.hasWork && !day.hasOverdue && (
//                         <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"></span>
//                       )}
//                       {day.hasOverdue && (
//                         <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
//                       )}
//                     </button>
//                   ) : (
//                     <div className="w-full h-full"></div>
//                   )}
//                 </div>
//               ))}
//             </div>

//             {/* Legend */}
//             <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-4 text-xs">
//               <div className="flex items-center gap-1">
//                 <span className="w-3 h-3 bg-green-500 rounded-full"></span>
//                 <span>Has Works</span>
//               </div>
//               <div className="flex items-center gap-1">
//                 <span className="w-3 h-3 bg-red-500 rounded-full"></span>
//                 <span>Overdue</span>
//               </div>
//             </div>

//             {/* Selected Date Summary */}
//             {selectedDate && (
//               <div className="mt-4 p-3 bg-purple-50 rounded-lg">
//                 <p className="text-sm font-medium text-purple-700">
//                   {formatDate(selectedDate)}
//                 </p>
//                 <div className="flex justify-between mt-2 text-xs">
//                   <span>Total: <span className="font-bold">5</span></span>
//                   <span>✅ Completed: <span className="font-bold text-green-600">4</span></span>
//                   <span>⏳ Pending: <span className="font-bold text-yellow-600">1</span></span>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Today's Summary Card */}
//           {todaySummary.data && (
//             <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4 mt-4">
//               <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
//                 <Target className="w-4 h-4 text-blue-600" />
//                 Today's Focus
//               </h3>
//               <div className="space-y-2">
//                 <div className="flex justify-between text-sm">
//                   <span>Due Today:</span>
//                   <span className="font-bold text-red-600">{todaySummary.data.dueToday || 0}</span>
//                 </div>
//                 <div className="flex justify-between text-sm">
//                   <span>High Priority:</span>
//                   <span className="font-bold text-red-600">{todaySummary.data.highPriority || 0}</span>
//                 </div>
//                 <div className="flex justify-between text-sm">
//                   <span>Completed Today:</span>
//                   <span className="font-bold text-green-600">{todaySummary.data.completedToday || 0}</span>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Work Queue Section */}
//         <div className="lg:col-span-2">
//           <div className="bg-white rounded-xl shadow-sm p-6">
//             <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
//               <h2 className="font-bold text-gray-800 flex items-center gap-2">
//                 <Package className="w-5 h-5 text-purple-600" />
//                 Work Queue - {formatDate(selectedDate)}
//               </h2>

//               <div className="flex gap-2">
//                 {/* View Mode Toggle */}
//                 <div className="flex bg-gray-100 rounded-lg p-1">
//                   <button
//                     onClick={() => setViewMode("today")}
//                     className={`px-3 py-1.5 text-xs rounded-md transition ${
//                       viewMode === "today" ? "bg-purple-600 text-white" : "text-gray-600"
//                     }`}
//                   >
//                     Today
//                   </button>
//                   <button
//                     onClick={() => setViewMode("tomorrow")}
//                     className={`px-3 py-1.5 text-xs rounded-md transition ${
//                       viewMode === "tomorrow" ? "bg-purple-600 text-white" : "text-gray-600"
//                     }`}
//                   >
//                     Tomorrow
//                   </button>
//                 </div>

//                 {/* Filter Toggle */}
//                 <button
//                   onClick={() => setShowFilters(!showFilters)}
//                   className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
//                 >
//                   <Filter size={16} />
//                 </button>
//               </div>
//             </div>

//             {/* Filters */}
//             {showFilters && (
//               <div className="mb-4 p-3 bg-gray-50 rounded-lg">
//                 <div className="flex flex-col md:flex-row gap-3">
//                   {/* Status Filter */}
//                   <select
//                     value={statusFilter}
//                     onChange={handleStatusFilter}
//                     className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
//                   >
//                     <option value="all">All Status</option>
//                     <option value="pending">Pending</option>
//                     <option value="accepted">Accepted</option>
//                     <option value="cutting-started">Cutting Started</option>
//                     <option value="cutting-completed">Cutting Completed</option>
//                     <option value="sewing-started">Sewing Started</option>
//                     <option value="sewing-completed">Sewing Completed</option>
//                     <option value="ironing">Ironing</option>
//                     <option value="ready-to-deliver">Ready to Deliver</option>
//                   </select>

//                   {/* Search */}
//                   <div className="relative flex-1">
//                     <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                     <input
//                       type="text"
//                       value={searchTerm}
//                       onChange={handleSearch}
//                       placeholder="Search by Work ID or Garment..."
//                       className="w-full pl-9 pr-8 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
//                     />
//                     {searchTerm && (
//                       <button
//                         onClick={clearSearch}
//                         className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                       >
//                         <X size={16} />
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Work List */}
//             <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
//               {workQueue.works.length > 0 ? (
//                 workQueue.works.map((work) => (
//                   <div
//                     key={work._id}
//                     className={`border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer ${getPriorityColor(work.priority)}`}
//                     onClick={() => handleViewWork(work._id)}
//                   >
//                     <div className="flex items-start justify-between mb-2">
//                       <div className="flex items-center gap-2 flex-wrap">
//                         <span className="font-mono text-sm font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded">
//                           #{work.workId}
//                         </span>
//                         <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(work.status)}`}>
//                           {getStatusBadge(work.status)}
//                         </span>
//                         <span className="text-xs font-medium">
//                           {getPriorityDisplay(work.priority)}
//                         </span>
//                       </div>
//                       <button
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           handleViewWork(work._id);
//                         }}
//                         className="p-1 hover:bg-gray-100 rounded-lg transition"
//                       >
//                         <Eye size={16} className="text-gray-600" />
//                       </button>
//                     </div>

//                     <h3 className="font-bold text-gray-800 mb-1">
//                       {work.garment?.name || 'Unknown Garment'}
//                     </h3>

//                     <div className="grid grid-cols-2 gap-2 text-sm">
//                       <div className="flex items-center gap-1">
//                         <User size={14} className="text-gray-400" />
//                         <span>{work.customer?.name || 'Unknown'}</span>
//                       </div>

//                       <div className="flex items-center gap-1">
//                         <Package size={14} className="text-purple-500" />
//                         <span className="text-xs">
//                           Garment: {work.garment?.garmentId || 'N/A'}
//                         </span>
//                       </div>
//                     </div>

//                     {work.tailor && (
//                       <div className="mt-2 text-xs text-gray-500">
//                         👔 Tailor: {work.tailor.name}
//                       </div>
//                     )}
//                   </div>
//                 ))
//               ) : (
//                 <div className="text-center py-12 text-gray-500">
//                   <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
//                   <p className="font-medium">No works found</p>
//                   <p className="text-sm text-gray-400 mt-1">
//                     Try adjusting your filters
//                   </p>
//                 </div>
//               )}
//             </div>

//             {/* Work Queue Stats */}
//             {workQueue.works.length > 0 && (
//               <div className="mt-4 pt-3 border-t border-gray-200 flex justify-between text-xs text-gray-600">
//                 <span>Total: <span className="font-bold">{workQueue.total}</span></span>
//                 <span>✅ Completed: <span className="font-bold text-green-600">
//                   {workQueue.works.filter(w => w.status === 'ready-to-deliver').length}
//                 </span></span>
//                 <span>⏳ Pending: <span className="font-bold text-yellow-600">
//                   {workQueue.works.filter(w => w.status !== 'ready-to-deliver').length}
//                 </span></span>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* 🔥 NEW: Overdue Works Section - Below Work Queue */}
//       {overdueWorks.length > 0 && (
//         <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
//           <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
//             <AlertCircle className="w-5 h-5 text-red-500" />
//             ⚠️ OVERDUE WORKS ({overdueWorks.length})
//           </h2>

//           <div className="space-y-3">
//             {overdueWorks.map((work) => (
//               <div
//                 key={work._id}
//                 className="border border-red-200 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer bg-red-50"
//                 onClick={() => handleViewWork(work._id)}
//               >
//                 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//                   <div className="flex-1">
//                     {/* Top Row */}
//                     <div className="flex items-center gap-2 mb-2 flex-wrap">
//                       <span className="font-mono text-sm font-bold text-red-600 bg-red-100 px-2 py-1 rounded">
//                         #{work.workId}
//                       </span>
//                       <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(work.status)}`}>
//                         {getStatusBadge(work.status)}
//                       </span>
//                       <span className="text-xs font-medium">
//                         {getPriorityDisplay(work.priority)}
//                       </span>
//                     </div>

//                     <h3 className="font-bold text-gray-800 mb-1">
//                       {work.garment?.name || 'Unknown Garment'}
//                     </h3>

//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
//                       <div className="flex items-center gap-1">
//                         <User size={14} className="text-gray-400" />
//                         <span>{work.customer?.name || 'Unknown'}</span>
//                       </div>

//                       <div className="flex items-center gap-1">
//                         <Package size={14} className="text-purple-500" />
//                         <span className="text-xs">
//                           Garment: {work.garment?.garmentId || 'N/A'}
//                         </span>
//                       </div>

//                       <div className="flex items-center gap-1 text-red-600 font-bold">
//                         <AlertCircle size={14} />
//                         <span>Overdue by {work.overdueBy} {work.overdueBy === 1 ? 'day' : 'days'}</span>
//                       </div>
//                     </div>
//                   </div>

//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       handleViewWork(work._id);
//                     }}
//                     className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition flex items-center gap-2 self-end md:self-center"
//                   >
//                     <Eye size={16} />
//                     View Details
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Overdue Summary */}
//           <div className="mt-4 pt-3 border-t border-red-200 flex justify-between items-center text-sm">
//             <span className="text-gray-600">Total Overdue:</span>
//             <span className="font-bold text-red-600">{overdueWorks.length} works</span>
//           </div>
//         </div>
//       )}

//       {/* High Priority Works Section */}
//       {highPriorityWorks.works.length > 0 && (
//         <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
//           <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
//             <Flag className="w-5 h-5 text-red-500" />
//             High Priority Works ({highPriorityWorks.count})
//           </h2>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//             {highPriorityWorks.works.map((work) => (
//               <div
//                 key={work._id}
//                 className="border border-red-200 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer bg-red-50"
//                 onClick={() => handleViewWork(work._id)}
//               >
//                 <div className="flex items-start justify-between mb-2">
//                   <span className="font-mono text-sm font-bold text-red-600">
//                     #{work.workId}
//                   </span>
//                   <span className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded-full">
//                     🔴 High
//                   </span>
//                 </div>
//                 <h3 className="font-bold text-gray-800 mb-1">
//                   {work.garment?.name || 'Unknown'}
//                 </h3>
//                 <p className="text-xs text-gray-500">
//                   👤 {work.customer?.name || 'Unknown'}
//                 </p>
//                 {work.estimatedDelivery && (
//                   <p className="text-xs text-red-600 mt-2">
//                     Due: {new Date(work.estimatedDelivery).toLocaleDateString()}
//                   </p>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Tailor Performance Section */}
//       <div className="bg-white rounded-xl shadow-sm p-6">
//         <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
//           <Users className="w-5 h-5 text-purple-600" />
//           Tailor Performance
//           {availableTailors.count > 0 && (
//             <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
//               {availableTailors.count} Available
//             </span>
//           )}
//         </h2>

//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead>
//               <tr className="border-b border-gray-200">
//                 <th className="text-left py-3 px-2 text-xs font-medium text-gray-500">Tailor</th>
//                 <th className="text-center py-3 px-2 text-xs font-medium text-gray-500">Assigned</th>
//                 <th className="text-center py-3 px-2 text-xs font-medium text-gray-500">Completed</th>
//                 <th className="text-center py-3 px-2 text-xs font-medium text-gray-500">Pending</th>
//                 <th className="text-center py-3 px-2 text-xs font-medium text-gray-500">In Progress</th>
//                 <th className="text-right py-3 px-2 text-xs font-medium text-gray-500">Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {tailorPerformance.tailors.length > 0 ? (
//                 tailorPerformance.tailors.map((tailor) => (
//                   <tr key={tailor._id} className="border-b border-gray-100 hover:bg-gray-50">
//                     <td className="py-3 px-2">
//                       <div className="font-medium text-gray-800">{tailor.name}</div>
//                       <div className="text-xs text-gray-500">{tailor.employeeId}</div>
//                     </td>
//                     <td className="text-center py-3 px-2 font-bold">{tailor.assigned}</td>
//                     <td className="text-center py-3 px-2 text-green-600 font-bold">{tailor.completed}</td>
//                     <td className="text-center py-3 px-2 text-yellow-600 font-bold">{tailor.pending}</td>
//                     <td className="text-center py-3 px-2 text-purple-600 font-bold">{tailor.inProgress}</td>
//                     <td className="text-right py-3 px-2">
//                       <button
//                         onClick={() => navigate(`/cuttingmaster/tailors/${tailor._id}`)}
//                         className="text-xs px-3 py-1 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition"
//                       >
//                         View
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="6" className="text-center py-8 text-gray-500">
//                     No tailors found
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }



// // Pages/works/CuttingMasterDashboard.jsx
// import React, { useState, useEffect, useCallback } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import {
//   Calendar,
//   ChevronLeft,
//   ChevronRight,
//   Scissors,
//   Clock,
//   CheckCircle,
//   AlertCircle,
//   Target,
//   Package,
//   Flag,
//   Users,
//   Eye,
//   RefreshCw,
//   User,
//   Filter,
//   Search,
//   X,
//   ArrowUpCircle,
//   ArrowDownCircle
// } from "lucide-react";
// import {
//   fetchDashboardStats,
//   fetchWorkStatusBreakdown,
//   fetchTailorPerformance,
//   fetchAvailableTailors,
//   fetchWorkQueue,
//   fetchTodaySummary,
//   fetchHighPriorityWorks,
//   fetchOverdueWorks,
//   fetchMonthlySchedule,
//   fetchWorksByDate,
//   selectDashboardStats,
//   selectStatusBreakdown,
//   selectTailorPerformance,
//   selectAvailableTailors,
//   selectWorkQueue,
//   selectTodaySummary,
//   selectHighPriorityWorks,
//   selectOverdueWorks,
//   selectMonthlySchedule,
//   selectWorksByDate,
//   selectCuttingMasterLoading
// } from "../features/cuttingMaster/cuttingMasterSlice";
// import showToast from "../utils/toast";
// import { debounce } from "lodash";

// export default function CuttingMasterDashboard() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   // Selectors
//   const dashboardStats = useSelector(selectDashboardStats);
//   const statusBreakdown = useSelector(selectStatusBreakdown);
//   const tailorPerformance = useSelector(selectTailorPerformance);
//   const availableTailors = useSelector(selectAvailableTailors);
//   const workQueue = useSelector(selectWorkQueue);
//   const todaySummary = useSelector(selectTodaySummary);
//   const highPriorityWorks = useSelector(selectHighPriorityWorks);
//   const overdueWorks = useSelector(selectOverdueWorks);
//   const monthlySchedule = useSelector(selectMonthlySchedule);
//   const dateWiseWorks = useSelector(selectWorksByDate);
//   const loading = useSelector(selectCuttingMasterLoading);

//   // Local state
//   const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
//   const [currentMonth, setCurrentMonth] = useState(new Date());
//   const [viewMode, setViewMode] = useState("today");
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [showFilters, setShowFilters] = useState(false);
//   const [calendarDays, setCalendarDays] = useState([]);
//   const [showOverdueOnly, setShowOverdueOnly] = useState(false);

//   // Load initial data
//   useEffect(() => {
//     loadDashboardData();
//   }, []);

//   // Load data when month changes
//   useEffect(() => {
//     loadMonthlySchedule();
//   }, [currentMonth]);

//   // Load data when selected date changes
//   useEffect(() => {
//     if (selectedDate) {
//       dispatch(fetchWorksByDate(selectedDate));
//       dispatch(fetchWorkQueue({ 
//         date: selectedDate, 
//         status: statusFilter, 
//         search: searchTerm 
//       }));
//     }
//   }, [selectedDate, dispatch]);

//   // Generate calendar days when monthly schedule changes
//   useEffect(() => {
//     if (monthlySchedule) {
//       generateCalendarDays();
//     }
//   }, [currentMonth, monthlySchedule]);

//   const loadDashboardData = async () => {
//     try {
//       await Promise.all([
//         dispatch(fetchDashboardStats()),
//         dispatch(fetchWorkStatusBreakdown()),
//         dispatch(fetchTailorPerformance()),
//         dispatch(fetchAvailableTailors()),
//         dispatch(fetchTodaySummary()),
//         dispatch(fetchHighPriorityWorks()),
//         dispatch(fetchOverdueWorks()) // ✅ Added overdue works fetch
//       ]);
      
//       // Load work queue for selected date
//       dispatch(fetchWorkQueue({ 
//         date: selectedDate, 
//         status: statusFilter, 
//         search: searchTerm 
//       }));
      
//       showToast.success("Dashboard data loaded successfully");
//     } catch (error) {
//       showToast.error("Failed to load dashboard data");
//     }
//   };

//   const loadMonthlySchedule = async () => {
//     try {
//       const year = currentMonth.getFullYear();
//       const month = currentMonth.getMonth() + 1;
//       await dispatch(fetchMonthlySchedule({ year, month }));
//     } catch (error) {
//       console.error("Failed to load schedule:", error);
//     }
//   };

//   const generateCalendarDays = () => {
//     const year = currentMonth.getFullYear();
//     const month = currentMonth.getMonth();
    
//     const firstDay = new Date(year, month, 1);
//     const lastDay = new Date(year, month + 1, 0);
    
//     const days = [];
//     const startDay = firstDay.getDay();
    
//     for (let i = 0; i < startDay; i++) {
//       days.push(null);
//     }
    
//     for (let d = 1; d <= lastDay.getDate(); d++) {
//       const date = new Date(year, month, d);
//       const dateStr = date.toISOString().split('T')[0];
      
//       const daySchedule = monthlySchedule?.[dateStr] || { 
//         hasWork: false, 
//         hasOverdue: false, 
//         workCount: 0 
//       };
      
//       days.push({
//         date,
//         dateStr,
//         day: d,
//         hasWork: daySchedule.hasWork || false,
//         hasOverdue: daySchedule.hasOverdue || false,
//         workCount: daySchedule.workCount || 0
//       });
//     }
    
//     setCalendarDays(days);
//   };

//   const debouncedSearch = useCallback(
//     debounce((term) => {
//       dispatch(fetchWorkQueue({ 
//         date: selectedDate,
//         status: statusFilter, 
//         search: term 
//       }));
//     }, 500),
//     [selectedDate, statusFilter]
//   );

//   const handleRefresh = () => {
//     loadDashboardData();
//     loadMonthlySchedule();
//     showToast.success("Dashboard refreshed");
//   };

//   const handlePrevMonth = () => {
//     const newMonth = new Date(currentMonth);
//     newMonth.setMonth(currentMonth.getMonth() - 1);
//     setCurrentMonth(newMonth);
//   };

//   const handleNextMonth = () => {
//     const newMonth = new Date(currentMonth);
//     newMonth.setMonth(currentMonth.getMonth() + 1);
//     setCurrentMonth(newMonth);
//   };

//   const handleDateSelect = (day) => {
//     if (day) {
//       setSelectedDate(day.dateStr);
//       setViewMode("custom");
//     }
//   };

//   const handleViewWork = (workId) => {
//     navigate(`/cuttingmaster/works/${workId}`);
//   };

//   const handleViewTailor = (tailorId) => {
//     navigate(`/cuttingmaster/tailors/${tailorId}`);
//   };

//   const handleStatusFilter = (e) => {
//     const status = e.target.value;
//     setStatusFilter(status);
//     dispatch(fetchWorkQueue({ 
//       date: selectedDate,
//       status, 
//       search: searchTerm 
//     }));
//   };

//   const handleSearch = (e) => {
//     const term = e.target.value;
//     setSearchTerm(term);
//     debouncedSearch(term);
//   };

//   const handleViewModeChange = (mode) => {
//     setViewMode(mode);
//     const date = new Date();
//     if (mode === "tomorrow") {
//       date.setDate(date.getDate() + 1);
//     }
//     const dateStr = date.toISOString().split('T')[0];
//     setSelectedDate(dateStr);
//   };

//   const clearSearch = () => {
//     setSearchTerm("");
//     dispatch(fetchWorkQueue({ 
//       date: selectedDate,
//       status: statusFilter, 
//       search: "" 
//     }));
//   };

//   const formatDate = (dateStr) => {
//     return new Date(dateStr).toLocaleDateString('en-IN', {
//       day: 'numeric',
//       month: 'long',
//       year: 'numeric'
//     });
//   };

//   const getStatusColor = (status) => {
//     const colors = {
//       'pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
//       'accepted': 'bg-blue-100 text-blue-800 border-blue-200',
//       'cutting-started': 'bg-purple-100 text-purple-800 border-purple-200',
//       'cutting-completed': 'bg-indigo-100 text-indigo-800 border-indigo-200',
//       'sewing-started': 'bg-pink-100 text-pink-800 border-pink-200',
//       'sewing-completed': 'bg-teal-100 text-teal-800 border-teal-200',
//       'ironing': 'bg-orange-100 text-orange-800 border-orange-200',
//       'ready-to-deliver': 'bg-green-100 text-green-800 border-green-200'
//     };
//     return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
//   };

//   const getStatusBadge = (status) => {
//     const badges = {
//       'pending': '⏳ Pending',
//       'accepted': '✅ Accepted',
//       'cutting-started': '✂️ Cutting Started',
//       'cutting-completed': '✔️ Cutting Completed',
//       'sewing-started': '🧵 Sewing Started',
//       'sewing-completed': '🧵 Sewing Completed',
//       'ironing': '🔥 Ironing',
//       'ready-to-deliver': '📦 Ready to Deliver'
//     };
//     return badges[status] || status;
//   };

//   const getPriorityDisplay = (priority) => {
//     if (priority === 'high') return '🔴 High';
//     if (priority === 'normal') return '🟠 Normal';
//     return '🟢 Low';
//   };

//   const getPriorityColor = (priority) => {
//     if (priority === 'high') return 'border-l-4 border-l-red-500';
//     if (priority === 'normal') return 'border-l-4 border-l-orange-400';
//     return 'border-l-4 border-l-green-500';
//   };

//   const getOverdueColor = (days) => {
//     if (days > 5) return 'text-red-700 font-bold';
//     if (days > 2) return 'text-red-600 font-semibold';
//     return 'text-red-500';
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 md:p-6">
//       {/* ========== HEADER SECTION ========== */}
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
//         <div>
//           <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
//             <Scissors className="w-8 h-8 text-purple-600" />
//             Cutting Master Dashboard
//           </h1>
//           <p className="text-sm text-gray-500 mt-1">
//             {formatDate(new Date().toISOString().split('T')[0])}
//           </p>
//         </div>

//         <div className="flex items-center gap-3">
//           {/* Overdue Toggle Button */}
//           <button
//             onClick={() => setShowOverdueOnly(!showOverdueOnly)}
//             className={`px-4 py-2 rounded-lg transition flex items-center gap-2 shadow-sm ${
//               showOverdueOnly 
//                 ? 'bg-red-100 text-red-700 border border-red-300' 
//                 : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
//             }`}
//           >
//             <AlertCircle size={18} />
//             <span>Show Overdue Only</span>
//             {overdueWorks?.count > 0 && (
//               <span className="ml-1 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
//                 {overdueWorks.count}
//               </span>
//             )}
//           </button>

//           <button
//             onClick={handleRefresh}
//             disabled={loading}
//             className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center gap-2 shadow-sm disabled:opacity-50"
//           >
//             <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
//             Refresh
//           </button>
//         </div>
//       </div>

//       {/* ========== KPI CARDS SECTION ========== */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//         <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-blue-500">
//           <div className="flex items-center justify-between mb-2">
//             <p className="text-sm text-gray-500">Total Work</p>
//             <Package className="w-5 h-5 text-blue-500" />
//           </div>
//           <p className="text-3xl font-bold text-gray-800">
//             {dashboardStats?.totalWork || 0}
//           </p>
//           <p className="text-xs text-gray-400 mt-1">All assigned works</p>
//         </div>

//         <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-green-500">
//           <div className="flex items-center justify-between mb-2">
//             <p className="text-sm text-gray-500">Completed Work</p>
//             <CheckCircle className="w-5 h-5 text-green-500" />
//           </div>
//           <p className="text-3xl font-bold text-gray-800">
//             {dashboardStats?.completedWork || 0}
//           </p>
//           <p className="text-xs text-gray-400 mt-1">Ready to deliver</p>
//         </div>

//         <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-purple-500">
//           <div className="flex items-center justify-between mb-2">
//             <p className="text-sm text-gray-500">In Progress</p>
//             <Clock className="w-5 h-5 text-purple-500" />
//           </div>
//           <p className="text-3xl font-bold text-gray-800">
//             {dashboardStats?.inProgressWork || 0}
//           </p>
//           <p className="text-xs text-gray-400 mt-1">Cutting/Sewing/Ironing</p>
//         </div>

//         <div 
//           className={`bg-white rounded-xl p-6 shadow-sm border-l-4 cursor-pointer transition ${
//             overdueWorks?.count > 0 ? 'border-l-red-500 hover:bg-red-50' : 'border-l-gray-300'
//           }`}
//           onClick={() => {
//             if (overdueWorks?.count > 0) {
//               document.getElementById('overdue-section').scrollIntoView({ behavior: 'smooth' });
//             }
//           }}
//         >
//           <div className="flex items-center justify-between mb-2">
//             <p className="text-sm text-gray-500">Overdue</p>
//             <AlertCircle className={`w-5 h-5 ${overdueWorks?.count > 0 ? 'text-red-500' : 'text-gray-400'}`} />
//           </div>
//           <p className={`text-3xl font-bold ${overdueWorks?.count > 0 ? 'text-red-600' : 'text-gray-800'}`}>
//             {dashboardStats?.overdueWork || 0}
//           </p>
//           <p className="text-xs text-gray-400 mt-1">Past delivery date</p>
//           {overdueWorks?.count > 0 && (
//             <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
//               <ArrowDownCircle size={12} />
//               Click to view overdue
//             </p>
//           )}
//         </div>
//       </div>

//       {/* ========== MAIN GRID - CALENDAR + WORK QUEUE ========== */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
//         {/* LEFT COLUMN - CALENDAR */}
//         <div className="lg:col-span-1">
//           <div className="bg-white rounded-xl shadow-sm p-4">
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="font-bold text-gray-800 flex items-center gap-2">
//                 <Calendar className="w-5 h-5 text-purple-600" />
//                 {currentMonth.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
//               </h2>
//               <div className="flex gap-1">
//                 <button
//                   onClick={handlePrevMonth}
//                   className="p-1 hover:bg-gray-100 rounded-lg transition"
//                 >
//                   <ChevronLeft size={18} />
//                 </button>
//                 <button
//                   onClick={handleNextMonth}
//                   className="p-1 hover:bg-gray-100 rounded-lg transition"
//                 >
//                   <ChevronRight size={18} />
//                 </button>
//               </div>
//             </div>

//             {/* Calendar Header */}
//             <div className="grid grid-cols-7 gap-1 mb-2 text-center text-xs font-medium text-gray-500">
//               <div>Su</div>
//               <div>Mo</div>
//               <div>Tu</div>
//               <div>We</div>
//               <div>Th</div>
//               <div>Fr</div>
//               <div>Sa</div>
//             </div>

//             {/* Calendar Days */}
//             <div className="grid grid-cols-7 gap-1">
//               {calendarDays.map((day, index) => (
//                 <div key={index} className="aspect-square">
//                   {day ? (
//                     <button
//                       onClick={() => handleDateSelect(day)}
//                       className={`w-full h-full flex items-center justify-center rounded-lg text-sm transition-all relative
//                         ${selectedDate === day.dateStr 
//                           ? 'bg-purple-600 text-white font-bold' 
//                           : 'hover:bg-gray-100'
//                         }
//                       `}
//                     >
//                       <span>{day.day}</span>
//                       {day.hasWork && !day.hasOverdue && (
//                         <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"></span>
//                       )}
//                       {day.hasOverdue && (
//                         <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
//                       )}
//                       {day.workCount > 0 && (
//                         <span className="absolute -bottom-1 text-[8px] font-bold bg-purple-600 text-white px-1 rounded-full">
//                           {day.workCount}
//                         </span>
//                       )}
//                     </button>
//                   ) : (
//                     <div className="w-full h-full"></div>
//                   )}
//                 </div>
//               ))}
//             </div>

//             {/* Calendar Legend */}
//             <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap items-center gap-4 text-xs">
//               <div className="flex items-center gap-1">
//                 <span className="w-3 h-3 bg-green-500 rounded-full"></span>
//                 <span>Has Works</span>
//               </div>
//               <div className="flex items-center gap-1">
//                 <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
//                 <span>Overdue</span>
//               </div>
//               <div className="flex items-center gap-1">
//                 <span className="w-3 h-3 bg-purple-600 rounded-full"></span>
//                 <span>Selected</span>
//               </div>
//             </div>

//             {/* Selected Date Summary */}
//             {selectedDate && dateWiseWorks && (
//               <div className="mt-4 p-3 bg-purple-50 rounded-lg">
//                 <p className="text-sm font-medium text-purple-700">
//                   {formatDate(selectedDate)}
//                 </p>
//                 <div className="grid grid-cols-3 gap-2 mt-2 text-xs">
//                   <div className="text-center">
//                     <span className="block font-bold text-purple-700">{dateWiseWorks.total || 0}</span>
//                     <span className="text-gray-500">Total</span>
//                   </div>
//                   <div className="text-center">
//                     <span className="block font-bold text-green-600">{dateWiseWorks.completed || 0}</span>
//                     <span className="text-gray-500">Completed</span>
//                   </div>
//                   <div className="text-center">
//                     <span className="block font-bold text-yellow-600">{dateWiseWorks.pending || 0}</span>
//                     <span className="text-gray-500">Pending</span>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Today's Summary Card */}
//           {todaySummary && (
//             <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4 mt-4">
//               <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
//                 <Target className="w-4 h-4 text-blue-600" />
//                 Today's Focus
//               </h3>
//               <div className="space-y-2">
//                 <div className="flex justify-between text-sm">
//                   <span>Due Today:</span>
//                   <span className="font-bold text-red-600">{todaySummary.dueToday || 0}</span>
//                 </div>
//                 <div className="flex justify-between text-sm">
//                   <span>High Priority:</span>
//                   <span className="font-bold text-red-600">{todaySummary.highPriority || 0}</span>
//                 </div>
//                 <div className="flex justify-between text-sm">
//                   <span>Completed Today:</span>
//                   <span className="font-bold text-green-600">{todaySummary.completedToday || 0}</span>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* RIGHT COLUMN - WORK QUEUE */}
//         <div className="lg:col-span-2">
//           <div className="bg-white rounded-xl shadow-sm p-6">
//             <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
//               <h2 className="font-bold text-gray-800 flex items-center gap-2">
//                 <Package className="w-5 h-5 text-purple-600" />
//                 Work Queue - {formatDate(selectedDate)}
//                 {showOverdueOnly && (
//                   <span className="ml-2 px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
//                     Overdue Only
//                   </span>
//                 )}
//               </h2>

//               <div className="flex gap-2">
//                 {/* View Mode Toggle */}
//                 <div className="flex bg-gray-100 rounded-lg p-1">
//                   <button
//                     onClick={() => handleViewModeChange("today")}
//                     className={`px-3 py-1.5 text-xs rounded-md transition ${
//                       viewMode === "today" ? "bg-purple-600 text-white" : "text-gray-600"
//                     }`}
//                   >
//                     Today
//                   </button>
//                   <button
//                     onClick={() => handleViewModeChange("tomorrow")}
//                     className={`px-3 py-1.5 text-xs rounded-md transition ${
//                       viewMode === "tomorrow" ? "bg-purple-600 text-white" : "text-gray-600"
//                     }`}
//                   >
//                     Tomorrow
//                   </button>
//                 </div>

//                 {/* Filter Toggle */}
//                 <button
//                   onClick={() => setShowFilters(!showFilters)}
//                   className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
//                 >
//                   <Filter size={16} />
//                 </button>
//               </div>
//             </div>

//             {/* Filters */}
//             {showFilters && (
//               <div className="mb-4 p-3 bg-gray-50 rounded-lg">
//                 <div className="flex flex-col md:flex-row gap-3">
//                   {/* Status Filter */}
//                   <select
//                     value={statusFilter}
//                     onChange={handleStatusFilter}
//                     className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
//                   >
//                     <option value="all">All Status</option>
//                     <option value="pending">Pending</option>
//                     <option value="accepted">Accepted</option>
//                     <option value="cutting-started">Cutting Started</option>
//                     <option value="cutting-completed">Cutting Completed</option>
//                     <option value="sewing-started">Sewing Started</option>
//                     <option value="sewing-completed">Sewing Completed</option>
//                     <option value="ironing">Ironing</option>
//                     <option value="ready-to-deliver">Ready to Deliver</option>
//                   </select>

//                   {/* Search */}
//                   <div className="relative flex-1">
//                     <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                     <input
//                       type="text"
//                       value={searchTerm}
//                       onChange={handleSearch}
//                       placeholder="Search by Work ID or Customer..."
//                       className="w-full pl-9 pr-8 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
//                     />
//                     {searchTerm && (
//                       <button
//                         onClick={clearSearch}
//                         className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                       >
//                         <X size={16} />
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Work List */}
//             <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
//               {workQueue?.works?.length > 0 ? (
//                 workQueue.works
//                   .filter(work => !showOverdueOnly || (work.estimatedDelivery && new Date(work.estimatedDelivery) < new Date()))
//                   .map((work) => (
//                     <div
//                       key={work._id}
//                       className={`border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer ${getPriorityColor(work.priority)} ${
//                         work.estimatedDelivery && new Date(work.estimatedDelivery) < new Date() && work.status !== 'ready-to-deliver'
//                           ? 'bg-red-50 border-red-300'
//                           : ''
//                       }`}
//                       onClick={() => handleViewWork(work._id)}
//                     >
//                       <div className="flex items-start justify-between mb-2">
//                         <div className="flex items-center gap-2 flex-wrap">
//                           <span className="font-mono text-sm font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded">
//                             #{work.workId}
//                           </span>
//                           <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(work.status)}`}>
//                             {getStatusBadge(work.status)}
//                           </span>
//                           <span className="text-xs font-medium">
//                             {getPriorityDisplay(work.priority)}
//                           </span>
//                           {work.estimatedDelivery && new Date(work.estimatedDelivery) < new Date() && work.status !== 'ready-to-deliver' && (
//                             <span className="px-2 py-1 bg-red-200 text-red-800 rounded-full text-xs font-bold animate-pulse">
//                               ⚠️ OVERDUE
//                             </span>
//                           )}
//                         </div>
//                         <button
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             handleViewWork(work._id);
//                           }}
//                           className="p-1 hover:bg-gray-100 rounded-lg transition"
//                         >
//                           <Eye size={16} className="text-gray-600" />
//                         </button>
//                       </div>

//                       <h3 className="font-bold text-gray-800 mb-1">
//                         {work.garment?.name || 'Unknown Garment'}
//                       </h3>

//                       <div className="grid grid-cols-2 gap-2 text-sm">
//                         <div className="flex items-center gap-1">
//                           <User size={14} className="text-gray-400" />
//                           <span>{work.customer?.name || 'Unknown'}</span>
//                         </div>

//                         <div className="flex items-center gap-1">
//                           <Package size={14} className="text-purple-500" />
//                           <span className="text-xs">
//                             Garment: {work.garment?.garmentId || 'N/A'}
//                           </span>
//                         </div>
//                       </div>

//                       {work.tailor && (
//                         <div className="mt-2 text-xs text-gray-500">
//                           👔 Tailor: {work.tailor.name}
//                         </div>
//                       )}

//                       {work.estimatedDelivery && (
//                         <div className="mt-2 text-xs">
//                           <span className="text-gray-500">📅 Due: </span>
//                           <span className={new Date(work.estimatedDelivery) < new Date() && work.status !== 'ready-to-deliver' 
//                             ? 'text-red-600 font-bold' 
//                             : 'text-gray-700'
//                           }>
//                             {new Date(work.estimatedDelivery).toLocaleDateString()}
//                             {new Date(work.estimatedDelivery) < new Date() && work.status !== 'ready-to-deliver' && (
//                               <span className="ml-2 text-red-600">
//                                 (Overdue by {Math.ceil((new Date() - new Date(work.estimatedDelivery)) / (1000 * 60 * 60 * 24))} days)
//                               </span>
//                             )}
//                           </span>
//                         </div>
//                       )}
//                     </div>
//                   ))
//               ) : (
//                 <div className="text-center py-12 text-gray-500">
//                   <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
//                   <p className="font-medium">No works found</p>
//                   <p className="text-sm text-gray-400 mt-1">
//                     Try adjusting your filters or select another date
//                   </p>
//                 </div>
//               )}
//             </div>

//             {/* Work Queue Stats */}
//             {workQueue?.works?.length > 0 && (
//               <div className="mt-4 pt-3 border-t border-gray-200 flex justify-between text-xs text-gray-600">
//                 <span>Total: <span className="font-bold">{workQueue.total}</span></span>
//                 <span>✅ Completed: <span className="font-bold text-green-600">
//                   {workQueue.works.filter(w => w.status === 'ready-to-deliver').length}
//                 </span></span>
//                 <span>⏳ Pending: <span className="font-bold text-yellow-600">
//                   {workQueue.works.filter(w => w.status !== 'ready-to-deliver').length}
//                 </span></span>
//                 <span>⚠️ Overdue: <span className="font-bold text-red-600">
//                   {workQueue.works.filter(w => 
//                     w.estimatedDelivery && 
//                     new Date(w.estimatedDelivery) < new Date() && 
//                     w.status !== 'ready-to-deliver'
//                   ).length}
//                 </span></span>
//               </div>
//             )}

//             {/* Pagination Info */}
//             {workQueue?.totalPages > 1 && (
//               <div className="mt-4 flex justify-center gap-2 text-xs">
//                 <span className="text-gray-500">
//                   Page {workQueue.page} of {workQueue.totalPages}
//                 </span>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* ========== OVERDUE WORKS SECTION (ADDED) ========== */}
//       <div id="overdue-section">
//         {overdueWorks?.works?.length > 0 && (
//           <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border-2 border-red-200">
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="font-bold text-gray-800 flex items-center gap-2">
//                 <AlertCircle className="w-6 h-6 text-red-500 animate-pulse" />
//                 ⚠️ OVERDUE WORKS ({overdueWorks.count || 0})
//               </h2>
//               <button
//                 onClick={() => {
//                   if (showOverdueOnly) {
//                     setShowOverdueOnly(false);
//                   } else {
//                     setShowOverdueOnly(true);
//                     document.getElementById('work-queue').scrollIntoView({ behavior: 'smooth' });
//                   }
//                 }}
//                 className="px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition text-sm flex items-center gap-1"
//               >
//                 {showOverdueOnly ? 'Show All' : 'View All in Queue'}
//                 <ArrowUpCircle size={14} />
//               </button>
//             </div>

//             <div className="space-y-3">
//               {overdueWorks.works.map((work) => {
//                 const overdueDays = work.overdueBy || 
//                   Math.ceil((new Date() - new Date(work.estimatedDelivery)) / (1000 * 60 * 60 * 24));
                
//                 return (
//                   <div
//                     key={work._id}
//                     className="border border-red-300 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer bg-gradient-to-r from-red-50 to-orange-50"
//                     onClick={() => handleViewWork(work._id)}
//                   >
//                     <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//                       <div className="flex-1">
//                         {/* Top Row */}
//                         <div className="flex items-center gap-2 mb-2 flex-wrap">
//                           <span className="font-mono text-sm font-bold text-red-600 bg-red-100 px-2 py-1 rounded">
//                             #{work.workId}
//                           </span>
//                           <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(work.status)}`}>
//                             {getStatusBadge(work.status)}
//                           </span>
//                           <span className="text-xs font-medium">
//                             {getPriorityDisplay(work.priority)}
//                           </span>
//                           <span className="px-2 py-1 bg-red-200 text-red-800 rounded-full text-xs font-bold">
//                             ⚠️ OVERDUE
//                           </span>
//                         </div>

//                         <h3 className="font-bold text-gray-800 mb-1">
//                           {work.garment?.name || 'Unknown Garment'}
//                         </h3>

//                         <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-sm">
//                           <div className="flex items-center gap-1">
//                             <User size={14} className="text-gray-400" />
//                             <span>{work.customer?.name || 'Unknown'}</span>
//                           </div>

//                           <div className="flex items-center gap-1">
//                             <Package size={14} className="text-purple-500" />
//                             <span className="text-xs">
//                               {work.garment?.garmentId || 'N/A'}
//                             </span>
//                           </div>

//                           <div className="flex items-center gap-1">
//                             <Calendar size={14} className="text-gray-400" />
//                             <span className="text-xs">
//                               Due: {new Date(work.estimatedDelivery).toLocaleDateString()}
//                             </span>
//                           </div>

//                           <div className="flex items-center gap-1">
//                             <AlertCircle size={14} className="text-red-600" />
//                             <span className={`text-sm font-bold ${getOverdueColor(overdueDays)}`}>
//                               Overdue by {overdueDays} {overdueDays === 1 ? 'day' : 'days'}
//                             </span>
//                           </div>
//                         </div>

//                         {/* Progress Bar for Overdue */}
//                         <div className="mt-3">
//                           <div className="flex items-center gap-2">
//                             <span className="text-xs text-gray-600">Delay:</span>
//                             <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
//                               <div 
//                                 className="h-full bg-red-500 rounded-full"
//                                 style={{ 
//                                   width: `${Math.min(overdueDays * 10, 100)}%`,
//                                   backgroundColor: overdueDays > 10 ? '#7f1d1d' : '#ef4444'
//                                 }}
//                               ></div>
//                             </div>
//                             <span className="text-xs font-bold text-red-600">
//                               +{overdueDays} days
//                             </span>
//                           </div>
//                         </div>
//                       </div>

//                       <button
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           handleViewWork(work._id);
//                         }}
//                         className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2 self-end md:self-center shadow-sm"
//                       >
//                         <Eye size={16} />
//                         Take Action
//                       </button>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>

//             {/* Overdue Summary Stats */}
//             <div className="mt-4 pt-3 border-t border-red-200 grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
//               <div className="bg-red-50 p-3 rounded-lg text-center">
//                 <span className="block font-bold text-2xl text-red-600">{overdueWorks.count || 0}</span>
//                 <span className="text-xs text-gray-600">Total Overdue</span>
//               </div>
//               <div className="bg-orange-50 p-3 rounded-lg text-center">
//                 <span className="block font-bold text-2xl text-orange-600">
//                   {overdueWorks.works.filter(w => w.priority === 'high').length}
//                 </span>
//                 <span className="text-xs text-gray-600">High Priority</span>
//               </div>
//               <div className="bg-yellow-50 p-3 rounded-lg text-center">
//                 <span className="block font-bold text-2xl text-yellow-600">
//                   {overdueWorks.works.filter(w => w.priority === 'normal').length}
//                 </span>
//                 <span className="text-xs text-gray-600">Normal Priority</span>
//               </div>
//               <div className="bg-green-50 p-3 rounded-lg text-center">
//                 <span className="block font-bold text-2xl text-green-600">
//                   {overdueWorks.works.filter(w => w.tailor).length}
//                 </span>
//                 <span className="text-xs text-gray-600">Assigned</span>
//               </div>
//             </div>

//             {/* Action Buttons */}
//             <div className="mt-4 flex justify-end gap-3">
//               <button
//                 onClick={() => {
//                   setShowOverdueOnly(true);
//                   document.getElementById('work-queue').scrollIntoView({ behavior: 'smooth' });
//                 }}
//                 className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition text-sm flex items-center gap-2"
//               >
//                 <AlertCircle size={16} />
//                 View All in Queue
//               </button>
//               <button
//                 onClick={loadDashboardData}
//                 className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm flex items-center gap-2"
//               >
//                 <RefreshCw size={16} />
//                 Refresh
//               </button>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* ========== HIGH PRIORITY WORKS SECTION ========== */}
//       {highPriorityWorks?.works?.length > 0 && (
//         <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
//           <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
//             <Flag className="w-5 h-5 text-red-500" />
//             High Priority Works ({highPriorityWorks.count || 0})
//           </h2>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//             {highPriorityWorks.works.map((work) => (
//               <div
//                 key={work._id}
//                 className="border border-red-200 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer bg-gradient-to-br from-red-50 to-orange-50"
//                 onClick={() => handleViewWork(work._id)}
//               >
//                 <div className="flex items-start justify-between mb-2">
//                   <span className="font-mono text-sm font-bold text-red-600">
//                     #{work.workId}
//                   </span>
//                   <span className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded-full">
//                     🔴 High
//                   </span>
//                 </div>
//                 <h3 className="font-bold text-gray-800 mb-1">
//                   {work.garment?.name || 'Unknown'}
//                 </h3>
//                 <p className="text-xs text-gray-500 flex items-center gap-1">
//                   <User size={12} /> {work.customer?.name || 'Unknown'}
//                 </p>
//                 {work.estimatedDelivery && (
//                   <p className={`text-xs mt-2 flex items-center gap-1 ${
//                     new Date(work.estimatedDelivery) < new Date() 
//                       ? 'text-red-600 font-bold' 
//                       : 'text-orange-600'
//                   }`}>
//                     <Calendar size={12} />
//                     Due: {new Date(work.estimatedDelivery).toLocaleDateString()}
//                     {new Date(work.estimatedDelivery) < new Date() && ' (Overdue)'}
//                   </p>
//                 )}
//                 {work.tailor && (
//                   <p className="text-xs text-gray-500 mt-2">
//                     👔 Assigned to: {work.tailor.name}
//                   </p>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* ========== TAILOR PERFORMANCE SECTION ========== */}
//       <div className="bg-white rounded-xl shadow-sm p-6">
//         <div className="flex items-center justify-between mb-4">
//           <h2 className="font-bold text-gray-800 flex items-center gap-2">
//             <Users className="w-5 h-5 text-purple-600" />
//             Tailor Performance
//           </h2>
//           {availableTailors?.summary?.available > 0 && (
//             <div className="flex items-center gap-3">
//               <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full flex items-center gap-1">
//                 <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
//                 {availableTailors.summary.available} Available Now
//               </span>
//               <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">
//                 {availableTailors.summary.onLeave || 0} On Leave
//               </span>
//             </div>
//           )}
//         </div>

//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead>
//               <tr className="border-b border-gray-200 bg-gray-50">
//                 <th className="text-left py-3 px-2 text-xs font-medium text-gray-500">Tailor</th>
//                 <th className="text-center py-3 px-2 text-xs font-medium text-gray-500">Assigned</th>
//                 <th className="text-center py-3 px-2 text-xs font-medium text-gray-500">Completed</th>
//                 <th className="text-center py-3 px-2 text-xs font-medium text-gray-500">Pending</th>
//                 <th className="text-center py-3 px-2 text-xs font-medium text-gray-500">In Progress</th>
//                 <th className="text-center py-3 px-2 text-xs font-medium text-gray-500">Efficiency</th>
//                 <th className="text-center py-3 px-2 text-xs font-medium text-gray-500">Status</th>
//                 <th className="text-right py-3 px-2 text-xs font-medium text-gray-500">Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {tailorPerformance?.tailors?.length > 0 ? (
//                 tailorPerformance.tailors.map((tailor) => {
//                   const isAvailable = availableTailors?.availableTailors?.some(t => t._id === tailor._id);
                  
//                   return (
//                     <tr key={tailor._id} className="border-b border-gray-100 hover:bg-gray-50">
//                       <td className="py-3 px-2">
//                         <div className="font-medium text-gray-800">{tailor.name}</div>
//                         <div className="text-xs text-gray-500">{tailor.employeeId}</div>
//                       </td>
//                       <td className="text-center py-3 px-2 font-bold">{tailor.assigned || 0}</td>
//                       <td className="text-center py-3 px-2 text-green-600 font-bold">{tailor.completed || 0}</td>
//                       <td className="text-center py-3 px-2 text-yellow-600 font-bold">{tailor.pending || 0}</td>
//                       <td className="text-center py-3 px-2 text-purple-600 font-bold">{tailor.inProgress || 0}</td>
//                       <td className="text-center py-3 px-2">
//                         <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                           tailor.efficiency >= 80 ? 'bg-green-100 text-green-700' :
//                           tailor.efficiency >= 60 ? 'bg-blue-100 text-blue-700' :
//                           tailor.efficiency >= 40 ? 'bg-yellow-100 text-yellow-700' :
//                           'bg-red-100 text-red-700'
//                         }`}>
//                           {tailor.efficiency || 0}%
//                         </span>
//                       </td>
//                       <td className="text-center py-3 px-2">
//                         {isAvailable ? (
//                           <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs flex items-center justify-center gap-1">
//                             <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
//                             Available
//                           </span>
//                         ) : (
//                           <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
//                             Busy
//                           </span>
//                         )}
//                       </td>
//                       <td className="text-right py-3 px-2">
//                         <button
//                           onClick={() => handleViewTailor(tailor._id)}
//                           className="text-xs px-3 py-1 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition"
//                         >
//                           View Profile
//                         </button>
//                       </td>
//                     </tr>
//                   );
//                 })
//               ) : (
//                 <tr>
//                   <td colSpan="8" className="text-center py-8 text-gray-500">
//                     No tailors found
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* Availability Summary */}
//         {availableTailors?.summary && (
//           <div className="mt-4 pt-3 border-t border-gray-200 grid grid-cols-3 gap-4 text-center text-sm">
//             <div className="bg-blue-50 p-2 rounded-lg">
//               <span className="block font-bold text-blue-700">{availableTailors.summary.total || 0}</span>
//               <span className="text-gray-500 text-xs">Total Tailors</span>
//             </div>
//             <div className="bg-green-50 p-2 rounded-lg">
//               <span className="block font-bold text-green-600">{availableTailors.summary.available || 0}</span>
//               <span className="text-gray-500 text-xs">Available Now</span>
//             </div>
//             <div className="bg-orange-50 p-2 rounded-lg">
//               <span className="block font-bold text-orange-600">{availableTailors.summary.onLeave || 0}</span>
//               <span className="text-gray-500 text-xs">On Leave</span>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }




// // Pages/works/CuttingMasterDashboard.jsx
// import React, { useState, useEffect, useCallback } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import {
//   Calendar,
//   ChevronLeft,
//   ChevronRight,
//   Scissors,
//   Clock,
//   CheckCircle,
//   AlertCircle,
//   Target,
//   Package,
//   Flag,
//   Users,
//   Eye,
//   RefreshCw,
//   User,
//   Filter,
//   Search,
//   X,
//   ArrowUpCircle,
//   ArrowDownCircle
// } from "lucide-react";
// import {
//   fetchDashboardStats,
//   fetchWorkStatusBreakdown,
//   fetchTailorPerformance,
//   fetchAvailableTailors,
//   fetchWorkQueue,
//   fetchTodaySummary,
//   fetchHighPriorityWorks,
//   fetchOverdueWorks,
//   fetchMonthlySchedule,
//   fetchWorksByDate,
//   selectDashboardStats,
//   selectStatusBreakdown,
//   selectTailorPerformance,
//   selectAvailableTailors,
//   selectWorkQueue,
//   selectTodaySummary,
//   selectHighPriorityWorks,
//   selectOverdueWorks,
//   selectMonthlySchedule,
//   selectWorksByDate,
//   selectCuttingMasterLoading
// } from "../features/cuttingMaster/cuttingMasterSlice";
// import showToast from "../utils/toast";
// import { debounce } from "lodash";

// export default function CuttingMasterDashboard() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   // Selectors
//   const dashboardStats = useSelector(selectDashboardStats);
//   const statusBreakdown = useSelector(selectStatusBreakdown);
//   const tailorPerformance = useSelector(selectTailorPerformance);
//   const availableTailors = useSelector(selectAvailableTailors);
//   const workQueue = useSelector(selectWorkQueue);
//   const todaySummary = useSelector(selectTodaySummary);
//   const highPriorityWorks = useSelector(selectHighPriorityWorks);
//   const overdueWorks = useSelector(selectOverdueWorks);
//   const monthlySchedule = useSelector(selectMonthlySchedule);
//   const dateWiseWorks = useSelector(selectWorksByDate);
//   const loading = useSelector(selectCuttingMasterLoading);

//   // ===== FIX: Get today's date correctly =====
//   const today = new Date();
//   const todayDateStr = today.toISOString().split('T')[0]; // "2026-03-14"
  
//   // Local state
//   const [selectedDate, setSelectedDate] = useState(todayDateStr); // Use today's date
//   const [currentMonth, setCurrentMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1)); // Set to March 2026
//   const [viewMode, setViewMode] = useState("today");
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [showFilters, setShowFilters] = useState(false);
//   const [calendarDays, setCalendarDays] = useState([]);
//   const [showOverdueOnly, setShowOverdueOnly] = useState(false);

//   // Load initial data
//   useEffect(() => {
//     loadDashboardData();
//   }, []);

//   // Load data when month changes
//   useEffect(() => {
//     loadMonthlySchedule();
//   }, [currentMonth]);

//   // Load data when selected date changes
//   useEffect(() => {
//     if (selectedDate) {
//       dispatch(fetchWorksByDate(selectedDate));
//       dispatch(fetchWorkQueue({ 
//         date: selectedDate, 
//         status: statusFilter, 
//         search: searchTerm 
//       }));
//     }
//   }, [selectedDate, dispatch]);

//   // Generate calendar days when monthly schedule changes
//   useEffect(() => {
//     if (monthlySchedule) {
//       generateCalendarDays();
//     }
//   }, [currentMonth, monthlySchedule]);

//   const loadDashboardData = async () => {
//     try {
//       await Promise.all([
//         dispatch(fetchDashboardStats()),
//         dispatch(fetchWorkStatusBreakdown()),
//         dispatch(fetchTailorPerformance()),
//         dispatch(fetchAvailableTailors()),
//         dispatch(fetchTodaySummary()),
//         dispatch(fetchHighPriorityWorks()),
//         dispatch(fetchOverdueWorks())
//       ]);
      
//       // Load work queue for selected date
//       dispatch(fetchWorkQueue({ 
//         date: selectedDate, 
//         status: statusFilter, 
//         search: searchTerm 
//       }));
      
//       showToast.success("Dashboard data loaded successfully");
//     } catch (error) {
//       showToast.error("Failed to load dashboard data");
//     }
//   };

//   const loadMonthlySchedule = async () => {
//     try {
//       const year = currentMonth.getFullYear();
//       const month = currentMonth.getMonth() + 1;
//       await dispatch(fetchMonthlySchedule({ year, month }));
//     } catch (error) {
//       console.error("Failed to load schedule:", error);
//     }
//   };

//   const generateCalendarDays = () => {
//     const year = currentMonth.getFullYear();
//     const month = currentMonth.getMonth();
    
//     const firstDay = new Date(year, month, 1);
//     const lastDay = new Date(year, month + 1, 0);
    
//     const days = [];
//     const startDay = firstDay.getDay(); // 0 = Sunday
    
//     // Add empty cells for days before month starts
//     for (let i = 0; i < startDay; i++) {
//       days.push(null);
//     }
    
//     // Add days of month
//     for (let d = 1; d <= lastDay.getDate(); d++) {
//       const date = new Date(year, month, d);
//       const dateStr = date.toISOString().split('T')[0];
      
//       // Get schedule data from API
//       const daySchedule = monthlySchedule?.[dateStr] || { 
//         hasWork: false, 
//         hasOverdue: false, 
//         workCount: 0 
//       };
      
//       // ===== FIX: Check if this date is today =====
//       const isToday = dateStr === todayDateStr;
      
//       days.push({
//         date,
//         dateStr,
//         day: d,
//         hasWork: daySchedule.hasWork || false,
//         hasOverdue: daySchedule.hasOverdue || false,
//         workCount: daySchedule.workCount || 0,
//         isToday: isToday // Add isToday flag
//       });
//     }
    
//     setCalendarDays(days);
//   };

//   const debouncedSearch = useCallback(
//     debounce((term) => {
//       dispatch(fetchWorkQueue({ 
//         date: selectedDate,
//         status: statusFilter, 
//         search: term 
//       }));
//     }, 500),
//     [selectedDate, statusFilter]
//   );

//   const handleRefresh = () => {
//     loadDashboardData();
//     loadMonthlySchedule();
//     showToast.success("Dashboard refreshed");
//   };

//   const handlePrevMonth = () => {
//     const newMonth = new Date(currentMonth);
//     newMonth.setMonth(currentMonth.getMonth() - 1);
//     setCurrentMonth(newMonth);
//   };

//   const handleNextMonth = () => {
//     const newMonth = new Date(currentMonth);
//     newMonth.setMonth(currentMonth.getMonth() + 1);
//     setCurrentMonth(newMonth);
//   };

//   const handleDateSelect = (day) => {
//     if (day) {
//       setSelectedDate(day.dateStr);
//       setViewMode("custom");
//     }
//   };

//   const handleViewWork = (workId) => {
//     navigate(`/cuttingmaster/works/${workId}`);
//   };

//   const handleViewTailor = (tailorId) => {
//     navigate(`/cuttingmaster/tailors/${tailorId}`);
//   };

//   const handleStatusFilter = (e) => {
//     const status = e.target.value;
//     setStatusFilter(status);
//     dispatch(fetchWorkQueue({ 
//       date: selectedDate,
//       status, 
//       search: searchTerm 
//     }));
//   };

//   const handleSearch = (e) => {
//     const term = e.target.value;
//     setSearchTerm(term);
//     debouncedSearch(term);
//   };

//   const handleViewModeChange = (mode) => {
//     setViewMode(mode);
//     const date = new Date();
//     if (mode === "tomorrow") {
//       date.setDate(date.getDate() + 1);
//     }
//     const dateStr = date.toISOString().split('T')[0];
//     setSelectedDate(dateStr);
//   };

//   const clearSearch = () => {
//     setSearchTerm("");
//     dispatch(fetchWorkQueue({ 
//       date: selectedDate,
//       status: statusFilter, 
//       search: "" 
//     }));
//   };

//   const formatDate = (dateStr) => {
//     return new Date(dateStr).toLocaleDateString('en-IN', {
//       day: 'numeric',
//       month: 'long',
//       year: 'numeric'
//     });
//   };

//   const getStatusColor = (status) => {
//     const colors = {
//       'pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
//       'accepted': 'bg-blue-100 text-blue-800 border-blue-200',
//       'cutting-started': 'bg-purple-100 text-purple-800 border-purple-200',
//       'cutting-completed': 'bg-indigo-100 text-indigo-800 border-indigo-200',
//       'sewing-started': 'bg-pink-100 text-pink-800 border-pink-200',
//       'sewing-completed': 'bg-teal-100 text-teal-800 border-teal-200',
//       'ironing': 'bg-orange-100 text-orange-800 border-orange-200',
//       'ready-to-deliver': 'bg-green-100 text-green-800 border-green-200'
//     };
//     return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
//   };

//   const getStatusBadge = (status) => {
//     const badges = {
//       'pending': '⏳ Pending',
//       'accepted': '✅ Accepted',
//       'cutting-started': '✂️ Cutting Started',
//       'cutting-completed': '✔️ Cutting Completed',
//       'sewing-started': '🧵 Sewing Started',
//       'sewing-completed': '🧵 Sewing Completed',
//       'ironing': '🔥 Ironing',
//       'ready-to-deliver': '📦 Ready to Deliver'
//     };
//     return badges[status] || status;
//   };

//   const getPriorityDisplay = (priority) => {
//     if (priority === 'high') return '🔴 High';
//     if (priority === 'normal') return '🟠 Normal';
//     return '🟢 Low';
//   };

//   const getPriorityColor = (priority) => {
//     if (priority === 'high') return 'border-l-4 border-l-red-500';
//     if (priority === 'normal') return 'border-l-4 border-l-orange-400';
//     return 'border-l-4 border-l-green-500';
//   };

//   const getOverdueColor = (days) => {
//     if (days > 5) return 'text-red-700 font-bold';
//     if (days > 2) return 'text-red-600 font-semibold';
//     return 'text-red-500';
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 md:p-6">
//       {/* ========== HEADER SECTION ========== */}
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
//         <div>
//           <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
//             <Scissors className="w-8 h-8 text-purple-600" />
//             Cutting Master Dashboard
//           </h1>
//           <p className="text-sm text-gray-500 mt-1">
//             {formatDate(todayDateStr)} {/* Show today's date */}
//           </p>
//         </div>

//         <div className="flex items-center gap-3">
//           {/* Overdue Toggle Button */}
//           <button
//             onClick={() => setShowOverdueOnly(!showOverdueOnly)}
//             className={`px-4 py-2 rounded-lg transition flex items-center gap-2 shadow-sm ${
//               showOverdueOnly 
//                 ? 'bg-red-100 text-red-700 border border-red-300' 
//                 : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
//             }`}
//           >
//             <AlertCircle size={18} />
//             <span>Show Overdue Only</span>
//             {overdueWorks?.count > 0 && (
//               <span className="ml-1 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
//                 {overdueWorks.count}
//               </span>
//             )}
//           </button>

//           <button
//             onClick={handleRefresh}
//             disabled={loading}
//             className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center gap-2 shadow-sm disabled:opacity-50"
//           >
//             <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
//             Refresh
//           </button>
//         </div>
//       </div>

//       {/* ========== KPI CARDS SECTION ========== */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//         <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-blue-500">
//           <div className="flex items-center justify-between mb-2">
//             <p className="text-sm text-gray-500">Total Work</p>
//             <Package className="w-5 h-5 text-blue-500" />
//           </div>
//           <p className="text-3xl font-bold text-gray-800">
//             {dashboardStats?.totalWork || 0}
//           </p>
//           <p className="text-xs text-gray-400 mt-1">All assigned works</p>
//         </div>

//         <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-green-500">
//           <div className="flex items-center justify-between mb-2">
//             <p className="text-sm text-gray-500">Completed Work</p>
//             <CheckCircle className="w-5 h-5 text-green-500" />
//           </div>
//           <p className="text-3xl font-bold text-gray-800">
//             {dashboardStats?.completedWork || 0}
//           </p>
//           <p className="text-xs text-gray-400 mt-1">Ready to deliver</p>
//         </div>

//         <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-purple-500">
//           <div className="flex items-center justify-between mb-2">
//             <p className="text-sm text-gray-500">In Progress</p>
//             <Clock className="w-5 h-5 text-purple-500" />
//           </div>
//           <p className="text-3xl font-bold text-gray-800">
//             {dashboardStats?.inProgressWork || 0}
//           </p>
//           <p className="text-xs text-gray-400 mt-1">Cutting/Sewing/Ironing</p>
//         </div>

//         <div 
//           className={`bg-white rounded-xl p-6 shadow-sm border-l-4 cursor-pointer transition ${
//             overdueWorks?.count > 0 ? 'border-l-red-500 hover:bg-red-50' : 'border-l-gray-300'
//           }`}
//           onClick={() => {
//             if (overdueWorks?.count > 0) {
//               document.getElementById('overdue-section').scrollIntoView({ behavior: 'smooth' });
//             }
//           }}
//         >
//           <div className="flex items-center justify-between mb-2">
//             <p className="text-sm text-gray-500">Overdue</p>
//             <AlertCircle className={`w-5 h-5 ${overdueWorks?.count > 0 ? 'text-red-500' : 'text-gray-400'}`} />
//           </div>
//           <p className={`text-3xl font-bold ${overdueWorks?.count > 0 ? 'text-red-600' : 'text-gray-800'}`}>
//             {dashboardStats?.overdueWork || 0}
//           </p>
//           <p className="text-xs text-gray-400 mt-1">Past delivery date</p>
//           {overdueWorks?.count > 0 && (
//             <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
//               <ArrowDownCircle size={12} />
//               Click to view overdue
//             </p>
//           )}
//         </div>
//       </div>

//       {/* ========== MAIN GRID - CALENDAR + WORK QUEUE ========== */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
//         {/* LEFT COLUMN - CALENDAR */}
//         <div className="lg:col-span-1">
//           <div className="bg-white rounded-xl shadow-sm p-4">
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="font-bold text-gray-800 flex items-center gap-2">
//                 <Calendar className="w-5 h-5 text-purple-600" />
//                 {currentMonth.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
//               </h2>
//               <div className="flex gap-1">
//                 <button
//                   onClick={handlePrevMonth}
//                   className="p-1 hover:bg-gray-100 rounded-lg transition"
//                 >
//                   <ChevronLeft size={18} />
//                 </button>
//                 <button
//                   onClick={handleNextMonth}
//                   className="p-1 hover:bg-gray-100 rounded-lg transition"
//                 >
//                   <ChevronRight size={18} />
//                 </button>
//               </div>
//             </div>

//             {/* Calendar Header */}
//             <div className="grid grid-cols-7 gap-1 mb-2 text-center text-xs font-medium text-gray-500">
//               <div>Su</div>
//               <div>Mo</div>
//               <div>Tu</div>
//               <div>We</div>
//               <div>Th</div>
//               <div>Fr</div>
//               <div>Sa</div>
//             </div>

//             {/* Calendar Days - FIXED: Proper highlighting for today and selected date */}
//             <div className="grid grid-cols-7 gap-1">
//               {calendarDays.map((day, index) => (
//                 <div key={index} className="aspect-square">
//                   {day ? (
//                     <button
//                       onClick={() => handleDateSelect(day)}
//                       className={`w-full h-full flex items-center justify-center rounded-lg text-sm transition-all relative
//                         ${selectedDate === day.dateStr 
//                           ? 'bg-purple-600 text-white font-bold'  // Selected date (user clicked)
//                           : day.isToday 
//                             ? 'bg-blue-100 text-blue-800 font-bold border-2 border-blue-400' // Today's date (14th)
//                             : 'hover:bg-gray-100'
//                         }
//                       `}
//                     >
//                       <span>{day.day}</span>
//                       {day.hasWork && !day.hasOverdue && (
//                         <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"></span>
//                       )}
//                       {day.hasOverdue && (
//                         <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
//                       )}
//                       {day.workCount > 0 && (
//                         <span className="absolute -bottom-1 text-[8px] font-bold bg-purple-600 text-white px-1 rounded-full">
//                           {day.workCount}
//                         </span>
//                       )}
//                     </button>
//                   ) : (
//                     <div className="w-full h-full"></div>
//                   )}
//                 </div>
//               ))}
//             </div>

//             {/* Calendar Legend - Updated */}
//             <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap items-center gap-4 text-xs">
//               <div className="flex items-center gap-1">
//                 <span className="w-3 h-3 bg-blue-400 rounded-full border-2 border-blue-400"></span>
//                 <span>Today (14th)</span>
//               </div>
//               <div className="flex items-center gap-1">
//                 <span className="w-3 h-3 bg-purple-600 rounded-full"></span>
//                 <span>Selected</span>
//               </div>
//               <div className="flex items-center gap-1">
//                 <span className="w-3 h-3 bg-green-500 rounded-full"></span>
//                 <span>Has Works</span>
//               </div>
//               <div className="flex items-center gap-1">
//                 <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
//                 <span>Overdue</span>
//               </div>
//             </div>

//             {/* Selected Date Summary */}
//             {selectedDate && dateWiseWorks && (
//               <div className="mt-4 p-3 bg-purple-50 rounded-lg">
//                 <p className="text-sm font-medium text-purple-700">
//                   {formatDate(selectedDate)}
//                   {selectedDate === todayDateStr && (
//                     <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
//                       Today
//                     </span>
//                   )}
//                 </p>
//                 <div className="grid grid-cols-3 gap-2 mt-2 text-xs">
//                   <div className="text-center">
//                     <span className="block font-bold text-purple-700">{dateWiseWorks.total || 0}</span>
//                     <span className="text-gray-500">Total</span>
//                   </div>
//                   <div className="text-center">
//                     <span className="block font-bold text-green-600">{dateWiseWorks.completed || 0}</span>
//                     <span className="text-gray-500">Completed</span>
//                   </div>
//                   <div className="text-center">
//                     <span className="block font-bold text-yellow-600">{dateWiseWorks.pending || 0}</span>
//                     <span className="text-gray-500">Pending</span>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Today's Summary Card */}
//           {todaySummary && (
//             <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4 mt-4">
//               <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
//                 <Target className="w-4 h-4 text-blue-600" />
//                 Today's Focus - {formatDate(todayDateStr)}
//               </h3>
//               <div className="space-y-2">
//                 <div className="flex justify-between text-sm">
//                   <span>Due Today:</span>
//                   <span className="font-bold text-red-600">{todaySummary.dueToday || 0}</span>
//                 </div>
//                 <div className="flex justify-between text-sm">
//                   <span>High Priority:</span>
//                   <span className="font-bold text-red-600">{todaySummary.highPriority || 0}</span>
//                 </div>
//                 <div className="flex justify-between text-sm">
//                   <span>Completed Today:</span>
//                   <span className="font-bold text-green-600">{todaySummary.completedToday || 0}</span>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* RIGHT COLUMN - WORK QUEUE */}
//         <div className="lg:col-span-2" id="work-queue">
//           <div className="bg-white rounded-xl shadow-sm p-6">
//             <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
//               <h2 className="font-bold text-gray-800 flex items-center gap-2">
//                 <Package className="w-5 h-5 text-purple-600" />
//                 Work Queue - {formatDate(selectedDate)}
//                 {selectedDate === todayDateStr && (
//                   <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
//                     Today
//                   </span>
//                 )}
//                 {showOverdueOnly && (
//                   <span className="ml-2 px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
//                     Overdue Only
//                   </span>
//                 )}
//               </h2>

//               <div className="flex gap-2">
//                 {/* View Mode Toggle */}
//                 <div className="flex bg-gray-100 rounded-lg p-1">
//                   <button
//                     onClick={() => handleViewModeChange("today")}
//                     className={`px-3 py-1.5 text-xs rounded-md transition ${
//                       viewMode === "today" ? "bg-purple-600 text-white" : "text-gray-600"
//                     }`}
//                   >
//                     Today
//                   </button>
//                   <button
//                     onClick={() => handleViewModeChange("tomorrow")}
//                     className={`px-3 py-1.5 text-xs rounded-md transition ${
//                       viewMode === "tomorrow" ? "bg-purple-600 text-white" : "text-gray-600"
//                     }`}
//                   >
//                     Tomorrow
//                   </button>
//                 </div>

//                 {/* Filter Toggle */}
//                 <button
//                   onClick={() => setShowFilters(!showFilters)}
//                   className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
//                 >
//                   <Filter size={16} />
//                 </button>
//               </div>
//             </div>

//             {/* Filters */}
//             {showFilters && (
//               <div className="mb-4 p-3 bg-gray-50 rounded-lg">
//                 <div className="flex flex-col md:flex-row gap-3">
//                   {/* Status Filter */}
//                   <select
//                     value={statusFilter}
//                     onChange={handleStatusFilter}
//                     className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
//                   >
//                     <option value="all">All Status</option>
//                     <option value="pending">Pending</option>
//                     <option value="accepted">Accepted</option>
//                     <option value="cutting-started">Cutting Started</option>
//                     <option value="cutting-completed">Cutting Completed</option>
//                     <option value="sewing-started">Sewing Started</option>
//                     <option value="sewing-completed">Sewing Completed</option>
//                     <option value="ironing">Ironing</option>
//                     <option value="ready-to-deliver">Ready to Deliver</option>
//                   </select>

//                   {/* Search */}
//                   <div className="relative flex-1">
//                     <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                     <input
//                       type="text"
//                       value={searchTerm}
//                       onChange={handleSearch}
//                       placeholder="Search by Work ID or Customer..."
//                       className="w-full pl-9 pr-8 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
//                     />
//                     {searchTerm && (
//                       <button
//                         onClick={clearSearch}
//                         className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                       >
//                         <X size={16} />
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Work List */}
//             <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
//               {workQueue?.works?.length > 0 ? (
//                 workQueue.works
//                   .filter(work => !showOverdueOnly || (work.estimatedDelivery && new Date(work.estimatedDelivery) < new Date()))
//                   .map((work) => (
//                     <div
//                       key={work._id}
//                       className={`border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer ${getPriorityColor(work.priority)} ${
//                         work.estimatedDelivery && new Date(work.estimatedDelivery) < new Date() && work.status !== 'ready-to-deliver'
//                           ? 'bg-red-50 border-red-300'
//                           : ''
//                       }`}
//                       onClick={() => handleViewWork(work._id)}
//                     >
//                       <div className="flex items-start justify-between mb-2">
//                         <div className="flex items-center gap-2 flex-wrap">
//                           <span className="font-mono text-sm font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded">
//                             #{work.workId}
//                           </span>
//                           <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(work.status)}`}>
//                             {getStatusBadge(work.status)}
//                           </span>
//                           <span className="text-xs font-medium">
//                             {getPriorityDisplay(work.priority)}
//                           </span>
//                           {work.estimatedDelivery && new Date(work.estimatedDelivery) < new Date() && work.status !== 'ready-to-deliver' && (
//                             <span className="px-2 py-1 bg-red-200 text-red-800 rounded-full text-xs font-bold animate-pulse">
//                               ⚠️ OVERDUE
//                             </span>
//                           )}
//                         </div>
//                         <button
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             handleViewWork(work._id);
//                           }}
//                           className="p-1 hover:bg-gray-100 rounded-lg transition"
//                         >
//                           <Eye size={16} className="text-gray-600" />
//                         </button>
//                       </div>

//                       <h3 className="font-bold text-gray-800 mb-1">
//                         {work.garment?.name || 'Unknown Garment'}
//                       </h3>

//                       <div className="grid grid-cols-2 gap-2 text-sm">
//                         <div className="flex items-center gap-1">
//                           <User size={14} className="text-gray-400" />
//                           <span>{work.customer?.name || 'Unknown'}</span>
//                         </div>

//                         <div className="flex items-center gap-1">
//                           <Package size={14} className="text-purple-500" />
//                           <span className="text-xs">
//                             Garment: {work.garment?.garmentId || 'N/A'}
//                           </span>
//                         </div>
//                       </div>

//                       {work.tailor && (
//                         <div className="mt-2 text-xs text-gray-500">
//                           👔 Tailor: {work.tailor.name}
//                         </div>
//                       )}

//                       {work.estimatedDelivery && (
//                         <div className="mt-2 text-xs">
//                           <span className="text-gray-500">📅 Due: </span>
//                           <span className={new Date(work.estimatedDelivery) < new Date() && work.status !== 'ready-to-deliver' 
//                             ? 'text-red-600 font-bold' 
//                             : 'text-gray-700'
//                           }>
//                             {new Date(work.estimatedDelivery).toLocaleDateString()}
//                             {new Date(work.estimatedDelivery) < new Date() && work.status !== 'ready-to-deliver' && (
//                               <span className="ml-2 text-red-600">
//                                 (Overdue by {Math.ceil((new Date() - new Date(work.estimatedDelivery)) / (1000 * 60 * 60 * 24))} days)
//                               </span>
//                             )}
//                           </span>
//                         </div>
//                       )}
//                     </div>
//                   ))
//               ) : (
//                 <div className="text-center py-12 text-gray-500">
//                   <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
//                   <p className="font-medium">No works found</p>
//                   <p className="text-sm text-gray-400 mt-1">
//                     Try adjusting your filters or select another date
//                   </p>
//                 </div>
//               )}
//             </div>

//             {/* Work Queue Stats */}
//             {workQueue?.works?.length > 0 && (
//               <div className="mt-4 pt-3 border-t border-gray-200 flex justify-between text-xs text-gray-600">
//                 <span>Total: <span className="font-bold">{workQueue.total}</span></span>
//                 <span>✅ Completed: <span className="font-bold text-green-600">
//                   {workQueue.works.filter(w => w.status === 'ready-to-deliver').length}
//                 </span></span>
//                 <span>⏳ Pending: <span className="font-bold text-yellow-600">
//                   {workQueue.works.filter(w => w.status !== 'ready-to-deliver').length}
//                 </span></span>
//                 <span>⚠️ Overdue: <span className="font-bold text-red-600">
//                   {workQueue.works.filter(w => 
//                     w.estimatedDelivery && 
//                     new Date(w.estimatedDelivery) < new Date() && 
//                     w.status !== 'ready-to-deliver'
//                   ).length}
//                 </span></span>
//               </div>
//             )}

//             {/* Pagination Info */}
//             {workQueue?.totalPages > 1 && (
//               <div className="mt-4 flex justify-center gap-2 text-xs">
//                 <span className="text-gray-500">
//                   Page {workQueue.page} of {workQueue.totalPages}
//                 </span>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* ========== OVERDUE WORKS SECTION ========== */}
//       <div id="overdue-section">
//         {overdueWorks?.works?.length > 0 && (
//           <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border-2 border-red-200">
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="font-bold text-gray-800 flex items-center gap-2">
//                 <AlertCircle className="w-6 h-6 text-red-500 animate-pulse" />
//                 ⚠️ OVERDUE WORKS ({overdueWorks.count || 0})
//               </h2>
//               <button
//                 onClick={() => {
//                   if (showOverdueOnly) {
//                     setShowOverdueOnly(false);
//                   } else {
//                     setShowOverdueOnly(true);
//                     document.getElementById('work-queue').scrollIntoView({ behavior: 'smooth' });
//                   }
//                 }}
//                 className="px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition text-sm flex items-center gap-1"
//               >
//                 {showOverdueOnly ? 'Show All' : 'View All in Queue'}
//                 <ArrowUpCircle size={14} />
//               </button>
//             </div>

//             <div className="space-y-3">
//               {overdueWorks.works.map((work) => {
//                 const overdueDays = work.overdueBy || 
//                   Math.ceil((new Date() - new Date(work.estimatedDelivery)) / (1000 * 60 * 60 * 24));
                
//                 return (
//                   <div
//                     key={work._id}
//                     className="border border-red-300 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer bg-gradient-to-r from-red-50 to-orange-50"
//                     onClick={() => handleViewWork(work._id)}
//                   >
//                     <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//                       <div className="flex-1">
//                         {/* Top Row */}
//                         <div className="flex items-center gap-2 mb-2 flex-wrap">
//                           <span className="font-mono text-sm font-bold text-red-600 bg-red-100 px-2 py-1 rounded">
//                             #{work.workId}
//                           </span>
//                           <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(work.status)}`}>
//                             {getStatusBadge(work.status)}
//                           </span>
//                           <span className="text-xs font-medium">
//                             {getPriorityDisplay(work.priority)}
//                           </span>
//                           <span className="px-2 py-1 bg-red-200 text-red-800 rounded-full text-xs font-bold">
//                             ⚠️ OVERDUE
//                           </span>
//                         </div>

//                         <h3 className="font-bold text-gray-800 mb-1">
//                           {work.garment?.name || 'Unknown Garment'}
//                         </h3>

//                         <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-sm">
//                           <div className="flex items-center gap-1">
//                             <User size={14} className="text-gray-400" />
//                             <span>{work.customer?.name || 'Unknown'}</span>
//                           </div>

//                           <div className="flex items-center gap-1">
//                             <Package size={14} className="text-purple-500" />
//                             <span className="text-xs">
//                               {work.garment?.garmentId || 'N/A'}
//                             </span>
//                           </div>

//                           <div className="flex items-center gap-1">
//                             <Calendar size={14} className="text-gray-400" />
//                             <span className="text-xs">
//                               Due: {new Date(work.estimatedDelivery).toLocaleDateString()}
//                             </span>
//                           </div>

//                           <div className="flex items-center gap-1">
//                             <AlertCircle size={14} className="text-red-600" />
//                             <span className={`text-sm font-bold ${getOverdueColor(overdueDays)}`}>
//                               Overdue by {overdueDays} {overdueDays === 1 ? 'day' : 'days'}
//                             </span>
//                           </div>
//                         </div>

//                         {/* Progress Bar for Overdue */}
//                         <div className="mt-3">
//                           <div className="flex items-center gap-2">
//                             <span className="text-xs text-gray-600">Delay:</span>
//                             <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
//                               <div 
//                                 className="h-full bg-red-500 rounded-full"
//                                 style={{ 
//                                   width: `${Math.min(overdueDays * 10, 100)}%`,
//                                   backgroundColor: overdueDays > 10 ? '#7f1d1d' : '#ef4444'
//                                 }}
//                               ></div>
//                             </div>
//                             <span className="text-xs font-bold text-red-600">
//                               +{overdueDays} days
//                             </span>
//                           </div>
//                         </div>
//                       </div>

//                       <button
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           handleViewWork(work._id);
//                         }}
//                         className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2 self-end md:self-center shadow-sm"
//                       >
//                         <Eye size={16} />
//                         Take Action
//                       </button>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>

//             {/* Overdue Summary Stats */}
//             <div className="mt-4 pt-3 border-t border-red-200 grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
//               <div className="bg-red-50 p-3 rounded-lg text-center">
//                 <span className="block font-bold text-2xl text-red-600">{overdueWorks.count || 0}</span>
//                 <span className="text-xs text-gray-600">Total Overdue</span>
//               </div>
//               <div className="bg-orange-50 p-3 rounded-lg text-center">
//                 <span className="block font-bold text-2xl text-orange-600">
//                   {overdueWorks.works.filter(w => w.priority === 'high').length}
//                 </span>
//                 <span className="text-xs text-gray-600">High Priority</span>
//               </div>
//               <div className="bg-yellow-50 p-3 rounded-lg text-center">
//                 <span className="block font-bold text-2xl text-yellow-600">
//                   {overdueWorks.works.filter(w => w.priority === 'normal').length}
//                 </span>
//                 <span className="text-xs text-gray-600">Normal Priority</span>
//               </div>
//               <div className="bg-green-50 p-3 rounded-lg text-center">
//                 <span className="block font-bold text-2xl text-green-600">
//                   {overdueWorks.works.filter(w => w.tailor).length}
//                 </span>
//                 <span className="text-xs text-gray-600">Assigned</span>
//               </div>
//             </div>

//             {/* Action Buttons */}
//             <div className="mt-4 flex justify-end gap-3">
//               <button
//                 onClick={() => {
//                   setShowOverdueOnly(true);
//                   document.getElementById('work-queue').scrollIntoView({ behavior: 'smooth' });
//                 }}
//                 className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition text-sm flex items-center gap-2"
//               >
//                 <AlertCircle size={16} />
//                 View All in Queue
//               </button>
//               <button
//                 onClick={loadDashboardData}
//                 className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm flex items-center gap-2"
//               >
//                 <RefreshCw size={16} />
//                 Refresh
//               </button>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* ========== HIGH PRIORITY WORKS SECTION ========== */}
//       {highPriorityWorks?.works?.length > 0 && (
//         <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
//           <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
//             <Flag className="w-5 h-5 text-red-500" />
//             High Priority Works ({highPriorityWorks.count || 0})
//           </h2>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//             {highPriorityWorks.works.map((work) => (
//               <div
//                 key={work._id}
//                 className="border border-red-200 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer bg-gradient-to-br from-red-50 to-orange-50"
//                 onClick={() => handleViewWork(work._id)}
//               >
//                 <div className="flex items-start justify-between mb-2">
//                   <span className="font-mono text-sm font-bold text-red-600">
//                     #{work.workId}
//                   </span>
//                   <span className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded-full">
//                     🔴 High
//                   </span>
//                 </div>
//                 <h3 className="font-bold text-gray-800 mb-1">
//                   {work.garment?.name || 'Unknown'}
//                 </h3>
//                 <p className="text-xs text-gray-500 flex items-center gap-1">
//                   <User size={12} /> {work.customer?.name || 'Unknown'}
//                 </p>
//                 {work.estimatedDelivery && (
//                   <p className={`text-xs mt-2 flex items-center gap-1 ${
//                     new Date(work.estimatedDelivery) < new Date() 
//                       ? 'text-red-600 font-bold' 
//                       : 'text-orange-600'
//                   }`}>
//                     <Calendar size={12} />
//                     Due: {new Date(work.estimatedDelivery).toLocaleDateString()}
//                     {new Date(work.estimatedDelivery) < new Date() && ' (Overdue)'}
//                   </p>
//                 )}
//                 {work.tailor && (
//                   <p className="text-xs text-gray-500 mt-2">
//                     👔 Assigned to: {work.tailor.name}
//                   </p>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* ========== TAILOR PERFORMANCE SECTION ========== */}
//       <div className="bg-white rounded-xl shadow-sm p-6">
//         <div className="flex items-center justify-between mb-4">
//           <h2 className="font-bold text-gray-800 flex items-center gap-2">
//             <Users className="w-5 h-5 text-purple-600" />
//             Tailor Performance
//           </h2>
//           {availableTailors?.summary?.available > 0 && (
//             <div className="flex items-center gap-3">
//               <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full flex items-center gap-1">
//                 <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
//                 {availableTailors.summary.available} Available Now
//               </span>
//               <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">
//                 {availableTailors.summary.onLeave || 0} On Leave
//               </span>
//             </div>
//           )}
//         </div>

//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead>
//               <tr className="border-b border-gray-200 bg-gray-50">
//                 <th className="text-left py-3 px-2 text-xs font-medium text-gray-500">Tailor</th>
//                 <th className="text-center py-3 px-2 text-xs font-medium text-gray-500">Assigned</th>
//                 <th className="text-center py-3 px-2 text-xs font-medium text-gray-500">Completed</th>
//                 <th className="text-center py-3 px-2 text-xs font-medium text-gray-500">Pending</th>
//                 <th className="text-center py-3 px-2 text-xs font-medium text-gray-500">In Progress</th>
//                 <th className="text-center py-3 px-2 text-xs font-medium text-gray-500">Efficiency</th>
//                 <th className="text-center py-3 px-2 text-xs font-medium text-gray-500">Status</th>
//                 <th className="text-right py-3 px-2 text-xs font-medium text-gray-500">Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {tailorPerformance?.tailors?.length > 0 ? (
//                 tailorPerformance.tailors.map((tailor) => {
//                   const isAvailable = availableTailors?.availableTailors?.some(t => t._id === tailor._id);
                  
//                   return (
//                     <tr key={tailor._id} className="border-b border-gray-100 hover:bg-gray-50">
//                       <td className="py-3 px-2">
//                         <div className="font-medium text-gray-800">{tailor.name}</div>
//                         <div className="text-xs text-gray-500">{tailor.employeeId}</div>
//                       </td>
//                       <td className="text-center py-3 px-2 font-bold">{tailor.assigned || 0}</td>
//                       <td className="text-center py-3 px-2 text-green-600 font-bold">{tailor.completed || 0}</td>
//                       <td className="text-center py-3 px-2 text-yellow-600 font-bold">{tailor.pending || 0}</td>
//                       <td className="text-center py-3 px-2 text-purple-600 font-bold">{tailor.inProgress || 0}</td>
//                       <td className="text-center py-3 px-2">
//                         <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                           tailor.efficiency >= 80 ? 'bg-green-100 text-green-700' :
//                           tailor.efficiency >= 60 ? 'bg-blue-100 text-blue-700' :
//                           tailor.efficiency >= 40 ? 'bg-yellow-100 text-yellow-700' :
//                           'bg-red-100 text-red-700'
//                         }`}>
//                           {tailor.efficiency || 0}%
//                         </span>
//                       </td>
//                       <td className="text-center py-3 px-2">
//                         {isAvailable ? (
//                           <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs flex items-center justify-center gap-1">
//                             <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
//                             Available
//                           </span>
//                         ) : (
//                           <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
//                             Busy
//                           </span>
//                         )}
//                       </td>
//                       <td className="text-right py-3 px-2">
//                         <button
//                           onClick={() => handleViewTailor(tailor._id)}
//                           className="text-xs px-3 py-1 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition"
//                         >
//                           View Profile
//                         </button>
//                       </td>
//                     </tr>
//                   );
//                 })
//               ) : (
//                 <tr>
//                   <td colSpan="8" className="text-center py-8 text-gray-500">
//                     No tailors found
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* Availability Summary */}
//         {availableTailors?.summary && (
//           <div className="mt-4 pt-3 border-t border-gray-200 grid grid-cols-3 gap-4 text-center text-sm">
//             <div className="bg-blue-50 p-2 rounded-lg">
//               <span className="block font-bold text-blue-700">{availableTailors.summary.total || 0}</span>
//               <span className="text-gray-500 text-xs">Total Tailors</span>
//             </div>
//             <div className="bg-green-50 p-2 rounded-lg">
//               <span className="block font-bold text-green-600">{availableTailors.summary.available || 0}</span>
//               <span className="text-gray-500 text-xs">Available Now</span>
//             </div>
//             <div className="bg-orange-50 p-2 rounded-lg">
//               <span className="block font-bold text-orange-600">{availableTailors.summary.onLeave || 0}</span>
//               <span className="text-gray-500 text-xs">On Leave</span>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }





// // Pages/works/CuttingMasterDashboard.jsx
// import React, { useState, useEffect, useCallback } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import {
//   Calendar,
//   ChevronLeft,
//   ChevronRight,
//   Scissors,
//   Clock,
//   CheckCircle,
//   AlertCircle,
//   Target,
//   Package,
//   Flag,
//   Users,
//   Eye,
//   RefreshCw,
//   User,
//   Filter,
//   Search,
//   X,
//   ArrowUpCircle,
//   ArrowDownCircle
// } from "lucide-react";
// import {
//   fetchDashboardStats,
//   fetchWorkStatusBreakdown,
//   fetchTailorPerformance,
//   fetchAvailableTailors,
//   fetchWorkQueue,
//   fetchTodaySummary,
//   fetchHighPriorityWorks,
//   fetchOverdueWorks,
//   fetchMonthlySchedule,
//   fetchWorksByDate,
//   selectDashboardStats,
//   selectStatusBreakdown,
//   selectTailorPerformance,
//   selectAvailableTailors,
//   selectWorkQueue,
//   selectTodaySummary,
//   selectHighPriorityWorks,
//   selectOverdueWorks,
//   selectMonthlySchedule,
//   selectWorksByDate,
//   selectCuttingMasterLoading
// } from "../features/cuttingMaster/cuttingMasterSlice";
// import showToast from "../utils/toast";
// import { debounce } from "lodash";

// export default function CuttingMasterDashboard() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   // Selectors
//   const dashboardStats = useSelector(selectDashboardStats);
//   const statusBreakdown = useSelector(selectStatusBreakdown);
//   const tailorPerformance = useSelector(selectTailorPerformance);
//   const availableTailors = useSelector(selectAvailableTailors);
//   const workQueue = useSelector(selectWorkQueue);
//   const todaySummary = useSelector(selectTodaySummary);
//   const highPriorityWorks = useSelector(selectHighPriorityWorks);
//   const overdueWorks = useSelector(selectOverdueWorks);
//   const monthlySchedule = useSelector(selectMonthlySchedule);
//   const dateWiseWorks = useSelector(selectWorksByDate);
//   const loading = useSelector(selectCuttingMasterLoading);

//   // ===== FIXED: Get today's date correctly with local timezone =====
//   const getLocalDateStr = (date) => {
//     const year = date.getFullYear();
//     const month = String(date.getMonth() + 1).padStart(2, '0');
//     const day = String(date.getDate()).padStart(2, '0');
//     return `${year}-${month}-${day}`;
//   };

//   const today = new Date();
//   const todayDateStr = getLocalDateStr(today); // This will be "2026-03-14" (correct)
  
//   // Local state - using today's date as default
//   const [selectedDate, setSelectedDate] = useState(todayDateStr);
//   const [currentMonth, setCurrentMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
//   const [viewMode, setViewMode] = useState("today");
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [showFilters, setShowFilters] = useState(false);
//   const [calendarDays, setCalendarDays] = useState([]);
//   const [showOverdueOnly, setShowOverdueOnly] = useState(false);

//   // Load initial data
//   useEffect(() => {
//     loadDashboardData();
//   }, []);

//   // Load data when month changes
//   useEffect(() => {
//     loadMonthlySchedule();
//   }, [currentMonth]);

//   // Load data when selected date changes
//   useEffect(() => {
//     if (selectedDate) {
//       dispatch(fetchWorksByDate(selectedDate));
//       dispatch(fetchWorkQueue({ 
//         date: selectedDate, 
//         status: statusFilter, 
//         search: searchTerm 
//       }));
//     }
//   }, [selectedDate, dispatch, statusFilter, searchTerm]);

//   // Generate calendar days when monthly schedule changes
//   useEffect(() => {
//     if (monthlySchedule) {
//       generateCalendarDays();
//     }
//   }, [currentMonth, monthlySchedule]);

//   const loadDashboardData = async () => {
//     try {
//       await Promise.all([
//         dispatch(fetchDashboardStats()),
//         dispatch(fetchWorkStatusBreakdown()),
//         dispatch(fetchTailorPerformance()),
//         dispatch(fetchAvailableTailors()),
//         dispatch(fetchTodaySummary()),
//         dispatch(fetchHighPriorityWorks()),
//         dispatch(fetchOverdueWorks())
//       ]);
      
//       // Load work queue for selected date
//       dispatch(fetchWorkQueue({ 
//         date: selectedDate, 
//         status: statusFilter, 
//         search: searchTerm 
//       }));
      
//       showToast.success("Dashboard data loaded successfully");
//     } catch (error) {
//       showToast.error("Failed to load dashboard data");
//     }
//   };

//   const loadMonthlySchedule = async () => {
//     try {
//       const year = currentMonth.getFullYear();
//       const month = currentMonth.getMonth() + 1;
//       await dispatch(fetchMonthlySchedule({ year, month }));
//     } catch (error) {
//       console.error("Failed to load schedule:", error);
//     }
//   };

//   const generateCalendarDays = () => {
//     const year = currentMonth.getFullYear();
//     const month = currentMonth.getMonth();
    
//     const firstDay = new Date(year, month, 1);
//     const lastDay = new Date(year, month + 1, 0);
    
//     const days = [];
//     const startDay = firstDay.getDay(); // 0 = Sunday
    
//     // Add empty cells for days before month starts
//     for (let i = 0; i < startDay; i++) {
//       days.push(null);
//     }
    
//     // Add days of month
//     for (let d = 1; d <= lastDay.getDate(); d++) {
//       // Create date in local timezone (not UTC)
//       const date = new Date(year, month, d);
//       const dateStr = getLocalDateStr(date);
      
//       // Get schedule data from API
//       const daySchedule = monthlySchedule?.[dateStr] || { 
//         hasWork: false, 
//         hasOverdue: false, 
//         workCount: 0 
//       };
      
//       // Check if this date is today
//       const isToday = dateStr === todayDateStr;
      
//       days.push({
//         date,
//         dateStr,
//         day: d,
//         hasWork: daySchedule.hasWork || false,
//         hasOverdue: daySchedule.hasOverdue || false,
//         workCount: daySchedule.workCount || 0,
//         isToday: isToday
//       });
//     }
    
//     setCalendarDays(days);
//   };

//   const debouncedSearch = useCallback(
//     debounce((term) => {
//       dispatch(fetchWorkQueue({ 
//         date: selectedDate,
//         status: statusFilter, 
//         search: term 
//       }));
//     }, 500),
//     [selectedDate, statusFilter, dispatch]
//   );

//   const handleRefresh = () => {
//     loadDashboardData();
//     loadMonthlySchedule();
//     showToast.success("Dashboard refreshed");
//   };

//   const handlePrevMonth = () => {
//     const newMonth = new Date(currentMonth);
//     newMonth.setMonth(currentMonth.getMonth() - 1);
//     setCurrentMonth(newMonth);
//   };

//   const handleNextMonth = () => {
//     const newMonth = new Date(currentMonth);
//     newMonth.setMonth(currentMonth.getMonth() + 1);
//     setCurrentMonth(newMonth);
//   };

//   const handleDateSelect = (day) => {
//     if (day) {
//       setSelectedDate(day.dateStr);
//       setViewMode("custom");
//     }
//   };

//   const handleViewWork = (workId) => {
//     navigate(`/cuttingmaster/works/${workId}`);
//   };

//   const handleViewTailor = (tailorId) => {
//     navigate(`/cuttingmaster/tailors/${tailorId}`);
//   };

//   const handleStatusFilter = (e) => {
//     const status = e.target.value;
//     setStatusFilter(status);
//     dispatch(fetchWorkQueue({ 
//       date: selectedDate,
//       status, 
//       search: searchTerm 
//     }));
//   };

//   const handleSearch = (e) => {
//     const term = e.target.value;
//     setSearchTerm(term);
//     debouncedSearch(term);
//   };

//   const handleViewModeChange = (mode) => {
//     setViewMode(mode);
//     const date = new Date();
//     if (mode === "tomorrow") {
//       date.setDate(date.getDate() + 1);
//     }
//     const dateStr = getLocalDateStr(date);
//     setSelectedDate(dateStr);
//   };

//   const clearSearch = () => {
//     setSearchTerm("");
//     dispatch(fetchWorkQueue({ 
//       date: selectedDate,
//       status: statusFilter, 
//       search: "" 
//     }));
//   };

//   const formatDate = (dateStr) => {
//     const date = new Date(dateStr + 'T12:00:00'); // Add noon to avoid timezone issues
//     return date.toLocaleDateString('en-IN', {
//       day: 'numeric',
//       month: 'long',
//       year: 'numeric'
//     });
//   };

//   const getStatusColor = (status) => {
//     const colors = {
//       'pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
//       'accepted': 'bg-blue-100 text-blue-800 border-blue-200',
//       'cutting-started': 'bg-purple-100 text-purple-800 border-purple-200',
//       'cutting-completed': 'bg-indigo-100 text-indigo-800 border-indigo-200',
//       'sewing-started': 'bg-pink-100 text-pink-800 border-pink-200',
//       'sewing-completed': 'bg-teal-100 text-teal-800 border-teal-200',
//       'ironing': 'bg-orange-100 text-orange-800 border-orange-200',
//       'ready-to-deliver': 'bg-green-100 text-green-800 border-green-200'
//     };
//     return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
//   };

//   const getStatusBadge = (status) => {
//     const badges = {
//       'pending': '⏳ Pending',
//       'accepted': '✅ Accepted',
//       'cutting-started': '✂️ Cutting Started',
//       'cutting-completed': '✔️ Cutting Completed',
//       'sewing-started': '🧵 Sewing Started',
//       'sewing-completed': '🧵 Sewing Completed',
//       'ironing': '🔥 Ironing',
//       'ready-to-deliver': '📦 Ready to Deliver'
//     };
//     return badges[status] || status;
//   };

//   const getPriorityDisplay = (priority) => {
//     if (priority === 'high') return '🔴 High';
//     if (priority === 'normal') return '🟠 Normal';
//     return '🟢 Low';
//   };

//   const getPriorityColor = (priority) => {
//     if (priority === 'high') return 'border-l-4 border-l-red-500';
//     if (priority === 'normal') return 'border-l-4 border-l-orange-400';
//     return 'border-l-4 border-l-green-500';
//   };

//   const getOverdueColor = (days) => {
//     if (days > 5) return 'text-red-700 font-bold';
//     if (days > 2) return 'text-red-600 font-semibold';
//     return 'text-red-500';
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 md:p-6">
//       {/* ========== HEADER SECTION ========== */}
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
//         <div>
//           <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
//             <Scissors className="w-8 h-8 text-purple-600" />
//             Cutting Master Dashboard
//           </h1>
//           <p className="text-sm text-gray-500 mt-1">
//             {formatDate(todayDateStr)}
//           </p>
//         </div>

//         <div className="flex items-center gap-3">
//           {/* Overdue Toggle Button */}
//           <button
//             onClick={() => setShowOverdueOnly(!showOverdueOnly)}
//             className={`px-4 py-2 rounded-lg transition flex items-center gap-2 shadow-sm ${
//               showOverdueOnly 
//                 ? 'bg-red-100 text-red-700 border border-red-300' 
//                 : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
//             }`}
//           >
//             <AlertCircle size={18} />
//             <span>Show Overdue Only</span>
//             {overdueWorks?.count > 0 && (
//               <span className="ml-1 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
//                 {overdueWorks.count}
//               </span>
//             )}
//           </button>

//           <button
//             onClick={handleRefresh}
//             disabled={loading}
//             className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center gap-2 shadow-sm disabled:opacity-50"
//           >
//             <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
//             Refresh
//           </button>
//         </div>
//       </div>

//       {/* ========== KPI CARDS SECTION ========== */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//         <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-blue-500">
//           <div className="flex items-center justify-between mb-2">
//             <p className="text-sm text-gray-500">Total Work</p>
//             <Package className="w-5 h-5 text-blue-500" />
//           </div>
//           <p className="text-3xl font-bold text-gray-800">
//             {dashboardStats?.totalWork || 0}
//           </p>
//           <p className="text-xs text-gray-400 mt-1">All assigned works</p>
//         </div>

//         <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-green-500">
//           <div className="flex items-center justify-between mb-2">
//             <p className="text-sm text-gray-500">Completed Work</p>
//             <CheckCircle className="w-5 h-5 text-green-500" />
//           </div>
//           <p className="text-3xl font-bold text-gray-800">
//             {dashboardStats?.completedWork || 0}
//           </p>
//           <p className="text-xs text-gray-400 mt-1">Ready to deliver</p>
//         </div>

//         <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-purple-500">
//           <div className="flex items-center justify-between mb-2">
//             <p className="text-sm text-gray-500">In Progress</p>
//             <Clock className="w-5 h-5 text-purple-500" />
//           </div>
//           <p className="text-3xl font-bold text-gray-800">
//             {dashboardStats?.inProgressWork || 0}
//           </p>
//           <p className="text-xs text-gray-400 mt-1">Cutting/Sewing/Ironing</p>
//         </div>

//         <div 
//           className={`bg-white rounded-xl p-6 shadow-sm border-l-4 cursor-pointer transition ${
//             overdueWorks?.count > 0 ? 'border-l-red-500 hover:bg-red-50' : 'border-l-gray-300'
//           }`}
//           onClick={() => {
//             if (overdueWorks?.count > 0) {
//               document.getElementById('overdue-section').scrollIntoView({ behavior: 'smooth' });
//             }
//           }}
//         >
//           <div className="flex items-center justify-between mb-2">
//             <p className="text-sm text-gray-500">Overdue</p>
//             <AlertCircle className={`w-5 h-5 ${overdueWorks?.count > 0 ? 'text-red-500' : 'text-gray-400'}`} />
//           </div>
//           <p className={`text-3xl font-bold ${overdueWorks?.count > 0 ? 'text-red-600' : 'text-gray-800'}`}>
//             {dashboardStats?.overdueWork || 0}
//           </p>
//           <p className="text-xs text-gray-400 mt-1">Past delivery date</p>
//           {overdueWorks?.count > 0 && (
//             <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
//               <ArrowDownCircle size={12} />
//               Click to view overdue
//             </p>
//           )}
//         </div>
//       </div>

//       {/* ========== MAIN GRID - CALENDAR + WORK QUEUE ========== */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
//         {/* LEFT COLUMN - CALENDAR */}
//         <div className="lg:col-span-1">
//           <div className="bg-white rounded-xl shadow-sm p-4">
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="font-bold text-gray-800 flex items-center gap-2">
//                 <Calendar className="w-5 h-5 text-purple-600" />
//                 {currentMonth.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
//               </h2>
//               <div className="flex gap-1">
//                 <button
//                   onClick={handlePrevMonth}
//                   className="p-1 hover:bg-gray-100 rounded-lg transition"
//                 >
//                   <ChevronLeft size={18} />
//                 </button>
//                 <button
//                   onClick={handleNextMonth}
//                   className="p-1 hover:bg-gray-100 rounded-lg transition"
//                 >
//                   <ChevronRight size={18} />
//                 </button>
//               </div>
//             </div>

//             {/* Calendar Header */}
//             <div className="grid grid-cols-7 gap-1 mb-2 text-center text-xs font-medium text-gray-500">
//               <div>Su</div>
//               <div>Mo</div>
//               <div>Tu</div>
//               <div>We</div>
//               <div>Th</div>
//               <div>Fr</div>
//               <div>Sa</div>
//             </div>

//             {/* Calendar Days - FIXED: Proper date comparison */}
//             <div className="grid grid-cols-7 gap-1">
//               {calendarDays.map((day, index) => (
//                 <div key={index} className="aspect-square">
//                   {day ? (
//                     <button
//                       onClick={() => handleDateSelect(day)}
//                       className={`w-full h-full flex items-center justify-center rounded-lg text-sm transition-all relative
//                         ${selectedDate === day.dateStr 
//                           ? 'bg-purple-600 text-white font-bold ring-2 ring-purple-300' // Selected date
//                           : day.isToday 
//                             ? 'bg-blue-100 text-blue-800 font-bold border-2 border-blue-400' // Today's date
//                             : 'hover:bg-gray-100'
//                         }
//                         ${day.hasWork ? 'font-semibold' : ''}
//                       `}
//                     >
//                       <span>{day.day}</span>
                      
//                       {/* Work indicator dot */}
//                       {day.hasWork && !day.hasOverdue && (
//                         <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full border border-white"></span>
//                       )}
                      
//                       {/* Overdue indicator dot */}
//                       {day.hasOverdue && (
//                         <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse border border-white"></span>
//                       )}
                      
//                       {/* Work count badge */}
//                       {day.workCount > 0 && (
//                         <span className="absolute -bottom-2 text-[8px] font-bold bg-purple-600 text-white px-1 rounded-full">
//                           {day.workCount}
//                         </span>
//                       )}
//                     </button>
//                   ) : (
//                     <div className="w-full h-full"></div>
//                   )}
//                 </div>
//               ))}
//             </div>

//             {/* Calendar Legend */}
//             <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap items-center gap-4 text-xs">
//               <div className="flex items-center gap-1">
//                 <span className="w-3 h-3 bg-blue-400 rounded-full border-2 border-blue-400"></span>
//                 <span>Today ({today.getDate()}th)</span>
//               </div>
//               <div className="flex items-center gap-1">
//                 <span className="w-3 h-3 bg-purple-600 rounded-full"></span>
//                 <span>Selected</span>
//               </div>
//               <div className="flex items-center gap-1">
//                 <span className="w-3 h-3 bg-green-500 rounded-full"></span>
//                 <span>Has Works</span>
//               </div>
//               <div className="flex items-center gap-1">
//                 <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
//                 <span>Overdue</span>
//               </div>
//             </div>

//             {/* Selected Date Summary */}
//             {selectedDate && dateWiseWorks && (
//               <div className="mt-4 p-3 bg-purple-50 rounded-lg">
//                 <p className="text-sm font-medium text-purple-700 flex items-center gap-2">
//                   {formatDate(selectedDate)}
//                   {selectedDate === todayDateStr && (
//                     <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
//                       Today
//                     </span>
//                   )}
//                 </p>
//                 <div className="grid grid-cols-3 gap-2 mt-2 text-xs">
//                   <div className="text-center">
//                     <span className="block font-bold text-purple-700">{dateWiseWorks.total || 0}</span>
//                     <span className="text-gray-500">Total</span>
//                   </div>
//                   <div className="text-center">
//                     <span className="block font-bold text-green-600">{dateWiseWorks.completed || 0}</span>
//                     <span className="text-gray-500">Completed</span>
//                   </div>
//                   <div className="text-center">
//                     <span className="block font-bold text-yellow-600">{dateWiseWorks.pending || 0}</span>
//                     <span className="text-gray-500">Pending</span>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Today's Summary Card */}
//           {todaySummary && (
//             <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4 mt-4">
//               <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
//                 <Target className="w-4 h-4 text-blue-600" />
//                 Today's Focus - {formatDate(todayDateStr)}
//               </h3>
//               <div className="space-y-2">
//                 <div className="flex justify-between text-sm">
//                   <span>Due Today:</span>
//                   <span className="font-bold text-red-600">{todaySummary.dueToday || 0}</span>
//                 </div>
//                 <div className="flex justify-between text-sm">
//                   <span>High Priority:</span>
//                   <span className="font-bold text-red-600">{todaySummary.highPriority || 0}</span>
//                 </div>
//                 <div className="flex justify-between text-sm">
//                   <span>Completed Today:</span>
//                   <span className="font-bold text-green-600">{todaySummary.completedToday || 0}</span>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* RIGHT COLUMN - WORK QUEUE */}
//         <div className="lg:col-span-2" id="work-queue">
//           <div className="bg-white rounded-xl shadow-sm p-6">
//             <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
//               <h2 className="font-bold text-gray-800 flex items-center gap-2">
//                 <Package className="w-5 h-5 text-purple-600" />
//                 Work Queue - {formatDate(selectedDate)}
//                 {selectedDate === todayDateStr && (
//                   <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
//                     Today
//                   </span>
//                 )}
//                 {showOverdueOnly && (
//                   <span className="ml-2 px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
//                     Overdue Only
//                   </span>
//                 )}
//               </h2>

//               <div className="flex gap-2">
//                 {/* View Mode Toggle */}
//                 <div className="flex bg-gray-100 rounded-lg p-1">
//                   <button
//                     onClick={() => handleViewModeChange("today")}
//                     className={`px-3 py-1.5 text-xs rounded-md transition ${
//                       viewMode === "today" ? "bg-purple-600 text-white" : "text-gray-600"
//                     }`}
//                   >
//                     Today
//                   </button>
//                   <button
//                     onClick={() => handleViewModeChange("tomorrow")}
//                     className={`px-3 py-1.5 text-xs rounded-md transition ${
//                       viewMode === "tomorrow" ? "bg-purple-600 text-white" : "text-gray-600"
//                     }`}
//                   >
//                     Tomorrow
//                   </button>
//                 </div>

//                 {/* Filter Toggle */}
//                 <button
//                   onClick={() => setShowFilters(!showFilters)}
//                   className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
//                 >
//                   <Filter size={16} />
//                 </button>
//               </div>
//             </div>

//             {/* Filters */}
//             {showFilters && (
//               <div className="mb-4 p-3 bg-gray-50 rounded-lg">
//                 <div className="flex flex-col md:flex-row gap-3">
//                   {/* Status Filter */}
//                   <select
//                     value={statusFilter}
//                     onChange={handleStatusFilter}
//                     className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
//                   >
//                     <option value="all">All Status</option>
//                     <option value="pending">Pending</option>
//                     <option value="accepted">Accepted</option>
//                     <option value="cutting-started">Cutting Started</option>
//                     <option value="cutting-completed">Cutting Completed</option>
//                     <option value="sewing-started">Sewing Started</option>
//                     <option value="sewing-completed">Sewing Completed</option>
//                     <option value="ironing">Ironing</option>
//                     <option value="ready-to-deliver">Ready to Deliver</option>
//                   </select>

//                   {/* Search */}
//                   <div className="relative flex-1">
//                     <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                     <input
//                       type="text"
//                       value={searchTerm}
//                       onChange={handleSearch}
//                       placeholder="Search by Work ID or Customer..."
//                       className="w-full pl-9 pr-8 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
//                     />
//                     {searchTerm && (
//                       <button
//                         onClick={clearSearch}
//                         className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                       >
//                         <X size={16} />
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Work List */}
//             <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
//               {workQueue?.works?.length > 0 ? (
//                 workQueue.works
//                   .filter(work => !showOverdueOnly || (work.estimatedDelivery && new Date(work.estimatedDelivery) < new Date()))
//                   .map((work) => (
//                     <div
//                       key={work._id}
//                       className={`border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer ${getPriorityColor(work.priority)} ${
//                         work.estimatedDelivery && new Date(work.estimatedDelivery) < new Date() && work.status !== 'ready-to-deliver'
//                           ? 'bg-red-50 border-red-300'
//                           : ''
//                       }`}
//                       onClick={() => handleViewWork(work._id)}
//                     >
//                       <div className="flex items-start justify-between mb-2">
//                         <div className="flex items-center gap-2 flex-wrap">
//                           <span className="font-mono text-sm font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded">
//                             #{work.workId}
//                           </span>
//                           <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(work.status)}`}>
//                             {getStatusBadge(work.status)}
//                           </span>
//                           <span className="text-xs font-medium">
//                             {getPriorityDisplay(work.priority)}
//                           </span>
//                           {work.estimatedDelivery && new Date(work.estimatedDelivery) < new Date() && work.status !== 'ready-to-deliver' && (
//                             <span className="px-2 py-1 bg-red-200 text-red-800 rounded-full text-xs font-bold animate-pulse">
//                               ⚠️ OVERDUE
//                             </span>
//                           )}
//                         </div>
//                         <button
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             handleViewWork(work._id);
//                           }}
//                           className="p-1 hover:bg-gray-100 rounded-lg transition"
//                         >
//                           <Eye size={16} className="text-gray-600" />
//                         </button>
//                       </div>

//                       <h3 className="font-bold text-gray-800 mb-1">
//                         {work.garment?.name || 'Unknown Garment'}
//                       </h3>

//                       <div className="grid grid-cols-2 gap-2 text-sm">
//                         <div className="flex items-center gap-1">
//                           <User size={14} className="text-gray-400" />
//                           <span>{work.customer?.name || 'Unknown'}</span>
//                         </div>

//                         <div className="flex items-center gap-1">
//                           <Package size={14} className="text-purple-500" />
//                           <span className="text-xs">
//                             Garment: {work.garment?.garmentId || 'N/A'}
//                           </span>
//                         </div>
//                       </div>

//                       {work.tailor && (
//                         <div className="mt-2 text-xs text-gray-500">
//                           👔 Tailor: {work.tailor.name}
//                         </div>
//                       )}

//                       {work.estimatedDelivery && (
//                         <div className="mt-2 text-xs">
//                           <span className="text-gray-500">📅 Due: </span>
//                           <span className={new Date(work.estimatedDelivery) < new Date() && work.status !== 'ready-to-deliver' 
//                             ? 'text-red-600 font-bold' 
//                             : 'text-gray-700'
//                           }>
//                             {new Date(work.estimatedDelivery).toLocaleDateString()}
//                             {new Date(work.estimatedDelivery) < new Date() && work.status !== 'ready-to-deliver' && (
//                               <span className="ml-2 text-red-600">
//                                 (Overdue by {Math.ceil((new Date() - new Date(work.estimatedDelivery)) / (1000 * 60 * 60 * 24))} days)
//                               </span>
//                             )}
//                           </span>
//                         </div>
//                       )}
//                     </div>
//                   ))
//               ) : (
//                 <div className="text-center py-12 text-gray-500">
//                   <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
//                   <p className="font-medium">No works found</p>
//                   <p className="text-sm text-gray-400 mt-1">
//                     Try adjusting your filters or select another date
//                   </p>
//                 </div>
//               )}
//             </div>

//             {/* Work Queue Stats */}
//             {workQueue?.works?.length > 0 && (
//               <div className="mt-4 pt-3 border-t border-gray-200 flex justify-between text-xs text-gray-600">
//                 <span>Total: <span className="font-bold">{workQueue.total}</span></span>
//                 <span>✅ Completed: <span className="font-bold text-green-600">
//                   {workQueue.works.filter(w => w.status === 'ready-to-deliver').length}
//                 </span></span>
//                 <span>⏳ Pending: <span className="font-bold text-yellow-600">
//                   {workQueue.works.filter(w => w.status !== 'ready-to-deliver').length}
//                 </span></span>
//                 <span>⚠️ Overdue: <span className="font-bold text-red-600">
//                   {workQueue.works.filter(w => 
//                     w.estimatedDelivery && 
//                     new Date(w.estimatedDelivery) < new Date() && 
//                     w.status !== 'ready-to-deliver'
//                   ).length}
//                 </span></span>
//               </div>
//             )}

//             {/* Pagination Info */}
//             {workQueue?.totalPages > 1 && (
//               <div className="mt-4 flex justify-center gap-2 text-xs">
//                 <span className="text-gray-500">
//                   Page {workQueue.page} of {workQueue.totalPages}
//                 </span>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* ========== OVERDUE WORKS SECTION ========== */}
//       <div id="overdue-section">
//         {overdueWorks?.works?.length > 0 && (
//           <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border-2 border-red-200">
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="font-bold text-gray-800 flex items-center gap-2">
//                 <AlertCircle className="w-6 h-6 text-red-500 animate-pulse" />
//                 ⚠️ OVERDUE WORKS ({overdueWorks.count || 0})
//               </h2>
//               <button
//                 onClick={() => {
//                   if (showOverdueOnly) {
//                     setShowOverdueOnly(false);
//                   } else {
//                     setShowOverdueOnly(true);
//                     document.getElementById('work-queue').scrollIntoView({ behavior: 'smooth' });
//                   }
//                 }}
//                 className="px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition text-sm flex items-center gap-1"
//               >
//                 {showOverdueOnly ? 'Show All' : 'View All in Queue'}
//                 <ArrowUpCircle size={14} />
//               </button>
//             </div>

//             <div className="space-y-3">
//               {overdueWorks.works.map((work) => {
//                 const overdueDays = work.overdueBy || 
//                   Math.ceil((new Date() - new Date(work.estimatedDelivery)) / (1000 * 60 * 60 * 24));
                
//                 return (
//                   <div
//                     key={work._id}
//                     className="border border-red-300 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer bg-gradient-to-r from-red-50 to-orange-50"
//                     onClick={() => handleViewWork(work._id)}
//                   >
//                     <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//                       <div className="flex-1">
//                         {/* Top Row */}
//                         <div className="flex items-center gap-2 mb-2 flex-wrap">
//                           <span className="font-mono text-sm font-bold text-red-600 bg-red-100 px-2 py-1 rounded">
//                             #{work.workId}
//                           </span>
//                           <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(work.status)}`}>
//                             {getStatusBadge(work.status)}
//                           </span>
//                           <span className="text-xs font-medium">
//                             {getPriorityDisplay(work.priority)}
//                           </span>
//                           <span className="px-2 py-1 bg-red-200 text-red-800 rounded-full text-xs font-bold">
//                             ⚠️ OVERDUE
//                           </span>
//                         </div>

//                         <h3 className="font-bold text-gray-800 mb-1">
//                           {work.garment?.name || 'Unknown Garment'}
//                         </h3>

//                         <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-sm">
//                           <div className="flex items-center gap-1">
//                             <User size={14} className="text-gray-400" />
//                             <span>{work.customer?.name || 'Unknown'}</span>
//                           </div>

//                           <div className="flex items-center gap-1">
//                             <Package size={14} className="text-purple-500" />
//                             <span className="text-xs">
//                               {work.garment?.garmentId || 'N/A'}
//                             </span>
//                           </div>

//                           <div className="flex items-center gap-1">
//                             <Calendar size={14} className="text-gray-400" />
//                             <span className="text-xs">
//                               Due: {new Date(work.estimatedDelivery).toLocaleDateString()}
//                             </span>
//                           </div>

//                           <div className="flex items-center gap-1">
//                             <AlertCircle size={14} className="text-red-600" />
//                             <span className={`text-sm font-bold ${getOverdueColor(overdueDays)}`}>
//                               Overdue by {overdueDays} {overdueDays === 1 ? 'day' : 'days'}
//                             </span>
//                           </div>
//                         </div>

//                         {/* Progress Bar for Overdue */}
//                         <div className="mt-3">
//                           <div className="flex items-center gap-2">
//                             <span className="text-xs text-gray-600">Delay:</span>
//                             <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
//                               <div 
//                                 className="h-full bg-red-500 rounded-full"
//                                 style={{ 
//                                   width: `${Math.min(overdueDays * 10, 100)}%`,
//                                   backgroundColor: overdueDays > 10 ? '#7f1d1d' : '#ef4444'
//                                 }}
//                               ></div>
//                             </div>
//                             <span className="text-xs font-bold text-red-600">
//                               +{overdueDays} days
//                             </span>
//                           </div>
//                         </div>
//                       </div>

//                       <button
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           handleViewWork(work._id);
//                         }}
//                         className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2 self-end md:self-center shadow-sm"
//                       >
//                         <Eye size={16} />
//                         Take Action
//                       </button>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>

//             {/* Overdue Summary Stats */}
//             <div className="mt-4 pt-3 border-t border-red-200 grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
//               <div className="bg-red-50 p-3 rounded-lg text-center">
//                 <span className="block font-bold text-2xl text-red-600">{overdueWorks.count || 0}</span>
//                 <span className="text-xs text-gray-600">Total Overdue</span>
//               </div>
//               <div className="bg-orange-50 p-3 rounded-lg text-center">
//                 <span className="block font-bold text-2xl text-orange-600">
//                   {overdueWorks.works.filter(w => w.priority === 'high').length}
//                 </span>
//                 <span className="text-xs text-gray-600">High Priority</span>
//               </div>
//               <div className="bg-yellow-50 p-3 rounded-lg text-center">
//                 <span className="block font-bold text-2xl text-yellow-600">
//                   {overdueWorks.works.filter(w => w.priority === 'normal').length}
//                 </span>
//                 <span className="text-xs text-gray-600">Normal Priority</span>
//               </div>
//               <div className="bg-green-50 p-3 rounded-lg text-center">
//                 <span className="block font-bold text-2xl text-green-600">
//                   {overdueWorks.works.filter(w => w.tailor).length}
//                 </span>
//                 <span className="text-xs text-gray-600">Assigned</span>
//               </div>
//             </div>

//             {/* Action Buttons */}
//             <div className="mt-4 flex justify-end gap-3">
//               <button
//                 onClick={() => {
//                   setShowOverdueOnly(true);
//                   document.getElementById('work-queue').scrollIntoView({ behavior: 'smooth' });
//                 }}
//                 className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition text-sm flex items-center gap-2"
//               >
//                 <AlertCircle size={16} />
//                 View All in Queue
//               </button>
//               <button
//                 onClick={loadDashboardData}
//                 className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm flex items-center gap-2"
//               >
//                 <RefreshCw size={16} />
//                 Refresh
//               </button>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* ========== HIGH PRIORITY WORKS SECTION ========== */}
//       {highPriorityWorks?.works?.length > 0 && (
//         <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
//           <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
//             <Flag className="w-5 h-5 text-red-500" />
//             High Priority Works ({highPriorityWorks.count || 0})
//           </h2>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//             {highPriorityWorks.works.map((work) => (
//               <div
//                 key={work._id}
//                 className="border border-red-200 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer bg-gradient-to-br from-red-50 to-orange-50"
//                 onClick={() => handleViewWork(work._id)}
//               >
//                 <div className="flex items-start justify-between mb-2">
//                   <span className="font-mono text-sm font-bold text-red-600">
//                     #{work.workId}
//                   </span>
//                   <span className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded-full">
//                     🔴 High
//                   </span>
//                 </div>
//                 <h3 className="font-bold text-gray-800 mb-1">
//                   {work.garment?.name || 'Unknown'}
//                 </h3>
//                 <p className="text-xs text-gray-500 flex items-center gap-1">
//                   <User size={12} /> {work.customer?.name || 'Unknown'}
//                 </p>
//                 {work.estimatedDelivery && (
//                   <p className={`text-xs mt-2 flex items-center gap-1 ${
//                     new Date(work.estimatedDelivery) < new Date() 
//                       ? 'text-red-600 font-bold' 
//                       : 'text-orange-600'
//                   }`}>
//                     <Calendar size={12} />
//                     Due: {new Date(work.estimatedDelivery).toLocaleDateString()}
//                     {new Date(work.estimatedDelivery) < new Date() && ' (Overdue)'}
//                   </p>
//                 )}
//                 {work.tailor && (
//                   <p className="text-xs text-gray-500 mt-2">
//                     👔 Assigned to: {work.tailor.name}
//                   </p>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* ========== TAILOR PERFORMANCE SECTION ========== */}
//       <div className="bg-white rounded-xl shadow-sm p-6">
//         <div className="flex items-center justify-between mb-4">
//           <h2 className="font-bold text-gray-800 flex items-center gap-2">
//             <Users className="w-5 h-5 text-purple-600" />
//             Tailor Performance
//           </h2>
//           {availableTailors?.summary?.available > 0 && (
//             <div className="flex items-center gap-3">
//               <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full flex items-center gap-1">
//                 <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
//                 {availableTailors.summary.available} Available Now
//               </span>
//               <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">
//                 {availableTailors.summary.onLeave || 0} On Leave
//               </span>
//             </div>
//           )}
//         </div>

//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead>
//               <tr className="border-b border-gray-200 bg-gray-50">
//                 <th className="text-left py-3 px-2 text-xs font-medium text-gray-500">Tailor</th>
//                 <th className="text-center py-3 px-2 text-xs font-medium text-gray-500">Assigned</th>
//                 <th className="text-center py-3 px-2 text-xs font-medium text-gray-500">Completed</th>
//                 <th className="text-center py-3 px-2 text-xs font-medium text-gray-500">Pending</th>
//                 <th className="text-center py-3 px-2 text-xs font-medium text-gray-500">In Progress</th>
//                 <th className="text-center py-3 px-2 text-xs font-medium text-gray-500">Efficiency</th>
//                 <th className="text-center py-3 px-2 text-xs font-medium text-gray-500">Status</th>
//                 <th className="text-right py-3 px-2 text-xs font-medium text-gray-500">Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {tailorPerformance?.tailors?.length > 0 ? (
//                 tailorPerformance.tailors.map((tailor) => {
//                   const isAvailable = availableTailors?.availableTailors?.some(t => t._id === tailor._id);
                  
//                   return (
//                     <tr key={tailor._id} className="border-b border-gray-100 hover:bg-gray-50">
//                       <td className="py-3 px-2">
//                         <div className="font-medium text-gray-800">{tailor.name}</div>
//                         <div className="text-xs text-gray-500">{tailor.employeeId}</div>
//                       </td>
//                       <td className="text-center py-3 px-2 font-bold">{tailor.assigned || 0}</td>
//                       <td className="text-center py-3 px-2 text-green-600 font-bold">{tailor.completed || 0}</td>
//                       <td className="text-center py-3 px-2 text-yellow-600 font-bold">{tailor.pending || 0}</td>
//                       <td className="text-center py-3 px-2 text-purple-600 font-bold">{tailor.inProgress || 0}</td>
//                       <td className="text-center py-3 px-2">
//                         <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                           tailor.efficiency >= 80 ? 'bg-green-100 text-green-700' :
//                           tailor.efficiency >= 60 ? 'bg-blue-100 text-blue-700' :
//                           tailor.efficiency >= 40 ? 'bg-yellow-100 text-yellow-700' :
//                           'bg-red-100 text-red-700'
//                         }`}>
//                           {tailor.efficiency || 0}%
//                         </span>
//                       </td>
//                       <td className="text-center py-3 px-2">
//                         {isAvailable ? (
//                           <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs flex items-center justify-center gap-1">
//                             <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
//                             Available
//                           </span>
//                         ) : (
//                           <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
//                             Busy
//                           </span>
//                         )}
//                       </td>
//                       <td className="text-right py-3 px-2">
//                         <button
//                           onClick={() => handleViewTailor(tailor._id)}
//                           className="text-xs px-3 py-1 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition"
//                         >
//                           View Profile
//                         </button>
//                       </td>
//                     </tr>
//                   );
//                 })
//               ) : (
//                 <tr>
//                   <td colSpan="8" className="text-center py-8 text-gray-500">
//                     No tailors found
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* Availability Summary */}
//         {availableTailors?.summary && (
//           <div className="mt-4 pt-3 border-t border-gray-200 grid grid-cols-3 gap-4 text-center text-sm">
//             <div className="bg-blue-50 p-2 rounded-lg">
//               <span className="block font-bold text-blue-700">{availableTailors.summary.total || 0}</span>
//               <span className="text-gray-500 text-xs">Total Tailors</span>
//             </div>
//             <div className="bg-green-50 p-2 rounded-lg">
//               <span className="block font-bold text-green-600">{availableTailors.summary.available || 0}</span>
//               <span className="text-gray-500 text-xs">Available Now</span>
//             </div>
//             <div className="bg-orange-50 p-2 rounded-lg">
//               <span className="block font-bold text-orange-600">{availableTailors.summary.onLeave || 0}</span>
//               <span className="text-gray-500 text-xs">On Leave</span>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }












// // Pages/works/CuttingMasterDashboard.jsx
// import React, { useState, useEffect, useCallback } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import {
//   Calendar,
//   ChevronLeft,
//   ChevronRight,
//   Scissors,
//   Clock,
//   CheckCircle,
//   AlertCircle,
//   Target,
//   Package,
//   Flag,
//   Users,
//   Eye,
//   RefreshCw,
//   User,
//   Filter,
//   Search,
//   X,
//   ArrowUpCircle,
//   ArrowDownCircle
// } from "lucide-react";
// import {
//   fetchDashboardStats,
//   fetchWorkStatusBreakdown,
//   fetchTailorPerformance,
//   fetchAvailableTailors,
//   fetchWorkQueue,
//   fetchTodaySummary,
//   fetchHighPriorityWorks,
//   fetchOverdueWorks,
//   fetchMonthlySchedule,
//   fetchWorksByDate,
//   selectDashboardStats,
//   selectStatusBreakdown,
//   selectTailorPerformance,
//   selectAvailableTailors,
//   selectWorkQueue,
//   selectTodaySummary,
//   selectHighPriorityWorks,
//   selectOverdueWorks,
//   selectMonthlySchedule,
//   selectWorksByDate,
//   selectCuttingMasterLoading
// } from "../features/cuttingMaster/cuttingMasterSlice";
// import showToast from "../utils/toast";
// import { debounce } from "lodash";

// export default function CuttingMasterDashboard() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   // Selectors
//   const dashboardStats = useSelector(selectDashboardStats);
//   const statusBreakdown = useSelector(selectStatusBreakdown);
//   const tailorPerformance = useSelector(selectTailorPerformance);
//   const availableTailors = useSelector(selectAvailableTailors);
//   const workQueue = useSelector(selectWorkQueue);
//   const todaySummary = useSelector(selectTodaySummary);
//   const highPriorityWorks = useSelector(selectHighPriorityWorks);
//   const overdueWorks = useSelector(selectOverdueWorks);
//   const monthlySchedule = useSelector(selectMonthlySchedule);
//   const dateWiseWorks = useSelector(selectWorksByDate);
//   const loading = useSelector(selectCuttingMasterLoading);

//   // ===== FIXED: Get today's date correctly with local timezone =====
//   const getLocalDateStr = (date) => {
//     const year = date.getFullYear();
//     const month = String(date.getMonth() + 1).padStart(2, '0');
//     const day = String(date.getDate()).padStart(2, '0');
//     return `${year}-${month}-${day}`;
//   };

//   const today = new Date();
//   const todayDateStr = getLocalDateStr(today);
  
//   // Local state
//   const [selectedDate, setSelectedDate] = useState(todayDateStr);
//   const [currentMonth, setCurrentMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
//   const [viewMode, setViewMode] = useState("today");
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [showFilters, setShowFilters] = useState(false);
//   const [calendarDays, setCalendarDays] = useState([]);
//   const [showOverdueOnly, setShowOverdueOnly] = useState(false);

//   // ===== DEBUG: Log Redux state on mount =====
//   useEffect(() => {
//     console.log("%c🔍 CUTTING MASTER DASHBOARD MOUNTED", "background: purple; color: white; font-size: 16px");
//     console.log("📅 Today Date:", todayDateStr);
//     console.log("📊 Initial Redux State:", {
//       dashboardStats,
//       workQueue: workQueue?.works?.length,
//       highPriorityWorks: highPriorityWorks?.works?.length,
//       overdueWorks: overdueWorks?.works?.length,
//       tailorPerformance: tailorPerformance?.tailors?.length
//     });
//   }, []);

//   // ===== DEBUG: Log when workQueue changes =====
//   useEffect(() => {
//     if (workQueue?.works?.length > 0) {
//       console.log("%c📦 WORK QUEUE UPDATED", "background: blue; color: white; font-size: 14px");
//       console.log(`Total works: ${workQueue.works.length}`);
      
//       // Log each work's priority sources
//       workQueue.works.forEach((work, index) => {
//         console.log(`\n📋 Work ${index + 1}: ${work.workId}`);
//         console.log("  🔍 Priority Sources:", {
//           workId: work.workId,
//           directPriority: work.priority,
//           garmentPriority: work.garment?.priority,
//           orderGarmentPriority: work.order?.garment?.priority,
//           garmentName: work.garment?.name,
//           status: work.status
//         });
//       });

//       // Count priorities
//       const priorityCount = workQueue.works.reduce((acc, work) => {
//         const p = work.garment?.priority || work.priority || 'normal';
//         acc[p] = (acc[p] || 0) + 1;
//         return acc;
//       }, {});
      
//       console.log("\n📊 Priority Distribution (Raw):", priorityCount);
//     }
//   }, [workQueue]);

//   // ===== DEBUG: Log high priority works =====
//   useEffect(() => {
//     if (highPriorityWorks?.works?.length > 0) {
//       console.log("%c🔴 HIGH PRIORITY WORKS UPDATED", "background: red; color: white; font-size: 14px");
//       console.log(`Count: ${highPriorityWorks.count}`);
//       console.log("Works:", highPriorityWorks.works.map(w => ({
//         id: w.workId,
//         garment: w.garment?.name,
//         priority: w.garment?.priority
//       })));
//     }
//   }, [highPriorityWorks]);

//   // ===== DEBUG: Log overdue works =====
//   useEffect(() => {
//     if (overdueWorks?.works?.length > 0) {
//       console.log("%c⚠️ OVERDUE WORKS UPDATED", "background: orange; color: white; font-size: 14px");
//       console.log(`Count: ${overdueWorks.count}`);
//     }
//   }, [overdueWorks]);

//   // ===== DEBUG: Log API calls =====
//   const logApiCall = (apiName, params) => {
//     console.log(`%c📡 API Call: ${apiName}`, "background: green; color: white; font-size: 12px", params);
//   };

//   // ===== ENHANCED: Priority Detection Functions with Debug =====
//   const getWorkPriority = useCallback((work, source = '') => {
//     if (!work) {
//       console.warn(`⚠️ [${source}] Work object is null or undefined`);
//       return 'normal';
//     }
    
//     // Check multiple possible locations for priority
//     const priority = 
//       work.priority ||                    // Direct work priority
//       work.garment?.priority ||            // From garment
//       work.order?.garment?.priority ||     // From order's garment
//       'normal';                            // Default
    
//     // Debug log for priority detection
//     if (source) {
//       console.log(`🔍 [${source}] Priority detection for ${work.workId || 'unknown'}:`, {
//         input: {
//           workId: work.workId,
//           directPriority: work.priority,
//           garmentPriority: work.garment?.priority,
//           orderGarmentPriority: work.order?.garment?.priority
//         },
//         detected: priority
//       });
//     }
    
//     return priority;
//   }, []);

//   const getPriorityWeight = useCallback((priority) => {
//     const weights = { high: 1, normal: 2, low: 3 };
//     return weights[priority] || 2;
//   }, []);

//   const getPriorityDisplay = useCallback((priority) => {
//     const displays = {
//       'high': '🔴 High',
//       'normal': '🟠 Normal',
//       'low': '🟢 Low'
//     };
//     return displays[priority] || '🟠 Normal';
//   }, []);

//   const getPriorityColor = useCallback((priority) => {
//     const colors = {
//       'high': 'border-l-4 border-l-red-500 bg-red-50',
//       'normal': 'border-l-4 border-l-orange-400 bg-orange-50',
//       'low': 'border-l-4 border-l-green-500 bg-green-50'
//     };
//     return colors[priority] || 'border-l-4 border-l-orange-400 bg-orange-50';
//   }, []);

//   const getPriorityBadge = useCallback((priority) => {
//     const badges = {
//       'high': (
//         <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-bold flex items-center gap-1">
//           <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
//           🔴 High Priority
//         </span>
//       ),
//       'normal': (
//         <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs flex items-center gap-1">
//           <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
//           🟠 Normal
//         </span>
//       ),
//       'low': (
//         <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs flex items-center gap-1">
//           <span className="w-2 h-2 bg-green-500 rounded-full"></span>
//           🟢 Low
//         </span>
//       )
//     };
//     return badges[priority] || badges.normal;
//   }, []);

//   // ===== DEBUG: Log priorities when workQueue loads with detailed analysis =====
//   useEffect(() => {
//     if (workQueue?.works?.length > 0) {
//       console.log("%c🔍 PRIORITY DEBUG - Work Queue Analysis", "background: purple; color: white; font-size: 16px");
//       console.log("=".repeat(80));
      
//       const detailedAnalysis = workQueue.works.map((work, index) => {
//         const priority = getWorkPriority(work, `Work ${index + 1}`);
//         return {
//           index: index + 1,
//           workId: work.workId,
//           detectedPriority: priority,
//           display: getPriorityDisplay(priority),
//           sources: {
//             workPriority: work.priority,
//             garmentPriority: work.garment?.priority,
//             orderGarmentPriority: work.order?.garment?.priority
//           },
//           garmentName: work.garment?.name || 'Unknown',
//           status: work.status,
//           hasGarment: !!work.garment,
//           hasOrder: !!work.order
//         };
//       });

//       console.table(detailedAnalysis.map(({ workId, detectedPriority, display, sources, garmentName, status }) => ({
//         workId,
//         garmentName,
//         status,
//         detectedPriority,
//         display,
//         workPriority: sources.workPriority,
//         garmentPriority: sources.garmentPriority
//       })));

//       // Count priorities
//       const priorityCount = workQueue.works.reduce((acc, work) => {
//         const p = getWorkPriority(work);
//         acc[p] = (acc[p] || 0) + 1;
//         return acc;
//       }, {});

//       console.log("\n📊 Priority Distribution:", priorityCount);
      
//       // Check for works with missing priority
//       const missingPriority = workQueue.works.filter(w => 
//         !w.priority && !w.garment?.priority
//       );
      
//       if (missingPriority.length > 0) {
//         console.warn(`⚠️ ${missingPriority.length} works have no priority set:`, 
//           missingPriority.map(w => w.workId)
//         );
//       }
      
//       console.log("=".repeat(80));
//     }
//   }, [workQueue, getWorkPriority, getPriorityDisplay]);

//   // ===== DEBUG: Log when filters change =====
//   useEffect(() => {
//     console.log("🔍 Filters changed:", {
//       statusFilter,
//       searchTerm,
//       selectedDate,
//       showOverdueOnly,
//       viewMode
//     });
//   }, [statusFilter, searchTerm, selectedDate, showOverdueOnly, viewMode]);

//   // Load initial data
//   useEffect(() => {
//     logApiCall('loadDashboardData', { selectedDate });
//     loadDashboardData();
//   }, []);

//   // Load data when month changes
//   useEffect(() => {
//     logApiCall('loadMonthlySchedule', { 
//       year: currentMonth.getFullYear(), 
//       month: currentMonth.getMonth() + 1 
//     });
//     loadMonthlySchedule();
//   }, [currentMonth]);

//   // Load data when selected date changes
//   useEffect(() => {
//     if (selectedDate) {
//       logApiCall('fetchWorksByDate', { selectedDate });
//       dispatch(fetchWorksByDate(selectedDate));
      
//       logApiCall('fetchWorkQueue', { 
//         date: selectedDate, 
//         status: statusFilter, 
//         search: searchTerm 
//       });
//       dispatch(fetchWorkQueue({ 
//         date: selectedDate, 
//         status: statusFilter, 
//         search: searchTerm 
//       }));
//     }
//   }, [selectedDate, dispatch, statusFilter, searchTerm]);

//   // Generate calendar days when monthly schedule changes
//   useEffect(() => {
//     if (monthlySchedule) {
//       generateCalendarDays();
//     }
//   }, [currentMonth, monthlySchedule]);

//   const loadDashboardData = async () => {
//     try {
//       logApiCall('fetchDashboardStats', {});
//       await Promise.all([
//         dispatch(fetchDashboardStats()),
//         dispatch(fetchWorkStatusBreakdown()),
//         dispatch(fetchTailorPerformance()),
//         dispatch(fetchAvailableTailors()),
//         dispatch(fetchTodaySummary()),
//         dispatch(fetchHighPriorityWorks()),
//         dispatch(fetchOverdueWorks())
//       ]);
      
//       logApiCall('fetchWorkQueue (initial)', { 
//         date: selectedDate, 
//         status: statusFilter, 
//         search: searchTerm 
//       });
//       dispatch(fetchWorkQueue({ 
//         date: selectedDate, 
//         status: statusFilter, 
//         search: searchTerm 
//       }));
      
//       showToast.success("Dashboard data loaded successfully");
//     } catch (error) {
//       console.error("❌ Error loading dashboard data:", error);
//       showToast.error("Failed to load dashboard data");
//     }
//   };

//   const loadMonthlySchedule = async () => {
//     try {
//       const year = currentMonth.getFullYear();
//       const month = currentMonth.getMonth() + 1;
//       await dispatch(fetchMonthlySchedule({ year, month }));
//     } catch (error) {
//       console.error("Failed to load schedule:", error);
//     }
//   };

//   const generateCalendarDays = () => {
//     const year = currentMonth.getFullYear();
//     const month = currentMonth.getMonth();
    
//     const firstDay = new Date(year, month, 1);
//     const lastDay = new Date(year, month + 1, 0);
    
//     const days = [];
//     const startDay = firstDay.getDay();
    
//     for (let i = 0; i < startDay; i++) {
//       days.push(null);
//     }
    
//     for (let d = 1; d <= lastDay.getDate(); d++) {
//       const date = new Date(year, month, d);
//       const dateStr = getLocalDateStr(date);
      
//       const daySchedule = monthlySchedule?.[dateStr] || { 
//         hasWork: false, 
//         hasOverdue: false, 
//         workCount: 0 
//       };
      
//       const isToday = dateStr === todayDateStr;
      
//       days.push({
//         date,
//         dateStr,
//         day: d,
//         hasWork: daySchedule.hasWork || false,
//         hasOverdue: daySchedule.hasOverdue || false,
//         workCount: daySchedule.workCount || 0,
//         isToday: isToday
//       });
//     }
    
//     setCalendarDays(days);
//   };

//   const debouncedSearch = useCallback(
//     debounce((term) => {
//       logApiCall('debouncedSearch', { term, statusFilter, selectedDate });
//       dispatch(fetchWorkQueue({ 
//         date: selectedDate,
//         status: statusFilter, 
//         search: term 
//       }));
//     }, 500),
//     [selectedDate, statusFilter, dispatch]
//   );

//   const handleRefresh = () => {
//     logApiCall('handleRefresh', {});
//     loadDashboardData();
//     loadMonthlySchedule();
//     showToast.success("Dashboard refreshed");
//   };

//   const handlePrevMonth = () => {
//     const newMonth = new Date(currentMonth);
//     newMonth.setMonth(currentMonth.getMonth() - 1);
//     setCurrentMonth(newMonth);
//   };

//   const handleNextMonth = () => {
//     const newMonth = new Date(currentMonth);
//     newMonth.setMonth(currentMonth.getMonth() + 1);
//     setCurrentMonth(newMonth);
//   };

//   const handleDateSelect = (day) => {
//     if (day) {
//       logApiCall('handleDateSelect', { date: day.dateStr });
//       setSelectedDate(day.dateStr);
//       setViewMode("custom");
//     }
//   };

//   const handleViewWork = (workId) => {
//     logApiCall('handleViewWork', { workId });
//     navigate(`/cuttingmaster/works/${workId}`);
//   };

//   const handleViewTailor = (tailorId) => {
//     logApiCall('handleViewTailor', { tailorId });
//     navigate(`/cuttingmaster/tailors/${tailorId}`);
//   };

//   const handleStatusFilter = (e) => {
//     const status = e.target.value;
//     logApiCall('handleStatusFilter', { status, selectedDate, searchTerm });
//     setStatusFilter(status);
//     dispatch(fetchWorkQueue({ 
//       date: selectedDate,
//       status, 
//       search: searchTerm 
//     }));
//   };

//   const handleSearch = (e) => {
//     const term = e.target.value;
//     setSearchTerm(term);
//     debouncedSearch(term);
//   };

//   const handleViewModeChange = (mode) => {
//     logApiCall('handleViewModeChange', { mode });
//     setViewMode(mode);
//     const date = new Date();
//     if (mode === "tomorrow") {
//       date.setDate(date.getDate() + 1);
//     }
//     const dateStr = getLocalDateStr(date);
//     setSelectedDate(dateStr);
//   };

//   const clearSearch = () => {
//     logApiCall('clearSearch', {});
//     setSearchTerm("");
//     dispatch(fetchWorkQueue({ 
//       date: selectedDate,
//       status: statusFilter, 
//       search: "" 
//     }));
//   };

//   const formatDate = (dateStr) => {
//     const date = new Date(dateStr + 'T12:00:00');
//     return date.toLocaleDateString('en-IN', {
//       day: 'numeric',
//       month: 'long',
//       year: 'numeric'
//     });
//   };

//   const getStatusColor = (status) => {
//     const colors = {
//       'pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
//       'accepted': 'bg-blue-100 text-blue-800 border-blue-200',
//       'cutting-started': 'bg-purple-100 text-purple-800 border-purple-200',
//       'cutting-completed': 'bg-indigo-100 text-indigo-800 border-indigo-200',
//       'sewing-started': 'bg-pink-100 text-pink-800 border-pink-200',
//       'sewing-completed': 'bg-teal-100 text-teal-800 border-teal-200',
//       'ironing': 'bg-orange-100 text-orange-800 border-orange-200',
//       'ready-to-deliver': 'bg-green-100 text-green-800 border-green-200'
//     };
//     return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
//   };

//   const getStatusBadge = (status) => {
//     const badges = {
//       'pending': '⏳ Pending',
//       'accepted': '✅ Accepted',
//       'cutting-started': '✂️ Cutting Started',
//       'cutting-completed': '✔️ Cutting Completed',
//       'sewing-started': '🧵 Sewing Started',
//       'sewing-completed': '🧵 Sewing Completed',
//       'ironing': '🔥 Ironing',
//       'ready-to-deliver': '📦 Ready to Deliver'
//     };
//     return badges[status] || status;
//   };

//   const getOverdueColor = (days) => {
//     if (days > 5) return 'text-red-700 font-bold';
//     if (days > 2) return 'text-red-600 font-semibold';
//     return 'text-red-500';
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 md:p-6">
//       {/* Debug Info - Only visible in development */}
//       {process.env.NODE_ENV === 'development' && (
//         <div className="mb-4 p-3 bg-gray-800 text-white rounded-lg text-xs font-mono">
//           <details>
//             <summary className="cursor-pointer font-bold">🔧 Debug Info (Click to expand)</summary>
//             <div className="mt-2 space-y-1">
//               <div>📅 Today: {todayDateStr}</div>
//               <div>📊 Works: {workQueue?.works?.length || 0}</div>
//               <div>🔴 High Priority: {highPriorityWorks?.count || 0}</div>
//               <div>⚠️ Overdue: {overdueWorks?.count || 0}</div>
//               <div>👔 Tailors: {tailorPerformance?.tailors?.length || 0}</div>
//               <div>🟢 Available: {availableTailors?.summary?.available || 0}</div>
//               <div>📅 Selected Date: {selectedDate}</div>
//               <div>🔍 Status Filter: {statusFilter}</div>
//               <div>🔎 Search: {searchTerm || 'none'}</div>
//             </div>
//           </details>
//         </div>
//       )}

//       {/* Header Section */}
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
//         <div>
//           <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
//             <Scissors className="w-8 h-8 text-purple-600" />
//             Cutting Master Dashboard
//           </h1>
//           <p className="text-sm text-gray-500 mt-1">
//             {formatDate(todayDateStr)}
//           </p>
//         </div>

//         <div className="flex items-center gap-3">
//           <button
//             onClick={() => setShowOverdueOnly(!showOverdueOnly)}
//             className={`px-4 py-2 rounded-lg transition flex items-center gap-2 shadow-sm ${
//               showOverdueOnly 
//                 ? 'bg-red-100 text-red-700 border border-red-300' 
//                 : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
//             }`}
//           >
//             <AlertCircle size={18} />
//             <span>Show Overdue Only</span>
//             {overdueWorks?.count > 0 && (
//               <span className="ml-1 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
//                 {overdueWorks.count}
//               </span>
//             )}
//           </button>

//           <button
//             onClick={handleRefresh}
//             disabled={loading}
//             className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center gap-2 shadow-sm disabled:opacity-50"
//           >
//             <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
//             Refresh
//           </button>
//         </div>
//       </div>

//       {/* KPI Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//         <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-blue-500">
//           <div className="flex items-center justify-between mb-2">
//             <p className="text-sm text-gray-500">Total Work</p>
//             <Package className="w-5 h-5 text-blue-500" />
//           </div>
//           <p className="text-3xl font-bold text-gray-800">
//             {dashboardStats?.totalWork || 0}
//           </p>
//           <p className="text-xs text-gray-400 mt-1">All assigned works</p>
//         </div>

//         <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-green-500">
//           <div className="flex items-center justify-between mb-2">
//             <p className="text-sm text-gray-500">Completed Work</p>
//             <CheckCircle className="w-5 h-5 text-green-500" />
//           </div>
//           <p className="text-3xl font-bold text-gray-800">
//             {dashboardStats?.completedWork || 0}
//           </p>
//           <p className="text-xs text-gray-400 mt-1">Ready to deliver</p>
//         </div>

//         <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-purple-500">
//           <div className="flex items-center justify-between mb-2">
//             <p className="text-sm text-gray-500">In Progress</p>
//             <Clock className="w-5 h-5 text-purple-500" />
//           </div>
//           <p className="text-3xl font-bold text-gray-800">
//             {dashboardStats?.inProgressWork || 0}
//           </p>
//           <p className="text-xs text-gray-400 mt-1">Cutting/Sewing/Ironing</p>
//         </div>

//         <div 
//           className={`bg-white rounded-xl p-6 shadow-sm border-l-4 cursor-pointer transition ${
//             overdueWorks?.count > 0 ? 'border-l-red-500 hover:bg-red-50' : 'border-l-gray-300'
//           }`}
//           onClick={() => {
//             if (overdueWorks?.count > 0) {
//               document.getElementById('overdue-section').scrollIntoView({ behavior: 'smooth' });
//             }
//           }}
//         >
//           <div className="flex items-center justify-between mb-2">
//             <p className="text-sm text-gray-500">Overdue</p>
//             <AlertCircle className={`w-5 h-5 ${overdueWorks?.count > 0 ? 'text-red-500' : 'text-gray-400'}`} />
//           </div>
//           <p className={`text-3xl font-bold ${overdueWorks?.count > 0 ? 'text-red-600' : 'text-gray-800'}`}>
//             {dashboardStats?.overdueWork || 0}
//           </p>
//           <p className="text-xs text-gray-400 mt-1">Past delivery date</p>
//           {overdueWorks?.count > 0 && (
//             <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
//               <ArrowDownCircle size={12} />
//               Click to view overdue
//             </p>
//           )}
//         </div>
//       </div>

//       {/* Main Grid - Calendar + Work Queue */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
//         {/* Left Column - Calendar */}
//         <div className="lg:col-span-1">
//           <div className="bg-white rounded-xl shadow-sm p-4">
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="font-bold text-gray-800 flex items-center gap-2">
//                 <Calendar className="w-5 h-5 text-purple-600" />
//                 {currentMonth.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
//               </h2>
//               <div className="flex gap-1">
//                 <button
//                   onClick={handlePrevMonth}
//                   className="p-1 hover:bg-gray-100 rounded-lg transition"
//                 >
//                   <ChevronLeft size={18} />
//                 </button>
//                 <button
//                   onClick={handleNextMonth}
//                   className="p-1 hover:bg-gray-100 rounded-lg transition"
//                 >
//                   <ChevronRight size={18} />
//                 </button>
//               </div>
//             </div>

//             <div className="grid grid-cols-7 gap-1 mb-2 text-center text-xs font-medium text-gray-500">
//               <div>Su</div>
//               <div>Mo</div>
//               <div>Tu</div>
//               <div>We</div>
//               <div>Th</div>
//               <div>Fr</div>
//               <div>Sa</div>
//             </div>

//             <div className="grid grid-cols-7 gap-1">
//               {calendarDays.map((day, index) => (
//                 <div key={index} className="aspect-square">
//                   {day ? (
//                     <button
//                       onClick={() => handleDateSelect(day)}
//                       className={`w-full h-full flex items-center justify-center rounded-lg text-sm transition-all relative
//                         ${selectedDate === day.dateStr 
//                           ? 'bg-purple-600 text-white font-bold ring-2 ring-purple-300'
//                           : day.isToday 
//                             ? 'bg-blue-100 text-blue-800 font-bold border-2 border-blue-400'
//                             : 'hover:bg-gray-100'
//                         }
//                         ${day.hasWork ? 'font-semibold' : ''}
//                       `}
//                     >
//                       <span>{day.day}</span>
//                       {day.hasWork && !day.hasOverdue && (
//                         <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full border border-white"></span>
//                       )}
//                       {day.hasOverdue && (
//                         <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse border border-white"></span>
//                       )}
//                       {day.workCount > 0 && (
//                         <span className="absolute -bottom-2 text-[8px] font-bold bg-purple-600 text-white px-1 rounded-full">
//                           {day.workCount}
//                         </span>
//                       )}
//                     </button>
//                   ) : (
//                     <div className="w-full h-full"></div>
//                   )}
//                 </div>
//               ))}
//             </div>

//             <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap items-center gap-4 text-xs">
//               <div className="flex items-center gap-1">
//                 <span className="w-3 h-3 bg-blue-400 rounded-full border-2 border-blue-400"></span>
//                 <span>Today ({today.getDate()}th)</span>
//               </div>
//               <div className="flex items-center gap-1">
//                 <span className="w-3 h-3 bg-purple-600 rounded-full"></span>
//                 <span>Selected</span>
//               </div>
//               <div className="flex items-center gap-1">
//                 <span className="w-3 h-3 bg-green-500 rounded-full"></span>
//                 <span>Has Works</span>
//               </div>
//               <div className="flex items-center gap-1">
//                 <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
//                 <span>Overdue</span>
//               </div>
//             </div>

//             {selectedDate && dateWiseWorks && (
//               <div className="mt-4 p-3 bg-purple-50 rounded-lg">
//                 <p className="text-sm font-medium text-purple-700 flex items-center gap-2">
//                   {formatDate(selectedDate)}
//                   {selectedDate === todayDateStr && (
//                     <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
//                       Today
//                     </span>
//                   )}
//                 </p>
//                 <div className="grid grid-cols-3 gap-2 mt-2 text-xs">
//                   <div className="text-center">
//                     <span className="block font-bold text-purple-700">{dateWiseWorks.total || 0}</span>
//                     <span className="text-gray-500">Total</span>
//                   </div>
//                   <div className="text-center">
//                     <span className="block font-bold text-green-600">{dateWiseWorks.completed || 0}</span>
//                     <span className="text-gray-500">Completed</span>
//                   </div>
//                   <div className="text-center">
//                     <span className="block font-bold text-yellow-600">{dateWiseWorks.pending || 0}</span>
//                     <span className="text-gray-500">Pending</span>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>

//           {todaySummary && (
//             <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4 mt-4">
//               <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
//                 <Target className="w-4 h-4 text-blue-600" />
//                 Today's Focus - {formatDate(todayDateStr)}
//               </h3>
//               <div className="space-y-2">
//                 <div className="flex justify-between text-sm">
//                   <span>Due Today:</span>
//                   <span className="font-bold text-red-600">{todaySummary.dueToday || 0}</span>
//                 </div>
//                 <div className="flex justify-between text-sm">
//                   <span>High Priority:</span>
//                   <span className="font-bold text-red-600">{todaySummary.highPriority || 0}</span>
//                 </div>
//                 <div className="flex justify-between text-sm">
//                   <span>Completed Today:</span>
//                   <span className="font-bold text-green-600">{todaySummary.completedToday || 0}</span>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Right Column - Work Queue */}
//         <div className="lg:col-span-2" id="work-queue">
//           <div className="bg-white rounded-xl shadow-sm p-6">
//             <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
//               <h2 className="font-bold text-gray-800 flex items-center gap-2">
//                 <Package className="w-5 h-5 text-purple-600" />
//                 Work Queue - {formatDate(selectedDate)}
//                 {selectedDate === todayDateStr && (
//                   <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
//                     Today
//                   </span>
//                 )}
//                 {showOverdueOnly && (
//                   <span className="ml-2 px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
//                     Overdue Only
//                   </span>
//                 )}
//               </h2>

//               <div className="flex gap-2">
//                 <div className="flex bg-gray-100 rounded-lg p-1">
//                   <button
//                     onClick={() => handleViewModeChange("today")}
//                     className={`px-3 py-1.5 text-xs rounded-md transition ${
//                       viewMode === "today" ? "bg-purple-600 text-white" : "text-gray-600"
//                     }`}
//                   >
//                     Today
//                   </button>
//                   <button
//                     onClick={() => handleViewModeChange("tomorrow")}
//                     className={`px-3 py-1.5 text-xs rounded-md transition ${
//                       viewMode === "tomorrow" ? "bg-purple-600 text-white" : "text-gray-600"
//                     }`}
//                   >
//                     Tomorrow
//                   </button>
//                 </div>

//                 <button
//                   onClick={() => setShowFilters(!showFilters)}
//                   className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
//                 >
//                   <Filter size={16} />
//                 </button>
//               </div>
//             </div>

//             {showFilters && (
//               <div className="mb-4 p-3 bg-gray-50 rounded-lg">
//                 <div className="flex flex-col md:flex-row gap-3">
//                   <select
//                     value={statusFilter}
//                     onChange={handleStatusFilter}
//                     className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
//                   >
//                     <option value="all">All Status</option>
//                     <option value="pending">Pending</option>
//                     <option value="accepted">Accepted</option>
//                     <option value="cutting-started">Cutting Started</option>
//                     <option value="cutting-completed">Cutting Completed</option>
//                     <option value="sewing-started">Sewing Started</option>
//                     <option value="sewing-completed">Sewing Completed</option>
//                     <option value="ironing">Ironing</option>
//                     <option value="ready-to-deliver">Ready to Deliver</option>
//                   </select>

//                   <div className="relative flex-1">
//                     <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                     <input
//                       type="text"
//                       value={searchTerm}
//                       onChange={handleSearch}
//                       placeholder="Search by Work ID or Customer..."
//                       className="w-full pl-9 pr-8 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
//                     />
//                     {searchTerm && (
//                       <button
//                         onClick={clearSearch}
//                         className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                       >
//                         <X size={16} />
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Work List with Priority Display */}
//             <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
//               {workQueue?.works?.length > 0 ? (
//                 workQueue.works
//                   .filter(work => !showOverdueOnly || (work.estimatedDelivery && new Date(work.estimatedDelivery) < new Date()))
//                   .map((work) => {
//                     const priority = getWorkPriority(work, 'render');
                    
//                     return (
//                       <div
//                         key={work._id}
//                         className={`border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer ${getPriorityColor(priority)} ${
//                           work.estimatedDelivery && new Date(work.estimatedDelivery) < new Date() && work.status !== 'ready-to-deliver'
//                             ? 'bg-red-50 border-red-300'
//                             : ''
//                         }`}
//                         onClick={() => handleViewWork(work._id)}
//                       >
//                         <div className="flex items-start justify-between mb-2">
//                           <div className="flex items-center gap-2 flex-wrap">
//                             <span className="font-mono text-sm font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded">
//                               #{work.workId}
//                             </span>
//                             <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(work.status)}`}>
//                               {getStatusBadge(work.status)}
//                             </span>
//                             {/* Priority Badge - Now using the work's priority */}
//                             {getPriorityBadge(priority)}
                            
//                             {work.estimatedDelivery && new Date(work.estimatedDelivery) < new Date() && work.status !== 'ready-to-deliver' && (
//                               <span className="px-2 py-1 bg-red-200 text-red-800 rounded-full text-xs font-bold animate-pulse">
//                                 ⚠️ OVERDUE
//                               </span>
//                             )}
//                           </div>
//                           <button
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               handleViewWork(work._id);
//                             }}
//                             className="p-1 hover:bg-gray-100 rounded-lg transition"
//                           >
//                             <Eye size={16} className="text-gray-600" />
//                           </button>
//                         </div>

//                         <h3 className="font-bold text-gray-800 mb-1">
//                           {work.garment?.name || 'Unknown Garment'}
//                         </h3>

//                         <div className="grid grid-cols-2 gap-2 text-sm">
//                           <div className="flex items-center gap-1">
//                             <User size={14} className="text-gray-400" />
//                             <span>{work.customer?.name || 'Unknown'}</span>
//                           </div>

//                           <div className="flex items-center gap-1">
//                             <Package size={14} className="text-purple-500" />
//                             <span className="text-xs">
//                               Garment: {work.garment?.garmentId || 'N/A'}
//                             </span>
//                           </div>
//                         </div>

//                         {work.tailor && (
//                           <div className="mt-2 text-xs text-gray-500">
//                             👔 Tailor: {work.tailor.name}
//                           </div>
//                         )}

//                         {work.estimatedDelivery && (
//                           <div className="mt-2 text-xs">
//                             <span className="text-gray-500">📅 Due: </span>
//                             <span className={new Date(work.estimatedDelivery) < new Date() && work.status !== 'ready-to-deliver' 
//                               ? 'text-red-600 font-bold' 
//                               : 'text-gray-700'
//                             }>
//                               {new Date(work.estimatedDelivery).toLocaleDateString()}
//                               {new Date(work.estimatedDelivery) < new Date() && work.status !== 'ready-to-deliver' && (
//                                 <span className="ml-2 text-red-600">
//                                   (Overdue by {Math.ceil((new Date() - new Date(work.estimatedDelivery)) / (1000 * 60 * 60 * 24))} days)
//                                 </span>
//                               )}
//                             </span>
//                           </div>
//                         )}
//                       </div>
//                     );
//                   })
//               ) : (
//                 <div className="text-center py-12 text-gray-500">
//                   <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
//                   <p className="font-medium">No works found</p>
//                   <p className="text-sm text-gray-400 mt-1">
//                     Try adjusting your filters or select another date
//                   </p>
//                 </div>
//               )}
//             </div>

//             {/* Work Queue Stats */}
//             {workQueue?.works?.length > 0 && (
//               <div className="mt-4 pt-3 border-t border-gray-200">
//                 <div className="flex justify-between text-xs text-gray-600 mb-2">
//                   <span>Total: <span className="font-bold">{workQueue.total}</span></span>
//                   <span>✅ Completed: <span className="font-bold text-green-600">
//                     {workQueue.works.filter(w => w.status === 'ready-to-deliver').length}
//                   </span></span>
//                   <span>⏳ Pending: <span className="font-bold text-yellow-600">
//                     {workQueue.works.filter(w => w.status !== 'ready-to-deliver').length}
//                   </span></span>
//                   <span>⚠️ Overdue: <span className="font-bold text-red-600">
//                     {workQueue.works.filter(w => 
//                       w.estimatedDelivery && 
//                       new Date(w.estimatedDelivery) < new Date() && 
//                       w.status !== 'ready-to-deliver'
//                     ).length}
//                   </span></span>
//                 </div>
                
//                 {/* Priority Distribution */}
//                 <div className="flex gap-4 text-xs border-t pt-2 mt-2">
//                   <span className="flex items-center gap-1">
//                     <span className="w-3 h-3 bg-red-500 rounded-full"></span>
//                     High: {workQueue.works.filter(w => getWorkPriority(w) === 'high').length}
//                   </span>
//                   <span className="flex items-center gap-1">
//                     <span className="w-3 h-3 bg-orange-400 rounded-full"></span>
//                     Normal: {workQueue.works.filter(w => getWorkPriority(w) === 'normal').length}
//                   </span>
//                   <span className="flex items-center gap-1">
//                     <span className="w-3 h-3 bg-green-500 rounded-full"></span>
//                     Low: {workQueue.works.filter(w => getWorkPriority(w) === 'low').length}
//                   </span>
//                 </div>
//               </div>
//             )}

//             {workQueue?.totalPages > 1 && (
//               <div className="mt-4 flex justify-center gap-2 text-xs">
//                 <span className="text-gray-500">
//                   Page {workQueue.page} of {workQueue.totalPages}
//                 </span>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Overdue Works Section */}
//       <div id="overdue-section">
//         {overdueWorks?.works?.length > 0 && (
//           <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border-2 border-red-200">
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="font-bold text-gray-800 flex items-center gap-2">
//                 <AlertCircle className="w-6 h-6 text-red-500 animate-pulse" />
//                 ⚠️ OVERDUE WORKS ({overdueWorks.count || 0})
//               </h2>
//               <button
//                 onClick={() => {
//                   if (showOverdueOnly) {
//                     setShowOverdueOnly(false);
//                   } else {
//                     setShowOverdueOnly(true);
//                     document.getElementById('work-queue').scrollIntoView({ behavior: 'smooth' });
//                   }
//                 }}
//                 className="px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition text-sm flex items-center gap-1"
//               >
//                 {showOverdueOnly ? 'Show All' : 'View All in Queue'}
//                 <ArrowUpCircle size={14} />
//               </button>
//             </div>

//             <div className="space-y-3">
//               {overdueWorks.works.map((work) => {
//                 const overdueDays = work.overdueBy || 
//                   Math.ceil((new Date() - new Date(work.estimatedDelivery)) / (1000 * 60 * 60 * 24));
//                 const priority = getWorkPriority(work, 'overdue');
                
//                 return (
//                   <div
//                     key={work._id}
//                     className="border border-red-300 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer bg-gradient-to-r from-red-50 to-orange-50"
//                     onClick={() => handleViewWork(work._id)}
//                   >
//                     <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//                       <div className="flex-1">
//                         <div className="flex items-center gap-2 mb-2 flex-wrap">
//                           <span className="font-mono text-sm font-bold text-red-600 bg-red-100 px-2 py-1 rounded">
//                             #{work.workId}
//                           </span>
//                           <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(work.status)}`}>
//                             {getStatusBadge(work.status)}
//                           </span>
//                           {getPriorityBadge(priority)}
//                           <span className="px-2 py-1 bg-red-200 text-red-800 rounded-full text-xs font-bold">
//                             ⚠️ OVERDUE
//                           </span>
//                         </div>

//                         <h3 className="font-bold text-gray-800 mb-1">
//                           {work.garment?.name || 'Unknown Garment'}
//                         </h3>

//                         <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-sm">
//                           <div className="flex items-center gap-1">
//                             <User size={14} className="text-gray-400" />
//                             <span>{work.customer?.name || 'Unknown'}</span>
//                           </div>

//                           <div className="flex items-center gap-1">
//                             <Package size={14} className="text-purple-500" />
//                             <span className="text-xs">
//                               {work.garment?.garmentId || 'N/A'}
//                             </span>
//                           </div>

//                           <div className="flex items-center gap-1">
//                             <Calendar size={14} className="text-gray-400" />
//                             <span className="text-xs">
//                               Due: {new Date(work.estimatedDelivery).toLocaleDateString()}
//                             </span>
//                           </div>

//                           <div className="flex items-center gap-1">
//                             <AlertCircle size={14} className="text-red-600" />
//                             <span className={`text-sm font-bold ${getOverdueColor(overdueDays)}`}>
//                               Overdue by {overdueDays} {overdueDays === 1 ? 'day' : 'days'}
//                             </span>
//                           </div>
//                         </div>

//                         <div className="mt-3">
//                           <div className="flex items-center gap-2">
//                             <span className="text-xs text-gray-600">Delay:</span>
//                             <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
//                               <div 
//                                 className="h-full bg-red-500 rounded-full"
//                                 style={{ 
//                                   width: `${Math.min(overdueDays * 10, 100)}%`,
//                                   backgroundColor: overdueDays > 10 ? '#7f1d1d' : '#ef4444'
//                                 }}
//                               ></div>
//                             </div>
//                             <span className="text-xs font-bold text-red-600">
//                               +{overdueDays} days
//                             </span>
//                           </div>
//                         </div>
//                       </div>

//                       <button
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           handleViewWork(work._id);
//                         }}
//                         className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2 self-end md:self-center shadow-sm"
//                       >
//                         <Eye size={16} />
//                         Take Action
//                       </button>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>

//             <div className="mt-4 pt-3 border-t border-red-200 grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
//               <div className="bg-red-50 p-3 rounded-lg text-center">
//                 <span className="block font-bold text-2xl text-red-600">{overdueWorks.count || 0}</span>
//                 <span className="text-xs text-gray-600">Total Overdue</span>
//               </div>
//               <div className="bg-orange-50 p-3 rounded-lg text-center">
//                 <span className="block font-bold text-2xl text-orange-600">
//                   {overdueWorks.works.filter(w => getWorkPriority(w) === 'high').length}
//                 </span>
//                 <span className="text-xs text-gray-600">High Priority</span>
//               </div>
//               <div className="bg-yellow-50 p-3 rounded-lg text-center">
//                 <span className="block font-bold text-2xl text-yellow-600">
//                   {overdueWorks.works.filter(w => getWorkPriority(w) === 'normal').length}
//                 </span>
//                 <span className="text-xs text-gray-600">Normal Priority</span>
//               </div>
//               <div className="bg-green-50 p-3 rounded-lg text-center">
//                 <span className="block font-bold text-2xl text-green-600">
//                   {overdueWorks.works.filter(w => getWorkPriority(w) === 'low').length}
//                 </span>
//                 <span className="text-xs text-gray-600">Low Priority</span>
//               </div>
//             </div>

//             <div className="mt-4 flex justify-end gap-3">
//               <button
//                 onClick={() => {
//                   setShowOverdueOnly(true);
//                   document.getElementById('work-queue').scrollIntoView({ behavior: 'smooth' });
//                 }}
//                 className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition text-sm flex items-center gap-2"
//               >
//                 <AlertCircle size={16} />
//                 View All in Queue
//               </button>
//               <button
//                 onClick={loadDashboardData}
//                 className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm flex items-center gap-2"
//               >
//                 <RefreshCw size={16} />
//                 Refresh
//               </button>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* High Priority Works Section */}
//       {highPriorityWorks?.works?.length > 0 && (
//         <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
//           <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
//             <Flag className="w-5 h-5 text-red-500" />
//             High Priority Works ({highPriorityWorks.count || 0})
//           </h2>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//             {highPriorityWorks.works.map((work) => {
//               const priority = getWorkPriority(work, 'high-priority');
              
//               return (
//                 <div
//                   key={work._id}
//                   className="border border-red-200 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer bg-gradient-to-br from-red-50 to-orange-50"
//                   onClick={() => handleViewWork(work._id)}
//                 >
//                   <div className="flex items-start justify-between mb-2">
//                     <span className="font-mono text-sm font-bold text-red-600">
//                       #{work.workId}
//                     </span>
//                     {getPriorityBadge(priority)}
//                   </div>
//                   <h3 className="font-bold text-gray-800 mb-1">
//                     {work.garment?.name || 'Unknown'}
//                   </h3>
//                   <p className="text-xs text-gray-500 flex items-center gap-1">
//                     <User size={12} /> {work.customer?.name || 'Unknown'}
//                   </p>
//                   {work.estimatedDelivery && (
//                     <p className={`text-xs mt-2 flex items-center gap-1 ${
//                       new Date(work.estimatedDelivery) < new Date() 
//                         ? 'text-red-600 font-bold' 
//                         : 'text-orange-600'
//                     }`}>
//                       <Calendar size={12} />
//                       Due: {new Date(work.estimatedDelivery).toLocaleDateString()}
//                       {new Date(work.estimatedDelivery) < new Date() && ' (Overdue)'}
//                     </p>
//                   )}
//                   {work.tailor && (
//                     <p className="text-xs text-gray-500 mt-2">
//                       👔 Assigned to: {work.tailor.name}
//                     </p>
//                   )}
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       )}

//       {/* Tailor Performance Section */}
//       <div className="bg-white rounded-xl shadow-sm p-6">
//         <div className="flex items-center justify-between mb-4">
//           <h2 className="font-bold text-gray-800 flex items-center gap-2">
//             <Users className="w-5 h-5 text-purple-600" />
//             Tailor Performance
//           </h2>
//           {availableTailors?.summary?.available > 0 && (
//             <div className="flex items-center gap-3">
//               <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full flex items-center gap-1">
//                 <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
//                 {availableTailors.summary.available} Available Now
//               </span>
//               <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">
//                 {availableTailors.summary.onLeave || 0} On Leave
//               </span>
//             </div>
//           )}
//         </div>

//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead>
//               <tr className="border-b border-gray-200 bg-gray-50">
//                 <th className="text-left py-3 px-2 text-xs font-medium text-gray-500">Tailor</th>
//                 <th className="text-center py-3 px-2 text-xs font-medium text-gray-500">Assigned</th>
//                 <th className="text-center py-3 px-2 text-xs font-medium text-gray-500">Completed</th>
//                 <th className="text-center py-3 px-2 text-xs font-medium text-gray-500">Pending</th>
//                 <th className="text-center py-3 px-2 text-xs font-medium text-gray-500">In Progress</th>
//                 <th className="text-center py-3 px-2 text-xs font-medium text-gray-500">Efficiency</th>
//                 <th className="text-center py-3 px-2 text-xs font-medium text-gray-500">Status</th>
//                 <th className="text-right py-3 px-2 text-xs font-medium text-gray-500">Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {tailorPerformance?.tailors?.length > 0 ? (
//                 tailorPerformance.tailors.map((tailor) => {
//                   const isAvailable = availableTailors?.availableTailors?.some(t => t._id === tailor._id);
                  
//                   return (
//                     <tr key={tailor._id} className="border-b border-gray-100 hover:bg-gray-50">
//                       <td className="py-3 px-2">
//                         <div className="font-medium text-gray-800">{tailor.name}</div>
//                         <div className="text-xs text-gray-500">{tailor.employeeId}</div>
//                       </td>
//                       <td className="text-center py-3 px-2 font-bold">{tailor.assigned || 0}</td>
//                       <td className="text-center py-3 px-2 text-green-600 font-bold">{tailor.completed || 0}</td>
//                       <td className="text-center py-3 px-2 text-yellow-600 font-bold">{tailor.pending || 0}</td>
//                       <td className="text-center py-3 px-2 text-purple-600 font-bold">{tailor.inProgress || 0}</td>
//                       <td className="text-center py-3 px-2">
//                         <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                           tailor.efficiency >= 80 ? 'bg-green-100 text-green-700' :
//                           tailor.efficiency >= 60 ? 'bg-blue-100 text-blue-700' :
//                           tailor.efficiency >= 40 ? 'bg-yellow-100 text-yellow-700' :
//                           'bg-red-100 text-red-700'
//                         }`}>
//                           {tailor.efficiency || 0}%
//                         </span>
//                       </td>
//                       <td className="text-center py-3 px-2">
//                         {isAvailable ? (
//                           <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs flex items-center justify-center gap-1">
//                             <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
//                             Available
//                           </span>
//                         ) : (
//                           <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
//                             Busy
//                           </span>
//                         )}
//                       </td>
//                       <td className="text-right py-3 px-2">
//                         <button
//                           onClick={() => handleViewTailor(tailor._id)}
//                           className="text-xs px-3 py-1 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition"
//                         >
//                           View Profile
//                         </button>
//                       </td>
//                     </tr>
//                   );
//                 })
//               ) : (
//                 <tr>
//                   <td colSpan="8" className="text-center py-8 text-gray-500">
//                     No tailors found
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//         {availableTailors?.summary && (
//           <div className="mt-4 pt-3 border-t border-gray-200 grid grid-cols-3 gap-4 text-center text-sm">
//             <div className="bg-blue-50 p-2 rounded-lg">
//               <span className="block font-bold text-blue-700">{availableTailors.summary.total || 0}</span>
//               <span className="text-gray-500 text-xs">Total Tailors</span>
//             </div>
//             <div className="bg-green-50 p-2 rounded-lg">
//               <span className="block font-bold text-green-600">{availableTailors.summary.available || 0}</span>
//               <span className="text-gray-500 text-xs">Available Now</span>
//             </div>
//             <div className="bg-orange-50 p-2 rounded-lg">
//               <span className="block font-bold text-orange-600">{availableTailors.summary.onLeave || 0}</span>
//               <span className="text-gray-500 text-xs">On Leave</span>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }




// Pages/works/CuttingMasterDashboard.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Scissors,
  Clock,
  CheckCircle,
  AlertCircle,
  Target,
  Package,
  Flag,
  Users,
  Eye,
  RefreshCw,
  User,
  Filter,
  Search,
  X,
  ArrowUpCircle,
  ArrowDownCircle
} from "lucide-react";
import {
  fetchDashboardStats,
  fetchWorkStatusBreakdown,
  fetchTailorPerformance,
  fetchAvailableTailors,
  fetchWorkQueue,
  fetchTodaySummary,
  fetchHighPriorityWorks,
  fetchOverdueWorks,
  fetchMonthlySchedule,
  fetchWorksByDate,
  selectDashboardStats,
  selectStatusBreakdown,
  selectTailorPerformance,
  selectAvailableTailors,
  selectWorkQueue,
  selectTodaySummary,
  selectHighPriorityWorks,
  selectOverdueWorks,
  selectMonthlySchedule,
  selectWorksByDate,
  selectCuttingMasterLoading
} from "../features/cuttingMaster/cuttingMasterSlice";
import showToast from "../utils/toast";
import { debounce } from "lodash";

export default function CuttingMasterDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Selectors
  const dashboardStats = useSelector(selectDashboardStats);
  const statusBreakdown = useSelector(selectStatusBreakdown);
  const tailorPerformance = useSelector(selectTailorPerformance);
  const availableTailors = useSelector(selectAvailableTailors);
  const workQueue = useSelector(selectWorkQueue);
  const todaySummary = useSelector(selectTodaySummary);
  const highPriorityWorks = useSelector(selectHighPriorityWorks);
  const overdueWorks = useSelector(selectOverdueWorks);
  const monthlySchedule = useSelector(selectMonthlySchedule);
  const dateWiseWorks = useSelector(selectWorksByDate);
  const loading = useSelector(selectCuttingMasterLoading);

  // ===== FIXED: Get today's date correctly with local timezone =====
  const getLocalDateStr = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const today = new Date();
  const todayDateStr = getLocalDateStr(today);
  
  // Local state
  const [selectedDate, setSelectedDate] = useState(todayDateStr);
  const [currentMonth, setCurrentMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [viewMode, setViewMode] = useState("today");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [calendarDays, setCalendarDays] = useState([]);
  const [showOverdueOnly, setShowOverdueOnly] = useState(false);

  // ===== DEBUG: Log Redux state on mount =====
  useEffect(() => {
    console.log("%c🔍 CUTTING MASTER DASHBOARD MOUNTED", "background: purple; color: white; font-size: 16px");
    console.log("📅 Today Date:", todayDateStr);
    console.log("📊 Initial Redux State:", {
      dashboardStats,
      workQueue: workQueue?.works?.length,
      highPriorityWorks: highPriorityWorks?.works?.length,
      overdueWorks: overdueWorks?.works?.length,
      tailorPerformance: tailorPerformance?.tailors?.length
    });
  }, []);

  // ===== DEBUG: Log when workQueue changes =====
  useEffect(() => {
    if (workQueue?.works?.length > 0) {
      console.log("%c📦 WORK QUEUE UPDATED", "background: blue; color: white; font-size: 14px");
      console.log(`Total works: ${workQueue.works.length}`);
      
      // Log each work's priority sources
      workQueue.works.forEach((work, index) => {
        console.log(`\n📋 Work ${index + 1}: ${work.workId}`);
        console.log("  🔍 Priority Sources:", {
          workId: work.workId,
          directPriority: work.priority,
          garmentPriority: work.garment?.priority,
          orderGarmentPriority: work.order?.garment?.priority,
          garmentName: work.garment?.name,
          status: work.status
        });
      });

      // Count priorities
      const priorityCount = workQueue.works.reduce((acc, work) => {
        const p = work.garment?.priority || work.priority || 'normal';
        acc[p] = (acc[p] || 0) + 1;
        return acc;
      }, {});
      
      console.log("\n📊 Priority Distribution (Raw):", priorityCount);
    }
  }, [workQueue]);

  // ===== DEBUG: Log high priority works =====
  useEffect(() => {
    if (highPriorityWorks?.works?.length > 0) {
      console.log("%c🔴 HIGH PRIORITY WORKS UPDATED", "background: red; color: white; font-size: 14px");
      console.log(`Count: ${highPriorityWorks.count}`);
      console.log("Works:", highPriorityWorks.works.map(w => ({
        id: w.workId,
        garment: w.garment?.name,
        priority: w.garment?.priority
      })));
    }
  }, [highPriorityWorks]);

  // ===== DEBUG: Log overdue works =====
  useEffect(() => {
    if (overdueWorks?.works?.length > 0) {
      console.log("%c⚠️ OVERDUE WORKS UPDATED", "background: orange; color: white; font-size: 14px");
      console.log(`Count: ${overdueWorks.count}`);
    }
  }, [overdueWorks]);

  // ===== DEBUG: Log API calls =====
  const logApiCall = (apiName, params) => {
    console.log(`%c📡 API Call: ${apiName}`, "background: green; color: white; font-size: 12px", params);
  };

  // ============================================
  // 🎯 FIXED: PRIORITY FUNCTIONS - GARMENT COMES FIRST
  // ============================================
  
  /**
   * ✅ FIXED: Priority always comes from garment first
   * Work-ல priority இல்ல - garment-ல தான் இருக்கு!
   */
  const getWorkPriority = useCallback((work, source = '') => {
    if (!work) {
      console.warn(`⚠️ [${source}] Work object is null or undefined`);
      return 'normal';
    }
    
    // ✅ IMPORTANT: Garment priority comes FIRST, work priority is just fallback
    const priority = 
      work.garment?.priority ||            // From garment (this has correct values)
      work.priority ||                     // Direct work priority (fallback only)
      work.order?.garment?.priority ||     // From order's garment (another fallback)
      'normal';                            // Default
    
    // Debug log for priority detection
    if (source || work.workId?.includes('WRK')) {
      console.log(`🔍 [${source || 'check'}] Priority for ${work.workId}:`, {
        garmentPriority: work.garment?.priority,
        workPriority: work.priority,
        detected: priority,
        finalDisplay: priority === 'high' ? '🔴 High' : 
                     priority === 'low' ? '🟢 Low' : '🟠 Normal'
      });
    }
    
    return priority;
  }, []);

  const getPriorityWeight = useCallback((priority) => {
    const weights = { high: 1, normal: 2, low: 3 };
    return weights[priority] || 2;
  }, []);

  const getPriorityDisplay = useCallback((priority) => {
    const displays = {
      'high': '🔴 High',
      'normal': '🟠 Normal',
      'low': '🟢 Low'
    };
    return displays[priority] || '🟠 Normal';
  }, []);

  const getPriorityColor = useCallback((priority) => {
    const colors = {
      'high': 'border-l-4 border-l-red-500 bg-red-50',
      'normal': 'border-l-4 border-l-orange-400 bg-orange-50',
      'low': 'border-l-4 border-l-green-500 bg-green-50'
    };
    return colors[priority] || 'border-l-4 border-l-orange-400 bg-orange-50';
  }, []);

  const getPriorityBadge = useCallback((priority) => {
    const badges = {
      'high': (
        <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-bold flex items-center gap-1">
          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
          🔴 High Priority
        </span>
      ),
      'normal': (
        <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs flex items-center gap-1">
          <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
          🟠 Normal
        </span>
      ),
      'low': (
        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs flex items-center gap-1">
          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          🟢 Low
        </span>
      )
    };
    return badges[priority] || badges.normal;
  }, []);

  // ===== DEBUG: Log priorities when workQueue loads with detailed analysis =====
  useEffect(() => {
    if (workQueue?.works?.length > 0) {
      console.log("%c🔍 PRIORITY DEBUG - Work Queue Analysis", "background: purple; color: white; font-size: 16px");
      console.log("=".repeat(80));
      
      const detailedAnalysis = workQueue.works.map((work, index) => {
        const priority = getWorkPriority(work, `Work ${index + 1}`);
        return {
          index: index + 1,
          workId: work.workId,
          detectedPriority: priority,
          display: getPriorityDisplay(priority),
          sources: {
            workPriority: work.priority,
            garmentPriority: work.garment?.priority,
            orderGarmentPriority: work.order?.garment?.priority
          },
          garmentName: work.garment?.name || 'Unknown',
          status: work.status,
          hasGarment: !!work.garment,
          hasOrder: !!work.order
        };
      });

      console.table(detailedAnalysis.map(({ workId, detectedPriority, display, sources, garmentName, status }) => ({
        workId,
        garmentName,
        status,
        detectedPriority,
        display,
        workPriority: sources.workPriority,
        garmentPriority: sources.garmentPriority
      })));

      // Count priorities
      const priorityCount = workQueue.works.reduce((acc, work) => {
        const p = getWorkPriority(work);
        acc[p] = (acc[p] || 0) + 1;
        return acc;
      }, {});

      console.log("\n📊 Priority Distribution:", priorityCount);
      
      // Check for works with missing priority
      const missingPriority = workQueue.works.filter(w => 
        !w.priority && !w.garment?.priority
      );
      
      if (missingPriority.length > 0) {
        console.warn(`⚠️ ${missingPriority.length} works have no priority set:`, 
          missingPriority.map(w => w.workId)
        );
      }
      
      console.log("=".repeat(80));
    }
  }, [workQueue, getWorkPriority, getPriorityDisplay]);

  // ===== DEBUG: Log when filters change =====
  useEffect(() => {
    console.log("🔍 Filters changed:", {
      statusFilter,
      searchTerm,
      selectedDate,
      showOverdueOnly,
      viewMode
    });
  }, [statusFilter, searchTerm, selectedDate, showOverdueOnly, viewMode]);

  // Load initial data
  useEffect(() => {
    logApiCall('loadDashboardData', { selectedDate });
    loadDashboardData();
  }, []);

  // Load data when month changes
  useEffect(() => {
    logApiCall('loadMonthlySchedule', { 
      year: currentMonth.getFullYear(), 
      month: currentMonth.getMonth() + 1 
    });
    loadMonthlySchedule();
  }, [currentMonth]);

  // Load data when selected date changes
  useEffect(() => {
    if (selectedDate) {
      logApiCall('fetchWorksByDate', { selectedDate });
      dispatch(fetchWorksByDate(selectedDate));
      
      logApiCall('fetchWorkQueue', { 
        date: selectedDate, 
        status: statusFilter, 
        search: searchTerm 
      });
      dispatch(fetchWorkQueue({ 
        date: selectedDate, 
        status: statusFilter, 
        search: searchTerm 
      }));
    }
  }, [selectedDate, dispatch, statusFilter, searchTerm]);

  // Generate calendar days when monthly schedule changes
  useEffect(() => {
    if (monthlySchedule) {
      generateCalendarDays();
    }
  }, [currentMonth, monthlySchedule]);

  const loadDashboardData = async () => {
    try {
      logApiCall('fetchDashboardStats', {});
      await Promise.all([
        dispatch(fetchDashboardStats()),
        dispatch(fetchWorkStatusBreakdown()),
        dispatch(fetchTailorPerformance()),
        dispatch(fetchAvailableTailors()),
        dispatch(fetchTodaySummary()),
        dispatch(fetchHighPriorityWorks()),
        dispatch(fetchOverdueWorks())
      ]);
      
      logApiCall('fetchWorkQueue (initial)', { 
        date: selectedDate, 
        status: statusFilter, 
        search: searchTerm 
      });
      dispatch(fetchWorkQueue({ 
        date: selectedDate, 
        status: statusFilter, 
        search: searchTerm 
      }));
      
      showToast.success("Dashboard data loaded successfully");
    } catch (error) {
      console.error("❌ Error loading dashboard data:", error);
      showToast.error("Failed to load dashboard data");
    }
  };

  const loadMonthlySchedule = async () => {
    try {
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth() + 1;
      await dispatch(fetchMonthlySchedule({ year, month }));
    } catch (error) {
      console.error("Failed to load schedule:", error);
    }
  };

  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const days = [];
    const startDay = firstDay.getDay();
    
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }
    
    for (let d = 1; d <= lastDay.getDate(); d++) {
      const date = new Date(year, month, d);
      const dateStr = getLocalDateStr(date);
      
      const daySchedule = monthlySchedule?.[dateStr] || { 
        hasWork: false, 
        hasOverdue: false, 
        workCount: 0 
      };
      
      const isToday = dateStr === todayDateStr;
      
      days.push({
        date,
        dateStr,
        day: d,
        hasWork: daySchedule.hasWork || false,
        hasOverdue: daySchedule.hasOverdue || false,
        workCount: daySchedule.workCount || 0,
        isToday: isToday
      });
    }
    
    setCalendarDays(days);
  };

  const debouncedSearch = useCallback(
    debounce((term) => {
      logApiCall('debouncedSearch', { term, statusFilter, selectedDate });
      dispatch(fetchWorkQueue({ 
        date: selectedDate,
        status: statusFilter, 
        search: term 
      }));
    }, 500),
    [selectedDate, statusFilter, dispatch]
  );

  const handleRefresh = () => {
    logApiCall('handleRefresh', {});
    loadDashboardData();
    loadMonthlySchedule();
    showToast.success("Dashboard refreshed");
  };

  const handlePrevMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() - 1);
    setCurrentMonth(newMonth);
  };

  const handleNextMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + 1);
    setCurrentMonth(newMonth);
  };

  const handleDateSelect = (day) => {
    if (day) {
      logApiCall('handleDateSelect', { date: day.dateStr });
      setSelectedDate(day.dateStr);
      setViewMode("custom");
    }
  };

  const handleViewWork = (workId) => {
    logApiCall('handleViewWork', { workId });
    navigate(`/cuttingmaster/works/${workId}`);
  };

  const handleViewTailor = (tailorId) => {
    logApiCall('handleViewTailor', { tailorId });
    navigate(`/cuttingmaster/tailors/${tailorId}`);
  };

  const handleStatusFilter = (e) => {
    const status = e.target.value;
    logApiCall('handleStatusFilter', { status, selectedDate, searchTerm });
    setStatusFilter(status);
    dispatch(fetchWorkQueue({ 
      date: selectedDate,
      status, 
      search: searchTerm 
    }));
  };

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    debouncedSearch(term);
  };

  const handleViewModeChange = (mode) => {
    logApiCall('handleViewModeChange', { mode });
    setViewMode(mode);
    const date = new Date();
    if (mode === "tomorrow") {
      date.setDate(date.getDate() + 1);
    }
    const dateStr = getLocalDateStr(date);
    setSelectedDate(dateStr);
  };

  const clearSearch = () => {
    logApiCall('clearSearch', {});
    setSearchTerm("");
    dispatch(fetchWorkQueue({ 
      date: selectedDate,
      status: statusFilter, 
      search: "" 
    }));
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr + 'T12:00:00');
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'accepted': 'bg-blue-100 text-blue-800 border-blue-200',
      'cutting-started': 'bg-purple-100 text-purple-800 border-purple-200',
      'cutting-completed': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'sewing-started': 'bg-pink-100 text-pink-800 border-pink-200',
      'sewing-completed': 'bg-teal-100 text-teal-800 border-teal-200',
      'ironing': 'bg-orange-100 text-orange-800 border-orange-200',
      'ready-to-deliver': 'bg-green-100 text-green-800 border-green-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusBadge = (status) => {
    const badges = {
      'pending': '⏳ Pending',
      'accepted': '✅ Accepted',
      'cutting-started': '✂️ Cutting Started',
      'cutting-completed': '✔️ Cutting Completed',
      'sewing-started': '🧵 Sewing Started',
      'sewing-completed': '🧵 Sewing Completed',
      'ironing': '🔥 Ironing',
      'ready-to-deliver': '📦 Ready to Deliver'
    };
    return badges[status] || status;
  };

  const getOverdueColor = (days) => {
    if (days > 5) return 'text-red-700 font-bold';
    if (days > 2) return 'text-red-600 font-semibold';
    return 'text-red-500';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Debug Info - Only visible in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mb-4 p-3 bg-gray-800 text-white rounded-lg text-xs font-mono">
          <details>
            <summary className="cursor-pointer font-bold">🔧 Debug Info (Click to expand)</summary>
            <div className="mt-2 space-y-1">
              <div>📅 Today: {todayDateStr}</div>
              <div>📊 Works: {workQueue?.works?.length || 0}</div>
              <div>🔴 High Priority: {highPriorityWorks?.count || 0}</div>
              <div>⚠️ Overdue: {overdueWorks?.count || 0}</div>
              <div>👔 Tailors: {tailorPerformance?.tailors?.length || 0}</div>
              <div>🟢 Available: {availableTailors?.summary?.available || 0}</div>
              <div>📅 Selected Date: {selectedDate}</div>
              <div>🔍 Status Filter: {statusFilter}</div>
              <div>🔎 Search: {searchTerm || 'none'}</div>
            </div>
          </details>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
            <Scissors className="w-8 h-8 text-purple-600" />
            Cutting Master Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {formatDate(todayDateStr)}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowOverdueOnly(!showOverdueOnly)}
            className={`px-4 py-2 rounded-lg transition flex items-center gap-2 shadow-sm ${
              showOverdueOnly 
                ? 'bg-red-100 text-red-700 border border-red-300' 
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            <AlertCircle size={18} />
            <span>Show Overdue Only</span>
            {overdueWorks?.count > 0 && (
              <span className="ml-1 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                {overdueWorks.count}
              </span>
            )}
          </button>

          <button
            onClick={handleRefresh}
            disabled={loading}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center gap-2 shadow-sm disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-blue-500">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Total Work</p>
            <Package className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-gray-800">
            {dashboardStats?.totalWork || 0}
          </p>
          <p className="text-xs text-gray-400 mt-1">All assigned works</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-green-500">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Completed Work</p>
            <CheckCircle className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-gray-800">
            {dashboardStats?.completedWork || 0}
          </p>
          <p className="text-xs text-gray-400 mt-1">Ready to deliver</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-purple-500">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">In Progress</p>
            <Clock className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-3xl font-bold text-gray-800">
            {dashboardStats?.inProgressWork || 0}
          </p>
          <p className="text-xs text-gray-400 mt-1">Cutting/Sewing/Ironing</p>
        </div>

        <div 
          className={`bg-white rounded-xl p-6 shadow-sm border-l-4 cursor-pointer transition ${
            overdueWorks?.count > 0 ? 'border-l-red-500 hover:bg-red-50' : 'border-l-gray-300'
          }`}
          onClick={() => {
            if (overdueWorks?.count > 0) {
              document.getElementById('overdue-section').scrollIntoView({ behavior: 'smooth' });
            }
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Overdue</p>
            <AlertCircle className={`w-5 h-5 ${overdueWorks?.count > 0 ? 'text-red-500' : 'text-gray-400'}`} />
          </div>
          <p className={`text-3xl font-bold ${overdueWorks?.count > 0 ? 'text-red-600' : 'text-gray-800'}`}>
            {dashboardStats?.overdueWork || 0}
          </p>
          <p className="text-xs text-gray-400 mt-1">Past delivery date</p>
          {overdueWorks?.count > 0 && (
            <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
              <ArrowDownCircle size={12} />
              Click to view overdue
            </p>
          )}
        </div>
      </div>

      {/* Main Grid - Calendar + Work Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Left Column - Calendar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-800 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-600" />
                {currentMonth.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
              </h2>
              <div className="flex gap-1">
                <button
                  onClick={handlePrevMonth}
                  className="p-1 hover:bg-gray-100 rounded-lg transition"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={handleNextMonth}
                  className="p-1 hover:bg-gray-100 rounded-lg transition"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2 text-center text-xs font-medium text-gray-500">
              <div>Su</div>
              <div>Mo</div>
              <div>Tu</div>
              <div>We</div>
              <div>Th</div>
              <div>Fr</div>
              <div>Sa</div>
            </div>

            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, index) => (
                <div key={index} className="aspect-square">
                  {day ? (
                    <button
                      onClick={() => handleDateSelect(day)}
                      className={`w-full h-full flex items-center justify-center rounded-lg text-sm transition-all relative
                        ${selectedDate === day.dateStr 
                          ? 'bg-purple-600 text-white font-bold ring-2 ring-purple-300'
                          : day.isToday 
                            ? 'bg-blue-100 text-blue-800 font-bold border-2 border-blue-400'
                            : 'hover:bg-gray-100'
                        }
                        ${day.hasWork ? 'font-semibold' : ''}
                      `}
                    >
                      <span>{day.day}</span>
                      {day.hasWork && !day.hasOverdue && (
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full border border-white"></span>
                      )}
                      {day.hasOverdue && (
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse border border-white"></span>
                      )}
                      {day.workCount > 0 && (
                        <span className="absolute -bottom-2 text-[8px] font-bold bg-purple-600 text-white px-1 rounded-full">
                          {day.workCount}
                        </span>
                      )}
                    </button>
                  ) : (
                    <div className="w-full h-full"></div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap items-center gap-4 text-xs">
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 bg-blue-400 rounded-full border-2 border-blue-400"></span>
                <span>Today ({today.getDate()}th)</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 bg-purple-600 rounded-full"></span>
                <span>Selected</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                <span>Has Works</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                <span>Overdue</span>
              </div>
            </div>

            {selectedDate && dateWiseWorks && (
              <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                <p className="text-sm font-medium text-purple-700 flex items-center gap-2">
                  {formatDate(selectedDate)}
                  {selectedDate === todayDateStr && (
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                      Today
                    </span>
                  )}
                </p>
                <div className="grid grid-cols-3 gap-2 mt-2 text-xs">
                  <div className="text-center">
                    <span className="block font-bold text-purple-700">{dateWiseWorks.total || 0}</span>
                    <span className="text-gray-500">Total</span>
                  </div>
                  <div className="text-center">
                    <span className="block font-bold text-green-600">{dateWiseWorks.completed || 0}</span>
                    <span className="text-gray-500">Completed</span>
                  </div>
                  <div className="text-center">
                    <span className="block font-bold text-yellow-600">{dateWiseWorks.pending || 0}</span>
                    <span className="text-gray-500">Pending</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {todaySummary && (
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4 mt-4">
              <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                <Target className="w-4 h-4 text-blue-600" />
                Today's Focus - {formatDate(todayDateStr)}
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Due Today:</span>
                  <span className="font-bold text-red-600">{todaySummary.dueToday || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>High Priority:</span>
                  <span className="font-bold text-red-600">{todaySummary.highPriority || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Completed Today:</span>
                  <span className="font-bold text-green-600">{todaySummary.completedToday || 0}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Work Queue */}
        <div className="lg:col-span-2" id="work-queue">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
              <h2 className="font-bold text-gray-800 flex items-center gap-2">
                <Package className="w-5 h-5 text-purple-600" />
                Work Queue - {formatDate(selectedDate)}
                {selectedDate === todayDateStr && (
                  <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                    Today
                  </span>
                )}
                {showOverdueOnly && (
                  <span className="ml-2 px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                    Overdue Only
                  </span>
                )}
              </h2>

              <div className="flex gap-2">
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => handleViewModeChange("today")}
                    className={`px-3 py-1.5 text-xs rounded-md transition ${
                      viewMode === "today" ? "bg-purple-600 text-white" : "text-gray-600"
                    }`}
                  >
                    Today
                  </button>
                  <button
                    onClick={() => handleViewModeChange("tomorrow")}
                    className={`px-3 py-1.5 text-xs rounded-md transition ${
                      viewMode === "tomorrow" ? "bg-purple-600 text-white" : "text-gray-600"
                    }`}
                  >
                    Tomorrow
                  </button>
                </div>

                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                >
                  <Filter size={16} />
                </button>
              </div>
            </div>

            {showFilters && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex flex-col md:flex-row gap-3">
                  <select
                    value={statusFilter}
                    onChange={handleStatusFilter}
                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="accepted">Accepted</option>
                    <option value="cutting-started">Cutting Started</option>
                    <option value="cutting-completed">Cutting Completed</option>
                    <option value="sewing-started">Sewing Started</option>
                    <option value="sewing-completed">Sewing Completed</option>
                    <option value="ironing">Ironing</option>
                    <option value="ready-to-deliver">Ready to Deliver</option>
                  </select>

                  <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={handleSearch}
                      placeholder="Search by Work ID or Customer..."
                      className="w-full pl-9 pr-8 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
                    />
                    {searchTerm && (
                      <button
                        onClick={clearSearch}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Work List with Priority Display - FIXED to use correct priority */}
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {workQueue?.works?.length > 0 ? (
                workQueue.works
                  .filter(work => !showOverdueOnly || (work.estimatedDelivery && new Date(work.estimatedDelivery) < new Date()))
                  .map((work) => {
                    const priority = getWorkPriority(work, 'render');
                    
                    return (
                      <div
                        key={work._id}
                        className={`border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer ${getPriorityColor(priority)} ${
                          work.estimatedDelivery && new Date(work.estimatedDelivery) < new Date() && work.status !== 'ready-to-deliver'
                            ? 'bg-red-50 border-red-300'
                            : ''
                        }`}
                        onClick={() => handleViewWork(work._id)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono text-sm font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded">
                              #{work.workId}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(work.status)}`}>
                              {getStatusBadge(work.status)}
                            </span>
                            {/* Priority Badge - Now using garment priority correctly */}
                            {getPriorityBadge(priority)}
                            
                            {work.estimatedDelivery && new Date(work.estimatedDelivery) < new Date() && work.status !== 'ready-to-deliver' && (
                              <span className="px-2 py-1 bg-red-200 text-red-800 rounded-full text-xs font-bold animate-pulse">
                                ⚠️ OVERDUE
                              </span>
                            )}
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewWork(work._id);
                            }}
                            className="p-1 hover:bg-gray-100 rounded-lg transition"
                          >
                            <Eye size={16} className="text-gray-600" />
                          </button>
                        </div>

                        <h3 className="font-bold text-gray-800 mb-1">
                          {work.garment?.name || 'Unknown Garment'}
                        </h3>

                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center gap-1">
                            <User size={14} className="text-gray-400" />
                            <span>{work.customer?.name || 'Unknown'}</span>
                          </div>

                          <div className="flex items-center gap-1">
                            <Package size={14} className="text-purple-500" />
                            <span className="text-xs">
                              Garment: {work.garment?.garmentId || 'N/A'}
                            </span>
                          </div>
                        </div>

                        {work.tailor && (
                          <div className="mt-2 text-xs text-gray-500">
                            👔 Tailor: {work.tailor.name}
                          </div>
                        )}

                        {work.estimatedDelivery && (
                          <div className="mt-2 text-xs">
                            <span className="text-gray-500">📅 Due: </span>
                            <span className={new Date(work.estimatedDelivery) < new Date() && work.status !== 'ready-to-deliver' 
                              ? 'text-red-600 font-bold' 
                              : 'text-gray-700'
                            }>
                              {new Date(work.estimatedDelivery).toLocaleDateString()}
                              {new Date(work.estimatedDelivery) < new Date() && work.status !== 'ready-to-deliver' && (
                                <span className="ml-2 text-red-600">
                                  (Overdue by {Math.ceil((new Date() - new Date(work.estimatedDelivery)) / (1000 * 60 * 60 * 24))} days)
                                </span>
                              )}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="font-medium">No works found</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Try adjusting your filters or select another date
                  </p>
                </div>
              )}
            </div>

            {/* Work Queue Stats */}
            {workQueue?.works?.length > 0 && (
              <div className="mt-4 pt-3 border-t border-gray-200">
                <div className="flex justify-between text-xs text-gray-600 mb-2">
                  <span>Total: <span className="font-bold">{workQueue.total}</span></span>
                  <span>✅ Completed: <span className="font-bold text-green-600">
                    {workQueue.works.filter(w => w.status === 'ready-to-deliver').length}
                  </span></span>
                  <span>⏳ Pending: <span className="font-bold text-yellow-600">
                    {workQueue.works.filter(w => w.status !== 'ready-to-deliver').length}
                  </span></span>
                  <span>⚠️ Overdue: <span className="font-bold text-red-600">
                    {workQueue.works.filter(w => 
                      w.estimatedDelivery && 
                      new Date(w.estimatedDelivery) < new Date() && 
                      w.status !== 'ready-to-deliver'
                    ).length}
                  </span></span>
                </div>
                
                {/* Priority Distribution */}
                <div className="flex gap-4 text-xs border-t pt-2 mt-2">
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                    High: {workQueue.works.filter(w => getWorkPriority(w) === 'high').length}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 bg-orange-400 rounded-full"></span>
                    Normal: {workQueue.works.filter(w => getWorkPriority(w) === 'normal').length}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                    Low: {workQueue.works.filter(w => getWorkPriority(w) === 'low').length}
                  </span>
                </div>
              </div>
            )}

            {workQueue?.totalPages > 1 && (
              <div className="mt-4 flex justify-center gap-2 text-xs">
                <span className="text-gray-500">
                  Page {workQueue.page} of {workQueue.totalPages}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overdue Works Section */}
      <div id="overdue-section">
        {overdueWorks?.works?.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border-2 border-red-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-800 flex items-center gap-2">
                <AlertCircle className="w-6 h-6 text-red-500 animate-pulse" />
                ⚠️ OVERDUE WORKS ({overdueWorks.count || 0})
              </h2>
              <button
                onClick={() => {
                  if (showOverdueOnly) {
                    setShowOverdueOnly(false);
                  } else {
                    setShowOverdueOnly(true);
                    document.getElementById('work-queue').scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition text-sm flex items-center gap-1"
              >
                {showOverdueOnly ? 'Show All' : 'View All in Queue'}
                <ArrowUpCircle size={14} />
              </button>
            </div>

            <div className="space-y-3">
              {overdueWorks.works.map((work) => {
                const overdueDays = work.overdueBy || 
                  Math.ceil((new Date() - new Date(work.estimatedDelivery)) / (1000 * 60 * 60 * 24));
                const priority = getWorkPriority(work, 'overdue');
                
                return (
                  <div
                    key={work._id}
                    className="border border-red-300 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer bg-gradient-to-r from-red-50 to-orange-50"
                    onClick={() => handleViewWork(work._id)}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span className="font-mono text-sm font-bold text-red-600 bg-red-100 px-2 py-1 rounded">
                            #{work.workId}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(work.status)}`}>
                            {getStatusBadge(work.status)}
                          </span>
                          {getPriorityBadge(priority)}
                          <span className="px-2 py-1 bg-red-200 text-red-800 rounded-full text-xs font-bold">
                            ⚠️ OVERDUE
                          </span>
                        </div>

                        <h3 className="font-bold text-gray-800 mb-1">
                          {work.garment?.name || 'Unknown Garment'}
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-sm">
                          <div className="flex items-center gap-1">
                            <User size={14} className="text-gray-400" />
                            <span>{work.customer?.name || 'Unknown'}</span>
                          </div>

                          <div className="flex items-center gap-1">
                            <Package size={14} className="text-purple-500" />
                            <span className="text-xs">
                              {work.garment?.garmentId || 'N/A'}
                            </span>
                          </div>

                          <div className="flex items-center gap-1">
                            <Calendar size={14} className="text-gray-400" />
                            <span className="text-xs">
                              Due: {new Date(work.estimatedDelivery).toLocaleDateString()}
                            </span>
                          </div>

                          <div className="flex items-center gap-1">
                            <AlertCircle size={14} className="text-red-600" />
                            <span className={`text-sm font-bold ${getOverdueColor(overdueDays)}`}>
                              Overdue by {overdueDays} {overdueDays === 1 ? 'day' : 'days'}
                            </span>
                          </div>
                        </div>

                        <div className="mt-3">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-600">Delay:</span>
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-red-500 rounded-full"
                                style={{ 
                                  width: `${Math.min(overdueDays * 10, 100)}%`,
                                  backgroundColor: overdueDays > 10 ? '#7f1d1d' : '#ef4444'
                                }}
                              ></div>
                            </div>
                            <span className="text-xs font-bold text-red-600">
                              +{overdueDays} days
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewWork(work._id);
                        }}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2 self-end md:self-center shadow-sm"
                      >
                        <Eye size={16} />
                        Take Action
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 pt-3 border-t border-red-200 grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
              <div className="bg-red-50 p-3 rounded-lg text-center">
                <span className="block font-bold text-2xl text-red-600">{overdueWorks.count || 0}</span>
                <span className="text-xs text-gray-600">Total Overdue</span>
              </div>
              <div className="bg-orange-50 p-3 rounded-lg text-center">
                <span className="block font-bold text-2xl text-orange-600">
                  {overdueWorks.works.filter(w => getWorkPriority(w) === 'high').length}
                </span>
                <span className="text-xs text-gray-600">High Priority</span>
              </div>
              <div className="bg-yellow-50 p-3 rounded-lg text-center">
                <span className="block font-bold text-2xl text-yellow-600">
                  {overdueWorks.works.filter(w => getWorkPriority(w) === 'normal').length}
                </span>
                <span className="text-xs text-gray-600">Normal Priority</span>
              </div>
              <div className="bg-green-50 p-3 rounded-lg text-center">
                <span className="block font-bold text-2xl text-green-600">
                  {overdueWorks.works.filter(w => getWorkPriority(w) === 'low').length}
                </span>
                <span className="text-xs text-gray-600">Low Priority</span>
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowOverdueOnly(true);
                  document.getElementById('work-queue').scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition text-sm flex items-center gap-2"
              >
                <AlertCircle size={16} />
                View All in Queue
              </button>
              <button
                onClick={loadDashboardData}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm flex items-center gap-2"
              >
                <RefreshCw size={16} />
                Refresh
              </button>
            </div>
          </div>
        )}
      </div>

      {/* High Priority Works Section */}
      {highPriorityWorks?.works?.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Flag className="w-5 h-5 text-red-500" />
            High Priority Works ({highPriorityWorks.count || 0})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {highPriorityWorks.works.map((work) => {
              const priority = getWorkPriority(work, 'high-priority');
              
              return (
                <div
                  key={work._id}
                  className="border border-red-200 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer bg-gradient-to-br from-red-50 to-orange-50"
                  onClick={() => handleViewWork(work._id)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="font-mono text-sm font-bold text-red-600">
                      #{work.workId}
                    </span>
                    {getPriorityBadge(priority)}
                  </div>
                  <h3 className="font-bold text-gray-800 mb-1">
                    {work.garment?.name || 'Unknown'}
                  </h3>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <User size={12} /> {work.customer?.name || 'Unknown'}
                  </p>
                  {work.estimatedDelivery && (
                    <p className={`text-xs mt-2 flex items-center gap-1 ${
                      new Date(work.estimatedDelivery) < new Date() 
                        ? 'text-red-600 font-bold' 
                        : 'text-orange-600'
                    }`}>
                      <Calendar size={12} />
                      Due: {new Date(work.estimatedDelivery).toLocaleDateString()}
                      {new Date(work.estimatedDelivery) < new Date() && ' (Overdue)'}
                    </p>
                  )}
                  {work.tailor && (
                    <p className="text-xs text-gray-500 mt-2">
                      👔 Assigned to: {work.tailor.name}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tailor Performance Section */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-800 flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-600" />
            Tailor Performance
          </h2>
          {availableTailors?.summary?.available > 0 && (
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                {availableTailors.summary.available} Available Now
              </span>
              <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">
                {availableTailors.summary.onLeave || 0} On Leave
              </span>
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-2 text-xs font-medium text-gray-500">Tailor</th>
                <th className="text-center py-3 px-2 text-xs font-medium text-gray-500">Assigned</th>
                <th className="text-center py-3 px-2 text-xs font-medium text-gray-500">Completed</th>
                <th className="text-center py-3 px-2 text-xs font-medium text-gray-500">Pending</th>
                <th className="text-center py-3 px-2 text-xs font-medium text-gray-500">In Progress</th>
                <th className="text-center py-3 px-2 text-xs font-medium text-gray-500">Efficiency</th>
                <th className="text-center py-3 px-2 text-xs font-medium text-gray-500">Status</th>
                <th className="text-right py-3 px-2 text-xs font-medium text-gray-500">Action</th>
              </tr>
            </thead>
            <tbody>
              {tailorPerformance?.tailors?.length > 0 ? (
                tailorPerformance.tailors.map((tailor) => {
                  const isAvailable = availableTailors?.availableTailors?.some(t => t._id === tailor._id);
                  
                  return (
                    <tr key={tailor._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-2">
                        <div className="font-medium text-gray-800">{tailor.name}</div>
                        <div className="text-xs text-gray-500">{tailor.employeeId}</div>
                      </td>
                      <td className="text-center py-3 px-2 font-bold">{tailor.assigned || 0}</td>
                      <td className="text-center py-3 px-2 text-green-600 font-bold">{tailor.completed || 0}</td>
                      <td className="text-center py-3 px-2 text-yellow-600 font-bold">{tailor.pending || 0}</td>
                      <td className="text-center py-3 px-2 text-purple-600 font-bold">{tailor.inProgress || 0}</td>
                      <td className="text-center py-3 px-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          tailor.efficiency >= 80 ? 'bg-green-100 text-green-700' :
                          tailor.efficiency >= 60 ? 'bg-blue-100 text-blue-700' :
                          tailor.efficiency >= 40 ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {tailor.efficiency || 0}%
                        </span>
                      </td>
                      <td className="text-center py-3 px-2">
                        {isAvailable ? (
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs flex items-center justify-center gap-1">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                            Available
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                            Busy
                          </span>
                        )}
                      </td>
                      <td className="text-right py-3 px-2">
                        <button
                          onClick={() => handleViewTailor(tailor._id)}
                          className="text-xs px-3 py-1 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition"
                        >
                          View Profile
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-8 text-gray-500">
                    No tailors found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {availableTailors?.summary && (
          <div className="mt-4 pt-3 border-t border-gray-200 grid grid-cols-3 gap-4 text-center text-sm">
            <div className="bg-blue-50 p-2 rounded-lg">
              <span className="block font-bold text-blue-700">{availableTailors.summary.total || 0}</span>
              <span className="text-gray-500 text-xs">Total Tailors</span>
            </div>
            <div className="bg-green-50 p-2 rounded-lg">
              <span className="block font-bold text-green-600">{availableTailors.summary.available || 0}</span>
              <span className="text-gray-500 text-xs">Available Now</span>
            </div>
            <div className="bg-orange-50 p-2 rounded-lg">
              <span className="block font-bold text-orange-600">{availableTailors.summary.onLeave || 0}</span>
              <span className="text-gray-500 text-xs">On Leave</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}