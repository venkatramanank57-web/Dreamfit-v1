// // components/CuttingMasterDashboard.jsx
// import React, { useState, useEffect } from "react";
// import {
//   Calendar,
//   ClipboardList,
//   CheckCircle2,
//   UserCheck,
//   Award,
//   Users,
//   UserX,
//   TrendingUp,
//   Scissors,
//   Clock,
//   User,
//   PlusCircle,
//   Eye,
//   RefreshCw,
//   Filter,
//   Search,
//   ChevronDown,
//   PieChart as PieChartIcon,
//   BarChart3,
//   Download,
// } from "lucide-react";

// const CuttingMasterDashboard = () => {
//   // State management
//   const [dateRange, setDateRange] = useState({
//     range: "today",
//     startDate: new Date().toISOString().split("T")[0],
//     endDate: new Date().toISOString().split("T")[0],
//   });

//   const [loading, setLoading] = useState(true);
//   const [stats, setStats] = useState({
//     totalWork: 0,
//     assignedWork: 0,
//     myAssignedWork: 0,
//     completedWork: 0,
//   });

//   const [workStatus, setWorkStatus] = useState([
//     { name: "Pending", value: 10 },
//     { name: "Accepted", value: 8 },
//     { name: "Cutting Started", value: 6 },
//     { name: "Cutting Completed", value: 5 },
//     { name: "Sewing Started", value: 4 },
//     { name: "Sewing Completed", value: 3 },
//     { name: "Ironing", value: 2 },
//     { name: "Ready to Deliver", value: 1 },
//   ]);

//   const [tailorPerformance, setTailorPerformance] = useState([
//     { name: "Ravi", assigned: 12, completed: 8, inProgress: 4, efficiency: 75 },
//     { name: "Kumar", assigned: 10, completed: 6, inProgress: 4, efficiency: 70 },
//     { name: "Suresh", assigned: 8, completed: 5, inProgress: 3, efficiency: 68 },
//     { name: "Arjun", assigned: 15, completed: 12, inProgress: 3, efficiency: 85 },
//     { name: "Venkat", assigned: 7, completed: 6, inProgress: 1, efficiency: 92 },
//   ]);

//   const [availableTailors, setAvailableTailors] = useState({
//     total: 10,
//     available: 7,
//     onLeave: 3,
//   });

//   const [cuttingQueue, setCuttingQueue] = useState([
//     {
//       id: 1,
//       orderId: "1021",
//       customer: "Arjun",
//       dress: "Suit",
//       status: "pending",
//       expectedDate: "2026-03-15",
//       priority: "high",
//     },
//     {
//       id: 2,
//       orderId: "1022",
//       customer: "Ravi",
//       dress: "Shirt",
//       status: "accepted",
//       expectedDate: "2026-03-16",
//       priority: "normal",
//     },
//     {
//       id: 3,
//       orderId: "1023",
//       customer: "Priya",
//       dress: "Kurta",
//       status: "cutting-started",
//       expectedDate: "2026-03-14",
//       priority: "high",
//     },
//     {
//       id: 4,
//       orderId: "1024",
//       customer: "Kumar",
//       dress: "Pant",
//       status: "pending",
//       expectedDate: "2026-03-17",
//       priority: "normal",
//     },
//     {
//       id: 5,
//       orderId: "1025",
//       customer: "Deepa",
//       dress: "Blouse",
//       status: "accepted",
//       expectedDate: "2026-03-13",
//       priority: "high",
//     },
//   ]);

//   const [selectedFilter, setSelectedFilter] = useState("today");

//   // Simulate loading
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setLoading(false);
//     }, 1500);
//     return () => clearTimeout(timer);
//   }, []);

//   // Handle date filter change
//   const handleDateRangeChange = (range) => {
//     setSelectedFilter(range);
//     setLoading(true);
    
//     // Simulate API call
//     setTimeout(() => {
//       const today = new Date();
//       let startDate = today.toISOString().split("T")[0];
//       let endDate = today.toISOString().split("T")[0];

//       if (range === "week") {
//         const weekAgo = new Date(today);
//         weekAgo.setDate(today.getDate() - 7);
//         startDate = weekAgo.toISOString().split("T")[0];
//       } else if (range === "month") {
//         const monthAgo = new Date(today);
//         monthAgo.setMonth(today.getMonth() - 1);
//         startDate = monthAgo.toISOString().split("T")[0];
//       }

//       setDateRange({ range, startDate, endDate });
      
//       // Update stats based on filter (simulated)
//       if (range === "today") {
//         setStats({ totalWork: 120, assignedWork: 75, myAssignedWork: 30, completedWork: 18 });
//       } else if (range === "week") {
//         setStats({ totalWork: 450, assignedWork: 280, myAssignedWork: 95, completedWork: 62 });
//       } else if (range === "month") {
//         setStats({ totalWork: 1250, assignedWork: 820, myAssignedWork: 310, completedWork: 245 });
//       }
      
//       setLoading(false);
//     }, 800);
//   };

//   // Get status color
//   const getStatusColor = (status) => {
//     const colors = {
//       pending: "bg-yellow-100 text-yellow-800",
//       accepted: "bg-blue-100 text-blue-800",
//       "cutting-started": "bg-purple-100 text-purple-800",
//       "cutting-completed": "bg-green-100 text-green-800",
//     };
//     return colors[status] || "bg-gray-100 text-gray-800";
//   };

//   // Get status badge
//   const getStatusBadge = (status) => {
//     const badges = {
//       pending: "⏳ Pending",
//       accepted: "✅ Accepted",
//       "cutting-started": "✂️ Cutting Started",
//       "cutting-completed": "✔️ Cutting Completed",
//     };
//     return badges[status] || status;
//   };

//   // Loading skeleton
//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 p-6">
//         <div className="animate-pulse">
//           {/* Header Skeleton */}
//           <div className="h-10 bg-gray-200 rounded w-64 mb-6"></div>
          
//           {/* Filter Skeleton */}
//           <div className="bg-white rounded-xl p-4 mb-6">
//             <div className="h-10 bg-gray-200 rounded w-full"></div>
//           </div>
          
//           {/* KPI Skeleton */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//             {[1, 2, 3, 4].map((i) => (
//               <div key={i} className="bg-white rounded-xl p-6">
//                 <div className="h-4 bg-gray-200 rounded w-24 mb-4"></div>
//                 <div className="h-8 bg-gray-200 rounded w-16"></div>
//               </div>
//             ))}
//           </div>
          
//           {/* Content Skeleton */}
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
//             <div className="lg:col-span-2 bg-white rounded-xl p-6 h-64"></div>
//             <div className="bg-white rounded-xl p-6 h-64"></div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Main Container */}
//       <div className="p-4 md:p-6 space-y-6">
//         {/* Header */}
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//           <div>
//             <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
//               <Scissors className="w-8 h-8 text-blue-600" />
//               Cutting Master Dashboard
//             </h1>
//             <p className="text-sm text-gray-500 mt-1">
//               Welcome back, Venkatramanan! 👋
//             </p>
//           </div>
          
