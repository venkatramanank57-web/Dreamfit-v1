// // controllers/transaction.controller.js
// import Transaction from '../models/Transaction.js';
// import Customer from '../models/Customer.js';

// // Define allowed regular categories (without 'other' options)
// const INCOME_CATEGORIES = [
//   'customer-advance', 
//   'full-payment', 
//   'fabric-sale', 
//   'project-payment'
// ];

// const EXPENSE_CATEGORIES = [
//   'salary', 
//   'electricity', 
//   'travel', 
//   'material-purchase', 
//   'rent', 
//   'maintenance'
// ];

// // @desc    Create a new transaction (income/expense)
// // @route   POST /api/transactions
// // @access  Private (Admin, Store Keeper)
// export const createTransaction = async (req, res) => {
//   try {
//     const {
//       type,
//       category,
//       customCategory,
//       amount,
//       paymentMethod,
//       customer,
//       description,
//       transactionDate,
//       referenceNumber
//     } = req.body;

//     console.log('📥 Creating transaction:', { type, category, customCategory, amount, paymentMethod });

//     // Validation
//     if (!type || !category || !amount || !paymentMethod) {
//       return res.status(400).json({
//         success: false,
//         message: 'Please fill all required fields'
//       });
//     }

//     // Handle "other" categories
//     let isOtherCategory = false;
//     let finalCategory = category;
//     let finalCustomCategory = null;

//     // Income category validation
//     if (type === 'income') {
//       if (category === 'other-income') {
//         isOtherCategory = true;
//         finalCategory = 'other-income';
//         finalCustomCategory = customCategory;
        
//         if (!customCategory) {
//           return res.status(400).json({
//             success: false,
//             message: 'Please specify the income category'
//           });
//         }
//       } else if (!INCOME_CATEGORIES.includes(category)) {
//         return res.status(400).json({
//           success: false,
//           message: 'Invalid income category'
//         });
//       }
//     }

//     // Expense category validation
//     if (type === 'expense') {
//       if (category === 'other-expense') {
//         isOtherCategory = true;
//         finalCategory = 'other-expense';
//         finalCustomCategory = customCategory;
        
//         if (!customCategory) {
//           return res.status(400).json({
//             success: false,
//             message: 'Please specify the expense category'
//           });
//         }
//       } else if (!EXPENSE_CATEGORIES.includes(category)) {
//         return res.status(400).json({
//           success: false,
//           message: 'Invalid expense category'
//         });
//       }
//     }

//     // Set account type based on payment method
//     const accountType = paymentMethod === 'cash' ? 'hand-cash' : 'bank';

//     // Get customer details if customer ID is provided
//     let customerDetails = null;
//     if (customer) {
//       const customerData = await Customer.findById(customer).select('firstName lastName phone customerId');
//       if (customerData) {
//         customerDetails = {
//           name: `${customerData.firstName || ''} ${customerData.lastName || ''}`.trim() || 'Unknown',
//           phone: customerData.phone,
//           id: customerData.customerId || customerData._id
//         };
//       }
//     }

//     // Create transaction data object
//     const transactionData = {
//       type,
//       category: finalCategory,
//       amount: Number(amount),
//       paymentMethod,
//       accountType,
//       description: description || '',
//       transactionDate: transactionDate || Date.now(),
//       referenceNumber: referenceNumber || '',
//       createdBy: req.user._id,
//       status: 'completed'
//     };

//     // Add optional fields
//     if (isOtherCategory) {
//       transactionData.isOtherCategory = true;
//       transactionData.customCategory = finalCustomCategory;
//     }

//     if (customer) {
//       transactionData.customer = customer;
//       transactionData.customerDetails = customerDetails;
//     }

//     // Create transaction
//     const transaction = await Transaction.create(transactionData);

//     // Populate references
//     const populatedTransaction = await Transaction.findById(transaction._id)
//       .populate('customer', 'firstName lastName phone')
//       .populate('createdBy', 'name');

//     console.log('✅ Transaction created successfully:', transaction._id);

//     res.status(201).json({
//       success: true,
//       message: `${type === 'income' ? 'Income' : 'Expense'} added successfully`,
//       data: populatedTransaction
//     });

//   } catch (error) {
//     console.error('❌ Transaction creation error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to create transaction',
//       error: error.message
//     });
//   }
// };

// // @desc    Get all transactions with filters
// // @route   GET /api/transactions
// // @access  Private
// export const getTransactions = async (req, res) => {
//   try {
//     const {
//       type,
//       accountType,
//       category,
//       startDate,
//       endDate,
//       page = 1,
//       limit = 20,
//       sortBy = 'transactionDate',
//       sortOrder = 'desc'
//     } = req.query;

//     // Build filter
//     const filter = { status: 'completed' };

//     if (type) filter.type = type;
//     if (accountType) filter.accountType = accountType;
//     if (category) filter.category = category;

//     // Date range filter
//     if (startDate || endDate) {
//       filter.transactionDate = {};
//       if (startDate) {
//         const start = new Date(startDate);
//         start.setHours(0, 0, 0, 0);
//         filter.transactionDate.$gte = start;
//       }
//       if (endDate) {
//         const end = new Date(endDate);
//         end.setHours(23, 59, 59, 999);
//         filter.transactionDate.$lte = end;
//       }
//     }

//     // Pagination
//     const skip = (parseInt(page) - 1) * parseInt(limit);

//     // Get transactions
//     const transactions = await Transaction.find(filter)
//       .populate('customer', 'firstName lastName phone')
//       .populate('createdBy', 'name')
//       .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
//       .skip(skip)
//       .limit(parseInt(limit));

//     // Get total count
//     const total = await Transaction.countDocuments(filter);

//     // Calculate totals
//     const totals = await Transaction.aggregate([
//       { $match: filter },
//       {
//         $group: {
//           _id: null,
//           totalIncome: {
//             $sum: {
//               $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0]
//             }
//           },
//           totalExpense: {
//             $sum: {
//               $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0]
//             }
//           },
//           handCashIncome: {
//             $sum: {
//               $cond: [
//                 { $and: [{ $eq: ['$accountType', 'hand-cash'] }, { $eq: ['$type', 'income'] }] },
//                 '$amount',
//                 0
//               ]
//             }
//           },
//           handCashExpense: {
//             $sum: {
//               $cond: [
//                 { $and: [{ $eq: ['$accountType', 'hand-cash'] }, { $eq: ['$type', 'expense'] }] },
//                 '$amount',
//                 0
//               ]
//             }
//           },
//           bankIncome: {
//             $sum: {
//               $cond: [
//                 { $and: [{ $eq: ['$accountType', 'bank'] }, { $eq: ['$type', 'income'] }] },
//                 '$amount',
//                 0
//               ]
//             }
//           },
//           bankExpense: {
//             $sum: {
//               $cond: [
//                 { $and: [{ $eq: ['$accountType', 'bank'] }, { $eq: ['$type', 'expense'] }] },
//                 '$amount',
//                 0
//               ]
//             }
//           }
//         }
//       }
//     ]);

//     const summary = totals[0] || {
//       totalIncome: 0,
//       totalExpense: 0,
//       handCashIncome: 0,
//       handCashExpense: 0,
//       bankIncome: 0,
//       bankExpense: 0
//     };

//     // Calculate balances
//     const handCashBalance = summary.handCashIncome - summary.handCashExpense;
//     const bankBalance = summary.bankIncome - summary.bankExpense;

//     res.json({
//       success: true,
//       data: {
//         transactions,
//         summary: {
//           totalIncome: summary.totalIncome,
//           totalExpense: summary.totalExpense,
//           netBalance: summary.totalIncome - summary.totalExpense,
//           handCash: {
//             income: summary.handCashIncome,
//             expense: summary.handCashExpense,
//             balance: handCashBalance
//           },
//           bank: {
//             income: summary.bankIncome,
//             expense: summary.bankExpense,
//             balance: bankBalance
//           },
//           totalBalance: handCashBalance + bankBalance
//         },
//         pagination: {
//           page: parseInt(page),
//           limit: parseInt(limit),
//           total,
//           pages: Math.ceil(total / parseInt(limit))
//         }
//       }
//     });

//   } catch (error) {
//     console.error('❌ Get transactions error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch transactions',
//       error: error.message
//     });
//   }
// };

// // @desc    Get transaction summary for dashboard
// // @route   GET /api/transactions/summary
// // @access  Private
// export const getTransactionSummary = async (req, res) => {
//   try {
//     const { period = 'month' } = req.query;

//     let startDate = new Date();
//     const endDate = new Date();
//     endDate.setHours(23, 59, 59, 999);

//     if (period === 'today') {
//       startDate.setHours(0, 0, 0, 0);
//     } else if (period === 'week') {
//       startDate.setDate(startDate.getDate() - startDate.getDay());
//       startDate.setHours(0, 0, 0, 0);
//     } else if (period === 'month') {
//       startDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
//       startDate.setHours(0, 0, 0, 0);
//     } else if (period === 'year') {
//       startDate = new Date(startDate.getFullYear(), 0, 1);
//       startDate.setHours(0, 0, 0, 0);
//     }

//     const summary = await Transaction.aggregate([
//       {
//         $match: {
//           transactionDate: { $gte: startDate, $lte: endDate },
//           status: 'completed'
//         }
//       },
//       {
//         $group: {
//           _id: {
//             type: '$type',
//             accountType: '$accountType'
//           },
//           total: { $sum: '$amount' },
//           count: { $sum: 1 }
//         }
//       }
//     ]);

//     // Format response
//     const result = {
//       handCash: { income: 0, expense: 0, count: 0 },
//       bank: { income: 0, expense: 0, count: 0 },
//       recentTransactions: await Transaction.find({
//         transactionDate: { $gte: startDate, $lte: endDate },
//         status: 'completed'
//       })
//         .populate('customer', 'firstName lastName phone')
//         .sort({ transactionDate: -1 })
//         .limit(10)
//     };

//     summary.forEach(item => {
//       const account = item._id.accountType === 'hand-cash' ? 'handCash' : 'bank';
//       const type = item._id.type;
//       result[account][type] = item.total;
//       result[account].count += item.count;
//     });

//     res.json({
//       success: true,
//       data: result
//     });

//   } catch (error) {
//     console.error('❌ Get summary error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch summary',
//       error: error.message
//     });
//   }
// };

// // @desc    Delete transaction
// // @route   DELETE /api/transactions/:id
// // @access  Private (Admin only)
// export const deleteTransaction = async (req, res) => {
//   try {
//     const transaction = await Transaction.findById(req.params.id);

//     if (!transaction) {
//       return res.status(404).json({
//         success: false,
//         message: 'Transaction not found'
//       });
//     }

//     // Only admin can delete
//     if (req.user.role !== 'ADMIN') {
//       return res.status(403).json({
//         success: false,
//         message: 'Only admin can delete transactions'
//       });
//     }

//     await transaction.deleteOne();

//     console.log('✅ Transaction deleted:', req.params.id);

//     res.json({
//       success: true,
//       message: 'Transaction deleted successfully'
//     });

//   } catch (error) {
//     console.error('❌ Delete transaction error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to delete transaction',
//       error: error.message
//     });
//   }
// };



// // controllers/transaction.controller.js - FIXED VERSION (Remove duplicate export at bottom)

// import Transaction from '../models/Transaction.js';
// import Customer from '../models/Customer.js';
// import Order from '../models/Order.js';

// // Define allowed regular categories (without 'other' options)
// const INCOME_CATEGORIES = [
//   'customer-advance', 
//   'full-payment', 
//   'fabric-sale', 
//   'project-payment'
// ];

// const EXPENSE_CATEGORIES = [
//   'salary', 
//   'electricity', 
//   'travel', 
//   'material-purchase', 
//   'rent', 
//   'maintenance'
// ];

// // ============================================
// // ✅ CREATE TRANSACTION
// // ============================================
// export const createTransaction = async (req, res) => {
//   try {
//     const {
//       type,
//       category,
//       customCategory,
//       amount,
//       paymentMethod,
//       customer,
//       order,
//       description,
//       transactionDate,
//       referenceNumber
//     } = req.body;

//     console.log('📥 Creating transaction:', { 
//       type, 
//       category, 
//       customCategory, 
//       amount, 
//       paymentMethod,
//       order: order || 'No order' 
//     });

//     // Validation
//     if (!type || !category || !amount || !paymentMethod) {
//       return res.status(400).json({
//         success: false,
//         message: 'Please fill all required fields'
//       });
//     }

//     // Handle "other" categories
//     let isOtherCategory = false;
//     let finalCategory = category;
//     let finalCustomCategory = null;

//     // Income category validation
//     if (type === 'income') {
//       if (category === 'other-income') {
//         isOtherCategory = true;
//         finalCategory = 'other-income';
//         finalCustomCategory = customCategory;
        
//         if (!customCategory) {
//           return res.status(400).json({
//             success: false,
//             message: 'Please specify the income category'
//           });
//         }
//       } else if (!INCOME_CATEGORIES.includes(category)) {
//         return res.status(400).json({
//           success: false,
//           message: 'Invalid income category'
//         });
//       }
//     }

//     // Expense category validation
//     if (type === 'expense') {
//       if (category === 'other-expense') {
//         isOtherCategory = true;
//         finalCategory = 'other-expense';
//         finalCustomCategory = customCategory;
        
//         if (!customCategory) {
//           return res.status(400).json({
//             success: false,
//             message: 'Please specify the expense category'
//           });
//         }
//       } else if (!EXPENSE_CATEGORIES.includes(category)) {
//         return res.status(400).json({
//           success: false,
//           message: 'Invalid expense category'
//         });
//       }
//     }

//     // Set account type based on payment method
//     const accountType = paymentMethod === 'cash' ? 'hand-cash' : 'bank';

//     // Get customer details if customer ID is provided
//     let customerDetails = null;
//     if (customer) {
//       const customerData = await Customer.findById(customer).select('firstName lastName phone customerId');
//       if (customerData) {
//         customerDetails = {
//           name: `${customerData.firstName || ''} ${customerData.lastName || ''}`.trim() || 'Unknown',
//           phone: customerData.phone,
//           id: customerData.customerId || customerData._id
//         };
//       }
//     }

//     // CHECK FOR DUPLICATE TRANSACTIONS
//     if (order && type === 'income') {
//       const existingTransaction = await Transaction.findOne({
//         order: order,
//         type: 'income',
//         amount: Number(amount),
//         paymentMethod: paymentMethod,
//         status: 'completed'
//       });
      
//       if (existingTransaction) {
//         console.log('⚠️ Duplicate transaction detected for order:', order);
        
//         const populatedExisting = await Transaction.findById(existingTransaction._id)
//           .populate('customer', 'firstName lastName phone')
//           .populate('createdBy', 'name')
//           .populate('order', 'orderId customer');
          
//         return res.status(200).json({
//           success: true,
//           message: 'Transaction already exists for this order',
//           data: populatedExisting,
//           duplicate: true
//         });
//       }
//     }

//     // Create transaction data object
//     const transactionData = {
//       type,
//       category: finalCategory,
//       amount: Number(amount),
//       paymentMethod,
//       accountType,
//       description: description || '',
//       transactionDate: transactionDate || Date.now(),
//       referenceNumber: referenceNumber || '',
//       createdBy: req.user._id,
//       status: 'completed'
//     };

//     // Add optional fields
//     if (isOtherCategory) {
//       transactionData.isOtherCategory = true;
//       transactionData.customCategory = finalCustomCategory;
//     }

//     if (customer) {
//       transactionData.customer = customer;
//       transactionData.customerDetails = customerDetails;
//     }

//     if (order) {
//       transactionData.order = order;
//     }

//     // Create transaction
//     const transaction = await Transaction.create(transactionData);

//     // Populate references
//     const populatedTransaction = await Transaction.findById(transaction._id)
//       .populate('customer', 'firstName lastName phone')
//       .populate('createdBy', 'name')
//       .populate('order', 'orderId customer totalAmount');

//     console.log('✅ Transaction created successfully:', transaction._id);

//     res.status(201).json({
//       success: true,
//       message: `${type === 'income' ? 'Income' : 'Expense'} added successfully`,
//       data: populatedTransaction
//     });

//   } catch (error) {
//     console.error('❌ Transaction creation error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to create transaction',
//       error: error.message
//     });
//   }
// };

// // ============================================
// // ✅ GET ALL TRANSACTIONS WITH FILTERS
// // ============================================
// export const getTransactions = async (req, res) => {
//   try {
//     const {
//       type,
//       accountType,
//       category,
//       startDate,
//       endDate,
//       order,
//       customer,
//       search,
//       page = 1,
//       limit = 20,
//       sortBy = 'transactionDate',
//       sortOrder = 'desc'
//     } = req.query;

//     // Build filter
//     const filter = { status: 'completed' };

//     if (type) filter.type = type;
//     if (accountType) filter.accountType = accountType;
//     if (category) filter.category = category;
//     if (order) filter.order = order;
//     if (customer) filter.customer = customer;

//     // Search in description or reference
//     if (search) {
//       filter.$or = [
//         { description: { $regex: search, $options: 'i' } },
//         { referenceNumber: { $regex: search, $options: 'i' } }
//       ];
//     }

//     // Date range filter
//     if (startDate || endDate) {
//       filter.transactionDate = {};
//       if (startDate) {
//         const start = new Date(startDate);
//         start.setHours(0, 0, 0, 0);
//         filter.transactionDate.$gte = start;
//       }
//       if (endDate) {
//         const end = new Date(endDate);
//         end.setHours(23, 59, 59, 999);
//         filter.transactionDate.$lte = end;
//       }
//     }

//     // Pagination
//     const skip = (parseInt(page) - 1) * parseInt(limit);

//     // Get transactions
//     const transactions = await Transaction.find(filter)
//       .populate('customer', 'firstName lastName phone customerId')
//       .populate('createdBy', 'name')
//       .populate('order', 'orderId customer totalAmount status')
//       .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
//       .skip(skip)
//       .limit(parseInt(limit));

//     // Get total count
//     const total = await Transaction.countDocuments(filter);

//     // Calculate totals
//     const totals = await Transaction.aggregate([
//       { $match: filter },
//       {
//         $group: {
//           _id: null,
//           totalIncome: {
//             $sum: {
//               $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0]
//             }
//           },
//           totalExpense: {
//             $sum: {
//               $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0]
//             }
//           },
//           handCashIncome: {
//             $sum: {
//               $cond: [
//                 { $and: [{ $eq: ['$accountType', 'hand-cash'] }, { $eq: ['$type', 'income'] }] },
//                 '$amount',
//                 0
//               ]
//             }
//           },
//           handCashExpense: {
//             $sum: {
//               $cond: [
//                 { $and: [{ $eq: ['$accountType', 'hand-cash'] }, { $eq: ['$type', 'expense'] }] },
//                 '$amount',
//                 0
//               ]
//             }
//           },
//           bankIncome: {
//             $sum: {
//               $cond: [
//                 { $and: [{ $eq: ['$accountType', 'bank'] }, { $eq: ['$type', 'income'] }] },
//                 '$amount',
//                 0
//               ]
//             }
//           },
//           bankExpense: {
//             $sum: {
//               $cond: [
//                 { $and: [{ $eq: ['$accountType', 'bank'] }, { $eq: ['$type', 'expense'] }] },
//                 '$amount',
//                 0
//               ]
//             }
//           }
//         }
//       }
//     ]);

//     const summary = totals[0] || {
//       totalIncome: 0,
//       totalExpense: 0,
//       handCashIncome: 0,
//       handCashExpense: 0,
//       bankIncome: 0,
//       bankExpense: 0
//     };

//     // Calculate balances
//     const handCashBalance = summary.handCashIncome - summary.handCashExpense;
//     const bankBalance = summary.bankIncome - summary.bankExpense;

//     res.json({
//       success: true,
//       data: {
//         transactions,
//         summary: {
//           totalIncome: summary.totalIncome,
//           totalExpense: summary.totalExpense,
//           netBalance: summary.totalIncome - summary.totalExpense,
//           handCash: {
//             income: summary.handCashIncome,
//             expense: summary.handCashExpense,
//             balance: handCashBalance
//           },
//           bank: {
//             income: summary.bankIncome,
//             expense: summary.bankExpense,
//             balance: bankBalance
//           },
//           totalBalance: handCashBalance + bankBalance
//         },
//         pagination: {
//           page: parseInt(page),
//           limit: parseInt(limit),
//           total,
//           pages: Math.ceil(total / parseInt(limit))
//         }
//       }
//     });

