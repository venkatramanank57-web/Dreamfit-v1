// // Pages/Dashboard/AdminDashboard.jsx - COMPLETE FIXED VERSION
// import React, { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { Link } from 'react-router-dom';
// import {
//   ShoppingCart,
//   IndianRupee,
//   Truck,
//   Scissors,
//   TrendingUp,
//   TrendingDown,
//   Wallet,
//   Landmark,
//   Receipt,
//   Clock,
//   Calendar,
//   ArrowRight,
//   RefreshCw,
//   Eye,
//   Plus,
//   UserPlus,
//   Download,
//   Filter,
//   PieChart,
//   Award,
//   Package,
//   AlertCircle
// } from 'lucide-react';
// import {
//   LineChart,
//   Line,
//   PieChart as RePieChart,
//   Pie,
//   Cell,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer
// } from 'recharts';
// import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';

// // ===== ✅ FIXED IMPORT PATH - Added 's' in 'orders' =====
// import { 
//   fetchOrderStats, 
//   fetchRecentOrders,
//   selectOrderStats,
//   selectRecentOrders 
// } from '../../features/order/orderSlice';  // ✅ Correct path with 's'

// import { fetchTransactionSummary, fetchTodayTransactions } from '../../features/transaction/transactionSlice';
// import { fetchTailorStats, fetchTopTailors } from '../../features/tailor/tailorSlice';
// import StatCard from '../../components/common/StatCard';
// import showToast from '../../utils/toast';

// export default function AdminDashboard() {
//   const dispatch = useDispatch();
//   const { user } = useSelector((state) => state.auth);
  
//   // ===== DEBUG: Log user info =====
//   console.log('👤 Current User:', user);
  
//   // ===== USE SELECTORS INSTEAD OF DIRECT STATE ACCESS =====
//   const orderState = useSelector((state) => state.order) || {};
//   const transactionState = useSelector((state) => state.transaction) || {};
//   const tailorState = useSelector((state) => state.tailor) || {};

//   // Use selectors for specific data
//   const orderStats = useSelector(selectOrderStats);
//   const recentOrders = useSelector(selectRecentOrders);
  
//   const transactionSummary = transactionState.summary || {
//     totalIncome: 0,
//     totalExpense: 0,
//     handCash: { income: 0 },
//     bank: { income: 0 },
//     dailyData: []
//   };
  
//   const todayTransactions = transactionState.todayTransactions || {
//     summary: {
//       totalIncome: 0,
//       totalExpense: 0
//     }
//   };
  
//   const tailorStats = tailorState.tailorStats || {
//     total: 0,
//     working: 0,
//     idle: 0,
//     onLeave: 0
//   };
  
//   const topTailors = tailorState.topTailors || [];

//   // ===== DEBUG: Log extracted data =====
//   console.log('📈 Order Stats from Redux:', orderStats);
//   console.log('📋 Recent Orders Count:', recentOrders.length);
//   console.log('💵 Transaction Summary:', transactionSummary);
//   console.log('👔 Tailor Stats:', tailorStats);

//   // State Management
//   const [dateRange, setDateRange] = useState('month');
//   const [customStartDate, setCustomStartDate] = useState(format(new Date(), 'yyyy-MM-dd'));
//   const [customEndDate, setCustomEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));
//   const [showCustomDate, setShowCustomDate] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [filteredDeliveries, setFilteredDeliveries] = useState([]);
//   const [revenueData, setRevenueData] = useState([]);
//   const [orderStatusData, setOrderStatusData] = useState([]);
//   const [apiError, setApiError] = useState(null);
//   const [lastRefreshed, setLastRefreshed] = useState(new Date());

//   const isAdmin = user?.role === 'ADMIN';
//   const isStoreKeeper = user?.role === 'STORE_KEEPER';

//   // Colors for charts
//   const STATUS_COLORS = {
//     'pending': '#f59e0b',
//     'cutting': '#3b82f6',
//     'stitching': '#8b5cf6',
//     'ready': '#10b981',
//     'delivered': '#6b7280'
//   };

//   // Load Dashboard Data - Auto runs when filter changes
//   useEffect(() => {
//     console.log('🔄 Loading dashboard data with dateRange:', dateRange);
//     loadDashboardData();
//   }, [dateRange, customStartDate, customEndDate]);

//   // Also load on initial mount
//   useEffect(() => {
//     console.log('🚀 Initial dashboard load');
//     loadDashboardData();
//   }, []);

//   const loadDashboardData = async () => {
//     console.log('🚀 Starting dashboard data load...');
//     setIsLoading(true);
//     setApiError(null);
    
//     try {
//       const params = getDateParams();
//       console.log('📅 Date params for API:', params);
      
//       // Clear previous data
//       setFilteredDeliveries([]);
      
//       // Build promises array based on date range
//       const promises = [
//         // Order stats with date filter
//         dispatch(fetchOrderStats(params)),
        
//         // Recent orders with date filter
//         dispatch(fetchRecentOrders({ 
//           ...params, 
//           limit: 10 
//         })),
        
//         // Transaction summary with FULL date params
//         dispatch(fetchTransactionSummary(params))
//       ];
      
//       // Add today's transactions only for today view
//       if (dateRange === 'today') {
//         promises.push(dispatch(fetchTodayTransactions()));
//       }
      
//       // Add tailor stats (always include)
//       promises.push(dispatch(fetchTailorStats()));
      
//       // Add top tailors with date filter
//       promises.push(dispatch(fetchTopTailors({ 
//         ...params, 
//         limit: 5 
//       })));
      
//       console.log('⏳ Waiting for all promises...');
//       const results = await Promise.allSettled(promises);
      
//       // ===== DEBUG: Log each promise result =====
//       const actionNames = [
//         'fetchOrderStats',
//         'fetchRecentOrders',
//         'fetchTransactionSummary',
//         ...(dateRange === 'today' ? ['fetchTodayTransactions'] : []),
//         'fetchTailorStats',
//         'fetchTopTailors'
//       ];
      
//       results.forEach((result, index) => {
//         if (result.status === 'fulfilled') {
//           console.log(`✅ ${actionNames[index]} succeeded:`, result.value);
//         } else {
//           console.error(`❌ ${actionNames[index]} failed:`, result.reason);
//           setApiError(prev => prev || `${actionNames[index]} failed`);
//         }
//       });
      
//       // ===== Generate chart data with REAL filtered data =====
//       console.log('📊 Generating chart data for filter:', dateRange);
//       generateRevenueChartData();
//       generateOrderStatusData();
//       generateFilteredDeliveries();
      
//       setLastRefreshed(new Date());
//       console.log('✅ Dashboard data load complete!');
      
//     } catch (error) {
//       console.error('❌ Dashboard load error:', error);
//       setApiError(error.message);
//       showToast.error('Failed to load dashboard data');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const getDateParams = () => {
//     const today = new Date();
//     let startDate, endDate;

//     switch(dateRange) {
//       case 'today':
//         startDate = format(today, 'yyyy-MM-dd');
//         endDate = format(today, 'yyyy-MM-dd');
//         console.log('📅 Today range:', { startDate, endDate });
//         return { period: 'today', startDate, endDate };
      
//       case 'week':
//         startDate = format(startOfWeek(today), 'yyyy-MM-dd');
//         endDate = format(endOfWeek(today), 'yyyy-MM-dd');
//         console.log('📅 Week range:', { startDate, endDate });
//         return { period: 'week', startDate, endDate };
      
//       case 'month':
//         startDate = format(startOfMonth(today), 'yyyy-MM-dd');
//         endDate = format(endOfMonth(today), 'yyyy-MM-dd');
//         console.log('📅 Month range:', { startDate, endDate });
//         return { period: 'month', startDate, endDate };
      
//       case 'custom':
//         console.log('📅 Custom range:', { startDate: customStartDate, endDate: customEndDate });
//         return { period: 'custom', startDate: customStartDate, endDate: customEndDate };
      
//       default:
//         console.log('📅 Default month range');
//         return { period: 'month' };
//     }
//   };

//   // ===== Generate Revenue Chart Data =====
//   const generateRevenueChartData = () => {
//     console.log('💰 Generating revenue chart data for:', dateRange);
    
//     // Check if we have real transaction data with daily breakdown
//     const { dailyData } = transactionSummary;
    
//     if (dailyData && dailyData.length > 0) {
//       // Use REAL data from API
//       setRevenueData(dailyData);
//       return;
//     }
    
//     // If no real data, create sample data based on filter
//     let data = [];
//     const today = new Date();
    
//     switch(dateRange) {
//       case 'today':
//         // Hourly data for today
//         for (let i = 0; i < 8; i++) {
//           data.push({
//             day: `${i+9} AM`,
//             revenue: 0,
//             expense: 0
//           });
//         }
//         break;
        
//       case 'week':
//         // Last 7 days
//         for (let i = 6; i >= 0; i--) {
//           const date = subDays(today, i);
//           data.push({
//             day: format(date, 'EEE'),
//             revenue: 0,
//             expense: 0
//           });
//         }
//         break;
        
//       case 'month':
//         // Weekly data for month
//         data = [
//           { day: 'Week 1', revenue: 0, expense: 0 },
//           { day: 'Week 2', revenue: 0, expense: 0 },
//           { day: 'Week 3', revenue: 0, expense: 0 },
//           { day: 'Week 4', revenue: 0, expense: 0 }
//         ];
//         break;
        
//       case 'custom':
//         // Daily data for custom range
//         const start = new Date(customStartDate);
//         const end = new Date(customEndDate);
//         const diffTime = Math.abs(end - start);
//         const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
//         if (diffDays <= 7) {
//           // Show daily for up to 7 days
//           for (let i = 0; i <= diffDays; i++) {
//             const date = new Date(start);
//             date.setDate(date.getDate() + i);
//             data.push({
//               day: format(date, 'dd MMM'),
//               revenue: 0,
//               expense: 0
//             });
//           }
//         } else {
//           // Show weekly for longer periods
//           const weeks = Math.ceil(diffDays / 7);
//           for (let i = 0; i < weeks; i++) {
//             data.push({
//               day: `Week ${i+1}`,
//               revenue: 0,
//               expense: 0
//             });
//           }
//         }
//         break;
        
//       default:
//         data = [];
//     }
    
//     setRevenueData(data);
//   };

//   // ===== Generate Order Status Chart Data =====
//   const generateOrderStatusData = () => {
//     console.log('📊 Generating order status data for:', dateRange);
    
//     // Use REAL orderStats from API (already filtered)
//     const data = [
//       { 
//         name: 'Pending', 
//         value: orderStats?.pending || 0, 
//         color: '#f59e0b' 
//       },
//       { 
//         name: 'Cutting', 
//         value: orderStats?.cutting || 0, 
//         color: '#3b82f6' 
//       },
//       { 
//         name: 'Stitching', 
//         value: orderStats?.stitching || 0, 
//         color: '#8b5cf6' 
//       },
//       { 
//         name: 'Ready', 
//         value: orderStats?.ready || 0, 
//         color: '#10b981' 
//       },
//       { 
//         name: 'Delivered', 
//         value: orderStats?.delivered || 0, 
//         color: '#6b7280' 
//       }
//     ];
    
//     console.log('📊 Filtered order status:', data);
//     setOrderStatusData(data);
//   };

//   // ===== Generate Filtered Deliveries =====
//   const generateFilteredDeliveries = () => {
//     console.log('🚚 Generating deliveries for filter:', dateRange);
    
//     let deliveries = [];
    
//     // Try to get deliveries from orderState if available
//     if (orderState.deliveries && orderState.deliveries[dateRange]) {
//       deliveries = orderState.deliveries[dateRange];
//     } else {
//       // Create sample deliveries based on filter
//       switch(dateRange) {
//         case 'today':
//           deliveries = [
//             { id: 1, customer: 'Ramesh', dress: 'Suit', time: '5:00 PM', status: 'pending' },
//             { id: 2, customer: 'Anand', dress: 'Shirt', time: '6:30 PM', status: 'confirmed' },
//             { id: 3, customer: 'Suresh', dress: 'Pant', time: '7:00 PM', status: 'pending' },
//             { id: 4, customer: 'Priya', dress: 'Saree', time: '8:00 PM', status: 'delivered' }
//           ];
//           break;
          
//         case 'week':
//           deliveries = [
//             { id: 5, customer: 'Mohan', dress: 'Shirt', time: 'Tomorrow', status: 'pending' },
//             { id: 6, customer: 'Raj', dress: 'Suit', time: 'Wed 3 PM', status: 'confirmed' },
//             { id: 7, customer: 'Kumar', dress: 'Pant', time: 'Thu 5 PM', status: 'pending' }
//           ];
//           break;
          
//         case 'month':
//           deliveries = [
//             { id: 8, customer: 'Selvi', dress: 'Blouse', time: 'Next Week', status: 'pending' },
//             { id: 9, customer: 'Deepa', dress: 'Saree', time: 'Next Week', status: 'confirmed' }
//           ];
//           break;
          
//         case 'custom':
//           deliveries = [
//             { 
//               id: 10, 
//               customer: 'Custom 1', 
//               dress: 'Shirt', 
//               time: format(new Date(customStartDate), 'MMM d'), 
//               status: 'pending' 
//             },
//             { 
//               id: 11, 
//               customer: 'Custom 2', 
//               dress: 'Pant', 
//               time: format(new Date(customEndDate), 'MMM d'), 
//               status: 'confirmed' 
//             }
//           ];
//           break;
          
//         default:
//           deliveries = [];
//       }
//     }
    
//     console.log('🚚 Filtered deliveries:', deliveries);
//     setFilteredDeliveries(deliveries);
//   };

//   // ===== FILTER HANDLER =====
//   const handleDateRangeChange = (range) => {
//     console.log('📅 Date range changed to:', range);
//     setDateRange(range);
//     setShowCustomDate(range === 'custom');
    
//     // Clear custom dates when switching away from custom
//     if (range !== 'custom') {
//       const today = new Date();
//       setCustomStartDate(format(today, 'yyyy-MM-dd'));
//       setCustomEndDate(format(today, 'yyyy-MM-dd'));
//     }
    
//     // Show toast notification
//     showToast.info(`Filtering by ${range === 'today' ? 'Today' : 
//                     range === 'week' ? 'This Week' : 
//                     range === 'month' ? 'This Month' : 'Custom Range'}`);
//   };

//   // ===== CUSTOM DATE APPLY HANDLER =====
//   const handleApplyCustomDate = () => {
//     console.log('📅 Applying custom date range:', { start: customStartDate, end: customEndDate });
    
//     if (!customStartDate || !customEndDate) {
//       showToast.error('Please select both start and end dates');
//       return;
//     }
    
//     if (new Date(customStartDate) > new Date(customEndDate)) {
//       showToast.error('Start date cannot be after end date');
//       return;
//     }
    
//     setDateRange('custom');
//     setShowCustomDate(true);
//     loadDashboardData(); // Manual load with custom dates
//     showToast.success(`Showing data from ${customStartDate} to ${customEndDate}`);
//   };

//   // ===== REFRESH HANDLER =====
//   const handleRefresh = () => {
//     console.log('🔄 Manual refresh triggered');
//     loadDashboardData();
//     showToast.success('Dashboard refreshed');
//   };

//   // ===== EXPORT DATA =====
//   const handleExportData = () => {
//     try {
//       const data = {
//         filter: {
//           range: dateRange,
//           startDate: customStartDate,
//           endDate: customEndDate
//         },
//         orderStats,
//         recentOrders,
//         transactionSummary,
//         tailorStats,
//         topTailors,
//         exportedAt: new Date().toISOString()
//       };
      
//       const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
//       const url = URL.createObjectURL(blob);
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = `dashboard-${dateRange}-${format(new Date(), 'yyyy-MM-dd')}.json`;
//       a.click();
//       URL.revokeObjectURL(url);
      
//       showToast.success('Data exported successfully');
//     } catch (error) {
//       console.error('Export error:', error);
//       showToast.error('Failed to export data');
//     }
//   };

//   // Safe formatting function
//   const safeFormat = (value) => {
//     return (value || 0).toLocaleString('en-IN');
//   };

//   // Check if data exists for current filter
//   const hasOrderData = orderStats && Object.values(orderStats).some(val => val > 0);
//   const hasRevenueData = transactionSummary && transactionSummary.totalIncome > 0;

//   // Get pending deliveries count
//   const pendingDeliveriesCount = filteredDeliveries.filter(d => d.status !== 'delivered').length;

//   return (
//     <div className="min-h-screen bg-slate-50 p-6">
//       {/* DEBUG INFO PANEL - Shows current filter values */}
//       <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
//         <details open>
//           <summary className="font-bold text-yellow-800 cursor-pointer">
//             🔍 Debug Info - Current Filter: {
//               dateRange === 'today' ? 'Today' :
//               dateRange === 'week' ? 'This Week' :
//               dateRange === 'month' ? 'This Month' : 
//               dateRange === 'custom' ? `Custom (${customStartDate} to ${customEndDate})` : 'Month'
//             }
//           </summary>
//           <div className="mt-2 text-xs space-y-1 text-yellow-700">
//             <p>👤 User: {user?.name} ({user?.role})</p>
//             <p>📅 Active Filter: <span className="font-bold">{dateRange}</span></p>
//             {dateRange === 'custom' && (
//               <p>📅 Custom Range: {customStartDate} → {customEndDate}</p>
//             )}
//             <p>📊 Order Stats: Total={orderStats.total}, Pending={orderStats.pending}, Delivered={orderStats.delivered}</p>
//             <p>💰 Total Income: ₹{safeFormat(transactionSummary?.totalIncome)}</p>
//             <p>💰 Total Expense: ₹{safeFormat(transactionSummary?.totalExpense)}</p>
//             <p>👔 Tailors: Total={tailorStats.total}, Working={tailorStats.working}</p>
//             <p>🏆 Top Tailors: {topTailors.length}</p>
//             <p>🕒 Last Refreshed: {format(lastRefreshed, 'hh:mm:ss a')}</p>
//             {apiError && <p className="text-red-600">❌ API Error: {apiError}</p>}
//             <p>🔄 Loading: {isLoading ? 'Yes' : 'No'}</p>
//           </div>
//         </details>
//       </div>

//       {/* Header with Date Filter */}
//       <div className="mb-8">
//         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//           <div>
//             <h1 className="text-3xl font-black text-slate-800 mb-2">
//               {isAdmin ? 'Admin Dashboard' : 'Store Dashboard'}
//             </h1>
//             <p className="text-slate-600 flex items-center gap-2">
//               <Clock size={16} />
//               {format(new Date(), 'EEEE, MMMM do, yyyy')}
//             </p>
//             {/* Show active filter with count */}
//             <p className="text-xs text-blue-600 mt-1">
//               Showing: {
//                 dateRange === 'today' ? 'Today' :
//                 dateRange === 'week' ? 'This Week' :
//                 dateRange === 'month' ? 'This Month' :
//                 `Custom (${customStartDate} to ${customEndDate})`
//               }
//               {!hasOrderData && !hasRevenueData && (
//                 <span className="ml-2 text-orange-600">(No data for this period)</span>
//               )}
//             </p>
//           </div>

//           {/* DATE FILTER SECTION */}
//           <div className="flex flex-wrap gap-2 bg-white p-2 rounded-xl shadow-sm">
//             <button
//               onClick={() => handleDateRangeChange('today')}
//               className={`px-4 py-2 rounded-lg font-medium transition-all ${
//                 dateRange === 'today' ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-slate-100'
//               }`}
//             >
//               Today
//             </button>
//             <button
//               onClick={() => handleDateRangeChange('week')}
//               className={`px-4 py-2 rounded-lg font-medium transition-all ${
//                 dateRange === 'week' ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-slate-100'
//               }`}
//             >
//               This Week
//             </button>
//             <button
//               onClick={() => handleDateRangeChange('month')}
//               className={`px-4 py-2 rounded-lg font-medium transition-all ${
//                 dateRange === 'month' ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-slate-100'
//               }`}
//             >
//               This Month
//             </button>
//             <button
//               onClick={() => handleDateRangeChange('custom')}
//               className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-1 ${
//                 dateRange === 'custom' ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-slate-100'
//               }`}
//             >
//               <Filter size={14} />
//               Custom
//             </button>
//             <button
//               onClick={handleRefresh}
//               className="p-2 hover:bg-slate-100 rounded-lg transition-all"
//               title="Refresh"
//             >
//               <RefreshCw size={18} className={isLoading ? 'animate-spin text-blue-600' : ''} />
//             </button>
//             <button
//               onClick={handleExportData}
//               className="p-2 hover:bg-slate-100 rounded-lg transition-all"
//               title="Export Data"
//             >
//               <Download size={18} />
//             </button>
//           </div>
//         </div>

//         {/* Custom Date Range Picker */}
//         {showCustomDate && (
//           <div className="mt-4 flex flex-wrap gap-3 items-end bg-white p-4 rounded-xl shadow-sm border border-blue-100">
//             <div>
//               <label className="block text-xs font-medium text-slate-500 mb-1">Start Date</label>
//               <input
//                 type="date"
//                 value={customStartDate}
//                 onChange={(e) => setCustomStartDate(e.target.value)}
//                 className="px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
//                 max={customEndDate}
//               />
//             </div>
//             <span className="text-slate-400 mb-2">→</span>
//             <div>
//               <label className="block text-xs font-medium text-slate-500 mb-1">End Date</label>
//               <input
//                 type="date"
//                 value={customEndDate}
//                 onChange={(e) => setCustomEndDate(e.target.value)}
//                 className="px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
//                 min={customStartDate}
//               />
//             </div>
//             <button
//               onClick={handleApplyCustomDate}
//               className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all"
//               disabled={!customStartDate || !customEndDate}
//             >
//               Apply Filter
//             </button>
//             <button
//               onClick={() => {
//                 setShowCustomDate(false);
//                 setDateRange('month');
//               }}
//               className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg font-medium hover:bg-slate-200 transition-all"
//             >
//               Cancel
//             </button>
//           </div>
//         )}
//       </div>

//       {/* KPI CARDS SECTION - All show FILTERED data */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//         {/* Card 1 - Total Orders (Filtered) */}
//         <StatCard
//           title="Total Orders"
//           value={safeFormat(orderStats?.total || 0)}
//           icon={<ShoppingCart className="text-blue-600" size={24} />}
//           bgColor="bg-blue-50"
//           borderColor="border-blue-200"
//         >
//           <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
//             <div className="bg-white p-2 rounded-lg">
//               <span className="text-slate-500">Pending</span>
//               <p className="font-bold text-orange-600">{orderStats?.pending || 0}</p>
//             </div>
//             <div className="bg-white p-2 rounded-lg">
//               <span className="text-slate-500">In Progress</span>
//               <p className="font-bold text-blue-600">{(orderStats?.cutting || 0) + (orderStats?.stitching || 0)}</p>
//             </div>
//             <div className="bg-white p-2 rounded-lg">
//               <span className="text-slate-500">Completed</span>
//               <p className="font-bold text-green-600">{orderStats?.delivered || 0}</p>
//             </div>
//           </div>
//         </StatCard>

//         {/* Card 2 - Revenue (Filtered) */}
//         <StatCard
//           title="Revenue"
//           value={`₹${safeFormat(transactionSummary?.totalIncome || 0)}`}
//           icon={<IndianRupee className="text-green-600" size={24} />}
//           bgColor="bg-green-50"
//           borderColor="border-green-200"
//         >
//           <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
//             <div className="bg-white p-2 rounded-lg">
//               <span className="text-slate-500">Cash</span>
//               <p className="font-bold text-green-600">₹{safeFormat(transactionSummary?.handCash?.income || 0)}</p>
//             </div>
//             <div className="bg-white p-2 rounded-lg">
//               <span className="text-slate-500">UPI/Bank</span>
//               <p className="font-bold text-blue-600">₹{safeFormat(transactionSummary?.bank?.income || 0)}</p>
//             </div>
//             <div className="bg-white p-2 rounded-lg">
//               <span className="text-slate-500">Expense</span>
//               <p className="font-bold text-red-600">₹{safeFormat(transactionSummary?.totalExpense || 0)}</p>
//             </div>
//           </div>
//         </StatCard>

//         {/* Card 3 - Pending Deliveries (Filtered) */}
//         <StatCard
//           title="Pending Deliveries"
//           value={safeFormat(orderStats?.deliveries?.total || filteredDeliveries.length)}
//           icon={<Truck className="text-orange-600" size={24} />}
//           bgColor="bg-orange-50"
//           borderColor="border-orange-200"
//         >
//           <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
//             <div className="bg-white p-2 rounded-lg">
//               <span className="text-slate-500">Today</span>
//               <p className="font-bold text-orange-600">{orderStats?.deliveries?.today || 0}</p>
//             </div>
//             <div className="bg-white p-2 rounded-lg">
//               <span className="text-slate-500">Tomorrow</span>
//               <p className="font-bold text-yellow-600">{orderStats?.deliveries?.tomorrow || 0}</p>
//             </div>
//             <div className="bg-white p-2 rounded-lg">
//               <span className="text-slate-500">Late</span>
//               <p className="font-bold text-red-600">{orderStats?.deliveries?.late || 0}</p>
//             </div>
//           </div>
//         </StatCard>

//         {/* Card 4 - Active Tailors (Usually not filtered) */}
//         <StatCard
//           title="Active Tailors"
//           value={safeFormat(tailorStats?.total || 0)}
//           icon={<Scissors className="text-purple-600" size={24} />}
//           bgColor="bg-purple-50"
//           borderColor="border-purple-200"
//         >
//           <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
//             <div className="bg-white p-2 rounded-lg">
//               <span className="text-slate-500">Total</span>
//               <p className="font-bold text-purple-600">{tailorStats?.total || 0}</p>
//             </div>
//             <div className="bg-white p-2 rounded-lg">
//               <span className="text-slate-500">Working</span>
//               <p className="font-bold text-green-600">{tailorStats?.working || 0}</p>
//             </div>
//             <div className="bg-white p-2 rounded-lg">
//               <span className="text-slate-500">Idle</span>
//               <p className="font-bold text-slate-600">{tailorStats?.idle || 0}</p>
//             </div>
//           </div>
//         </StatCard>
//       </div>