//           <div className="flex items-center gap-3">
//             <button
//               onClick={() => handleDateRangeChange(selectedFilter)}
//               className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
//             >
//               <RefreshCw className="w-4 h-4" />
//               Refresh
//             </button>
//             <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center gap-2">
//               <Download className="w-4 h-4" />
//               Export
//             </button>
//           </div>
//         </div>

//         {/* Row 1: Date Filter */}
//         <div className="bg-white rounded-xl shadow-sm p-4">
//           <div className="flex flex-wrap items-center gap-4">
//             <div className="flex items-center gap-2">
//               <Filter className="w-5 h-5 text-gray-500" />
//               <span className="text-sm font-medium text-gray-700">Date Range:</span>
//             </div>
            
//             <div className="flex flex-wrap gap-2">
//               {[
//                 { label: "Today", value: "today" },
//                 { label: "Week", value: "week" },
//                 { label: "Month", value: "month" },
//                 { label: "Custom", value: "custom" },
//               ].map((range) => (
//                 <button
//                   key={range.value}
//                   onClick={() => handleDateRangeChange(range.value)}
//                   className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
//                     selectedFilter === range.value
//                       ? "bg-blue-600 text-white"
//                       : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                   }`}
//                 >
//                   {range.label}
//                 </button>
//               ))}
//             </div>

//             {selectedFilter === "custom" && (
//               <div className="flex items-center gap-2 ml-auto">
//                 <input
//                   type="date"
//                   value={dateRange.startDate}
//                   onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
//                   className="px-3 py-2 border rounded-lg text-sm"
//                 />
//                 <span className="text-gray-500">to</span>
//                 <input
//                   type="date"
//                   value={dateRange.endDate}
//                   onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
//                   className="px-3 py-2 border rounded-lg text-sm"
//                 />
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Row 2: KPI Boxes */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//           {/* Total Work */}
//           <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-500 font-medium">Total Work</p>
//                 <p className="text-2xl font-bold text-gray-800 mt-2">{stats.totalWork}</p>
//               </div>
//               <div className="bg-blue-50 p-3 rounded-lg">
//                 <ClipboardList className="w-6 h-6 text-blue-600" />
//               </div>
//             </div>
//             <div className="mt-4">
//               <div className="w-full bg-gray-200 rounded-full h-2">
//                 <div className="bg-blue-500 h-2 rounded-full" style={{ width: "100%" }} />
//               </div>
//             </div>
//           </div>

//           {/* Assigned Work */}
//           <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-500 font-medium">Assigned Work</p>
//                 <p className="text-2xl font-bold text-gray-800 mt-2">{stats.assignedWork}</p>
//               </div>
//               <div className="bg-purple-50 p-3 rounded-lg">
//                 <UserCheck className="w-6 h-6 text-purple-600" />
//               </div>
//             </div>
//             <div className="mt-4">
//               <div className="w-full bg-gray-200 rounded-full h-2">
//                 <div
//                   className="bg-purple-500 h-2 rounded-full"
//                   style={{ width: `${(stats.assignedWork / stats.totalWork) * 100}%` }}
//                 />
//               </div>
//             </div>
//           </div>

//           {/* My Assigned */}
//           <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-500 font-medium">My Assigned</p>
//                 <p className="text-2xl font-bold text-gray-800 mt-2">{stats.myAssignedWork}</p>
//               </div>
//               <div className="bg-orange-50 p-3 rounded-lg">
//                 <Award className="w-6 h-6 text-orange-600" />
//               </div>
//             </div>
//             <div className="mt-4">
//               <div className="w-full bg-gray-200 rounded-full h-2">
//                 <div
//                   className="bg-orange-500 h-2 rounded-full"
//                   style={{ width: `${(stats.myAssignedWork / stats.totalWork) * 100}%` }}
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Completed */}
//           <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-500 font-medium">Completed</p>
//                 <p className="text-2xl font-bold text-gray-800 mt-2">{stats.completedWork}</p>
//               </div>
//               <div className="bg-green-50 p-3 rounded-lg">
//                 <CheckCircle2 className="w-6 h-6 text-green-600" />
//               </div>
//             </div>
//             <div className="mt-4">
//               <div className="w-full bg-gray-200 rounded-full h-2">
//                 <div
//                   className="bg-green-500 h-2 rounded-full"
//                   style={{ width: `${(stats.completedWork / stats.totalWork) * 100}%` }}
//                 />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Row 3: Available Tailors */}
//         <div className="bg-white rounded-xl shadow-sm p-6">
//           <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
//             <Users className="w-5 h-5 text-blue-600" />
//             Available Tailors
//           </h2>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div className="bg-gray-50 rounded-lg p-4">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-gray-500">Total Tailors</p>
//                   <p className="text-2xl font-bold text-gray-800">{availableTailors.total}</p>
//                 </div>
//                 <div className="bg-blue-100 p-3 rounded-lg">
//                   <Users className="w-5 h-5 text-blue-600" />
//                 </div>
//               </div>
//             </div>

//             <div className="bg-green-50 rounded-lg p-4">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-green-600">Available</p>
//                   <p className="text-2xl font-bold text-green-700">{availableTailors.available}</p>
//                 </div>
//                 <div className="bg-green-100 p-3 rounded-lg">
//                   <UserCheck className="w-5 h-5 text-green-600" />
//                 </div>
//               </div>
//             </div>

//             <div className="bg-red-50 rounded-lg p-4">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-red-600">On Leave</p>
//                   <p className="text-2xl font-bold text-red-700">{availableTailors.onLeave}</p>
//                 </div>
//                 <div className="bg-red-100 p-3 rounded-lg">
//                   <UserX className="w-5 h-5 text-red-600" />
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Progress Bar */}
//           <div className="mt-4">
//             <div className="flex justify-between text-sm mb-1">
//               <span className="text-gray-600">Availability Rate</span>
//               <span className="font-medium text-gray-800">
//                 {Math.round((availableTailors.available / availableTailors.total) * 100)}%
//               </span>
//             </div>
//             <div className="w-full bg-gray-200 rounded-full h-2">
//               <div
//                 className="bg-green-500 h-2 rounded-full"
//                 style={{ width: `${(availableTailors.available / availableTailors.total) * 100}%` }}
//               />
//             </div>
//           </div>
//         </div>

//         {/* Row 4: Work Status + Quick Actions */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* Work Status Overview */}
//           <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
//             <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
//               <PieChartIcon className="w-5 h-5 text-blue-600" />
//               Work Status Overview
//             </h2>

