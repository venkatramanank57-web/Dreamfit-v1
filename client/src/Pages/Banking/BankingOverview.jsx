// // Pages/banking/BankingOverview.jsx
// import React, { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { Link } from 'react-router-dom';
// import {
//   Wallet,
//   Landmark,
//   TrendingUp,
//   TrendingDown,
//   RefreshCw,
//   ArrowRight,
//   Download,
//   ArrowUpCircle,
//   ArrowDownCircle,
//   DollarSign
// } from 'lucide-react';
// import { 
//   fetchAllTransactions,
//   fetchTransactionSummary,
//   selectAllTransactions,
//   selectTransactionSummary,
//   selectTransactionLoading
// } from '../../features/transaction/transactionSlice';
// import StatCard from '../../components/common/StatCard';
// import showToast from '../../utils/toast';

// export default function BankingOverview() {
//   const dispatch = useDispatch();
//   const summary = useSelector(selectTransactionSummary);
//   const loading = useSelector(selectTransactionLoading);
//   const allTransactions = useSelector(selectAllTransactions);
//   const { user } = useSelector((state) => state.auth);
  
//   const [period, setPeriod] = useState('month');
//   const [recentIncome, setRecentIncome] = useState([]);
//   const [recentExpense, setRecentExpense] = useState([]);
//   const [stats, setStats] = useState({
//     income: {
//       handCash: 0,
//       bank: 0,
//       total: 0,
//       count: 0
//     },
//     expense: {
//       handCash: 0,
//       bank: 0,
//       total: 0,
//       count: 0
//     },
//     netAmount: 0
//   });
//   const [isLoading, setIsLoading] = useState(false);
//   const [isInitialLoad, setIsInitialLoad] = useState(true); // 👈 Track initial load

//   // Load data when component mounts and when period changes
//   useEffect(() => {
//     loadData(false); // 👈 Pass false for initial load (no toast)
//   }, [period]);

//   // Recalculate stats whenever allTransactions changes
//   useEffect(() => {
//     if (allTransactions.length > 0) {
//       calculateStats();
//       filterTransactionsByPeriod();
//     }
//   }, [allTransactions, period]);

//   const loadData = async (showToastMessage = false) => { // 👈 Default false for initial load
//     setIsLoading(true);
//     try {
//       await dispatch(fetchAllTransactions({ limit: 50 }));
//       await dispatch(fetchTransactionSummary(period));
      
//       // Only show toast if not initial load and showToastMessage is true
//       if (!isInitialLoad && showToastMessage) {
//         showToast.success('Data refreshed successfully');
//       }
      