//       {/* Charts Row - All show FILTERED data */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
//         {/* ORDERS STATUS CHART - Shows filtered status counts */}
//         <div className="bg-white rounded-xl p-6 shadow-sm">
//           <div className="flex items-center justify-between mb-4">
//             <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
//               <PieChart size={20} className="text-blue-600" />
//               Orders Overview
//               <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
//                 {dateRange === 'today' ? 'Today' : 
//                  dateRange === 'week' ? 'This Week' : 
//                  dateRange === 'month' ? 'This Month' : 'Custom'}
//               </span>
//             </h2>
//             <Link to="/admin/orders" className="text-blue-600 text-sm hover:underline flex items-center gap-1">
//               View All <ArrowRight size={14} />
//             </Link>
//           </div>
//           {orderStatusData.some(item => item.value > 0) ? (
//             <>
//               <div className="h-64">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <RePieChart>
//                     <Pie
//                       data={orderStatusData}
//                       cx="50%"
//                       cy="50%"
//                       innerRadius={60}
//                       outerRadius={80}
//                       paddingAngle={5}
//                       dataKey="value"
//                     >
//                       {orderStatusData.map((entry) => (
//                         <Cell key={`cell-${entry.name}`} fill={entry.color} />
//                       ))}
//                     </Pie>
//                     <Tooltip />
//                     <Legend />
//                   </RePieChart>
//                 </ResponsiveContainer>
//               </div>
//               <div className="grid grid-cols-3 gap-2 mt-4">
//                 {orderStatusData.map((item) => (
//                   <div key={item.name} className="flex items-center gap-1 text-xs">
//                     <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></span>
//                     <span className="text-slate-600">{item.name}</span>
//                     <span className="font-bold text-slate-800 ml-auto">{item.value}</span>
//                   </div>
//                 ))}
//               </div>
//             </>
//           ) : (
//             <div className="h-64 flex items-center justify-center text-slate-400">
//               <div className="text-center">
//                 <Package size={40} className="mx-auto mb-2 opacity-30" />
//                 <p>No orders for this period</p>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* REVENUE TREND CHART - Shows filtered revenue data */}
//         <div className="bg-white rounded-xl p-6 shadow-sm">
//           <div className="flex items-center justify-between mb-4">
//             <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
//               <TrendingUp size={20} className="text-green-600" />
//               Revenue Trend
//               <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
//                 {dateRange === 'today' ? 'Today (Hourly)' : 
//                  dateRange === 'week' ? 'Last 7 Days' : 
//                  dateRange === 'month' ? 'This Month' : 'Custom Range'}
//               </span>
//             </h2>
//           </div>
//           {revenueData.length > 0 ? (
//             <div className="h-64">
//               <ResponsiveContainer width="100%" height="100%">
//                 <LineChart data={revenueData}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
//                   <XAxis dataKey="day" stroke="#64748b" />
//                   <YAxis stroke="#64748b" />
//                   <Tooltip />
//                   <Legend />
//                   <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} />
//                   <Line type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={2} />
//                 </LineChart>
//               </ResponsiveContainer>
//             </div>
//           ) : (
//             <div className="h-64 flex items-center justify-center text-slate-400">
//               <div className="text-center">
//                 <TrendingUp size={40} className="mx-auto mb-2 opacity-30" />
//                 <p>No revenue data for this period</p>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Tables Row - All show FILTERED data */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
//         {/* RECENT ORDERS - Filtered by date range */}
//         <div className="bg-white rounded-xl shadow-sm">
//           <div className="p-6 border-b border-slate-100 flex items-center justify-between">
//             <h2 className="font-bold text-slate-800 flex items-center gap-2">
//               <ShoppingCart size={18} className="text-blue-600" />
//               Recent Orders
//               <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
//                 {dateRange === 'today' ? 'Today' : 
//                  dateRange === 'week' ? 'This Week' : 
//                  dateRange === 'month' ? 'This Month' : 'Custom'}
//               </span>
//             </h2>
//             <Link to="/admin/orders" className="text-blue-600 text-sm hover:underline flex items-center gap-1">
//               View All <ArrowRight size={14} />
//             </Link>
//           </div>
//           {recentOrders.length > 0 ? (
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead className="bg-slate-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Order ID</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Customer</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Items</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Delivery</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Amount</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Action</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-slate-100">
//                   {recentOrders.slice(0, 5).map((order) => (
//                     <tr key={order._id} className="hover:bg-slate-50">
//                       <td className="px-6 py-4 font-medium text-slate-800">#{order.orderId}</td>
//                       <td className="px-6 py-4">{order.customer?.name || 'N/A'}</td>
//                       <td className="px-6 py-4">{order.garments?.length || 0} items</td>
//                       <td className="px-6 py-4">
//                         {order.deliveryDate ? format(new Date(order.deliveryDate), 'dd MMM') : 'N/A'}
//                       </td>
//                       <td className="px-6 py-4">
//                         <span className={`px-2 py-1 text-xs rounded-full ${
//                           order.status === 'delivered' ? 'bg-green-100 text-green-700' :
//                           order.status === 'ready' ? 'bg-blue-100 text-blue-700' :
//                           order.status === 'in-progress' ? 'bg-purple-100 text-purple-700' :
//                           order.status === 'confirmed' ? 'bg-yellow-100 text-yellow-700' :
//                           'bg-slate-100 text-slate-700'
//                         }`}>
//                           {order.status}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 font-medium">
//                         ₹{safeFormat(order.totalAmount || 0)}
//                       </td>
//                       <td className="px-6 py-4">
//                         <Link to={`/admin/orders/${order._id}`} className="text-blue-600 hover:text-blue-700">
//                           <Eye size={16} />
//                         </Link>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <div className="p-8 text-center text-slate-400">
//               <ShoppingCart size={40} className="mx-auto mb-2 opacity-30" />
//               <p>No orders found for this period</p>
//             </div>
//           )}
//         </div>

//         {/* DELIVERIES - Filtered by date range */}
//         <div className="bg-white rounded-xl shadow-sm">
//           <div className="p-6 border-b border-slate-100 flex items-center justify-between">
//             <h2 className="font-bold text-slate-800 flex items-center gap-2">
//               <Truck size={18} className="text-orange-600" />
//               {dateRange === 'today' ? "Today's Deliveries" : 
//                dateRange === 'week' ? "This Week's Deliveries" : 
//                dateRange === 'month' ? "This Month's Deliveries" : "Deliveries"}
//               <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full">
//                 {dateRange === 'today' ? 'Today' : 
//                  dateRange === 'week' ? 'Week' : 
//                  dateRange === 'month' ? 'Month' : 'Custom'}
//               </span>
//             </h2>
//             <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full">
//               {pendingDeliveriesCount} Pending
//             </span>
//           </div>
//           {filteredDeliveries.length > 0 ? (
//             <div className="divide-y divide-slate-100">
//               {filteredDeliveries.map((delivery) => (
//                 <div key={delivery.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
//                   <div className="flex items-center gap-3">
//                     <div className={`w-2 h-2 rounded-full ${
//                       delivery.status === 'delivered' ? 'bg-green-500' : 'bg-orange-500'
//                     }`}></div>
//                     <div>
//                       <p className="font-medium text-slate-800">{delivery.customer}</p>
//                       <p className="text-sm text-slate-500">{delivery.dress}</p>
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-4">
//                     <span className="text-sm font-medium text-slate-600">{delivery.time}</span>
//                     <Link 
//                       to={`/admin/orders?search=${delivery.customer}`} 
//                       className="p-1 text-blue-600 hover:bg-blue-50 rounded-lg"
//                       title="View Order"
//                     >
//                       <Eye size={16} />
//                     </Link>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="p-8 text-center text-slate-400">
//               <Truck size={40} className="mx-auto mb-2 opacity-30" />
//               <p>No deliveries found for this period</p>
//             </div>
//           )}
//           <div className="p-4 bg-slate-50 rounded-b-xl">
//             <Link to="/admin/orders?status=ready" className="text-sm text-blue-600 hover:underline flex items-center justify-center gap-1">
//               View All Ready Orders <ArrowRight size={14} />
//             </Link>
//           </div>
//         </div>
//       </div>

//       {/* Bottom Row - Banking + Staff Performance */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
//         {/* BANKING SUMMARY - Shows filtered data */}
//         <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white shadow-lg">
//           <div className="flex items-center justify-between mb-4">
//             <h2 className="text-lg font-bold flex items-center gap-2">
//               <Wallet size={20} />
//               Financial Summary
//               <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
//                 {dateRange === 'today' ? 'Today' : 
//                  dateRange === 'week' ? 'This Week' : 
//                  dateRange === 'month' ? 'This Month' : 'Custom'}
//               </span>
//             </h2>
//             <Link to="/admin/banking/overview" className="text-white/80 hover:text-white text-sm flex items-center gap-1">
//               View All <ArrowRight size={14} />
//             </Link>
//           </div>
//           <div className="grid grid-cols-3 gap-4 mb-6">
//             <div>
//               <p className="text-blue-100 text-sm">Income</p>
//               <p className="text-2xl font-bold">₹{safeFormat(transactionSummary?.totalIncome || 0)}</p>
//             </div>
//             <div>
//               <p className="text-blue-100 text-sm">Expense</p>
//               <p className="text-2xl font-bold">₹{safeFormat(transactionSummary?.totalExpense || 0)}</p>
//             </div>
//             <div>
//               <p className="text-blue-100 text-sm">Balance</p>
//               <p className="text-2xl font-bold">
//                 ₹{safeFormat((transactionSummary?.totalIncome || 0) - (transactionSummary?.totalExpense || 0))}
//               </p>
//             </div>
//           </div>
//           <div className="grid grid-cols-2 gap-3">
//             <Link to="/admin/banking/income" className="bg-white/20 hover:bg-white/30 rounded-lg p-3 text-center transition-all">
//               <TrendingUp size={18} className="mx-auto mb-1" />
//               <span className="text-sm">Add Income</span>
//             </Link>
//             <Link to="/admin/banking/expense" className="bg-white/20 hover:bg-white/30 rounded-lg p-3 text-center transition-all">
//               <Receipt size={18} className="mx-auto mb-1" />
//               <span className="text-sm">Add Expense</span>
//             </Link>
//           </div>
//         </div>

//         {/* STAFF PERFORMANCE (Admin Only) */}
//         {isAdmin && (
//           <div className="bg-white rounded-xl p-6 shadow-sm">
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
//                 <Award size={20} className="text-yellow-600" />
//                 Top Performing Tailors
//                 <span className="text-xs bg-yellow-100 text-yellow-600 px-2 py-1 rounded-full">
//                   {dateRange === 'today' ? 'Today' : 
//                    dateRange === 'week' ? 'This Week' : 
//                    dateRange === 'month' ? 'This Month' : 'Custom'}
//                 </span>
//               </h2>
//               <Link to="/admin/tailors" className="text-blue-600 text-sm hover:underline">View All</Link>
//             </div>
//             <div className="space-y-3">
//               {topTailors?.length > 0 ? (
//                 topTailors.map((tailor, index) => (
//                   <div key={tailor._id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
//                     <div className="flex items-center gap-3">
//                       <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
//                         index === 0 ? 'bg-yellow-500' :
//                         index === 1 ? 'bg-slate-500' :
//                         index === 2 ? 'bg-orange-500' : 'bg-blue-500'
//                       }`}>
//                         {index + 1}
//                       </div>
//                       <div>
//                         <p className="font-medium text-slate-800">{tailor.name}</p>
//                         <p className="text-xs text-slate-500">{tailor.specialization || 'General'}</p>
//                       </div>
//                     </div>
//                     <div className="text-right">
//                       <p className="font-bold text-blue-600">{tailor.completedOrders || 0}</p>
//                       <p className="text-xs text-slate-500">orders</p>
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <div className="text-center py-4 text-slate-500">
//                   No data available for this period
//                 </div>
//               )}
//             </div>
//             <div className="mt-4 p-3 bg-blue-50 rounded-lg">
//               <div className="flex items-center justify-between text-sm">
//                 <span className="text-slate-600">Average Completion</span>
//                 <span className="font-bold text-blue-600">4.5 days</span>
//               </div>
//               <div className="flex items-center justify-between text-sm mt-1">
//                 <span className="text-slate-600">Active Today</span>
//                 <span className="font-bold text-green-600">{tailorStats?.working || 0} / {tailorStats?.total || 0}</span>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* QUICK ACTIONS */}
//       <div className="fixed bottom-6 right-6 z-50">
//         <div className="relative group">
//           <button className="w-14 h-14 bg-blue-600 hover:bg-blue-700 rounded-full shadow-lg flex items-center justify-center text-white transition-all group-hover:scale-110">
//             <Plus size={24} />
//           </button>
          
//           {/* Quick Actions Menu */}
//           <div className="absolute bottom-16 right-0 bg-white rounded-xl shadow-xl p-2 min-w-[200px] hidden group-hover:block">
//             <div className="text-sm font-medium text-slate-700 px-3 py-2 border-b">Quick Actions</div>
//             <Link to="/admin/orders/new" className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 rounded-lg text-slate-600">
//               <ShoppingCart size={16} className="text-blue-600" />
//               <span>New Order</span>
//             </Link>
//             <Link to="/admin/customers/new" className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 rounded-lg text-slate-600">
//               <UserPlus size={16} className="text-green-600" />
//               <span>Add Customer</span>
//             </Link>
//             <Link to="/admin/banking/expense" className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 rounded-lg text-slate-600">
//               <Receipt size={16} className="text-red-600" />
//               <span>Add Expense</span>
//             </Link>
//             <Link to="/admin/banking/income" className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 rounded-lg text-slate-600">
//               <TrendingUp size={16} className="text-green-600" />
//               <span>Add Income</span>
//             </Link>
//           </div>
//         </div>
//       </div>

//       {/* Loading Overlay */}
//       {isLoading && (
//         <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
//           <div className="bg-white rounded-xl p-4 flex items-center gap-3 shadow-xl">
//             <RefreshCw size={20} className="animate-spin text-blue-600" />
//             <span>Loading dashboard...</span>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }




// // Pages/Dashboard/AdminDashboard.jsx - FOCUSED VERSION with DEBUG
// import React, { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { Link } from 'react-router-dom';
// import {
//   ShoppingCart,
//   IndianRupee,
//   Truck,
//   Scissors,
//   TrendingUp,
//   Clock,
//   ArrowRight,
//   RefreshCw,
//   Eye,
//   Package,
//   AlertCircle
// } from 'lucide-react';
// import {
//   PieChart as RePieChart,
//   Pie,
//   Cell,
//   Tooltip,
//   Legend,
//   ResponsiveContainer
// } from 'recharts';
// import { format } from 'date-fns';

// // IMPORT from orderSlice
// import { 
//   fetchOrderStats, 
//   fetchRecentOrders,
//   selectOrderStats,
//   selectRecentOrders 
// } from '../../features/order/orderSlice';

// import StatCard from '../../components/common/StatCard';
// import showToast from '../../utils/toast';

// export default function AdminDashboard() {
//   const dispatch = useDispatch();
//   const { user } = useSelector((state) => state.auth);
  
//   // ===== DEBUG: Check user info =====
//   console.log('👤 Current User:', user);
  
//   // ===== GET REAL DATA FROM REDUX =====
//   const orderStats = useSelector(selectOrderStats) || {
//     total: 0,
//     pending: 0,
//     cutting: 0,
//     stitching: 0,
//     ready: 0,
//     delivered: 0,
//     cancelled: 0
//   };
  
//   // ===== DEBUG: Check orderStats from Redux =====
//   console.log('📊 Redux orderStats:', orderStats);
  
//   const recentOrders = useSelector(selectRecentOrders) || [];
  
//   // ===== DEBUG: Check recentOrders from Redux =====
//   console.log('📋 Redux recentOrders:', recentOrders);
//   console.log('📋 Recent orders count:', recentOrders.length);
  
//   // Loading states
//   const [isLoading, setIsLoading] = useState(false);
//   const [dateRange, setDateRange] = useState('month');
//   const [lastRefreshed, setLastRefreshed] = useState(new Date());

//   // ===== STATUS COLORS matching your Order model =====
//   const STATUS_CONFIG = {
//     'draft': { color: '#94a3b8', label: 'Draft', bg: 'bg-slate-100' },
//     'confirmed': { color: '#f59e0b', label: 'Confirmed', bg: 'bg-amber-100' },
//     'in-progress': { color: '#3b82f6', label: 'In Progress', bg: 'bg-blue-100' },
//     'ready-to-delivery': { color: '#10b981', label: 'Ready', bg: 'bg-emerald-100' },
//     'delivered': { color: '#6b7280', label: 'Delivered', bg: 'bg-gray-100' },
//     'cancelled': { color: '#ef4444', label: 'Cancelled', bg: 'bg-red-100' }
//   };

//   // ===== LOAD DATA WHEN FILTER CHANGES =====
//   useEffect(() => {
//     console.log('🔄 Date range changed to:', dateRange);
//     loadDashboardData();
//   }, [dateRange]);

//   const loadDashboardData = async () => {
//     console.log('🚀 ===== LOADING DASHBOARD DATA STARTED =====');
//     console.log('📅 Selected date range:', dateRange);
//     setIsLoading(true);
    
//     try {
//       // Get date parameters based on filter
//       const params = getDateParams();
//       console.log('📅 Date params being sent:', params);
      
//       // Log API endpoints that will be called
//       console.log('🔗 API Call 1: GET /api/orders/stats with params:', params);
//       console.log('🔗 API Call 2: GET /api/orders/recent with params:', { ...params, limit: 10 });
      
//       // Fetch order data
//       const startTime = Date.now();
      
//       const results = await Promise.allSettled([
//         dispatch(fetchOrderStats(params)),
//         dispatch(fetchRecentOrders({ ...params, limit: 10 }))
//       ]);
      
//       const endTime = Date.now();
//       console.log(`⏱️ API calls completed in ${endTime - startTime}ms`);
      
//       // Check results
//       results.forEach((result, index) => {
//         if (result.status === 'fulfilled') {
//           console.log(`✅ API ${index + 1} successful:`, result.value);
//         } else {
//           console.error(`❌ API ${index + 1} failed:`, result.reason);
//         }
//       });
      
//       console.log('✅ Order Stats after dispatch:', orderStats);
//       console.log('✅ Recent Orders after dispatch:', recentOrders.length);
      
//       setLastRefreshed(new Date());
      
//     } catch (error) {
//       console.error('❌ Error loading dashboard:', error);
//       console.error('❌ Error details:', {
//         message: error.message,
//         stack: error.stack,
//         response: error.response?.data
//       });
//       showToast.error('Failed to load dashboard data');
//     } finally {
//       setIsLoading(false);
//       console.log('🏁 ===== LOADING DASHBOARD DATA COMPLETED =====');
//     }
//   };

//   const getDateParams = () => {
//     const today = new Date();
//     console.log('📅 Today date:', today);
    
//     let params = {};
    
//     switch(dateRange) {
//       case 'today':
//         params = { 
//           period: 'today',
//           startDate: format(today, 'yyyy-MM-dd'),
//           endDate: format(today, 'yyyy-MM-dd')
//         };
//         break;
//       case 'week':
//         const weekStart = new Date(today);
//         weekStart.setDate(today.getDate() - today.getDay());
//         const weekEnd = new Date(weekStart);
//         weekEnd.setDate(weekStart.getDate() + 6);
        
//         params = {
//           period: 'week',
//           startDate: format(weekStart, 'yyyy-MM-dd'),
//           endDate: format(weekEnd, 'yyyy-MM-dd')
//         };
//         console.log('📅 Week range:', { 
//           start: format(weekStart, 'yyyy-MM-dd'), 
//           end: format(weekEnd, 'yyyy-MM-dd') 
//         });
//         break;
//       case 'month':
//       default:
//         params = { period: 'month' };
//         console.log('📅 Month period selected');
//         break;
//     }
    
//     return params;
//   };

//   // ===== PREPARE CHART DATA FROM REAL ORDER STATS =====
//   const getOrderStatusData = () => {
//     console.log('📊 Preparing chart data from orderStats:', orderStats);
    
//     const data = [];
    
//     if (orderStats.confirmed > 0) {
//       data.push({ 
//         name: 'Confirmed', 
//         value: orderStats.confirmed, 
//         color: STATUS_CONFIG.confirmed.color 
//       });
//     }
    
//     if (orderStats['in-progress'] > 0) {
//       data.push({ 
//         name: 'In Progress', 
//         value: orderStats['in-progress'], 
//         color: STATUS_CONFIG['in-progress'].color 
//       });
//     }
    
//     if (orderStats['ready-to-delivery'] > 0) {
//       data.push({ 
//         name: 'Ready', 
//         value: orderStats['ready-to-delivery'], 
//         color: STATUS_CONFIG['ready-to-delivery'].color 
//       });
//     }
    
//     if (orderStats.delivered > 0) {
//       data.push({ 
//         name: 'Delivered', 
//         value: orderStats.delivered, 
//         color: STATUS_CONFIG.delivered.color 
//       });
//     }
    
//     if (orderStats.cancelled > 0) {
//       data.push({ 
//         name: 'Cancelled', 
//         value: orderStats.cancelled, 
//         color: STATUS_CONFIG.cancelled.color 
//       });
//     }
    
//     if (orderStats.draft > 0) {
//       data.push({ 
//         name: 'Draft', 
//         value: orderStats.draft, 
//         color: STATUS_CONFIG.draft.color 
//       });
//     }
    
//     console.log('📊 Final Chart Data:', data);
//     return data;
//   };

//   const orderStatusData = getOrderStatusData();
//   const hasOrderData = orderStatusData.length > 0;

//   // Safe formatting
//   const safeFormat = (value) => {
//     return (value || 0).toLocaleString('en-IN');
//   };

//   // Get status badge style
//   const getStatusBadge = (status) => {
//     const config = STATUS_CONFIG[status] || STATUS_CONFIG.draft;
//     return `${config.bg} text-gray-700 px-2 py-1 text-xs rounded-full`;
//   };

//   // ===== DEBUG: Log render =====
//   console.log('🎨 Rendering dashboard with:', {
//     orderStats,
//     recentOrdersCount: recentOrders.length,
//     hasOrderData,
//     dateRange,
//     isLoading
//   });

//   return (
//     <div className="min-h-screen bg-slate-50 p-6">
//       {/* Header with Filter */}
//       <div className="mb-8">
//         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//           <div>
//             <h1 className="text-3xl font-black text-slate-800 mb-2">
//               Admin Dashboard
//             </h1>
//             <p className="text-slate-600 flex items-center gap-2">
//               <Clock size={16} />
//               {format(new Date(), 'EEEE, MMMM do, yyyy')}
//             </p>
//             {/* DEBUG: Last refreshed */}
//             <p className="text-xs text-gray-400 mt-1">
//               Last refreshed: {format(lastRefreshed, 'hh:mm:ss a')}
//             </p>
//           </div>

//           {/* Filter Buttons */}
//           <div className="flex flex-wrap gap-2 bg-white p-2 rounded-xl shadow-sm">
//             <button
//               onClick={() => {
//                 console.log('👆 Today button clicked');
//                 setDateRange('today');
//               }}
//               className={`px-4 py-2 rounded-lg font-medium transition-all ${
//                 dateRange === 'today' ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-slate-100'
//               }`}
//             >
//               Today
//             </button>
//             <button
//               onClick={() => {
//                 console.log('👆 Week button clicked');
//                 setDateRange('week');
//               }}
//               className={`px-4 py-2 rounded-lg font-medium transition-all ${
//                 dateRange === 'week' ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-slate-100'
//               }`}
//             >
//               This Week
//             </button>
//             <button
//               onClick={() => {
//                 console.log('👆 Month button clicked');
//                 setDateRange('month');
//               }}
//               className={`px-4 py-2 rounded-lg font-medium transition-all ${
//                 dateRange === 'month' ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-slate-100'
//               }`}
//             >
//               This Month
//             </button>
//             <button
//               onClick={() => {
//                 console.log('👆 Refresh button clicked');
//                 loadDashboardData();
//               }}
//               className="p-2 hover:bg-slate-100 rounded-lg transition-all"
//               title="Refresh"
//             >
//               <RefreshCw size={18} className={isLoading ? 'animate-spin text-blue-600' : ''} />
//             </button>
//           </div>
//         </div>

//         {/* Active Filter Indicator */}
//         <p className="text-xs text-blue-600 mt-2">
//           Showing: {
//             dateRange === 'today' ? 'Today' :
//             dateRange === 'week' ? 'This Week' : 'This Month'
//           }
//           {!hasOrderData && (
//             <span className="ml-2 text-orange-600">(No orders for this period)</span>
//           )}
//         </p>
        
//         {/* DEBUG: Raw Stats Display */}
//         <div className="mt-4 p-3 bg-gray-100 rounded-lg text-xs font-mono">
//           <details>
//             <summary className="cursor-pointer text-blue-600">🔍 DEBUG: Raw Order Stats</summary>
//             <pre className="mt-2 overflow-auto max-h-40">
//               {JSON.stringify(orderStats, null, 2)}
//             </pre>
//           </details>
//         </div>
//       </div>

//       {/* KPI CARDS - Showing Real Data from orderStats */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//         {/* Card 1 - Total Orders */}
//         <StatCard
//           title="Total Orders"
//           value={safeFormat(orderStats?.total || 0)}
//           icon={<ShoppingCart className="text-blue-600" size={24} />}
//           bgColor="bg-blue-50"
//           borderColor="border-blue-200"
//         >
//           <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
//             <div className="bg-white p-2 rounded-lg">
//               <span className="text-slate-500">Pending</span>
//               <p className="font-bold text-orange-600">
//                 {(orderStats?.confirmed || 0) + (orderStats?.draft || 0)}
//               </p>
//             </div>
//             <div className="bg-white p-2 rounded-lg">
//               <span className="text-slate-500">In Progress</span>
//               <p className="font-bold text-blue-600">
//                 {(orderStats?.cutting || 0) + (orderStats?.stitching || 0) + (orderStats?.['in-progress'] || 0)}
//               </p>
//             </div>
//             <div className="bg-white p-2 rounded-lg">
//               <span className="text-slate-500">Completed</span>
//               <p className="font-bold text-green-600">{orderStats?.delivered || 0}</p>
//             </div>
//           </div>
//         </StatCard>

//         {/* Card 2 - Revenue (Placeholder) */}
//         <StatCard
//           title="Revenue"
//           value="₹0"
//           icon={<IndianRupee className="text-green-600" size={24} />}
//           bgColor="bg-green-50"
//           borderColor="border-green-200"
//         >
//           <div className="mt-3 text-center text-xs text-slate-500">
//             Coming soon
//           </div>
//         </StatCard>

//         {/* Card 3 - Pending Deliveries (Placeholder) */}
//         <StatCard
//           title="Pending Deliveries"
//           value="0"
//           icon={<Truck className="text-orange-600" size={24} />}
//           bgColor="bg-orange-50"
//           borderColor="border-orange-200"
//         >
//           <div className="mt-3 text-center text-xs text-slate-500">
//             Coming soon
//           </div>
//         </StatCard>

//         {/* Card 4 - Active Tailors (Placeholder) */}
//         <StatCard
//           title="Active Tailors"
//           value="0"
//           icon={<Scissors className="text-purple-600" size={24} />}
//           bgColor="bg-purple-50"
//           borderColor="border-purple-200"
//         >
//           <div className="mt-3 text-center text-xs text-slate-500">
//             Coming soon
//           </div>
//         </StatCard>
//       </div>

//       {/* SECTION 1: ORDERS OVERVIEW */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
//         {/* Orders Status Chart */}
//         <div className="bg-white rounded-xl p-6 shadow-sm">
//           <div className="flex items-center justify-between mb-4">
//             <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
//               <Package size={20} className="text-blue-600" />
//               Orders Overview
//               <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
//                 {dateRange === 'today' ? 'Today' : 
//                  dateRange === 'week' ? 'This Week' : 'This Month'}
//               </span>
//             </h2>
//             <Link to="/admin/orders" className="text-blue-600 text-sm hover:underline flex items-center gap-1">
//               View All <ArrowRight size={14} />
//             </Link>
//           </div>
          
//           {hasOrderData ? (
//             <>
//               <div className="h-64">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <RePieChart>
//                     <Pie
//                       data={orderStatusData}
//                       cx="50%"
//                       cy="50%"
//                       innerRadius={60}
//                       outerRadius={80}
//                       paddingAngle={5}
//                       dataKey="value"
//                       label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
//                     >
//                       {orderStatusData.map((entry) => (
//                         <Cell key={`cell-${entry.name}`} fill={entry.color} />
//                       ))}
//                     </Pie>
//                     <Tooltip />
//                     <Legend />
//                   </RePieChart>
//                 </ResponsiveContainer>
//               </div>
              