//             {/* Simple Bar Chart Representation */}
//             <div className="space-y-3">
//               {workStatus.map((item, index) => (
//                 <div key={item.name}>
//                   <div className="flex justify-between text-sm mb-1">
//                     <span className="text-gray-600">{item.name}</span>
//                     <span className="font-medium text-gray-800">{item.value} orders</span>
//                   </div>
//                   <div className="w-full bg-gray-200 rounded-full h-2.5">
//                     <div
//                       className="h-2.5 rounded-full"
//                       style={{
//                         width: `${(item.value / 30) * 100}%`,
//                         backgroundColor: [
//                           "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4",
//                           "#FFE194", "#B19CD9", "#FFB347", "#A8E6CF"
//                         ][index % 8]
//                       }}
//                     />
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Summary Cards */}
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
//               {workStatus.map((item, index) => (
//                 <div key={item.name} className="bg-gray-50 rounded-lg p-3">
//                   <div className="flex items-center gap-2">
//                     <div
//                       className="w-3 h-3 rounded-full"
//                       style={{ backgroundColor: [
//                         "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4",
//                         "#FFE194", "#B19CD9", "#FFB347", "#A8E6CF"
//                       ][index % 8] }}
//                     />
//                     <p className="text-xs text-gray-500 truncate">{item.name}</p>
//                   </div>
//                   <p className="text-lg font-bold text-gray-800 mt-1">{item.value}</p>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Quick Actions */}
//           <div className="bg-white rounded-xl shadow-sm p-6">
//             <h2 className="text-lg font-semibold text-gray-800 mb-4">
//               Quick Actions
//             </h2>

//             <div className="grid grid-cols-2 gap-3">
//               {[
//                 { title: "Assign Work", icon: PlusCircle, color: "bg-blue-600" },
//                 { title: "View Orders", icon: Eye, color: "bg-purple-600" },
//                 { title: "View Tailors", icon: Users, color: "bg-green-600" },
//                 { title: "Update Status", icon: RefreshCw, color: "bg-orange-600" },
//                 { title: "Cutting Queue", icon: Scissors, color: "bg-red-600" },
//                 { title: "Reports", icon: BarChart3, color: "bg-indigo-600" },
//               ].map((action) => {
//                 const Icon = action.icon;
//                 return (
//                   <button
//                     key={action.title}
//                     className={`${action.color} text-white rounded-lg p-4 transition transform hover:scale-105 hover:shadow-lg`}
//                   >
//                     <Icon className="w-6 h-6 mb-2 mx-auto" />
//                     <span className="text-xs font-medium block text-center">{action.title}</span>
//                   </button>
//                 );
//               })}
//             </div>

//             {/* Today's Summary */}
//             <div className="mt-4 pt-4 border-t border-gray-100">
//               <p className="text-xs text-gray-500 mb-2">Today's Progress</p>
//               <div className="space-y-2">
//                 <div>
//                   <div className="flex justify-between text-xs mb-1">
//                     <span>Cutting Completed</span>
//                     <span className="font-medium">12/20</span>
//                   </div>
//                   <div className="w-full bg-gray-200 rounded-full h-1.5">
//                     <div className="bg-green-500 h-1.5 rounded-full" style={{ width: "60%" }} />
//                   </div>
//                 </div>
//                 <div>
//                   <div className="flex justify-between text-xs mb-1">
//                     <span>Target Achievement</span>
//                     <span className="font-medium">75%</span>
//                   </div>
//                   <div className="w-full bg-gray-200 rounded-full h-1.5">
//                     <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: "75%" }} />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Row 5: Tailor Performance + Cutting Queue */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           {/* Tailor Performance */}
//           <div className="bg-white rounded-xl shadow-sm p-6">
//             <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
//               <TrendingUp className="w-5 h-5 text-blue-600" />
//               Tailor Performance
//             </h2>

//             <div className="space-y-4">
//               {tailorPerformance.sort((a, b) => b.completed - a.completed).map((tailor, index) => (
//                 <div
//                   key={tailor.name}
//                   className="bg-gradient-to-r from-gray-50 to-white rounded-lg p-4 border border-gray-100 hover:shadow-md transition"
//                 >
//                   {/* Rank and Name */}
//                   <div className="flex items-center gap-3 mb-3">
//                     {index === 0 && <span className="text-2xl">🥇</span>}
//                     {index === 1 && <span className="text-2xl">🥈</span>}
//                     {index === 2 && <span className="text-2xl">🥉</span>}
//                     {index > 2 && (
//                       <span className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-bold text-gray-600">
//                         #{index + 1}
//                       </span>
//                     )}
//                     <span className="font-semibold text-gray-800">{tailor.name}</span>
//                     {tailor.efficiency >= 80 && (
//                       <Award className="w-4 h-4 text-yellow-500" />
//                     )}
//                   </div>

//                   {/* Stats Grid */}
//                   <div className="grid grid-cols-3 gap-2 text-sm">
//                     <div>
//                       <p className="text-gray-500">Assigned</p>
//                       <p className="font-bold text-gray-800">{tailor.assigned}</p>
//                     </div>
//                     <div>
//                       <p className="text-gray-500">Completed</p>
//                       <p className="font-bold text-green-600">{tailor.completed}</p>
//                     </div>
//                     <div>
//                       <p className="text-gray-500">In Progress</p>
//                       <p className="font-bold text-blue-600">{tailor.inProgress}</p>
//                     </div>
//                   </div>

//                   {/* Progress Bar */}
//                   <div className="mt-3">
//                     <div className="flex justify-between text-xs mb-1">
//                       <span className="text-gray-500">Efficiency</span>
//                       <span className="font-medium text-gray-700">{tailor.efficiency}%</span>
//                     </div>
//                     <div className="w-full bg-gray-200 rounded-full h-1.5">
//                       <div
//                         className="bg-green-500 h-1.5 rounded-full"
//                         style={{ width: `${tailor.efficiency}%` }}
//                       />
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Cutting Queue */}
//           <div className="bg-white rounded-xl shadow-sm p-6">
//             <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
//               <Scissors className="w-5 h-5 text-blue-600" />
//                Cutting Master Work Queue
//               <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
//                 {cuttingQueue.length} pending
//               </span>
//             </h2>

//             {/* Search */}
//             <div className="mb-4 relative">
//               <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search orders..."
//                 className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>

//             <div className="space-y-3 max-h-96 overflow-y-auto">
//               {cuttingQueue.map((order) => (
//                 <div
//                   key={order.id}
//                   className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition cursor-pointer"
//                 >
//                   <div className="flex items-center justify-between mb-2">
//                     <span className="font-semibold text-gray-800">#{order.orderId}</span>
//                     <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
//                       {getStatusBadge(order.status)}
//                     </span>
//                   </div>

//                   <div className="grid grid-cols-2 gap-2 text-sm">
//                     <div className="flex items-center gap-1 text-gray-600">
//                       <User className="w-4 h-4" />
//                       <span>{order.customer}</span>
//                     </div>
//                     <div className="flex items-center gap-1 text-gray-600">
//                       <Clock className="w-4 h-4" />
//                       <span>{order.dress}</span>
//                     </div>
//                   </div>

//                   <div className="mt-2 flex items-center gap-1 text-xs text-gray-500">
//                     <Calendar className="w-3 h-3" />
//                     <span>Expected: {new Date(order.expectedDate).toLocaleDateString('en-IN')}</span>
//                   </div>

//                   {/* Priority Indicator */}
//                   {order.priority === "high" && (
//                     <div className="mt-2">
//                       <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
//                         🔴 High Priority
//                       </span>
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>

//             {/* View All Button */}
//             <button className="mt-4 w-full py-2 text-sm text-blue-600 hover:text-blue-700 font-medium border border-blue-200 rounded-lg hover:bg-blue-50 transition">
//               View All Orders →
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CuttingMasterDashboard;