//   } catch (error) {
//     console.error('❌ Get transactions error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch transactions',
//       error: error.message
//     });
//   }
// };

// // ============================================
// // ✅ GET TRANSACTION BY ID
// // ============================================
// export const getTransactionById = async (req, res) => {
//   try {
//     const transaction = await Transaction.findById(req.params.id)
//       .populate('customer', 'firstName lastName phone customerId')
//       .populate('createdBy', 'name')
//       .populate('order', 'orderId customer totalAmount status deliveryDate');

//     if (!transaction) {
//       return res.status(404).json({
//         success: false,
//         message: 'Transaction not found'
//       });
//     }

//     res.json({
//       success: true,
//       data: transaction
//     });
//   } catch (error) {
//     console.error('❌ Get transaction error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch transaction',
//       error: error.message
//     });
//   }
// };

// // ============================================
// // ✅ UPDATE TRANSACTION
// // ============================================
// export const updateTransaction = async (req, res) => {
//   try {
//     const {
//       category,
//       customCategory,
//       amount,
//       paymentMethod,
//       description,
//       transactionDate,
//       referenceNumber,
//       status
//     } = req.body;

//     const transaction = await Transaction.findById(req.params.id);

//     if (!transaction) {
//       return res.status(404).json({
//         success: false,
//         message: 'Transaction not found'
//       });
//     }

//     // Only admin can update
//     if (req.user.role !== 'ADMIN') {
//       return res.status(403).json({
//         success: false,
//         message: 'Only admin can update transactions'
//       });
//     }

//     // Check if transaction is linked to an order
//     if (transaction.order && (amount || paymentMethod)) {
//       console.log('⚠️ Updating order-linked transaction:', transaction.order);
//     }

//     // Update fields
//     if (category) {
//       if (category === 'other-income' || category === 'other-expense') {
//         transaction.category = category;
//         transaction.isOtherCategory = true;
//         transaction.customCategory = customCategory;
//       } else {
//         transaction.category = category;
//         transaction.isOtherCategory = false;
//         transaction.customCategory = null;
//       }
//     }

//     if (amount) transaction.amount = Number(amount);
//     if (paymentMethod) {
//       transaction.paymentMethod = paymentMethod;
//       transaction.accountType = paymentMethod === 'cash' ? 'hand-cash' : 'bank';
//     }
//     if (description !== undefined) transaction.description = description;
//     if (transactionDate) transaction.transactionDate = transactionDate;
//     if (referenceNumber !== undefined) transaction.referenceNumber = referenceNumber;
//     if (status) transaction.status = status;

//     await transaction.save();

//     const updatedTransaction = await Transaction.findById(transaction._id)
//       .populate('customer', 'firstName lastName phone')
//       .populate('createdBy', 'name')
//       .populate('order', 'orderId');

//     res.json({
//       success: true,
//       message: 'Transaction updated successfully',
//       data: updatedTransaction
//     });
//   } catch (error) {
//     console.error('❌ Update transaction error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to update transaction',
//       error: error.message
//     });
//   }
// };

// // ============================================
// // ✅ DELETE TRANSACTION
// // ============================================
// export const deleteTransaction = async (req, res) => {
//   try {
//     const transaction = await Transaction.findById(req.params.id);

//     if (!transaction) {
//       return res.status(404).json({
//         success: false,
//         message: 'Transaction not found'
//       });
//     }

//     // Only admin can delete
//     if (req.user.role !== 'ADMIN') {
//       return res.status(403).json({
//         success: false,
//         message: 'Only admin can delete transactions'
//       });
//     }

//     // Check if this transaction is linked to an order
//     if (transaction.order) {
//       console.log(`⚠️ Transaction ${req.params.id} is linked to order ${transaction.order}`);
//     }

//     await transaction.deleteOne();

//     console.log('✅ Transaction deleted:', req.params.id);

//     res.json({
//       success: true,
//       message: 'Transaction deleted successfully'
//     });

//   } catch (error) {
//     console.error('❌ Delete transaction error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to delete transaction',
//       error: error.message
//     });
//   }
// };

// // ============================================
// // ✅ GET TRANSACTIONS BY ORDER
// // ============================================
// export const getTransactionsByOrder = async (req, res) => {
//   try {
//     const { orderId } = req.params;
    
//     // First get the order details
//     const order = await Order.findById(orderId).select('orderId customer totalAmount');
    
//     const transactions = await Transaction.find({ 
//       order: orderId,
//       status: 'completed' 
//     })
//     .populate('customer', 'firstName lastName phone')
//     .populate('createdBy', 'name')
//     .sort('-transactionDate');
    
//     const totalIncome = transactions
//       .filter(t => t.type === 'income')
//       .reduce((sum, t) => sum + t.amount, 0);
      
//     const totalExpense = transactions
//       .filter(t => t.type === 'expense')
//       .reduce((sum, t) => sum + t.amount, 0);
    
//     res.json({
//       success: true,
//       order: order ? {
//         id: order._id,
//         orderId: order.orderId,
//         totalAmount: order.totalAmount
//       } : null,
//       count: transactions.length,
//       summary: {
//         totalIncome,
//         totalExpense,
//         netAmount: totalIncome - totalExpense
//       },
//       transactions
//     });
    
//   } catch (error) {
//     console.error('❌ Get by order error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch transactions',
//       error: error.message
//     });
//   }
// };

// // ============================================
// // ✅ GET TRANSACTIONS BY CUSTOMER
// // ============================================
// export const getTransactionsByCustomer = async (req, res) => {
//   try {
//     const { customerId } = req.params;
//     const { type, startDate, endDate, limit = 50 } = req.query;

//     const filter = { 
//       customer: customerId,
//       status: 'completed' 
//     };

//     if (type) filter.type = type;

//     if (startDate || endDate) {
//       filter.transactionDate = {};
//       if (startDate) {
//         const start = new Date(startDate);
//         start.setHours(0, 0, 0, 0);
//         filter.transactionDate.$gte = start;
//       }
//       if (endDate) {
//         const end = new Date(endDate);
//         end.setHours(23, 59, 59, 999);
//         filter.transactionDate.$lte = end;
//       }
//     }

//     const transactions = await Transaction.find(filter)
//       .populate('order', 'orderId')
//       .populate('createdBy', 'name')
//       .sort('-transactionDate')
//       .limit(parseInt(limit));

//     // Calculate totals
//     const totalIncome = transactions
//       .filter(t => t.type === 'income')
//       .reduce((sum, t) => sum + t.amount, 0);

//     const totalExpense = transactions
//       .filter(t => t.type === 'expense')
//       .reduce((sum, t) => sum + t.amount, 0);

//     // Group by order
//     const byOrder = {};
//     transactions.forEach(t => {
//       if (t.order) {
//         const orderId = t.order.toString();
//         if (!byOrder[orderId]) {
//           byOrder[orderId] = {
//             orderId: orderId,
//             income: 0,
//             expense: 0,
//             count: 0
//           };
//         }
//         if (t.type === 'income') {
//           byOrder[orderId].income += t.amount;
//         } else {
//           byOrder[orderId].expense += t.amount;
//         }
//         byOrder[orderId].count++;
//       }
//     });

//     res.json({
//       success: true,
//       count: transactions.length,
//       summary: {
//         totalIncome,
//         totalExpense,
//         netBalance: totalIncome - totalExpense
//       },
//       byOrder: Object.values(byOrder),
//       transactions
//     });
//   } catch (error) {
//     console.error('❌ Get by customer error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch transactions',
//       error: error.message
//     });
//   }
// };

// // ============================================
// // ✅ GET TRANSACTION SUMMARY
// // ============================================
// export const getTransactionSummary = async (req, res) => {
//   try {
//     const { period = 'month' } = req.query;

//     let startDate = new Date();
//     const endDate = new Date();
//     endDate.setHours(23, 59, 59, 999);

//     if (period === 'today') {
//       startDate.setHours(0, 0, 0, 0);
//     } else if (period === 'week') {
//       startDate.setDate(startDate.getDate() - startDate.getDay());
//       startDate.setHours(0, 0, 0, 0);
//     } else if (period === 'month') {
//       startDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
//       startDate.setHours(0, 0, 0, 0);
//     } else if (period === 'year') {
//       startDate = new Date(startDate.getFullYear(), 0, 1);
//       startDate.setHours(0, 0, 0, 0);
//     }

//     const summary = await Transaction.aggregate([
//       {
//         $match: {
//           transactionDate: { $gte: startDate, $lte: endDate },
//           status: 'completed'
//         }
//       },
//       {
//         $group: {
//           _id: {
//             type: '$type',
//             accountType: '$accountType'
//           },
//           total: { $sum: '$amount' },
//           count: { $sum: 1 }
//         }
//       }
//     ]);

//     // Get category breakdown
//     const categoryBreakdown = await Transaction.aggregate([
//       {
//         $match: {
//           transactionDate: { $gte: startDate, $lte: endDate },
//           status: 'completed'
//         }
//       },
//       {
//         $group: {
//           _id: {
//             type: '$type',
//             category: '$category'
//           },
//           total: { $sum: '$amount' },
//           count: { $sum: 1 }
//         }
//       },
//       { $sort: { total: -1 } }
//     ]);

//     // Format response
//     const result = {
//       period,
//       dateRange: {
//         start: startDate,
//         end: endDate
//       },
//       handCash: { income: 0, expense: 0, count: 0 },
//       bank: { income: 0, expense: 0, count: 0 },
//       categoryBreakdown,
//       recentTransactions: await Transaction.find({
//         transactionDate: { $gte: startDate, $lte: endDate },
//         status: 'completed'
//       })
//         .populate('customer', 'firstName lastName phone')
//         .populate('order', 'orderId')
//         .sort({ transactionDate: -1 })
//         .limit(10)
//     };

//     summary.forEach(item => {
//       const account = item._id.accountType === 'hand-cash' ? 'handCash' : 'bank';
//       const type = item._id.type;
//       result[account][type] = item.total;
//       result[account].count += item.count;
//     });

//     res.json({
//       success: true,
//       data: result
//     });

//   } catch (error) {
//     console.error('❌ Get summary error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch summary',
//       error: error.message
//     });
//   }
// };

// // ============================================
// // ✅ GET TRANSACTION STATS
// // ============================================
// export const getTransactionStats = async (req, res) => {
//   try {
//     const stats = await Transaction.aggregate([
//       { $match: { status: 'completed' } },
//       {
//         $group: {
//           _id: {
//             type: '$type',
//             category: '$category',
//             accountType: '$accountType'
//           },
//           totalAmount: { $sum: '$amount' },
//           count: { $sum: 1 },
//           avgAmount: { $avg: '$amount' },
//           maxAmount: { $max: '$amount' },
//           minAmount: { $min: '$amount' }
//         }
//       },
//       { $sort: { totalAmount: -1 } }
//     ]);

//     // Get top income sources
//     const topIncomeSources = await Transaction.aggregate([
//       { $match: { type: 'income', status: 'completed' } },
//       {
//         $group: {
//           _id: {
//             category: '$category',
//             order: '$order'
//           },
//           totalAmount: { $sum: '$amount' },
//           count: { $sum: 1 }
//         }
//       },
//       { $sort: { totalAmount: -1 } },
//       { $limit: 10 }
//     ]);

//     // Get monthly trend
//     const monthlyTrend = await Transaction.aggregate([
//       { 
//         $match: { 
//           status: 'completed',
//           transactionDate: { $gte: new Date(new Date().getFullYear(), 0, 1) }
//         } 
//       },
//       {
//         $group: {
//           _id: {
//             month: { $month: '$transactionDate' },
//             year: { $year: '$transactionDate' },
//             type: '$type'
//           },
//           total: { $sum: '$amount' },
//           count: { $sum: 1 }
//         }
//       },
//       { $sort: { '_id.year': 1, '_id.month': 1 } }
//     ]);

//     res.json({
//       success: true,
//       data: {
//         detailed: stats,
//         topIncomeSources,
//         monthlyTrend
//       }
//     });

//   } catch (error) {
//     console.error('❌ Get stats error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch stats',
//       error: error.message
//     });
//   }
// };

// // ============================================
// // ✅ BULK DELETE TRANSACTIONS
// // ============================================
// export const bulkDeleteTransactions = async (req, res) => {
//   try {
//     const { ids } = req.body;

//     if (!ids || !Array.isArray(ids) || ids.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: 'Please provide an array of transaction IDs'
//       });
//     }

//     // Check if any transactions are linked to orders
//     const orderLinkedTransactions = await Transaction.find({
//       _id: { $in: ids },
//       order: { $ne: null }
//     });

//     if (orderLinkedTransactions.length > 0) {
//       console.log('⚠️ Cannot delete order-linked transactions:', orderLinkedTransactions.map(t => t._id));
//       return res.status(400).json({
//         success: false,
//         message: 'Cannot delete transactions linked to orders',
//         orderLinked: orderLinkedTransactions.map(t => t._id)
//       });
//     }

//     const result = await Transaction.deleteMany({
//       _id: { $in: ids }
//     });

//     res.json({
//       success: true,
//       message: `Successfully deleted ${result.deletedCount} transactions`,
//       deletedCount: result.deletedCount
//     });
//   } catch (error) {
//     console.error('❌ Bulk delete error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to delete transactions',
//       error: error.message
//     });
//   }
// };

// // ============================================
// // ✅ EXPORT TRANSACTIONS
// // ============================================
// export const exportTransactions = async (req, res) => {
//   try {
//     const {
//       type,
//       startDate,
//       endDate,
//       accountType,
//       customerId
//     } = req.query;

//     const filter = { status: 'completed' };

//     if (type) filter.type = type;
//     if (accountType) filter.accountType = accountType;
//     if (customerId) filter.customer = customerId;

//     if (startDate || endDate) {
//       filter.transactionDate = {};
//       if (startDate) {
//         const start = new Date(startDate);
//         start.setHours(0, 0, 0, 0);
//         filter.transactionDate.$gte = start;
//       }
//       if (endDate) {
//         const end = new Date(endDate);
//         end.setHours(23, 59, 59, 999);
//         filter.transactionDate.$lte = end;
//       }
//     }

//     const transactions = await Transaction.find(filter)
//       .populate('customer', 'firstName lastName phone')
//       .populate('order', 'orderId')
//       .populate('createdBy', 'name')
//       .sort('-transactionDate');

//     // Format for export
//     const exportData = transactions.map(t => ({
//       'Transaction ID': t._id,
//       'Type': t.type,
//       'Category': t.isOtherCategory ? t.customCategory : t.category,
//       'Amount': t.amount,
//       'Payment Method': t.paymentMethod,
//       'Account': t.accountType === 'hand-cash' ? 'Hand Cash' : 'Bank',
//       'Customer Name': t.customerDetails?.name || 'N/A',
//       'Customer Phone': t.customerDetails?.phone || 'N/A',
//       'Order ID': t.order?.orderId || 'N/A',
//       'Description': t.description || '',
//       'Reference Number': t.referenceNumber || '',
//       'Date': new Date(t.transactionDate).toLocaleDateString('en-IN'),
//       'Time': new Date(t.transactionDate).toLocaleTimeString('en-IN'),
//       'Created By': t.createdBy?.name || 'N/A',
//       'Status': t.status
//     }));

//     res.json({
//       success: true,
//       count: exportData.length,
//       data: exportData
//     });
//   } catch (error) {
//     console.error('❌ Export error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to export transactions',
//       error: error.message
//     });
//   }
// };

// // ============================================
// // ✅ GET TRANSACTIONS BY DATE RANGE
// // ============================================
// export const getTransactionsByDateRange = async (req, res) => {
//   try {
//     const { start, end } = req.params;
//     const { type, accountType } = req.query;

//     const startDate = new Date(start);
//     startDate.setHours(0, 0, 0, 0);

//     const endDate = new Date(end);
//     endDate.setHours(23, 59, 59, 999);

//     const filter = {
//       transactionDate: { $gte: startDate, $lte: endDate },
//       status: 'completed'
//     };

//     if (type) filter.type = type;
//     if (accountType) filter.accountType = accountType;

//     const transactions = await Transaction.find(filter)
//       .populate('customer', 'firstName lastName phone')
//       .populate('order', 'orderId')
//       .sort('transactionDate');

//     // Calculate daily summary
//     const dailySummary = {};
//     transactions.forEach(t => {
//       const date = t.transactionDate.toISOString().split('T')[0];
//       if (!dailySummary[date]) {
//         dailySummary[date] = {
//           date,
//           income: 0,
//           expense: 0,
//           count: 0
//         };
//       }
//       if (t.type === 'income') {
//         dailySummary[date].income += t.amount;
//       } else {
//         dailySummary[date].expense += t.amount;
//       }
//       dailySummary[date].count++;
//     });

//     res.json({
//       success: true,
//       dateRange: { start, end },
//       summary: {
//         totalTransactions: transactions.length,
//         totalIncome: transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0),
//         totalExpense: transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0),
//         netAmount: transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0) - 
//                   transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)
//       },
//       dailySummary: Object.values(dailySummary),
//       transactions
//     });
//   } catch (error) {
//     console.error('❌ Date range error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch transactions',
//       error: error.message
//     });
//   }
// };

// // ============================================
// // ✅ GET DASHBOARD DATA
// // ============================================
// export const getDashboardData = async (req, res) => {
//   try {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
//     const startOfYear = new Date(today.getFullYear(), 0, 1);

//     // Get today's transactions
//     const todayTransactions = await Transaction.find({
//       transactionDate: { $gte: today },
//       status: 'completed'
//     });

//     // Get this month's transactions
//     const monthTransactions = await Transaction.find({
//       transactionDate: { $gte: startOfMonth },
//       status: 'completed'
//     });

//     // Get this year's transactions
//     const yearTransactions = await Transaction.find({
//       transactionDate: { $gte: startOfYear },
//       status: 'completed'
//     });

//     // Calculate totals
//     const todayIncome = todayTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
//     const todayExpense = todayTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    
//     const monthIncome = monthTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
//     const monthExpense = monthTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    
//     const yearIncome = yearTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
//     const yearExpense = yearTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

//     // Get recent transactions
//     const recentTransactions = await Transaction.find({ status: 'completed' })
//       .populate('customer', 'firstName lastName phone')
//       .populate('order', 'orderId')
//       .sort('-transactionDate')
//       .limit(10);

//     res.json({
//       success: true,
//       data: {
//         today: {
//           income: todayIncome,
//           expense: todayExpense,
//           net: todayIncome - todayExpense,
//           count: todayTransactions.length
//         },
//         thisMonth: {
//           income: monthIncome,
//           expense: monthExpense,
//           net: monthIncome - monthExpense,
//           count: monthTransactions.length
//         },
//         thisYear: {
//           income: yearIncome,
//           expense: yearExpense,
//           net: yearIncome - yearExpense,
//           count: yearTransactions.length
//         },
//         recentTransactions
//       }
//     });

//   } catch (error) {
//     console.error('❌ Dashboard error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch dashboard data',
//       error: error.message
//     });
//   }
// };

// // ============================================
// // ✅ NO DUPLICATE EXPORT AT THE BOTTOM - REMOVED!
// // ============================================
// // The functions are already exported with "export" keyword above




// // Add to transaction.controller.js after getDashboardData

// // ============================================
// // ✅ GET TODAY'S TRANSACTIONS (NEW)
// // ============================================
// export const getTodayTransactions = async (req, res) => {
//   try {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
    
//     const tomorrow = new Date(today);
//     tomorrow.setDate(tomorrow.getDate() + 1);

//     const transactions = await Transaction.find({
//       transactionDate: { $gte: today, $lt: tomorrow },
//       status: 'completed'
//     })
//     .populate('customer', 'firstName lastName phone')
//     .populate('order', 'orderId')
//     .sort('-transactionDate');