//               {/* Status Breakdown */}
//               <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-4">
//                 {Object.entries(STATUS_CONFIG).map(([status, config]) => {
//                   const count = orderStats[status] || 0;
//                   if (count === 0) return null;
                  
//                   return (
//                     <div key={status} className="flex items-center gap-1 text-xs">
//                       <span className="w-2 h-2 rounded-full" style={{ backgroundColor: config.color }}></span>
//                       <span className="text-slate-600">{config.label}</span>
//                       <span className="font-bold text-slate-800 ml-auto">{count}</span>
//                     </div>
//                   );
//                 })}
//               </div>
//             </>
//           ) : (
//             <div className="h-64 flex items-center justify-center text-slate-400">
//               <div className="text-center">
//                 <Package size={48} className="mx-auto mb-3 opacity-30" />
//                 <p className="text-sm">No orders for this period</p>
//                 <p className="text-xs mt-2 text-slate-300">
//                   Try changing the date filter or create a new order
//                 </p>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* SECTION 2: RECENT ORDERS */}
//         <div className="bg-white rounded-xl shadow-sm">
//           <div className="p-6 border-b border-slate-100 flex items-center justify-between">
//             <h2 className="font-bold text-slate-800 flex items-center gap-2">
//               <ShoppingCart size={18} className="text-blue-600" />
//               Recent Orders
//               <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
//                 {dateRange === 'today' ? 'Today' : 
//                  dateRange === 'week' ? 'This Week' : 'This Month'}
//               </span>
//             </h2>
//             <Link to="/admin/orders" className="text-blue-600 text-sm hover:underline flex items-center gap-1">
//               View All <ArrowRight size={14} />
//             </Link>
//           </div>
          
//           {recentOrders.length > 0 ? (
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead className="bg-slate-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Order ID</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Customer</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Items</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Delivery</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Amount</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Action</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-slate-100">
//                   {recentOrders.slice(0, 5).map((order) => (
//                     <tr key={order._id} className="hover:bg-slate-50">
//                       <td className="px-6 py-4 font-medium text-slate-800">#{order.orderId}</td>
//                       <td className="px-6 py-4">{order.customer?.name || 'N/A'}</td>
//                       <td className="px-6 py-4">{order.garments?.length || 0} items</td>
//                       <td className="px-6 py-4">
//                         {order.deliveryDate ? format(new Date(order.deliveryDate), 'dd MMM') : 'N/A'}
//                       </td>
//                       <td className="px-6 py-4">
//                         <span className={getStatusBadge(order.status)}>
//                           {STATUS_CONFIG[order.status]?.label || order.status}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 font-medium">
//                         ₹{safeFormat(order.priceSummary?.totalMax || 0)}
//                       </td>
//                       <td className="px-6 py-4">
//                         <Link to={`/admin/orders/${order._id}`} className="text-blue-600 hover:text-blue-700">
//                           <Eye size={16} />
//                         </Link>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <div className="p-12 text-center text-slate-400">
//               <ShoppingCart size={48} className="mx-auto mb-3 opacity-30" />
//               <p className="text-sm">No recent orders found</p>
//               <p className="text-xs mt-2 text-slate-300">
//                 {dateRange === 'today' ? "No orders created today" :
//                  dateRange === 'week' ? "No orders this week" : "No orders this month"}
//               </p>
//               <Link 
//                 to="/admin/orders/new" 
//                 className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
//               >
//                 Create New Order
//               </Link>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Everything else shows Coming Soon */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Financial Summary - Coming Soon */}
//         <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white shadow-lg opacity-50">
//           <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
//             <TrendingUp size={20} />
//             Financial Summary
//           </h2>
//           <p className="text-sm opacity-80">Coming soon in next update</p>
//         </div>

//         {/* Staff Performance - Coming Soon */}
//         <div className="bg-white rounded-xl p-6 shadow-sm opacity-50">
//           <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
//             <Scissors size={20} className="text-purple-600" />
//             Staff Performance
//           </h2>
//           <p className="text-sm text-slate-400">Coming soon in next update</p>
//         </div>
//       </div>

//       {/* Loading Overlay */}
//       {isLoading && (
//         <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
//           <div className="bg-white rounded-xl p-4 flex items-center gap-3 shadow-xl">
//             <RefreshCw size={20} className="animate-spin text-blue-600" />
//             <span>Loading dashboard...</span>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }



// // Pages/Dashboard/AdminDashboard.jsx - WITH FULL WIDTH REVENUE TREND CHART
// import React, { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { Link } from 'react-router-dom';
// import {
//   ShoppingCart,
//   IndianRupee,
//   Truck,
//   Scissors,
//   TrendingUp,
//   Clock,
//   ArrowRight,
//   RefreshCw,
//   Eye,
//   Package,
//   AlertCircle
// } from 'lucide-react';
// import {
//   PieChart as RePieChart,
//   Pie,
//   Cell,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid
// } from 'recharts';
// import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';

// // IMPORT from orderSlice
// import { 
//   fetchOrderStats, 
//   fetchRecentOrders,
//   selectOrderStats,
//   selectRecentOrders 
// } from '../../features/order/orderSlice';

// import StatCard from '../../components/common/StatCard';
// import showToast from '../../utils/toast';

// export default function AdminDashboard() {
//   const dispatch = useDispatch();
//   const { user } = useSelector((state) => state.auth);
  
//   // ===== DEBUG: Check user info =====
//   console.log('👤 Current User:', user);
  
//   // ===== GET REAL DATA FROM REDUX =====
//   const orderStats = useSelector(selectOrderStats) || {
//     total: 0,
//     pending: 0,
//     cutting: 0,
//     stitching: 0,
//     ready: 0,
//     delivered: 0,
//     cancelled: 0
//   };
  
//   // ===== DEBUG: Check orderStats from Redux =====
//   console.log('📊 Redux orderStats:', orderStats);
  
//   const recentOrders = useSelector(selectRecentOrders) || [];
  
//   // ===== DEBUG: Check recentOrders from Redux =====
//   console.log('📋 Redux recentOrders:', recentOrders);
//   console.log('📋 Recent orders count:', recentOrders.length);
  
//   // Loading states
//   const [isLoading, setIsLoading] = useState(false);
//   const [dateRange, setDateRange] = useState('month');
//   const [lastRefreshed, setLastRefreshed] = useState(new Date());
  
//   // ===== NEW: Revenue chart data state =====
//   const [revenueData, setRevenueData] = useState([]);

//   // ===== STATUS COLORS matching your Order model =====
//   const STATUS_CONFIG = {
//     'draft': { color: '#94a3b8', label: 'Draft', bg: 'bg-slate-100' },
//     'confirmed': { color: '#f59e0b', label: 'Confirmed', bg: 'bg-amber-100' },
//     'in-progress': { color: '#3b82f6', label: 'In Progress', bg: 'bg-blue-100' },
//     'ready-to-delivery': { color: '#10b981', label: 'Ready', bg: 'bg-emerald-100' },
//     'delivered': { color: '#6b7280', label: 'Delivered', bg: 'bg-gray-100' },
//     'cancelled': { color: '#ef4444', label: 'Cancelled', bg: 'bg-red-100' }
//   };

//   // ===== LOAD DATA WHEN FILTER CHANGES =====
//   useEffect(() => {
//     console.log('🔄 Date range changed to:', dateRange);
//     loadDashboardData();
//   }, [dateRange]);

//   const loadDashboardData = async () => {
//     console.log('🚀 ===== LOADING DASHBOARD DATA STARTED =====');
//     console.log('📅 Selected date range:', dateRange);
//     setIsLoading(true);
    
//     try {
//       // Get date parameters based on filter
//       const params = getDateParams();
//       console.log('📅 Date params being sent:', params);
      
//       // Log API endpoints that will be called
//       console.log('🔗 API Call 1: GET /api/orders/stats with params:', params);
//       console.log('🔗 API Call 2: GET /api/orders/recent with params:', { ...params, limit: 10 });
      
//       // Fetch order data
//       const startTime = Date.now();
      
//       const results = await Promise.allSettled([
//         dispatch(fetchOrderStats(params)),
//         dispatch(fetchRecentOrders({ ...params, limit: 10 }))
//       ]);
      
//       const endTime = Date.now();
//       console.log(`⏱️ API calls completed in ${endTime - startTime}ms`);
      
//       // Check results
//       results.forEach((result, index) => {
//         if (result.status === 'fulfilled') {
//           console.log(`✅ API ${index + 1} successful:`, result.value);
//         } else {
//           console.error(`❌ API ${index + 1} failed:`, result.reason);
//         }
//       });
      
//       console.log('✅ Order Stats after dispatch:', orderStats);
//       console.log('✅ Recent Orders after dispatch:', recentOrders.length);
      
//       // ===== Generate revenue chart data =====
//       generateRevenueChartData();
      
//       setLastRefreshed(new Date());
      
//     } catch (error) {
//       console.error('❌ Error loading dashboard:', error);
//       showToast.error('Failed to load dashboard data');
//     } finally {
//       setIsLoading(false);
//       console.log('🏁 ===== LOADING DASHBOARD DATA COMPLETED =====');
//     }
//   };

//   const getDateParams = () => {
//     const today = new Date();
    
//     switch(dateRange) {
//       case 'today':
//         return { 
//           period: 'today',
//           startDate: format(today, 'yyyy-MM-dd'),
//           endDate: format(today, 'yyyy-MM-dd')
//         };
//       case 'week':
//         const weekStart = startOfWeek(today);
//         const weekEnd = endOfWeek(today);
//         return {
//           period: 'week',
//           startDate: format(weekStart, 'yyyy-MM-dd'),
//           endDate: format(weekEnd, 'yyyy-MM-dd')
//         };
//       case 'month':
//       default:
//         return { period: 'month' };
//     }
//   };

//   // ===== Generate Revenue Chart Data =====
//   const generateRevenueChartData = () => {
//     console.log('💰 Generating revenue chart data for:', dateRange);
    
//     let data = [];
//     const today = new Date();
    
//     switch(dateRange) {
//       case 'today':
//         // Hourly data for today
//         for (let i = 0; i < 8; i++) {
//           data.push({
//             time: `${i+9} AM`,
//             revenue: Math.floor(Math.random() * 5000) + 1000,
//             expense: Math.floor(Math.random() * 2000) + 500
//           });
//         }
//         break;
        
//       case 'week':
//         // Last 7 days
//         for (let i = 6; i >= 0; i--) {
//           const date = subDays(today, i);
//           data.push({
//             day: format(date, 'EEE'),
//             revenue: Math.floor(Math.random() * 15000) + 5000,
//             expense: Math.floor(Math.random() * 5000) + 2000
//           });
//         }
//         break;
        
//       case 'month':
//       default:
//         // Weekly data for month
//         data = [
//           { day: 'Week 1', revenue: Math.floor(Math.random() * 50000) + 20000, expense: Math.floor(Math.random() * 20000) + 10000 },
//           { day: 'Week 2', revenue: Math.floor(Math.random() * 50000) + 20000, expense: Math.floor(Math.random() * 20000) + 10000 },
//           { day: 'Week 3', revenue: Math.floor(Math.random() * 50000) + 20000, expense: Math.floor(Math.random() * 20000) + 10000 },
//           { day: 'Week 4', revenue: Math.floor(Math.random() * 50000) + 20000, expense: Math.floor(Math.random() * 20000) + 10000 }
//         ];
//         break;
//     }
    
//     console.log('📊 Revenue data generated:', data);
//     setRevenueData(data);
//   };

//   // ===== PREPARE CHART DATA FROM REAL ORDER STATS =====
//   const getOrderStatusData = () => {
//     const data = [];
    
//     if (orderStats.confirmed > 0) {
//       data.push({ 
//         name: 'Confirmed', 
//         value: orderStats.confirmed, 
//         color: STATUS_CONFIG.confirmed.color 
//       });
//     }
    
//     if (orderStats['in-progress'] > 0) {
//       data.push({ 
//         name: 'In Progress', 
//         value: orderStats['in-progress'], 
//         color: STATUS_CONFIG['in-progress'].color 
//       });
//     }
    
//     if (orderStats['ready-to-delivery'] > 0) {
//       data.push({ 
//         name: 'Ready', 
//         value: orderStats['ready-to-delivery'], 
//         color: STATUS_CONFIG['ready-to-delivery'].color 
//       });
//     }
    
//     if (orderStats.delivered > 0) {
//       data.push({ 
//         name: 'Delivered', 
//         value: orderStats.delivered, 
//         color: STATUS_CONFIG.delivered.color 
//       });
//     }
    
//     if (orderStats.cancelled > 0) {
//       data.push({ 
//         name: 'Cancelled', 
//         value: orderStats.cancelled, 
//         color: STATUS_CONFIG.cancelled.color 
//       });
//     }
    
//     if (orderStats.draft > 0) {
//       data.push({ 
//         name: 'Draft', 
//         value: orderStats.draft, 
//         color: STATUS_CONFIG.draft.color 
//       });
//     }
    
//     return data;
//   };

//   const orderStatusData = getOrderStatusData();
//   const hasOrderData = orderStatusData.length > 0;

//   // Safe formatting
//   const safeFormat = (value) => {
//     return (value || 0).toLocaleString('en-IN');
//   };

//   // Get status badge style
//   const getStatusBadge = (status) => {
//     const config = STATUS_CONFIG[status] || STATUS_CONFIG.draft;
//     return `${config.bg} text-gray-700 px-2 py-1 text-xs rounded-full`;
//   };

//   return (
//     <div className="min-h-screen bg-slate-50 p-6">
//       {/* Header with Filter */}
//       <div className="mb-8">
//         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//           <div>
//             <h1 className="text-3xl font-black text-slate-800 mb-2">
//               Admin Dashboard
//             </h1>
//             <p className="text-slate-600 flex items-center gap-2">
//               <Clock size={16} />
//               {format(new Date(), 'EEEE, MMMM do, yyyy')}
//             </p>
//             <p className="text-xs text-gray-400 mt-1">
//               Last refreshed: {format(lastRefreshed, 'hh:mm:ss a')}
//             </p>
//           </div>

//           {/* Filter Buttons */}
//           <div className="flex flex-wrap gap-2 bg-white p-2 rounded-xl shadow-sm">
//             <button
//               onClick={() => setDateRange('today')}
//               className={`px-4 py-2 rounded-lg font-medium transition-all ${
//                 dateRange === 'today' ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-slate-100'
//               }`}
//             >
//               Today
//             </button>
//             <button
//               onClick={() => setDateRange('week')}
//               className={`px-4 py-2 rounded-lg font-medium transition-all ${
//                 dateRange === 'week' ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-slate-100'
//               }`}
//             >
//               This Week
//             </button>
//             <button
//               onClick={() => setDateRange('month')}
//               className={`px-4 py-2 rounded-lg font-medium transition-all ${
//                 dateRange === 'month' ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-slate-100'
//               }`}
//             >
//               This Month
//             </button>
//             <button
//               onClick={loadDashboardData}
//               className="p-2 hover:bg-slate-100 rounded-lg transition-all"
//               title="Refresh"
//             >
//               <RefreshCw size={18} className={isLoading ? 'animate-spin text-blue-600' : ''} />
//             </button>
//           </div>
//         </div>

//         {/* Active Filter Indicator */}
//         <p className="text-xs text-blue-600 mt-2">
//           Showing: {
//             dateRange === 'today' ? 'Today' :
//             dateRange === 'week' ? 'This Week' : 'This Month'
//           }
//           {!hasOrderData && revenueData.length === 0 && (
//             <span className="ml-2 text-orange-600">(No data for this period)</span>
//           )}
//         </p>
        
//         {/* DEBUG: Raw Stats Display */}
//         <div className="mt-4 p-3 bg-gray-100 rounded-lg text-xs font-mono">
//           <details>
//             <summary className="cursor-pointer text-blue-600">🔍 DEBUG: Raw Order Stats</summary>
//             <pre className="mt-2 overflow-auto max-h-40">
//               {JSON.stringify(orderStats, null, 2)}
//             </pre>
//           </details>
//         </div>
//       </div>

//       {/* KPI CARDS */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//         {/* Card 1 - Total Orders */}
//         <StatCard
//           title="Total Orders"
//           value={safeFormat(orderStats?.total || 0)}
//           icon={<ShoppingCart className="text-blue-600" size={24} />}
//           bgColor="bg-blue-50"
//           borderColor="border-blue-200"
//         >
//           <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
//             <div className="bg-white p-2 rounded-lg">
//               <span className="text-slate-500">Pending</span>
//               <p className="font-bold text-orange-600">
//                 {(orderStats?.confirmed || 0) + (orderStats?.draft || 0)}
//               </p>
//             </div>
//             <div className="bg-white p-2 rounded-lg">
//               <span className="text-slate-500">In Progress</span>
//               <p className="font-bold text-blue-600">
//                 {(orderStats?.cutting || 0) + (orderStats?.stitching || 0) + (orderStats?.['in-progress'] || 0)}
//               </p>
//             </div>
//             <div className="bg-white p-2 rounded-lg">
//               <span className="text-slate-500">Completed</span>
//               <p className="font-bold text-green-600">{orderStats?.delivered || 0}</p>
//             </div>
//           </div>
//         </StatCard>

//         {/* Card 2 - Revenue */}
//         <StatCard
//           title="Revenue"
//           value="₹0"
//           icon={<IndianRupee className="text-green-600" size={24} />}
//           bgColor="bg-green-50"
//           borderColor="border-green-200"
//         >
//           <div className="mt-3 text-center text-xs text-slate-500">
//             Coming soon
//           </div>
//         </StatCard>

//         {/* Card 3 - Pending Deliveries */}
//         <StatCard
//           title="Pending Deliveries"
//           value="0"
//           icon={<Truck className="text-orange-600" size={24} />}
//           bgColor="bg-orange-50"
//           borderColor="border-orange-200"
//         >
//           <div className="mt-3 text-center text-xs text-slate-500">
//             Coming soon
//           </div>
//         </StatCard>

//         {/* Card 4 - Active Tailors */}
//         <StatCard
//           title="Active Tailors"
//           value="0"
//           icon={<Scissors className="text-purple-600" size={24} />}
//           bgColor="bg-purple-50"
//           borderColor="border-purple-200"
//         >
//           <div className="mt-3 text-center text-xs text-slate-500">
//             Coming soon
//           </div>
//         </StatCard>
//       </div>

//       {/* ROW 1: ORDERS OVERVIEW + RECENT ORDERS */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
//         {/* Orders Status Chart */}
//         <div className="bg-white rounded-xl p-6 shadow-sm">
//           <div className="flex items-center justify-between mb-4">
//             <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
//               <Package size={20} className="text-blue-600" />
//               Orders Overview
//               <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
//                 {dateRange === 'today' ? 'Today' : 
//                  dateRange === 'week' ? 'This Week' : 'This Month'}
//               </span>
//             </h2>
//             <Link to="/admin/orders" className="text-blue-600 text-sm hover:underline flex items-center gap-1">
//               View All <ArrowRight size={14} />
//             </Link>
//           </div>
          
//           {hasOrderData ? (
//             <>
//               <div className="h-64">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <RePieChart>
//                     <Pie
//                       data={orderStatusData}
//                       cx="50%"
//                       cy="50%"
//                       innerRadius={60}
//                       outerRadius={80}
//                       paddingAngle={5}
//                       dataKey="value"
//                       label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
//                     >
//                       {orderStatusData.map((entry) => (
//                         <Cell key={`cell-${entry.name}`} fill={entry.color} />
//                       ))}
//                     </Pie>
//                     <Tooltip />
//                     <Legend />
//                   </RePieChart>
//                 </ResponsiveContainer>
//               </div>
              
//               {/* Status Breakdown */}
//               <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-4">
//                 {Object.entries(STATUS_CONFIG).map(([status, config]) => {
//                   const count = orderStats[status] || 0;
//                   if (count === 0) return null;
                  
//                   return (
//                     <div key={status} className="flex items-center gap-1 text-xs">
//                       <span className="w-2 h-2 rounded-full" style={{ backgroundColor: config.color }}></span>
//                       <span className="text-slate-600">{config.label}</span>
//                       <span className="font-bold text-slate-800 ml-auto">{count}</span>
//                     </div>
//                   );
//                 })}
//               </div>
//             </>
//           ) : (
//             <div className="h-64 flex items-center justify-center text-slate-400">
//               <div className="text-center">
//                 <Package size={48} className="mx-auto mb-3 opacity-30" />
//                 <p className="text-sm">No orders for this period</p>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Recent Orders */}
//         <div className="bg-white rounded-xl shadow-sm">
//           <div className="p-6 border-b border-slate-100 flex items-center justify-between">
//             <h2 className="font-bold text-slate-800 flex items-center gap-2">
//               <ShoppingCart size={18} className="text-blue-600" />
//               Recent Orders
//               <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
//                 {dateRange === 'today' ? 'Today' : 
//                  dateRange === 'week' ? 'This Week' : 'This Month'}
//               </span>
//             </h2>
//             <Link to="/admin/orders" className="text-blue-600 text-sm hover:underline flex items-center gap-1">
//               View All <ArrowRight size={14} />
//             </Link>
//           </div>
          
//           {recentOrders.length > 0 ? (
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead className="bg-slate-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Order ID</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Customer</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Items</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Delivery</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Amount</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Action</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-slate-100">
//                   {recentOrders.slice(0, 5).map((order) => (
//                     <tr key={order._id} className="hover:bg-slate-50">
//                       <td className="px-6 py-4 font-medium text-slate-800">#{order.orderId}</td>
//                       <td className="px-6 py-4">{order.customer?.name || 'N/A'}</td>
//                       <td className="px-6 py-4">{order.garments?.length || 0} items</td>
//                       <td className="px-6 py-4">
//                         {order.deliveryDate ? format(new Date(order.deliveryDate), 'dd MMM') : 'N/A'}
//                       </td>
//                       <td className="px-6 py-4">
//                         <span className={getStatusBadge(order.status)}>
//                           {STATUS_CONFIG[order.status]?.label || order.status}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 font-medium">
//                         ₹{safeFormat(order.priceSummary?.totalMax || 0)}
//                       </td>
//                       <td className="px-6 py-4">
//                         <Link to={`/admin/orders/${order._id}`} className="text-blue-600 hover:text-blue-700">
//                           <Eye size={16} />
//                         </Link>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <div className="p-8 text-center text-slate-400">
//               <ShoppingCart size={40} className="mx-auto mb-2 opacity-30" />
//               <p className="text-sm">No recent orders found</p>
//               <Link 
//                 to="/admin/orders/new" 
//                 className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
//               >
//                 Create New Order
//               </Link>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* ===== ROW 2: REVENUE TREND CHART - FULL WIDTH ===== */}
//       <div className="mb-8">
//         <div className="bg-white rounded-xl p-6 shadow-sm">
//           <div className="flex items-center justify-between mb-6">
//             <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
//               <TrendingUp size={24} className="text-green-600" />
//               Revenue Trend
//               <span className="text-xs bg-green-100 text-green-600 px-3 py-1 rounded-full">
//                 {dateRange === 'today' ? 'Today (Hourly)' : 
//                  dateRange === 'week' ? 'Last 7 Days' : 
//                  'This Month (Weekly)'}
//               </span>
//             </h2>
            
//             {/* Legend */}
//             <div className="flex items-center gap-4">
//               <div className="flex items-center gap-2">
//                 <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
//                 <span className="text-sm text-slate-600">Revenue</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <div className="w-3 h-3 bg-red-500 rounded-full"></div>
//                 <span className="text-sm text-slate-600">Expense</span>
//               </div>
//             </div>
//           </div>
          
//           {revenueData.length > 0 ? (
//             <>
//               {/* Chart */}
//               <div className="h-80">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <LineChart data={revenueData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
//                     <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
//                     <XAxis 
//                       dataKey={dateRange === 'today' ? 'time' : 'day'} 
//                       stroke="#64748b"
//                       fontSize={12}
//                       tickLine={false}
//                     />
//                     <YAxis 
//                       stroke="#64748b"
//                       fontSize={12}
//                       tickLine={false}
//                       tickFormatter={(value) => `₹${value/1000}K`}
//                     />
//                     <Tooltip 
//                       formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, '']}
//                       labelFormatter={(label) => `${label}`}
//                     />
//                     <Line 
//                       type="monotone" 
//                       dataKey="revenue" 
//                       stroke="#3b82f6" 
//                       strokeWidth={3}
//                       dot={{ r: 6, fill: "#3b82f6", strokeWidth: 2, stroke: "white" }}
//                       activeDot={{ r: 8 }}
//                       name="Revenue"
//                     />
//                     <Line 
//                       type="monotone" 
//                       dataKey="expense" 
//                       stroke="#ef4444" 
//                       strokeWidth={3}
//                       dot={{ r: 6, fill: "#ef4444", strokeWidth: 2, stroke: "white" }}
//                       activeDot={{ r: 8 }}
//                       name="Expense"
//                     />
//                   </LineChart>
//                 </ResponsiveContainer>
//               </div>

//               {/* Summary Cards */}
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
//                 <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5">
//                   <p className="text-sm text-blue-700 mb-1">Total Revenue</p>
//                   <p className="text-3xl font-bold text-blue-800">
//                     ₹{safeFormat(revenueData.reduce((sum, item) => sum + (item.revenue || 0), 0))}
//                   </p>
//                   <p className="text-xs text-blue-600 mt-2">
//                     {dateRange === 'today' ? 'Today' : 
//                      dateRange === 'week' ? 'This Week' : 'This Month'}
//                   </p>
//                 </div>

//                 <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-5">
//                   <p className="text-sm text-red-700 mb-1">Total Expense</p>
//                   <p className="text-3xl font-bold text-red-800">
//                     ₹{safeFormat(revenueData.reduce((sum, item) => sum + (item.expense || 0), 0))}
//                   </p>
//                   <p className="text-xs text-red-600 mt-2">
//                     {dateRange === 'today' ? 'Today' : 
//                      dateRange === 'week' ? 'This Week' : 'This Month'}
//                   </p>
//                 </div>

//                 <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5">
//                   <p className="text-sm text-green-700 mb-1">Net Profit</p>
//                   <p className="text-3xl font-bold text-green-800">
//                     ₹{safeFormat(
//                       revenueData.reduce((sum, item) => sum + (item.revenue || 0), 0) -
//                       revenueData.reduce((sum, item) => sum + (item.expense || 0), 0)
//                     )}
//                   </p>
//                   <p className="text-xs text-green-600 mt-2">
//                     Revenue - Expense
//                   </p>
//                 </div>
//               </div>

//               {/* Detailed Stats Table */}
//               <div className="mt-8 border-t border-slate-100 pt-6">
//                 <h3 className="text-md font-semibold text-slate-700 mb-3">Detailed Breakdown</h3>
//                 <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
//                   {revenueData.map((item, index) => (
//                     <div key={index} className="bg-slate-50 rounded-lg p-3">
//                       <p className="text-xs text-slate-500 mb-1">{item.day || item.time}</p>
//                       <div className="flex justify-between items-center">
//                         <span className="text-xs text-blue-600">₹{safeFormat(item.revenue)}</span>
//                         <span className="text-xs text-red-600">₹{safeFormat(item.expense)}</span>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </>
//           ) : (
//             <div className="h-80 flex items-center justify-center text-slate-400">
//               <div className="text-center">
//                 <TrendingUp size={48} className="mx-auto mb-3 opacity-30" />
//                 <p className="text-lg">No revenue data for this period</p>
//                 <p className="text-sm mt-2">Try changing the date filter</p>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Loading Overlay */}
//       {isLoading && (
//         <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
//           <div className="bg-white rounded-xl p-4 flex items-center gap-3 shadow-xl">
//             <RefreshCw size={20} className="animate-spin text-blue-600" />
//             <span>Loading dashboard...</span>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