//       // Mark initial load as complete
//       if (isInitialLoad) {
//         setIsInitialLoad(false);
//       }
//     } catch (error) {
//       console.error('Failed to load data:', error);
//       if (!isInitialLoad && showToastMessage) {
//         showToast.error('Failed to load data');
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleRefresh = () => {
//     loadData(true); // 👈 Pass true for manual refresh (show toast)
//   };

//   const getDateRangeForPeriod = () => {
//     const now = new Date();
//     const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
//     switch(period) {
//       case 'today':
//         return {
//           start: today,
//           end: new Date(today.getTime() + 24 * 60 * 60 * 1000 - 1)
//         };
//       case 'week':
//         const weekStart = new Date(today);
//         weekStart.setDate(today.getDate() - today.getDay());
//         return {
//           start: weekStart,
//           end: new Date(today.getTime() + 24 * 60 * 60 * 1000 - 1)
//         };
//       case 'month':
//         const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
//         return {
//           start: monthStart,
//           end: new Date(today.getTime() + 24 * 60 * 60 * 1000 - 1)
//         };
//       case 'year':
//         const yearStart = new Date(today.getFullYear(), 0, 1);
//         return {
//           start: yearStart,
//           end: new Date(today.getTime() + 24 * 60 * 60 * 1000 - 1)
//         };
//       case 'all':
//       default:
//         return {
//           start: new Date(0),
//           end: new Date(8640000000000000)
//         };
//     }
//   };

//   const isTransactionInPeriod = (transactionDate) => {
//     if (period === 'all') return true;
    
//     const { start, end } = getDateRangeForPeriod();
//     const transDate = new Date(transactionDate);
//     return transDate >= start && transDate <= end;
//   };

//   const filterTransactionsByPeriod = () => {
//     const filteredTransactions = allTransactions.filter(t => 
//       isTransactionInPeriod(t.transactionDate)
//     );

//     const sortedTransactions = [...filteredTransactions].sort(
//       (a, b) => new Date(b.transactionDate) - new Date(a.transactionDate)
//     );

//     const incomeList = sortedTransactions
//       .filter(t => t.type === 'income')
//       .slice(0, 5);
    
//     const expenseList = sortedTransactions
//       .filter(t => t.type === 'expense')
//       .slice(0, 5);

//     setRecentIncome(incomeList);
//     setRecentExpense(expenseList);
//   };

//   const calculateStats = () => {
//     const periodTransactions = allTransactions.filter(t => 
//       isTransactionInPeriod(t.transactionDate)
//     );

//     const incomeTransactions = periodTransactions.filter(t => t.type === 'income');
//     const expenseTransactions = periodTransactions.filter(t => t.type === 'expense');

//     const handCashIncome = incomeTransactions
//       .filter(t => t.accountType === 'hand-cash')
//       .reduce((sum, t) => sum + t.amount, 0);
    
//     const bankIncome = incomeTransactions
//       .filter(t => t.accountType === 'bank')
//       .reduce((sum, t) => sum + t.amount, 0);
    
//     const incomeCount = incomeTransactions.length;

//     const handCashExpense = expenseTransactions
//       .filter(t => t.accountType === 'hand-cash')
//       .reduce((sum, t) => sum + t.amount, 0);
    
//     const bankExpense = expenseTransactions
//       .filter(t => t.accountType === 'bank')
//       .reduce((sum, t) => sum + t.amount, 0);
    
//     const expenseCount = expenseTransactions.length;

//     const totalIncome = handCashIncome + bankIncome;
//     const totalExpense = handCashExpense + bankExpense;

//     setStats({
//       income: {
//         handCash: handCashIncome,
//         bank: bankIncome,
//         total: totalIncome,
//         count: incomeCount
//       },
//       expense: {
//         handCash: handCashExpense,
//         bank: bankExpense,
//         total: totalExpense,
//         count: expenseCount
//       },
//       netAmount: totalIncome - totalExpense
//     });
//   };

//   const handleExport = () => {
//     showToast.info('Export feature coming soon...');
//   };

//   const formatDate = (date) => {
//     return new Date(date).toLocaleDateString('en-IN', {
//       day: '2-digit',
//       month: 'short',
//       year: 'numeric'
//     });
//   };

//   const formatTime = (date) => {
//     return new Date(date).toLocaleTimeString('en-IN', {
//       hour: '2-digit',
//       minute: '2-digit',
//       hour12: true
//     });
//   };

//   const getCategoryLabel = (category, customCategory, type) => {
//     const incomeCategories = {
//       'customer-advance': 'Customer Advance',
//       'full-payment': 'Full Payment',
//       'fabric-sale': 'Fabric Sale',
//       'project-payment': 'Project Payment',
//       'other-income': customCategory || 'Other Income'
//     };
    
//     const expenseCategories = {
//       'salary': 'Employee Salary',
//       'electricity': 'Electricity Bill',
//       'travel': 'Travel',
//       'material-purchase': 'Material Purchase',
//       'rent': 'Rent',
//       'maintenance': 'Maintenance',
//       'other-expense': customCategory || 'Other Expense'
//     };

//     if (type === 'income') {
//       return incomeCategories[category] || category;
//     } else {
//       return expenseCategories[category] || category;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-slate-50 p-6">
//       {/* Header */}
//       <div className="mb-8">
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-3xl font-black text-slate-800 mb-2">Banking Overview</h1>
//             <p className="text-slate-600">Track your income, expenses, and net amount</p>
//             <p className="text-xs text-slate-400 mt-1">
//               Last updated: {new Date().toLocaleTimeString()} • Showing: {
//                 period === 'today' ? 'Today' :
//                 period === 'week' ? 'This Week' :
//                 period === 'month' ? 'This Month' :
//                 period === 'year' ? 'This Year' : 'All Time'
//               }
//             </p>
//           </div>
//           <div className="flex gap-3">
//             <button
//               onClick={handleExport}
//               className="px-4 py-2 bg-white border border-slate-200 rounded-xl font-medium text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2"
//             >
//               <Download size={18} />
//               Export
//             </button>
//             <button
//               onClick={handleRefresh}
//               className="p-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-all"
//               title="Refresh"
//             >
//               <RefreshCw size={20} className={isLoading ? 'animate-spin text-blue-600' : 'text-slate-600'} />
//             </button>
//           </div>
//         </div>

//         {/* Period Selector */}
//         <div className="flex gap-2 mt-4">
//           {['today', 'week', 'month', 'year', 'all'].map((p) => (
//             <button
//               key={p}
//               onClick={() => setPeriod(p)}
//               className={`px-4 py-2 rounded-lg font-medium transition-all ${
//                 period === p
//                   ? 'bg-blue-600 text-white shadow-md'
//                   : 'bg-white text-slate-600 hover:bg-slate-100'
//               }`}
//             >
//               {p === 'all' ? 'All Time' : p.charAt(0).toUpperCase() + p.slice(1)}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Net Amount Card */}
//       <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl p-6 mb-8 text-white shadow-xl">
//         <div className="flex items-center justify-between mb-4">
//           <div>
//             <h2 className="text-lg font-medium opacity-90">Net Amount (Income - Expense)</h2>
//             <p className="text-4xl font-black mb-2">
//               ₹{stats.netAmount.toLocaleString('en-IN')}
//             </p>
//           </div>
//           <DollarSign size={48} className="opacity-90" />
//         </div>
//         <div className="grid grid-cols-2 gap-4">
//           <div className="bg-green-500/20 rounded-lg p-3">
//             <p className="text-sm opacity-75 flex items-center gap-1">
//               <TrendingUp size={16} /> Total Income
//             </p>
//             <p className="text-xl font-bold">+ ₹{stats.income.total.toLocaleString('en-IN')}</p>
//             <p className="text-xs opacity-75">{stats.income.count} transactions</p>
//           </div>
//           <div className="bg-red-500/20 rounded-lg p-3">
//             <p className="text-sm opacity-75 flex items-center gap-1">
//               <TrendingDown size={16} /> Total Expense
//             </p>
//             <p className="text-xl font-bold">- ₹{stats.expense.total.toLocaleString('en-IN')}</p>
//             <p className="text-xs opacity-75">{stats.expense.count} transactions</p>
//           </div>
//         </div>
//       </div>

//       {/* Income and Expense Summary Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//         {/* Income Summary Card */}
//         <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-green-500 hover:shadow-lg transition-all">
//           <div className="flex items-center justify-between mb-4">
//             <div>
//               <h3 className="text-sm font-medium text-slate-500">Total Income</h3>
//               <p className="text-3xl font-black text-green-600">
//                 + ₹{stats.income.total.toLocaleString('en-IN')}
//               </p>
//             </div>
//             <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
//               <TrendingUp size={28} className="text-green-600" />
//             </div>
//           </div>
          
//           <div className="grid grid-cols-2 gap-4 mb-4">
//             <div className="bg-orange-50 p-3 rounded-lg">
//               <p className="text-xs text-orange-600 font-medium flex items-center gap-1">
//                 <Wallet size={12} /> Hand Cash
//               </p>
//               <p className="text-lg font-bold text-orange-700">
//                 + ₹{stats.income.handCash.toLocaleString('en-IN')}
//               </p>
//             </div>
//             <div className="bg-blue-50 p-3 rounded-lg">
//               <p className="text-xs text-blue-600 font-medium flex items-center gap-1">
//                 <Landmark size={12} /> Bank
//               </p>
//               <p className="text-lg font-bold text-blue-700">
//                 + ₹{stats.income.bank.toLocaleString('en-IN')}
//               </p>
//             </div>
//           </div>

//           <div className="flex gap-2">
//             <Link
//               to="/admin/banking/income?account=hand-cash"
//               className="flex-1 text-center py-2.5 bg-orange-50 text-orange-600 rounded-lg font-medium hover:bg-orange-100 transition-all flex items-center justify-center gap-2"
//             >
//               <Wallet size={16} />
//               Hand Cash
//               <ArrowRight size={16} />
//             </Link>
//             <Link
//               to="/admin/banking/income?account=bank"
//               className="flex-1 text-center py-2.5 bg-blue-50 text-blue-600 rounded-lg font-medium hover:bg-blue-100 transition-all flex items-center justify-center gap-2"
//             >
//               <Landmark size={16} />
//               Bank
//               <ArrowRight size={16} />
//             </Link>
//           </div>
//           <Link
//             to="/admin/banking/income"
//             className="mt-3 block text-center py-2 bg-green-50 text-green-600 rounded-lg font-medium hover:bg-green-100 transition-all"
//           >
//             View All Income ({stats.income.count} transactions) →
//           </Link>
//         </div>

//         {/* Expense Summary Card */}
//         <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-red-500 hover:shadow-lg transition-all">
//           <div className="flex items-center justify-between mb-4">
//             <div>
//               <h3 className="text-sm font-medium text-slate-500">Total Expense</h3>
//               <p className="text-3xl font-black text-red-600">
//                 - ₹{stats.expense.total.toLocaleString('en-IN')}
//               </p>
//             </div>
//             <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center">
//               <TrendingDown size={28} className="text-red-600" />
//             </div>
//           </div>
          
//           <div className="grid grid-cols-2 gap-4 mb-4">
//             <div className="bg-orange-50 p-3 rounded-lg">
//               <p className="text-xs text-orange-600 font-medium flex items-center gap-1">
//                 <Wallet size={12} /> Hand Cash
//               </p>
//               <p className="text-lg font-bold text-orange-700">
//                 - ₹{stats.expense.handCash.toLocaleString('en-IN')}
//               </p>
//             </div>
//             <div className="bg-blue-50 p-3 rounded-lg">
//               <p className="text-xs text-blue-600 font-medium flex items-center gap-1">
//                 <Landmark size={12} /> Bank
//               </p>
//               <p className="text-lg font-bold text-blue-700">
//                 - ₹{stats.expense.bank.toLocaleString('en-IN')}
//               </p>
//             </div>
//           </div>

//           <div className="flex gap-2">
//             <Link
//               to="/admin/banking/expense?account=hand-cash"
//               className="flex-1 text-center py-2.5 bg-orange-50 text-orange-600 rounded-lg font-medium hover:bg-orange-100 transition-all flex items-center justify-center gap-2"
//             >
//               <Wallet size={16} />
//               Hand Cash
//               <ArrowRight size={16} />
//             </Link>
//             <Link
//               to="/admin/banking/expense?account=bank"
//               className="flex-1 text-center py-2.5 bg-blue-50 text-blue-600 rounded-lg font-medium hover:bg-blue-100 transition-all flex items-center justify-center gap-2"
//             >
//               <Landmark size={16} />
//               Bank
//               <ArrowRight size={16} />
//             </Link>
//           </div>
//           <Link
//             to="/admin/banking/expense"
//             className="mt-3 block text-center py-2 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition-all"
//           >
//             View All Expenses ({stats.expense.count} transactions) →
//           </Link>
//         </div>
//       </div>

//       {/* Quick Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//         <StatCard
//           title="Total Income"
//           value={`+ ₹${stats.income.total.toLocaleString('en-IN')}`}
//           icon={<ArrowUpCircle className="text-green-600" size={24} />}
//           bgColor="bg-green-50"
//           borderColor="border-green-200"
//           linkTo="/admin/banking/income"
//           linkText="View all income"
//           subtext={`${stats.income.count} transactions`}
//         />
//         <StatCard
//           title="Total Expense"
//           value={`- ₹${stats.expense.total.toLocaleString('en-IN')}`}
//           icon={<ArrowDownCircle className="text-red-600" size={24} />}
//           bgColor="bg-red-50"
//           borderColor="border-red-200"
//           linkTo="/admin/banking/expense"
//           linkText="View all expenses"
//           subtext={`${stats.expense.count} transactions`}
//         />
//         <StatCard
//           title="Net Amount"
//           value={`₹${stats.netAmount.toLocaleString('en-IN')}`}
//           icon={<DollarSign className="text-purple-600" size={24} />}
//           bgColor="bg-purple-50"
//           borderColor="border-purple-200"
//           subtext={`${stats.income.count + stats.expense.count} total transactions`}
//         />
//       </div>

//       {/* Recent Transactions */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {/* Recent Income */}
//         <div className="bg-white rounded-xl shadow-sm">
//           <div className="p-6 border-b border-slate-100 flex items-center justify-between">
//             <div className="flex items-center gap-2">
//               <ArrowUpCircle size={20} className="text-green-600" />
//               <h3 className="font-bold text-slate-800 text-lg">Recent Income</h3>
//             </div>
//             <Link 
//               to="/admin/banking/income"
//               className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center gap-1"
//             >
//               View all ({stats.income.count}) <ArrowRight size={16} />
//             </Link>
//           </div>
//           <div className="divide-y divide-slate-100">
//             {recentIncome.length > 0 ? (
//               recentIncome.map((transaction) => (
//                 <div key={transaction._id} className="p-4 hover:bg-slate-50 transition-all">
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center gap-3">
//                       <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
//                         <TrendingUp size={20} className="text-green-600" />
//                       </div>
//                       <div>
//                         <p className="font-medium text-slate-800">
//                           {transaction.customerDetails?.name || 
//                            getCategoryLabel(transaction.category, transaction.customCategory, 'income')}
//                         </p>
//                         <div className="flex items-center gap-2 text-sm text-slate-500">
//                           <span>{formatDate(transaction.transactionDate)}</span>
//                           <span>•</span>
//                           <span>{formatTime(transaction.transactionDate)}</span>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="text-right">
//                       <p className="text-lg font-bold text-green-600">
//                         + ₹{transaction.amount.toLocaleString('en-IN')}
//                       </p>
//                       <span className={`text-xs px-2 py-0.5 rounded-full ${
//                         transaction.accountType === 'hand-cash' 
//                           ? 'bg-orange-100 text-orange-600'
//                           : 'bg-blue-100 text-blue-600'
//                       }`}>
//                         {transaction.accountType === 'hand-cash' ? 'Hand Cash' : 'Bank'}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <div className="p-8 text-center">
//                 <TrendingUp size={32} className="text-slate-300 mx-auto mb-2" />
//                 <p className="text-slate-500">No income transactions for this period</p>
//                 <Link
//                   to="/admin/banking/income"
//                   className="text-green-600 text-sm hover:text-green-700 mt-2 inline-block"
//                 >
//                   Add Income →
//                 </Link>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Recent Expense */}
//         <div className="bg-white rounded-xl shadow-sm">
//           <div className="p-6 border-b border-slate-100 flex items-center justify-between">
//             <div className="flex items-center gap-2">
//               <ArrowDownCircle size={20} className="text-red-600" />
//               <h3 className="font-bold text-slate-800 text-lg">Recent Expense</h3>
//             </div>
//             <Link 
//               to="/admin/banking/expense"
//               className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-1"
//             >
//               View all ({stats.expense.count}) <ArrowRight size={16} />
//             </Link>
//           </div>
//           <div className="divide-y divide-slate-100">
//             {recentExpense.length > 0 ? (
//               recentExpense.map((transaction) => (
//                 <div key={transaction._id} className="p-4 hover:bg-slate-50 transition-all">
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center gap-3">
//                       <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
//                         <TrendingDown size={20} className="text-red-600" />
//                       </div>
//                       <div>
//                         <p className="font-medium text-slate-800">
//                           {getCategoryLabel(transaction.category, transaction.customCategory, 'expense')}
//                         </p>
//                         <div className="flex items-center gap-2 text-sm text-slate-500">
//                           <span>{formatDate(transaction.transactionDate)}</span>
//                           <span>•</span>
//                           <span>{formatTime(transaction.transactionDate)}</span>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="text-right">
//                       <p className="text-lg font-bold text-red-600">
//                         - ₹{transaction.amount.toLocaleString('en-IN')}
//                       </p>
//                       <span className={`text-xs px-2 py-0.5 rounded-full ${
//                         transaction.accountType === 'hand-cash' 
//                           ? 'bg-orange-100 text-orange-600'
//                           : 'bg-blue-100 text-blue-600'
//                       }`}>
//                         {transaction.accountType === 'hand-cash' ? 'Hand Cash' : 'Bank'}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <div className="p-8 text-center">
//                 <TrendingDown size={32} className="text-slate-300 mx-auto mb-2" />
//                 <p className="text-slate-500">No expense transactions for this period</p>
//                 <Link
//                   to="/admin/banking/expense"
//                   className="text-red-600 text-sm hover:text-red-700 mt-2 inline-block"
//                 >
//                   Add Expense →
//                 </Link>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Quick Actions */}
//       <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
//         <Link
//           to="/admin/banking/income"
//           className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white hover:from-green-600 hover:to-green-700 transition-all shadow-lg"
//         >
//           <div className="flex items-center justify-between">
//             <div>
//               <TrendingUp size={32} className="mb-3 opacity-90" />
//               <h3 className="text-xl font-bold mb-1">Add Income</h3>
//               <p className="text-green-100">Record new income transactions</p>
//               <p className="text-sm text-green-200 mt-2">
//                 Current total: + ₹{stats.income.total.toLocaleString('en-IN')}
//               </p>
//             </div>
//             <ArrowRight size={32} className="opacity-75" />
//           </div>
//         </Link>

//         <Link
//           to="/admin/banking/expense"
//           className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-6 text-white hover:from-red-600 hover:to-red-700 transition-all shadow-lg"
//         >
//           <div className="flex items-center justify-between">
//             <div>
//               <TrendingDown size={32} className="mb-3 opacity-90" />
//               <h3 className="text-xl font-bold mb-1">Add Expense</h3>
//               <p className="text-red-100">Record new expense transactions</p>
//               <p className="text-sm text-red-200 mt-2">
//                 Current total: - ₹{stats.expense.total.toLocaleString('en-IN')}
//               </p>
//             </div>
//             <ArrowRight size={32} className="opacity-75" />
//           </div>
//         </Link>
//       </div>
//     </div>
//   );
// }




// Pages/banking/BankingOverview.jsx - ERROR FIXED

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Wallet,
  Landmark,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  ArrowRight,
  Download,
  ArrowUpCircle,
  ArrowDownCircle,
  DollarSign,
  ShoppingBag,
  Users,
  Clock
} from 'lucide-react';
import { 
  fetchAllTransactions,
  fetchTransactionSummary,
  selectAllTransactions,
  selectTransactionSummary,
  selectTransactionLoading
} from '../../features/transaction/transactionSlice';
import StatCard from '../../components/common/StatCard';
import showToast from '../../utils/toast';