//     // Calculate totals
//     const totalIncome = transactions
//       .filter(t => t.type === 'income')
//       .reduce((sum, t) => sum + t.amount, 0);
      
//     const totalExpense = transactions
//       .filter(t => t.type === 'expense')
//       .reduce((sum, t) => sum + t.amount, 0);

//     // Split by account type
//     const handCashIncome = transactions
//       .filter(t => t.type === 'income' && t.accountType === 'hand-cash')
//       .reduce((sum, t) => sum + t.amount, 0);
      
//     const bankIncome = transactions
//       .filter(t => t.type === 'income' && t.accountType === 'bank')
//       .reduce((sum, t) => sum + t.amount, 0);
      
//     const handCashExpense = transactions
//       .filter(t => t.type === 'expense' && t.accountType === 'hand-cash')
//       .reduce((sum, t) => sum + t.amount, 0);
      
//     const bankExpense = transactions
//       .filter(t => t.type === 'expense' && t.accountType === 'bank')
//       .reduce((sum, t) => sum + t.amount, 0);

//     res.json({
//       success: true,
//       data: {
//         transactions,
//         summary: {
//           totalIncome,
//           totalExpense,
//           netAmount: totalIncome - totalExpense,
//           count: transactions.length,
//           handCash: {
//             income: handCashIncome,
//             expense: handCashExpense,
//             balance: handCashIncome - handCashExpense
//           },
//           bank: {
//             income: bankIncome,
//             expense: bankExpense,
//             balance: bankIncome - bankExpense
//           }
//         }
//       }
//     });

//   } catch (error) {
//     console.error('❌ Get today transactions error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch today\'s transactions',
//       error: error.message
//     });
//   }
// };






// // ============================================
// // ✅ GET DAILY REVENUE STATS FOR CHART (NEW)
// // ============================================
// export const getDailyRevenueStats = async (req, res) => {
//   try {
//     const { period, startDate, endDate } = req.query;
    
//     console.log('📊 Getting daily revenue stats with:', { period, startDate, endDate });
    
//     // Build date filter based on period or custom dates
//     let start, end;
//     const today = new Date();
    
//     if (period === 'today') {
//       start = new Date(today.setHours(0, 0, 0, 0));
//       end = new Date(today.setHours(23, 59, 59, 999));
//     } 
//     else if (period === 'week') {
//       start = new Date(today);
//       start.setDate(today.getDate() - today.getDay()); // Start of week (Sunday)
//       start.setHours(0, 0, 0, 0);
      
//       end = new Date(start);
//       end.setDate(start.getDate() + 7);
//       end.setHours(23, 59, 59, 999);
//     } 
//     else if (period === 'month') {
//       start = new Date(today.getFullYear(), today.getMonth(), 1);
//       end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
//       end.setHours(23, 59, 59, 999);
//     } 
//     else if (startDate && endDate) {
//       start = new Date(startDate);
//       start.setHours(0, 0, 0, 0);
      
//       end = new Date(endDate);
//       end.setHours(23, 59, 59, 999);
//     } else {
//       // Default to current month
//       start = new Date(today.getFullYear(), today.getMonth(), 1);
//       end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
//       end.setHours(23, 59, 59, 999);
//     }
    
//     console.log('📅 Date range:', { start, end });

//     // Get transactions grouped by date
//     const transactions = await Transaction.aggregate([
//       {
//         $match: {
//           transactionDate: { $gte: start, $lte: end },
//           status: 'completed'
//         }
//       },
//       {
//         $group: {
//           _id: {
//             date: { $dateToString: { format: '%Y-%m-%d', date: '$transactionDate' } },
//             type: '$type'
//           },
//           total: { $sum: '$amount' },
//           count: { $sum: 1 }
//         }
//       },
//       { $sort: { '_id.date': 1 } }
//     ]);

//     console.log('📊 Aggregated transactions:', transactions);

//     // Prepare chart data based on period
//     let chartData = [];

//     if (period === 'today') {
//       // Hourly data for today
//       const hourlyData = {};
      
//       // Initialize hours
//       for (let i = 9; i <= 20; i++) {
//         const hourKey = i < 10 ? `0${i}:00` : `${i}:00`;
//         hourlyData[hourKey] = { revenue: 0, expense: 0 };
//       }

//       // Fill with actual data
//       transactions.forEach(item => {
//         const date = new Date(item._id.date);
//         const hour = date.getHours();
//         if (hour >= 9 && hour <= 20) {
//           const hourKey = hour < 10 ? `0${hour}:00` : `${hour}:00`;
//           if (item._id.type === 'income') {
//             hourlyData[hourKey].revenue = item.total;
//           } else {
//             hourlyData[hourKey].expense = item.total;
//           }
//         }
//       });

//       // Convert to array
//       for (let i = 9; i <= 20; i++) {
//         const hourKey = i < 10 ? `0${i}:00` : `${i}:00`;
//         chartData.push({
//           time: `${i} AM`,
//           revenue: hourlyData[hourKey].revenue || 0,
//           expense: hourlyData[hourKey].expense || 0
//         });
//       }
//     } 
//     else if (period === 'week') {
//       // Daily data for week
//       const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
//       const dailyMap = new Map();
      
//       // Initialize days
//       for (let i = 0; i < 7; i++) {
//         const date = new Date(start);
//         date.setDate(start.getDate() + i);
//         const dateStr = date.toISOString().split('T')[0];
//         dailyMap.set(dateStr, { 
//           day: days[date.getDay()],
//           revenue: 0, 
//           expense: 0 
//         });
//       }

//       // Fill with actual data
//       transactions.forEach(item => {
//         const dateStr = item._id.date;
//         if (dailyMap.has(dateStr)) {
//           const entry = dailyMap.get(dateStr);
//           if (item._id.type === 'income') {
//             entry.revenue = item.total;
//           } else {
//             entry.expense = item.total;
//           }
//         }
//       });

//       // Convert to array
//       chartData = Array.from(dailyMap.values());
//     }
//     else {
//       // Monthly/Period data - group by week or day
//       const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      
//       if (diffDays <= 7) {
//         // Daily data for short periods
//         const dailyMap = new Map();
        
//         // Initialize all dates in range
//         for (let i = 0; i <= diffDays; i++) {
//           const date = new Date(start);
//           date.setDate(start.getDate() + i);
//           const dateStr = date.toISOString().split('T')[0];
//           dailyMap.set(dateStr, { 
//             day: date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
//             revenue: 0, 
//             expense: 0 
//           });
//         }

//         // Fill with actual data
//         transactions.forEach(item => {
//           const dateStr = item._id.date;
//           if (dailyMap.has(dateStr)) {
//             const entry = dailyMap.get(dateStr);
//             if (item._id.type === 'income') {
//               entry.revenue = item.total;
//             } else {
//               entry.expense = item.total;
//             }
//           }
//         });

//         chartData = Array.from(dailyMap.values());
//       } else {
//         // Weekly data for longer periods
//         const weeks = Math.ceil(diffDays / 7);
//         const weeklyData = [];

//         for (let w = 0; w < weeks; w++) {
//           const weekStart = new Date(start);
//           weekStart.setDate(start.getDate() + (w * 7));
//           const weekEnd = new Date(weekStart);
//           weekEnd.setDate(weekStart.getDate() + 6);

//           let weekRevenue = 0;
//           let weekExpense = 0;

//           transactions.forEach(item => {
//             const itemDate = new Date(item._id.date);
//             if (itemDate >= weekStart && itemDate <= weekEnd) {
//               if (item._id.type === 'income') {
//                 weekRevenue += item.total;
//               } else {
//                 weekExpense += item.total;
//               }
//             }
//           });

//           weeklyData.push({
//             day: `Week ${w + 1}`,
//             revenue: weekRevenue,
//             expense: weekExpense
//           });
//         }

//         chartData = weeklyData;
//       }
//     }

//     console.log('✅ Chart data prepared:', chartData);

//     // Calculate totals
//     const totalRevenue = chartData.reduce((sum, item) => sum + (item.revenue || 0), 0);
//     const totalExpense = chartData.reduce((sum, item) => sum + (item.expense || 0), 0);

//     res.json({
//       success: true,
//       data: {
//         chartData,
//         summary: {
//           totalRevenue,
//           totalExpense,
//           netProfit: totalRevenue - totalExpense,
//           period,
//           dateRange: { start, end }
//         }
//       }
//     });

//   } catch (error) {
//     console.error('❌ Error in getDailyRevenueStats:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch daily revenue stats',
//       error: error.message
//     });
//   }
// };




// // controllers/transaction.controller.js - COMPLETE FIXED VERSION
// import Transaction from '../models/Transaction.js';
// import Customer from '../models/Customer.js';
// import Order from '../models/Order.js';

// // Define allowed regular categories (without 'other' options)
// const INCOME_CATEGORIES = [
//   'customer-advance', 
//   'full-payment', 
//   'part-payment',      // ✅ ADDED for partial payments
//   'fabric-sale', 
//   'project-payment'
// ];

// const EXPENSE_CATEGORIES = [
//   'salary', 
//   'electricity', 
//   'travel', 
//   'material-purchase', 
//   'rent', 
//   'maintenance'
// ];

// // ============================================
// // ✅ CREATE TRANSACTION
// // ============================================
// export const createTransaction = async (req, res) => {
//   try {
//     const {
//       type,
//       category,
//       customCategory,
//       amount,
//       paymentMethod,
//       customer,
//       order,
//       description,
//       transactionDate,
//       referenceNumber
//     } = req.body;

//     console.log('📥 Creating transaction:', { 
//       type, 
//       category, 
//       customCategory, 
//       amount, 
//       paymentMethod,
//       order: order || 'No order' 
//     });

//     // Validation
//     if (!type || !category || !amount || !paymentMethod) {
//       return res.status(400).json({
//         success: false,
//         message: 'Please fill all required fields'
//       });
//     }

//     // Handle "other" categories
//     let isOtherCategory = false;
//     let finalCategory = category;
//     let finalCustomCategory = null;

//     // Income category validation
//     if (type === 'income') {
//       if (category === 'other-income') {
//         isOtherCategory = true;
//         finalCategory = 'other-income';
//         finalCustomCategory = customCategory;
        
//         if (!customCategory) {
//           return res.status(400).json({
//             success: false,
//             message: 'Please specify the income category'
//           });
//         }
//       } else if (!INCOME_CATEGORIES.includes(category)) {
//         return res.status(400).json({
//           success: false,
//           message: 'Invalid income category'
//         });
//       }
//     }

//     // Expense category validation
//     if (type === 'expense') {
//       if (category === 'other-expense') {
//         isOtherCategory = true;
//         finalCategory = 'other-expense';
//         finalCustomCategory = customCategory;
        
//         if (!customCategory) {
//           return res.status(400).json({
//             success: false,
//             message: 'Please specify the expense category'
//           });
//         }
//       } else if (!EXPENSE_CATEGORIES.includes(category)) {
//         return res.status(400).json({
//           success: false,
//           message: 'Invalid expense category'
//         });
//       }
//     }

//     // Set account type based on payment method
//     const accountType = paymentMethod === 'cash' ? 'hand-cash' : 'bank';

//     // Get customer details if customer ID is provided
//     let customerDetails = null;
//     if (customer) {
//       const customerData = await Customer.findById(customer).select('firstName lastName phone customerId');
//       if (customerData) {
//         customerDetails = {
//           name: `${customerData.firstName || ''} ${customerData.lastName || ''}`.trim() || 'Unknown',
//           phone: customerData.phone,
//           id: customerData.customerId || customerData._id
//         };
//       }
//     }

//     // CHECK FOR DUPLICATE TRANSACTIONS
//     if (order && type === 'income') {
//       const existingTransaction = await Transaction.findOne({
//         order: order,
//         type: 'income',
//         amount: Number(amount),
//         paymentMethod: paymentMethod,
//         status: 'completed'
//       });
      
//       if (existingTransaction) {
//         console.log('⚠️ Duplicate transaction detected for order:', order);
        
//         const populatedExisting = await Transaction.findById(existingTransaction._id)
//           .populate('customer', 'firstName lastName phone')
//           .populate('createdBy', 'name')
//           .populate('order', 'orderId customer');
          
//         return res.status(200).json({
//           success: true,
//           message: 'Transaction already exists for this order',
//           data: populatedExisting,
//           duplicate: true
//         });
//       }
//     }

//     // Create transaction data object
//     const transactionData = {
//       type,
//       category: finalCategory,
//       amount: Number(amount),
//       paymentMethod,
//       accountType,
//       description: description || '',
//       transactionDate: transactionDate || Date.now(),
//       referenceNumber: referenceNumber || '',
//       createdBy: req.user._id,
//       status: 'completed'
//     };

//     // Add optional fields
//     if (isOtherCategory) {
//       transactionData.isOtherCategory = true;
//       transactionData.customCategory = finalCustomCategory;
//     }

//     if (customer) {
//       transactionData.customer = customer;
//       transactionData.customerDetails = customerDetails;
//     }

//     if (order) {
//       transactionData.order = order;
//     }

//     // Create transaction
//     const transaction = await Transaction.create(transactionData);

//     // Populate references
//     const populatedTransaction = await Transaction.findById(transaction._id)
//       .populate('customer', 'firstName lastName phone')
//       .populate('createdBy', 'name')
//       .populate('order', 'orderId customer totalAmount');

//     console.log('✅ Transaction created successfully:', transaction._id);

//     res.status(201).json({
//       success: true,
//       message: `${type === 'income' ? 'Income' : 'Expense'} added successfully`,
//       data: populatedTransaction
//     });

//   } catch (error) {
//     console.error('❌ Transaction creation error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to create transaction',
//       error: error.message
//     });
//   }
// };

// // ============================================
// // ✅ GET ALL TRANSACTIONS WITH FILTERS
// // ============================================
// export const getTransactions = async (req, res) => {
//   try {
//     const {
//       type,
//       accountType,
//       category,
//       startDate,
//       endDate,
//       order,
//       customer,
//       search,
//       page = 1,
//       limit = 20,
//       sortBy = 'transactionDate',
//       sortOrder = 'desc'
//     } = req.query;

//     console.log("\n💰💰💰 GET TRANSACTIONS CALLED 💰💰💰");
//     console.log("📥 Query params:", { type, accountType, category, startDate, endDate });

//     // Build filter
//     const filter = { status: 'completed' };

//     if (type) filter.type = type;
//     if (accountType) filter.accountType = accountType;
//     if (category) filter.category = category;
//     if (order) filter.order = order;
//     if (customer) filter.customer = customer;

//     // Search in description or reference
//     if (search) {
//       filter.$or = [
//         { description: { $regex: search, $options: 'i' } },
//         { referenceNumber: { $regex: search, $options: 'i' } }
//       ];
//     }

//     // Date range filter
//     if (startDate || endDate) {
//       filter.transactionDate = {};
//       if (startDate) {
//         const start = new Date(startDate);
//         start.setHours(0, 0, 0, 0);
//         filter.transactionDate.$gte = start;
//       }
//       if (endDate) {
//         const end = new Date(endDate);
//         end.setHours(23, 59, 59, 999);
//         filter.transactionDate.$lte = end;
//       }
//     }

//     console.log("🔍 Final filter:", JSON.stringify(filter, null, 2));

//     // Pagination
//     const skip = (parseInt(page) - 1) * parseInt(limit);

//     // Get transactions
//     const transactions = await Transaction.find(filter)
//       .populate('customer', 'firstName lastName phone customerId')
//       .populate('createdBy', 'name')
//       .populate('order', 'orderId customer totalAmount status')
//       .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
//       .skip(skip)
//       .limit(parseInt(limit));

//     // Get total count
//     const total = await Transaction.countDocuments(filter);

//     // Calculate totals
//     const totals = await Transaction.aggregate([
//       { $match: filter },
//       {
//         $group: {
//           _id: null,
//           totalIncome: {
//             $sum: {
//               $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0]
//             }
//           },
//           totalExpense: {
//             $sum: {
//               $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0]
//             }
//           },
//           handCashIncome: {
//             $sum: {
//               $cond: [
//                 { $and: [{ $eq: ['$accountType', 'hand-cash'] }, { $eq: ['$type', 'income'] }] },
//                 '$amount',
//                 0
//               ]
//             }
//           },
//           handCashExpense: {
//             $sum: {
//               $cond: [
//                 { $and: [{ $eq: ['$accountType', 'hand-cash'] }, { $eq: ['$type', 'expense'] }] },
//                 '$amount',
//                 0
//               ]
//             }
//           },
//           bankIncome: {
//             $sum: {
//               $cond: [
//                 { $and: [{ $eq: ['$accountType', 'bank'] }, { $eq: ['$type', 'income'] }] },
//                 '$amount',
//                 0
//               ]
//             }
//           },
//           bankExpense: {
//             $sum: {
//               $cond: [
//                 { $and: [{ $eq: ['$accountType', 'bank'] }, { $eq: ['$type', 'expense'] }] },
//                 '$amount',
//                 0
//               ]
//             }
//           }
//         }
//       }
//     ]);

//     const summary = totals[0] || {
//       totalIncome: 0,
//       totalExpense: 0,
//       handCashIncome: 0,
//       handCashExpense: 0,
//       bankIncome: 0,
//       bankExpense: 0
//     };

//     // Calculate balances
//     const handCashBalance = summary.handCashIncome - summary.handCashExpense;
//     const bankBalance = summary.bankIncome - summary.bankExpense;

//     console.log(`✅ Found ${transactions.length} transactions for page ${page}`);

//     res.json({
//       success: true,
//       data: {
//         transactions,
//         summary: {
//           totalIncome: summary.totalIncome,
//           totalExpense: summary.totalExpense,
//           netBalance: summary.totalIncome - summary.totalExpense,
//           handCash: {
//             income: summary.handCashIncome,
//             expense: summary.handCashExpense,
//             balance: handCashBalance
//           },
//           bank: {
//             income: summary.bankIncome,
//             expense: summary.bankExpense,
//             balance: bankBalance
//           },
//           totalBalance: handCashBalance + bankBalance
//         },
//         pagination: {
//           page: parseInt(page),
//           limit: parseInt(limit),
//           total,
//           pages: Math.ceil(total / parseInt(limit))
//         }
//       }
//     });

//   } catch (error) {
//     console.error('❌ Get transactions error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch transactions',
//       error: error.message
//     });
//   }
// };

// // ============================================
// // ✅ GET TRANSACTION BY ID
// // ============================================
// export const getTransactionById = async (req, res) => {
//   try {
//     const transaction = await Transaction.findById(req.params.id)
//       .populate('customer', 'firstName lastName phone customerId')
//       .populate('createdBy', 'name')
//       .populate('order', 'orderId customer totalAmount status deliveryDate');

//     if (!transaction) {
//       return res.status(404).json({
//         success: false,
//         message: 'Transaction not found'
//       });
//     }

//     res.json({
//       success: true,
//       data: transaction
//     });
//   } catch (error) {
//     console.error('❌ Get transaction error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch transaction',
//       error: error.message
//     });
//   }
// };

// // ============================================
// // ✅ UPDATE TRANSACTION
// // ============================================
// export const updateTransaction = async (req, res) => {
//   try {
//     const {
//       category,
//       customCategory,
//       amount,
//       paymentMethod,
//       description,
//       transactionDate,
//       referenceNumber,
//       status
//     } = req.body;

//     const transaction = await Transaction.findById(req.params.id);

//     if (!transaction) {
//       return res.status(404).json({
//         success: false,
//         message: 'Transaction not found'
//       });
//     }

//     // Only admin can update
//     if (req.user.role !== 'ADMIN') {
//       return res.status(403).json({
//         success: false,
//         message: 'Only admin can update transactions'
//       });
//     }

//     // Check if transaction is linked to an order
//     if (transaction.order && (amount || paymentMethod)) {
//       console.log('⚠️ Updating order-linked transaction:', transaction.order);
//     }

//     // Update fields
//     if (category) {
//       if (category === 'other-income' || category === 'other-expense') {
//         transaction.category = category;
//         transaction.isOtherCategory = true;
//         transaction.customCategory = customCategory;
//       } else {
//         transaction.category = category;
//         transaction.isOtherCategory = false;
//         transaction.customCategory = null;
//       }
//     }