// // Pages/Dashboard/AdminDashboard.jsx - WITH CUSTOM RANGE + WORKS + TAILORS
// import React, { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { Link } from 'react-router-dom';
// import {
//   ShoppingCart,
//   IndianRupee,
//   Truck,
//   Scissors,
//   TrendingUp,
//   Clock,
//   ArrowRight,
//   RefreshCw,
//   Eye,
//   Package,
//   AlertCircle,
//   Filter,
//   Calendar,
//   UserCheck,
//   UserX,
//   Award,
//   Layers,
//   CheckCircle,
//   XCircle,
//   Loader
// } from 'lucide-react';
// import {
//   PieChart as RePieChart,
//   Pie,
//   Cell,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   BarChart,
//   Bar
// } from 'recharts';
// import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';

// // IMPORT from orderSlice
// import { 
//   fetchOrderStats, 
//   fetchRecentOrders,
//   selectOrderStats,
//   selectRecentOrders 
// } from '../../features/order/orderSlice';

// // IMPORT from workSlice (need to create)
// import {
//   fetchWorkStats,
//   fetchRecentWorks,
//   selectWorkStats,
//   selectRecentWorks
// } from '../../features/work/workSlice';

// // IMPORT from tailorSlice (need to create)
// import {
//   fetchTailorStats,
//   fetchTailorPerformance,
//   selectTailorStats,
//   selectTailorPerformance
// } from '../../features/tailor/tailorSlice';

// import StatCard from '../../components/common/StatCard';
// import showToast from '../../utils/toast';

// export default function AdminDashboard() {
//   const dispatch = useDispatch();
//   const { user } = useSelector((state) => state.auth);
  
//   // ===== DEBUG: Check user info =====
//   console.log('👤 Current User:', user);
  
//   // ===== GET ORDER DATA =====
//   const orderStats = useSelector(selectOrderStats) || {
//     total: 0,
//     pending: 0,
//     cutting: 0,
//     stitching: 0,
//     ready: 0,
//     delivered: 0,
//     cancelled: 0
//   };
  
//   const recentOrders = useSelector(selectRecentOrders) || [];
  
//   // ===== GET WORK DATA =====
//   const workStats = useSelector(selectWorkStats) || {
//     total: 0,
//     pending: 0,
//     inProgress: 0,
//     completed: 0,
//     cancelled: 0
//   };
  
//   const recentWorks = useSelector(selectRecentWorks) || [];
  
//   // ===== GET TAILOR DATA =====
//   const tailorStats = useSelector(selectTailorStats) || {
//     total: 0,
//     active: 0,
//     busy: 0,
//     idle: 0,
//     onLeave: 0
//   };
  
//   const tailorPerformance = useSelector(selectTailorPerformance) || [];
  
//   // Loading states
//   const [isLoading, setIsLoading] = useState(false);
//   const [dateRange, setDateRange] = useState('month');
//   const [customStartDate, setCustomStartDate] = useState(format(new Date(), 'yyyy-MM-dd'));
//   const [customEndDate, setCustomEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));
//   const [showCustomPicker, setShowCustomPicker] = useState(false);
//   const [lastRefreshed, setLastRefreshed] = useState(new Date());
  
//   // Revenue chart data
//   const [revenueData, setRevenueData] = useState([]);

//   // ===== STATUS COLORS =====
//   const STATUS_CONFIG = {
//     'draft': { color: '#94a3b8', label: 'Draft', bg: 'bg-slate-100' },
//     'confirmed': { color: '#f59e0b', label: 'Confirmed', bg: 'bg-amber-100' },
//     'in-progress': { color: '#3b82f6', label: 'In Progress', bg: 'bg-blue-100' },
//     'ready-to-delivery': { color: '#10b981', label: 'Ready', bg: 'bg-emerald-100' },
//     'delivered': { color: '#6b7280', label: 'Delivered', bg: 'bg-gray-100' },
//     'cancelled': { color: '#ef4444', label: 'Cancelled', bg: 'bg-red-100' }
//   };

//   const WORK_STATUS_COLORS = {
//     'pending': '#f59e0b',
//     'in-progress': '#3b82f6',
//     'completed': '#10b981',
//     'cancelled': '#ef4444'
//   };

//   // ===== LOAD DATA WHEN FILTER CHANGES =====
//   useEffect(() => {
//     console.log('🔄 Date range changed to:', dateRange);
//     loadDashboardData();
//   }, [dateRange, customStartDate, customEndDate]);

//   const loadDashboardData = async () => {
//     console.log('🚀 ===== LOADING DASHBOARD DATA STARTED =====');
//     console.log('📅 Selected date range:', dateRange);
//     setIsLoading(true);
    
//     try {
//       // Get date parameters based on filter
//       const params = getDateParams();
//       console.log('📅 Date params being sent:', params);
      
//       // Build promises array
//       const promises = [
//         dispatch(fetchOrderStats(params)),
//         dispatch(fetchRecentOrders({ ...params, limit: 10 })),
//         dispatch(fetchWorkStats(params)),
//         dispatch(fetchRecentWorks({ ...params, limit: 5 })),
//         dispatch(fetchTailorStats()),
//         dispatch(fetchTailorPerformance(params))
//       ];
      
//       const startTime = Date.now();
//       const results = await Promise.allSettled(promises);
//       const endTime = Date.now();
      
//       console.log(`⏱️ API calls completed in ${endTime - startTime}ms`);
      
//       // Check results
//       const apiNames = ['Order Stats', 'Recent Orders', 'Work Stats', 'Recent Works', 'Tailor Stats', 'Tailor Performance'];
//       results.forEach((result, index) => {
//         if (result.status === 'fulfilled') {
//           console.log(`✅ ${apiNames[index]} successful:`, result.value);
//         } else {
//           console.error(`❌ ${apiNames[index]} failed:`, result.reason);
//         }
//       });
      
//       // Generate revenue chart data (sample for now)
//       generateRevenueChartData();
      
//       setLastRefreshed(new Date());
      
//     } catch (error) {
//       console.error('❌ Error loading dashboard:', error);
//       showToast.error('Failed to load dashboard data');
//     } finally {
//       setIsLoading(false);
//       console.log('🏁 ===== LOADING DASHBOARD DATA COMPLETED =====');
//     }
//   };

//   const getDateParams = () => {
//     const today = new Date();
    
//     switch(dateRange) {
//       case 'today':
//         return { 
//           period: 'today',
//           startDate: format(today, 'yyyy-MM-dd'),
//           endDate: format(today, 'yyyy-MM-dd')
//         };
//       case 'week':
//         const weekStart = startOfWeek(today);
//         const weekEnd = endOfWeek(today);
//         return {
//           period: 'week',
//           startDate: format(weekStart, 'yyyy-MM-dd'),
//           endDate: format(weekEnd, 'yyyy-MM-dd')
//         };
//       case 'month':
//         return { 
//           period: 'month',
//           startDate: format(startOfMonth(today), 'yyyy-MM-dd'),
//           endDate: format(endOfMonth(today), 'yyyy-MM-dd')
//         };
//       case 'custom':
//         return {
//           period: 'custom',
//           startDate: customStartDate,
//           endDate: customEndDate
//         };
//       default:
//         return { period: 'month' };
//     }
//   };

//   // ===== APPLY CUSTOM DATE RANGE =====
//   const handleApplyCustomRange = () => {
//     if (!customStartDate || !customEndDate) {
//       showToast.error('Please select both start and end dates');
//       return;
//     }
    
//     if (new Date(customStartDate) > new Date(customEndDate)) {
//       showToast.error('Start date cannot be after end date');
//       return;
//     }
    
//     setDateRange('custom');
//     setShowCustomPicker(false);
//     loadDashboardData();
//     showToast.success(`Showing data from ${customStartDate} to ${customEndDate}`);
//   };

//   // ===== Generate Revenue Chart Data =====
//   const generateRevenueChartData = () => {
//     console.log('💰 Generating revenue chart data for:', dateRange);
    
//     let data = [];
//     const today = new Date();
    
//     switch(dateRange) {
//       case 'today':
//         for (let i = 0; i < 8; i++) {
//           data.push({
//             time: `${i+9} AM`,
//             revenue: Math.floor(Math.random() * 5000) + 1000,
//             expense: Math.floor(Math.random() * 2000) + 500
//           });
//         }
//         break;
        
//       case 'week':
//         for (let i = 6; i >= 0; i--) {
//           const date = subDays(today, i);
//           data.push({
//             day: format(date, 'EEE'),
//             revenue: Math.floor(Math.random() * 15000) + 5000,
//             expense: Math.floor(Math.random() * 5000) + 2000
//           });
//         }
//         break;
        
//       case 'month':
//       default:
//         data = [
//           { day: 'Week 1', revenue: Math.floor(Math.random() * 50000) + 20000, expense: Math.floor(Math.random() * 20000) + 10000 },
//           { day: 'Week 2', revenue: Math.floor(Math.random() * 50000) + 20000, expense: Math.floor(Math.random() * 20000) + 10000 },
//           { day: 'Week 3', revenue: Math.floor(Math.random() * 50000) + 20000, expense: Math.floor(Math.random() * 20000) + 10000 },
//           { day: 'Week 4', revenue: Math.floor(Math.random() * 50000) + 20000, expense: Math.floor(Math.random() * 20000) + 10000 }
//         ];
//         break;
//     }
    
//     setRevenueData(data);
//   };

//   // ===== PREPARE ORDER STATUS DATA =====
//   const getOrderStatusData = () => {
//     const data = [];
    
//     if (orderStats.confirmed > 0) {
//       data.push({ 
//         name: 'Confirmed', 
//         value: orderStats.confirmed, 
//         color: STATUS_CONFIG.confirmed.color 
//       });
//     }
    
//     if (orderStats['in-progress'] > 0) {
//       data.push({ 
//         name: 'In Progress', 
//         value: orderStats['in-progress'], 
//         color: STATUS_CONFIG['in-progress'].color 
//       });
//     }
    
//     if (orderStats['ready-to-delivery'] > 0) {
//       data.push({ 
//         name: 'Ready', 
//         value: orderStats['ready-to-delivery'], 
//         color: STATUS_CONFIG['ready-to-delivery'].color 
//       });
//     }
    
//     if (orderStats.delivered > 0) {
//       data.push({ 
//         name: 'Delivered', 
//         value: orderStats.delivered, 
//         color: STATUS_CONFIG.delivered.color 
//       });
//     }
    
//     if (orderStats.cancelled > 0) {
//       data.push({ 
//         name: 'Cancelled', 
//         value: orderStats.cancelled, 
//         color: STATUS_CONFIG.cancelled.color 
//       });
//     }
    
//     if (orderStats.draft > 0) {
//       data.push({ 
//         name: 'Draft', 
//         value: orderStats.draft, 
//         color: STATUS_CONFIG.draft.color 
//       });
//     }
    
//     return data;
//   };

//   const orderStatusData = getOrderStatusData();
//   const hasOrderData = orderStatusData.length > 0;

//   // ===== PREPARE WORK STATUS DATA =====
//   const getWorkStatusData = () => {
//     return [
//       { name: 'Pending', value: workStats.pending || 0, color: '#f59e0b' },
//       { name: 'In Progress', value: workStats.inProgress || 0, color: '#3b82f6' },
//       { name: 'Completed', value: workStats.completed || 0, color: '#10b981' },
//       { name: 'Cancelled', value: workStats.cancelled || 0, color: '#ef4444' }
//     ].filter(item => item.value > 0);
//   };

//   const workStatusData = getWorkStatusData();
//   const hasWorkData = workStatusData.length > 0;

//   // Safe formatting
//   const safeFormat = (value) => {
//     return (value || 0).toLocaleString('en-IN');
//   };

//   // Get status badge
//   const getStatusBadge = (status) => {
//     const config = STATUS_CONFIG[status] || STATUS_CONFIG.draft;
//     return `${config.bg} text-gray-700 px-2 py-1 text-xs rounded-full`;
//   };

//   return (
//     <div className="min-h-screen bg-slate-50 p-6">
//       {/* ===== HEADER WITH CUSTOM DATE RANGE ===== */}
//       <div className="mb-8">
//         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//           <div>
//             <h1 className="text-3xl font-black text-slate-800 mb-2">
//               Admin Dashboard
//             </h1>
//             <p className="text-slate-600 flex items-center gap-2">
//               <Clock size={16} />
//               {format(new Date(), 'EEEE, MMMM do, yyyy')}
//             </p>
//             <p className="text-xs text-gray-400 mt-1">
//               Last refreshed: {format(lastRefreshed, 'hh:mm:ss a')}
//             </p>
//           </div>

//           {/* Filter Buttons with Custom Range */}
//           <div className="flex flex-wrap gap-2 bg-white p-2 rounded-xl shadow-sm">
//             <button
//               onClick={() => {
//                 setDateRange('today');
//                 setShowCustomPicker(false);
//               }}
//               className={`px-4 py-2 rounded-lg font-medium transition-all ${
//                 dateRange === 'today' && !showCustomPicker ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-slate-100'
//               }`}
//             >
//               Today
//             </button>
//             <button
//               onClick={() => {
//                 setDateRange('week');
//                 setShowCustomPicker(false);
//               }}
//               className={`px-4 py-2 rounded-lg font-medium transition-all ${
//                 dateRange === 'week' && !showCustomPicker ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-slate-100'
//               }`}
//             >
//               This Week
//             </button>
//             <button
//               onClick={() => {
//                 setDateRange('month');
//                 setShowCustomPicker(false);
//               }}
//               className={`px-4 py-2 rounded-lg font-medium transition-all ${
//                 dateRange === 'month' && !showCustomPicker ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-slate-100'
//               }`}
//             >
//               This Month
//             </button>
//             <button
//               onClick={() => setShowCustomPicker(!showCustomPicker)}
//               className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-1 ${
//                 showCustomPicker || dateRange === 'custom' ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-slate-100'
//               }`}
//             >
//               <Calendar size={16} />
//               Custom
//             </button>
//             <button
//               onClick={loadDashboardData}
//               className="p-2 hover:bg-slate-100 rounded-lg transition-all"
//               title="Refresh"
//             >
//               <RefreshCw size={18} className={isLoading ? 'animate-spin text-blue-600' : ''} />
//             </button>
//           </div>
//         </div>

//         {/* Custom Date Range Picker */}
//         {showCustomPicker && (
//           <div className="mt-4 bg-white p-4 rounded-xl shadow-sm border border-blue-100">
//             <div className="flex flex-wrap items-end gap-4">
//               <div>
//                 <label className="block text-xs font-medium text-slate-500 mb-1">Start Date</label>
//                 <input
//                   type="date"
//                   value={customStartDate}
//                   onChange={(e) => setCustomStartDate(e.target.value)}
//                   className="px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
//                   max={customEndDate}
//                 />
//               </div>
//               <div>
//                 <label className="block text-xs font-medium text-slate-500 mb-1">End Date</label>
//                 <input
//                   type="date"
//                   value={customEndDate}
//                   onChange={(e) => setCustomEndDate(e.target.value)}
//                   className="px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
//                   min={customStartDate}
//                 />
//               </div>
//               <button
//                 onClick={handleApplyCustomRange}
//                 className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all"
//               >
//                 Apply Range
//               </button>
//               <button
//                 onClick={() => setShowCustomPicker(false)}
//                 className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg font-medium hover:bg-slate-200 transition-all"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Active Filter Indicator */}
//         <p className="text-xs text-blue-600 mt-2">
//           Showing: {
//             dateRange === 'today' ? 'Today' :
//             dateRange === 'week' ? 'This Week' :
//             dateRange === 'month' ? 'This Month' :
//             `Custom (${customStartDate} to ${customEndDate})`
//           }
//         </p>
//       </div>

//       {/* ===== KPI CARDS ===== */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//         {/* Card 1 - Total Orders */}
//         <StatCard
//           title="Total Orders"
//           value={safeFormat(orderStats?.total || 0)}
//           icon={<ShoppingCart className="text-blue-600" size={24} />}
//           bgColor="bg-blue-50"
//           borderColor="border-blue-200"
//         >
//           <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
//             <div className="bg-white p-2 rounded-lg">
//               <span className="text-slate-500">Pending</span>
//               <p className="font-bold text-orange-600">
//                 {(orderStats?.confirmed || 0) + (orderStats?.draft || 0)}
//               </p>
//             </div>
//             <div className="bg-white p-2 rounded-lg">
//               <span className="text-slate-500">In Progress</span>
//               <p className="font-bold text-blue-600">
//                 {(orderStats?.cutting || 0) + (orderStats?.stitching || 0) + (orderStats?.['in-progress'] || 0)}
//               </p>
//             </div>
//             <div className="bg-white p-2 rounded-lg">
//               <span className="text-slate-500">Completed</span>
//               <p className="font-bold text-green-600">{orderStats?.delivered || 0}</p>
//             </div>
//           </div>
//         </StatCard>

//         {/* Card 2 - Revenue */}
//         <StatCard
//           title="Revenue"
//           value="₹0"
//           icon={<IndianRupee className="text-green-600" size={24} />}
//           bgColor="bg-green-50"
//           borderColor="border-green-200"
//         >
//           <div className="mt-3 text-center text-xs text-slate-500">
//             Coming soon
//           </div>
//         </StatCard>

//         {/* Card 3 - Total Works */}
//         <StatCard
//           title="Total Works"
//           value={safeFormat(workStats?.total || 0)}
//           icon={<Layers className="text-purple-600" size={24} />}
//           bgColor="bg-purple-50"
//           borderColor="border-purple-200"
//         >
//           <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
//             <div className="bg-white p-2 rounded-lg">
//               <span className="text-slate-500">Pending</span>
//               <p className="font-bold text-orange-600">{workStats?.pending || 0}</p>
//             </div>
//             <div className="bg-white p-2 rounded-lg">
//               <span className="text-slate-500">In Progress</span>
//               <p className="font-bold text-blue-600">{workStats?.inProgress || 0}</p>
//             </div>
//             <div className="bg-white p-2 rounded-lg">
//               <span className="text-slate-500">Completed</span>
//               <p className="font-bold text-green-600">{workStats?.completed || 0}</p>
//             </div>
//           </div>
//         </StatCard>

//         {/* Card 4 - Active Tailors */}
//         <StatCard
//           title="Active Tailors"
//           value={safeFormat(tailorStats?.active || 0)}
//           icon={<Scissors className="text-purple-600" size={24} />}
//           bgColor="bg-purple-50"
//           borderColor="border-purple-200"
//         >
//           <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
//             <div className="bg-white p-2 rounded-lg">
//               <span className="text-slate-500">Working</span>
//               <p className="font-bold text-green-600">{tailorStats?.busy || 0}</p>
//             </div>
//             <div className="bg-white p-2 rounded-lg">
//               <span className="text-slate-500">Idle</span>
//               <p className="font-bold text-slate-600">{tailorStats?.idle || 0}</p>
//             </div>
//             <div className="bg-white p-2 rounded-lg">
//               <span className="text-slate-500">Leave</span>
//               <p className="font-bold text-orange-600">{tailorStats?.onLeave || 0}</p>
//             </div>
//           </div>
//         </StatCard>
//       </div>

//       {/* ===== ROW 1: ORDERS OVERVIEW + RECENT ORDERS ===== */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
//         {/* Orders Status Chart */}
//         <div className="bg-white rounded-xl p-6 shadow-sm">
//           <div className="flex items-center justify-between mb-4">
//             <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
//               <Package size={20} className="text-blue-600" />
//               Orders Overview
//               <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
//                 {dateRange === 'today' ? 'Today' : 
//                  dateRange === 'week' ? 'This Week' : 
//                  dateRange === 'month' ? 'This Month' : 'Custom'}
//               </span>
//             </h2>
//             <Link to="/admin/orders" className="text-blue-600 text-sm hover:underline flex items-center gap-1">
//               View All <ArrowRight size={14} />
//             </Link>
//           </div>
          
//           {hasOrderData ? (
//             <>
//               <div className="h-64">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <RePieChart>
//                     <Pie
//                       data={orderStatusData}
//                       cx="50%"
//                       cy="50%"
//                       innerRadius={60}
//                       outerRadius={80}
//                       paddingAngle={5}
//                       dataKey="value"
//                       label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
//                     >
//                       {orderStatusData.map((entry) => (
//                         <Cell key={`cell-${entry.name}`} fill={entry.color} />
//                       ))}
//                     </Pie>
//                     <Tooltip />
//                     <Legend />
//                   </RePieChart>
//                 </ResponsiveContainer>
//               </div>
              
//               <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-4">
//                 {Object.entries(STATUS_CONFIG).map(([status, config]) => {
//                   const count = orderStats[status] || 0;
//                   if (count === 0) return null;
//                   return (
//                     <div key={status} className="flex items-center gap-1 text-xs">
//                       <span className="w-2 h-2 rounded-full" style={{ backgroundColor: config.color }}></span>
//                       <span className="text-slate-600">{config.label}</span>
//                       <span className="font-bold text-slate-800 ml-auto">{count}</span>
//                     </div>
//                   );
//                 })}
//               </div>
//             </>
//           ) : (
//             <div className="h-64 flex items-center justify-center text-slate-400">
//               <Package size={48} className="opacity-30" />
//               <p className="text-sm ml-2">No orders for this period</p>
//             </div>
//           )}
//         </div>

//         {/* Recent Orders */}
//         <div className="bg-white rounded-xl shadow-sm">
//           <div className="p-6 border-b border-slate-100 flex items-center justify-between">
//             <h2 className="font-bold text-slate-800 flex items-center gap-2">
//               <ShoppingCart size={18} className="text-blue-600" />
//               Recent Orders
//               <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
//                 {dateRange === 'today' ? 'Today' : 
//                  dateRange === 'week' ? 'This Week' : 
//                  dateRange === 'month' ? 'This Month' : 'Custom'}
//               </span>
//             </h2>
//             <Link to="/admin/orders" className="text-blue-600 text-sm hover:underline">View All</Link>
//           </div>
          
//           {recentOrders.length > 0 ? (
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead className="bg-slate-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-slate-500">Order ID</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-slate-500">Customer</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-slate-500">Items</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-slate-500">Status</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-slate-500">Action</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-slate-100">
//                   {recentOrders.slice(0, 5).map((order) => (
//                     <tr key={order._id} className="hover:bg-slate-50">
//                       <td className="px-6 py-4 font-medium">#{order.orderId}</td>
//                       <td className="px-6 py-4">{order.customer?.name || 'N/A'}</td>
//                       <td className="px-6 py-4">{order.garments?.length || 0}</td>
//                       <td className="px-6 py-4">
//                         <span className={getStatusBadge(order.status)}>
//                           {STATUS_CONFIG[order.status]?.label || order.status}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4">
//                         <Link to={`/admin/orders/${order._id}`} className="text-blue-600">
//                           <Eye size={16} />
//                         </Link>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <div className="p-8 text-center text-slate-400">
//               <ShoppingCart size={40} className="mx-auto mb-2 opacity-30" />
//               <p>No recent orders</p>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* ===== ROW 2: REVENUE TREND CHART - FULL WIDTH ===== */}
//       <div className="mb-8">
//         <div className="bg-white rounded-xl p-6 shadow-sm">
//           <div className="flex items-center justify-between mb-6">
//             <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
//               <TrendingUp size={24} className="text-green-600" />
//               Revenue Trend
//               <span className="text-xs bg-green-100 text-green-600 px-3 py-1 rounded-full">
//                 {dateRange === 'today' ? 'Today (Hourly)' : 
//                  dateRange === 'week' ? 'Last 7 Days' : 
//                  dateRange === 'month' ? 'This Month' : 'Custom Range'}
//               </span>
//             </h2>
            
//             <div className="flex items-center gap-4">
//               <div className="flex items-center gap-2">
//                 <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
//                 <span className="text-sm text-slate-600">Revenue</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <div className="w-3 h-3 bg-red-500 rounded-full"></div>
//                 <span className="text-sm text-slate-600">Expense</span>
//               </div>
//             </div>
//           </div>
          
//           {revenueData.length > 0 ? (
//             <>
//               <div className="h-80">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <LineChart data={revenueData}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey={dateRange === 'today' ? 'time' : 'day'} />
//                     <YAxis tickFormatter={(value) => `₹${value/1000}K`} />
//                     <Tooltip formatter={(value) => `₹${value}`} />
//                     <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} />
//                     <Line type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={3} />
//                   </LineChart>
//                 </ResponsiveContainer>
//               </div>

//               <div className="grid grid-cols-3 gap-6 mt-8">
//                 <div className="bg-blue-50 p-4 rounded-lg">
//                   <p className="text-sm text-blue-600">Total Revenue</p>
//                   <p className="text-2xl font-bold text-blue-800">
//                     ₹{safeFormat(revenueData.reduce((sum, i) => sum + i.revenue, 0))}
//                   </p>
//                 </div>
//                 <div className="bg-red-50 p-4 rounded-lg">
//                   <p className="text-sm text-red-600">Total Expense</p>
//                   <p className="text-2xl font-bold text-red-800">
//                     ₹{safeFormat(revenueData.reduce((sum, i) => sum + i.expense, 0))}
//                   </p>
//                 </div>
//                 <div className="bg-green-50 p-4 rounded-lg">
//                   <p className="text-sm text-green-600">Net Profit</p>
//                   <p className="text-2xl font-bold text-green-800">
//                     ₹{safeFormat(
//                       revenueData.reduce((sum, i) => sum + i.revenue, 0) -
//                       revenueData.reduce((sum, i) => sum + i.expense, 0)
//                     )}
//                   </p>
//                 </div>
//               </div>
//             </>
//           ) : (
//             <div className="h-80 flex items-center justify-center text-slate-400">
//               <TrendingUp size={48} className="opacity-30" />
//               <p className="text-lg ml-2">No revenue data</p>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* ===== ROW 3: WORKS OVERVIEW + TAILOR PERFORMANCE ===== */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
//         {/* WORKS OVERVIEW - Left Side */}
//         <div className="bg-white rounded-xl p-6 shadow-sm">
//           <div className="flex items-center justify-between mb-4">
//             <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
//               <Layers size={20} className="text-purple-600" />
//               Works Overview
//               <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">
//                 {dateRange === 'today' ? 'Today' : 
//                  dateRange === 'week' ? 'This Week' : 
//                  dateRange === 'month' ? 'This Month' : 'Custom'}
//               </span>
//             </h2>
//             <Link to="/admin/works" className="text-purple-600 text-sm hover:underline flex items-center gap-1">
//               View All <ArrowRight size={14} />
//             </Link>
//           </div>