// // components/CuttingMasterDashboard.jsx
// import React, { useState, useEffect } from "react";
// import {
//   Calendar,
//   ClipboardList,
//   CheckCircle2,
//   UserCheck,
//   Award,
//   Users,
//   UserX,
//   TrendingUp,
//   Scissors,
//   Clock,
//   User,
//   PlusCircle,
//   Eye,
//   RefreshCw,
//   Filter,
//   Search,
//   PieChart as PieChartIcon,
//   BarChart3,
//   Download,
// } from "lucide-react";
// import cuttingMasterApi from "../features/cuttingMaster/cuttingMasterApi";
// import { toast } from "react-hot-toast";

// const CuttingMasterDashboard = () => {
//   // State management
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [dateRange, setDateRange] = useState({
//     range: "today",
//     startDate: new Date().toISOString().split("T")[0],
//     endDate: new Date().toISOString().split("T")[0],
//   });

//   // Dashboard data states
//   const [stats, setStats] = useState({
//     totalWork: 0,
//     assignedWork: 0,
//     myAssignedWork: 0,
//     completedWork: 0,
//   });

//   const [workStatus, setWorkStatus] = useState([]);
//   const [tailorPerformance, setTailorPerformance] = useState([]);
//   const [availableTailors, setAvailableTailors] = useState({
//     total: 0,
//     available: 0,
//     onLeave: 0,
//   });
//   const [cuttingQueue, setCuttingQueue] = useState([]);
//   const [todaySummary, setTodaySummary] = useState({
//     completed: 0,
//     total: 0,
//     progress: 0
//   });
//   const [highPriorityWorks, setHighPriorityWorks] = useState([]);

//   const [selectedFilter, setSelectedFilter] = useState("today");
//   const [queueSearch, setQueueSearch] = useState("");
//   const [queueStatus, setQueueStatus] = useState("all");

//   // Fetch all dashboard data
//   const fetchDashboardData = async () => {
//     try {
//       setRefreshing(true);
      
//       // Prepare date params
//       const params = {};
//       if (dateRange.startDate && dateRange.endDate) {
//         params.startDate = dateRange.startDate;
//         params.endDate = dateRange.endDate;
//       }

//       // Fetch all data in parallel for better performance
//       const [
//         statsResponse,
//         workStatusResponse,
//         tailorResponse,
//         availableResponse,
//         queueResponse,
//         todayResponse,
//         priorityResponse
//       ] = await Promise.all([
//         cuttingMasterApi.getDashboardStats(params),
//         cuttingMasterApi.getWorkStatusBreakdown(params),
//         cuttingMasterApi.getTailorPerformance(),
//         cuttingMasterApi.getAvailableTailors(),
//         cuttingMasterApi.getWorkQueue({ status: queueStatus, search: queueSearch }),
//         cuttingMasterApi.getTodaySummary(),
//         cuttingMasterApi.getHighPriorityWorks()
//       ]);

//       // Update states with real data
//       if (statsResponse?.success) {
//         setStats(statsResponse.data);
//       }

//       if (workStatusResponse?.success) {
//         setWorkStatus(workStatusResponse.data);
//       }

//       if (tailorResponse?.success) {
//         setTailorPerformance(tailorResponse.data);
//       }

//       if (availableResponse?.success) {
//         setAvailableTailors(availableResponse.data.summary);
//       }

//       if (queueResponse?.success) {
//         setCuttingQueue(queueResponse.data.queue);
//       }

//       if (todayResponse?.success) {
//         setTodaySummary(todayResponse.data);
//       }

//       if (priorityResponse?.success) {
//         setHighPriorityWorks(priorityResponse.data);
//       }

//     } catch (error) {
//       console.error("Error fetching dashboard data:", error);
//       toast.error("Failed to load dashboard data");
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   // Initial load
//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   // Handle date filter change
//   const handleDateRangeChange = async (range) => {
//     setSelectedFilter(range);
//     setLoading(true);
    
//     const today = new Date();
//     let startDate = today.toISOString().split("T")[0];
//     let endDate = today.toISOString().split("T")[0];

//     if (range === "week") {
//       const weekAgo = new Date(today);
//       weekAgo.setDate(today.getDate() - 7);
//       startDate = weekAgo.toISOString().split("T")[0];
//     } else if (range === "month") {
//       const monthAgo = new Date(today);
//       monthAgo.setMonth(today.getMonth() - 1);
//       startDate = monthAgo.toISOString().split("T")[0];
//     }

//     setDateRange({ range, startDate, endDate });
    
//     // Fetch data with new date range
//     await fetchDashboardData();
//   };

//   // Handle queue search
//   useEffect(() => {
//     const delayDebounce = setTimeout(() => {
//       if (!loading) {
//         fetchDashboardData();
//       }
//     }, 500);

//     return () => clearTimeout(delayDebounce);
//   }, [queueSearch, queueStatus]);

//   // Handle status update
//   const handleStatusUpdate = async (workId, newStatus) => {
//     try {
//       const response = await cuttingMasterApi.updateWorkStatus(workId, {
//         status: newStatus,
//         notes: `Status updated to ${newStatus}`
//       });

//       if (response?.success) {
//         toast.success(`Work status updated to ${newStatus}`);
//         fetchDashboardData(); // Refresh data
//       }
//     } catch (error) {
//       console.error("Error updating status:", error);
//       toast.error("Failed to update status");
//     }
//   };

//   // Get status color
//   const getStatusColor = (status) => {
//     const colors = {
//       pending: "bg-yellow-100 text-yellow-800",
//       accepted: "bg-blue-100 text-blue-800",
//       "cutting-started": "bg-purple-100 text-purple-800",
//       "cutting-completed": "bg-green-100 text-green-800",
//     };
//     return colors[status] || "bg-gray-100 text-gray-800";
//   };

//   // Get status badge
//   const getStatusBadge = (status) => {
//     const badges = {
//       pending: "⏳ Pending",
//       accepted: "✅ Accepted",
//       "cutting-started": "✂️ Cutting Started",
//       "cutting-completed": "✔️ Cutting Completed",
//     };
//     return badges[status] || status;
//   };

//   // Loading skeleton
//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 p-6">
//         <div className="animate-pulse">
//           <div className="h-10 bg-gray-200 rounded w-64 mb-6"></div>
//           <div className="bg-white rounded-xl p-4 mb-6">
//             <div className="h-10 bg-gray-200 rounded w-full"></div>
//           </div>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//             {[1, 2, 3, 4].map((i) => (
//               <div key={i} className="bg-white rounded-xl p-6">
//                 <div className="h-4 bg-gray-200 rounded w-24 mb-4"></div>
//                 <div className="h-8 bg-gray-200 rounded w-16"></div>
//               </div>
//             ))}
//           </div>
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
//             <div className="lg:col-span-2 bg-white rounded-xl p-6 h-64"></div>
//             <div className="bg-white rounded-xl p-6 h-64"></div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="p-4 md:p-6 space-y-6">
//         {/* Header */}
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//           <div>
//             <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
//               <Scissors className="w-8 h-8 text-blue-600" />
//               Cutting Master Dashboard
//             </h1>
//             <p className="text-sm text-gray-500 mt-1">
//               Welcome back, {JSON.parse(localStorage.getItem('user'))?.name || 'User'}! 👋
//             </p>
//           </div>
          
//           <div className="flex items-center gap-3">
//             <button
//               onClick={fetchDashboardData}
//               disabled={refreshing}
//               className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-50"
//             >
//               <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
//               {refreshing ? 'Refreshing...' : 'Refresh'}
//             </button>
//             <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center gap-2">
//               <Download className="w-4 h-4" />
//               Export
//             </button>
//           </div>
//         </div>

//         {/* Row 1: Date Filter */}
//         <div className="bg-white rounded-xl shadow-sm p-4">
//           <div className="flex flex-wrap items-center gap-4">
//             <div className="flex items-center gap-2">
//               <Filter className="w-5 h-5 text-gray-500" />
//               <span className="text-sm font-medium text-gray-700">Date Range:</span>
//             </div>
            
//             <div className="flex flex-wrap gap-2">
//               {[
//                 { label: "Today", value: "today" },
//                 { label: "Week", value: "week" },
//                 { label: "Month", value: "month" },
//                 { label: "Custom", value: "custom" },
//               ].map((range) => (
//                 <button
//                   key={range.value}
//                   onClick={() => handleDateRangeChange(range.value)}
//                   className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
//                     selectedFilter === range.value
//                       ? "bg-blue-600 text-white"
//                       : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                   }`}
//                 >
//                   {range.label}
//                 </button>
//               ))}
//             </div>

//             {selectedFilter === "custom" && (
//               <div className="flex items-center gap-2 ml-auto">
//                 <input
//                   type="date"
//                   value={dateRange.startDate}
//                   onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
//                   className="px-3 py-2 border rounded-lg text-sm"
//                 />
//                 <span className="text-gray-500">to</span>
//                 <input
//                   type="date"
//                   value={dateRange.endDate}
//                   onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
//                   className="px-3 py-2 border rounded-lg text-sm"
//                 />
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Row 2: KPI Boxes */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//           <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-500 font-medium">Total Work</p>
//                 <p className="text-2xl font-bold text-gray-800 mt-2">{stats.totalWork}</p>
//               </div>
//               <div className="bg-blue-50 p-3 rounded-lg">
//                 <ClipboardList className="w-6 h-6 text-blue-600" />
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-500 font-medium">Assigned Work</p>
//                 <p className="text-2xl font-bold text-gray-800 mt-2">{stats.assignedWork}</p>
//               </div>
//               <div className="bg-purple-50 p-3 rounded-lg">
//                 <UserCheck className="w-6 h-6 text-purple-600" />
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-500 font-medium">My Assigned</p>
//                 <p className="text-2xl font-bold text-gray-800 mt-2">{stats.myAssignedWork}</p>
//               </div>
//               <div className="bg-orange-50 p-3 rounded-lg">
//                 <Award className="w-6 h-6 text-orange-600" />
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-500 font-medium">Completed</p>
//                 <p className="text-2xl font-bold text-gray-800 mt-2">{stats.completedWork}</p>
//               </div>
//               <div className="bg-green-50 p-3 rounded-lg">
//                 <CheckCircle2 className="w-6 h-6 text-green-600" />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Row 3: Available Tailors */}
//         <div className="bg-white rounded-xl shadow-sm p-6">
//           <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
//             <Users className="w-5 h-5 text-blue-600" />
//             Available Tailors
//           </h2>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div className="bg-gray-50 rounded-lg p-4">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-gray-500">Total Tailors</p>
//                   <p className="text-2xl font-bold text-gray-800">{availableTailors.total}</p>
//                 </div>
//                 <div className="bg-blue-100 p-3 rounded-lg">
//                   <Users className="w-5 h-5 text-blue-600" />
//                 </div>
//               </div>
//             </div>

//             <div className="bg-green-50 rounded-lg p-4">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-green-600">Available</p>
//                   <p className="text-2xl font-bold text-green-700">{availableTailors.available}</p>
//                 </div>
//                 <div className="bg-green-100 p-3 rounded-lg">
//                   <UserCheck className="w-5 h-5 text-green-600" />
//                 </div>
//               </div>
//             </div>

//             <div className="bg-red-50 rounded-lg p-4">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-red-600">On Leave</p>
//                   <p className="text-2xl font-bold text-red-700">{availableTailors.onLeave}</p>
//                 </div>
//                 <div className="bg-red-100 p-3 rounded-lg">
//                   <UserX className="w-5 h-5 text-red-600" />
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="mt-4">
//             <div className="flex justify-between text-sm mb-1">
//               <span className="text-gray-600">Availability Rate</span>
//               <span className="font-medium text-gray-800">
//                 {Math.round((availableTailors.available / (availableTailors.total || 1)) * 100)}%
//               </span>
//             </div>
//             <div className="w-full bg-gray-200 rounded-full h-2">
//               <div
//                 className="bg-green-500 h-2 rounded-full"
//                 style={{ width: `${(availableTailors.available / (availableTailors.total || 1)) * 100}%` }}
//               />
//             </div>
//           </div>
//         </div>

//         {/* Row 4: Work Status + Quick Actions */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* Work Status Overview */}
//           <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
//             <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
//               <PieChartIcon className="w-5 h-5 text-blue-600" />
//               Work Status Overview
//             </h2>

//             <div className="space-y-3">
//               {workStatus.map((item, index) => (
//                 <div key={item.name}>
//                   <div className="flex justify-between text-sm mb-1">
//                     <span className="text-gray-600">{item.name}</span>
//                     <span className="font-medium text-gray-800">{item.value} orders</span>
//                   </div>
//                   <div className="w-full bg-gray-200 rounded-full h-2.5">
//                     <div
//                       className="h-2.5 rounded-full"
//                       style={{
//                         width: `${(item.value / Math.max(...workStatus.map(i => i.value), 1)) * 100}%`,
//                         backgroundColor: [
//                           "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4",
//                           "#FFE194", "#B19CD9", "#FFB347", "#A8E6CF"
//                         ][index % 8]
//                       }}
//                     />
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Quick Actions */}
//           <div className="bg-white rounded-xl shadow-sm p-6">
//             <h2 className="text-lg font-semibold text-gray-800 mb-4">
//               Quick Actions
//             </h2>

//             <div className="grid grid-cols-2 gap-3">
//               {[
//                 { title: "Assign Work", icon: PlusCircle, color: "bg-blue-600", href: "/cutting-master/assign" },
//                 { title: "View Works", icon: Eye, color: "bg-purple-600", href: "/cutting-master/orders" },
//                 { title: "View Tailors", icon: Users, color: "bg-green-600", href: "/cutting-master/tailors" },
//                 { title: "Update Status", icon: RefreshCw, color: "bg-orange-600", href: "#", onClick: fetchDashboardData },
//                 { title: "Cutting Queue", icon: Scissors, color: "bg-red-600", href: "/cutting-master/queue" },
//               ].map((action) => {
//                 const Icon = action.icon;
//                 return (
//                   <button
//                     key={action.title}
//                     onClick={action.onClick}
//                     className={`${action.color} text-white rounded-lg p-4 transition transform hover:scale-105 hover:shadow-lg`}
//                   >
//                     <Icon className="w-6 h-6 mb-2 mx-auto" />
//                     <span className="text-xs font-medium block text-center">{action.title}</span>
//                   </button>
//                 );
//               })}
//             </div>

//             {/* Today's Summary */}
//             <div className="mt-4 pt-4 border-t border-gray-100">
//               <p className="text-xs text-gray-500 mb-2">Today's Progress</p>
//               <div className="space-y-2">
//                 <div>
//                   <div className="flex justify-between text-xs mb-1">
//                     <span>Cutting Completed</span>
//                     <span className="font-medium">{todaySummary.completed}/{todaySummary.total}</span>
//                   </div>
//                   <div className="w-full bg-gray-200 rounded-full h-1.5">
//                     <div 
//                       className="bg-green-500 h-1.5 rounded-full" 
//                       style={{ width: `${todaySummary.progress}%` }} 
//                     />
//                   </div>
//                 </div>

//                 {/* High Priority Summary */}
//                 {highPriorityWorks.length > 0 && (
//                   <div className="mt-3">
//                     <p className="text-xs font-medium text-red-600 mb-1">
//                       🔴 {highPriorityWorks.length} High Priority
//                     </p>
//                     <div className="space-y-1">
//                       {highPriorityWorks.slice(0, 2).map(work => (
//                         <div key={work.id} className="text-xs text-gray-600">
//                           {work.customer} - {work.dress}
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Row 5: Tailor Performance + Cutting Queue */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           {/* Tailor Performance */}
//           <div className="bg-white rounded-xl shadow-sm p-6">
//             <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
//               <TrendingUp className="w-5 h-5 text-blue-600" />
//               Tailor Performance
//             </h2>

//             <div className="space-y-4">
//               {tailorPerformance.slice(0, 5).map((tailor, index) => (
//                 <div
//                   key={tailor.id || tailor.name}
//                   className="bg-gradient-to-r from-gray-50 to-white rounded-lg p-4 border border-gray-100 hover:shadow-md transition"
//                 >
//                   <div className="flex items-center gap-3 mb-3">
//                     {index === 0 && <span className="text-2xl">🥇</span>}
//                     {index === 1 && <span className="text-2xl">🥈</span>}
//                     {index === 2 && <span className="text-2xl">🥉</span>}
//                     {index > 2 && (
//                       <span className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-bold text-gray-600">
//                         #{index + 1}
//                       </span>
//                     )}
//                     <span className="font-semibold text-gray-800">{tailor.name}</span>
//                     {tailor.efficiency >= 80 && (
//                       <Award className="w-4 h-4 text-yellow-500" />
//                     )}
//                   </div>

//                   <div className="grid grid-cols-3 gap-2 text-sm">
//                     <div>
//                       <p className="text-gray-500">Assigned</p>
//                       <p className="font-bold text-gray-800">{tailor.assigned}</p>
//                     </div>
//                     <div>
//                       <p className="text-gray-500">Completed</p>
//                       <p className="font-bold text-green-600">{tailor.completed}</p>
//                     </div>
//                     <div>
//                       <p className="text-gray-500">In Progress</p>
//                       <p className="font-bold text-blue-600">{tailor.inProgress}</p>
//                     </div>
//                   </div>

//                   <div className="mt-3">
//                     <div className="flex justify-between text-xs mb-1">
//                       <span className="text-gray-500">Efficiency</span>
//                       <span className="font-medium text-gray-700">{tailor.efficiency}%</span>
//                     </div>
//                     <div className="w-full bg-gray-200 rounded-full h-1.5">
//                       <div
//                         className="bg-green-500 h-1.5 rounded-full"
//                         style={{ width: `${tailor.efficiency}%` }}
//                       />
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Cutting Master Work Queue */}
//           <div className="bg-white rounded-xl shadow-sm p-6">
//             <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
//               <Scissors className="w-5 h-5 text-blue-600" />
//               Cutting Master Work Queue
//               <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
//                 {cuttingQueue.length} pending
//               </span>
//             </h2>