export default function BankingOverview() {
  const dispatch = useDispatch();
  const summary = useSelector(selectTransactionSummary);
  const loading = useSelector(selectTransactionLoading);
  const allTransactions = useSelector(selectAllTransactions);
  const { user } = useSelector((state) => state.auth);
  
  const [period, setPeriod] = useState('month');
  const [recentAutoIncome, setRecentAutoIncome] = useState([]);
  const [recentExpense, setRecentExpense] = useState([]);
  const [stats, setStats] = useState({
    income: {
      handCash: 0,
      bank: 0,
      total: 0,
      count: 0,
      autoIncome: 0,
      autoCount: 0,
      autoHandCash: 0,  // 👈 Make sure these are initialized
      autoBank: 0       // 👈 Make sure these are initialized
    },
    expense: {
      handCash: 0,
      bank: 0,
      total: 0,
      count: 0
    },
    netAmount: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Load data
  useEffect(() => {
    loadData(false);
  }, [period]);

  // Recalculate stats whenever allTransactions changes
  useEffect(() => {
    if (allTransactions.length > 0) {
      calculateStats();
      filterTransactionsByPeriod();
    } else {
      // 👈 Set default values if no transactions
      setStats({
        income: {
          handCash: 0,
          bank: 0,
          total: 0,
          count: 0,
          autoIncome: 0,
          autoCount: 0,
          autoHandCash: 0,
          autoBank: 0
        },
        expense: {
          handCash: 0,
          bank: 0,
          total: 0,
          count: 0
        },
        netAmount: 0
      });
    }
  }, [allTransactions, period]);

  const loadData = async (showToastMessage = false) => {
    setIsLoading(true);
    try {
      await dispatch(fetchAllTransactions({ limit: 50 }));
      await dispatch(fetchTransactionSummary(period));
      
      if (!isInitialLoad && showToastMessage) {
        showToast.success('Data refreshed successfully');
      }
      
      if (isInitialLoad) {
        setIsInitialLoad(false);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
      if (!isInitialLoad && showToastMessage) {
        showToast.error('Failed to load data');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    loadData(true);
  };

  const getDateRangeForPeriod = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    switch(period) {
      case 'today':
        return {
          start: today,
          end: new Date(today.getTime() + 24 * 60 * 60 * 1000 - 1)
        };
      case 'week':
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        return {
          start: weekStart,
          end: new Date(today.getTime() + 24 * 60 * 60 * 1000 - 1)
        };
      case 'month':
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        return {
          start: monthStart,
          end: new Date(today.getTime() + 24 * 60 * 60 * 1000 - 1)
        };
      case 'year':
        const yearStart = new Date(today.getFullYear(), 0, 1);
        return {
          start: yearStart,
          end: new Date(today.getTime() + 24 * 60 * 60 * 1000 - 1)
        };
      case 'all':
      default:
        return {
          start: new Date(0),
          end: new Date(8640000000000000)
        };
    }
  };

  const isTransactionInPeriod = (transactionDate) => {
    if (period === 'all') return true;
    
    const { start, end } = getDateRangeForPeriod();
    const transDate = new Date(transactionDate);
    return transDate >= start && transDate <= end;
  };

  const filterTransactionsByPeriod = () => {
    if (!allTransactions || allTransactions.length === 0) {
      setRecentAutoIncome([]);
      setRecentExpense([]);
      return;
    }

    const filteredTransactions = allTransactions.filter(t => 
      isTransactionInPeriod(t.transactionDate)
    );

    const sortedTransactions = [...filteredTransactions].sort(
      (a, b) => new Date(b.transactionDate) - new Date(a.transactionDate)
    );

    // Show only AUTO income (from orders)
    const autoIncomeList = sortedTransactions
      .filter(t => t.type === 'income' && t.order)  // Only transactions with order reference
      .slice(0, 5);
    
    const expenseList = sortedTransactions
      .filter(t => t.type === 'expense')
      .slice(0, 5);

    setRecentAutoIncome(autoIncomeList);
    setRecentExpense(expenseList);
  };

  const calculateStats = () => {
    if (!allTransactions || allTransactions.length === 0) {
      setStats({
        income: {
          handCash: 0,
          bank: 0,
          total: 0,
          count: 0,
          autoIncome: 0,
          autoCount: 0,
          autoHandCash: 0,
          autoBank: 0
        },
        expense: {
          handCash: 0,
          bank: 0,
          total: 0,
          count: 0
        },
        netAmount: 0
      });
      return;
    }

    const periodTransactions = allTransactions.filter(t => 
      isTransactionInPeriod(t.transactionDate)
    );

    // Separate AUTO income (with order) and other income
    const autoIncomeTransactions = periodTransactions.filter(t => 
      t.type === 'income' && t.order
    );
    
    const otherIncomeTransactions = periodTransactions.filter(t => 
      t.type === 'income' && !t.order
    );
    
    const expenseTransactions = periodTransactions.filter(t => t.type === 'expense');

    // Auto income calculations
    const autoHandCash = autoIncomeTransactions
      .filter(t => t.accountType === 'hand-cash')
      .reduce((sum, t) => sum + (t.amount || 0), 0);
    
    const autoBank = autoIncomeTransactions
      .filter(t => t.accountType === 'bank')
      .reduce((sum, t) => sum + (t.amount || 0), 0);
    
    const autoTotal = autoHandCash + autoBank;
    const autoCount = autoIncomeTransactions.length;

    // Total income (including auto)
    const totalHandCashIncome = periodTransactions
      .filter(t => t.type === 'income' && t.accountType === 'hand-cash')
      .reduce((sum, t) => sum + (t.amount || 0), 0);
    
    const totalBankIncome = periodTransactions
      .filter(t => t.type === 'income' && t.accountType === 'bank')
      .reduce((sum, t) => sum + (t.amount || 0), 0);
    
    const totalIncomeCount = periodTransactions.filter(t => t.type === 'income').length;

    // Expense calculations
    const handCashExpense = expenseTransactions
      .filter(t => t.accountType === 'hand-cash')
      .reduce((sum, t) => sum + (t.amount || 0), 0);
    
    const bankExpense = expenseTransactions
      .filter(t => t.accountType === 'bank')
      .reduce((sum, t) => sum + (t.amount || 0), 0);
    
    const expenseCount = expenseTransactions.length;

    const totalIncome = totalHandCashIncome + totalBankIncome;
    const totalExpense = handCashExpense + bankExpense;

    setStats({
      income: {
        handCash: totalHandCashIncome,
        bank: totalBankIncome,
        total: totalIncome,
        count: totalIncomeCount,
        autoIncome: autoTotal,
        autoCount: autoCount,
        autoHandCash: autoHandCash,
        autoBank: autoBank
      },
      expense: {
        handCash: handCashExpense,
        bank: bankExpense,
        total: totalExpense,
        count: expenseCount
      },
      netAmount: totalIncome - totalExpense
    });
  };

  const handleExport = () => {
    showToast.info('Export feature coming soon...');
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getCategoryLabel = (category, customCategory, type) => {
    const incomeCategories = {
      'customer-advance': 'Advance Payment',
      'full-payment': 'Full Payment',
      'fabric-sale': 'Fabric Sale',
      'project-payment': 'Project Payment',
      'other-income': customCategory || 'Other Income'
    };
    
    const expenseCategories = {
      'salary': 'Employee Salary',
      'electricity': 'Electricity Bill',
      'travel': 'Travel',
      'material-purchase': 'Material Purchase',
      'rent': 'Rent',
      'maintenance': 'Maintenance',
      'other-expense': customCategory || 'Other Expense'
    };

    if (type === 'income') {
      return incomeCategories[category] || category;
    } else {
      return expenseCategories[category] || category;
    }
  };

  // 👇 SAFE RENDERING - Check if values exist
  const safeToLocale = (value) => {
    return (value || 0).toLocaleString('en-IN');
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-slate-800 mb-2">Banking Overview</h1>
            <p className="text-slate-600">Track auto income from orders and expenses</p>
            <p className="text-xs text-slate-400 mt-1">
              Last updated: {new Date().toLocaleTimeString()} • Showing: {
                period === 'today' ? 'Today' :
                period === 'week' ? 'This Week' :
                period === 'month' ? 'This Month' :
                period === 'year' ? 'This Year' : 'All Time'
              }
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-white border border-slate-200 rounded-xl font-medium text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2"
            >
              <Download size={18} />
              Export
            </button>
            <button
              onClick={handleRefresh}
              className="p-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-all"
              title="Refresh"
            >
              <RefreshCw size={20} className={isLoading ? 'animate-spin text-blue-600' : 'text-slate-600'} />
            </button>
          </div>
        </div>

        {/* Period Selector */}
        <div className="flex gap-2 mt-4">
          {['today', 'week', 'month', 'year', 'all'].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                period === p
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-100'
              }`}
            >
              {p === 'all' ? 'All Time' : p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Auto Income Summary Card */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl p-6 mb-8 text-white shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-medium opacity-90 flex items-center gap-2">
              <ShoppingBag size={20} />
              Auto Income from Orders
            </h2>
            <p className="text-4xl font-black mb-2">
              ₹{safeToLocale(stats.income.autoIncome)}
            </p>
            <p className="text-sm opacity-75">
              {stats.income.autoCount || 0} order payments
            </p>
          </div>
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
            <TrendingUp size={32} className="text-white" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-orange-500/20 rounded-lg p-3">
            <p className="text-sm opacity-75 flex items-center gap-1">
              <Wallet size={14} /> Hand Cash
            </p>
            <p className="text-xl font-bold">+ ₹{safeToLocale(stats.income.autoHandCash)}</p>
          </div>
          <div className="bg-blue-500/20 rounded-lg p-3">
            <p className="text-sm opacity-75 flex items-center gap-1">
              <Landmark size={14} /> Bank
            </p>
            <p className="text-xl font-bold">+ ₹{safeToLocale(stats.income.autoBank)}</p>
          </div>
        </div>
      </div>

      {/* Income and Expense Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Auto Income Card */}
        <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-purple-500 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-medium text-slate-500">Auto Income (from Orders)</h3>
              <p className="text-3xl font-black text-purple-600">
                + ₹{safeToLocale(stats.income.autoIncome)}
              </p>
            </div>
            <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center">
              <ShoppingBag size={28} className="text-purple-600" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-orange-50 p-3 rounded-lg">
              <p className="text-xs text-orange-600 font-medium flex items-center gap-1">
                <Wallet size={12} /> Hand Cash
              </p>
              <p className="text-lg font-bold text-orange-700">
                + ₹{safeToLocale(stats.income.autoHandCash)}
              </p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-xs text-blue-600 font-medium flex items-center gap-1">
                <Landmark size={12} /> Bank
              </p>
              <p className="text-lg font-bold text-blue-700">
                + ₹{safeToLocale(stats.income.autoBank)}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Link
              to="/admin/orders?payment=advance"
              className="flex-1 text-center py-2.5 bg-purple-50 text-purple-600 rounded-lg font-medium hover:bg-purple-100 transition-all flex items-center justify-center gap-2"
            >
              <ShoppingBag size={16} />
              View Orders
              <ArrowRight size={16} />
            </Link>
          </div>
          <Link
            to="/admin/banking/income"
            className="mt-3 block text-center py-2 bg-purple-50 text-purple-600 rounded-lg font-medium hover:bg-purple-100 transition-all"
          >
            View All Auto Income ({stats.income.autoCount || 0} payments) →
          </Link>
        </div>

        {/* Expense Summary Card */}
        <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-red-500 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-medium text-slate-500">Total Expense</h3>
              <p className="text-3xl font-black text-red-600">
                - ₹{safeToLocale(stats.expense.total)}
              </p>
            </div>
            <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center">
              <TrendingDown size={28} className="text-red-600" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-orange-50 p-3 rounded-lg">
              <p className="text-xs text-orange-600 font-medium flex items-center gap-1">
                <Wallet size={12} /> Hand Cash
              </p>
              <p className="text-lg font-bold text-orange-700">
                - ₹{safeToLocale(stats.expense.handCash)}
              </p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-xs text-blue-600 font-medium flex items-center gap-1">
                <Landmark size={12} /> Bank
              </p>
              <p className="text-lg font-bold text-blue-700">
                - ₹{safeToLocale(stats.expense.bank)}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Link
              to="/admin/banking/expense?account=hand-cash"
              className="flex-1 text-center py-2.5 bg-orange-50 text-orange-600 rounded-lg font-medium hover:bg-orange-100 transition-all flex items-center justify-center gap-2"
            >
              <Wallet size={16} />
              Hand Cash
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/admin/banking/expense?account=bank"
              className="flex-1 text-center py-2.5 bg-blue-50 text-blue-600 rounded-lg font-medium hover:bg-blue-100 transition-all flex items-center justify-center gap-2"
            >
              <Landmark size={16} />
              Bank
              <ArrowRight size={16} />
            </Link>
          </div>
          <Link
            to="/admin/banking/expense"
            className="mt-3 block text-center py-2 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition-all"
          >
            View All Expenses ({stats.expense.count || 0} transactions) →
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Auto Income (Orders)"
          value={`+ ₹${safeToLocale(stats.income.autoIncome)}`}
          icon={<ShoppingBag className="text-purple-600" size={24} />}
          bgColor="bg-purple-50"
          borderColor="border-purple-200"
          linkTo="/admin/banking/income"
          linkText="View all payments"
          subtext={`${stats.income.autoCount || 0} order payments`}
        />
        <StatCard
          title="Total Expense"
          value={`- ₹${safeToLocale(stats.expense.total)}`}
          icon={<ArrowDownCircle className="text-red-600" size={24} />}
          bgColor="bg-red-50"
          borderColor="border-red-200"
          linkTo="/admin/banking/expense"
          linkText="View all expenses"
          subtext={`${stats.expense.count || 0} transactions`}
        />
        <StatCard
          title="Net Amount"
          value={`₹${safeToLocale(stats.netAmount)}`}
          icon={<DollarSign className="text-green-600" size={24} />}
          bgColor="bg-green-50"
          borderColor="border-green-200"
          subtext={`${(stats.income.autoCount || 0) + (stats.expense.count || 0)} total transactions`}
        />
      </div>

      {/* Recent Transactions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Auto Income (from Orders) */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag size={20} className="text-purple-600" />
              <h3 className="font-bold text-slate-800 text-lg">Recent Order Payments</h3>
            </div>
            <Link 
              to="/admin/orders?payment=recent"
              className="text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center gap-1"
            >
              View all orders <ArrowRight size={16} />
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {recentAutoIncome.length > 0 ? (
              recentAutoIncome.map((transaction) => (
                <div key={transaction._id} className="p-4 hover:bg-slate-50 transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                        <TrendingUp size={20} className="text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">
                          {transaction.customerDetails?.name || 'Customer'}
                        </p>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-purple-600 font-medium">
                            {getCategoryLabel(transaction.category, transaction.customCategory, 'income')}
                          </span>
                          <span className="text-slate-300">•</span>
                          <span className="text-slate-500">{formatDate(transaction.transactionDate)}</span>
                        </div>
                        {transaction.order && (
                          <p className="text-xs text-slate-400 mt-1">
                            Order ID: {transaction.order.orderId || 'N/A'}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-purple-600">
                        + ₹{safeToLocale(transaction.amount)}
                      </p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        transaction.accountType === 'hand-cash' 
                          ? 'bg-orange-100 text-orange-600'
                          : 'bg-blue-100 text-blue-600'
                      }`}>
                        {transaction.accountType === 'hand-cash' ? 'Hand Cash' : 'Bank'}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <ShoppingBag size={32} className="text-slate-300 mx-auto mb-2" />
                <p className="text-slate-500">No order payments for this period</p>
                <Link
                  to="/admin/orders"
                  className="text-purple-600 text-sm hover:text-purple-700 mt-2 inline-block"
                >
                  Create Order with Advance →
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Recent Expense */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ArrowDownCircle size={20} className="text-red-600" />
              <h3 className="font-bold text-slate-800 text-lg">Recent Expense</h3>
            </div>
            <Link 
              to="/admin/banking/expense"
              className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-1"
            >
              View all ({stats.expense.count || 0}) <ArrowRight size={16} />
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {recentExpense.length > 0 ? (
              recentExpense.map((transaction) => (
                <div key={transaction._id} className="p-4 hover:bg-slate-50 transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                        <TrendingDown size={20} className="text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">
                          {getCategoryLabel(transaction.category, transaction.customCategory, 'expense')}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          <span>{formatDate(transaction.transactionDate)}</span>
                          <span>•</span>
                          <span>{formatTime(transaction.transactionDate)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-red-600">
                        - ₹{safeToLocale(transaction.amount)}
                      </p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        transaction.accountType === 'hand-cash' 
                          ? 'bg-orange-100 text-orange-600'
                          : 'bg-blue-100 text-blue-600'
                      }`}>
                        {transaction.accountType === 'hand-cash' ? 'Hand Cash' : 'Bank'}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <TrendingDown size={32} className="text-slate-300 mx-auto mb-2" />
                <p className="text-slate-500">No expense transactions for this period</p>
                <Link
                  to="/admin/banking/expense"
                  className="text-red-600 text-sm hover:text-red-700 mt-2 inline-block"
                >
                  Add Expense →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          to="/admin/orders/new"
          className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white hover:from-purple-600 hover:to-purple-700 transition-all shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <ShoppingBag size={32} className="mb-3 opacity-90" />
              <h3 className="text-xl font-bold mb-1">Create New Order</h3>
              <p className="text-purple-100">Add advance payment - Auto adds to income</p>
              <p className="text-sm text-purple-200 mt-2">
                Current auto income: + ₹{safeToLocale(stats.income.autoIncome)}
              </p>
            </div>
            <ArrowRight size={32} className="opacity-75" />
          </div>
        </Link>

        <Link
          to="/admin/banking/expense"
          className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-6 text-white hover:from-red-600 hover:to-red-700 transition-all shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <TrendingDown size={32} className="mb-3 opacity-90" />
              <h3 className="text-xl font-bold mb-1">Add Expense</h3>
              <p className="text-red-100">Record new expense transactions</p>
              <p className="text-sm text-red-200 mt-2">
                Current total: - ₹{safeToLocale(stats.expense.total)}
              </p>
            </div>
            <ArrowRight size={32} className="opacity-75" />
          </div>
        </Link>
      </div>

      {/* Info Note */}
      <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-700 flex items-center gap-2">
          <Clock size={16} />
          Income is automatically added when you create orders with advance payment or add payments to existing orders. No manual income entry needed!
        </p>
      </div>
    </div>
  );
}