//           {/* Work Status Chart */}
//           <div className="grid grid-cols-2 gap-6">
//             {/* Pie Chart */}
//             <div className="h-48">
//               <ResponsiveContainer width="100%" height="100%">
//                 <RePieChart>
//                   <Pie
//                     data={workStatusData}
//                     cx="50%"
//                     cy="50%"
//                     innerRadius={40}
//                     outerRadius={60}
//                     paddingAngle={5}
//                     dataKey="value"
//                   >
//                     {workStatusData.map((entry, index) => (
//                       <Cell key={`cell-${index}`} fill={entry.color} />
//                     ))}
//                   </Pie>
//                   <Tooltip />
//                 </RePieChart>
//               </ResponsiveContainer>
//             </div>

//             {/* Status List */}
//             <div className="space-y-3">
//               {Object.entries(WORK_STATUS_COLORS).map(([status, color]) => {
//                 const count = workStats[status] || 0;
//                 if (count === 0 && status !== 'pending') return null;
//                 return (
//                   <div key={status} className="flex items-center justify-between">
//                     <div className="flex items-center gap-2">
//                       <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }}></span>
//                       <span className="text-sm capitalize text-slate-600">{status}</span>
//                     </div>
//                     <span className="font-bold text-slate-800">{count}</span>
//                   </div>
//                 );
//               })}
//               <div className="pt-2 border-t border-slate-100">
//                 <div className="flex items-center justify-between font-medium">
//                   <span className="text-sm text-slate-600">Total Works</span>
//                   <span className="font-bold text-purple-600">{workStats.total || 0}</span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Recent Works */}
//           <div className="mt-6">
//             <h3 className="text-sm font-semibold text-slate-700 mb-3">Recent Works</h3>
//             <div className="space-y-2">
//               {recentWorks.slice(0, 3).map((work) => (
//                 <div key={work._id} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
//                   <div>
//                     <p className="text-sm font-medium text-slate-800">{work.workId}</p>
//                     <p className="text-xs text-slate-500">{work.garment?.name || 'Garment'}</p>
//                   </div>
//                   <span className={`px-2 py-1 text-xs rounded-full ${
//                     work.status === 'completed' ? 'bg-green-100 text-green-700' :
//                     work.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
//                     work.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
//                     'bg-red-100 text-red-700'
//                   }`}>
//                     {work.status}
//                   </span>
//                 </div>
//               ))}
//               {recentWorks.length === 0 && (
//                 <p className="text-sm text-slate-400 text-center py-2">No recent works</p>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* TAILOR PERFORMANCE - Right Side */}
//         <div className="bg-white rounded-xl p-6 shadow-sm">
//           <div className="flex items-center justify-between mb-4">
//             <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
//               <Scissors size={20} className="text-purple-600" />
//               Tailor Performance
//               <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">
//                 {dateRange === 'today' ? 'Today' : 
//                  dateRange === 'week' ? 'This Week' : 
//                  dateRange === 'month' ? 'This Month' : 'Custom'}
//               </span>
//             </h2>
//             <Link to="/admin/tailors" className="text-purple-600 text-sm hover:underline flex items-center gap-1">
//               View All <ArrowRight size={14} />
//             </Link>
//           </div>

//           {/* Tailor Status Cards */}
//           <div className="grid grid-cols-2 gap-3 mb-6">
//             <div className="bg-green-50 p-3 rounded-lg">
//               <div className="flex items-center gap-2">
//                 <UserCheck size={16} className="text-green-600" />
//                 <span className="text-xs text-green-600">Active</span>
//               </div>
//               <p className="text-xl font-bold text-green-700">{tailorStats.active || 0}</p>
//             </div>
//             <div className="bg-blue-50 p-3 rounded-lg">
//               <div className="flex items-center gap-2">
//                 <Loader size={16} className="text-blue-600" />
//                 <span className="text-xs text-blue-600">Working</span>
//               </div>
//               <p className="text-xl font-bold text-blue-700">{tailorStats.busy || 0}</p>
//             </div>
//             <div className="bg-slate-50 p-3 rounded-lg">
//               <div className="flex items-center gap-2">
//                 <UserX size={16} className="text-slate-600" />
//                 <span className="text-xs text-slate-600">Idle</span>
//               </div>
//               <p className="text-xl font-bold text-slate-700">{tailorStats.idle || 0}</p>
//             </div>
//             <div className="bg-orange-50 p-3 rounded-lg">
//               <div className="flex items-center gap-2">
//                 <Calendar size={16} className="text-orange-600" />
//                 <span className="text-xs text-orange-600">On Leave</span>
//               </div>
//               <p className="text-xl font-bold text-orange-700">{tailorStats.onLeave || 0}</p>
//             </div>
//           </div>

//           {/* Performance List */}
//           <h3 className="text-sm font-semibold text-slate-700 mb-3">Top Performers</h3>
//           <div className="space-y-3">
//             {tailorPerformance.slice(0, 4).map((tailor, index) => (
//               <div key={tailor._id || index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
//                 <div className="flex items-center gap-3">
//                   <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
//                     index === 0 ? 'bg-yellow-500' :
//                     index === 1 ? 'bg-slate-500' :
//                     index === 2 ? 'bg-orange-500' : 'bg-blue-500'
//                   }`}>
//                     {index + 1}
//                   </div>
//                   <div>
//                     <p className="font-medium text-slate-800">{tailor.name || 'Tailor'}</p>
//                     <p className="text-xs text-slate-500">{tailor.specialization || 'General'}</p>
//                   </div>
//                 </div>
//                 <div className="text-right">
//                   <p className="font-bold text-blue-600">{tailor.completedWorks || 0}</p>
//                   <p className="text-xs text-slate-500">completed</p>
//                 </div>
//               </div>
//             ))}
//             {tailorPerformance.length === 0 && (
//               <p className="text-sm text-slate-400 text-center py-4">No performance data</p>
//             )}
//           </div>

//           {/* Quick Stats */}
//           <div className="mt-4 pt-4 border-t border-slate-100">
//             <div className="flex items-center justify-between text-sm">
//               <span className="text-slate-600">Avg. Completion Time</span>
//               <span className="font-bold text-green-600">3.5 days</span>
//             </div>
//             <div className="flex items-center justify-between text-sm mt-1">
//               <span className="text-slate-600">Productivity Rate</span>
//               <span className="font-bold text-blue-600">85%</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Loading Overlay */}
//       {isLoading && (
//         <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
//           <div className="bg-white rounded-xl p-4 flex items-center gap-3 shadow-xl">
//             <RefreshCw size={20} className="animate-spin text-blue-600" />
//             <span>Loading dashboard...</span>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }























// // Pages/Dashboard/AdminDashboard.jsx - WITH CUSTOM RANGE + WORKS + TAILORS + QUICK ACTIONS
// import React, { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { Link } from 'react-router-dom';
// import {
//   ShoppingCart,
//   IndianRupee,
//   Truck,
//   Scissors,
//   TrendingUp,
//   Clock,
//   ArrowRight,
//   RefreshCw,
//   Eye,
//   Package,
//   AlertCircle,
//   Filter,
//   Calendar,
//   UserCheck,
//   UserX,
//   Award,
//   Layers,
//   CheckCircle,
//   XCircle,
//   Loader,
//   Plus,
//   UserPlus,
//   Receipt,
//   DollarSign
// } from 'lucide-react';
// import {
//   PieChart as RePieChart,
//   Pie,
//   Cell,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   BarChart,
//   Bar
// } from 'recharts';
// import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';

// // IMPORT from orderSlice
// import { 
//   fetchOrderStats, 
//   fetchRecentOrders,
//   selectOrderStats,
//   selectRecentOrders 
// } from '../../features/order/orderSlice';

// // IMPORT from workSlice
// import {
//   fetchWorkStats,
//   fetchRecentWorks,
//   selectWorkStats,
//   selectRecentWorks
// } from '../../features/work/workSlice';

// // IMPORT from tailorSlice
// import {
//   fetchTailorStats,
//   fetchTailorPerformance,
//   selectTailorStats,
//   selectTailorPerformance
// } from '../../features/tailor/tailorSlice';

// import StatCard from '../../components/common/StatCard';
// import showToast from '../../utils/toast';

// export default function AdminDashboard() {
//   const dispatch = useDispatch();
//   const { user } = useSelector((state) => state.auth);
  
//   // ===== DEBUG: Check user info =====
//   console.log('👤 Current User:', user);
  
//   // ===== GET ORDER DATA =====
//   const orderStats = useSelector(selectOrderStats) || {
//     total: 0,
//     pending: 0,
//     cutting: 0,
//     stitching: 0,
//     ready: 0,
//     delivered: 0,
//     cancelled: 0
//   };
  
//   const recentOrders = useSelector(selectRecentOrders) || [];
  
//   // ===== GET WORK DATA =====
//   const workStats = useSelector(selectWorkStats) || {
//     total: 0,
//     pending: 0,
//     inProgress: 0,
//     completed: 0,
//     cancelled: 0
//   };
  
//   const recentWorks = useSelector(selectRecentWorks) || [];
  
//   // ===== GET TAILOR DATA =====
//   const tailorStats = useSelector(selectTailorStats) || {
//     total: 0,
//     active: 0,
//     busy: 0,
//     idle: 0,
//     onLeave: 0
//   };
  
//   const tailorPerformance = useSelector(selectTailorPerformance) || [];
  
//   // Loading states
//   const [isLoading, setIsLoading] = useState(false);
//   const [dateRange, setDateRange] = useState('month');
//   const [customStartDate, setCustomStartDate] = useState(format(new Date(), 'yyyy-MM-dd'));
//   const [customEndDate, setCustomEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));
//   const [showCustomPicker, setShowCustomPicker] = useState(false);
//   const [lastRefreshed, setLastRefreshed] = useState(new Date());
  
//   // Revenue chart data
//   const [revenueData, setRevenueData] = useState([]);

//   // ===== STATUS COLORS =====
//   const STATUS_CONFIG = {
//     'draft': { color: '#94a3b8', label: 'Draft', bg: 'bg-slate-100' },
//     'confirmed': { color: '#f59e0b', label: 'Confirmed', bg: 'bg-amber-100' },
//     'in-progress': { color: '#3b82f6', label: 'In Progress', bg: 'bg-blue-100' },
//     'ready-to-delivery': { color: '#10b981', label: 'Ready', bg: 'bg-emerald-100' },
//     'delivered': { color: '#6b7280', label: 'Delivered', bg: 'bg-gray-100' },
//     'cancelled': { color: '#ef4444', label: 'Cancelled', bg: 'bg-red-100' }
//   };

//   const WORK_STATUS_COLORS = {
//     'pending': '#f59e0b',
//     'in-progress': '#3b82f6',
//     'completed': '#10b981',
//     'cancelled': '#ef4444'
//   };

//   // ===== LOAD DATA WHEN FILTER CHANGES =====
//   useEffect(() => {
//     console.log('🔄 Date range changed to:', dateRange);
//     loadDashboardData();
//   }, [dateRange, customStartDate, customEndDate]);

//   const loadDashboardData = async () => {
//     console.log('🚀 ===== LOADING DASHBOARD DATA STARTED =====');
//     console.log('📅 Selected date range:', dateRange);
//     setIsLoading(true);
    
//     try {
//       // Get date parameters based on filter
//       const params = getDateParams();
//       console.log('📅 Date params being sent:', params);
      
//       // Build promises array
//       const promises = [
//         dispatch(fetchOrderStats(params)),
//         dispatch(fetchRecentOrders({ ...params, limit: 10 })),
//         dispatch(fetchWorkStats(params)),
//         dispatch(fetchRecentWorks({ ...params, limit: 5 })),
//         dispatch(fetchTailorStats()),
//         dispatch(fetchTailorPerformance(params))
//       ];
      
//       const startTime = Date.now();
//       const results = await Promise.allSettled(promises);
//       const endTime = Date.now();
      
//       console.log(`⏱️ API calls completed in ${endTime - startTime}ms`);
      
//       // Check results
//       const apiNames = ['Order Stats', 'Recent Orders', 'Work Stats', 'Recent Works', 'Tailor Stats', 'Tailor Performance'];
//       results.forEach((result, index) => {
//         if (result.status === 'fulfilled') {
//           console.log(`✅ ${apiNames[index]} successful:`, result.value);
//         } else {
//           console.error(`❌ ${apiNames[index]} failed:`, result.reason);
//         }
//       });
      
//       // Generate revenue chart data (sample for now)
//       generateRevenueChartData();
      
//       setLastRefreshed(new Date());
      
//     } catch (error) {
//       console.error('❌ Error loading dashboard:', error);
//       showToast.error('Failed to load dashboard data');
//     } finally {
//       setIsLoading(false);
//       console.log('🏁 ===== LOADING DASHBOARD DATA COMPLETED =====');
//     }
//   };

//   const getDateParams = () => {
//     const today = new Date();
    
//     switch(dateRange) {
//       case 'today':
//         return { 
//           period: 'today',
//           startDate: format(today, 'yyyy-MM-dd'),
//           endDate: format(today, 'yyyy-MM-dd')
//         };
//       case 'week':
//         const weekStart = startOfWeek(today);
//         const weekEnd = endOfWeek(today);
//         return {
//           period: 'week',
//           startDate: format(weekStart, 'yyyy-MM-dd'),
//           endDate: format(weekEnd, 'yyyy-MM-dd')
//         };
//       case 'month':
//         return { 
//           period: 'month',
//           startDate: format(startOfMonth(today), 'yyyy-MM-dd'),
//           endDate: format(endOfMonth(today), 'yyyy-MM-dd')
//         };
//       case 'custom':
//         return {
//           period: 'custom',
//           startDate: customStartDate,
//           endDate: customEndDate
//         };
//       default:
//         return { period: 'month' };
//     }
//   };

//   // ===== APPLY CUSTOM DATE RANGE =====
//   const handleApplyCustomRange = () => {
//     if (!customStartDate || !customEndDate) {
//       showToast.error('Please select both start and end dates');
//       return;
//     }
    
//     if (new Date(customStartDate) > new Date(customEndDate)) {
//       showToast.error('Start date cannot be after end date');
//       return;
//     }
    
//     setDateRange('custom');
//     setShowCustomPicker(false);
//     loadDashboardData();
//     showToast.success(`Showing data from ${customStartDate} to ${customEndDate}`);
//   };

//   // ===== Generate Revenue Chart Data =====
//   const generateRevenueChartData = () => {
//     console.log('💰 Generating revenue chart data for:', dateRange);
    
//     let data = [];
//     const today = new Date();
    
//     switch(dateRange) {
//       case 'today':
//         for (let i = 0; i < 8; i++) {
//           data.push({
//             time: `${i+9} AM`,
//             revenue: Math.floor(Math.random() * 5000) + 1000,
//             expense: Math.floor(Math.random() * 2000) + 500
//           });
//         }
//         break;
        
//       case 'week':
//         for (let i = 6; i >= 0; i--) {
//           const date = subDays(today, i);
//           data.push({
//             day: format(date, 'EEE'),
//             revenue: Math.floor(Math.random() * 15000) + 5000,
//             expense: Math.floor(Math.random() * 5000) + 2000
//           });
//         }
//         break;
        
//       case 'month':
//       default:
//         data = [
//           { day: 'Week 1', revenue: Math.floor(Math.random() * 50000) + 20000, expense: Math.floor(Math.random() * 20000) + 10000 },
//           { day: 'Week 2', revenue: Math.floor(Math.random() * 50000) + 20000, expense: Math.floor(Math.random() * 20000) + 10000 },
//           { day: 'Week 3', revenue: Math.floor(Math.random() * 50000) + 20000, expense: Math.floor(Math.random() * 20000) + 10000 },
//           { day: 'Week 4', revenue: Math.floor(Math.random() * 50000) + 20000, expense: Math.floor(Math.random() * 20000) + 10000 }
//         ];
//         break;
//     }
    
//     setRevenueData(data);
//   };

//   // ===== PREPARE ORDER STATUS DATA =====
//   const getOrderStatusData = () => {
//     const data = [];
    
//     if (orderStats.confirmed > 0) {
//       data.push({ 
//         name: 'Confirmed', 
//         value: orderStats.confirmed, 
//         color: STATUS_CONFIG.confirmed.color 
//       });
//     }
    
//     if (orderStats['in-progress'] > 0) {
//       data.push({ 
//         name: 'In Progress', 
//         value: orderStats['in-progress'], 
//         color: STATUS_CONFIG['in-progress'].color 
//       });
//     }
    
//     if (orderStats['ready-to-delivery'] > 0) {
//       data.push({ 
//         name: 'Ready', 
//         value: orderStats['ready-to-delivery'], 
//         color: STATUS_CONFIG['ready-to-delivery'].color 
//       });
//     }
    
//     if (orderStats.delivered > 0) {
//       data.push({ 
//         name: 'Delivered', 
//         value: orderStats.delivered, 
//         color: STATUS_CONFIG.delivered.color 
//       });
//     }
    
//     if (orderStats.cancelled > 0) {
//       data.push({ 
//         name: 'Cancelled', 
//         value: orderStats.cancelled, 
//         color: STATUS_CONFIG.cancelled.color 
//       });
//     }
    
//     if (orderStats.draft > 0) {
//       data.push({ 
//         name: 'Draft', 
//         value: orderStats.draft, 
//         color: STATUS_CONFIG.draft.color 
//       });
//     }
    
//     return data;
//   };

//   const orderStatusData = getOrderStatusData();
//   const hasOrderData = orderStatusData.length > 0;

//   // ===== PREPARE WORK STATUS DATA =====
//   const getWorkStatusData = () => {
//     return [
//       { name: 'Pending', value: workStats.pending || 0, color: '#f59e0b' },
//       { name: 'In Progress', value: workStats.inProgress || 0, color: '#3b82f6' },
//       { name: 'Completed', value: workStats.completed || 0, color: '#10b981' },
//       { name: 'Cancelled', value: workStats.cancelled || 0, color: '#ef4444' }
//     ].filter(item => item.value > 0);
//   };

//   const workStatusData = getWorkStatusData();
//   const hasWorkData = workStatusData.length > 0;

//   // Safe formatting
//   const safeFormat = (value) => {
//     return (value || 0).toLocaleString('en-IN');
//   };

//   // Get status badge
//   const getStatusBadge = (status) => {
//     const config = STATUS_CONFIG[status] || STATUS_CONFIG.draft;
//     return `${config.bg} text-gray-700 px-2 py-1 text-xs rounded-full`;
//   };

//   return (
//     <div className="min-h-screen bg-slate-50 p-6">
//       {/* ===== HEADER WITH CUSTOM DATE RANGE ===== */}
//       <div className="mb-8">
//         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//           <div>
//             <h1 className="text-3xl font-black text-slate-800 mb-2">
//               Admin Dashboard
//             </h1>
//             <p className="text-slate-600 flex items-center gap-2">
//               <Clock size={16} />
//               {format(new Date(), 'EEEE, MMMM do, yyyy')}
//             </p>
//             <p className="text-xs text-gray-400 mt-1">
//               Last refreshed: {format(lastRefreshed, 'hh:mm:ss a')}
//             </p>
//           </div>

//           {/* Filter Buttons with Custom Range */}
//           <div className="flex flex-wrap gap-2 bg-white p-2 rounded-xl shadow-sm">
//             <button
//               onClick={() => {
//                 setDateRange('today');
//                 setShowCustomPicker(false);
//               }}
//               className={`px-4 py-2 rounded-lg font-medium transition-all ${
//                 dateRange === 'today' && !showCustomPicker ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-slate-100'
//               }`}
//             >
//               Today
//             </button>
//             <button
//               onClick={() => {
//                 setDateRange('week');
//                 setShowCustomPicker(false);
//               }}
//               className={`px-4 py-2 rounded-lg font-medium transition-all ${
//                 dateRange === 'week' && !showCustomPicker ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-slate-100'
//               }`}
//             >
//               This Week
//             </button>
//             <button
//               onClick={() => {
//                 setDateRange('month');
//                 setShowCustomPicker(false);
//               }}
//               className={`px-4 py-2 rounded-lg font-medium transition-all ${
//                 dateRange === 'month' && !showCustomPicker ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-slate-100'
//               }`}
//             >
//               This Month
//             </button>
//             <button
//               onClick={() => setShowCustomPicker(!showCustomPicker)}
//               className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-1 ${
//                 showCustomPicker || dateRange === 'custom' ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-slate-100'
//               }`}
//             >
//               <Calendar size={16} />
//               Custom
//             </button>
//             <button
//               onClick={loadDashboardData}
//               className="p-2 hover:bg-slate-100 rounded-lg transition-all"
//               title="Refresh"
//             >
//               <RefreshCw size={18} className={isLoading ? 'animate-spin text-blue-600' : ''} />
//             </button>
//           </div>
//         </div>

//         {/* Custom Date Range Picker */}
//         {showCustomPicker && (
//           <div className="mt-4 bg-white p-4 rounded-xl shadow-sm border border-blue-100">
//             <div className="flex flex-wrap items-end gap-4">
//               <div>
//                 <label className="block text-xs font-medium text-slate-500 mb-1">Start Date</label>
//                 <input
//                   type="date"
//                   value={customStartDate}
//                   onChange={(e) => setCustomStartDate(e.target.value)}
//                   className="px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
//                   max={customEndDate}
//                 />
//               </div>
//               <div>
//                 <label className="block text-xs font-medium text-slate-500 mb-1">End Date</label>
//                 <input
//                   type="date"
//                   value={customEndDate}
//                   onChange={(e) => setCustomEndDate(e.target.value)}
//                   className="px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
//                   min={customStartDate}
//                 />
//               </div>
//               <button
//                 onClick={handleApplyCustomRange}
//                 className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all"
//               >
//                 Apply Range
//               </button>
//               <button
//                 onClick={() => setShowCustomPicker(false)}
//                 className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg font-medium hover:bg-slate-200 transition-all"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Active Filter Indicator */}
//         <p className="text-xs text-blue-600 mt-2">
//           Showing: {
//             dateRange === 'today' ? 'Today' :
//             dateRange === 'week' ? 'This Week' :
//             dateRange === 'month' ? 'This Month' :
//             `Custom (${customStartDate} to ${customEndDate})`
//           }
//         </p>
//       </div>

//       {/* ===== KPI CARDS ===== */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//         {/* Card 1 - Total Orders */}
//         <StatCard
//           title="Total Orders"
//           value={safeFormat(orderStats?.total || 0)}
//           icon={<ShoppingCart className="text-blue-600" size={24} />}
//           bgColor="bg-blue-50"
//           borderColor="border-blue-200"
//         >
//           <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
//             <div className="bg-white p-2 rounded-lg">
//               <span className="text-slate-500">Pending</span>
//               <p className="font-bold text-orange-600">
//                 {(orderStats?.confirmed || 0) + (orderStats?.draft || 0)}
//               </p>
//             </div>
//             <div className="bg-white p-2 rounded-lg">
//               <span className="text-slate-500">In Progress</span>
//               <p className="font-bold text-blue-600">
//                 {(orderStats?.cutting || 0) + (orderStats?.stitching || 0) + (orderStats?.['in-progress'] || 0)}
//               </p>
//             </div>
//             <div className="bg-white p-2 rounded-lg">
//               <span className="text-slate-500">Completed</span>
//               <p className="font-bold text-green-600">{orderStats?.delivered || 0}</p>
//             </div>
//           </div>
//         </StatCard>

//         {/* Card 2 - Revenue */}
//         <StatCard
//           title="Revenue"
//           value="₹0"
//           icon={<IndianRupee className="text-green-600" size={24} />}
//           bgColor="bg-green-50"
//           borderColor="border-green-200"
//         >
//           <div className="mt-3 text-center text-xs text-slate-500">
//             Coming soon
//           </div>
//         </StatCard>

//         {/* Card 3 - Total Works */}
//         <StatCard
//           title="Total Works"
//           value={safeFormat(workStats?.total || 0)}
//           icon={<Layers className="text-purple-600" size={24} />}
//           bgColor="bg-purple-50"
//           borderColor="border-purple-200"
//         >
//           <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
//             <div className="bg-white p-2 rounded-lg">
//               <span className="text-slate-500">Pending</span>
//               <p className="font-bold text-orange-600">{workStats?.pending || 0}</p>
//             </div>
//             <div className="bg-white p-2 rounded-lg">
//               <span className="text-slate-500">In Progress</span>
//               <p className="font-bold text-blue-600">{workStats?.inProgress || 0}</p>
//             </div>
//             <div className="bg-white p-2 rounded-lg">
//               <span className="text-slate-500">Completed</span>
//               <p className="font-bold text-green-600">{workStats?.completed || 0}</p>
//             </div>
//           </div>
//         </StatCard>

//         {/* Card 4 - Active Tailors */}
//         <StatCard
//           title="Active Tailors"
//           value={safeFormat(tailorStats?.active || 0)}
//           icon={<Scissors className="text-purple-600" size={24} />}
//           bgColor="bg-purple-50"
//           borderColor="border-purple-200"
//         >
//           <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
//             <div className="bg-white p-2 rounded-lg">
//               <span className="text-slate-500">Working</span>
//               <p className="font-bold text-green-600">{tailorStats?.busy || 0}</p>
//             </div>
//             <div className="bg-white p-2 rounded-lg">
//               <span className="text-slate-500">Idle</span>
//               <p className="font-bold text-slate-600">{tailorStats?.idle || 0}</p>
//             </div>
//             <div className="bg-white p-2 rounded-lg">
//               <span className="text-slate-500">Leave</span>
//               <p className="font-bold text-orange-600">{tailorStats?.onLeave || 0}</p>
//             </div>
//           </div>
//         </StatCard>
//       </div>

//       {/* ===== ROW 1: ORDERS OVERVIEW + RECENT ORDERS ===== */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
//         {/* Orders Status Chart */}
//         <div className="bg-white rounded-xl p-6 shadow-sm">
//           <div className="flex items-center justify-between mb-4">
//             <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
//               <Package size={20} className="text-blue-600" />
//               Orders Overview
//               <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
//                 {dateRange === 'today' ? 'Today' : 
//                  dateRange === 'week' ? 'This Week' : 
//                  dateRange === 'month' ? 'This Month' : 'Custom'}
//               </span>
//             </h2>
//             <Link to="/admin/orders" className="text-blue-600 text-sm hover:underline flex items-center gap-1">
//               View All <ArrowRight size={14} />
//             </Link>
//           </div>
          
//           {hasOrderData ? (
//             <>
//               <div className="h-64">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <RePieChart>
//                     <Pie
//                       data={orderStatusData}
//                       cx="50%"
//                       cy="50%"
//                       innerRadius={60}
//                       outerRadius={80}
//                       paddingAngle={5}
//                       dataKey="value"
//                       label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
//                     >
//                       {orderStatusData.map((entry) => (
//                         <Cell key={`cell-${entry.name}`} fill={entry.color} />
//                       ))}
//                     </Pie>
//                     <Tooltip />
//                     <Legend />
//                   </RePieChart>
//                 </ResponsiveContainer>
//               </div>
              
//               <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-4">
//                 {Object.entries(STATUS_CONFIG).map(([status, config]) => {
//                   const count = orderStats[status] || 0;
//                   if (count === 0) return null;
//                   return (
//                     <div key={status} className="flex items-center gap-1 text-xs">
//                       <span className="w-2 h-2 rounded-full" style={{ backgroundColor: config.color }}></span>
//                       <span className="text-slate-600">{config.label}</span>
//                       <span className="font-bold text-slate-800 ml-auto">{count}</span>
//                     </div>
//                   );
//                 })}
//               </div>
//             </>
//           ) : (
//             <div className="h-64 flex items-center justify-center text-slate-400">
//               <Package size={48} className="opacity-30" />
//               <p className="text-sm ml-2">No orders for this period</p>
//             </div>
//           )}
//         </div>