//             {/* Search and Filter */}
//             <div className="mb-4 space-y-2">
//               <div className="relative">
//                 <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                 <input
//                   type="text"
//                   value={queueSearch}
//                   onChange={(e) => setQueueSearch(e.target.value)}
//                   placeholder="Search orders..."
//                   className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>
              
//               <select
//                 value={queueStatus}
//                 onChange={(e) => setQueueStatus(e.target.value)}
//                 className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//               >
//                 <option value="all">All Status</option>
//                 <option value="pending">Pending</option>
//                 <option value="accepted">Accepted</option>
//                 <option value="cutting-started">Cutting Started</option>
//                 <option value="cutting-completed">Cutting Completed</option>
//               </select>
//             </div>

//             <div className="space-y-3 max-h-96 overflow-y-auto">
//               {cuttingQueue.map((order) => (
//                 <div
//                   key={order.id}
//                   className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition cursor-pointer"
//                 >
//                   <div className="flex items-center justify-between mb-2">
//                     <span className="font-semibold text-gray-800">#{order.workId || order.orderId}</span>
//                     <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
//                       {getStatusBadge(order.status)}
//                     </span>
//                   </div>

//                   <div className="grid grid-cols-2 gap-2 text-sm">
//                     <div className="flex items-center gap-1 text-gray-600">
//                       <User className="w-4 h-4" />
//                       <span>{order.customer}</span>
//                     </div>
//                     <div className="flex items-center gap-1 text-gray-600">
//                       <Clock className="w-4 h-4" />
//                       <span>{order.dress}</span>
//                     </div>
//                   </div>