//     if (amount) transaction.amount = Number(amount);
//     if (paymentMethod) {
//       transaction.paymentMethod = paymentMethod;
//       transaction.accountType = paymentMethod === 'cash' ? 'hand-cash' : 'bank';
//     }
//     if (description !== undefined) transaction.description = description;
//     if (transactionDate) transaction.transactionDate = transactionDate;
//     if (referenceNumber !== undefined) transaction.referenceNumber = referenceNumber;
//     if (status) transaction.status = status;

//     await transaction.save();

//     const updatedTransaction = await Transaction.findById(transaction._id)
//       .populate('customer', 'firstName lastName phone')
//       .populate('createdBy', 'name')
//       .populate('order', 'orderId');

//     res.json({
//       success: true,
//       message: 'Transaction updated successfully',
//       data: updatedTransaction
//     });
//   } catch (error) {
//     console.error('❌ Update transaction error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to update transaction',
//       error: error.message
//     });
//   }
// };

// // ============================================
// // ✅ DELETE TRANSACTION
// // ============================================
// export const deleteTransaction = async (req, res) => {
//   try {
//     const transaction = await Transaction.findById(req.params.id);

//     if (!transaction) {
//       return res.status(404).json({
//         success: false,
//         message: 'Transaction not found'
//       });
//     }

//     // Only admin can delete
//     if (req.user.role !== 'ADMIN') {
//       return res.status(403).json({
//         success: false,
//         message: 'Only admin can delete transactions'
//       });
//     }

//     // Check if this transaction is linked to an order
//     if (transaction.order) {
//       console.log(`⚠️ Transaction ${req.params.id} is linked to order ${transaction.order}`);
//     }

//     await transaction.deleteOne();

//     console.log('✅ Transaction deleted:', req.params.id);

//     res.json({
//       success: true,
//       message: 'Transaction deleted successfully'
//     });

//   } catch (error) {
//     console.error('❌ Delete transaction error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to delete transaction',
//       error: error.message
//     });
//   }
// };

// // ============================================
// // ✅ GET TRANSACTIONS BY ORDER
// // ============================================
// export const getTransactionsByOrder = async (req, res) => {
//   try {
//     const { orderId } = req.params;
    
//     // First get the order details
//     const order = await Order.findById(orderId).select('orderId customer totalAmount');
    
//     const transactions = await Transaction.find({ 
//       order: orderId,
//       status: 'completed' 
//     })
//     .populate('customer', 'firstName lastName phone')
//     .populate('createdBy', 'name')
//     .sort('-transactionDate');
    
//     const totalIncome = transactions
//       .filter(t => t.type === 'income')
//       .reduce((sum, t) => sum + t.amount, 0);
      
//     const totalExpense = transactions
//       .filter(t => t.type === 'expense')
//       .reduce((sum, t) => sum + t.amount, 0);
    
//     res.json({
//       success: true,
//       order: order ? {
//         id: order._id,
//         orderId: order.orderId,
//         totalAmount: order.totalAmount
//       } : null,
//       count: transactions.length,
//       summary: {
//         totalIncome,
//         totalExpense,
//         netAmount: totalIncome - totalExpense
//       },
//       transactions
//     });
    
//   } catch (error) {
//     console.error('❌ Get by order error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch transactions',
//       error: error.message
//     });
//   }
// };

// // ============================================
// // ✅ GET TRANSACTIONS BY CUSTOMER
// // ============================================
// export const getTransactionsByCustomer = async (req, res) => {
//   try {
//     const { customerId } = req.params;
//     const { type, startDate, endDate, limit = 50 } = req.query;

//     const filter = { 
//       customer: customerId,
//       status: 'completed' 
//     };

//     if (type) filter.type = type;

//     if (startDate || endDate) {
//       filter.transactionDate = {};
//       if (startDate) {
//         const start = new Date(startDate);
//         start.setHours(0, 0, 0, 0);
//         filter.transactionDate.$gte = start;
//       }
//       if (endDate) {
//         const end = new Date(endDate);
//         end.setHours(23, 59, 59, 999);
//         filter.transactionDate.$lte = end;
//       }
//     }

//     const transactions = await Transaction.find(filter)
//       .populate('order', 'orderId')
//       .populate('createdBy', 'name')
//       .sort('-transactionDate')
//       .limit(parseInt(limit));

//     // Calculate totals
//     const totalIncome = transactions
//       .filter(t => t.type === 'income')
//       .reduce((sum, t) => sum + t.amount, 0);

//     const totalExpense = transactions
//       .filter(t => t.type === 'expense')
//       .reduce((sum, t) => sum + t.amount, 0);

//     // Group by order
//     const byOrder = {};
//     transactions.forEach(t => {
//       if (t.order) {
//         const orderId = t.order.toString();
//         if (!byOrder[orderId]) {
//           byOrder[orderId] = {
//             orderId: orderId,
//             income: 0,
//             expense: 0,
//             count: 0
//           };
//         }
//         if (t.type === 'income') {
//           byOrder[orderId].income += t.amount;
//         } else {
//           byOrder[orderId].expense += t.amount;
//         }
//         byOrder[orderId].count++;
//       }
//     });

//     res.json({
//       success: true,
//       count: transactions.length,
//       summary: {
//         totalIncome,
//         totalExpense,
//         netBalance: totalIncome - totalExpense
//       },
//       byOrder: Object.values(byOrder),
//       transactions
//     });
//   } catch (error) {
//     console.error('❌ Get by customer error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch transactions',
//       error: error.message
//     });
//   }
// };

// // ============================================
// // ✅ GET TRANSACTION SUMMARY
// // ============================================
// export const getTransactionSummary = async (req, res) => {
//   try {
//     const { period = 'month' } = req.query;

//     let startDate = new Date();
//     const endDate = new Date();
//     endDate.setHours(23, 59, 59, 999);

//     if (period === 'today') {
//       startDate.setHours(0, 0, 0, 0);
//     } else if (period === 'week') {
//       startDate.setDate(startDate.getDate() - startDate.getDay());
//       startDate.setHours(0, 0, 0, 0);
//     } else if (period === 'month') {
//       startDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
//       startDate.setHours(0, 0, 0, 0);
//     } else if (period === 'year') {
//       startDate = new Date(startDate.getFullYear(), 0, 1);
//       startDate.setHours(0, 0, 0, 0);
//     }

//     const summary = await Transaction.aggregate([
//       {
//         $match: {
//           transactionDate: { $gte: startDate, $lte: endDate },
//           status: 'completed'
//         }
//       },
//       {
//         $group: {
//           _id: {
//             type: '$type',
//             accountType: '$accountType'
//           },
//           total: { $sum: '$amount' },
//           count: { $sum: 1 }
//         }
//       }
//     ]);

//     // Get category breakdown
//     const categoryBreakdown = await Transaction.aggregate([
//       {
//         $match: {
//           transactionDate: { $gte: startDate, $lte: endDate },
//           status: 'completed'
//         }
//       },
//       {
//         $group: {
//           _id: {
//             type: '$type',
//             category: '$category'
//           },
//           total: { $sum: '$amount' },
//           count: { $sum: 1 }
//         }
//       },
//       { $sort: { total: -1 } }
//     ]);

//     // Format response
//     const result = {
//       period,
//       dateRange: {
//         start: startDate,
//         end: endDate
//       },
//       handCash: { income: 0, expense: 0, count: 0 },
//       bank: { income: 0, expense: 0, count: 0 },
//       categoryBreakdown,
//       recentTransactions: await Transaction.find({
//         transactionDate: { $gte: startDate, $lte: endDate },
//         status: 'completed'
//       })
//         .populate('customer', 'firstName lastName phone')
//         .populate('order', 'orderId')
//         .sort({ transactionDate: -1 })
//         .limit(10)
//     };

//     summary.forEach(item => {
//       const account = item._id.accountType === 'hand-cash' ? 'handCash' : 'bank';
//       const type = item._id.type;
//       result[account][type] = item.total;
//       result[account].count += item.count;
//     });

//     res.json({
//       success: true,
//       data: result
//     });

//   } catch (error) {
//     console.error('❌ Get summary error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch summary',
//       error: error.message
//     });
//   }
// };

// // ============================================
// // ✅ GET TRANSACTION STATS
// // ============================================
// export const getTransactionStats = async (req, res) => {
//   try {
//     const stats = await Transaction.aggregate([
//       { $match: { status: 'completed' } },
//       {
//         $group: {
//           _id: {
//             type: '$type',
//             category: '$category',
//             accountType: '$accountType'
//           },
//           totalAmount: { $sum: '$amount' },
//           count: { $sum: 1 },
//           avgAmount: { $avg: '$amount' },
//           maxAmount: { $max: '$amount' },
//           minAmount: { $min: '$amount' }
//         }
//       },
//       { $sort: { totalAmount: -1 } }
//     ]);

//     // Get top income sources
//     const topIncomeSources = await Transaction.aggregate([
//       { $match: { type: 'income', status: 'completed' } },
//       {
//         $group: {
//           _id: {
//             category: '$category',
//             order: '$order'
//           },
//           totalAmount: { $sum: '$amount' },
//           count: { $sum: 1 }
//         }
//       },
//       { $sort: { totalAmount: -1 } },
//       { $limit: 10 }
//     ]);

//     // Get monthly trend
//     const monthlyTrend = await Transaction.aggregate([
//       { 
//         $match: { 
//           status: 'completed',
//           transactionDate: { $gte: new Date(new Date().getFullYear(), 0, 1) }
//         } 
//       },
//       {
//         $group: {
//           _id: {
//             month: { $month: '$transactionDate' },
//             year: { $year: '$transactionDate' },
//             type: '$type'
//           },
//           total: { $sum: '$amount' },
//           count: { $sum: 1 }
//         }
//       },
//       { $sort: { '_id.year': 1, '_id.month': 1 } }
//     ]);

//     res.json({
//       success: true,
//       data: {
//         detailed: stats,
//         topIncomeSources,
//         monthlyTrend
//       }
//     });

//   } catch (error) {
//     console.error('❌ Get stats error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch stats',
//       error: error.message
//     });
//   }
// };

// // ============================================
// // ✅ BULK DELETE TRANSACTIONS
// // ============================================
// export const bulkDeleteTransactions = async (req, res) => {
//   try {
//     const { ids } = req.body;

//     if (!ids || !Array.isArray(ids) || ids.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: 'Please provide an array of transaction IDs'
//       });
//     }

//     // Check if any transactions are linked to orders
//     const orderLinkedTransactions = await Transaction.find({
//       _id: { $in: ids },
//       order: { $ne: null }
//     });

//     if (orderLinkedTransactions.length > 0) {
//       console.log('⚠️ Cannot delete order-linked transactions:', orderLinkedTransactions.map(t => t._id));
//       return res.status(400).json({
//         success: false,
//         message: 'Cannot delete transactions linked to orders',
//         orderLinked: orderLinkedTransactions.map(t => t._id)
//       });
//     }

//     const result = await Transaction.deleteMany({
//       _id: { $in: ids }
//     });

//     res.json({
//       success: true,
//       message: `Successfully deleted ${result.deletedCount} transactions`,
//       deletedCount: result.deletedCount
//     });
//   } catch (error) {
//     console.error('❌ Bulk delete error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to delete transactions',
//       error: error.message
//     });
//   }
// };

// // ============================================
// // ✅ EXPORT TRANSACTIONS
// // ============================================
// export const exportTransactions = async (req, res) => {
//   try {
//     const {
//       type,
//       startDate,
//       endDate,
//       accountType,
//       customerId
//     } = req.query;

//     const filter = { status: 'completed' };

//     if (type) filter.type = type;
//     if (accountType) filter.accountType = accountType;
//     if (customerId) filter.customer = customerId;

//     if (startDate || endDate) {
//       filter.transactionDate = {};
//       if (startDate) {
//         const start = new Date(startDate);
//         start.setHours(0, 0, 0, 0);
//         filter.transactionDate.$gte = start;
//       }
//       if (endDate) {
//         const end = new Date(endDate);
//         end.setHours(23, 59, 59, 999);
//         filter.transactionDate.$lte = end;
//       }
//     }

//     const transactions = await Transaction.find(filter)
//       .populate('customer', 'firstName lastName phone')
//       .populate('order', 'orderId')
//       .populate('createdBy', 'name')
//       .sort('-transactionDate');

//     // Format for export
//     const exportData = transactions.map(t => ({
//       'Transaction ID': t._id,
//       'Type': t.type,
//       'Category': t.isOtherCategory ? t.customCategory : t.category,
//       'Amount': t.amount,
//       'Payment Method': t.paymentMethod,
//       'Account': t.accountType === 'hand-cash' ? 'Hand Cash' : 'Bank',
//       'Customer Name': t.customerDetails?.name || 'N/A',
//       'Customer Phone': t.customerDetails?.phone || 'N/A',
//       'Order ID': t.order?.orderId || 'N/A',
//       'Description': t.description || '',
//       'Reference Number': t.referenceNumber || '',
//       'Date': new Date(t.transactionDate).toLocaleDateString('en-IN'),
//       'Time': new Date(t.transactionDate).toLocaleTimeString('en-IN'),
//       'Created By': t.createdBy?.name || 'N/A',
//       'Status': t.status
//     }));

//     res.json({
//       success: true,
//       count: exportData.length,
//       data: exportData
//     });
//   } catch (error) {
//     console.error('❌ Export error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to export transactions',
//       error: error.message
//     });
//   }
// };

// // ============================================
// // ✅ GET TRANSACTIONS BY DATE RANGE
// // ============================================
// export const getTransactionsByDateRange = async (req, res) => {
//   try {
//     const { start, end } = req.params;
//     const { type, accountType } = req.query;

//     const startDate = new Date(start);
//     startDate.setHours(0, 0, 0, 0);

//     const endDate = new Date(end);
//     endDate.setHours(23, 59, 59, 999);

//     const filter = {
//       transactionDate: { $gte: startDate, $lte: endDate },
//       status: 'completed'
//     };

//     if (type) filter.type = type;
//     if (accountType) filter.accountType = accountType;

//     const transactions = await Transaction.find(filter)
//       .populate('customer', 'firstName lastName phone')
//       .populate('order', 'orderId')
//       .sort('transactionDate');

//     // Calculate daily summary
//     const dailySummary = {};
//     transactions.forEach(t => {
//       const date = t.transactionDate.toISOString().split('T')[0];
//       if (!dailySummary[date]) {
//         dailySummary[date] = {
//           date,
//           income: 0,
//           expense: 0,
//           count: 0
//         };
//       }
//       if (t.type === 'income') {
//         dailySummary[date].income += t.amount;
//       } else {
//         dailySummary[date].expense += t.amount;
//       }
//       dailySummary[date].count++;
//     });

//     res.json({
//       success: true,
//       dateRange: { start, end },
//       summary: {
//         totalTransactions: transactions.length,
//         totalIncome: transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0),
//         totalExpense: transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0),
//         netAmount: transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0) - 
//                   transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)
//       },
//       dailySummary: Object.values(dailySummary),
//       transactions
//     });
//   } catch (error) {
//     console.error('❌ Date range error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch transactions',
//       error: error.message
//     });
//   }
// };

// // ============================================
// // ✅ GET DASHBOARD DATA
// // ============================================
// export const getDashboardData = async (req, res) => {
//   try {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
//     const startOfYear = new Date(today.getFullYear(), 0, 1);

//     // Get today's transactions
//     const todayTransactions = await Transaction.find({
//       transactionDate: { $gte: today },
//       status: 'completed'
//     });

//     // Get this month's transactions
//     const monthTransactions = await Transaction.find({
//       transactionDate: { $gte: startOfMonth },
//       status: 'completed'
//     });

//     // Get this year's transactions
//     const yearTransactions = await Transaction.find({
//       transactionDate: { $gte: startOfYear },
//       status: 'completed'
//     });

//     // Calculate totals
//     const todayIncome = todayTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
//     const todayExpense = todayTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    
//     const monthIncome = monthTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
//     const monthExpense = monthTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    
//     const yearIncome = yearTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
//     const yearExpense = yearTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

//     // Get recent transactions
//     const recentTransactions = await Transaction.find({ status: 'completed' })
//       .populate('customer', 'firstName lastName phone')
//       .populate('order', 'orderId')
//       .sort('-transactionDate')
//       .limit(10);

//     res.json({
//       success: true,
//       data: {
//         today: {
//           income: todayIncome,
//           expense: todayExpense,
//           net: todayIncome - todayExpense,
//           count: todayTransactions.length
//         },
//         thisMonth: {
//           income: monthIncome,
//           expense: monthExpense,
//           net: monthIncome - monthExpense,
//           count: monthTransactions.length
//         },
//         thisYear: {
//           income: yearIncome,
//           expense: yearExpense,
//           net: yearIncome - yearExpense,
//           count: yearTransactions.length
//         },
//         recentTransactions
//       }
//     });

//   } catch (error) {
//     console.error('❌ Dashboard error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch dashboard data',
//       error: error.message
//     });
//   }
// };

// // ============================================
// // ✅ GET TODAY'S TRANSACTIONS
// // ============================================
// export const getTodayTransactions = async (req, res) => {
//   try {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
    
//     const tomorrow = new Date(today);
//     tomorrow.setDate(tomorrow.getDate() + 1);

//     const transactions = await Transaction.find({
//       transactionDate: { $gte: today, $lt: tomorrow },
//       status: 'completed'
//     })
//     .populate('customer', 'firstName lastName phone')
//     .populate('order', 'orderId')
//     .sort('-transactionDate');

//     // Calculate totals
//     const totalIncome = transactions
//       .filter(t => t.type === 'income')
//       .reduce((sum, t) => sum + t.amount, 0);
      
//     const totalExpense = transactions
//       .filter(t => t.type === 'expense')
//       .reduce((sum, t) => sum + t.amount, 0);

//     // Split by account type
//     const handCashIncome = transactions
//       .filter(t => t.type === 'income' && t.accountType === 'hand-cash')
//       .reduce((sum, t) => sum + t.amount, 0);
      
//     const bankIncome = transactions
//       .filter(t => t.type === 'income' && t.accountType === 'bank')
//       .reduce((sum, t) => sum + t.amount, 0);
      
//     const handCashExpense = transactions
//       .filter(t => t.type === 'expense' && t.accountType === 'hand-cash')
//       .reduce((sum, t) => sum + t.amount, 0);
      
//     const bankExpense = transactions
//       .filter(t => t.type === 'expense' && t.accountType === 'bank')
//       .reduce((sum, t) => sum + t.amount, 0);

//     res.json({
//       success: true,
//       data: {
//         transactions,
//         summary: {
//           totalIncome,
//           totalExpense,
//           netAmount: totalIncome - totalExpense,
//           count: transactions.length,
//           handCash: {
//             income: handCashIncome,
//             expense: handCashExpense,
//             balance: handCashIncome - handCashExpense
//           },
//           bank: {
//             income: bankIncome,
//             expense: bankExpense,
//             balance: bankIncome - bankExpense
//           }
//         }
//       }
//     });

//   } catch (error) {
//     console.error('❌ Get today transactions error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch today\'s transactions',
//       error: error.message
//     });
//   }
// };

// // ============================================
// // ✅ GET DAILY REVENUE STATS FOR CHART
// // ============================================
// export const getDailyRevenueStats = async (req, res) => {
//   try {
//     const { period, startDate, endDate } = req.query;
    
//     console.log('📊 Getting daily revenue stats with:', { period, startDate, endDate });
    
//     // Build date filter based on period or custom dates
//     let start, end;
//     const today = new Date();
    
//     if (period === 'today') {
//       start = new Date(today.setHours(0, 0, 0, 0));
//       end = new Date(today.setHours(23, 59, 59, 999));
//     } 
//     else if (period === 'week') {
//       start = new Date(today);
//       start.setDate(today.getDate() - today.getDay()); // Start of week (Sunday)
//       start.setHours(0, 0, 0, 0);
      
//       end = new Date(start);
//       end.setDate(start.getDate() + 7);
//       end.setHours(23, 59, 59, 999);
//     } 
//     else if (period === 'month') {
//       start = new Date(today.getFullYear(), today.getMonth(), 1);
//       end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
//       end.setHours(23, 59, 59, 999);
//     } 
//     else if (startDate && endDate) {
//       start = new Date(startDate);
//       start.setHours(0, 0, 0, 0);
      