//         {/* Recent Orders */}
//         <div className="bg-white rounded-xl shadow-sm">
//           <div className="p-6 border-b border-slate-100 flex items-center justify-between">
//             <h2 className="font-bold text-slate-800 flex items-center gap-2">
//               <ShoppingCart size={18} className="text-blue-600" />
//               Recent Orders
//               <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
//                 {dateRange === 'today' ? 'Today' : 
//                  dateRange === 'week' ? 'This Week' : 
//                  dateRange === 'month' ? 'This Month' : 'Custom'}
//               </span>
//             </h2>
//             <Link to="/admin/orders" className="text-blue-600 text-sm hover:underline">View All</Link>
//           </div>
          
//           {recentOrders.length > 0 ? (
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead className="bg-slate-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-slate-500">Order ID</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-slate-500">Customer</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-slate-500">Items</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-slate-500">Status</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-slate-500">Action</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-slate-100">
//                   {recentOrders.slice(0, 5).map((order) => (
//                     <tr key={order._id} className="hover:bg-slate-50">
//                       <td className="px-6 py-4 font-medium">#{order.orderId}</td>
//                       <td className="px-6 py-4">{order.customer?.name || 'N/A'}</td>
//                       <td className="px-6 py-4">{order.garments?.length || 0}</td>
//                       <td className="px-6 py-4">
//                         <span className={getStatusBadge(order.status)}>
//                           {STATUS_CONFIG[order.status]?.label || order.status}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4">
//                         <Link to={`/admin/orders/${order._id}`} className="text-blue-600">
//                           <Eye size={16} />
//                         </Link>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <div className="p-8 text-center text-slate-400">
//               <ShoppingCart size={40} className="mx-auto mb-2 opacity-30" />
//               <p>No recent orders</p>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* ===== ROW 2: REVENUE TREND CHART - FULL WIDTH ===== */}
//       <div className="mb-8">
//         <div className="bg-white rounded-xl p-6 shadow-sm">
//           <div className="flex items-center justify-between mb-6">
//             <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
//               <TrendingUp size={24} className="text-green-600" />
//               Revenue Trend
//               <span className="text-xs bg-green-100 text-green-600 px-3 py-1 rounded-full">
//                 {dateRange === 'today' ? 'Today (Hourly)' : 
//                  dateRange === 'week' ? 'Last 7 Days' : 
//                  dateRange === 'month' ? 'This Month' : 'Custom Range'}
//               </span>
//             </h2>
            
//             <div className="flex items-center gap-4">
//               <div className="flex items-center gap-2">
//                 <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
//                 <span className="text-sm text-slate-600">Revenue</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <div className="w-3 h-3 bg-red-500 rounded-full"></div>
//                 <span className="text-sm text-slate-600">Expense</span>
//               </div>
//             </div>
//           </div>
          
//           {revenueData.length > 0 ? (
//             <>
//               <div className="h-80">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <LineChart data={revenueData}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey={dateRange === 'today' ? 'time' : 'day'} />
//                     <YAxis tickFormatter={(value) => `₹${value/1000}K`} />
//                     <Tooltip formatter={(value) => `₹${value}`} />
//                     <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} />
//                     <Line type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={3} />
//                   </LineChart>
//                 </ResponsiveContainer>
//               </div>

//               <div className="grid grid-cols-3 gap-6 mt-8">
//                 <div className="bg-blue-50 p-4 rounded-lg">
//                   <p className="text-sm text-blue-600">Total Revenue</p>
//                   <p className="text-2xl font-bold text-blue-800">
//                     ₹{safeFormat(revenueData.reduce((sum, i) => sum + i.revenue, 0))}
//                   </p>
//                 </div>
//                 <div className="bg-red-50 p-4 rounded-lg">
//                   <p className="text-sm text-red-600">Total Expense</p>
//                   <p className="text-2xl font-bold text-red-800">
//                     ₹{safeFormat(revenueData.reduce((sum, i) => sum + i.expense, 0))}
//                   </p>
//                 </div>
//                 <div className="bg-green-50 p-4 rounded-lg">
//                   <p className="text-sm text-green-600">Net Profit</p>
//                   <p className="text-2xl font-bold text-green-800">
//                     ₹{safeFormat(
//                       revenueData.reduce((sum, i) => sum + i.revenue, 0) -
//                       revenueData.reduce((sum, i) => sum + i.expense, 0)
//                     )}
//                   </p>
//                 </div>
//               </div>
//             </>
//           ) : (
//             <div className="h-80 flex items-center justify-center text-slate-400">
//               <TrendingUp size={48} className="opacity-30" />
//               <p className="text-lg ml-2">No revenue data</p>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* ===== ROW 3: WORKS OVERVIEW + TAILOR PERFORMANCE ===== */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
//         {/* WORKS OVERVIEW - Left Side */}
//         <div className="bg-white rounded-xl p-6 shadow-sm">
//           <div className="flex items-center justify-between mb-4">
//             <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
//               <Layers size={20} className="text-purple-600" />
//               Works Overview
//               <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">
//                 {dateRange === 'today' ? 'Today' : 
//                  dateRange === 'week' ? 'This Week' : 
//                  dateRange === 'month' ? 'This Month' : 'Custom'}
//               </span>
//             </h2>
//             <Link to="/admin/works" className="text-purple-600 text-sm hover:underline flex items-center gap-1">
//               View All <ArrowRight size={14} />
//             </Link>
//           </div>

//           {/* Work Status Chart */}
//           <div className="grid grid-cols-2 gap-6">
//             {/* Pie Chart */}
//             <div className="h-48">
//               <ResponsiveContainer width="100%" height="100%">
//                 <RePieChart>
//                   <Pie
//                     data={workStatusData}
//                     cx="50%"
//                     cy="50%"
//                     innerRadius={40}
//                     outerRadius={60}
//                     paddingAngle={5}
//                     dataKey="value"
//                   >
//                     {workStatusData.map((entry, index) => (
//                       <Cell key={`cell-${index}`} fill={entry.color} />
//                     ))}
//                   </Pie>
//                   <Tooltip />
//                 </RePieChart>
//               </ResponsiveContainer>
//             </div>

//             {/* Status List */}
//             <div className="space-y-3">
//               {Object.entries(WORK_STATUS_COLORS).map(([status, color]) => {
//                 const count = workStats[status] || 0;
//                 if (count === 0 && status !== 'pending') return null;
//                 return (
//                   <div key={status} className="flex items-center justify-between">
//                     <div className="flex items-center gap-2">
//                       <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }}></span>
//                       <span className="text-sm capitalize text-slate-600">{status}</span>
//                     </div>
//                     <span className="font-bold text-slate-800">{count}</span>
//                   </div>
//                 );
//               })}
//               <div className="pt-2 border-t border-slate-100">
//                 <div className="flex items-center justify-between font-medium">
//                   <span className="text-sm text-slate-600">Total Works</span>
//                   <span className="font-bold text-purple-600">{workStats.total || 0}</span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Recent Works */}
//           <div className="mt-6">
//             <h3 className="text-sm font-semibold text-slate-700 mb-3">Recent Works</h3>
//             <div className="space-y-2">
//               {recentWorks.slice(0, 3).map((work) => (
//                 <div key={work._id} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
//                   <div>
//                     <p className="text-sm font-medium text-slate-800">{work.workId}</p>
//                     <p className="text-xs text-slate-500">{work.garment?.name || 'Garment'}</p>
//                   </div>
//                   <span className={`px-2 py-1 text-xs rounded-full ${
//                     work.status === 'completed' ? 'bg-green-100 text-green-700' :
//                     work.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
//                     work.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
//                     'bg-red-100 text-red-700'
//                   }`}>
//                     {work.status}
//                   </span>
//                 </div>
//               ))}
//               {recentWorks.length === 0 && (
//                 <p className="text-sm text-slate-400 text-center py-2">No recent works</p>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* TAILOR PERFORMANCE - Right Side */}
//         <div className="bg-white rounded-xl p-6 shadow-sm">
//           <div className="flex items-center justify-between mb-4">
//             <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
//               <Scissors size={20} className="text-purple-600" />
//               Tailor Performance
//               <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">
//                 {dateRange === 'today' ? 'Today' : 
//                  dateRange === 'week' ? 'This Week' : 
//                  dateRange === 'month' ? 'This Month' : 'Custom'}
//               </span>
//             </h2>
//             <Link to="/admin/tailors" className="text-purple-600 text-sm hover:underline flex items-center gap-1">
//               View All <ArrowRight size={14} />
//             </Link>
//           </div>

//           {/* Tailor Status Cards */}
//           <div className="grid grid-cols-2 gap-3 mb-6">
//             <div className="bg-green-50 p-3 rounded-lg">
//               <div className="flex items-center gap-2">
//                 <UserCheck size={16} className="text-green-600" />
//                 <span className="text-xs text-green-600">Active</span>
//               </div>
//               <p className="text-xl font-bold text-green-700">{tailorStats.active || 0}</p>
//             </div>
//             <div className="bg-blue-50 p-3 rounded-lg">
//               <div className="flex items-center gap-2">
//                 <Loader size={16} className="text-blue-600" />
//                 <span className="text-xs text-blue-600">Working</span>
//               </div>
//               <p className="text-xl font-bold text-blue-700">{tailorStats.busy || 0}</p>
//             </div>
//             <div className="bg-slate-50 p-3 rounded-lg">
//               <div className="flex items-center gap-2">
//                 <UserX size={16} className="text-slate-600" />
//                 <span className="text-xs text-slate-600">Idle</span>
//               </div>
//               <p className="text-xl font-bold text-slate-700">{tailorStats.idle || 0}</p>
//             </div>
//             <div className="bg-orange-50 p-3 rounded-lg">
//               <div className="flex items-center gap-2">
//                 <Calendar size={16} className="text-orange-600" />
//                 <span className="text-xs text-orange-600">On Leave</span>
//               </div>
//               <p className="text-xl font-bold text-orange-700">{tailorStats.onLeave || 0}</p>
//             </div>
//           </div>

//           {/* Performance List */}
//           <h3 className="text-sm font-semibold text-slate-700 mb-3">Top Performers</h3>
//           <div className="space-y-3">
//             {tailorPerformance.slice(0, 4).map((tailor, index) => (
//               <div key={tailor._id || index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
//                 <div className="flex items-center gap-3">
//                   <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
//                     index === 0 ? 'bg-yellow-500' :
//                     index === 1 ? 'bg-slate-500' :
//                     index === 2 ? 'bg-orange-500' : 'bg-blue-500'
//                   }`}>
//                     {index + 1}
//                   </div>
//                   <div>
//                     <p className="font-medium text-slate-800">{tailor.name || 'Tailor'}</p>
//                     <p className="text-xs text-slate-500">{tailor.specialization || 'General'}</p>
//                   </div>
//                 </div>
//                 <div className="text-right">
//                   <p className="font-bold text-blue-600">{tailor.completedWorks || 0}</p>
//                   <p className="text-xs text-slate-500">completed</p>
//                 </div>
//               </div>
//             ))}
//             {tailorPerformance.length === 0 && (
//               <p className="text-sm text-slate-400 text-center py-4">No performance data</p>
//             )}
//           </div>

//           {/* Quick Stats */}
//           <div className="mt-4 pt-4 border-t border-slate-100">
//             <div className="flex items-center justify-between text-sm">
//               <span className="text-slate-600">Avg. Completion Time</span>
//               <span className="font-bold text-green-600">3.5 days</span>
//             </div>
//             <div className="flex items-center justify-between text-sm mt-1">
//               <span className="text-slate-600">Productivity Rate</span>
//               <span className="font-bold text-blue-600">85%</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ===== QUICK ACTIONS FLOATING MENU ===== */}
//       <div className="fixed bottom-6 right-6 z-50">
//         <div className="relative group">
//           {/* Main FAB Button */}
//           <button className="w-14 h-14 bg-blue-600 hover:bg-blue-700 rounded-full shadow-lg flex items-center justify-center text-white transition-all group-hover:scale-110 group-hover:shadow-xl">
//             <Plus size={24} />
//           </button>
          
//           {/* Quick Actions Menu - Appears on hover */}
//           <div className="absolute bottom-16 right-0 bg-white rounded-xl shadow-xl p-2 min-w-[220px] hidden group-hover:block animate-fade-in-up">
//             {/* Header */}
//             <div className="text-sm font-medium text-slate-700 px-3 py-2 border-b border-slate-100 mb-1">
//               Quick Actions
//             </div>
            
//             {/* Menu Items */}
//             <Link 
//               to="/admin/orders/new" 
//               className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 rounded-lg text-slate-600 transition-all group/item"
//             >
//               <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center group-hover/item:bg-blue-200 transition-all">
//                 <ShoppingCart size={16} className="text-blue-600" />
//               </div>
//               <div className="flex-1">
//                 <span className="text-sm font-medium">New Order</span>
//                 <p className="text-xs text-slate-400">Create a new order</p>
//               </div>
//             </Link>

//             <Link 
//               to="/admin/customers/new" 
//               className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 rounded-lg text-slate-600 transition-all group/item"
//             >
//               <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center group-hover/item:bg-green-200 transition-all">
//                 <UserPlus size={16} className="text-green-600" />
//               </div>
//               <div className="flex-1">
//                 <span className="text-sm font-medium">Add Customer</span>
//                 <p className="text-xs text-slate-400">Register new customer</p>
//               </div>
//             </Link>

//             <Link 
//               to="/admin/transactions/expense" 
//               className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 rounded-lg text-slate-600 transition-all group/item"
//             >
//               <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center group-hover/item:bg-red-200 transition-all">
//                 <Receipt size={16} className="text-red-600" />
//               </div>
//               <div className="flex-1">
//                 <span className="text-sm font-medium">Add Expense</span>
//                 <p className="text-xs text-slate-400">Record an expense</p>
//               </div>
//             </Link>

//             <Link 
//               to="/admin/transactions/income" 
//               className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 rounded-lg text-slate-600 transition-all group/item"
//             >
//               <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center group-hover/item:bg-green-200 transition-all">
//                 <DollarSign size={16} className="text-green-600" />
//               </div>
//               <div className="flex-1">
//                 <span className="text-sm font-medium">Add Income</span>
//                 <p className="text-xs text-slate-400">Record an income</p>
//               </div>
//             </Link>

//             {/* Divider */}
//             <div className="border-t border-slate-100 my-1"></div>

//             {/* View All Link */}
//             <Link 
//               to="/admin/quick-actions" 
//               className="flex items-center justify-between px-3 py-2 hover:bg-slate-50 rounded-lg text-blue-600 text-sm"
//             >
//               <span>View all actions</span>
//               <ArrowRight size={14} />
//             </Link>
//           </div>
//         </div>
//       </div>

//       {/* Loading Overlay */}
//       {isLoading && (
//         <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
//           <div className="bg-white rounded-xl p-4 flex items-center gap-3 shadow-xl">
//             <RefreshCw size={20} className="animate-spin text-blue-600" />
//             <span>Loading dashboard...</span>
//           </div>
//         </div>
//       )}

//       {/* Add animation styles */}
//       <style jsx>{`
//         @keyframes fadeInUp {
//           from {
//             opacity: 0;
//             transform: translateY(10px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
//         .animate-fade-in-up {
//           animation: fadeInUp 0.2s ease-out;
//         }
//       `}</style>
//     </div>
//   );
// }









// // Pages/Dashboard/AdminDashboard.jsx - WITH CORRECT TRANSACTION SLICE SELECTORS
// import React, { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { Link } from 'react-router-dom';
// import {
//   ShoppingCart,
//   IndianRupee,
//   Truck,
//   Scissors,
//   TrendingUp,
//   Clock,
//   ArrowRight,
//   RefreshCw,
//   Eye,
//   Package,
//   AlertCircle,
//   Filter,
//   Calendar,
//   UserCheck,
//   UserX,
//   Award,
//   Layers,
//   CheckCircle,
//   XCircle,
//   Loader,
//   Plus,
//   UserPlus,
//   Receipt,
//   DollarSign
// } from 'lucide-react';
// import {
//   PieChart as RePieChart,
//   Pie,
//   Cell,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   BarChart,
//   Bar
// } from 'recharts';
// import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';

// // IMPORT from orderSlice
// import { 
//   fetchOrderStats, 
//   fetchRecentOrders,
//   selectOrderStats,
//   selectRecentOrders 
// } from '../../features/order/orderSlice';

// // IMPORT from workSlice
// import {
//   fetchWorkStats,
//   fetchRecentWorks,
//   selectWorkStats,
//   selectRecentWorks
// } from '../../features/work/workSlice';

// // IMPORT from tailorSlice
// import {
//   fetchTailorStats,
//   fetchTailorPerformance,
//   selectTailorStats,
//   selectTailorPerformance
// } from '../../features/tailor/tailorSlice';

// // IMPORT from transactionSlice - USING YOUR CORRECT SELECTORS
// import {
//   fetchDailyRevenueStats,
//   selectDailyRevenueData,
//   selectDailyRevenueSummary,
//   selectDailyRevenueLoading,
//   fetchTodayTransactions,
//   selectTodaySummary,
//   selectTodayLoading
// } from '../../features/transaction/transactionSlice';

// import StatCard from '../../components/common/StatCard';
// import showToast from '../../utils/toast';

// export default function AdminDashboard() {
//   const dispatch = useDispatch();
//   const { user } = useSelector((state) => state.auth);
  
//   // ===== DEBUG: Check user info =====
//   console.log('👤 Current User:', user);
  
//   // ===== GET ORDER DATA =====
//   const orderStats = useSelector(selectOrderStats) || {
//     total: 0,
//     pending: 0,
//     cutting: 0,
//     stitching: 0,
//     ready: 0,
//     delivered: 0,
//     cancelled: 0
//   };
  
//   const recentOrders = useSelector(selectRecentOrders) || [];
  
//   // ===== GET WORK DATA =====
//   const workStats = useSelector(selectWorkStats) || {
//     total: 0,
//     pending: 0,
//     inProgress: 0,
//     completed: 0,
//     cancelled: 0
//   };
  
//   const recentWorks = useSelector(selectRecentWorks) || [];
  
//   // ===== GET TAILOR DATA =====
//   const tailorStats = useSelector(selectTailorStats) || {
//     total: 0,
//     active: 0,
//     busy: 0,
//     idle: 0,
//     onLeave: 0
//   };
  
//   const tailorPerformance = useSelector(selectTailorPerformance) || [];
  
//   // ===== GET REVENUE DATA FROM YOUR TRANSACTION SLICE =====
//   const dailyRevenueData = useSelector(selectDailyRevenueData) || [];
//   const dailyRevenueSummary = useSelector(selectDailyRevenueSummary) || {
//     totalRevenue: 0,
//     totalExpense: 0,
//     netProfit: 0,
//     period: 'month',
//     dateRange: { start: null, end: null }
//   };
//   const revenueLoading = useSelector(selectDailyRevenueLoading);
  
//   // ===== GET TODAY'S TRANSACTIONS SUMMARY =====
//   const todaySummary = useSelector(selectTodaySummary) || {
//     totalIncome: 0,
//     totalExpense: 0,
//     netAmount: 0
//   };
//   const todayLoading = useSelector(selectTodayLoading);
  
//   // Loading states
//   const [isLoading, setIsLoading] = useState(false);
//   const [dateRange, setDateRange] = useState('month');
//   const [customStartDate, setCustomStartDate] = useState(format(new Date(), 'yyyy-MM-dd'));
//   const [customEndDate, setCustomEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));
//   const [showCustomPicker, setShowCustomPicker] = useState(false);
//   const [lastRefreshed, setLastRefreshed] = useState(new Date());

//   // ===== STATUS COLORS =====
//   const STATUS_CONFIG = {
//     'draft': { color: '#94a3b8', label: 'Draft', bg: 'bg-slate-100' },
//     'confirmed': { color: '#f59e0b', label: 'Confirmed', bg: 'bg-amber-100' },
//     'in-progress': { color: '#3b82f6', label: 'In Progress', bg: 'bg-blue-100' },
//     'ready-to-delivery': { color: '#10b981', label: 'Ready', bg: 'bg-emerald-100' },
//     'delivered': { color: '#6b7280', label: 'Delivered', bg: 'bg-gray-100' },
//     'cancelled': { color: '#ef4444', label: 'Cancelled', bg: 'bg-red-100' }
//   };

//   const WORK_STATUS_COLORS = {
//     'pending': '#f59e0b',
//     'in-progress': '#3b82f6',
//     'completed': '#10b981',
//     'cancelled': '#ef4444'
//   };

//   // ===== LOAD DATA WHEN FILTER CHANGES =====
//   useEffect(() => {
//     console.log('🔄 Date range changed to:', dateRange);
//     loadDashboardData();
//   }, [dateRange, customStartDate, customEndDate]);

//   const loadDashboardData = async () => {
//     console.log('🚀 ===== LOADING DASHBOARD DATA STARTED =====');
//     console.log('📅 Selected date range:', dateRange);
//     setIsLoading(true);
    
//     try {
//       // Get date parameters based on filter
//       const params = getDateParams();
//       console.log('📅 Date params being sent:', params);
      
//       // Build promises array - USING YOUR fetchDailyRevenueStats
//       const promises = [
//         dispatch(fetchOrderStats(params)),
//         dispatch(fetchRecentOrders({ ...params, limit: 10 })),
//         dispatch(fetchWorkStats(params)),
//         dispatch(fetchRecentWorks({ ...params, limit: 5 })),
//         dispatch(fetchTailorStats()),
//         dispatch(fetchTailorPerformance(params)),
//         dispatch(fetchDailyRevenueStats(params)), // Using your existing thunk
//         dispatch(fetchTodayTransactions()) // Fetch today's transactions
//       ];
      
//       const startTime = Date.now();
//       const results = await Promise.allSettled(promises);
//       const endTime = Date.now();
      
//       console.log(`⏱️ API calls completed in ${endTime - startTime}ms`);
      
//       // Check results
//       const apiNames = ['Order Stats', 'Recent Orders', 'Work Stats', 'Recent Works', 'Tailor Stats', 'Tailor Performance', 'Daily Revenue', 'Today Transactions'];
//       results.forEach((result, index) => {
//         if (result.status === 'fulfilled') {
//           console.log(`✅ ${apiNames[index]} successful:`, result.value);
//         } else {
//           console.error(`❌ ${apiNames[index]} failed:`, result.reason);
//         }
//       });
      
//       setLastRefreshed(new Date());
      
//     } catch (error) {
//       console.error('❌ Error loading dashboard:', error);
//       showToast.error('Failed to load dashboard data');
//     } finally {
//       setIsLoading(false);
//       console.log('🏁 ===== LOADING DASHBOARD DATA COMPLETED =====');
//     }
//   };

//   const getDateParams = () => {
//     const today = new Date();
    
//     switch(dateRange) {
//       case 'today':
//         return { 
//           period: 'today',
//           startDate: format(today, 'yyyy-MM-dd'),
//           endDate: format(today, 'yyyy-MM-dd')
//         };
//       case 'week':
//         const weekStart = startOfWeek(today);
//         const weekEnd = endOfWeek(today);
//         return {
//           period: 'week',
//           startDate: format(weekStart, 'yyyy-MM-dd'),
//           endDate: format(weekEnd, 'yyyy-MM-dd')
//         };
//       case 'month':
//         return { 
//           period: 'month',
//           startDate: format(startOfMonth(today), 'yyyy-MM-dd'),
//           endDate: format(endOfMonth(today), 'yyyy-MM-dd')
//         };
//       case 'custom':
//         return {
//           period: 'custom',
//           startDate: customStartDate,
//           endDate: customEndDate
//         };
//       default:
//         return { period: 'month' };
//     }
//   };

//   // ===== APPLY CUSTOM DATE RANGE =====
//   const handleApplyCustomRange = () => {
//     if (!customStartDate || !customEndDate) {
//       showToast.error('Please select both start and end dates');
//       return;
//     }
    
//     if (new Date(customStartDate) > new Date(customEndDate)) {
//       showToast.error('Start date cannot be after end date');
//       return;
//     }
    
//     setDateRange('custom');
//     setShowCustomPicker(false);
//     loadDashboardData();
//     showToast.success(`Showing data from ${customStartDate} to ${customEndDate}`);
//   };

//   // ===== PREPARE ORDER STATUS DATA =====
//   const getOrderStatusData = () => {
//     const data = [];
    
//     if (orderStats.confirmed > 0) {
//       data.push({ 
//         name: 'Confirmed', 
//         value: orderStats.confirmed, 
//         color: STATUS_CONFIG.confirmed.color 
//       });
//     }
    
//     if (orderStats['in-progress'] > 0) {
//       data.push({ 
//         name: 'In Progress', 
//         value: orderStats['in-progress'], 
//         color: STATUS_CONFIG['in-progress'].color 
//       });
//     }
    
//     if (orderStats['ready-to-delivery'] > 0) {
//       data.push({ 
//         name: 'Ready', 
//         value: orderStats['ready-to-delivery'], 
//         color: STATUS_CONFIG['ready-to-delivery'].color 
//       });
//     }
    
//     if (orderStats.delivered > 0) {
//       data.push({ 
//         name: 'Delivered', 
//         value: orderStats.delivered, 
//         color: STATUS_CONFIG.delivered.color 
//       });
//     }
    
//     if (orderStats.cancelled > 0) {
//       data.push({ 
//         name: 'Cancelled', 
//         value: orderStats.cancelled, 
//         color: STATUS_CONFIG.cancelled.color 
//       });
//     }
    
//     if (orderStats.draft > 0) {
//       data.push({ 
//         name: 'Draft', 
//         value: orderStats.draft, 
//         color: STATUS_CONFIG.draft.color 
//       });
//     }
    
//     return data;
//   };

//   const orderStatusData = getOrderStatusData();
//   const hasOrderData = orderStatusData.length > 0;

//   // ===== PREPARE WORK STATUS DATA =====
//   const getWorkStatusData = () => {
//     return [
//       { name: 'Pending', value: workStats.pending || 0, color: '#f59e0b' },
//       { name: 'In Progress', value: workStats.inProgress || 0, color: '#3b82f6' },
//       { name: 'Completed', value: workStats.completed || 0, color: '#10b981' },
//       { name: 'Cancelled', value: workStats.cancelled || 0, color: '#ef4444' }
//     ].filter(item => item.value > 0);
//   };

//   const workStatusData = getWorkStatusData();
//   const hasWorkData = workStatusData.length > 0;

//   // Safe formatting
//   const safeFormat = (value) => {
//     return (value || 0).toLocaleString('en-IN');
//   };

//   // Get status badge
//   const getStatusBadge = (status) => {
//     const config = STATUS_CONFIG[status] || STATUS_CONFIG.draft;
//     return `${config.bg} text-gray-700 px-2 py-1 text-xs rounded-full`;
//   };

//   // Debug logs
//   console.log('📊 Daily Revenue Data:', dailyRevenueData);
//   console.log('📊 Daily Revenue Summary:', dailyRevenueSummary);
//   console.log('📊 Today Summary:', todaySummary);