//                   <div className="mt-2 flex items-center gap-1 text-xs text-gray-500">
//                     <Calendar className="w-3 h-3" />
//                     <span>Expected: {order.expectedDate ? new Date(order.expectedDate).toLocaleDateString('en-IN') : 'N/A'}</span>
//                   </div>

//                   {/* Action Buttons for Status Update */}
//                   <div className="mt-3 flex gap-2">
//                     {order.status === 'pending' && (
//                       <button
//                         onClick={() => handleStatusUpdate(order.id, 'accepted')}
//                         className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
//                       >
//                         Accept
//                       </button>
//                     )}
//                     {order.status === 'accepted' && (
//                       <button
//                         onClick={() => handleStatusUpdate(order.id, 'cutting-started')}
//                         className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200"
//                       >
//                         Start Cutting
//                       </button>
//                     )}
//                     {order.status === 'cutting-started' && (
//                       <button
//                         onClick={() => handleStatusUpdate(order.id, 'cutting-completed')}
//                         className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
//                       >
//                         Complete Cutting
//                       </button>
//                     )}
//                   </div>

//                   {/* Priority Indicator */}
//                   {order.priority === "high" && (
//                     <div className="mt-2">
//                       <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
//                         🔴 High Priority
//                       </span>
//                     </div>
//                   )}
//                 </div>
//               ))}

//               {cuttingQueue.length === 0 && (
//                 <div className="text-center py-8 text-gray-500">
//                   No orders in queue
//                 </div>
//               )}
//             </div>