//       end = new Date(endDate);
//       end.setHours(23, 59, 59, 999);
//     } else {
//       // Default to current month
//       start = new Date(today.getFullYear(), today.getMonth(), 1);
//       end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
//       end.setHours(23, 59, 59, 999);
//     }
    
//     console.log('📅 Date range:', { start, end });

//     // Get transactions grouped by date
//     const transactions = await Transaction.aggregate([
//       {
//         $match: {
//           transactionDate: { $gte: start, $lte: end },
//           status: 'completed'
//         }
//       },
//       {
//         $group: {
//           _id: {
//             date: { $dateToString: { format: '%Y-%m-%d', date: '$transactionDate' } },
//             type: '$type'
//           },
//           total: { $sum: '$amount' },
//           count: { $sum: 1 }
//         }
//       },
//       { $sort: { '_id.date': 1 } }
//     ]);

//     console.log('📊 Aggregated transactions:', transactions);

//     // Prepare chart data based on period
//     let chartData = [];

//     if (period === 'today') {
//       // Hourly data for today
//       const hourlyData = {};
      
//       // Initialize hours
//       for (let i = 9; i <= 20; i++) {
//         const hourKey = i < 10 ? `0${i}:00` : `${i}:00`;
//         hourlyData[hourKey] = { revenue: 0, expense: 0 };
//       }

//       // Fill with actual data
//       transactions.forEach(item => {
//         const date = new Date(item._id.date);
//         const hour = date.getHours();
//         if (hour >= 9 && hour <= 20) {
//           const hourKey = hour < 10 ? `0${hour}:00` : `${hour}:00`;
//           if (item._id.type === 'income') {
//             hourlyData[hourKey].revenue = item.total;
//           } else {
//             hourlyData[hourKey].expense = item.total;
//           }
//         }
//       });

//       // Convert to array
//       for (let i = 9; i <= 20; i++) {
//         const hourKey = i < 10 ? `0${i}:00` : `${i}:00`;
//         chartData.push({
//           time: `${i} AM`,
//           revenue: hourlyData[hourKey].revenue || 0,
//           expense: hourlyData[hourKey].expense || 0
//         });
//       }
//     } 
//     else if (period === 'week') {
//       // Daily data for week
//       const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
//       const dailyMap = new Map();
      
//       // Initialize days
//       for (let i = 0; i < 7; i++) {
//         const date = new Date(start);
//         date.setDate(start.getDate() + i);
//         const dateStr = date.toISOString().split('T')[0];
//         dailyMap.set(dateStr, { 
//           day: days[date.getDay()],
//           revenue: 0, 
//           expense: 0 
//         });
//       }

//       // Fill with actual data
//       transactions.forEach(item => {
//         const dateStr = item._id.date;
//         if (dailyMap.has(dateStr)) {
//           const entry = dailyMap.get(dateStr);
//           if (item._id.type === 'income') {
//             entry.revenue = item.total;
//           } else {
//             entry.expense = item.total;
//           }
//         }
//       });

//       // Convert to array
//       chartData = Array.from(dailyMap.values());
//     }
//     else {
//       // Monthly/Period data - group by week or day
//       const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      
//       if (diffDays <= 7) {
//         // Daily data for short periods
//         const dailyMap = new Map();
        
//         // Initialize all dates in range
//         for (let i = 0; i <= diffDays; i++) {
//           const date = new Date(start);
//           date.setDate(start.getDate() + i);
//           const dateStr = date.toISOString().split('T')[0];
//           dailyMap.set(dateStr, { 
//             day: date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
//             revenue: 0, 
//             expense: 0 
//           });
//         }

//         // Fill with actual data
//         transactions.forEach(item => {
//           const dateStr = item._id.date;
//           if (dailyMap.has(dateStr)) {
//             const entry = dailyMap.get(dateStr);
//             if (item._id.type === 'income') {
//               entry.revenue = item.total;
//             } else {
//               entry.expense = item.total;
//             }
//           }
//         });

//         chartData = Array.from(dailyMap.values());
//       } else {
//         // Weekly data for longer periods
//         const weeks = Math.ceil(diffDays / 7);
//         const weeklyData = [];

//         for (let w = 0; w < weeks; w++) {
//           const weekStart = new Date(start);
//           weekStart.setDate(start.getDate() + (w * 7));
//           const weekEnd = new Date(weekStart);
//           weekEnd.setDate(weekStart.getDate() + 6);

//           let weekRevenue = 0;
//           let weekExpense = 0;

//           transactions.forEach(item => {
//             const itemDate = new Date(item._id.date);
//             if (itemDate >= weekStart && itemDate <= weekEnd) {
//               if (item._id.type === 'income') {
//                 weekRevenue += item.total;
//               } else {
//                 weekExpense += item.total;
//               }
//             }
//           });

//           weeklyData.push({
//             day: `Week ${w + 1}`,
//             revenue: weekRevenue,
//             expense: weekExpense
//           });
//         }

//         chartData = weeklyData;
//       }
//     }

//     console.log('✅ Chart data prepared:', chartData);

//     // Calculate totals
//     const totalRevenue = chartData.reduce((sum, item) => sum + (item.revenue || 0), 0);
//     const totalExpense = chartData.reduce((sum, item) => sum + (item.expense || 0), 0);

//     res.json({
//       success: true,
//       data: {
//         chartData,
//         summary: {
//           totalRevenue,
//           totalExpense,
//           netProfit: totalRevenue - totalExpense,
//           period,
//           dateRange: { start, end }
//         }
//       }
//     });

//   } catch (error) {
//     console.error('❌ Error in getDailyRevenueStats:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch daily revenue stats',
//       error: error.message
//     });
//   }
// };





// // controllers/transaction.controller.js - COMPLETE FIXED VERSION
// import Transaction from '../models/Transaction.js';
// import Customer from '../models/Customer.js';
// import Order from '../models/Order.js';

// // Define allowed regular categories (without 'other' options)
// const INCOME_CATEGORIES = [
//   'customer-advance', 
//   'full-payment', 
//   'part-payment',      // ✅ ADDED for partial payments
//   'fabric-sale', 
//   'project-payment',
//   'other-income'       // ✅ ADDED for custom income
// ];

// const EXPENSE_CATEGORIES = [
//   'salary', 
//   'electricity', 
//   'travel', 
//   'material-purchase', 
//   'rent', 
//   'maintenance'
// ];

// // ============================================
// // ✅ CREATE TRANSACTION
// // ============================================
// export const createTransaction = async (req, res) => {
//   try {
//     const {
//       type,
//       category,
//       customCategory,
//       amount,
//       paymentMethod,
//       customer,
//       order,
//       description,
//       transactionDate,
//       referenceNumber
//     } = req.body;

//     console.log('📥 Creating transaction:', { 
//       type, 
//       category, 
//       customCategory, 
//       amount, 
//       paymentMethod,
//       order: order || 'No order' 
//     });

//     // Validation
//     if (!type || !category || !amount || !paymentMethod) {
//       return res.status(400).json({
//         success: false,
//         message: 'Please fill all required fields'
//       });
//     }

//     // Handle "other" categories
//     let isOtherCategory = false;
//     let finalCategory = category;
//     let finalCustomCategory = null;

//     // Income category validation
//     if (type === 'income') {
//       if (category === 'other-income') {
//         isOtherCategory = true;
//         finalCategory = 'other-income';
//         finalCustomCategory = customCategory;
        
//         if (!customCategory) {
//           return res.status(400).json({
//             success: false,
//             message: 'Please specify the income category'
//           });
//         }
//       } else if (!INCOME_CATEGORIES.includes(category)) {
//         return res.status(400).json({
//           success: false,
//           message: 'Invalid income category'
//         });
//       }
//     }

//     // Expense category validation
//     if (type === 'expense') {
//       if (category === 'other-expense') {
//         isOtherCategory = true;
//         finalCategory = 'other-expense';
//         finalCustomCategory = customCategory;
        
//         if (!customCategory) {
//           return res.status(400).json({
//             success: false,
//             message: 'Please specify the expense category'
//           });
//         }
//       } else if (!EXPENSE_CATEGORIES.includes(category)) {
//         return res.status(400).json({
//           success: false,
//           message: 'Invalid expense category'
//         });
//       }
//     }

//     // Set account type based on payment method
//     const accountType = paymentMethod === 'cash' ? 'hand-cash' : 'bank';

//     // Get customer details if customer ID is provided
//     let customerDetails = null;
//     if (customer) {
//       const customerData = await Customer.findById(customer).select('firstName lastName phone customerId');
//       if (customerData) {
//         customerDetails = {
//           name: `${customerData.firstName || ''} ${customerData.lastName || ''}`.trim() || 'Unknown',
//           phone: customerData.phone,
//           id: customerData.customerId || customerData._id
//         };
//       }
//     }

//     // 🔥 FIXED: CHECK FOR DUPLICATE TRANSACTIONS - Added category check
//     if (order && type === 'income') {
//       const existingTransaction = await Transaction.findOne({
//         order: order,
//         type: 'income',
//         category: finalCategory,  // ✅ ADDED category check
//         amount: Number(amount),
//         paymentMethod: paymentMethod,
//         status: 'completed'
//       });
      
//       if (existingTransaction) {
//         console.log('⚠️ Duplicate transaction detected for order:', order);
        
//         const populatedExisting = await Transaction.findById(existingTransaction._id)
//           .populate('customer', 'firstName lastName phone')
//           .populate('createdBy', 'name')
//           .populate('order', 'orderId customer');
          
//         return res.status(200).json({
//           success: true,
//           message: 'Transaction already exists for this order',
//           data: populatedExisting,
//           duplicate: true
//         });
//       }
//     }

//     // Create transaction data object
//     const transactionData = {
//       type,
//       category: finalCategory,
//       amount: Number(amount),
//       paymentMethod,
//       accountType,
//       description: description || '',
//       transactionDate: transactionDate || Date.now(),
//       referenceNumber: referenceNumber || '',
//       createdBy: req.user._id,
//       status: 'completed'
//     };

//     // Add optional fields
//     if (isOtherCategory) {
//       transactionData.isOtherCategory = true;
//       transactionData.customCategory = finalCustomCategory;
//     }

//     if (customer) {
//       transactionData.customer = customer;
//       transactionData.customerDetails = customerDetails;
//     }

//     if (order) {
//       transactionData.order = order;
//     }

//     // Create transaction
//     const transaction = await Transaction.create(transactionData);

//     // Populate references
//     const populatedTransaction = await Transaction.findById(transaction._id)
//       .populate('customer', 'firstName lastName phone')
//       .populate('createdBy', 'name')
//       .populate('order', 'orderId customer totalAmount');

//     console.log('✅ Transaction created successfully:', transaction._id);

//     res.status(201).json({
//       success: true,
//       message: `${type === 'income' ? 'Income' : 'Expense'} added successfully`,
//       data: populatedTransaction
//     });

//   } catch (error) {
//     console.error('❌ Transaction creation error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to create transaction',
//       error: error.message
//     });
//   }
// };

// // ============================================
// // ✅ GET ALL TRANSACTIONS WITH FILTERS
// // ============================================
// export const getTransactions = async (req, res) => {
//   try {
//     const {
//       type,
//       accountType,
//       category,
//       startDate,
//       endDate,
//       order,
//       customer,
//       search,
//       page = 1,
//       limit = 20,
//       sortBy = 'transactionDate',
//       sortOrder = 'desc'
//     } = req.query;

//     console.log("\n💰💰💰 GET TRANSACTIONS CALLED 💰💰💰");
//     console.log("📥 Query params:", { type, accountType, category, startDate, endDate });

//     // Build filter
//     const filter = { status: 'completed' };

//     if (type) filter.type = type;
//     if (accountType) filter.accountType = accountType;
//     if (category) filter.category = category;
//     if (order) filter.order = order;
//     if (customer) filter.customer = customer;

//     // Search in description or reference
//     if (search) {
//       filter.$or = [
//         { description: { $regex: search, $options: 'i' } },
//         { referenceNumber: { $regex: search, $options: 'i' } }
//       ];
//     }

//     // Date range filter
//     if (startDate || endDate) {
//       filter.transactionDate = {};
//       if (startDate) {
//         const start = new Date(startDate);
//         start.setHours(0, 0, 0, 0);
//         filter.transactionDate.$gte = start;
//       }
//       if (endDate) {
//         const end = new Date(endDate);
//         end.setHours(23, 59, 59, 999);
//         filter.transactionDate.$lte = end;
//       }
//     }

//     console.log("🔍 Final filter:", JSON.stringify(filter, null, 2));

//     // Pagination
//     const skip = (parseInt(page) - 1) * parseInt(limit);

//     // Get transactions
//     const transactions = await Transaction.find(filter)
//       .populate('customer', 'firstName lastName phone customerId')
//       .populate('createdBy', 'name')
//       .populate('order', 'orderId customer totalAmount status')
//       .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
//       .skip(skip)
//       .limit(parseInt(limit));

//     // Get total count
//     const total = await Transaction.countDocuments(filter);

//     // Calculate totals
//     const totals = await Transaction.aggregate([
//       { $match: filter },
//       {
//         $group: {
//           _id: null,
//           totalIncome: {
//             $sum: {
//               $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0]
//             }
//           },
//           totalExpense: {
//             $sum: {
//               $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0]
//             }
//           },
//           handCashIncome: {
//             $sum: {
//               $cond: [
//                 { $and: [{ $eq: ['$accountType', 'hand-cash'] }, { $eq: ['$type', 'income'] }] },
//                 '$amount',
//                 0
//               ]
//             }
//           },
//           handCashExpense: {
//             $sum: {
//               $cond: [
//                 { $and: [{ $eq: ['$accountType', 'hand-cash'] }, { $eq: ['$type', 'expense'] }] },
//                 '$amount',
//                 0
//               ]
//             }
//           },
//           bankIncome: {
//             $sum: {
//               $cond: [
//                 { $and: [{ $eq: ['$accountType', 'bank'] }, { $eq: ['$type', 'income'] }] },
//                 '$amount',
//                 0
//               ]
//             }
//           },
//           bankExpense: {
//             $sum: {
//               $cond: [
//                 { $and: [{ $eq: ['$accountType', 'bank'] }, { $eq: ['$type', 'expense'] }] },
//                 '$amount',
//                 0
//               ]
//             }
//           }
//         }
//       }
//     ]);

//     const summary = totals[0] || {
//       totalIncome: 0,
//       totalExpense: 0,
//       handCashIncome: 0,
//       handCashExpense: 0,
//       bankIncome: 0,
//       bankExpense: 0
//     };

//     // Calculate balances
//     const handCashBalance = summary.handCashIncome - summary.handCashExpense;
//     const bankBalance = summary.bankIncome - summary.bankExpense;

//     console.log(`✅ Found ${transactions.length} transactions for page ${page}`);

//     res.json({
//       success: true,
//       data: {
//         transactions,
//         summary: {
//           totalIncome: summary.totalIncome,
//           totalExpense: summary.totalExpense,
//           netBalance: summary.totalIncome - summary.totalExpense,
//           handCash: {
//             income: summary.handCashIncome,
//             expense: summary.handCashExpense,
//             balance: handCashBalance
//           },
//           bank: {
//             income: summary.bankIncome,
//             expense: summary.bankExpense,
//             balance: bankBalance
//           },
//           totalBalance: handCashBalance + bankBalance
//         },
//         pagination: {
//           page: parseInt(page),
//           limit: parseInt(limit),
//           total,
//           pages: Math.ceil(total / parseInt(limit))
//         }
//       }
//     });

//   } catch (error) {
//     console.error('❌ Get transactions error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch transactions',
//       error: error.message
//     });
//   }
// };

// // ============================================
// // ✅ GET TRANSACTION BY ID
// // ============================================
// export const getTransactionById = async (req, res) => {
//   try {
//     const transaction = await Transaction.findById(req.params.id)
//       .populate('customer', 'firstName lastName phone customerId')
//       .populate('createdBy', 'name')
//       .populate('order', 'orderId customer totalAmount status deliveryDate');

//     if (!transaction) {
//       return res.status(404).json({
//         success: false,
//         message: 'Transaction not found'
//       });
//     }

//     res.json({
//       success: true,
//       data: transaction
//     });
//   } catch (error) {
//     console.error('❌ Get transaction error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch transaction',
//       error: error.message
//     });
//   }
// };

// // ============================================
// // ✅ UPDATE TRANSACTION
// // ============================================
// export const updateTransaction = async (req, res) => {
//   try {
//     const {
//       category,
//       customCategory,
//       amount,
//       paymentMethod,
//       description,
//       transactionDate,
//       referenceNumber,
//       status
//     } = req.body;

//     const transaction = await Transaction.findById(req.params.id);

//     if (!transaction) {
//       return res.status(404).json({
//         success: false,
//         message: 'Transaction not found'
//       });
//     }

//     // Only admin can update
//     if (req.user.role !== 'ADMIN') {
//       return res.status(403).json({
//         success: false,
//         message: 'Only admin can update transactions'
//       });
//     }

//     // Check if transaction is linked to an order
//     if (transaction.order && (amount || paymentMethod)) {
//       console.log('⚠️ Updating order-linked transaction:', transaction.order);
//     }

//     // Update fields
//     if (category) {
//       if (category === 'other-income' || category === 'other-expense') {
//         transaction.category = category;
//         transaction.isOtherCategory = true;
//         transaction.customCategory = customCategory;
//       } else {
//         transaction.category = category;
//         transaction.isOtherCategory = false;
//         transaction.customCategory = null;
//       }
//     }

//     if (amount) transaction.amount = Number(amount);
//     if (paymentMethod) {
//       transaction.paymentMethod = paymentMethod;
//       transaction.accountType = paymentMethod === 'cash' ? 'hand-cash' : 'bank';
//     }
//     if (description !== undefined) transaction.description = description;
//     if (transactionDate) transaction.transactionDate = transactionDate;
//     if (referenceNumber !== undefined) transaction.referenceNumber = referenceNumber;
//     if (status) transaction.status = status;

//     await transaction.save();

//     const updatedTransaction = await Transaction.findById(transaction._id)
//       .populate('customer', 'firstName lastName phone')
//       .populate('createdBy', 'name')
//       .populate('order', 'orderId');

//     res.json({
//       success: true,
//       message: 'Transaction updated successfully',
//       data: updatedTransaction
//     });
//   } catch (error) {
//     console.error('❌ Update transaction error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to update transaction',
//       error: error.message
//     });
//   }
// };

// // ============================================
// // ✅ DELETE TRANSACTION
// // ============================================
// export const deleteTransaction = async (req, res) => {
//   try {
//     const transaction = await Transaction.findById(req.params.id);

//     if (!transaction) {
//       return res.status(404).json({
//         success: false,
//         message: 'Transaction not found'
//       });
//     }

//     // Only admin can delete
//     if (req.user.role !== 'ADMIN') {
//       return res.status(403).json({
//         success: false,
//         message: 'Only admin can delete transactions'
//       });
//     }

//     // Check if this transaction is linked to an order
//     if (transaction.order) {
//       console.log(`⚠️ Transaction ${req.params.id} is linked to order ${transaction.order}`);
//     }

//     await transaction.deleteOne();

//     console.log('✅ Transaction deleted:', req.params.id);

//     res.json({
//       success: true,
//       message: 'Transaction deleted successfully'
//     });

//   } catch (error) {
//     console.error('❌ Delete transaction error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to delete transaction',
//       error: error.message
//     });
//   }
// };

// // ============================================
// // ✅ GET TRANSACTIONS BY ORDER
// // ============================================
// export const getTransactionsByOrder = async (req, res) => {
//   try {
//     const { orderId } = req.params;
    
//     // First get the order details
//     const order = await Order.findById(orderId).select('orderId customer totalAmount');
    
//     const transactions = await Transaction.find({ 
//       order: orderId,
//       status: 'completed' 
//     })
//     .populate('customer', 'firstName lastName phone')
//     .populate('createdBy', 'name')
//     .sort('-transactionDate');
    