//   return (
//     <div className="min-h-screen bg-slate-50 p-6">
//       {/* ===== HEADER WITH CUSTOM DATE RANGE ===== */}
//       <div className="mb-8">
//         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//           <div>
//             <h1 className="text-3xl font-black text-slate-800 mb-2">
//               Admin Dashboard
//             </h1>
//             <p className="text-slate-600 flex items-center gap-2">
//               <Clock size={16} />
//               {format(new Date(), 'EEEE, MMMM do, yyyy')}
//             </p>
//             <p className="text-xs text-gray-400 mt-1">
//               Last refreshed: {format(lastRefreshed, 'hh:mm:ss a')}
//             </p>
//           </div>

//           {/* Filter Buttons with Custom Range */}
//           <div className="flex flex-wrap gap-2 bg-white p-2 rounded-xl shadow-sm">
//             <button
//               onClick={() => {
//                 setDateRange('today');
//                 setShowCustomPicker(false);
//               }}
//               className={`px-4 py-2 rounded-lg font-medium transition-all ${
//                 dateRange === 'today' && !showCustomPicker ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-slate-100'
//               }`}
//             >
//               Today
//             </button>
//             <button
//               onClick={() => {
//                 setDateRange('week');
//                 setShowCustomPicker(false);
//               }}
//               className={`px-4 py-2 rounded-lg font-medium transition-all ${
//                 dateRange === 'week' && !showCustomPicker ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-slate-100'
//               }`}
//             >
//               This Week
//             </button>
//             <button
//               onClick={() => {
//                 setDateRange('month');
//                 setShowCustomPicker(false);
//               }}
//               className={`px-4 py-2 rounded-lg font-medium transition-all ${
//                 dateRange === 'month' && !showCustomPicker ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-slate-100'
//               }`}
//             >
//               This Month
//             </button>
//             <button
//               onClick={() => setShowCustomPicker(!showCustomPicker)}
//               className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-1 ${
//                 showCustomPicker || dateRange === 'custom' ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-slate-100'
//               }`}
//             >
//               <Calendar size={16} />
//               Custom
//             </button>
//             <button
//               onClick={loadDashboardData}
//               className="p-2 hover:bg-slate-100 rounded-lg transition-all"
//               title="Refresh"
//             >
//               <RefreshCw size={18} className={isLoading ? 'animate-spin text-blue-600' : ''} />
//             </button>
//           </div>
//         </div>

//         {/* Custom Date Range Picker */}
//         {showCustomPicker && (
//           <div className="mt-4 bg-white p-4 rounded-xl shadow-sm border border-blue-100">
//             <div className="flex flex-wrap items-end gap-4">
//               <div>
//                 <label className="block text-xs font-medium text-slate-500 mb-1">Start Date</label>
//                 <input
//                   type="date"
//                   value={customStartDate}
//                   onChange={(e) => setCustomStartDate(e.target.value)}
//                   className="px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
//                   max={customEndDate}
//                 />
//               </div>
//               <div>
//                 <label className="block text-xs font-medium text-slate-500 mb-1">End Date</label>
//                 <input
//                   type="date"
//                   value={customEndDate}
//                   onChange={(e) => setCustomEndDate(e.target.value)}
//                   className="px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
//                   min={customStartDate}
//                 />
//               </div>
//               <button
//                 onClick={handleApplyCustomRange}
//                 className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all"
//               >
//                 Apply Range
//               </button>
//               <button
//                 onClick={() => setShowCustomPicker(false)}
//                 className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg font-medium hover:bg-slate-200 transition-all"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Active Filter Indicator */}
//         <p className="text-xs text-blue-600 mt-2">
//           Showing: {
//             dateRange === 'today' ? 'Today' :
//             dateRange === 'week' ? 'This Week' :
//             dateRange === 'month' ? 'This Month' :
//             `Custom (${customStartDate} to ${customEndDate})`
//           }
//         </p>
//       </div>

//       {/* ===== KPI CARDS ===== */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//         {/* Card 1 - Total Orders */}
//         <StatCard
//           title="Total Orders"
//           value={safeFormat(orderStats?.total || 0)}
//           icon={<ShoppingCart className="text-blue-600" size={24} />}
//           bgColor="bg-blue-50"
//           borderColor="border-blue-200"
//         >
//           <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
//             <div className="bg-white p-2 rounded-lg">
//               <span className="text-slate-500">Pending</span>
//               <p className="font-bold text-orange-600">
//                 {(orderStats?.confirmed || 0) + (orderStats?.draft || 0)}
//               </p>
//             </div>
//             <div className="bg-white p-2 rounded-lg">
//               <span className="text-slate-500">In Progress</span>
//               <p className="font-bold text-blue-600">
//                 {(orderStats?.cutting || 0) + (orderStats?.stitching || 0) + (orderStats?.['in-progress'] || 0)}
//               </p>
//             </div>
//             <div className="bg-white p-2 rounded-lg">
//               <span className="text-slate-500">Completed</span>
//               <p className="font-bold text-green-600">{orderStats?.delivered || 0}</p>
//             </div>
//           </div>
//         </StatCard>

//         {/* Card 2 - Revenue - USING YOUR DAILY REVENUE SUMMARY */}
//         <StatCard
//           title="Revenue"
//           value={`₹${safeFormat(dailyRevenueSummary?.totalRevenue || 0)}`}
//           icon={<IndianRupee className="text-green-600" size={24} />}
//           bgColor="bg-green-50"
//           borderColor="border-green-200"
//         >
//           <div className="mt-3 flex justify-between text-xs">
//             <div className="bg-white p-2 rounded-lg flex-1 mr-1">
//               <span className="text-slate-500">Expense</span>
//               <p className="font-bold text-red-600">₹{safeFormat(dailyRevenueSummary?.totalExpense || 0)}</p>
//             </div>
//             <div className="bg-white p-2 rounded-lg flex-1 ml-1">
//               <span className="text-slate-500">Profit</span>
//               <p className="font-bold text-green-600">₹{safeFormat(dailyRevenueSummary?.netProfit || 0)}</p>
//             </div>
//           </div>
//         </StatCard>

//         {/* Card 3 - Total Works */}
//         <StatCard
//           title="Total Works"
//           value={safeFormat(workStats?.total || 0)}
//           icon={<Layers className="text-purple-600" size={24} />}
//           bgColor="bg-purple-50"
//           borderColor="border-purple-200"
//         >
//           <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
//             <div className="bg-white p-2 rounded-lg">
//               <span className="text-slate-500">Pending</span>
//               <p className="font-bold text-orange-600">{workStats?.pending || 0}</p>
//             </div>
//             <div className="bg-white p-2 rounded-lg">
//               <span className="text-slate-500">In Progress</span>
//               <p className="font-bold text-blue-600">{workStats?.inProgress || 0}</p>
//             </div>
//             <div className="bg-white p-2 rounded-lg">
//               <span className="text-slate-500">Completed</span>
//               <p className="font-bold text-green-600">{workStats?.completed || 0}</p>
//             </div>
//           </div>
//         </StatCard>

//         {/* Card 4 - Active Tailors */}
//         <StatCard
//           title="Active Tailors"
//           value={safeFormat(tailorStats?.active || 0)}
//           icon={<Scissors className="text-purple-600" size={24} />}
//           bgColor="bg-purple-50"
//           borderColor="border-purple-200"
//         >
//           <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
//             <div className="bg-white p-2 rounded-lg">
//               <span className="text-slate-500">Working</span>
//               <p className="font-bold text-green-600">{tailorStats?.busy || 0}</p>
//             </div>
//             <div className="bg-white p-2 rounded-lg">
//               <span className="text-slate-500">Idle</span>
//               <p className="font-bold text-slate-600">{tailorStats?.idle || 0}</p>
//             </div>
//             <div className="bg-white p-2 rounded-lg">
//               <span className="text-slate-500">Leave</span>
//               <p className="font-bold text-orange-600">{tailorStats?.onLeave || 0}</p>
//             </div>
//           </div>
//         </StatCard>
//       </div>

//       {/* ===== ROW 1: ORDERS OVERVIEW + RECENT ORDERS ===== */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
//         {/* Orders Status Chart */}
//         <div className="bg-white rounded-xl p-6 shadow-sm">
//           <div className="flex items-center justify-between mb-4">
//             <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
//               <Package size={20} className="text-blue-600" />
//               Orders Overview
//               <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
//                 {dateRange === 'today' ? 'Today' : 
//                  dateRange === 'week' ? 'This Week' : 
//                  dateRange === 'month' ? 'This Month' : 'Custom'}
//               </span>
//             </h2>
//             <Link to="/admin/orders" className="text-blue-600 text-sm hover:underline flex items-center gap-1">
//               View All <ArrowRight size={14} />
//             </Link>
//           </div>
          
//           {hasOrderData ? (
//             <>
//               <div className="h-64">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <RePieChart>
//                     <Pie
//                       data={orderStatusData}
//                       cx="50%"
//                       cy="50%"
//                       innerRadius={60}
//                       outerRadius={80}
//                       paddingAngle={5}
//                       dataKey="value"
//                       label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
//                     >
//                       {orderStatusData.map((entry) => (
//                         <Cell key={`cell-${entry.name}`} fill={entry.color} />
//                       ))}
//                     </Pie>
//                     <Tooltip />
//                     <Legend />
//                   </RePieChart>
//                 </ResponsiveContainer>
//               </div>
              
//               <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-4">
//                 {Object.entries(STATUS_CONFIG).map(([status, config]) => {
//                   const count = orderStats[status] || 0;
//                   if (count === 0) return null;
//                   return (
//                     <div key={status} className="flex items-center gap-1 text-xs">
//                       <span className="w-2 h-2 rounded-full" style={{ backgroundColor: config.color }}></span>
//                       <span className="text-slate-600">{config.label}</span>
//                       <span className="font-bold text-slate-800 ml-auto">{count}</span>
//                     </div>
//                   );
//                 })}
//               </div>
//             </>
//           ) : (
//             <div className="h-64 flex items-center justify-center text-slate-400">
//               <Package size={48} className="opacity-30" />
//               <p className="text-sm ml-2">No orders for this period</p>
//             </div>
//           )}
//         </div>

//         {/* Recent Orders */}
//         <div className="bg-white rounded-xl shadow-sm">
//           <div className="p-6 border-b border-slate-100 flex items-center justify-between">
//             <h2 className="font-bold text-slate-800 flex items-center gap-2">
//               <ShoppingCart size={18} className="text-blue-600" />
//               Recent Orders
//               <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
//                 {dateRange === 'today' ? 'Today' : 
//                  dateRange === 'week' ? 'This Week' : 
//                  dateRange === 'month' ? 'This Month' : 'Custom'}
//               </span>
//             </h2>
//             <Link to="/admin/orders" className="text-blue-600 text-sm hover:underline">View All</Link>
//           </div>
          
//           {recentOrders.length > 0 ? (
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead className="bg-slate-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-slate-500">Order ID</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-slate-500">Customer</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-slate-500">Items</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-slate-500">Status</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-slate-500">Action</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-slate-100">
//                   {recentOrders.slice(0, 5).map((order) => (
//                     <tr key={order._id} className="hover:bg-slate-50">
//                       <td className="px-6 py-4 font-medium">#{order.orderId}</td>
//                       <td className="px-6 py-4">{order.customer?.name || 'N/A'}</td>
//                       <td className="px-6 py-4">{order.garments?.length || 0}</td>
//                       <td className="px-6 py-4">
//                         <span className={getStatusBadge(order.status)}>
//                           {STATUS_CONFIG[order.status]?.label || order.status}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4">
//                         <Link to={`/admin/orders/${order._id}`} className="text-blue-600">
//                           <Eye size={16} />
//                         </Link>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <div className="p-8 text-center text-slate-400">
//               <ShoppingCart size={40} className="mx-auto mb-2 opacity-30" />
//               <p>No recent orders</p>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* ===== ROW 2: REVENUE TREND CHART - USING DAILY REVENUE DATA ===== */}
//       <div className="mb-8">
//         <div className="bg-white rounded-xl p-6 shadow-sm">
//           <div className="flex items-center justify-between mb-6">
//             <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
//               <TrendingUp size={24} className="text-green-600" />
//               Revenue Trend
//               <span className="text-xs bg-green-100 text-green-600 px-3 py-1 rounded-full">
//                 {dateRange === 'today' ? 'Today (Hourly)' : 
//                  dateRange === 'week' ? 'Last 7 Days' : 
//                  dateRange === 'month' ? 'This Month' : 'Custom Range'}
//               </span>
//             </h2>
            
//             <div className="flex items-center gap-4">
//               <div className="flex items-center gap-2">
//                 <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
//                 <span className="text-sm text-slate-600">Revenue</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <div className="w-3 h-3 bg-red-500 rounded-full"></div>
//                 <span className="text-sm text-slate-600">Expense</span>
//               </div>
//             </div>
//           </div>
          
//           {revenueLoading ? (
//             <div className="h-80 flex items-center justify-center">
//               <Loader size={32} className="animate-spin text-blue-600" />
//               <span className="ml-2 text-slate-600">Loading revenue data...</span>
//             </div>
//           ) : dailyRevenueData && dailyRevenueData.length > 0 ? (
//             <>
//               <div className="h-80">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <LineChart data={dailyRevenueData}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey={dateRange === 'today' ? 'time' : 'day'} />
//                     <YAxis tickFormatter={(value) => `₹${value/1000}K`} />
//                     <Tooltip formatter={(value) => `₹${value}`} />
//                     <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} />
//                     <Line type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={3} />
//                   </LineChart>
//                 </ResponsiveContainer>
//               </div>

//               <div className="grid grid-cols-3 gap-6 mt-8">
//                 <div className="bg-blue-50 p-4 rounded-lg">
//                   <p className="text-sm text-blue-600">Total Revenue</p>
//                   <p className="text-2xl font-bold text-blue-800">
//                     ₹{safeFormat(dailyRevenueSummary?.totalRevenue || 0)}
//                   </p>
//                 </div>
//                 <div className="bg-red-50 p-4 rounded-lg">
//                   <p className="text-sm text-red-600">Total Expense</p>
//                   <p className="text-2xl font-bold text-red-800">
//                     ₹{safeFormat(dailyRevenueSummary?.totalExpense || 0)}
//                   </p>
//                 </div>
//                 <div className="bg-green-50 p-4 rounded-lg">
//                   <p className="text-sm text-green-600">Net Profit</p>
//                   <p className="text-2xl font-bold text-green-800">
//                     ₹{safeFormat(dailyRevenueSummary?.netProfit || 0)}
//                   </p>
//                 </div>
//               </div>
//             </>
//           ) : (
//             <div className="h-80 flex items-center justify-center text-slate-400">
//               <TrendingUp size={48} className="opacity-30" />
//               <p className="text-lg ml-2">No revenue data available for this period</p>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* ===== ROW 3: WORKS OVERVIEW + TAILOR PERFORMANCE ===== */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
//         {/* WORKS OVERVIEW - Left Side */}
//         <div className="bg-white rounded-xl p-6 shadow-sm">
//           <div className="flex items-center justify-between mb-4">
//             <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
//               <Layers size={20} className="text-purple-600" />
//               Works Overview
//               <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">
//                 {dateRange === 'today' ? 'Today' : 
//                  dateRange === 'week' ? 'This Week' : 
//                  dateRange === 'month' ? 'This Month' : 'Custom'}
//               </span>
//             </h2>
//             <Link to="/admin/works" className="text-purple-600 text-sm hover:underline flex items-center gap-1">
//               View All <ArrowRight size={14} />
//             </Link>
//           </div>

//           {/* Work Status Chart */}
//           <div className="grid grid-cols-2 gap-6">
//             {/* Pie Chart */}
//             <div className="h-48">
//               <ResponsiveContainer width="100%" height="100%">
//                 <RePieChart>
//                   <Pie
//                     data={workStatusData}
//                     cx="50%"
//                     cy="50%"
//                     innerRadius={40}
//                     outerRadius={60}
//                     paddingAngle={5}
//                     dataKey="value"
//                   >
//                     {workStatusData.map((entry, index) => (
//                       <Cell key={`cell-${index}`} fill={entry.color} />
//                     ))}
//                   </Pie>
//                   <Tooltip />
//                 </RePieChart>
//               </ResponsiveContainer>
//             </div>

//             {/* Status List */}
//             <div className="space-y-3">
//               {Object.entries(WORK_STATUS_COLORS).map(([status, color]) => {
//                 const count = workStats[status] || 0;
//                 if (count === 0 && status !== 'pending') return null;
//                 return (
//                   <div key={status} className="flex items-center justify-between">
//                     <div className="flex items-center gap-2">
//                       <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }}></span>
//                       <span className="text-sm capitalize text-slate-600">{status}</span>
//                     </div>
//                     <span className="font-bold text-slate-800">{count}</span>
//                   </div>
//                 );
//               })}
//               <div className="pt-2 border-t border-slate-100">
//                 <div className="flex items-center justify-between font-medium">
//                   <span className="text-sm text-slate-600">Total Works</span>
//                   <span className="font-bold text-purple-600">{workStats.total || 0}</span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Recent Works */}
//           <div className="mt-6">
//             <h3 className="text-sm font-semibold text-slate-700 mb-3">Recent Works</h3>
//             <div className="space-y-2">
//               {recentWorks.slice(0, 3).map((work) => (
//                 <div key={work._id} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
//                   <div>
//                     <p className="text-sm font-medium text-slate-800">{work.workId}</p>
//                     <p className="text-xs text-slate-500">{work.garment?.name || 'Garment'}</p>
//                   </div>
//                   <span className={`px-2 py-1 text-xs rounded-full ${
//                     work.status === 'completed' ? 'bg-green-100 text-green-700' :
//                     work.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
//                     work.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
//                     'bg-red-100 text-red-700'
//                   }`}>
//                     {work.status}
//                   </span>
//                 </div>
//               ))}
//               {recentWorks.length === 0 && (
//                 <p className="text-sm text-slate-400 text-center py-2">No recent works</p>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* TAILOR PERFORMANCE - Right Side */}
//         <div className="bg-white rounded-xl p-6 shadow-sm">
//           <div className="flex items-center justify-between mb-4">
//             <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
//               <Scissors size={20} className="text-purple-600" />
//               Tailor Performance
//               <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">
//                 {dateRange === 'today' ? 'Today' : 
//                  dateRange === 'week' ? 'This Week' : 
//                  dateRange === 'month' ? 'This Month' : 'Custom'}
//               </span>
//             </h2>
//             <Link to="/admin/tailors" className="text-purple-600 text-sm hover:underline flex items-center gap-1">
//               View All <ArrowRight size={14} />
//             </Link>
//           </div>

//           {/* Tailor Status Cards */}
//           <div className="grid grid-cols-2 gap-3 mb-6">
//             <div className="bg-green-50 p-3 rounded-lg">
//               <div className="flex items-center gap-2">
//                 <UserCheck size={16} className="text-green-600" />
//                 <span className="text-xs text-green-600">Active</span>
//               </div>
//               <p className="text-xl font-bold text-green-700">{tailorStats.active || 0}</p>
//             </div>
//             <div className="bg-blue-50 p-3 rounded-lg">
//               <div className="flex items-center gap-2">
//                 <Loader size={16} className="text-blue-600" />
//                 <span className="text-xs text-blue-600">Working</span>
//               </div>
//               <p className="text-xl font-bold text-blue-700">{tailorStats.busy || 0}</p>
//             </div>
//             <div className="bg-slate-50 p-3 rounded-lg">
//               <div className="flex items-center gap-2">
//                 <UserX size={16} className="text-slate-600" />
//                 <span className="text-xs text-slate-600">Idle</span>
//               </div>
//               <p className="text-xl font-bold text-slate-700">{tailorStats.idle || 0}</p>
//             </div>
//             <div className="bg-orange-50 p-3 rounded-lg">
//               <div className="flex items-center gap-2">
//                 <Calendar size={16} className="text-orange-600" />
//                 <span className="text-xs text-orange-600">On Leave</span>
//               </div>
//               <p className="text-xl font-bold text-orange-700">{tailorStats.onLeave || 0}</p>
//             </div>
//           </div>

//           {/* Performance List */}
//           <h3 className="text-sm font-semibold text-slate-700 mb-3">Top Performers</h3>
//           <div className="space-y-3">
//             {tailorPerformance.slice(0, 4).map((tailor, index) => (
//               <div key={tailor._id || index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
//                 <div className="flex items-center gap-3">
//                   <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
//                     index === 0 ? 'bg-yellow-500' :
//                     index === 1 ? 'bg-slate-500' :
//                     index === 2 ? 'bg-orange-500' : 'bg-blue-500'
//                   }`}>
//                     {index + 1}
//                   </div>
//                   <div>
//                     <p className="font-medium text-slate-800">{tailor.name || 'Tailor'}</p>
//                     <p className="text-xs text-slate-500">{tailor.specialization || 'General'}</p>
//                   </div>
//                 </div>
//                 <div className="text-right">
//                   <p className="font-bold text-blue-600">{tailor.completedWorks || 0}</p>
//                   <p className="text-xs text-slate-500">completed</p>
//                 </div>
//               </div>
//             ))}
//             {tailorPerformance.length === 0 && (
//               <p className="text-sm text-slate-400 text-center py-4">No performance data</p>
//             )}
//           </div>

//           {/* Quick Stats */}
//           <div className="mt-4 pt-4 border-t border-slate-100">
//             <div className="flex items-center justify-between text-sm">
//               <span className="text-slate-600">Avg. Completion Time</span>
//               <span className="font-bold text-green-600">3.5 days</span>
//             </div>
//             <div className="flex items-center justify-between text-sm mt-1">
//               <span className="text-slate-600">Productivity Rate</span>
//               <span className="font-bold text-blue-600">85%</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ===== QUICK ACTIONS FLOATING MENU ===== */}
//       <div className="fixed bottom-6 right-6 z-50">
//         <div className="relative group">
//           {/* Main FAB Button */}
//           <button className="w-14 h-14 bg-blue-600 hover:bg-blue-700 rounded-full shadow-lg flex items-center justify-center text-white transition-all group-hover:scale-110 group-hover:shadow-xl">
//             <Plus size={24} />
//           </button>
          
//           {/* Quick Actions Menu - Appears on hover */}
//           <div className="absolute bottom-16 right-0 bg-white rounded-xl shadow-xl p-2 min-w-[220px] hidden group-hover:block animate-fade-in-up">
//             {/* Header */}
//             <div className="text-sm font-medium text-slate-700 px-3 py-2 border-b border-slate-100 mb-1">
//               Quick Actions
//             </div>
            
//             {/* Menu Items */}
//             <Link 
//               to="/admin/orders/new" 
//               className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 rounded-lg text-slate-600 transition-all group/item"
//             >
//               <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center group-hover/item:bg-blue-200 transition-all">
//                 <ShoppingCart size={16} className="text-blue-600" />
//               </div>
//               <div className="flex-1">
//                 <span className="text-sm font-medium">New Order</span>
//                 <p className="text-xs text-slate-400">Create a new order</p>
//               </div>
//             </Link>

//             <Link 
//               to="/admin/customers/new" 
//               className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 rounded-lg text-slate-600 transition-all group/item"
//             >
//               <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center group-hover/item:bg-green-200 transition-all">
//                 <UserPlus size={16} className="text-green-600" />
//               </div>
//               <div className="flex-1">
//                 <span className="text-sm font-medium">Add Customer</span>
//                 <p className="text-xs text-slate-400">Register new customer</p>
//               </div>
//             </Link>

//             <Link 
//               to="/admin/transactions/expense" 
//               className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 rounded-lg text-slate-600 transition-all group/item"
//             >
//               <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center group-hover/item:bg-red-200 transition-all">
//                 <Receipt size={16} className="text-red-600" />
//               </div>
//               <div className="flex-1">
//                 <span className="text-sm font-medium">Add Expense</span>
//                 <p className="text-xs text-slate-400">Record an expense</p>
//               </div>
//             </Link>

//             <Link 
//               to="/admin/transactions/income" 
//               className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 rounded-lg text-slate-600 transition-all group/item"
//             >
//               <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center group-hover/item:bg-green-200 transition-all">
//                 <DollarSign size={16} className="text-green-600" />
//               </div>
//               <div className="flex-1">
//                 <span className="text-sm font-medium">Add Income</span>
//                 <p className="text-xs text-slate-400">Record an income</p>
//               </div>
//             </Link>

//             {/* Divider */}
//             <div className="border-t border-slate-100 my-1"></div>

//             {/* View All Link */}
//             <Link 
//               to="/admin/quick-actions" 
//               className="flex items-center justify-between px-3 py-2 hover:bg-slate-50 rounded-lg text-blue-600 text-sm"
//             >
//               <span>View all actions</span>
//               <ArrowRight size={14} />
//             </Link>
//           </div>
//         </div>
//       </div>

//       {/* Loading Overlay */}
//       {isLoading && (
//         <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
//           <div className="bg-white rounded-xl p-4 flex items-center gap-3 shadow-xl">
//             <RefreshCw size={20} className="animate-spin text-blue-600" />
//             <span>Loading dashboard...</span>
//           </div>
//         </div>
//       )}

//       {/* Add animation styles */}
//       <style jsx>{`
//         @keyframes fadeInUp {
//           from {
//             opacity: 0;
//             transform: translateY(10px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
//         .animate-fade-in-up {
//           animation: fadeInUp 0.2s ease-out;
//         }
//       `}</style>
//     </div>
//   );
// }







// Pages/Dashboard/AdminDashboard.jsx - WITH CORRECT TAILOR SELECTORS
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  ShoppingCart,
  IndianRupee,
  Truck,
  Scissors,
  TrendingUp,
  Clock,
  ArrowRight,
  RefreshCw,
  Eye,
  Package,
  AlertCircle,
  Filter,
  Calendar,
  UserCheck,
  UserX,
  Award,
  Layers,
  CheckCircle,
  XCircle,
  Loader,
  Plus,
  UserPlus,
  Receipt,
  DollarSign
} from 'lucide-react';
import {
  PieChart as RePieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar
} from 'recharts';
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';

// IMPORT from orderSlice
import { 
  fetchOrderStats, 
  fetchRecentOrders,
  selectOrderStats,
  selectRecentOrders 
} from '../../features/order/orderSlice';

// IMPORT from workSlice
import {
  fetchWorkStats,
  fetchRecentWorks,
  selectWorkStats,
  selectRecentWorks
} from '../../features/work/workSlice';

// IMPORT from tailorSlice - USING CORRECT SELECTORS
import {
  fetchTailorStats,
  fetchTailorPerformance,
  fetchTopTailors,
  selectTailorStats,
  selectTailorPerformance,      // This is state.tailor.tailorPerformance.data
  selectTailorPerformanceSummary,
  selectTailorPerformanceLoading,
  selectTopTailors,
  selectTopTailorsLoading
} from '../../features/tailor/tailorSlice';

// IMPORT from transactionSlice
import {
  fetchDailyRevenueStats,
  selectDailyRevenueData,
  selectDailyRevenueSummary,
  selectDailyRevenueLoading,
  fetchTodayTransactions,
  selectTodaySummary,
  selectTodayLoading
} from '../../features/transaction/transactionSlice';