//             {/* View All Button */}
//             <button 
//               onClick={() => window.location.href = '/cutting-master/queue'}
//               className="mt-4 w-full py-2 text-sm text-blue-600 hover:text-blue-700 font-medium border border-blue-200 rounded-lg hover:bg-blue-50 transition"
//             >
//               View All Orders →
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CuttingMasterDashboard;



// components/CuttingMasterDashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  ClipboardList,
  CheckCircle2,
  UserCheck,
  Award,
  Users,
  UserX,
  TrendingUp,
  Scissors,
  Clock,
  User,
  PlusCircle,
  Eye,
  RefreshCw,
  Filter,
  Search,
  PieChart as PieChartIcon,
  BarChart3,
  Download,
} from "lucide-react";
import cuttingMasterApi from "../features/cuttingMaster/cuttingMasterApi";
import { toast } from "react-hot-toast";

const CuttingMasterDashboard = () => {
  const navigate = useNavigate();
  
  // State management
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dateRange, setDateRange] = useState({
    range: "today",
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });

  // Dashboard data states
  const [stats, setStats] = useState({
    totalWork: 0,
    assignedWork: 0,
    myAssignedWork: 0,
    completedWork: 0,
  });

  const [workStatus, setWorkStatus] = useState([]);
  const [tailorPerformance, setTailorPerformance] = useState([]);
  const [availableTailors, setAvailableTailors] = useState({
    total: 0,
    available: 0,
    onLeave: 0,
  });
  const [cuttingQueue, setCuttingQueue] = useState([]);
  const [todaySummary, setTodaySummary] = useState({
    completed: 0,
    total: 0,
    progress: 0
  });
  const [highPriorityWorks, setHighPriorityWorks] = useState([]);

  const [selectedFilter, setSelectedFilter] = useState("today");
  const [queueSearch, setQueueSearch] = useState("");
  const [queueStatus, setQueueStatus] = useState("all");

  // Fetch all dashboard data
  const fetchDashboardData = async () => {
    try {
      setRefreshing(true);
      
      // Prepare date params
      const params = {};
      if (dateRange.startDate && dateRange.endDate) {
        params.startDate = dateRange.startDate;
        params.endDate = dateRange.endDate;
      }

      // Fetch all data in parallel for better performance
      const [
        statsResponse,
        workStatusResponse,
        tailorResponse,
        availableResponse,
        queueResponse,
        todayResponse,
        priorityResponse
      ] = await Promise.all([
        cuttingMasterApi.getDashboardStats(params),
        cuttingMasterApi.getWorkStatusBreakdown(params),
        cuttingMasterApi.getTailorPerformance(),
        cuttingMasterApi.getAvailableTailors(),
        cuttingMasterApi.getWorkQueue({ status: queueStatus, search: queueSearch }),
        cuttingMasterApi.getTodaySummary(),
        cuttingMasterApi.getHighPriorityWorks()
      ]);

      // Update states with real data
      if (statsResponse?.success) {
        setStats(statsResponse.data);
      }

      if (workStatusResponse?.success) {
        setWorkStatus(workStatusResponse.data);
      }

      if (tailorResponse?.success) {
        setTailorPerformance(tailorResponse.data);
      }

      if (availableResponse?.success) {
        setAvailableTailors(availableResponse.data.summary);
      }

      if (queueResponse?.success) {
        setCuttingQueue(queueResponse.data.queue);
      }

      if (todayResponse?.success) {
        setTodaySummary(todayResponse.data);
      }

      if (priorityResponse?.success) {
        setHighPriorityWorks(priorityResponse.data);
      }

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Handle date filter change
  const handleDateRangeChange = async (range) => {
    setSelectedFilter(range);
    setLoading(true);
    
    const today = new Date();
    let startDate = today.toISOString().split("T")[0];
    let endDate = today.toISOString().split("T")[0];

    if (range === "week") {
      const weekAgo = new Date(today);
      weekAgo.setDate(today.getDate() - 7);
      startDate = weekAgo.toISOString().split("T")[0];
    } else if (range === "month") {
      const monthAgo = new Date(today);
      monthAgo.setMonth(today.getMonth() - 1);
      startDate = monthAgo.toISOString().split("T")[0];
    }

    setDateRange({ range, startDate, endDate });
    
    // Fetch data with new date range
    await fetchDashboardData();
  };

  // Handle queue search
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (!loading) {
        fetchDashboardData();
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [queueSearch, queueStatus]);

  // Handle status update
  const handleStatusUpdate = async (workId, newStatus) => {
    try {
      const response = await cuttingMasterApi.updateWorkStatus(workId, {
        status: newStatus,
        notes: `Status updated to ${newStatus}`
      });

      if (response?.success) {
        toast.success(`Work status updated to ${newStatus}`);
        fetchDashboardData(); // Refresh data
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      accepted: "bg-blue-100 text-blue-800",
      "cutting-started": "bg-purple-100 text-purple-800",
      "cutting-completed": "bg-green-100 text-green-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const badges = {
      pending: "⏳ Pending",
      accepted: "✅ Accepted",
      "cutting-started": "✂️ Cutting Started",
      "cutting-completed": "✔️ Cutting Completed",
    };
    return badges[status] || status;
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded w-64 mb-6"></div>
          <div className="bg-white rounded-xl p-4 mb-6">
            <div className="h-10 bg-gray-200 rounded w-full"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-xl p-6">
                <div className="h-4 bg-gray-200 rounded w-24 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-16"></div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2 bg-white rounded-xl p-6 h-64"></div>
            <div className="bg-white rounded-xl p-6 h-64"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
              <Scissors className="w-8 h-8 text-blue-600" />
              Cutting Master Dashboard
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Welcome back, {JSON.parse(localStorage.getItem('user'))?.name || 'User'}! 👋
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={fetchDashboardData}
              disabled={refreshing}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Row 1: Date Filter */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Date Range:</span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {[
                { label: "Today", value: "today" },
                { label: "Week", value: "week" },
                { label: "Month", value: "month" },
                { label: "Custom", value: "custom" },
              ].map((range) => (
                <button
                  key={range.value}
                  onClick={() => handleDateRangeChange(range.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    selectedFilter === range.value
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>

            {selectedFilter === "custom" && (
              <div className="flex items-center gap-2 ml-auto">
                <input
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                  className="px-3 py-2 border rounded-lg text-sm"
                />
                <span className="text-gray-500">to</span>
                <input
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                  className="px-3 py-2 border rounded-lg text-sm"
                />
              </div>
            )}
          </div>
        </div>

        {/* Row 2: KPI Boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Total Work</p>
                <p className="text-2xl font-bold text-gray-800 mt-2">{stats.totalWork}</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <ClipboardList className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Assigned Work</p>
                <p className="text-2xl font-bold text-gray-800 mt-2">{stats.assignedWork}</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <UserCheck className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">My Assigned</p>
                <p className="text-2xl font-bold text-gray-800 mt-2">{stats.myAssignedWork}</p>
              </div>
              <div className="bg-orange-50 p-3 rounded-lg">
                <Award className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Completed</p>
                <p className="text-2xl font-bold text-gray-800 mt-2">{stats.completedWork}</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Row 3: Available Tailors */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Available Tailors
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Tailors</p>
                  <p className="text-2xl font-bold text-gray-800">{availableTailors.total}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600">Available</p>
                  <p className="text-2xl font-bold text-green-700">{availableTailors.available}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <UserCheck className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-red-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-red-600">On Leave</p>
                  <p className="text-2xl font-bold text-red-700">{availableTailors.onLeave}</p>
                </div>
                <div className="bg-red-100 p-3 rounded-lg">
                  <UserX className="w-5 h-5 text-red-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Availability Rate</span>
              <span className="font-medium text-gray-800">
                {Math.round((availableTailors.available / (availableTailors.total || 1)) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: `${(availableTailors.available / (availableTailors.total || 1)) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Row 4: Work Status + Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Work Status Overview */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <PieChartIcon className="w-5 h-5 text-blue-600" />
              Work Status Overview
            </h2>

            <div className="space-y-3">
              {workStatus.map((item, index) => (
                <div key={item.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">{item.name}</span>
                    <span className="font-medium text-gray-800">{item.value} orders</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="h-2.5 rounded-full"
                      style={{
                        width: `${(item.value / Math.max(...workStatus.map(i => i.value), 1)) * 100}%`,
                        backgroundColor: [
                          "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4",
                          "#FFE194", "#B19CD9", "#FFB347", "#A8E6CF"
                        ][index % 8]
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 🔥 FIXED: Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Quick Actions
            </h2>

            <div className="grid grid-cols-2 gap-3">
              {[
                { title: "View Works", icon: Eye, color: "bg-blue-600", path: "/cuttingmaster/works" },
                { title: "View Tailors", icon: Users, color: "bg-green-600", path: "/cuttingmaster/tailors" },
                { title: "Update Status", icon: RefreshCw, color: "bg-orange-600", action: fetchDashboardData },
                { title: "Cutting Queue", icon: Scissors, color: "bg-red-600", path: "/cuttingmaster/works?status=accepted" },
              ].map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.title}
                    onClick={() => {
                      if (action.action) {
                        action.action(); // Call the function (like refresh)
                      } else if (action.path) {
                        navigate(action.path); // Navigate to the path
                      }
                    }}
                    className={`${action.color} text-white rounded-lg p-4 transition transform hover:scale-105 hover:shadow-lg`}
                  >
                    <Icon className="w-6 h-6 mb-2 mx-auto" />
                    <span className="text-xs font-medium block text-center">{action.title}</span>
                  </button>
                );
              })}
            </div>

            {/* Today's Summary */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500 mb-2">Today's Progress</p>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Cutting Completed</span>
                    <span className="font-medium">{todaySummary.completed}/{todaySummary.total}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="bg-green-500 h-1.5 rounded-full" 
                      style={{ width: `${todaySummary.progress}%` }} 
                    />
                  </div>
                </div>

                {/* High Priority Summary */}
                {highPriorityWorks.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs font-medium text-red-600 mb-1">
                      🔴 {highPriorityWorks.length} High Priority
                    </p>
                    <div className="space-y-1">
                      {highPriorityWorks.slice(0, 2).map(work => (
                        <div key={work.id} className="text-xs text-gray-600">
                          {work.customer} - {work.dress}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Row 5: Tailor Performance + Cutting Queue */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tailor Performance */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Tailor Performance
            </h2>

            <div className="space-y-4">
              {tailorPerformance.slice(0, 5).map((tailor, index) => (
                <div
                  key={tailor.id || tailor.name}
                  className="bg-gradient-to-r from-gray-50 to-white rounded-lg p-4 border border-gray-100 hover:shadow-md transition"
                >
                  <div className="flex items-center gap-3 mb-3">
                    {index === 0 && <span className="text-2xl">🥇</span>}
                    {index === 1 && <span className="text-2xl">🥈</span>}
                    {index === 2 && <span className="text-2xl">🥉</span>}
                    {index > 2 && (
                      <span className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-bold text-gray-600">
                        #{index + 1}
                      </span>
                    )}
                    <span className="font-semibold text-gray-800">{tailor.name}</span>
                    {tailor.efficiency >= 80 && (
                      <Award className="w-4 h-4 text-yellow-500" />
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <p className="text-gray-500">Assigned</p>
                      <p className="font-bold text-gray-800">{tailor.assigned}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Completed</p>
                      <p className="font-bold text-green-600">{tailor.completed}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">In Progress</p>
                      <p className="font-bold text-blue-600">{tailor.inProgress}</p>
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-500">Efficiency</span>
                      <span className="font-medium text-gray-700">{tailor.efficiency}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-green-500 h-1.5 rounded-full"
                        style={{ width: `${tailor.efficiency}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cutting Master Work Queue */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Scissors className="w-5 h-5 text-blue-600" />
              Cutting Master Work Queue
              <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                {cuttingQueue.length} pending
              </span>
            </h2>

            {/* Search and Filter */}
            <div className="mb-4 space-y-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={queueSearch}
                  onChange={(e) => setQueueSearch(e.target.value)}
                  placeholder="Search orders..."
                  className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <select
                value={queueStatus}
                onChange={(e) => setQueueStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="cutting-started">Cutting Started</option>
                <option value="cutting-completed">Cutting Completed</option>
              </select>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {cuttingQueue.map((order) => (
                <div
                  key={order.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-800">#{order.workId || order.orderId}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {getStatusBadge(order.status)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-1 text-gray-600">
                      <User className="w-4 h-4" />
                      <span>{order.customer}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>{order.dress}</span>
                    </div>
                  </div>

                  <div className="mt-2 flex items-center gap-1 text-xs text-gray-500">
                    <Calendar className="w-3 h-3" />
                    <span>Expected: {order.expectedDate ? new Date(order.expectedDate).toLocaleDateString('en-IN') : 'N/A'}</span>
                  </div>

                  {/* Action Buttons for Status Update */}
                  <div className="mt-3 flex gap-2">
                    {order.status === 'pending' && (
                      <button
                        onClick={() => handleStatusUpdate(order.id, 'accepted')}
                        className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                      >
                        Accept
                      </button>
                    )}
                    {order.status === 'accepted' && (
                      <button
                        onClick={() => handleStatusUpdate(order.id, 'cutting-started')}
                        className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200"
                      >
                        Start Cutting
                      </button>
                    )}
                    {order.status === 'cutting-started' && (
                      <button
                        onClick={() => handleStatusUpdate(order.id, 'cutting-completed')}
                        className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
                      >
                        Complete Cutting
                      </button>
                    )}
                  </div>

                  {/* Priority Indicator */}
                  {order.priority === "high" && (
                    <div className="mt-2">
                      <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                        🔴 High Priority
                      </span>
                    </div>
                  )}
                </div>
              ))}

              {cuttingQueue.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No orders in queue
                </div>
              )}
            </div>

            {/* 🔥 FIXED: View All Button */}
            <button 
              onClick={() => navigate('/cuttingmaster/works')}
              className="mt-4 w-full py-2 text-sm text-blue-600 hover:text-blue-700 font-medium border border-blue-200 rounded-lg hover:bg-blue-50 transition"
            >
              View All Orders →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CuttingMasterDashboard;