//     const totalIncome = transactions
//       .filter(t => t.type === 'income')
//       .reduce((sum, t) => sum + t.amount, 0);
      
//     const totalExpense = transactions
//       .filter(t => t.type === 'expense')
//       .reduce((sum, t) => sum + t.amount, 0);
    
//     res.json({
//       success: true,
//       order: order ? {
//         id: order._id,
//         orderId: order.orderId,
//         totalAmount: order.totalAmount
//       } : null,
//       count: transactions.length,
//       summary: {
//         totalIncome,
//         totalExpense,
//         netAmount: totalIncome - totalExpense
//       },
//       transactions
//     });
    
//   } catch (error) {
//     console.error('❌ Get by order error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch transactions',
//       error: error.message
//     });
//   }
// };

// // ============================================
// // ✅ GET TRANSACTIONS BY CUSTOMER
// // ============================================
// export const getTransactionsByCustomer = async (req, res) => {
//   try {
//     const { customerId } = req.params;
//     const { type, startDate, endDate, limit = 50 } = req.query;

//     const filter = { 
//       customer: customerId,
//       status: 'completed' 
//     };

//     if (type) filter.type = type;

//     if (startDate || endDate) {
//       filter.transactionDate = {};
//       if (startDate) {
//         const start = new Date(startDate);
//         start.setHours(0, 0, 0, 0);
//         filter.transactionDate.$gte = start;
//       }
//       if (endDate) {
//         const end = new Date(endDate);
//         end.setHours(23, 59, 59, 999);
//         filter.transactionDate.$lte = end;
//       }
//     }

//     const transactions = await Transaction.find(filter)
//       .populate('order', 'orderId')
//       .populate('createdBy', 'name')
//       .sort('-transactionDate')
//       .limit(parseInt(limit));

//     // Calculate totals
//     const totalIncome = transactions
//       .filter(t => t.type === 'income')
//       .reduce((sum, t) => sum + t.amount, 0);

//     const totalExpense = transactions
//       .filter(t => t.type === 'expense')
//       .reduce((sum, t) => sum + t.amount, 0);

//     // Group by order
//     const byOrder = {};
//     transactions.forEach(t => {
//       if (t.order) {
//         const orderId = t.order.toString();
//         if (!byOrder[orderId]) {
//           byOrder[orderId] = {
//             orderId: orderId,
//             income: 0,
//             expense: 0,
//             count: 0
//           };
//         }
//         if (t.type === 'income') {
//           byOrder[orderId].income += t.amount;
//         } else {
//           byOrder[orderId].expense += t.amount;
//         }
//         byOrder[orderId].count++;
//       }
//     });

//     res.json({
//       success: true,
//       count: transactions.length,
//       summary: {
//         totalIncome,
//         totalExpense,
//         netBalance: totalIncome - totalExpense
//       },
//       byOrder: Object.values(byOrder),
//       transactions
//     });
//   } catch (error) {
//     console.error('❌ Get by customer error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch transactions',
//       error: error.message
//     });
//   }
// };

// // ============================================
// // ✅ GET TRANSACTION SUMMARY
// // ============================================
// export const getTransactionSummary = async (req, res) => {
//   try {
//     const { period = 'month' } = req.query;

//     let startDate = new Date();
//     const endDate = new Date();
//     endDate.setHours(23, 59, 59, 999);

//     if (period === 'today') {
//       startDate.setHours(0, 0, 0, 0);
//     } else if (period === 'week') {
//       startDate.setDate(startDate.getDate() - startDate.getDay());
//       startDate.setHours(0, 0, 0, 0);
//     } else if (period === 'month') {
//       startDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
//       startDate.setHours(0, 0, 0, 0);
//     } else if (period === 'year') {
//       startDate = new Date(startDate.getFullYear(), 0, 1);
//       startDate.setHours(0, 0, 0, 0);
//     }

//     const summary = await Transaction.aggregate([
//       {
//         $match: {
//           transactionDate: { $gte: startDate, $lte: endDate },
//           status: 'completed'
//         }
//       },
//       {
//         $group: {
//           _id: {
//             type: '$type',
//             accountType: '$accountType'
//           },
//           total: { $sum: '$amount' },
//           count: { $sum: 1 }
//         }
//       }
//     ]);

//     // Get category breakdown
//     const categoryBreakdown = await Transaction.aggregate([
//       {
//         $match: {
//           transactionDate: { $gte: startDate, $lte: endDate },
//           status: 'completed'
//         }
//       },
//       {
//         $group: {
//           _id: {
//             type: '$type',
//             category: '$category'
//           },
//           total: { $sum: '$amount' },
//           count: { $sum: 1 }
//         }
//       },
//       { $sort: { total: -1 } }
//     ]);

//     // Format response
//     const result = {
//       period,
//       dateRange: {
//         start: startDate,
//         end: endDate
//       },
//       handCash: { income: 0, expense: 0, count: 0 },
//       bank: { income: 0, expense: 0, count: 0 },
//       categoryBreakdown,
//       recentTransactions: await Transaction.find({
//         transactionDate: { $gte: startDate, $lte: endDate },
//         status: 'completed'
//       })
//         .populate('customer', 'firstName lastName phone')
//         .populate('order', 'orderId')
//         .sort({ transactionDate: -1 })
//         .limit(10)
//     };

//     summary.forEach(item => {
//       const account = item._id.accountType === 'hand-cash' ? 'handCash' : 'bank';
//       const type = item._id.type;
//       result[account][type] = item.total;
//       result[account].count += item.count;
//     });

//     res.json({
//       success: true,
//       data: result
//     });

//   } catch (error) {
//     console.error('❌ Get summary error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch summary',
//       error: error.message
//     });
//   }
// };

// // ============================================
// // ✅ GET TRANSACTION STATS
// // ============================================
// export const getTransactionStats = async (req, res) => {
//   try {
//     const stats = await Transaction.aggregate([
//       { $match: { status: 'completed' } },
//       {
//         $group: {
//           _id: {
//             type: '$type',
//             category: '$category',
//             accountType: '$accountType'
//           },
//           totalAmount: { $sum: '$amount' },
//           count: { $sum: 1 },
//           avgAmount: { $avg: '$amount' },
//           maxAmount: { $max: '$amount' },
//           minAmount: { $min: '$amount' }
//         }
//       },
//       { $sort: { totalAmount: -1 } }
//     ]);

//     // Get top income sources
//     const topIncomeSources = await Transaction.aggregate([
//       { $match: { type: 'income', status: 'completed' } },
//       {
//         $group: {
//           _id: {
//             category: '$category',
//             order: '$order'
//           },
//           totalAmount: { $sum: '$amount' },
//           count: { $sum: 1 }
//         }
//       },
//       { $sort: { totalAmount: -1 } },
//       { $limit: 10 }
//     ]);

//     // Get monthly trend
//     const monthlyTrend = await Transaction.aggregate([
//       { 
//         $match: { 
//           status: 'completed',
//           transactionDate: { $gte: new Date(new Date().getFullYear(), 0, 1) }
//         } 
//       },
//       {
//         $group: {
//           _id: {
//             month: { $month: '$transactionDate' },
//             year: { $year: '$transactionDate' },
//             type: '$type'
//           },
//           total: { $sum: '$amount' },
//           count: { $sum: 1 }
//         }
//       },
//       { $sort: { '_id.year': 1, '_id.month': 1 } }
//     ]);

//     res.json({
//       success: true,
//       data: {
//         detailed: stats,
//         topIncomeSources,
//         monthlyTrend
//       }
//     });

//   } catch (error) {
//     console.error('❌ Get stats error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch stats',
//       error: error.message
//     });
//   }
// };

// // ============================================
// // ✅ BULK DELETE TRANSACTIONS
// // ============================================
// export const bulkDeleteTransactions = async (req, res) => {
//   try {
//     const { ids } = req.body;

//     if (!ids || !Array.isArray(ids) || ids.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: 'Please provide an array of transaction IDs'
//       });
//     }

//     // Check if any transactions are linked to orders
//     const orderLinkedTransactions = await Transaction.find({
//       _id: { $in: ids },
//       order: { $ne: null }
//     });

//     if (orderLinkedTransactions.length > 0) {
//       console.log('⚠️ Cannot delete order-linked transactions:', orderLinkedTransactions.map(t => t._id));
//       return res.status(400).json({
//         success: false,
//         message: 'Cannot delete transactions linked to orders',
//         orderLinked: orderLinkedTransactions.map(t => t._id)
//       });
//     }

//     const result = await Transaction.deleteMany({
//       _id: { $in: ids }
//     });

//     res.json({
//       success: true,
//       message: `Successfully deleted ${result.deletedCount} transactions`,
//       deletedCount: result.deletedCount
//     });
//   } catch (error) {
//     console.error('❌ Bulk delete error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to delete transactions',
//       error: error.message
//     });
//   }
// };

// // ============================================
// // ✅ EXPORT TRANSACTIONS
// // ============================================
// export const exportTransactions = async (req, res) => {
//   try {
//     const {
//       type,
//       startDate,
//       endDate,
//       accountType,
//       customerId
//     } = req.query;

//     const filter = { status: 'completed' };

//     if (type) filter.type = type;
//     if (accountType) filter.accountType = accountType;
//     if (customerId) filter.customer = customerId;

//     if (startDate || endDate) {
//       filter.transactionDate = {};
//       if (startDate) {
//         const start = new Date(startDate);
//         start.setHours(0, 0, 0, 0);
//         filter.transactionDate.$gte = start;
//       }
//       if (endDate) {
//         const end = new Date(endDate);
//         end.setHours(23, 59, 59, 999);
//         filter.transactionDate.$lte = end;
//       }
//     }

//     const transactions = await Transaction.find(filter)
//       .populate('customer', 'firstName lastName phone')
//       .populate('order', 'orderId')
//       .populate('createdBy', 'name')
//       .sort('-transactionDate');

//     // Format for export
//     const exportData = transactions.map(t => ({
//       'Transaction ID': t._id,
//       'Type': t.type,
//       'Category': t.isOtherCategory ? t.customCategory : t.category,
//       'Amount': t.amount,
//       'Payment Method': t.paymentMethod,
//       'Account': t.accountType === 'hand-cash' ? 'Hand Cash' : 'Bank',
//       'Customer Name': t.customerDetails?.name || 'N/A',
//       'Customer Phone': t.customerDetails?.phone || 'N/A',
//       'Order ID': t.order?.orderId || 'N/A',
//       'Description': t.description || '',
//       'Reference Number': t.referenceNumber || '',
//       'Date': new Date(t.transactionDate).toLocaleDateString('en-IN'),
//       'Time': new Date(t.transactionDate).toLocaleTimeString('en-IN'),
//       'Created By': t.createdBy?.name || 'N/A',
//       'Status': t.status
//     }));

//     res.json({
//       success: true,
//       count: exportData.length,
//       data: exportData
//     });
//   } catch (error) {
//     console.error('❌ Export error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to export transactions',
//       error: error.message
//     });
//   }
// };

// // ============================================
// // ✅ GET TRANSACTIONS BY DATE RANGE
// // ============================================
// export const getTransactionsByDateRange = async (req, res) => {
//   try {
//     const { start, end } = req.params;
//     const { type, accountType } = req.query;

//     const startDate = new Date(start);
//     startDate.setHours(0, 0, 0, 0);

//     const endDate = new Date(end);
//     endDate.setHours(23, 59, 59, 999);

//     const filter = {
//       transactionDate: { $gte: startDate, $lte: endDate },
//       status: 'completed'
//     };

//     if (type) filter.type = type;
//     if (accountType) filter.accountType = accountType;

//     const transactions = await Transaction.find(filter)
//       .populate('customer', 'firstName lastName phone')
//       .populate('order', 'orderId')
//       .sort('transactionDate');

//     // Calculate daily summary
//     const dailySummary = {};
//     transactions.forEach(t => {
//       const date = t.transactionDate.toISOString().split('T')[0];
//       if (!dailySummary[date]) {
//         dailySummary[date] = {
//           date,
//           income: 0,
//           expense: 0,
//           count: 0
//         };
//       }
//       if (t.type === 'income') {
//         dailySummary[date].income += t.amount;
//       } else {
//         dailySummary[date].expense += t.amount;
//       }
//       dailySummary[date].count++;
//     });

//     res.json({
//       success: true,
//       dateRange: { start, end },
//       summary: {
//         totalTransactions: transactions.length,
//         totalIncome: transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0),
//         totalExpense: transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0),
//         netAmount: transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0) - 
//                   transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)
//       },
//       dailySummary: Object.values(dailySummary),
//       transactions
//     });
//   } catch (error) {
//     console.error('❌ Date range error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch transactions',
//       error: error.message
//     });
//   }
// };

// // ============================================
// // ✅ GET DASHBOARD DATA
// // ============================================
// export const getDashboardData = async (req, res) => {
//   try {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
//     const startOfYear = new Date(today.getFullYear(), 0, 1);

//     // Get today's transactions
//     const todayTransactions = await Transaction.find({
//       transactionDate: { $gte: today },
//       status: 'completed'
//     });

//     // Get this month's transactions
//     const monthTransactions = await Transaction.find({
//       transactionDate: { $gte: startOfMonth },
//       status: 'completed'
//     });

//     // Get this year's transactions
//     const yearTransactions = await Transaction.find({
//       transactionDate: { $gte: startOfYear },
//       status: 'completed'
//     });

//     // Calculate totals
//     const todayIncome = todayTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
//     const todayExpense = todayTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    
//     const monthIncome = monthTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
//     const monthExpense = monthTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    
//     const yearIncome = yearTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
//     const yearExpense = yearTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

//     // Get recent transactions
//     const recentTransactions = await Transaction.find({ status: 'completed' })
//       .populate('customer', 'firstName lastName phone')
//       .populate('order', 'orderId')
//       .sort('-transactionDate')
//       .limit(10);

//     res.json({
//       success: true,
//       data: {
//         today: {
//           income: todayIncome,
//           expense: todayExpense,
//           net: todayIncome - todayExpense,
//           count: todayTransactions.length
//         },
//         thisMonth: {
//           income: monthIncome,
//           expense: monthExpense,
//           net: monthIncome - monthExpense,
//           count: monthTransactions.length
//         },
//         thisYear: {
//           income: yearIncome,
//           expense: yearExpense,
//           net: yearIncome - yearExpense,
//           count: yearTransactions.length
//         },
//         recentTransactions
//       }
//     });

//   } catch (error) {
//     console.error('❌ Dashboard error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch dashboard data',
//       error: error.message
//     });
//   }
// };

// // ============================================
// // ✅ GET TODAY'S TRANSACTIONS
// // ============================================
// export const getTodayTransactions = async (req, res) => {
//   try {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
    
//     const tomorrow = new Date(today);
//     tomorrow.setDate(tomorrow.getDate() + 1);

//     const transactions = await Transaction.find({
//       transactionDate: { $gte: today, $lt: tomorrow },
//       status: 'completed'
//     })
//     .populate('customer', 'firstName lastName phone')
//     .populate('order', 'orderId')
//     .sort('-transactionDate');

//     // Calculate totals
//     const totalIncome = transactions
//       .filter(t => t.type === 'income')
//       .reduce((sum, t) => sum + t.amount, 0);
      
//     const totalExpense = transactions
//       .filter(t => t.type === 'expense')
//       .reduce((sum, t) => sum + t.amount, 0);

//     // Split by account type
//     const handCashIncome = transactions
//       .filter(t => t.type === 'income' && t.accountType === 'hand-cash')
//       .reduce((sum, t) => sum + t.amount, 0);
      
//     const bankIncome = transactions
//       .filter(t => t.type === 'income' && t.accountType === 'bank')
//       .reduce((sum, t) => sum + t.amount, 0);
      
//     const handCashExpense = transactions
//       .filter(t => t.type === 'expense' && t.accountType === 'hand-cash')
//       .reduce((sum, t) => sum + t.amount, 0);
      
//     const bankExpense = transactions
//       .filter(t => t.type === 'expense' && t.accountType === 'bank')
//       .reduce((sum, t) => sum + t.amount, 0);

//     res.json({
//       success: true,
//       data: {
//         transactions,
//         summary: {
//           totalIncome,
//           totalExpense,
//           netAmount: totalIncome - totalExpense,
//           count: transactions.length,
//           handCash: {
//             income: handCashIncome,
//             expense: handCashExpense,
//             balance: handCashIncome - handCashExpense
//           },
//           bank: {
//             income: bankIncome,
//             expense: bankExpense,
//             balance: bankIncome - bankExpense
//           }
//         }
//       }
//     });

//   } catch (error) {
//     console.error('❌ Get today transactions error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch today\'s transactions',
//       error: error.message
//     });
//   }
// };

// // ============================================
// // ✅ GET DAILY REVENUE STATS FOR CHART
// // ============================================
// export const getDailyRevenueStats = async (req, res) => {
//   try {
//     const { period, startDate, endDate } = req.query;
    
//     console.log('📊 Getting daily revenue stats with:', { period, startDate, endDate });
    
//     // Build date filter based on period or custom dates
//     let start, end;
//     const today = new Date();
    
//     if (period === 'today') {
//       start = new Date(today.setHours(0, 0, 0, 0));
//       end = new Date(today.setHours(23, 59, 59, 999));
//     } 
//     else if (period === 'week') {
//       start = new Date(today);
//       start.setDate(today.getDate() - today.getDay()); // Start of week (Sunday)
//       start.setHours(0, 0, 0, 0);
      
//       end = new Date(start);
//       end.setDate(start.getDate() + 7);
//       end.setHours(23, 59, 59, 999);
//     } 
//     else if (period === 'month') {
//       start = new Date(today.getFullYear(), today.getMonth(), 1);
//       end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
//       end.setHours(23, 59, 59, 999);
//     } 
//     else if (startDate && endDate) {
//       start = new Date(startDate);
//       start.setHours(0, 0, 0, 0);
      
//       end = new Date(endDate);
//       end.setHours(23, 59, 59, 999);
//     } else {
//       // Default to current month
//       start = new Date(today.getFullYear(), today.getMonth(), 1);
//       end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
//       end.setHours(23, 59, 59, 999);
//     }
    
//     console.log('📅 Date range:', { start, end });

//     // Get transactions grouped by date
//     const transactions = await Transaction.aggregate([
//       {
//         $match: {
//           transactionDate: { $gte: start, $lte: end },
//           status: 'completed'
//         }
//       },
//       {
//         $group: {
//           _id: {
//             date: { $dateToString: { format: '%Y-%m-%d', date: '$transactionDate' } },
//             type: '$type'
//           },
//           total: { $sum: '$amount' },
//           count: { $sum: 1 }
//         }
//       },
//       { $sort: { '_id.date': 1 } }
//     ]);

//     console.log('📊 Aggregated transactions:', transactions);

//     // Prepare chart data based on period
//     let chartData = [];

//     if (period === 'today') {
//       // Hourly data for today
//       const hourlyData = {};
      
//       // Initialize hours
//       for (let i = 9; i <= 20; i++) {
//         const hourKey = i < 10 ? `0${i}:00` : `${i}:00`;
//         hourlyData[hourKey] = { revenue: 0, expense: 0 };
//       }

//       // Fill with actual data
//       transactions.forEach(item => {
//         const date = new Date(item._id.date);
//         const hour = date.getHours();
//         if (hour >= 9 && hour <= 20) {
//           const hourKey = hour < 10 ? `0${hour}:00` : `${hour}:00`;
//           if (item._id.type === 'income') {
//             hourlyData[hourKey].revenue = item.total;
//           } else {
//             hourlyData[hourKey].expense = item.total;
//           }
//         }
//       });

//       // Convert to array
//       for (let i = 9; i <= 20; i++) {
//         const hourKey = i < 10 ? `0${i}:00` : `${i}:00`;
//         chartData.push({
//           time: `${i} AM`,
//           revenue: hourlyData[hourKey].revenue || 0,
//           expense: hourlyData[hourKey].expense || 0
//         });
//       }
//     } 
//     else if (period === 'week') {
//       // Daily data for week
//       const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
//       const dailyMap = new Map();
      