import StatCard from '../../components/common/StatCard';
import showToast from '../../utils/toast';

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  
  // ===== DEBUG: Check user info =====
  console.log('👤 Current User:', user);
  
  // ===== GET ORDER DATA =====
  const orderStats = useSelector(selectOrderStats) || {
    total: 0,
    pending: 0,
    cutting: 0,
    stitching: 0,
    ready: 0,
    delivered: 0,
    cancelled: 0
  };
  
  const recentOrders = useSelector(selectRecentOrders) || [];
  
  // ===== GET WORK DATA =====
  const workStats = useSelector(selectWorkStats) || {
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
    cancelled: 0
  };
  
  const recentWorks = useSelector(selectRecentWorks) || [];
  
  // ===== GET TAILOR DATA =====
  const tailorStats = useSelector(selectTailorStats) || {
    total: 0,
    active: 0,
    busy: 0,
    idle: 0,
    onLeave: 0
  };
  
  // ✅ CORRECT: selectTailorPerformance returns the data array
  const tailorPerformance = useSelector(selectTailorPerformance) || [];
  
  // ✅ Get performance summary
  const performanceSummary = useSelector(selectTailorPerformanceSummary) || {
    totalCompleted: 0,
    activeTailors: 0,
    avgPerTailor: 0
  };
  
  // ✅ Get top tailors
  const topTailors = useSelector(selectTopTailors) || [];
  
  // Loading states
  const performanceLoading = useSelector(selectTailorPerformanceLoading);
  const topTailorsLoading = useSelector(selectTopTailorsLoading);
  
  // ===== GET REVENUE DATA =====
  const dailyRevenueData = useSelector(selectDailyRevenueData) || [];
  const dailyRevenueSummary = useSelector(selectDailyRevenueSummary) || {
    totalRevenue: 0,
    totalExpense: 0,
    netProfit: 0,
    period: 'month',
    dateRange: { start: null, end: null }
  };
  const revenueLoading = useSelector(selectDailyRevenueLoading);
  
  // ===== GET TODAY'S TRANSACTIONS SUMMARY =====
  const todaySummary = useSelector(selectTodaySummary) || {
    totalIncome: 0,
    totalExpense: 0,
    netAmount: 0
  };
  const todayLoading = useSelector(selectTodayLoading);
  
  // Loading states
  const [isLoading, setIsLoading] = useState(false);
  const [dateRange, setDateRange] = useState('month');
  const [customStartDate, setCustomStartDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [customEndDate, setCustomEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [showCustomPicker, setShowCustomPicker] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());

  // ===== STATUS COLORS =====
  const STATUS_CONFIG = {
    'draft': { color: '#94a3b8', label: 'Draft', bg: 'bg-slate-100' },
    'confirmed': { color: '#f59e0b', label: 'Confirmed', bg: 'bg-amber-100' },
    'in-progress': { color: '#3b82f6', label: 'In Progress', bg: 'bg-blue-100' },
    'ready-to-delivery': { color: '#10b981', label: 'Ready', bg: 'bg-emerald-100' },
    'delivered': { color: '#6b7280', label: 'Delivered', bg: 'bg-gray-100' },
    'cancelled': { color: '#ef4444', label: 'Cancelled', bg: 'bg-red-100' }
  };

  const WORK_STATUS_COLORS = {
    'pending': '#f59e0b',
    'in-progress': '#3b82f6',
    'completed': '#10b981',
    'cancelled': '#ef4444'
  };

  // ===== LOAD DATA WHEN FILTER CHANGES =====
  useEffect(() => {
    console.log('🔄 Date range changed to:', dateRange);
    loadDashboardData();
  }, [dateRange, customStartDate, customEndDate]);

  const loadDashboardData = async () => {
    console.log('🚀 ===== LOADING DASHBOARD DATA STARTED =====');
    console.log('📅 Selected date range:', dateRange);
    setIsLoading(true);
    
    try {
      // Get date parameters based on filter
      const params = getDateParams();
      console.log('📅 Date params being sent:', params);
      
      // Build promises array
      const promises = [
        dispatch(fetchOrderStats(params)),
        dispatch(fetchRecentOrders({ ...params, limit: 10 })),
        dispatch(fetchWorkStats(params)),
        dispatch(fetchRecentWorks({ ...params, limit: 5 })),
        dispatch(fetchTailorStats()),
        dispatch(fetchTailorPerformance({ period: dateRange })), // Fetch performance with period
        dispatch(fetchTopTailors({ limit: 5, period: dateRange })), // Fetch top tailors
        dispatch(fetchDailyRevenueStats(params)),
        dispatch(fetchTodayTransactions())
      ];
      
      const startTime = Date.now();
      const results = await Promise.allSettled(promises);
      const endTime = Date.now();
      
      console.log(`⏱️ API calls completed in ${endTime - startTime}ms`);
      
      // Check results
      const apiNames = ['Order Stats', 'Recent Orders', 'Work Stats', 'Recent Works', 'Tailor Stats', 'Tailor Performance', 'Top Tailors', 'Daily Revenue', 'Today Transactions'];
      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          console.log(`✅ ${apiNames[index]} successful:`, result.value);
        } else {
          console.error(`❌ ${apiNames[index]} failed:`, result.reason);
        }
      });
      
      setLastRefreshed(new Date());
      
    } catch (error) {
      console.error('❌ Error loading dashboard:', error);
      showToast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
      console.log('🏁 ===== LOADING DASHBOARD DATA COMPLETED =====');
    }
  };

  const getDateParams = () => {
    const today = new Date();
    
    switch(dateRange) {
      case 'today':
        return { 
          period: 'today',
          startDate: format(today, 'yyyy-MM-dd'),
          endDate: format(today, 'yyyy-MM-dd')
        };
      case 'week':
        const weekStart = startOfWeek(today);
        const weekEnd = endOfWeek(today);
        return {
          period: 'week',
          startDate: format(weekStart, 'yyyy-MM-dd'),
          endDate: format(weekEnd, 'yyyy-MM-dd')
        };
      case 'month':
        return { 
          period: 'month',
          startDate: format(startOfMonth(today), 'yyyy-MM-dd'),
          endDate: format(endOfMonth(today), 'yyyy-MM-dd')
        };
      case 'custom':
        return {
          period: 'custom',
          startDate: customStartDate,
          endDate: customEndDate
        };
      default:
        return { period: 'month' };
    }
  };

  // ===== APPLY CUSTOM DATE RANGE =====
  const handleApplyCustomRange = () => {
    if (!customStartDate || !customEndDate) {
      showToast.error('Please select both start and end dates');
      return;
    }
    
    if (new Date(customStartDate) > new Date(customEndDate)) {
      showToast.error('Start date cannot be after end date');
      return;
    }
    
    setDateRange('custom');
    setShowCustomPicker(false);
    loadDashboardData();
    showToast.success(`Showing data from ${customStartDate} to ${customEndDate}`);
  };

  // ===== PREPARE ORDER STATUS DATA =====
  const getOrderStatusData = () => {
    const data = [];
    
    if (orderStats.confirmed > 0) {
      data.push({ 
        name: 'Confirmed', 
        value: orderStats.confirmed, 
        color: STATUS_CONFIG.confirmed.color 
      });
    }
    
    if (orderStats['in-progress'] > 0) {
      data.push({ 
        name: 'In Progress', 
        value: orderStats['in-progress'], 
        color: STATUS_CONFIG['in-progress'].color 
      });
    }
    
    if (orderStats['ready-to-delivery'] > 0) {
      data.push({ 
        name: 'Ready', 
        value: orderStats['ready-to-delivery'], 
        color: STATUS_CONFIG['ready-to-delivery'].color 
      });
    }
    
    if (orderStats.delivered > 0) {
      data.push({ 
        name: 'Delivered', 
        value: orderStats.delivered, 
        color: STATUS_CONFIG.delivered.color 
      });
    }
    
    if (orderStats.cancelled > 0) {
      data.push({ 
        name: 'Cancelled', 
        value: orderStats.cancelled, 
        color: STATUS_CONFIG.cancelled.color 
      });
    }
    
    if (orderStats.draft > 0) {
      data.push({ 
        name: 'Draft', 
        value: orderStats.draft, 
        color: STATUS_CONFIG.draft.color 
      });
    }
    
    return data;
  };

  const orderStatusData = getOrderStatusData();
  const hasOrderData = orderStatusData.length > 0;

  // ===== PREPARE WORK STATUS DATA =====
  const getWorkStatusData = () => {
    return [
      { name: 'Pending', value: workStats.pending || 0, color: '#f59e0b' },
      { name: 'In Progress', value: workStats.inProgress || 0, color: '#3b82f6' },
      { name: 'Completed', value: workStats.completed || 0, color: '#10b981' },
      { name: 'Cancelled', value: workStats.cancelled || 0, color: '#ef4444' }
    ].filter(item => item.value > 0);
  };

  const workStatusData = getWorkStatusData();
  const hasWorkData = workStatusData.length > 0;

  // Safe formatting
  const safeFormat = (value) => {
    return (value || 0).toLocaleString('en-IN');
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG.draft;
    return `${config.bg} text-gray-700 px-2 py-1 text-xs rounded-full`;
  };

  // Debug logs
  console.log('📊 Tailor Stats:', tailorStats);
  console.log('📊 Tailor Performance:', tailorPerformance);
  console.log('📊 Performance Summary:', performanceSummary);
  console.log('📊 Top Tailors:', topTailors);

  // Prepare data for top performers display
  const displayPerformers = topTailors.length > 0 ? topTailors : tailorPerformance;

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      {/* ===== HEADER WITH CUSTOM DATE RANGE ===== */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-800 mb-2">
              Admin Dashboard
            </h1>
            <p className="text-slate-600 flex items-center gap-2">
              <Clock size={16} />
              {format(new Date(), 'EEEE, MMMM do, yyyy')}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Last refreshed: {format(lastRefreshed, 'hh:mm:ss a')}
            </p>
          </div>

          {/* Filter Buttons with Custom Range */}
          <div className="flex flex-wrap gap-2 bg-white p-2 rounded-xl shadow-sm">
            <button
              onClick={() => {
                setDateRange('today');
                setShowCustomPicker(false);
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                dateRange === 'today' && !showCustomPicker ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-slate-100'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => {
                setDateRange('week');
                setShowCustomPicker(false);
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                dateRange === 'week' && !showCustomPicker ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-slate-100'
              }`}
            >
              This Week
            </button>
            <button
              onClick={() => {
                setDateRange('month');
                setShowCustomPicker(false);
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                dateRange === 'month' && !showCustomPicker ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-slate-100'
              }`}
            >
              This Month
            </button>
            <button
              onClick={() => setShowCustomPicker(!showCustomPicker)}
              className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-1 ${
                showCustomPicker || dateRange === 'custom' ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-slate-100'
              }`}
            >
              <Calendar size={16} />
              Custom
            </button>
            <button
              onClick={loadDashboardData}
              className="p-2 hover:bg-slate-100 rounded-lg transition-all"
              title="Refresh"
            >
              <RefreshCw size={18} className={isLoading ? 'animate-spin text-blue-600' : ''} />
            </button>
          </div>
        </div>

        {/* Custom Date Range Picker */}
        {showCustomPicker && (
          <div className="mt-4 bg-white p-4 rounded-xl shadow-sm border border-blue-100">
            <div className="flex flex-wrap items-end gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Start Date</label>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  max={customEndDate}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">End Date</label>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  min={customStartDate}
                />
              </div>
              <button
                onClick={handleApplyCustomRange}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all"
              >
                Apply Range
              </button>
              <button
                onClick={() => setShowCustomPicker(false)}
                className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg font-medium hover:bg-slate-200 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Active Filter Indicator */}
        <p className="text-xs text-blue-600 mt-2">
          Showing: {
            dateRange === 'today' ? 'Today' :
            dateRange === 'week' ? 'This Week' :
            dateRange === 'month' ? 'This Month' :
            `Custom (${customStartDate} to ${customEndDate})`
          }
        </p>
      </div>

      {/* ===== KPI CARDS ===== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Card 1 - Total Orders */}
        <StatCard
          title="Total Orders"
          value={safeFormat(orderStats?.total || 0)}
          icon={<ShoppingCart className="text-blue-600" size={24} />}
          bgColor="bg-blue-50"
          borderColor="border-blue-200"
        >
          <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
            <div className="bg-white p-2 rounded-lg">
              <span className="text-slate-500">Pending</span>
              <p className="font-bold text-orange-600">
                {(orderStats?.confirmed || 0) + (orderStats?.draft || 0)}
              </p>
            </div>
            <div className="bg-white p-2 rounded-lg">
              <span className="text-slate-500">In Progress</span>
              <p className="font-bold text-blue-600">
                {(orderStats?.cutting || 0) + (orderStats?.stitching || 0) + (orderStats?.['in-progress'] || 0)}
              </p>
            </div>
            <div className="bg-white p-2 rounded-lg">
              <span className="text-slate-500">Completed</span>
              <p className="font-bold text-green-600">{orderStats?.delivered || 0}</p>
            </div>
          </div>
        </StatCard>

        {/* Card 2 - Revenue */}
        <StatCard
          title="Revenue"
          value={`₹${safeFormat(dailyRevenueSummary?.totalRevenue || 0)}`}
          icon={<IndianRupee className="text-green-600" size={24} />}
          bgColor="bg-green-50"
          borderColor="border-green-200"
        >
          <div className="mt-3 flex justify-between text-xs">
            <div className="bg-white p-2 rounded-lg flex-1 mr-1">
              <span className="text-slate-500">Expense</span>
              <p className="font-bold text-red-600">₹{safeFormat(dailyRevenueSummary?.totalExpense || 0)}</p>
            </div>
            <div className="bg-white p-2 rounded-lg flex-1 ml-1">
              <span className="text-slate-500">Profit</span>
              <p className="font-bold text-green-600">₹{safeFormat(dailyRevenueSummary?.netProfit || 0)}</p>
            </div>
          </div>
        </StatCard>

        {/* Card 3 - Total Works */}
        <StatCard
          title="Total Works"
          value={safeFormat(workStats?.total || 0)}
          icon={<Layers className="text-purple-600" size={24} />}
          bgColor="bg-purple-50"
          borderColor="border-purple-200"
        >
          <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
            <div className="bg-white p-2 rounded-lg">
              <span className="text-slate-500">Pending</span>
              <p className="font-bold text-orange-600">{workStats?.pending || 0}</p>
            </div>
            <div className="bg-white p-2 rounded-lg">
              <span className="text-slate-500">In Progress</span>
              <p className="font-bold text-blue-600">{workStats?.inProgress || 0}</p>
            </div>
            <div className="bg-white p-2 rounded-lg">
              <span className="text-slate-500">Completed</span>
              <p className="font-bold text-green-600">{workStats?.completed || 0}</p>
            </div>
          </div>
        </StatCard>

        {/* Card 4 - Active Tailors */}
        <StatCard
          title="Active Tailors"
          value={safeFormat(tailorStats?.active || 0)}
          icon={<Scissors className="text-purple-600" size={24} />}
          bgColor="bg-purple-50"
          borderColor="border-purple-200"
        >
          <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
            <div className="bg-white p-2 rounded-lg">
              <span className="text-slate-500">Working</span>
              <p className="font-bold text-green-600">{tailorStats?.busy || 0}</p>
            </div>
            <div className="bg-white p-2 rounded-lg">
              <span className="text-slate-500">Idle</span>
              <p className="font-bold text-slate-600">{tailorStats?.idle || 0}</p>
            </div>
            <div className="bg-white p-2 rounded-lg">
              <span className="text-slate-500">Leave</span>
              <p className="font-bold text-orange-600">{tailorStats?.onLeave || 0}</p>
            </div>
          </div>
        </StatCard>
      </div>

      {/* ===== ROW 1: ORDERS OVERVIEW + RECENT ORDERS ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Orders Status Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Package size={20} className="text-blue-600" />
              Orders Overview
              <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                {dateRange === 'today' ? 'Today' : 
                 dateRange === 'week' ? 'This Week' : 
                 dateRange === 'month' ? 'This Month' : 'Custom'}
              </span>
            </h2>
            <Link to="/admin/orders" className="text-blue-600 text-sm hover:underline flex items-center gap-1">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          
          {hasOrderData ? (
            <>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={orderStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {orderStatusData.map((entry) => (
                        <Cell key={`cell-${entry.name}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </RePieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-4">
                {Object.entries(STATUS_CONFIG).map(([status, config]) => {
                  const count = orderStats[status] || 0;
                  if (count === 0) return null;
                  return (
                    <div key={status} className="flex items-center gap-1 text-xs">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: config.color }}></span>
                      <span className="text-slate-600">{config.label}</span>
                      <span className="font-bold text-slate-800 ml-auto">{count}</span>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="h-64 flex items-center justify-center text-slate-400">
              <Package size={48} className="opacity-30" />
              <p className="text-sm ml-2">No orders for this period</p>
            </div>
          )}
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-bold text-slate-800 flex items-center gap-2">
              <ShoppingCart size={18} className="text-blue-600" />
              Recent Orders
              <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                {dateRange === 'today' ? 'Today' : 
                 dateRange === 'week' ? 'This Week' : 
                 dateRange === 'month' ? 'This Month' : 'Custom'}
              </span>
            </h2>
            <Link to="/admin/orders" className="text-blue-600 text-sm hover:underline">View All</Link>
          </div>
          
          {recentOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500">Items</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentOrders.slice(0, 5).map((order) => (
                    <tr key={order._id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-medium">#{order.orderId}</td>
                      <td className="px-6 py-4">{order.customer?.name || 'N/A'}</td>
                      <td className="px-6 py-4">{order.garments?.length || 0}</td>
                      <td className="px-6 py-4">
                        <span className={getStatusBadge(order.status)}>
                          {STATUS_CONFIG[order.status]?.label || order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Link to={`/admin/orders/${order._id}`} className="text-blue-600">
                          <Eye size={16} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400">
              <ShoppingCart size={40} className="mx-auto mb-2 opacity-30" />
              <p>No recent orders</p>
            </div>
          )}
        </div>
      </div>

      {/* ===== ROW 2: REVENUE TREND CHART ===== */}
      <div className="mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <TrendingUp size={24} className="text-green-600" />
              Revenue Trend
              <span className="text-xs bg-green-100 text-green-600 px-3 py-1 rounded-full">
                {dateRange === 'today' ? 'Today (Hourly)' : 
                 dateRange === 'week' ? 'Last 7 Days' : 
                 dateRange === 'month' ? 'This Month' : 'Custom Range'}
              </span>
            </h2>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                <span className="text-sm text-slate-600">Revenue</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm text-slate-600">Expense</span>
              </div>
            </div>
          </div>
          
          {revenueLoading ? (
            <div className="h-80 flex items-center justify-center">
              <Loader size={32} className="animate-spin text-blue-600" />
              <span className="ml-2 text-slate-600">Loading revenue data...</span>
            </div>
          ) : dailyRevenueData && dailyRevenueData.length > 0 ? (
            <>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dailyRevenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey={dateRange === 'today' ? 'time' : 'day'} />
                    <YAxis tickFormatter={(value) => `₹${value/1000}K`} />
                    <Tooltip formatter={(value) => `₹${value}`} />
                    <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} />
                    <Line type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-3 gap-6 mt-8">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-blue-800">
                    ₹{safeFormat(dailyRevenueSummary?.totalRevenue || 0)}
                  </p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-sm text-red-600">Total Expense</p>
                  <p className="text-2xl font-bold text-red-800">
                    ₹{safeFormat(dailyRevenueSummary?.totalExpense || 0)}
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-600">Net Profit</p>
                  <p className="text-2xl font-bold text-green-800">
                    ₹{safeFormat(dailyRevenueSummary?.netProfit || 0)}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="h-80 flex items-center justify-center text-slate-400">
              <TrendingUp size={48} className="opacity-30" />
              <p className="text-lg ml-2">No revenue data available for this period</p>
            </div>
          )}
        </div>
      </div>

      {/* ===== ROW 3: WORKS OVERVIEW + TAILOR PERFORMANCE ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* WORKS OVERVIEW - Left Side */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Layers size={20} className="text-purple-600" />
              Works Overview
              <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">
                {dateRange === 'today' ? 'Today' : 
                 dateRange === 'week' ? 'This Week' : 
                 dateRange === 'month' ? 'This Month' : 'Custom'}
              </span>
            </h2>
            <Link to="/admin/works" className="text-purple-600 text-sm hover:underline flex items-center gap-1">
              View All <ArrowRight size={14} />
            </Link>
          </div>

          {/* Work Status Chart */}
          <div className="grid grid-cols-2 gap-6">
            {/* Pie Chart */}
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={workStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {workStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RePieChart>
              </ResponsiveContainer>
            </div>

            {/* Status List */}
            <div className="space-y-3">
              {Object.entries(WORK_STATUS_COLORS).map(([status, color]) => {
                const count = workStats[status] || 0;
                if (count === 0 && status !== 'pending') return null;
                return (
                  <div key={status} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }}></span>
                      <span className="text-sm capitalize text-slate-600">{status}</span>
                    </div>
                    <span className="font-bold text-slate-800">{count}</span>
                  </div>
                );
              })}
              <div className="pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between font-medium">
                  <span className="text-sm text-slate-600">Total Works</span>
                  <span className="font-bold text-purple-600">{workStats.total || 0}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Works */}
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Recent Works</h3>
            <div className="space-y-2">
              {recentWorks.slice(0, 3).map((work) => (
                <div key={work._id} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-slate-800">{work.workId}</p>
                    <p className="text-xs text-slate-500">{work.garment?.name || 'Garment'}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    work.status === 'completed' ? 'bg-green-100 text-green-700' :
                    work.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                    work.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {work.status}
                  </span>
                </div>
              ))}
              {recentWorks.length === 0 && (
                <p className="text-sm text-slate-400 text-center py-2">No recent works</p>
              )}
            </div>
          </div>
        </div>

        {/* TAILOR PERFORMANCE - Right Side - NOW WITH REAL DATA */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Scissors size={20} className="text-purple-600" />
              Tailor Performance
              <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">
                {dateRange === 'today' ? 'Today' : 
                 dateRange === 'week' ? 'This Week' : 
                 dateRange === 'month' ? 'This Month' : 'Custom'}
              </span>
            </h2>
            <Link to="/admin/tailors" className="text-purple-600 text-sm hover:underline flex items-center gap-1">
              View All <ArrowRight size={14} />
            </Link>
          </div>

          {/* Tailor Status Cards - FROM REAL DATA */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <UserCheck size={16} className="text-green-600" />
                <span className="text-xs text-green-600">Active</span>
              </div>
              <p className="text-xl font-bold text-green-700">{tailorStats?.active || 0}</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <Loader size={16} className="text-blue-600" />
                <span className="text-xs text-blue-600">Working</span>
              </div>
              <p className="text-xl font-bold text-blue-700">{tailorStats?.busy || 0}</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <UserX size={16} className="text-slate-600" />
                <span className="text-xs text-slate-600">Idle</span>
              </div>
              <p className="text-xl font-bold text-slate-700">{tailorStats?.idle || 0}</p>
            </div>
            <div className="bg-orange-50 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-orange-600" />
                <span className="text-xs text-orange-600">On Leave</span>
              </div>
              <p className="text-xl font-bold text-orange-700">{tailorStats?.onLeave || 0}</p>
            </div>
          </div>

          {/* Performance List - USING REAL DATA */}
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Top Performers</h3>
          
          {performanceLoading ? (
            <div className="flex justify-center py-8">
              <Loader size={24} className="animate-spin text-purple-600" />
            </div>
          ) : displayPerformers.length > 0 ? (
            <div className="space-y-3">
              {displayPerformers.slice(0, 4).map((tailor, index) => (
                <div key={tailor._id || index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                      index === 0 ? 'bg-yellow-500' :
                      index === 1 ? 'bg-slate-500' :
                      index === 2 ? 'bg-orange-500' : 'bg-blue-500'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">{tailor.name || tailor.tailorName || 'Tailor'}</p>
                      <p className="text-xs text-slate-500">
                        {tailor.specialization || tailor.specializations?.join(', ') || 'General'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-blue-600">
                      {tailor.completedWorks || tailor.completedOrders || tailor.count || 0}
                    </p>
                    <p className="text-xs text-slate-500">completed</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400">
              <Scissors size={32} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">No performance data for this period</p>
              <p className="text-xs mt-1">Try changing the date range</p>
            </div>
          )}

          {/* Quick Stats - USING REAL SUMMARY DATA */}
          <div className="mt-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Total Completed</span>
              <span className="font-bold text-green-600">
                {performanceSummary?.totalCompleted || 0}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm mt-1">
              <span className="text-slate-600">Active Tailors</span>
              <span className="font-bold text-blue-600">
                {performanceSummary?.activeTailors || tailorStats?.active || 0}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm mt-1">
              <span className="text-slate-600">Avg per Tailor</span>
              <span className="font-bold text-purple-600">
                {performanceSummary?.avgPerTailor || 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ===== QUICK ACTIONS FLOATING MENU ===== */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative group">
          {/* Main FAB Button */}
          <button className="w-14 h-14 bg-blue-600 hover:bg-blue-700 rounded-full shadow-lg flex items-center justify-center text-white transition-all group-hover:scale-110 group-hover:shadow-xl">
            <Plus size={24} />
          </button>
          
          {/* Quick Actions Menu - Appears on hover */}
          <div className="absolute bottom-16 right-0 bg-white rounded-xl shadow-xl p-2 min-w-[220px] hidden group-hover:block animate-fade-in-up">
            {/* Header */}
            <div className="text-sm font-medium text-slate-700 px-3 py-2 border-b border-slate-100 mb-1">
              Quick Actions
            </div>
            
            {/* Menu Items */}
            <Link 
              to="/admin/orders/new" 
              className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 rounded-lg text-slate-600 transition-all group/item"
            >
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center group-hover/item:bg-blue-200 transition-all">
                <ShoppingCart size={16} className="text-blue-600" />
              </div>
              <div className="flex-1">
                <span className="text-sm font-medium">New Order</span>
                <p className="text-xs text-slate-400">Create a new order</p>
              </div>
            </Link>

            <Link 
              to="/admin/customers/new" 
              className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 rounded-lg text-slate-600 transition-all group/item"
            >
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center group-hover/item:bg-green-200 transition-all">
                <UserPlus size={16} className="text-green-600" />
              </div>
              <div className="flex-1">
                <span className="text-sm font-medium">Add Customer</span>
                <p className="text-xs text-slate-400">Register new customer</p>
              </div>
            </Link>

            <Link 
              to="/admin/transactions/expense" 
              className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 rounded-lg text-slate-600 transition-all group/item"
            >
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center group-hover/item:bg-red-200 transition-all">
                <Receipt size={16} className="text-red-600" />
              </div>
              <div className="flex-1">
                <span className="text-sm font-medium">Add Expense</span>
                <p className="text-xs text-slate-400">Record an expense</p>
              </div>
            </Link>

            <Link 
              to="/admin/transactions/income" 
              className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 rounded-lg text-slate-600 transition-all group/item"
            >
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center group-hover/item:bg-green-200 transition-all">
                <DollarSign size={16} className="text-green-600" />
              </div>
              <div className="flex-1">
                <span className="text-sm font-medium">Add Income</span>
                <p className="text-xs text-slate-400">Record an income</p>
              </div>
            </Link>

            {/* Divider */}
            <div className="border-t border-slate-100 my-1"></div>

            {/* View All Link */}
            <Link 
              to="/admin/quick-actions" 
              className="flex items-center justify-between px-3 py-2 hover:bg-slate-50 rounded-lg text-blue-600 text-sm"
            >
              <span>View all actions</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-4 flex items-center gap-3 shadow-xl">
            <RefreshCw size={20} className="animate-spin text-blue-600" />
            <span>Loading dashboard...</span>
          </div>
        </div>
      )}

      {/* Add animation styles */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}