//       // Initialize days
//       for (let i = 0; i < 7; i++) {
//         const date = new Date(start);
//         date.setDate(start.getDate() + i);
//         const dateStr = date.toISOString().split('T')[0];
//         dailyMap.set(dateStr, { 
//           day: days[date.getDay()],
//           revenue: 0, 
//           expense: 0 
//         });
//       }

//       // Fill with actual data
//       transactions.forEach(item => {
//         const dateStr = item._id.date;
//         if (dailyMap.has(dateStr)) {
//           const entry = dailyMap.get(dateStr);
//           if (item._id.type === 'income') {
//             entry.revenue = item.total;
//           } else {
//             entry.expense = item.total;
//           }
//         }
//       });

//       // Convert to array
//       chartData = Array.from(dailyMap.values());
//     }
//     else {
//       // Monthly/Period data - group by week or day
//       const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      
//       if (diffDays <= 7) {
//         // Daily data for short periods
//         const dailyMap = new Map();
        
//         // Initialize all dates in range
//         for (let i = 0; i <= diffDays; i++) {
//           const date = new Date(start);
//           date.setDate(start.getDate() + i);
//           const dateStr = date.toISOString().split('T')[0];
//           dailyMap.set(dateStr, { 
//             day: date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
//             revenue: 0, 
//             expense: 0 
//           });
//         }

//         // Fill with actual data
//         transactions.forEach(item => {
//           const dateStr = item._id.date;
//           if (dailyMap.has(dateStr)) {
//             const entry = dailyMap.get(dateStr);
//             if (item._id.type === 'income') {
//               entry.revenue = item.total;
//             } else {
//               entry.expense = item.total;
//             }
//           }
//         });

//         chartData = Array.from(dailyMap.values());
//       } else {
//         // Weekly data for longer periods
//         const weeks = Math.ceil(diffDays / 7);
//         const weeklyData = [];

//         for (let w = 0; w < weeks; w++) {
//           const weekStart = new Date(start);
//           weekStart.setDate(start.getDate() + (w * 7));
//           const weekEnd = new Date(weekStart);
//           weekEnd.setDate(weekStart.getDate() + 6);

//           let weekRevenue = 0;
//           let weekExpense = 0;

//           transactions.forEach(item => {
//             const itemDate = new Date(item._id.date);
//             if (itemDate >= weekStart && itemDate <= weekEnd) {
//               if (item._id.type === 'income') {
//                 weekRevenue += item.total;
//               } else {
//                 weekExpense += item.total;
//               }
//             }
//           });

//           weeklyData.push({
//             day: `Week ${w + 1}`,
//             revenue: weekRevenue,
//             expense: weekExpense
//           });
//         }

//         chartData = weeklyData;
//       }
//     }

//     console.log('✅ Chart data prepared:', chartData);

//     // Calculate totals
//     const totalRevenue = chartData.reduce((sum, item) => sum + (item.revenue || 0), 0);
//     const totalExpense = chartData.reduce((sum, item) => sum + (item.expense || 0), 0);

//     res.json({
//       success: true,
//       data: {
//         chartData,
//         summary: {
//           totalRevenue,
//           totalExpense,
//           netProfit: totalRevenue - totalExpense,
//           period,
//           dateRange: { start, end }
//         }
//       }
//     });

//   } catch (error) {
//     console.error('❌ Error in getDailyRevenueStats:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch daily revenue stats',
//       error: error.message
//     });
//   }
// };




// controllers/transaction.controller.js - COMPLETE FIXED VERSION WITH DEBUG LOGS
import Transaction from '../models/Transaction.js';
import Customer from '../models/Customer.js';
import Order from '../models/Order.js';

// Define allowed regular categories (without 'other' options)
const INCOME_CATEGORIES = [
  'customer-advance', 
  'full-payment', 
  'part-payment',      // ✅ ADDED for partial payments
  'fabric-sale', 
  'project-payment',
  'other-income'       // ✅ ADDED for custom income
];

const EXPENSE_CATEGORIES = [
  'salary', 
  'electricity', 
  'travel', 
  'material-purchase', 
  'rent', 
  'maintenance'
];

// ============================================
// ✅ CREATE TRANSACTION - FIXED VERSION
// ============================================
export const createTransaction = async (req, res) => {
  try {
    const {
      type,
      category,
      customCategory,
      amount,
      paymentMethod,
      customer,
      order,
      description,
      transactionDate,
      referenceNumber
    } = req.body;

    // 🔍 DEBUG: Log incoming request
    console.log("\n🔵🔵🔵 CREATE TRANSACTION CALLED 🔵🔵🔵");
    console.log("📥 Request body:", { 
      type, 
      category, 
      customCategory, 
      amount, 
      paymentMethod,
      customer: customer || 'No customer',
      order: order || 'No order',
      description: description?.substring(0, 30)
    });
    console.log("👤 User:", req.user?._id, req.user?.name);

    // Validation
    if (!type || !category || !amount || !paymentMethod) {
      console.log("❌ Validation failed: Missing required fields");
      return res.status(400).json({
        success: false,
        message: 'Please fill all required fields'
      });
    }

    // Handle "other" categories
    let isOtherCategory = false;
    let finalCategory = category;
    let finalCustomCategory = null;

    // Income category validation
    if (type === 'income') {
      if (category === 'other-income') {
        isOtherCategory = true;
        finalCategory = 'other-income';
        finalCustomCategory = customCategory;
        
        if (!customCategory) {
          console.log("❌ Other income category not specified");
          return res.status(400).json({
            success: false,
            message: 'Please specify the income category'
          });
        }
      } else if (!INCOME_CATEGORIES.includes(category)) {
        console.log("❌ Invalid income category:", category);
        return res.status(400).json({
          success: false,
          message: 'Invalid income category'
        });
      }
    }

    // Expense category validation
    if (type === 'expense') {
      if (category === 'other-expense') {
        isOtherCategory = true;
        finalCategory = 'other-expense';
        finalCustomCategory = customCategory;
        
        if (!customCategory) {
          console.log("❌ Other expense category not specified");
          return res.status(400).json({
            success: false,
            message: 'Please specify the expense category'
          });
        }
      } else if (!EXPENSE_CATEGORIES.includes(category)) {
        console.log("❌ Invalid expense category:", category);
        return res.status(400).json({
          success: false,
          message: 'Invalid expense category'
        });
      }
    }

    // Set account type based on payment method
    const accountType = paymentMethod === 'cash' ? 'hand-cash' : 'bank';
    console.log("💰 Account type determined:", accountType);

    // Get customer details if customer ID is provided
    let customerDetails = null;
    if (customer) {
      console.log("🔍 Fetching customer details for:", customer);
      const customerData = await Customer.findById(customer).select('firstName lastName phone customerId');
      if (customerData) {
        customerDetails = {
          name: `${customerData.firstName || ''} ${customerData.lastName || ''}`.trim() || 'Unknown',
          phone: customerData.phone,
          id: customerData.customerId || customerData._id
        };
        console.log("✅ Customer found:", customerDetails.name);
      } else {
        console.log("⚠️ Customer not found with ID:", customer);
      }
    }

    // 🔥 FIXED: CHECK FOR DUPLICATE TRANSACTIONS - Added category and amount
    if (order && type === 'income') {
      console.log("\n🔍 CHECKING FOR DUPLICATE INCOME TRANSACTION:");
      console.log("   Order ID:", order);
      console.log("   Category:", finalCategory);
      console.log("   Amount:", Number(amount));
      console.log("   Payment Method:", paymentMethod);
      
      const existingTransaction = await Transaction.findOne({
        order: order,
        type: 'income',
        category: finalCategory,  // ✅ CRITICAL: Category must match
        amount: Number(amount),   // ✅ CRITICAL: Amount must match
        paymentMethod: paymentMethod,
        status: 'completed'
      });
      
      if (existingTransaction) {
        console.log("⚠️⚠️⚠️ DUPLICATE TRANSACTION DETECTED! ⚠️⚠️⚠️");
        console.log("   Existing transaction ID:", existingTransaction._id);
        console.log("   Existing category:", existingTransaction.category);
        console.log("   Existing amount:", existingTransaction.amount);
        console.log("   Skipping save - returning existing transaction");
        
        const populatedExisting = await Transaction.findById(existingTransaction._id)
          .populate('customer', 'firstName lastName phone')
          .populate('createdBy', 'name')
          .populate('order', 'orderId customer');
          
        return res.status(200).json({
          success: true,
          message: 'Transaction already exists for this order',
          data: populatedExisting,
          duplicate: true
        });
      } else {
        console.log("✅ No duplicate found - proceeding to create new transaction");
      }
    } else {
      console.log("🔍 Skipping duplicate check (not order-linked income transaction)");
    }

    // Create transaction data object
    const transactionData = {
      type,
      category: finalCategory,
      amount: Number(amount),
      paymentMethod,
      accountType,
      description: description || '',
      transactionDate: transactionDate || Date.now(),
      referenceNumber: referenceNumber || '',
      createdBy: req.user._id,
      status: 'completed'
    };

    // Add optional fields
    if (isOtherCategory) {
      transactionData.isOtherCategory = true;
      transactionData.customCategory = finalCustomCategory;
    }

    if (customer) {
      transactionData.customer = customer;
      transactionData.customerDetails = customerDetails;
    }

    if (order) {
      transactionData.order = order;
    }

    console.log("\n💾 Creating new transaction with data:", {
      type: transactionData.type,
      category: transactionData.category,
      amount: transactionData.amount,
      paymentMethod: transactionData.paymentMethod,
      accountType: transactionData.accountType,
      customer: transactionData.customer ? 'Yes' : 'No',
      order: transactionData.order ? 'Yes' : 'No'
    });

    // Create transaction
    const transaction = await Transaction.create(transactionData);
    console.log("✅✅✅ TRANSACTION CREATED SUCCESSFULLY! ID:", transaction._id);

    // Populate references
    const populatedTransaction = await Transaction.findById(transaction._id)
      .populate('customer', 'firstName lastName phone')
      .populate('createdBy', 'name')
      .populate('order', 'orderId customer totalAmount');

    console.log("✅ Returning created transaction to client\n");

    res.status(201).json({
      success: true,
      message: `${type === 'income' ? 'Income' : 'Expense'} added successfully`,
      data: populatedTransaction
    });

  } catch (error) {
    console.error("\n❌❌❌ TRANSACTION CREATION ERROR ❌❌❌");
    console.error("Error:", error);
    console.error("Stack:", error.stack);
    res.status(500).json({
      success: false,
      message: 'Failed to create transaction',
      error: error.message
    });
  }
};

// ============================================
// ✅ GET ALL TRANSACTIONS WITH FILTERS
// ============================================
export const getTransactions = async (req, res) => {
  try {
    const {
      type,
      accountType,
      category,
      startDate,
      endDate,
      order,
      customer,
      search,
      page = 1,
      limit = 20,
      sortBy = 'transactionDate',
      sortOrder = 'desc'
    } = req.query;

    console.log("\n💰💰💰 GET TRANSACTIONS CALLED 💰💰💰");
    console.log("📥 Query params:", { 
      type, 
      accountType, 
      category, 
      startDate, 
      endDate,
      page,
      limit
    });

    // Build filter
    const filter = { status: 'completed' };

    if (type) filter.type = type;
    if (accountType) filter.accountType = accountType;
    if (category) filter.category = category;
    if (order) filter.order = order;
    if (customer) filter.customer = customer;

    // Search in description or reference
    if (search) {
      filter.$or = [
        { description: { $regex: search, $options: 'i' } },
        { referenceNumber: { $regex: search, $options: 'i' } }
      ];
    }

    // Date range filter
    if (startDate || endDate) {
      filter.transactionDate = {};
      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        filter.transactionDate.$gte = start;
        console.log("📅 Start date filter:", start);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filter.transactionDate.$lte = end;
        console.log("📅 End date filter:", end);
      }
    }

    console.log("🔍 Final filter:", JSON.stringify(filter, null, 2));

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    console.log("📄 Pagination - Skip:", skip, "Limit:", limit);

    // Get transactions
    const transactions = await Transaction.find(filter)
      .populate('customer', 'firstName lastName phone customerId')
      .populate('createdBy', 'name')
      .populate('order', 'orderId customer totalAmount status')
      .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count
    const total = await Transaction.countDocuments(filter);

    console.log(`✅ Found ${transactions.length} transactions for page ${page} (Total: ${total})`);

    // Calculate totals
    const totals = await Transaction.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalIncome: {
            $sum: {
              $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0]
            }
          },
          totalExpense: {
            $sum: {
              $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0]
            }
          },
          handCashIncome: {
            $sum: {
              $cond: [
                { $and: [{ $eq: ['$accountType', 'hand-cash'] }, { $eq: ['$type', 'income'] }] },
                '$amount',
                0
              ]
            }
          },
          handCashExpense: {
            $sum: {
              $cond: [
                { $and: [{ $eq: ['$accountType', 'hand-cash'] }, { $eq: ['$type', 'expense'] }] },
                '$amount',
                0
              ]
            }
          },
          bankIncome: {
            $sum: {
              $cond: [
                { $and: [{ $eq: ['$accountType', 'bank'] }, { $eq: ['$type', 'income'] }] },
                '$amount',
                0
              ]
            }
          },
          bankExpense: {
            $sum: {
              $cond: [
                { $and: [{ $eq: ['$accountType', 'bank'] }, { $eq: ['$type', 'expense'] }] },
                '$amount',
                0
              ]
            }
          }
        }
      }
    ]);

    const summary = totals[0] || {
      totalIncome: 0,
      totalExpense: 0,
      handCashIncome: 0,
      handCashExpense: 0,
      bankIncome: 0,
      bankExpense: 0
    };

    // Calculate balances
    const handCashBalance = summary.handCashIncome - summary.handCashExpense;
    const bankBalance = summary.bankIncome - summary.bankExpense;

    console.log("📊 Summary calculated:", {
      totalIncome: summary.totalIncome,
      totalExpense: summary.totalExpense,
      handCashBalance,
      bankBalance
    });

    res.json({
      success: true,
      data: {
        transactions,
        summary: {
          totalIncome: summary.totalIncome,
          totalExpense: summary.totalExpense,
          netBalance: summary.totalIncome - summary.totalExpense,
          handCash: {
            income: summary.handCashIncome,
            expense: summary.handCashExpense,
            balance: handCashBalance
          },
          bank: {
            income: summary.bankIncome,
            expense: summary.bankExpense,
            balance: bankBalance
          },
          totalBalance: handCashBalance + bankBalance
        },
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });

  } catch (error) {
    console.error('❌ Get transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch transactions',
      error: error.message
    });
  }
};

// ============================================
// ✅ GET TRANSACTION BY ID
// ============================================
export const getTransactionById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("\n🔍 GET TRANSACTION BY ID:", id);

    const transaction = await Transaction.findById(id)
      .populate('customer', 'firstName lastName phone customerId')
      .populate('createdBy', 'name')
      .populate('order', 'orderId customer totalAmount status deliveryDate');

    if (!transaction) {
      console.log("❌ Transaction not found:", id);
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    console.log("✅ Transaction found:", transaction._id);
    res.json({
      success: true,
      data: transaction
    });
  } catch (error) {
    console.error('❌ Get transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch transaction',
      error: error.message
    });
  }
};

// ============================================
// ✅ UPDATE TRANSACTION
// ============================================
export const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      category,
      customCategory,
      amount,
      paymentMethod,
      description,
      transactionDate,
      referenceNumber,
      status
    } = req.body;

    console.log("\n✏️ UPDATE TRANSACTION CALLED:", id);
    console.log("📥 Update data:", { 
      category, 
      amount, 
      paymentMethod,
      status 
    });

    const transaction = await Transaction.findById(id);

    if (!transaction) {
      console.log("❌ Transaction not found:", id);
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    // Only admin can update
    if (req.user.role !== 'ADMIN') {
      console.log("❌ Permission denied - User not admin:", req.user.role);
      return res.status(403).json({
        success: false,
        message: 'Only admin can update transactions'
      });
    }

    // Check if transaction is linked to an order
    if (transaction.order && (amount || paymentMethod)) {
      console.log('⚠️ Updating order-linked transaction:', transaction.order);
    }

    // Update fields
    if (category) {
      if (category === 'other-income' || category === 'other-expense') {
        transaction.category = category;
        transaction.isOtherCategory = true;
        transaction.customCategory = customCategory;
      } else {
        transaction.category = category;
        transaction.isOtherCategory = false;
        transaction.customCategory = null;
      }
    }

    if (amount) transaction.amount = Number(amount);
    if (paymentMethod) {
      transaction.paymentMethod = paymentMethod;
      transaction.accountType = paymentMethod === 'cash' ? 'hand-cash' : 'bank';
    }
    if (description !== undefined) transaction.description = description;
    if (transactionDate) transaction.transactionDate = transactionDate;
    if (referenceNumber !== undefined) transaction.referenceNumber = referenceNumber;
    if (status) transaction.status = status;

    await transaction.save();
    console.log("✅ Transaction updated successfully");

    const updatedTransaction = await Transaction.findById(transaction._id)
      .populate('customer', 'firstName lastName phone')
      .populate('createdBy', 'name')
      .populate('order', 'orderId');

    res.json({
      success: true,
      message: 'Transaction updated successfully',
      data: updatedTransaction
    });
  } catch (error) {
    console.error('❌ Update transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update transaction',
      error: error.message
    });
  }
};

// ============================================
// ✅ DELETE TRANSACTION
// ============================================
export const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("\n🗑️ DELETE TRANSACTION CALLED:", id);

    const transaction = await Transaction.findById(id);

    if (!transaction) {
      console.log("❌ Transaction not found:", id);
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    // Only admin can delete
    if (req.user.role !== 'ADMIN') {
      console.log("❌ Permission denied - User not admin:", req.user.role);
      return res.status(403).json({
        success: false,
        message: 'Only admin can delete transactions'
      });
    }

    // Check if this transaction is linked to an order
    if (transaction.order) {
      console.log(`⚠️ Transaction ${id} is linked to order ${transaction.order}`);
    }

    await transaction.deleteOne();

    console.log('✅ Transaction deleted successfully:', id);

    res.json({
      success: true,
      message: 'Transaction deleted successfully'
    });

  } catch (error) {
    console.error('❌ Delete transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete transaction',
      error: error.message
    });
  }
};

// ============================================
// ✅ GET TRANSACTIONS BY ORDER
// ============================================
export const getTransactionsByOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    console.log("\n📦 GET TRANSACTIONS BY ORDER:", orderId);
    
    // First get the order details
    const order = await Order.findById(orderId).select('orderId customer totalAmount');
    
    const transactions = await Transaction.find({ 
      order: orderId,
      status: 'completed' 
    })
    .populate('customer', 'firstName lastName phone')
    .populate('createdBy', 'name')
    .sort('-transactionDate');
    
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const totalExpense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    console.log(`✅ Found ${transactions.length} transactions for order ${orderId}`);
    
    res.json({
      success: true,
      order: order ? {
        id: order._id,
        orderId: order.orderId,
        totalAmount: order.totalAmount
      } : null,
      count: transactions.length,
      summary: {
        totalIncome,
        totalExpense,
        netAmount: totalIncome - totalExpense
      },
      transactions
    });
    
  } catch (error) {
    console.error('❌ Get by order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch transactions',
      error: error.message
    });
  }
};

// ============================================
// ✅ GET TRANSACTIONS BY CUSTOMER
// ============================================
export const getTransactionsByCustomer = async (req, res) => {
  try {
    const { customerId } = req.params;
    const { type, startDate, endDate, limit = 50 } = req.query;

    console.log("\n👤 GET TRANSACTIONS BY CUSTOMER:", customerId);
    console.log("Filters:", { type, startDate, endDate });

    const filter = { 
      customer: customerId,
      status: 'completed' 
    };

    if (type) filter.type = type;

    if (startDate || endDate) {
      filter.transactionDate = {};
      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        filter.transactionDate.$gte = start;
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filter.transactionDate.$lte = end;
      }
    }

    const transactions = await Transaction.find(filter)
      .populate('order', 'orderId')
      .populate('createdBy', 'name')
      .sort('-transactionDate')
      .limit(parseInt(limit));

    // Calculate totals
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    // Group by order
    const byOrder = {};
    transactions.forEach(t => {
      if (t.order) {
        const orderId = t.order.toString();
        if (!byOrder[orderId]) {
          byOrder[orderId] = {
            orderId: orderId,
            income: 0,
            expense: 0,
            count: 0
          };
        }
        if (t.type === 'income') {
          byOrder[orderId].income += t.amount;
        } else {
          byOrder[orderId].expense += t.amount;
        }
        byOrder[orderId].count++;
      }
    });

    console.log(`✅ Found ${transactions.length} transactions for customer`);
    console.log("📊 Summary:", { totalIncome, totalExpense, netBalance: totalIncome - totalExpense });

    res.json({
      success: true,
      count: transactions.length,
      summary: {
        totalIncome,
        totalExpense,
        netBalance: totalIncome - totalExpense
      },
      byOrder: Object.values(byOrder),
      transactions
    });
  } catch (error) {
    console.error('❌ Get by customer error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch transactions',
      error: error.message
    });
  }
};

// ============================================
// ✅ GET TRANSACTION SUMMARY
// ============================================
export const getTransactionSummary = async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    console.log("\n📊 GET TRANSACTION SUMMARY - Period:", period);

    let startDate = new Date();
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);

    if (period === 'today') {
      startDate.setHours(0, 0, 0, 0);
    } else if (period === 'week') {
      startDate.setDate(startDate.getDate() - startDate.getDay());
      startDate.setHours(0, 0, 0, 0);
    } else if (period === 'month') {
      startDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
      startDate.setHours(0, 0, 0, 0);
    } else if (period === 'year') {
      startDate = new Date(startDate.getFullYear(), 0, 1);
      startDate.setHours(0, 0, 0, 0);
    }

    console.log("📅 Date range:", { start: startDate, end: endDate });

    const summary = await Transaction.aggregate([
      {
        $match: {
          transactionDate: { $gte: startDate, $lte: endDate },
          status: 'completed'
        }
      },
      {
        $group: {
          _id: {
            type: '$type',
            accountType: '$accountType'
          },
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    // Get category breakdown
    const categoryBreakdown = await Transaction.aggregate([
      {
        $match: {
          transactionDate: { $gte: startDate, $lte: endDate },
          status: 'completed'
        }
      },
      {
        $group: {
          _id: {
            type: '$type',
            category: '$category'
          },
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { total: -1 } }
    ]);

    // Format response
    const result = {
      period,
      dateRange: {
        start: startDate,
        end: endDate
      },
      handCash: { income: 0, expense: 0, count: 0 },
      bank: { income: 0, expense: 0, count: 0 },
      categoryBreakdown,
      recentTransactions: await Transaction.find({
        transactionDate: { $gte: startDate, $lte: endDate },
        status: 'completed'
      })
        .populate('customer', 'firstName lastName phone')
        .populate('order', 'orderId')
        .sort({ transactionDate: -1 })
        .limit(10)
    };

    summary.forEach(item => {
      const account = item._id.accountType === 'hand-cash' ? 'handCash' : 'bank';
      const type = item._id.type;
      result[account][type] = item.total;
      result[account].count += item.count;
    });

    console.log("✅ Summary generated successfully");

    res.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('❌ Get summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch summary',
      error: error.message
    });
  }
};

// ============================================
// ✅ GET TRANSACTION STATS
// ============================================
export const getTransactionStats = async (req, res) => {
  try {
    console.log("\n📊 GET TRANSACTION STATS CALLED");

    const stats = await Transaction.aggregate([
      { $match: { status: 'completed' } },
      {
        $group: {
          _id: {
            type: '$type',
            category: '$category',
            accountType: '$accountType'
          },
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 },
          avgAmount: { $avg: '$amount' },
          maxAmount: { $max: '$amount' },
          minAmount: { $min: '$amount' }
        }
      },
      { $sort: { totalAmount: -1 } }
    ]);

    // Get top income sources
    const topIncomeSources = await Transaction.aggregate([
      { $match: { type: 'income', status: 'completed' } },
      {
        $group: {
          _id: {
            category: '$category',
            order: '$order'
          },
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { totalAmount: -1 } },
      { $limit: 10 }
    ]);

    // Get monthly trend
    const monthlyTrend = await Transaction.aggregate([
      { 
        $match: { 
          status: 'completed',
          transactionDate: { $gte: new Date(new Date().getFullYear(), 0, 1) }
        } 
      },
      {
        $group: {
          _id: {
            month: { $month: '$transactionDate' },
            year: { $year: '$transactionDate' },
            type: '$type'
          },
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    console.log("✅ Stats generated successfully");

    res.json({
      success: true,
      data: {
        detailed: stats,
        topIncomeSources,
        monthlyTrend
      }
    });

  } catch (error) {
    console.error('❌ Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch stats',
      error: error.message
    });
  }
};

// ============================================
// ✅ BULK DELETE TRANSACTIONS
// ============================================
export const bulkDeleteTransactions = async (req, res) => {
  try {
    const { ids } = req.body;

    console.log("\n🗑️ BULK DELETE TRANSACTIONS CALLED");
    console.log("IDs to delete:", ids);

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of transaction IDs'
      });
    }

    // Check if any transactions are linked to orders
    const orderLinkedTransactions = await Transaction.find({
      _id: { $in: ids },
      order: { $ne: null }
    });

    if (orderLinkedTransactions.length > 0) {
      console.log('⚠️ Cannot delete order-linked transactions:', orderLinkedTransactions.map(t => t._id));
      return res.status(400).json({
        success: false,
        message: 'Cannot delete transactions linked to orders',
        orderLinked: orderLinkedTransactions.map(t => t._id)
      });
    }

    const result = await Transaction.deleteMany({
      _id: { $in: ids }
    });

    console.log(`✅ Deleted ${result.deletedCount} transactions`);

    res.json({
      success: true,
      message: `Successfully deleted ${result.deletedCount} transactions`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('❌ Bulk delete error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete transactions',
      error: error.message
    });
  }
};

// ============================================
// ✅ EXPORT TRANSACTIONS
// ============================================
export const exportTransactions = async (req, res) => {
  try {
    const {
      type,
      startDate,
      endDate,
      accountType,
      customerId
    } = req.query;

    console.log("\n📤 EXPORT TRANSACTIONS CALLED");
    console.log("Export filters:", { type, startDate, endDate, accountType, customerId });

    const filter = { status: 'completed' };

    if (type) filter.type = type;
    if (accountType) filter.accountType = accountType;
    if (customerId) filter.customer = customerId;

    if (startDate || endDate) {
      filter.transactionDate = {};
      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        filter.transactionDate.$gte = start;
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filter.transactionDate.$lte = end;
      }
    }

    const transactions = await Transaction.find(filter)
      .populate('customer', 'firstName lastName phone')
      .populate('order', 'orderId')
      .populate('createdBy', 'name')
      .sort('-transactionDate');

    console.log(`✅ Found ${transactions.length} transactions for export`);

    // Format for export
    const exportData = transactions.map(t => ({
      'Transaction ID': t._id,
      'Type': t.type,
      'Category': t.isOtherCategory ? t.customCategory : t.category,
      'Amount': t.amount,
      'Payment Method': t.paymentMethod,
      'Account': t.accountType === 'hand-cash' ? 'Hand Cash' : 'Bank',
      'Customer Name': t.customerDetails?.name || 'N/A',
      'Customer Phone': t.customerDetails?.phone || 'N/A',
      'Order ID': t.order?.orderId || 'N/A',
      'Description': t.description || '',
      'Reference Number': t.referenceNumber || '',
      'Date': new Date(t.transactionDate).toLocaleDateString('en-IN'),
      'Time': new Date(t.transactionDate).toLocaleTimeString('en-IN'),
      'Created By': t.createdBy?.name || 'N/A',
      'Status': t.status
    }));

    res.json({
      success: true,
      count: exportData.length,
      data: exportData
    });
  } catch (error) {
    console.error('❌ Export error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export transactions',
      error: error.message
    });
  }
};

// ============================================
// ✅ GET TRANSACTIONS BY DATE RANGE
// ============================================
export const getTransactionsByDateRange = async (req, res) => {
  try {
    const { start, end } = req.params;
    const { type, accountType } = req.query;

    console.log("\n📅 GET TRANSACTIONS BY DATE RANGE");
    console.log("Range:", { start, end, type, accountType });

    const startDate = new Date(start);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(end);
    endDate.setHours(23, 59, 59, 999);

    const filter = {
      transactionDate: { $gte: startDate, $lte: endDate },
      status: 'completed'
    };

    if (type) filter.type = type;
    if (accountType) filter.accountType = accountType;

    const transactions = await Transaction.find(filter)
      .populate('customer', 'firstName lastName phone')
      .populate('order', 'orderId')
      .sort('transactionDate');

    // Calculate daily summary
    const dailySummary = {};
    transactions.forEach(t => {
      const date = t.transactionDate.toISOString().split('T')[0];
      if (!dailySummary[date]) {
        dailySummary[date] = {
          date,
          income: 0,
          expense: 0,
          count: 0
        };
      }
      if (t.type === 'income') {
        dailySummary[date].income += t.amount;
      } else {
        dailySummary[date].expense += t.amount;
      }
      dailySummary[date].count++;
    });

    console.log(`✅ Found ${transactions.length} transactions in date range`);

    res.json({
      success: true,
      dateRange: { start, end },
      summary: {
        totalTransactions: transactions.length,
        totalIncome: transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0),
        totalExpense: transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0),
        netAmount: transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0) - 
                  transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)
      },
      dailySummary: Object.values(dailySummary),
      transactions
    });
  } catch (error) {
    console.error('❌ Date range error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch transactions',
      error: error.message
    });
  }
};

// ============================================
// ✅ GET DASHBOARD DATA
// ============================================
export const getDashboardData = async (req, res) => {
  try {
    console.log("\n📊 GET DASHBOARD DATA CALLED");

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfYear = new Date(today.getFullYear(), 0, 1);

    console.log("📅 Date references:", { today, startOfMonth, startOfYear });

    // Get today's transactions
    const todayTransactions = await Transaction.find({
      transactionDate: { $gte: today },
      status: 'completed'
    });

    // Get this month's transactions
    const monthTransactions = await Transaction.find({
      transactionDate: { $gte: startOfMonth },
      status: 'completed'
    });

    // Get this year's transactions
    const yearTransactions = await Transaction.find({
      transactionDate: { $gte: startOfYear },
      status: 'completed'
    });

    // Calculate totals
    const todayIncome = todayTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const todayExpense = todayTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    
    const monthIncome = monthTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const monthExpense = monthTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    
    const yearIncome = yearTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const yearExpense = yearTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

    // Get recent transactions
    const recentTransactions = await Transaction.find({ status: 'completed' })
      .populate('customer', 'firstName lastName phone')
      .populate('order', 'orderId')
      .sort('-transactionDate')
      .limit(10);

    console.log("✅ Dashboard data generated");
    console.log("📊 Today:", { income: todayIncome, expense: todayExpense, net: todayIncome - todayExpense });

    res.json({
      success: true,
      data: {
        today: {
          income: todayIncome,
          expense: todayExpense,
          net: todayIncome - todayExpense,
          count: todayTransactions.length
        },
        thisMonth: {
          income: monthIncome,
          expense: monthExpense,
          net: monthIncome - monthExpense,
          count: monthTransactions.length
        },
        thisYear: {
          income: yearIncome,
          expense: yearExpense,
          net: yearIncome - yearExpense,
          count: yearTransactions.length
        },
        recentTransactions
      }
    });

  } catch (error) {
    console.error('❌ Dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard data',
      error: error.message
    });
  }
};

// ============================================
// ✅ GET TODAY'S TRANSACTIONS
// ============================================
export const getTodayTransactions = async (req, res) => {
  try {
    console.log("\n📅 GET TODAY'S TRANSACTIONS CALLED");

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    console.log("Date range:", { today, tomorrow });

    const transactions = await Transaction.find({
      transactionDate: { $gte: today, $lt: tomorrow },
      status: 'completed'
    })
    .populate('customer', 'firstName lastName phone')
    .populate('order', 'orderId')
    .sort('-transactionDate');

    // Calculate totals
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const totalExpense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    // Split by account type
    const handCashIncome = transactions
      .filter(t => t.type === 'income' && t.accountType === 'hand-cash')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const bankIncome = transactions
      .filter(t => t.type === 'income' && t.accountType === 'bank')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const handCashExpense = transactions
      .filter(t => t.type === 'expense' && t.accountType === 'hand-cash')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const bankExpense = transactions
      .filter(t => t.type === 'expense' && t.accountType === 'bank')
      .reduce((sum, t) => sum + t.amount, 0);

    console.log(`✅ Found ${transactions.length} transactions for today`);
    console.log("📊 Summary:", { totalIncome, totalExpense, netAmount: totalIncome - totalExpense });

    res.json({
      success: true,
      data: {
        transactions,
        summary: {
          totalIncome,
          totalExpense,
          netAmount: totalIncome - totalExpense,
          count: transactions.length,
          handCash: {
            income: handCashIncome,
            expense: handCashExpense,
            balance: handCashIncome - handCashExpense
          },
          bank: {
            income: bankIncome,
            expense: bankExpense,
            balance: bankIncome - bankExpense
          }
        }
      }
    });

  } catch (error) {
    console.error('❌ Get today transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch today\'s transactions',
      error: error.message
    });
  }
};

// ============================================
// ✅ GET DAILY REVENUE STATS FOR CHART
// ============================================
export const getDailyRevenueStats = async (req, res) => {
  try {
    const { period, startDate, endDate } = req.query;
    
    console.log("\n📊 GETTING DAILY REVENUE STATS FOR CHART");
    console.log("Parameters:", { period, startDate, endDate });
    
    // Build date filter based on period or custom dates
    let start, end;
    const today = new Date();
    
    if (period === 'today') {
      start = new Date(today.setHours(0, 0, 0, 0));
      end = new Date(today.setHours(23, 59, 59, 999));
      console.log("📅 Period: Today");
    } 
    else if (period === 'week') {
      start = new Date(today);
      start.setDate(today.getDate() - today.getDay()); // Start of week (Sunday)
      start.setHours(0, 0, 0, 0);
      
      end = new Date(start);
      end.setDate(start.getDate() + 7);
      end.setHours(23, 59, 59, 999);
      console.log("📅 Period: This Week");
    } 
    else if (period === 'month') {
      start = new Date(today.getFullYear(), today.getMonth(), 1);
      end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      end.setHours(23, 59, 59, 999);
      console.log("📅 Period: This Month");
    } 
    else if (startDate && endDate) {
      start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      
      end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      console.log("📅 Period: Custom Range");
    } else {
      // Default to current month
      start = new Date(today.getFullYear(), today.getMonth(), 1);
      end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      end.setHours(23, 59, 59, 999);
      console.log("📅 Period: Default (Current Month)");
    }
    
    console.log("📅 Date range:", { 
      start: start.toISOString(), 
      end: end.toISOString() 
    });

    // Get transactions grouped by date
    const transactions = await Transaction.aggregate([
      {
        $match: {
          transactionDate: { $gte: start, $lte: end },
          status: 'completed'
        }
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$transactionDate' } },
            type: '$type'
          },
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.date': 1 } }
    ]);

    console.log("📊 Aggregated transactions:", transactions.length, "groups found");
    
    if (transactions.length > 0) {
      console.log("Sample:", transactions[0]);
    } else {
      console.log("⚠️ No transactions found in date range");
    }

    // Prepare chart data based on period
    let chartData = [];

    if (period === 'today') {
      // Hourly data for today
      const hourlyData = {};
      
      // Initialize hours
      for (let i = 0; i <= 23; i++) {
        const hourKey = i < 10 ? `0${i}:00` : `${i}:00`;
        hourlyData[hourKey] = { revenue: 0, expense: 0 };
      }

      // Fill with actual data
      transactions.forEach(item => {
        const dateStr = item._id.date;
        const itemDate = new Date(dateStr);
        const hour = itemDate.getHours();
        const hourKey = hour < 10 ? `0${hour}:00` : `${hour}:00`;
        
        if (item._id.type === 'income') {
          hourlyData[hourKey].revenue = item.total;
        } else {
          hourlyData[hourKey].expense = item.total;
        }
      });

      // Convert to array (business hours 9 AM to 8 PM)
      for (let i = 9; i <= 20; i++) {
        const hourKey = i < 10 ? `0${i}:00` : `${i}:00`;
        const displayHour = i > 12 ? `${i-12} PM` : `${i} AM`;
        chartData.push({
          time: displayHour,
          revenue: hourlyData[hourKey].revenue || 0,
          expense: hourlyData[hourKey].expense || 0
        });
      }
    } 
    else if (period === 'week') {
      // Daily data for week
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const dailyMap = new Map();
      
      // Initialize days
      for (let i = 0; i < 7; i++) {
        const date = new Date(start);
        date.setDate(start.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];
        dailyMap.set(dateStr, { 
          day: days[date.getDay()],
          revenue: 0, 
          expense: 0 
        });
      }

      // Fill with actual data
      transactions.forEach(item => {
        const dateStr = item._id.date;
        if (dailyMap.has(dateStr)) {
          const entry = dailyMap.get(dateStr);
          if (item._id.type === 'income') {
            entry.revenue = item.total;
          } else {
            entry.expense = item.total;
          }
        }
      });

      // Convert to array
      chartData = Array.from(dailyMap.values());
    }
    else {
      // Monthly/Period data - group by week or day
      const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      console.log("📅 Days in range:", diffDays);
      
      if (diffDays <= 31) {
        // Daily data for shorter periods
        const dailyMap = new Map();
        
        // Initialize all dates in range
        for (let i = 0; i <= diffDays; i++) {
          const date = new Date(start);
          date.setDate(start.getDate() + i);
          const dateStr = date.toISOString().split('T')[0];
          dailyMap.set(dateStr, { 
            day: date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
            revenue: 0, 
            expense: 0 
          });
        }

        // Fill with actual data
        transactions.forEach(item => {
          const dateStr = item._id.date;
          if (dailyMap.has(dateStr)) {
            const entry = dailyMap.get(dateStr);
            if (item._id.type === 'income') {
              entry.revenue = item.total;
            } else {
              entry.expense = item.total;
            }
          }
        });

        chartData = Array.from(dailyMap.values());
      } else {
        // Weekly data for longer periods
        const weeks = Math.ceil(diffDays / 7);
        console.log("📅 Using weekly grouping, weeks:", weeks);
        
        const weeklyData = [];

        for (let w = 0; w < weeks; w++) {
          const weekStart = new Date(start);
          weekStart.setDate(start.getDate() + (w * 7));
          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekStart.getDate() + 6);

          let weekRevenue = 0;
          let weekExpense = 0;

          transactions.forEach(item => {
            const itemDate = new Date(item._id.date);
            if (itemDate >= weekStart && itemDate <= weekEnd) {
              if (item._id.type === 'income') {
                weekRevenue += item.total;
              } else {
                weekExpense += item.total;
              }
            }
          });

          weeklyData.push({
            day: `Week ${w + 1}`,
            revenue: weekRevenue,
            expense: weekExpense
          });
        }

        chartData = weeklyData;
      }
    }

    console.log("✅ Chart data prepared with", chartData.length, "entries");
    if (chartData.length > 0) {
      console.log("Sample:", chartData[0]);
    }

    // Calculate totals
    const totalRevenue = chartData.reduce((sum, item) => sum + (item.revenue || 0), 0);
    const totalExpense = chartData.reduce((sum, item) => sum + (item.expense || 0), 0);

    console.log("📊 Totals:", { totalRevenue, totalExpense, netProfit: totalRevenue - totalExpense });

    res.json({
      success: true,
      data: {
        chartData,
        summary: {
          totalRevenue,
          totalExpense,
          netProfit: totalRevenue - totalExpense,
          period: period || 'custom',
          dateRange: { start, end }
        }
      }
    });

  } catch (error) {
    console.error('❌ Error in getDailyRevenueStats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch daily revenue stats',
      error: error.message
    });
  }
};