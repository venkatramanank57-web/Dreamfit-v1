// // controllers/paymentController.js
// const Payment = require('../models/Payment');
// const Order = require('../models/Order');

// // @desc    Create new payment
// // @route   POST /api/payments
// // @access  Private
// exports.createPayment = async (req, res) => {
//   try {
//     const { order: orderId, amount, type, method, referenceNumber, paymentDate, paymentTime, notes } = req.body;

//     // Get order details
//     const order = await Order.findById(orderId);
//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: 'Order not found'
//       });
//     }

//     // Create payment
//     const payment = await Payment.create({
//       order: orderId,
//       customer: order.customer,
//       amount,
//       type,
//       method,
//       referenceNumber,
//       paymentDate,
//       paymentTime,
//       notes,
//       receivedBy: req.user.id,
//       store: req.user.store // From auth middleware
//     });

//     // Update order payment summary
//     await updateOrderPaymentSummary(orderId);

//     res.status(201).json({
//       success: true,
//       data: payment,
//       message: 'Payment added successfully'
//     });
//   } catch (error) {
//     res.status(400).json({
//       success: false,
//       error: error.message
//     });
//   }
// };

// // @desc    Get all payments for an order
// // @route   GET /api/payments/order/:orderId
// // @access  Private
// exports.getOrderPayments = async (req, res) => {
//   try {
//     const payments = await Payment.find({ 
//       order: req.params.orderId,
//       isDeleted: false 
//     })
//     .populate('receivedBy', 'name')
//     .sort('-paymentDate -paymentTime');

//     res.status(200).json({
//       success: true,
//       data: payments
//     });
//   } catch (error) {
//     res.status(400).json({
//       success: false,
//       error: error.message
//     });
//   }
// };

// // @desc    Get single payment
// // @route   GET /api/payments/:id
// // @access  Private
// exports.getPayment = async (req, res) => {
//   try {
//     const payment = await Payment.findOne({ 
//       _id: req.params.id,
//       isDeleted: false 
//     })
//     .populate('order')
//     .populate('customer', 'firstName lastName phone')
//     .populate('receivedBy', 'name');

//     if (!payment) {
//       return res.status(404).json({
//         success: false,
//         message: 'Payment not found'
//       });
//     }

//     res.status(200).json({
//       success: true,
//       data: payment
//     });
//   } catch (error) {
//     res.status(400).json({
//       success: false,
//       error: error.message
//     });
//   }
// };

// // @desc    Update payment
// // @route   PUT /api/payments/:id
// // @access  Private
// exports.updatePayment = async (req, res) => {
//   try {
//     const payment = await Payment.findOne({ 
//       _id: req.params.id,
//       isDeleted: false 
//     });

//     if (!payment) {
//       return res.status(404).json({
//         success: false,
//         message: 'Payment not found'
//       });
//     }

//     // Update allowed fields
//     const allowedUpdates = ['amount', 'method', 'referenceNumber', 'notes', 'type'];
//     allowedUpdates.forEach(field => {
//       if (req.body[field] !== undefined) {
//         payment[field] = req.body[field];
//       }
//     });

//     payment.updatedBy = req.user.id;
//     await payment.save();

//     // Update order summary
//     await updateOrderPaymentSummary(payment.order);

//     res.status(200).json({
//       success: true,
//       data: payment,
//       message: 'Payment updated successfully'
//     });
//   } catch (error) {
//     res.status(400).json({
//       success: false,
//       error: error.message
//     });
//   }
// };

// // @desc    Delete payment (soft delete)
// // @route   DELETE /api/payments/:id
// // @access  Private
// exports.deletePayment = async (req, res) => {
//   try {
//     const payment = await Payment.findOne({ 
//       _id: req.params.id,
//       isDeleted: false 
//     });

//     if (!payment) {
//       return res.status(404).json({
//         success: false,
//         message: 'Payment not found'
//       });
//     }

//     // Soft delete
//     payment.isDeleted = true;
//     payment.deletedAt = new Date();
//     payment.deletedBy = req.user.id;
//     await payment.save();

//     // Update order summary
//     await updateOrderPaymentSummary(payment.order);

//     res.status(200).json({
//       success: true,
//       message: 'Payment deleted successfully'
//     });
//   } catch (error) {
//     res.status(400).json({
//       success: false,
//       error: error.message
//     });
//   }
// };

// // @desc    Get payment statistics for dashboard
// // @route   GET /api/payments/stats
// // @access  Private
// exports.getPaymentStats = async (req, res) => {
//   try {
//     const { startDate, endDate } = req.query;
    
//     const match = { 
//       store: req.user.store,
//       isDeleted: false 
//     };

//     if (startDate || endDate) {
//       match.paymentDate = {};
//       if (startDate) match.paymentDate.$gte = new Date(startDate);
//       if (endDate) match.paymentDate.$lte = new Date(endDate);
//     }

//     // Today's payments
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//     const tomorrow = new Date(today);
//     tomorrow.setDate(tomorrow.getDate() + 1);

//     const todayPayments = await Payment.aggregate([
//       {
//         $match: {
//           ...match,
//           paymentDate: { $gte: today, $lt: tomorrow }
//         }
//       },
//       {
//         $group: {
//           _id: null,
//           total: { $sum: '$amount' },
//           count: { $sum: 1 }
//         }
//       }
//     ]);

//     // Payments by method
//     const byMethod = await Payment.aggregate([
//       { $match: match },
//       {
//         $group: {
//           _id: '$method',
//           total: { $sum: '$amount' },
//           count: { $sum: 1 }
//         }
//       }
//     ]);

//     // Payments by type
//     const byType = await Payment.aggregate([
//       { $match: match },
//       {
//         $group: {
//           _id: '$type',
//           total: { $sum: '$amount' },
//           count: { $sum: 1 }
//         }
//       }
//     ]);

//     // Total collections
//     const totalStats = await Payment.aggregate([
//       { $match: match },
//       {
//         $group: {
//           _id: null,
//           totalAmount: { $sum: '$amount' },
//           averageAmount: { $avg: '$amount' },
//           totalCount: { $sum: 1 },
//           maxAmount: { $max: '$amount' },
//           minAmount: { $min: '$amount' }
//         }
//       }
//     ]);

//     res.status(200).json({
//       success: true,
//       data: {
//         today: todayPayments[0] || { total: 0, count: 0 },
//         byMethod,
//         byType,
//         summary: totalStats[0] || { totalAmount: 0, totalCount: 0 }
//       }
//     });
//   } catch (error) {
//     res.status(400).json({
//       success: false,
//       error: error.message
//     });
//   }
// };

// // Helper function to update order payment summary
// async function updateOrderPaymentSummary(orderId) {
//   const Order = mongoose.model('Order');
//   const Payment = mongoose.model('Payment');
  
//   // Get order details
//   const order = await Order.findById(orderId);
//   if (!order) return;

//   // Get all completed payments (excluding refunds)
//   const payments = await Payment.find({ 
//     order: orderId, 
//     isDeleted: false,
//     type: { $in: ['advance', 'full', 'partial', 'extra'] }
//   });

//   // Calculate totals
//   const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
//   const lastPayment = payments.sort((a, b) => 
//     new Date(b.paymentDate) - new Date(a.paymentDate)
//   )[0];

//   // Determine payment status
//   let paymentStatus = 'pending';
//   if (totalPaid >= order.totalAmount) {
//     paymentStatus = totalPaid > order.totalAmount ? 'overpaid' : 'paid';
//   } else if (totalPaid > 0) {
//     paymentStatus = 'partial';
//   }

//   // Update order
//   await Order.findByIdAndUpdate(orderId, {
//     'paymentSummary': {
//       totalPaid,
//       lastPaymentDate: lastPayment?.paymentDate,
//       lastPaymentAmount: lastPayment?.amount,
//       paymentCount: payments.length,
//       paymentStatus
//     },
//     balanceAmount: order.totalAmount - totalPaid
//   });
// }










// // controllers/paymentController.js
// const mongoose = require('mongoose');
// const Payment = require('../models/Payment');

// // ============================================
// // 🔧 HELPER FUNCTION - Get Order model correctly
// // ============================================
// const getOrderModel = () => {
//   try {
//     const OrderImport = require('../models/Order');
//     // Handle both ES Module and CommonJS exports
//     const Order = OrderImport.default || OrderImport;
    
//     console.log("📦 Order model loaded:", {
//       exists: !!Order,
//       type: typeof Order,
//       hasFindById: typeof Order?.findById === 'function'
//     });
    
//     return Order;
//   } catch (error) {
//     console.error("❌ Failed to load Order model:", error.message);
//     throw error;
//   }
// };

// // ============================================
// // 🔍 DEBUG FUNCTION - Optional, can remove later
// // ============================================
// const debugOrderModel = () => {
//   console.log("\n🔍🔍🔍 DEBUGGING ORDER MODEL 🔍🔍🔍");
  
//   try {
//     const Order = getOrderModel();
    
//     console.log("2. Order properties:");
//     console.log("   - Keys:", Object.keys(Order));
//     console.log("   - Has findById:", typeof Order.findById === 'function');
//     console.log("   - Has findOne:", typeof Order.findOne === 'function');
//     console.log("   - Has findByIdAndUpdate:", typeof Order.findByIdAndUpdate === 'function');
    
//     if (Order.modelName) {
//       console.log("3. Mongoose model info:");
//       console.log("   - modelName:", Order.modelName);
//       console.log("   - collection:", Order.collection?.name);
//     }
    
//   } catch (error) {
//     console.log("❌ ERROR in debugOrderModel:", error.message);
//   }
  
//   console.log("🔍🔍🔍 DEBUG COMPLETE 🔍🔍🔍\n");
// };

// // Run debug on server start
// debugOrderModel();

// // ============================================
// // 💰 CREATE PAYMENT
// // ============================================
// exports.createPayment = async (req, res) => {
//   try {
//     const { order: orderId, amount, type, method, referenceNumber, paymentDate, paymentTime, notes } = req.body;

//     console.log("\n🔥🔥🔥 CREATE PAYMENT CALLED 🔥🔥🔥");
//     console.log("📦 Request body:", req.body);
    
//     // Validate required fields
//     if (!orderId) {
//       return res.status(400).json({
//         success: false,
//         message: 'Order ID is required'
//       });
//     }

//     if (!amount || amount <= 0) {
//       return res.status(400).json({
//         success: false,
//         message: 'Valid amount is required'
//       });
//     }

//     // Validate orderId format
//     if (!mongoose.Types.ObjectId.isValid(orderId)) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid order ID format'
//       });
//     }

//     // Get Order model
//     const Order = getOrderModel();

//     // Verify Order model is working
//     if (typeof Order.findById !== 'function') {
//       console.error("❌ Order model not properly initialized");
//       return res.status(500).json({
//         success: false,
//         message: 'Server configuration error'
//       });
//     }

//     // Find the order
//     console.log("🔍 Finding order with ID:", orderId);
//     const order = await Order.findById(orderId);
    
//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: 'Order not found'
//       });
//     }

//     console.log("✅ Order found:", order._id);

//     // Create payment
//     const payment = await Payment.create({
//       order: orderId,
//       customer: order.customer,
//       amount: Number(amount),
//       type: type || 'advance',
//       method: method || 'cash',
//       referenceNumber: referenceNumber || '',
//       paymentDate: paymentDate || new Date(),
//       paymentTime: paymentTime || new Date().toLocaleTimeString('en-US', { hour12: false }),
//       notes: notes || '',
//       receivedBy: req.user?.id || req.user?._id,
//       store: req.user?.store
//     });

//     console.log("💰 Payment created:", payment._id);

//     // Update order payment summary
//     await updateOrderPaymentSummary(orderId);

//     res.status(201).json({
//       success: true,
//       data: payment,
//       message: 'Payment added successfully'
//     });

//   } catch (error) {
//     console.error("❌ Error creating payment:", error);
//     res.status(400).json({
//       success: false,
//       error: error.message
//     });
//   }
// };

// // ============================================
// // 📋 GET ORDER PAYMENTS
// // ============================================
// exports.getOrderPayments = async (req, res) => {
//   try {
//     const { orderId } = req.params;
    
//     if (!mongoose.Types.ObjectId.isValid(orderId)) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid order ID format'
//       });
//     }

//     const payments = await Payment.find({ 
//       order: orderId,
//       isDeleted: false 
//     })
//     .populate('receivedBy', 'name email')
//     .sort('-paymentDate -paymentTime');

//     res.status(200).json({
//       success: true,
//       data: payments
//     });
//   } catch (error) {
//     console.error("❌ Error fetching payments:", error);
//     res.status(400).json({
//       success: false,
//       error: error.message
//     });
//   }
// };

// // ============================================
// // 🔍 GET SINGLE PAYMENT
// // ============================================
// exports.getPayment = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid payment ID format'
//       });
//     }

//     const payment = await Payment.findOne({ 
//       _id: id,
//       isDeleted: false 
//     })
//     .populate('order')
//     .populate('customer', 'firstName lastName phone')
//     .populate('receivedBy', 'name email');

//     if (!payment) {
//       return res.status(404).json({
//         success: false,
//         message: 'Payment not found'
//       });
//     }

//     res.status(200).json({
//       success: true,
//       data: payment
//     });
//   } catch (error) {
//     console.error("❌ Error fetching payment:", error);
//     res.status(400).json({
//       success: false,
//       error: error.message
//     });
//   }
// };

// // ============================================
// // ✏️ UPDATE PAYMENT
// // ============================================
// exports.updatePayment = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid payment ID format'
//       });
//     }

//     const payment = await Payment.findOne({ 
//       _id: id,
//       isDeleted: false 
//     });

//     if (!payment) {
//       return res.status(404).json({
//         success: false,
//         message: 'Payment not found'
//       });
//     }

//     // Update allowed fields
//     const allowedUpdates = ['amount', 'method', 'referenceNumber', 'notes', 'type', 'paymentDate', 'paymentTime'];
//     allowedUpdates.forEach(field => {
//       if (req.body[field] !== undefined) {
//         payment[field] = req.body[field];
//       }
//     });

//     payment.updatedBy = req.user?.id || req.user?._id;
//     await payment.save();

//     // Update order summary
//     await updateOrderPaymentSummary(payment.order);

//     res.status(200).json({
//       success: true,
//       data: payment,
//       message: 'Payment updated successfully'
//     });
//   } catch (error) {
//     console.error("❌ Error updating payment:", error);
//     res.status(400).json({
//       success: false,
//       error: error.message
//     });
//   }
// };

// // ============================================
// // 🗑️ DELETE PAYMENT (Soft Delete)
// // ============================================
// exports.deletePayment = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid payment ID format'
//       });
//     }

//     const payment = await Payment.findOne({ 
//       _id: id,
//       isDeleted: false 
//     });

//     if (!payment) {
//       return res.status(404).json({
//         success: false,
//         message: 'Payment not found'
//       });
//     }

//     // Soft delete
//     payment.isDeleted = true;
//     payment.deletedAt = new Date();
//     payment.deletedBy = req.user?.id || req.user?._id;
//     await payment.save();

//     // Update order summary
//     await updateOrderPaymentSummary(payment.order);

//     res.status(200).json({
//       success: true,
//       message: 'Payment deleted successfully'
//     });
//   } catch (error) {
//     console.error("❌ Error deleting payment:", error);
//     res.status(400).json({
//       success: false,
//       error: error.message
//     });
//   }
// };

// // ============================================
// // 📊 GET PAYMENT STATISTICS
// // ============================================
// exports.getPaymentStats = async (req, res) => {
//   try {
//     const { startDate, endDate } = req.query;
    
//     const match = { 
//       store: req.user?.store,
//       isDeleted: false 
//     };

//     if (startDate || endDate) {
//       match.paymentDate = {};
//       if (startDate) match.paymentDate.$gte = new Date(startDate);
//       if (endDate) match.paymentDate.$lte = new Date(endDate);
//     }

//     // Today's payments
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//     const tomorrow = new Date(today);
//     tomorrow.setDate(tomorrow.getDate() + 1);

//     const todayPayments = await Payment.aggregate([
//       {
//         $match: {
//           ...match,
//           paymentDate: { $gte: today, $lt: tomorrow }
//         }
//       },
//       {
//         $group: {
//           _id: null,
//           total: { $sum: '$amount' },
//           count: { $sum: 1 }
//         }
//       }
//     ]);

//     // Payments by method
//     const byMethod = await Payment.aggregate([
//       { $match: match },
//       {
//         $group: {
//           _id: '$method',
//           total: { $sum: '$amount' },
//           count: { $sum: 1 }
//         }
//       }
//     ]);

//     // Payments by type
//     const byType = await Payment.aggregate([
//       { $match: match },
//       {
//         $group: {
//           _id: '$type',
//           total: { $sum: '$amount' },
//           count: { $sum: 1 }
//         }
//       }
//     ]);

//     // Total collections
//     const totalStats = await Payment.aggregate([
//       { $match: match },
//       {
//         $group: {
//           _id: null,
//           totalAmount: { $sum: '$amount' },
//           averageAmount: { $avg: '$amount' },
//           totalCount: { $sum: 1 },
//           maxAmount: { $max: '$amount' },
//           minAmount: { $min: '$amount' }
//         }
//       }
//     ]);

//     res.status(200).json({
//       success: true,
//       data: {
//         today: todayPayments[0] || { total: 0, count: 0 },
//         byMethod,
//         byType,
//         summary: totalStats[0] || { totalAmount: 0, totalCount: 0, averageAmount: 0 }
//       }
//     });
//   } catch (error) {
//     console.error("❌ Error fetching payment stats:", error);
//     res.status(400).json({
//       success: false,
//       error: error.message
//     });
//   }
// };

// // ============================================
// // 🔄 HELPER FUNCTION - Update Order Payment Summary
// // ============================================
// async function updateOrderPaymentSummary(orderId) {
//   try {
//     // Get Order model using helper
//     const Order = getOrderModel();
//     const Payment = require('../models/Payment');
    
//     console.log("📊 Updating payment summary for order:", orderId);

//     // Get order details
//     const order = await Order.findById(orderId);
//     if (!order) {
//       console.log("⚠️ Order not found for payment summary update:", orderId);
//       return;
//     }

//     // Get all completed payments
//     const payments = await Payment.find({ 
//       order: orderId, 
//       isDeleted: false,
//       type: { $in: ['advance', 'full', 'partial', 'extra'] }
//     });

//     // Calculate totals
//     const totalPaid = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
//     const lastPayment = payments.sort((a, b) => 
//       new Date(b.paymentDate || 0) - new Date(a.paymentDate || 0)
//     )[0];

//     // Get order total amount
//     const totalAmount = order.priceSummary?.totalMax || order.totalAmount || 0;

//     // Determine payment status
//     let paymentStatus = 'pending';
//     if (totalPaid >= totalAmount) {
//       paymentStatus = totalPaid > totalAmount ? 'overpaid' : 'paid';
//     } else if (totalPaid > 0) {
//       paymentStatus = 'partial';
//     }

//     // Update order
//     await Order.findByIdAndUpdate(orderId, {
//       'paymentSummary': {
//         totalPaid,
//         lastPaymentDate: lastPayment?.paymentDate,
//         lastPaymentAmount: lastPayment?.amount,
//         paymentCount: payments.length,
//         paymentStatus
//       },
//       balanceAmount: totalAmount - totalPaid
//     });

//     console.log("✅ Order payment summary updated successfully");
    
//   } catch (error) {
//     console.error("❌ Error updating order payment summary:", error);
//     throw error;
//   }
// }






// // controllers/paymentController.js
// const mongoose = require('mongoose');
// const Payment = require('../models/Payment');

// // ============================================
// // 🔧 HELPER FUNCTION - Get Order model correctly
// // ============================================
// const getOrderModel = () => {
//   try {
//     const OrderImport = require('../models/Order');
//     // Handle both ES Module and CommonJS exports
//     const Order = OrderImport.default || OrderImport;
    
//     console.log("📦 Order model loaded:", {
//       exists: !!Order,
//       type: typeof Order,
//       hasFindById: typeof Order?.findById === 'function'
//     });
    
//     return Order;
//   } catch (error) {
//     console.error("❌ Failed to load Order model:", error.message);
//     throw error;
//   }
// };

// // ============================================
// // 🔧 HELPER FUNCTION - Map payment type to income category
// // ============================================
// const mapPaymentTypeToCategory = (type) => {
//   const categoryMap = {
//     'advance': 'customer-advance',
//     'full': 'full-payment',
//     'final-settlement': 'full-payment',
//     'extra': 'fabric-sale',
//     'partial': 'part-payment',
//     'part-payment': 'part-payment'
//   };
  
//   const category = categoryMap[type] || 'customer-advance';
//   console.log(`🔄 Payment type: ${type} → Category: ${category}`);
//   return category;
// };

// // ============================================
// // 🔧 HELPER FUNCTION - Create income transaction from payment
// // ============================================
// const createIncomeFromPayment = async (payment, order, userId) => {
//   try {
//     console.log(`💰 Creating income transaction for payment: ${payment._id}`);
    
//     // Import Transaction model
//     const Transaction = require('../models/Transaction');
    
//     // Determine account type based on payment method
//     const accountType = payment.method === 'cash' ? 'hand-cash' : 'bank';
    
//     // Map payment type to income category
//     const category = mapPaymentTypeToCategory(payment.type);
    
//     // Get customer details
//     const Customer = require('../models/Customer');
//     const customer = await Customer.findById(payment.customer);
    
//     // Create income transaction
//     const transaction = await Transaction.create({
//       type: 'income',
//       category: category,
//       amount: payment.amount,
//       paymentMethod: payment.method,
//       accountType: accountType,
//       customer: payment.customer,
//       customerDetails: customer ? {
//         name: customer.name || `${customer.firstName || ''} ${customer.lastName || ''}`.trim(),
//         phone: customer.phone,
//         id: customer.customerId || customer._id
//       } : null,
//       order: payment.order,
//       description: `Payment for Order - ${payment.type} - ₹${payment.amount} ${payment.notes ? `- ${payment.notes}` : ''}`,
//       transactionDate: payment.paymentDate || new Date(),
//       referenceNumber: payment.referenceNumber || '',
//       createdBy: userId,
//       status: 'completed',
//       metadata: {
//         paymentId: payment._id,
//         paymentType: payment.type,
//         paymentMethod: payment.method
//       }
//     });
    
//     console.log(`✅ Income transaction created: ${transaction._id} (${category})`);
//     return transaction;
    
//   } catch (error) {
//     console.error("❌ Failed to create income transaction:", error);
//     // Don't throw - payment already created, just log error
//     return null;
//   }
// };

// // ============================================
// // 🔧 HELPER FUNCTION - Update income transaction from payment
// // ============================================
// const updateIncomeFromPayment = async (payment, userId) => {
//   try {
//     console.log(`🔄 Updating income transaction for payment: ${payment._id}`);
    
//     // Import Transaction model
//     const Transaction = require('../models/Transaction');
    
//     // Determine account type based on payment method
//     const accountType = payment.method === 'cash' ? 'hand-cash' : 'bank';
    
//     // Map payment type to income category
//     const category = mapPaymentTypeToCategory(payment.type);
    
//     // Find and update transaction for this payment
//     const transaction = await Transaction.findOneAndUpdate(
//       { 'metadata.paymentId': payment._id },
//       {
//         amount: payment.amount,
//         category: category,
//         paymentMethod: payment.method,
//         accountType: accountType,
//         referenceNumber: payment.referenceNumber || '',
//         description: `Payment for Order - ${payment.type} - ₹${payment.amount} ${payment.notes ? `- ${payment.notes}` : ''}`,
//         transactionDate: payment.paymentDate || new Date(),
//         updatedBy: userId,
//         'metadata.paymentType': payment.type,
//         'metadata.paymentMethod': payment.method
//       },
//       { new: true }
//     );
    
//     if (transaction) {
//       console.log(`✅ Income transaction updated: ${transaction._id}`);
//     } else {
//       console.log(`⚠️ No transaction found for payment ${payment._id}, creating new one...`);
//       // If no transaction exists, create one
//       const Order = getOrderModel();
//       const order = await Order.findById(payment.order);
//       await createIncomeFromPayment(payment, order, userId);
//     }
    
//     return transaction;
    
//   } catch (error) {
//     console.error("❌ Failed to update income transaction:", error);
//     return null;
//   }
// };

// // ============================================
// // 🔧 HELPER FUNCTION - Delete income transaction
// // ============================================
// const deleteIncomeFromPayment = async (paymentId) => {
//   try {
//     console.log(`🗑️ Deleting income transaction for payment: ${paymentId}`);
    
//     // Import Transaction model
//     const Transaction = require('../models/Transaction');
    
//     // Soft delete the transaction
//     const result = await Transaction.findOneAndUpdate(
//       { 'metadata.paymentId': paymentId },
//       { status: 'cancelled', isDeleted: true },
//       { new: true }
//     );
    
//     if (result) {
//       console.log(`✅ Income transaction deleted: ${result._id}`);
//     } else {
//       console.log(`⚠️ No transaction found for payment ${paymentId}`);
//     }
    
//     return result;
    
//   } catch (error) {
//     console.error("❌ Failed to delete income transaction:", error);
//     return null;
//   }
// };

// // ============================================
// // 🔍 DEBUG FUNCTION - Optional, can remove later
// // ============================================
// const debugOrderModel = () => {
//   console.log("\n🔍🔍🔍 DEBUGGING ORDER MODEL 🔍🔍🔍");
  
//   try {
//     const Order = getOrderModel();
    
//     console.log("2. Order properties:");
//     console.log("   - Keys:", Object.keys(Order));
//     console.log("   - Has findById:", typeof Order.findById === 'function');
//     console.log("   - Has findOne:", typeof Order.findOne === 'function');
//     console.log("   - Has findByIdAndUpdate:", typeof Order.findByIdAndUpdate === 'function');
    
//     if (Order.modelName) {
//       console.log("3. Mongoose model info:");
//       console.log("   - modelName:", Order.modelName);
//       console.log("   - collection:", Order.collection?.name);
//     }
    
//   } catch (error) {
//     console.log("❌ ERROR in debugOrderModel:", error.message);
//   }
  
//   console.log("🔍🔍🔍 DEBUG COMPLETE 🔍🔍🔍\n");
// };

// // Run debug on server start
// debugOrderModel();

// // ============================================
// // 💰 CREATE PAYMENT
// // ============================================
// exports.createPayment = async (req, res) => {
//   try {
//     const { order: orderId, amount, type, method, referenceNumber, paymentDate, paymentTime, notes } = req.body;

//     console.log("\n🔥🔥🔥 CREATE PAYMENT CALLED 🔥🔥🔥");
//     console.log("📦 Request body:", req.body);
    
//     // Validate required fields
//     if (!orderId) {
//       return res.status(400).json({
//         success: false,
//         message: 'Order ID is required'
//       });
//     }

//     if (!amount || amount <= 0) {
//       return res.status(400).json({
//         success: false,
//         message: 'Valid amount is required'
//       });
//     }

//     // Validate orderId format
//     if (!mongoose.Types.ObjectId.isValid(orderId)) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid order ID format'
//       });
//     }

//     // Get Order model
//     const Order = getOrderModel();

//     // Verify Order model is working
//     if (typeof Order.findById !== 'function') {
//       console.error("❌ Order model not properly initialized");
//       return res.status(500).json({
//         success: false,
//         message: 'Server configuration error'
//       });
//     }

//     // Find the order
//     console.log("🔍 Finding order with ID:", orderId);
//     const order = await Order.findById(orderId);
    
//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: 'Order not found'
//       });
//     }

//     console.log("✅ Order found:", order._id);
//     console.log("👤 Customer ID:", order.customer);

//     // Get user ID from request
//     const userId = req.user?.id || req.user?._id;

//     // Create payment
//     const payment = await Payment.create({
//       order: orderId,
//       customer: order.customer,
//       amount: Number(amount),
//       type: type || 'advance',
//       method: method || 'cash',
//       referenceNumber: referenceNumber || '',
//       paymentDate: paymentDate || new Date(),
//       paymentTime: paymentTime || new Date().toLocaleTimeString('en-US', { hour12: false }),
//       notes: notes || '',
//       receivedBy: userId,
//       store: req.user?.store
//     });

//     console.log("💰 Payment created:", payment._id);
//     console.log("💰 Payment type:", payment.type);
//     console.log("💰 Payment amount:", payment.amount);

//     // 🔥 FIX: Create income transaction for ALL payment types
//     await createIncomeFromPayment(payment, order, userId);

//     // Update order payment summary
//     await updateOrderPaymentSummary(orderId);

//     res.status(201).json({
//       success: true,
//       data: payment,
//       message: 'Payment added successfully'
//     });

//   } catch (error) {
//     console.error("❌ Error creating payment:", error);
//     res.status(400).json({
//       success: false,
//       error: error.message
//     });
//   }
// };

// // ============================================
// // 📋 GET ORDER PAYMENTS
// // ============================================
// exports.getOrderPayments = async (req, res) => {
//   try {
//     const { orderId } = req.params;
    
//     if (!mongoose.Types.ObjectId.isValid(orderId)) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid order ID format'
//       });
//     }

//     const payments = await Payment.find({ 
//       order: orderId,
//       isDeleted: false 
//     })
//     .populate('receivedBy', 'name email')
//     .sort('-paymentDate -paymentTime');

//     res.status(200).json({
//       success: true,
//       data: payments
//     });
//   } catch (error) {
//     console.error("❌ Error fetching payments:", error);
//     res.status(400).json({
//       success: false,
//       error: error.message
//     });
//   }
// };

// // ============================================
// // 🔍 GET SINGLE PAYMENT
// // ============================================
// exports.getPayment = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid payment ID format'
//       });
//     }

//     const payment = await Payment.findOne({ 
//       _id: id,
//       isDeleted: false 
//     })
//     .populate('order')
//     .populate('customer', 'firstName lastName phone')
//     .populate('receivedBy', 'name email');

//     if (!payment) {
//       return res.status(404).json({
//         success: false,
//         message: 'Payment not found'
//       });
//     }

//     res.status(200).json({
//       success: true,
//       data: payment
//     });
//   } catch (error) {
//     console.error("❌ Error fetching payment:", error);
//     res.status(400).json({
//       success: false,
//       error: error.message
//     });
//   }
// };

// // ============================================
// // ✏️ UPDATE PAYMENT
// // ============================================
// exports.updatePayment = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid payment ID format'
//       });
//     }

//     const payment = await Payment.findOne({ 
//       _id: id,
//       isDeleted: false 
//     });

//     if (!payment) {
//       return res.status(404).json({
//         success: false,
//         message: 'Payment not found'
//       });
//     }

//     console.log("✏️ Updating payment:", payment._id);
//     console.log("Old type:", payment.type, "New type:", req.body.type);
//     console.log("Old amount:", payment.amount, "New amount:", req.body.amount);

//     // Update allowed fields
//     const allowedUpdates = ['amount', 'method', 'referenceNumber', 'notes', 'type', 'paymentDate', 'paymentTime'];
//     allowedUpdates.forEach(field => {
//       if (req.body[field] !== undefined) {
//         payment[field] = req.body[field];
//       }
//     });

//     const userId = req.user?.id || req.user?._id;
//     payment.updatedBy = userId;
//     await payment.save();

//     console.log("✅ Payment updated successfully");

//     // 🔥 FIX: Update corresponding income transaction
//     await updateIncomeFromPayment(payment, userId);

//     // Update order summary
//     await updateOrderPaymentSummary(payment.order);

//     res.status(200).json({
//       success: true,
//       data: payment,
//       message: 'Payment updated successfully'
//     });
//   } catch (error) {
//     console.error("❌ Error updating payment:", error);
//     res.status(400).json({
//       success: false,
//       error: error.message
//     });
//   }
// };

// // ============================================
// // 🗑️ DELETE PAYMENT (Soft Delete)
// // ============================================
// exports.deletePayment = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid payment ID format'
//       });
//     }

//     const payment = await Payment.findOne({ 
//       _id: id,
//       isDeleted: false 
//     });

//     if (!payment) {
//       return res.status(404).json({
//         success: false,
//         message: 'Payment not found'
//       });
//     }

//     console.log("🗑️ Deleting payment:", payment._id);

//     // Soft delete
//     payment.isDeleted = true;
//     payment.deletedAt = new Date();
//     payment.deletedBy = req.user?.id || req.user?._id;
//     await payment.save();

//     console.log("✅ Payment soft deleted");

//     // 🔥 FIX: Delete corresponding income transaction
//     await deleteIncomeFromPayment(payment._id);

//     // Update order summary
//     await updateOrderPaymentSummary(payment.order);

//     res.status(200).json({
//       success: true,
//       message: 'Payment deleted successfully'
//     });
//   } catch (error) {
//     console.error("❌ Error deleting payment:", error);
//     res.status(400).json({
//       success: false,
//       error: error.message
//     });
//   }
// };

// // ============================================
// // 📊 GET PAYMENT STATISTICS
// // ============================================
// exports.getPaymentStats = async (req, res) => {
//   try {
//     const { startDate, endDate } = req.query;
    
//     const match = { 
//       store: req.user?.store,
//       isDeleted: false 
//     };

//     if (startDate || endDate) {
//       match.paymentDate = {};
//       if (startDate) match.paymentDate.$gte = new Date(startDate);
//       if (endDate) match.paymentDate.$lte = new Date(endDate);
//     }

//     // Today's payments
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//     const tomorrow = new Date(today);
//     tomorrow.setDate(tomorrow.getDate() + 1);

//     const todayPayments = await Payment.aggregate([
//       {
//         $match: {
//           ...match,
//           paymentDate: { $gte: today, $lt: tomorrow }
//         }
//       },
//       {
//         $group: {
//           _id: null,
//           total: { $sum: '$amount' },
//           count: { $sum: 1 }
//         }
//       }
//     ]);

//     // Payments by method
//     const byMethod = await Payment.aggregate([
//       { $match: match },
//       {
//         $group: {
//           _id: '$method',
//           total: { $sum: '$amount' },
//           count: { $sum: 1 }
//         }
//       }
//     ]);

//     // Payments by type
//     const byType = await Payment.aggregate([
//       { $match: match },
//       {
//         $group: {
//           _id: '$type',
//           total: { $sum: '$amount' },
//           count: { $sum: 1 }
//         }
//       }
//     ]);

//     // Total collections
//     const totalStats = await Payment.aggregate([
//       { $match: match },
//       {
//         $group: {
//           _id: null,
//           totalAmount: { $sum: '$amount' },
//           averageAmount: { $avg: '$amount' },
//           totalCount: { $sum: 1 },
//           maxAmount: { $max: '$amount' },
//           minAmount: { $min: '$amount' }
//         }
//       }
//     ]);

//     res.status(200).json({
//       success: true,
//       data: {
//         today: todayPayments[0] || { total: 0, count: 0 },
//         byMethod,
//         byType,
//         summary: totalStats[0] || { totalAmount: 0, totalCount: 0, averageAmount: 0 }
//       }
//     });
//   } catch (error) {
//     console.error("❌ Error fetching payment stats:", error);
//     res.status(400).json({
//       success: false,
//       error: error.message
//     });
//   }
// };

// // ============================================
// // 🔄 HELPER FUNCTION - Update Order Payment Summary
// // ============================================
// async function updateOrderPaymentSummary(orderId) {
//   try {
//     // Get Order model using helper
//     const Order = getOrderModel();
//     const Payment = require('../models/Payment');
    
//     console.log("📊 Updating payment summary for order:", orderId);

//     // Get order details
//     const order = await Order.findById(orderId);
//     if (!order) {
//       console.log("⚠️ Order not found for payment summary update:", orderId);
//       return;
//     }

//     // Get all completed payments
//     const payments = await Payment.find({ 
//       order: orderId, 
//       isDeleted: false,
//       type: { $in: ['advance', 'full', 'partial', 'extra'] }
//     });

//     // Calculate totals
//     const totalPaid = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
//     const lastPayment = payments.sort((a, b) => 
//       new Date(b.paymentDate || 0) - new Date(a.paymentDate || 0)
//     )[0];

//     // Get order total amount
//     const totalAmount = order.priceSummary?.totalMax || order.totalAmount || 0;

//     // Determine payment status
//     let paymentStatus = 'pending';
//     if (totalPaid >= totalAmount) {
//       paymentStatus = totalPaid > totalAmount ? 'overpaid' : 'paid';
//     } else if (totalPaid > 0) {
//       paymentStatus = 'partial';
//     }

//     // Update order
//     await Order.findByIdAndUpdate(orderId, {
//       'paymentSummary': {
//         totalPaid,
//         lastPaymentDate: lastPayment?.paymentDate,
//         lastPaymentAmount: lastPayment?.amount,
//         paymentCount: payments.length,
//         paymentStatus
//       },
//       balanceAmount: totalAmount - totalPaid
//     });

//     console.log("✅ Order payment summary updated successfully");
//     console.log(`   Total Paid: ₹${totalPaid}, Status: ${paymentStatus}`);
    
//   } catch (error) {
//     console.error("❌ Error updating order payment summary:", error);
//     throw error;
//   }
// }



// // controllers/paymentController.js
// const mongoose = require('mongoose');
// const Payment = require('../models/Payment');
// const Customer = require('../models/Customer');

// // ============================================
// // 🔧 HELPER FUNCTION - Get Order model correctly
// // ============================================
// const getOrderModel = () => {
//   try {
//     const OrderImport = require('../models/Order');
//     // Handle both ES Module and CommonJS exports
//     const Order = OrderImport.default || OrderImport;
    
//     console.log("📦 Order model loaded:", {
//       exists: !!Order,
//       type: typeof Order,
//       hasFindById: typeof Order?.findById === 'function'
//     });
    
//     return Order;
//   } catch (error) {
//     console.error("❌ Failed to load Order model:", error.message);
//     throw error;
//   }
// };

// // ============================================
// // 🔧 HELPER FUNCTION - Map payment type to income category
// // ============================================
// const mapPaymentTypeToCategory = (type) => {
//   console.log(`🔄 mapPaymentTypeToCategory called with type: ${type}`);
  
//   const categoryMap = {
//     'advance': 'customer-advance',
//     'full': 'full-payment',
//     'final-settlement': 'full-payment',
//     'extra': 'fabric-sale',
//     'partial': 'part-payment',
//     'part-payment': 'part-payment'
//   };
  
//   const category = categoryMap[type] || 'customer-advance';
//   console.log(`🔄 Payment type: ${type} → Category: ${category}`);
//   return category;
// };

// // ============================================
// // 🔧 HELPER FUNCTION - Create income transaction from payment
// // ============================================
// const createIncomeFromPayment = async (payment, order, userId) => {
//   console.log("\n🔴🔴🔴 CREATE INCOME FROM PAYMENT STARTED 🔴🔴🔴");
//   console.log("📦 Payment ID:", payment._id);
//   console.log("📦 Payment type:", payment.type);
//   console.log("📦 Payment amount:", payment.amount);
//   console.log("📦 Payment method:", payment.method);
//   console.log("📦 Payment date:", payment.paymentDate);
//   console.log("📦 Payment time:", payment.paymentTime);
//   console.log("📦 Order ID:", payment.order);
//   console.log("📦 Customer ID:", payment.customer);
//   console.log("📦 User ID:", userId);
  
//   try {
//     console.log("📦 Importing Transaction model...");
//     // Import Transaction model
//     const Transaction = require('../models/Transaction');
//     console.log("✅ Transaction model imported");
    
//     // Determine account type based on payment method
//     const accountType = payment.method === 'cash' ? 'hand-cash' : 'bank';
//     console.log(`💰 Account type: ${accountType}`);
    
//     // Map payment type to income category
//     const category = mapPaymentTypeToCategory(payment.type);
//     console.log(`💰 Mapped category: ${category}`);
    
//     // Get customer details
//     console.log("📦 Importing Customer model...");
//     const Customer = require('../models/Customer');
//     console.log("✅ Customer model imported");
    
//     console.log(`🔍 Finding customer with ID: ${payment.customer}`);
//     const customer = await Customer.findById(payment.customer);
    
//     if (customer) {
//       console.log(`✅ Customer found: ${customer.name || customer.firstName || 'Unknown'}`);
//     } else {
//       console.log(`⚠️ Customer not found with ID: ${payment.customer}`);
//     }
    
//     const customerDetails = customer ? {
//       name: customer.name || `${customer.firstName || ''} ${customer.lastName || ''}`.trim() || 'Unknown',
//       phone: customer.phone,
//       id: customer.customerId || customer._id
//     } : null;
    
//     console.log(`📊 Customer details:`, customerDetails);
    
//     // Check if transaction already exists for this payment
//     console.log(`🔍 Checking if transaction already exists for payment ${payment._id}...`);
//     const existingTransaction = await Transaction.findOne({ 'metadata.paymentId': payment._id });
    
//     if (existingTransaction) {
//       console.log(`⚠️ Transaction already exists for payment ${payment._id}: ${existingTransaction._id}`);
//       console.log("🔴🔴🔴 CREATE INCOME FROM PAYMENT COMPLETED (EXISTING) 🔴🔴🔴\n");
//       return existingTransaction;
//     }
    
//     console.log("✅ No existing transaction found, creating new one...");
    
//     // Prepare transaction data
//     const transactionData = {
//       type: 'income',
//       category: category,
//       amount: payment.amount,
//       paymentMethod: payment.method,
//       accountType: accountType,
//       customer: payment.customer,
//       customerDetails: customerDetails,
//       order: payment.order,
//       description: `Payment for Order - ${payment.type} - ₹${payment.amount} ${payment.notes ? `- ${payment.notes}` : ''}`,
//       transactionDate: payment.paymentDate || new Date(),
//       referenceNumber: payment.referenceNumber || '',
//       createdBy: userId,
//       status: 'completed',
//       metadata: {
//         paymentId: payment._id,
//         paymentType: payment.type,
//         paymentMethod: payment.method
//       }
//     };
    
//     console.log("📦 Transaction data prepared:", JSON.stringify(transactionData, null, 2));
    
//     // Create income transaction
//     console.log("💾 Saving transaction to database...");
//     const transaction = await Transaction.create(transactionData);
    
//     console.log(`✅ Income transaction created successfully!`);
//     console.log(`   Transaction ID: ${transaction._id}`);
//     console.log(`   Category: ${transaction.category}`);
//     console.log(`   Amount: ₹${transaction.amount}`);
    
//     // Verify transaction was saved
//     console.log(`🔍 Verifying transaction in database...`);
//     const verifyTransaction = await Transaction.findById(transaction._id);
//     if (verifyTransaction) {
//       console.log(`✅ Verified transaction exists in database: ${verifyTransaction._id}`);
//     } else {
//       console.log(`❌ Transaction not found after creation!`);
//     }
    
//     console.log("🔴🔴🔴 CREATE INCOME FROM PAYMENT COMPLETED 🔴🔴🔴\n");
//     return transaction;
    
//   } catch (error) {
//     console.error("\n❌❌❌ FAILED TO CREATE INCOME TRANSACTION ❌❌❌");
//     console.error("Error name:", error.name);
//     console.error("Error message:", error.message);
//     console.error("Error stack:", error.stack);
    
//     if (error.code === 11000) {
//       console.error("Duplicate key error:", error.keyValue);
//     }
    
//     if (error.name === 'ValidationError') {
//       console.error("Validation errors:", error.errors);
//       Object.keys(error.errors).forEach(key => {
//         console.error(`   ${key}:`, error.errors[key].message);
//       });
//     }
    
//     console.error("❌❌❌ ERROR END ❌❌❌\n");
//     // Don't throw - payment already created, just log error
//     return null;
//   }
// };

// // ============================================
// // 🔧 HELPER FUNCTION - Update income transaction from payment
// // ============================================
// const updateIncomeFromPayment = async (payment, userId) => {
//   console.log("\n🔄🔄🔄 UPDATE INCOME FROM PAYMENT STARTED 🔄🔄🔄");
//   console.log(`💰 Payment ID: ${payment._id}`);
//   console.log(`💰 Payment type: ${payment.type}`);
//   console.log(`💰 Payment amount: ${payment.amount}`);
  
//   try {
//     // Import Transaction model
//     const Transaction = require('../models/Transaction');
    
//     // Determine account type based on payment method
//     const accountType = payment.method === 'cash' ? 'hand-cash' : 'bank';
    
//     // Map payment type to income category
//     const category = mapPaymentTypeToCategory(payment.type);
    
//     console.log(`🔍 Looking for transaction with paymentId: ${payment._id}`);
    
//     // Find and update transaction for this payment
//     const transaction = await Transaction.findOneAndUpdate(
//       { 'metadata.paymentId': payment._id },
//       {
//         amount: payment.amount,
//         category: category,
//         paymentMethod: payment.method,
//         accountType: accountType,
//         referenceNumber: payment.referenceNumber || '',
//         description: `Payment for Order - ${payment.type} - ₹${payment.amount} ${payment.notes ? `- ${payment.notes}` : ''}`,
//         transactionDate: payment.paymentDate || new Date(),
//         updatedBy: userId,
//         'metadata.paymentType': payment.type,
//         'metadata.paymentMethod': payment.method
//       },
//       { new: true }
//     );
    
//     if (transaction) {
//       console.log(`✅ Income transaction updated: ${transaction._id}`);
//     } else {
//       console.log(`⚠️ No transaction found for payment ${payment._id}, creating new one...`);
//       // If no transaction exists, create one
//       const Order = getOrderModel();
//       const order = await Order.findById(payment.order);
//       await createIncomeFromPayment(payment, order, userId);
//     }
    
//     console.log("🔄🔄🔄 UPDATE INCOME FROM PAYMENT COMPLETED 🔄🔄🔄\n");
//     return transaction;
    
//   } catch (error) {
//     console.error("❌ Failed to update income transaction:", error);
//     return null;
//   }
// };

// // ============================================
// // 🔧 HELPER FUNCTION - Delete income transaction
// // ============================================
// const deleteIncomeFromPayment = async (paymentId) => {
//   console.log("\n🗑️🗑️🗑️ DELETE INCOME FROM PAYMENT STARTED 🗑️🗑️🗑️");
//   console.log(`💰 Payment ID: ${paymentId}`);
  
//   try {
//     // Import Transaction model
//     const Transaction = require('../models/Transaction');
    
//     // Soft delete the transaction
//     const result = await Transaction.findOneAndUpdate(
//       { 'metadata.paymentId': paymentId },
//       { status: 'cancelled', isDeleted: true },
//       { new: true }
//     );
    
//     if (result) {
//       console.log(`✅ Income transaction deleted: ${result._id}`);
//     } else {
//       console.log(`⚠️ No transaction found for payment ${paymentId}`);
//     }
    
//     console.log("🗑️🗑️🗑️ DELETE INCOME FROM PAYMENT COMPLETED 🗑️🗑️🗑️\n");
//     return result;
    
//   } catch (error) {
//     console.error("❌ Failed to delete income transaction:", error);
//     return null;
//   }
// };

// // ============================================
// // 🔍 DEBUG FUNCTION - Optional, can remove later
// // ============================================
// const debugOrderModel = () => {
//   console.log("\n🔍🔍🔍 DEBUGGING ORDER MODEL 🔍🔍🔍");
  
//   try {
//     const Order = getOrderModel();
    
//     console.log("2. Order properties:");
//     console.log("   - Keys:", Object.keys(Order));
//     console.log("   - Has findById:", typeof Order.findById === 'function');
//     console.log("   - Has findOne:", typeof Order.findOne === 'function');
//     console.log("   - Has findByIdAndUpdate:", typeof Order.findByIdAndUpdate === 'function');
    
//     if (Order.modelName) {
//       console.log("3. Mongoose model info:");
//       console.log("   - modelName:", Order.modelName);
//       console.log("   - collection:", Order.collection?.name);
//     }
    
//   } catch (error) {
//     console.log("❌ ERROR in debugOrderModel:", error.message);
//   }
  
//   console.log("🔍🔍🔍 DEBUG COMPLETE 🔍🔍🔍\n");
// };

// // Run debug on server start
// debugOrderModel();

// // ============================================
// // 💰 CREATE PAYMENT
// // ============================================
// exports.createPayment = async (req, res) => {
//   try {
//     const { order: orderId, amount, type, method, referenceNumber, paymentDate, paymentTime, notes } = req.body;

//     console.log("\n🔥🔥🔥 CREATE PAYMENT CALLED 🔥🔥🔥");
//     console.log("📦 Request body:", req.body);
    
//     // Validate required fields
//     if (!orderId) {
//       return res.status(400).json({
//         success: false,
//         message: 'Order ID is required'
//       });
//     }

//     if (!amount || amount <= 0) {
//       return res.status(400).json({
//         success: false,
//         message: 'Valid amount is required'
//       });
//     }

//     // Validate orderId format
//     if (!mongoose.Types.ObjectId.isValid(orderId)) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid order ID format'
//       });
//     }

//     // Get Order model
//     const Order = getOrderModel();

//     // Verify Order model is working
//     if (typeof Order.findById !== 'function') {
//       console.error("❌ Order model not properly initialized");
//       return res.status(500).json({
//         success: false,
//         message: 'Server configuration error'
//       });
//     }

//     // Find the order
//     console.log("🔍 Finding order with ID:", orderId);
//     const order = await Order.findById(orderId);
    
//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: 'Order not found'
//       });
//     }

//     console.log("✅ Order found:", order._id);
//     console.log("👤 Customer ID:", order.customer);

//     // Get user ID from request
//     const userId = req.user?.id || req.user?._id;

//     // Create payment
//     const payment = await Payment.create({
//       order: orderId,
//       customer: order.customer,
//       amount: Number(amount),
//       type: type || 'advance',
//       method: method || 'cash',
//       referenceNumber: referenceNumber || '',
//       paymentDate: paymentDate || new Date(),
//       paymentTime: paymentTime || new Date().toLocaleTimeString('en-US', { hour12: false }),
//       notes: notes || '',
//       receivedBy: userId,
//       store: req.user?.store
//     });

//     console.log("💰 Payment created:", payment._id);
//     console.log("💰 Payment type:", payment.type);
//     console.log("💰 Payment amount:", payment.amount);
//     console.log("💰 Payment date:", payment.paymentDate);
//     console.log("💰 Payment time:", payment.paymentTime);

//     // 🔥 FIX: Create income transaction for ALL payment types
//     console.log("\n🔔 Calling createIncomeFromPayment...");
//     const transactionResult = await createIncomeFromPayment(payment, order, userId);
    
//     if (transactionResult) {
//       console.log("✅ Transaction created successfully with ID:", transactionResult._id);
//     } else {
//       console.log("❌ Transaction creation failed - returned null");
//     }

//     // Verify transaction was created
//     try {
//       const Transaction = require('../models/Transaction');
//       console.log(`🔍 Checking for transaction with paymentId: ${payment._id}`);
//       const checkTxn = await Transaction.findOne({ 'metadata.paymentId': payment._id });
//       if (checkTxn) {
//         console.log("✅ Verified transaction in DB:", checkTxn._id);
//         console.log("   Category:", checkTxn.category);
//         console.log("   Amount:", checkTxn.amount);
//       } else {
//         console.log("❌ No transaction found in DB for payment:", payment._id);
//       }
//     } catch (checkError) {
//       console.error("❌ Error checking transaction:", checkError);
//     }

//     // Update order payment summary
//     console.log("\n📊 Updating order payment summary...");
//     await updateOrderPaymentSummary(orderId);

//     console.log("\n✅✅✅ PAYMENT CREATION COMPLETED SUCCESSFULLY ✅✅✅\n");

//     res.status(201).json({
//       success: true,
//       data: payment,
//       message: 'Payment added successfully'
//     });

//   } catch (error) {
//     console.error("\n❌❌❌ ERROR CREATING PAYMENT ❌❌❌");
//     console.error("Error name:", error.name);
//     console.error("Error message:", error.message);
//     console.error("Error stack:", error.stack);
//     console.error("❌❌❌ ERROR END ❌❌❌\n");
    
//     res.status(400).json({
//       success: false,
//       error: error.message
//     });
//   }
// };

// // ============================================
// // 📋 GET ORDER PAYMENTS
// // ============================================
// exports.getOrderPayments = async (req, res) => {
//   try {
//     const { orderId } = req.params;
    
//     if (!mongoose.Types.ObjectId.isValid(orderId)) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid order ID format'
//       });
//     }

//     const payments = await Payment.find({ 
//       order: orderId,
//       isDeleted: false 
//     })
//     .populate('receivedBy', 'name email')
//     .sort('-paymentDate -paymentTime');

//     res.status(200).json({
//       success: true,
//       data: payments
//     });
//   } catch (error) {
//     console.error("❌ Error fetching payments:", error);
//     res.status(400).json({
//       success: false,
//       error: error.message
//     });
//   }
// };

// // ============================================
// // 🔍 GET SINGLE PAYMENT
// // ============================================
// exports.getPayment = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid payment ID format'
//       });
//     }

//     const payment = await Payment.findOne({ 
//       _id: id,
//       isDeleted: false 
//     })
//     .populate('order')
//     .populate('customer', 'firstName lastName phone')
//     .populate('receivedBy', 'name email');

//     if (!payment) {
//       return res.status(404).json({
//         success: false,
//         message: 'Payment not found'
//       });
//     }

//     res.status(200).json({
//       success: true,
//       data: payment
//     });
//   } catch (error) {
//     console.error("❌ Error fetching payment:", error);
//     res.status(400).json({
//       success: false,
//       error: error.message
//     });
//   }
// };

// // ============================================
// // ✏️ UPDATE PAYMENT
// // ============================================
// exports.updatePayment = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid payment ID format'
//       });
//     }

//     const payment = await Payment.findOne({ 
//       _id: id,
//       isDeleted: false 
//     });

//     if (!payment) {
//       return res.status(404).json({
//         success: false,
//         message: 'Payment not found'
//       });
//     }

//     console.log("\n✏️✏️✏️ UPDATE PAYMENT CALLED ✏️✏️✏️");
//     console.log("Payment ID:", payment._id);
//     console.log("Old type:", payment.type, "New type:", req.body.type);
//     console.log("Old amount:", payment.amount, "New amount:", req.body.amount);

//     // Update allowed fields
//     const allowedUpdates = ['amount', 'method', 'referenceNumber', 'notes', 'type', 'paymentDate', 'paymentTime'];
//     allowedUpdates.forEach(field => {
//       if (req.body[field] !== undefined) {
//         payment[field] = req.body[field];
//       }
//     });

//     const userId = req.user?.id || req.user?._id;
//     payment.updatedBy = userId;
//     await payment.save();

//     console.log("✅ Payment updated successfully");

//     // 🔥 FIX: Update corresponding income transaction
//     console.log("\n🔄 Updating income transaction...");
//     await updateIncomeFromPayment(payment, userId);

//     // Update order summary
//     console.log("\n📊 Updating order payment summary...");
//     await updateOrderPaymentSummary(payment.order);

//     console.log("\n✅✅✅ PAYMENT UPDATE COMPLETED ✅✅✅\n");

//     res.status(200).json({
//       success: true,
//       data: payment,
//       message: 'Payment updated successfully'
//     });
//   } catch (error) {
//     console.error("\n❌❌❌ ERROR UPDATING PAYMENT ❌❌❌");
//     console.error("Error:", error);
//     console.error("❌❌❌ ERROR END ❌❌❌\n");
    
//     res.status(400).json({
//       success: false,
//       error: error.message
//     });
//   }
// };

// // ============================================
// // 🗑️ DELETE PAYMENT (Soft Delete)
// // ============================================
// exports.deletePayment = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid payment ID format'
//       });
//     }

//     const payment = await Payment.findOne({ 
//       _id: id,
//       isDeleted: false 
//     });

//     if (!payment) {
//       return res.status(404).json({
//         success: false,
//         message: 'Payment not found'
//       });
//     }

//     console.log("\n🗑️🗑️🗑️ DELETE PAYMENT CALLED 🗑️🗑️🗑️");
//     console.log("Deleting payment:", payment._id);

//     // Soft delete
//     payment.isDeleted = true;
//     payment.deletedAt = new Date();
//     payment.deletedBy = req.user?.id || req.user?._id;
//     await payment.save();

//     console.log("✅ Payment soft deleted");

//     // 🔥 FIX: Delete corresponding income transaction
//     console.log("\n🗑️ Deleting income transaction...");
//     await deleteIncomeFromPayment(payment._id);

//     // Update order summary
//     console.log("\n📊 Updating order payment summary...");
//     await updateOrderPaymentSummary(payment.order);

//     console.log("\n✅✅✅ PAYMENT DELETION COMPLETED ✅✅✅\n");

//     res.status(200).json({
//       success: true,
//       message: 'Payment deleted successfully'
//     });
//   } catch (error) {
//     console.error("\n❌❌❌ ERROR DELETING PAYMENT ❌❌❌");
//     console.error("Error:", error);
//     console.error("❌❌❌ ERROR END ❌❌❌\n");
    
//     res.status(400).json({
//       success: false,
//       error: error.message
//     });
//   }
// };

// // ============================================
// // 📊 GET PAYMENT STATISTICS
// // ============================================
// exports.getPaymentStats = async (req, res) => {
//   try {
//     const { startDate, endDate } = req.query;
    
//     const match = { 
//       store: req.user?.store,
//       isDeleted: false 
//     };

//     if (startDate || endDate) {
//       match.paymentDate = {};
//       if (startDate) match.paymentDate.$gte = new Date(startDate);
//       if (endDate) match.paymentDate.$lte = new Date(endDate);
//     }

//     // Today's payments
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//     const tomorrow = new Date(today);
//     tomorrow.setDate(tomorrow.getDate() + 1);

//     const todayPayments = await Payment.aggregate([
//       {
//         $match: {
//           ...match,
//           paymentDate: { $gte: today, $lt: tomorrow }
//         }
//       },
//       {
//         $group: {
//           _id: null,
//           total: { $sum: '$amount' },
//           count: { $sum: 1 }
//         }
//       }
//     ]);

//     // Payments by method
//     const byMethod = await Payment.aggregate([
//       { $match: match },
//       {
//         $group: {
//           _id: '$method',
//           total: { $sum: '$amount' },
//           count: { $sum: 1 }
//         }
//       }
//     ]);

//     // Payments by type
//     const byType = await Payment.aggregate([
//       { $match: match },
//       {
//         $group: {
//           _id: '$type',
//           total: { $sum: '$amount' },
//           count: { $sum: 1 }
//         }
//       }
//     ]);

//     // Total collections
//     const totalStats = await Payment.aggregate([
//       { $match: match },
//       {
//         $group: {
//           _id: null,
//           totalAmount: { $sum: '$amount' },
//           averageAmount: { $avg: '$amount' },
//           totalCount: { $sum: 1 },
//           maxAmount: { $max: '$amount' },
//           minAmount: { $min: '$amount' }
//         }
//       }
//     ]);

//     res.status(200).json({
//       success: true,
//       data: {
//         today: todayPayments[0] || { total: 0, count: 0 },
//         byMethod,
//         byType,
//         summary: totalStats[0] || { totalAmount: 0, totalCount: 0, averageAmount: 0 }
//       }
//     });
//   } catch (error) {
//     console.error("❌ Error fetching payment stats:", error);
//     res.status(400).json({
//       success: false,
//       error: error.message
//     });
//   }
// };

// // ============================================
// // 🔄 HELPER FUNCTION - Update Order Payment Summary
// // ============================================
// async function updateOrderPaymentSummary(orderId) {
//   try {
//     // Get Order model using helper
//     const Order = getOrderModel();
//     const Payment = require('../models/Payment');
    
//     console.log("📊 Updating payment summary for order:", orderId);

//     // Get order details
//     const order = await Order.findById(orderId);
//     if (!order) {
//       console.log("⚠️ Order not found for payment summary update:", orderId);
//       return;
//     }

//     // Get all completed payments
//     const payments = await Payment.find({ 
//       order: orderId, 
//       isDeleted: false,
//       type: { $in: ['advance', 'full', 'partial', 'extra'] }
//     });

//     // Calculate totals
//     const totalPaid = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
//     const lastPayment = payments.sort((a, b) => 
//       new Date(b.paymentDate || 0) - new Date(a.paymentDate || 0)
//     )[0];

//     // Get order total amount
//     const totalAmount = order.priceSummary?.totalMax || order.totalAmount || 0;

//     // Determine payment status
//     let paymentStatus = 'pending';
//     if (totalPaid >= totalAmount) {
//       paymentStatus = totalPaid > totalAmount ? 'overpaid' : 'paid';
//     } else if (totalPaid > 0) {
//       paymentStatus = 'partial';
//     }

//     // Update order
//     await Order.findByIdAndUpdate(orderId, {
//       'paymentSummary': {
//         totalPaid,
//         lastPaymentDate: lastPayment?.paymentDate,
//         lastPaymentAmount: lastPayment?.amount,
//         paymentCount: payments.length,
//         paymentStatus
//       },
//       balanceAmount: totalAmount - totalPaid
//     });

//     console.log("✅ Order payment summary updated successfully");
//     console.log(`   Total Paid: ₹${totalPaid}, Status: ${paymentStatus}`);
    
//   } catch (error) {
//     console.error("❌ Error updating order payment summary:", error);
//     throw error;
//   }
// }




// controllers/payment.controller.js - ES6 Version with Complete Fix
import mongoose from 'mongoose';
import Payment from '../models/Payment.js';
import Customer from '../models/Customer.js';
import Transaction from '../models/Transaction.js';
import Order from '../models/Order.js';  // ✅ DIRECT IMPORT - FIXED!

// ============================================
// 🔧 HELPER FUNCTION - Get Order model (SIMPLIFIED)
// ============================================
const getOrderModel = () => {
  // Simply return the imported Order model
  return Order;
};

// ============================================
// 🔧 HELPER FUNCTION - Map payment type to income category
// ============================================
const mapPaymentTypeToCategory = (type) => {
  console.log(`🔄 mapPaymentTypeToCategory called with type: ${type}`);
  
  const categoryMap = {
    'advance': 'customer-advance',
    'full': 'full-payment',
    'final-settlement': 'full-payment',
    'extra': 'fabric-sale',
    'partial': 'part-payment',
    'part-payment': 'part-payment'
  };
  
  const category = categoryMap[type] || 'customer-advance';
  console.log(`🔄 Payment type: ${type} → Category: ${category}`);
  return category;
};

// ============================================
// 🔧 HELPER FUNCTION - Create income transaction from payment
// ============================================
const createIncomeFromPayment = async (payment, order, userId) => {
  console.log("\n🔴🔴🔴 CREATE INCOME FROM PAYMENT STARTED 🔴🔴🔴");
  console.log("📦 Payment ID:", payment._id);
  console.log("📦 Payment type:", payment.type);
  console.log("📦 Payment amount:", payment.amount);
  console.log("📦 Payment method:", payment.method);
  console.log("📦 Payment date:", payment.paymentDate);
  console.log("📦 Payment time:", payment.paymentTime);
  console.log("📦 Order ID:", payment.order);
  console.log("📦 Customer ID:", payment.customer);
  console.log("📦 User ID:", userId);
  
  try {
    // Determine account type based on payment method
    const accountType = payment.method === 'cash' ? 'hand-cash' : 'bank';
    console.log(`💰 Account type: ${accountType}`);
    
    // Map payment type to income category
    const category = mapPaymentTypeToCategory(payment.type);
    console.log(`💰 Mapped category: ${category}`);
    
    // Get customer details
    console.log(`🔍 Finding customer with ID: ${payment.customer}`);
    const customer = await Customer.findById(payment.customer);
    
    if (customer) {
      console.log(`✅ Customer found: ${customer.name || customer.firstName || 'Unknown'}`);
    } else {
      console.log(`⚠️ Customer not found with ID: ${payment.customer}`);
    }
    
    const customerDetails = customer ? {
      name: customer.name || `${customer.firstName || ''} ${customer.lastName || ''}`.trim() || 'Unknown',
      phone: customer.phone,
      id: customer.customerId || customer._id
    } : null;
    
    console.log(`📊 Customer details:`, customerDetails);
    
    // Check if transaction already exists for this payment
    console.log(`🔍 Checking if transaction already exists for payment ${payment._id}...`);
    const existingTransaction = await Transaction.findOne({ 'metadata.paymentId': payment._id });
    
    if (existingTransaction) {
      console.log(`⚠️ Transaction already exists for payment ${payment._id}: ${existingTransaction._id}`);
      console.log("🔴🔴🔴 CREATE INCOME FROM PAYMENT COMPLETED (EXISTING) 🔴🔴🔴\n");
      return existingTransaction;
    }
    
    console.log("✅ No existing transaction found, creating new one...");
    
    // Prepare transaction data
    const transactionData = {
      type: 'income',
      category: category,
      amount: payment.amount,
      paymentMethod: payment.method,
      accountType: accountType,
      customer: payment.customer,
      customerDetails: customerDetails,
      order: payment.order,
      description: `Payment for Order - ${payment.type} - ₹${payment.amount} ${payment.notes ? `- ${payment.notes}` : ''}`,
      transactionDate: payment.paymentDate || new Date(),
      referenceNumber: payment.referenceNumber || '',
      createdBy: userId,
      status: 'completed',
      metadata: {
        paymentId: payment._id,
        paymentType: payment.type,
        paymentMethod: payment.method
      }
    };
    
    console.log("📦 Transaction data prepared:", JSON.stringify(transactionData, null, 2));
    
    // 🔥 CRITICAL: Check for duplicate before creating
    // This matches the check in transaction controller
    if (payment.order && transactionData.type === 'income') {
      console.log("\n🔍 ADDITIONAL DUPLICATE CHECK BEFORE SAVE:");
      console.log("   Order ID:", payment.order);
      console.log("   Category:", category);
      console.log("   Amount:", payment.amount);
      console.log("   Payment Method:", payment.method);
      
      const duplicateCheck = await Transaction.findOne({
        order: payment.order,
        type: 'income',
        category: category,
        amount: payment.amount,
        paymentMethod: payment.method,
        status: 'completed'
      });
      
      if (duplicateCheck) {
        console.log("⚠️⚠️⚠️ DUPLICATE FOUND BEFORE SAVE! ⚠️⚠️⚠️");
        console.log("   Existing transaction:", duplicateCheck._id);
        console.log("   Returning existing instead of creating new");
        console.log("🔴🔴🔴 CREATE INCOME FROM PAYMENT COMPLETED (DUPLICATE) 🔴🔴🔴\n");
        return duplicateCheck;
      }
      
      console.log("✅ No duplicate found - safe to create");
    }
    
    // Create income transaction
    console.log("💾 Saving transaction to database...");
    const transaction = await Transaction.create(transactionData);
    
    console.log(`✅ Income transaction created successfully!`);
    console.log(`   Transaction ID: ${transaction._id}`);
    console.log(`   Category: ${transaction.category}`);
    console.log(`   Amount: ₹${transaction.amount}`);
    
    // Verify transaction was saved
    console.log(`🔍 Verifying transaction in database...`);
    const verifyTransaction = await Transaction.findById(transaction._id);
    if (verifyTransaction) {
      console.log(`✅ Verified transaction exists in database: ${verifyTransaction._id}`);
    } else {
      console.log(`❌ Transaction not found after creation!`);
    }
    
    console.log("🔴🔴🔴 CREATE INCOME FROM PAYMENT COMPLETED 🔴🔴🔴\n");
    return transaction;
    
  } catch (error) {
    console.error("\n❌❌❌ FAILED TO CREATE INCOME TRANSACTION ❌❌❌");
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    
    if (error.code === 11000) {
      console.error("Duplicate key error:", error.keyValue);
    }
    
    if (error.name === 'ValidationError') {
      console.error("Validation errors:", error.errors);
      Object.keys(error.errors).forEach(key => {
        console.error(`   ${key}:`, error.errors[key].message);
      });
    }
    
    console.error("❌❌❌ ERROR END ❌❌❌\n");
    // Don't throw - payment already created, just log error
    return null;
  }
};

// ============================================
// 🔧 HELPER FUNCTION - Update income transaction from payment
// ============================================
const updateIncomeFromPayment = async (payment, userId) => {
  console.log("\n🔄🔄🔄 UPDATE INCOME FROM PAYMENT STARTED 🔄🔄🔄");
  console.log(`💰 Payment ID: ${payment._id}`);
  console.log(`💰 Payment type: ${payment.type}`);
  console.log(`💰 Payment amount: ${payment.amount}`);
  
  try {
    // Determine account type based on payment method
    const accountType = payment.method === 'cash' ? 'hand-cash' : 'bank';
    
    // Map payment type to income category
    const category = mapPaymentTypeToCategory(payment.type);
    
    console.log(`🔍 Looking for transaction with paymentId: ${payment._id}`);
    
    // Find and update transaction for this payment
    const transaction = await Transaction.findOneAndUpdate(
      { 'metadata.paymentId': payment._id },
      {
        amount: payment.amount,
        category: category,
        paymentMethod: payment.method,
        accountType: accountType,
        referenceNumber: payment.referenceNumber || '',
        description: `Payment for Order - ${payment.type} - ₹${payment.amount} ${payment.notes ? `- ${payment.notes}` : ''}`,
        transactionDate: payment.paymentDate || new Date(),
        updatedBy: userId,
        'metadata.paymentType': payment.type,
        'metadata.paymentMethod': payment.method
      },
      { new: true }
    );
    
    if (transaction) {
      console.log(`✅ Income transaction updated: ${transaction._id}`);
    } else {
      console.log(`⚠️ No transaction found for payment ${payment._id}, creating new one...`);
      // If no transaction exists, create one
      const order = await Order.findById(payment.order);  // ✅ Direct use of imported Order
      await createIncomeFromPayment(payment, order, userId);
    }
    
    console.log("🔄🔄🔄 UPDATE INCOME FROM PAYMENT COMPLETED 🔄🔄🔄\n");
    return transaction;
    
  } catch (error) {
    console.error("❌ Failed to update income transaction:", error);
    return null;
  }
};

// ============================================
// 🔧 HELPER FUNCTION - Delete income transaction
// ============================================
const deleteIncomeFromPayment = async (paymentId) => {
  console.log("\n🗑️🗑️🗑️ DELETE INCOME FROM PAYMENT STARTED 🗑️🗑️🗑️");
  console.log(`💰 Payment ID: ${paymentId}`);
  
  try {
    // Soft delete the transaction
    const result = await Transaction.findOneAndUpdate(
      { 'metadata.paymentId': paymentId },
      { status: 'cancelled', isDeleted: true },
      { new: true }
    );
    
    if (result) {
      console.log(`✅ Income transaction deleted: ${result._id}`);
    } else {
      console.log(`⚠️ No transaction found for payment ${paymentId}`);
    }
    
    console.log("🗑️🗑️🗑️ DELETE INCOME FROM PAYMENT COMPLETED 🗑️🗑️🗑️\n");
    return result;
    
  } catch (error) {
    console.error("❌ Failed to delete income transaction:", error);
    return null;
  }
};

// ============================================
// 🔍 DEBUG FUNCTION - Optional, can remove later
// ============================================
const debugOrderModel = () => {
  console.log("\n🔍🔍🔍 DEBUGGING ORDER MODEL 🔍🔍🔍");
  
  try {
    console.log("1. Order model imported directly");
    console.log("2. Order properties:");
    console.log("   - Keys:", Object.keys(Order));
    console.log("   - Has findById:", typeof Order.findById === 'function');
    console.log("   - Has findOne:", typeof Order.findOne === 'function');
    console.log("   - Has findByIdAndUpdate:", typeof Order.findByIdAndUpdate === 'function');
    
    if (Order.modelName) {
      console.log("3. Mongoose model info:");
      console.log("   - modelName:", Order.modelName);
      console.log("   - collection:", Order.collection?.name);
    }
    
  } catch (error) {
    console.log("❌ ERROR in debugOrderModel:", error.message);
  }
  
  console.log("🔍🔍🔍 DEBUG COMPLETE 🔍🔍🔍\n");
};

// Run debug on server start
debugOrderModel();

// ============================================
// 🔄 HELPER FUNCTION - Update Order Payment Summary
// ============================================
async function updateOrderPaymentSummary(orderId) {
  try {
    console.log("📊 Updating payment summary for order:", orderId);

    // Get order details - using imported Order directly
    const order = await Order.findById(orderId);
    if (!order) {
      console.log("⚠️ Order not found for payment summary update:", orderId);
      return;
    }

    // Get all completed payments
    const payments = await Payment.find({ 
      order: orderId, 
      isDeleted: false,
      type: { $in: ['advance', 'full', 'partial', 'extra'] }
    });

    // Calculate totals
    const totalPaid = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
    const lastPayment = payments.sort((a, b) => 
      new Date(b.paymentDate || 0) - new Date(a.paymentDate || 0)
    )[0];

    // Get order total amount
    const totalAmount = order.priceSummary?.totalMax || order.totalAmount || 0;

    // Determine payment status
    let paymentStatus = 'pending';
    if (totalPaid >= totalAmount) {
      paymentStatus = totalPaid > totalAmount ? 'overpaid' : 'paid';
    } else if (totalPaid > 0) {
      paymentStatus = 'partial';
    }

    // Update order
    await Order.findByIdAndUpdate(orderId, {
      'paymentSummary': {
        totalPaid,
        lastPaymentDate: lastPayment?.paymentDate,
        lastPaymentAmount: lastPayment?.amount,
        paymentCount: payments.length,
        paymentStatus
      },
      balanceAmount: totalAmount - totalPaid
    });

    console.log("✅ Order payment summary updated successfully");
    console.log(`   Total Paid: ₹${totalPaid}, Status: ${paymentStatus}`);
    
  } catch (error) {
    console.error("❌ Error updating order payment summary:", error);
    throw error;
  }
}

// ============================================
// 💰 CREATE PAYMENT
// ============================================
export const createPayment = async (req, res) => {
  try {
    const { order: orderId, amount, type, method, referenceNumber, paymentDate, paymentTime, notes } = req.body;

    console.log("\n🔥🔥🔥 CREATE PAYMENT CALLED 🔥🔥🔥");
    console.log("📦 Request body:", req.body);
    
    // Validate required fields
    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: 'Order ID is required'
      });
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid amount is required'
      });
    }

    // Validate orderId format
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order ID format'
      });
    }

    // Find the order - using imported Order directly
    console.log("🔍 Finding order with ID:", orderId);
    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    console.log("✅ Order found:", order._id);
    console.log("👤 Customer ID:", order.customer);

    // Get user ID from request
    const userId = req.user?.id || req.user?._id;

    // Create payment
    const payment = await Payment.create({
      order: orderId,
      customer: order.customer,
      amount: Number(amount),
      type: type || 'advance',
      method: method || 'cash',
      referenceNumber: referenceNumber || '',
      paymentDate: paymentDate || new Date(),
      paymentTime: paymentTime || new Date().toLocaleTimeString('en-US', { hour12: false }),
      notes: notes || '',
      receivedBy: userId,
      store: req.user?.store
    });

    console.log("💰 Payment created:", payment._id);
    console.log("💰 Payment type:", payment.type);
    console.log("💰 Payment amount:", payment.amount);
    console.log("💰 Payment date:", payment.paymentDate);
    console.log("💰 Payment time:", payment.paymentTime);

    // 🔥 FIX: Create income transaction for ALL payment types
    console.log("\n🔔 Calling createIncomeFromPayment...");
    const transactionResult = await createIncomeFromPayment(payment, order, userId);
    
    if (transactionResult) {
      console.log("✅ Transaction created successfully with ID:", transactionResult._id);
    } else {
      console.log("❌ Transaction creation failed - returned null");
    }

    // Verify transaction was created
    try {
      console.log(`🔍 Checking for transaction with paymentId: ${payment._id}`);
      const checkTxn = await Transaction.findOne({ 'metadata.paymentId': payment._id });
      if (checkTxn) {
        console.log("✅ Verified transaction in DB:", checkTxn._id);
        console.log("   Category:", checkTxn.category);
        console.log("   Amount:", checkTxn.amount);
      } else {
        console.log("❌ No transaction found in DB for payment:", payment._id);
      }
    } catch (checkError) {
      console.error("❌ Error checking transaction:", checkError);
    }

    // Update order payment summary
    console.log("\n📊 Updating order payment summary...");
    await updateOrderPaymentSummary(orderId);

    console.log("\n✅✅✅ PAYMENT CREATION COMPLETED SUCCESSFULLY ✅✅✅\n");

    res.status(201).json({
      success: true,
      data: payment,
      message: 'Payment added successfully'
    });

  } catch (error) {
    console.error("\n❌❌❌ ERROR CREATING PAYMENT ❌❌❌");
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    console.error("❌❌❌ ERROR END ❌❌❌\n");
    
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// ============================================
// 📋 GET ORDER PAYMENTS
// ============================================
export const getOrderPayments = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order ID format'
      });
    }

    const payments = await Payment.find({ 
      order: orderId,
      isDeleted: false 
    })
    .populate('receivedBy', 'name email')
    .sort('-paymentDate -paymentTime');

    res.status(200).json({
      success: true,
      data: payments
    });
  } catch (error) {
    console.error("❌ Error fetching payments:", error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// ============================================
// 🔍 GET SINGLE PAYMENT
// ============================================
export const getPayment = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment ID format'
      });
    }

    const payment = await Payment.findOne({ 
      _id: id,
      isDeleted: false 
    })
    .populate('order')
    .populate('customer', 'firstName lastName phone')
    .populate('receivedBy', 'name email');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    res.status(200).json({
      success: true,
      data: payment
    });
  } catch (error) {
    console.error("❌ Error fetching payment:", error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// ============================================
// ✏️ UPDATE PAYMENT
// ============================================
export const updatePayment = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment ID format'
      });
    }

    const payment = await Payment.findOne({ 
      _id: id,
      isDeleted: false 
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    console.log("\n✏️✏️✏️ UPDATE PAYMENT CALLED ✏️✏️✏️");
    console.log("Payment ID:", payment._id);
    console.log("Old type:", payment.type, "New type:", req.body.type);
    console.log("Old amount:", payment.amount, "New amount:", req.body.amount);

    // Update allowed fields
    const allowedUpdates = ['amount', 'method', 'referenceNumber', 'notes', 'type', 'paymentDate', 'paymentTime'];
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        payment[field] = req.body[field];
      }
    });

    const userId = req.user?.id || req.user?._id;
    payment.updatedBy = userId;
    await payment.save();

    console.log("✅ Payment updated successfully");

    // 🔥 FIX: Update corresponding income transaction
    console.log("\n🔄 Updating income transaction...");
    await updateIncomeFromPayment(payment, userId);

    // Update order summary
    console.log("\n📊 Updating order payment summary...");
    await updateOrderPaymentSummary(payment.order);

    console.log("\n✅✅✅ PAYMENT UPDATE COMPLETED ✅✅✅\n");

    res.status(200).json({
      success: true,
      data: payment,
      message: 'Payment updated successfully'
    });
  } catch (error) {
    console.error("\n❌❌❌ ERROR UPDATING PAYMENT ❌❌❌");
    console.error("Error:", error);
    console.error("❌❌❌ ERROR END ❌❌❌\n");
    
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// ============================================
// 🗑️ DELETE PAYMENT (Soft Delete)
// ============================================
export const deletePayment = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment ID format'
      });
    }

    const payment = await Payment.findOne({ 
      _id: id,
      isDeleted: false 
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    console.log("\n🗑️🗑️🗑️ DELETE PAYMENT CALLED 🗑️🗑️🗑️");
    console.log("Deleting payment:", payment._id);

    // Soft delete
    payment.isDeleted = true;
    payment.deletedAt = new Date();
    payment.deletedBy = req.user?.id || req.user?._id;
    await payment.save();

    console.log("✅ Payment soft deleted");

    // 🔥 FIX: Delete corresponding income transaction
    console.log("\n🗑️ Deleting income transaction...");
    await deleteIncomeFromPayment(payment._id);

    // Update order summary
    console.log("\n📊 Updating order payment summary...");
    await updateOrderPaymentSummary(payment.order);

    console.log("\n✅✅✅ PAYMENT DELETION COMPLETED ✅✅✅\n");

    res.status(200).json({
      success: true,
      message: 'Payment deleted successfully'
    });
  } catch (error) {
    console.error("\n❌❌❌ ERROR DELETING PAYMENT ❌❌❌");
    console.error("Error:", error);
    console.error("❌❌❌ ERROR END ❌❌❌\n");
    
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// ============================================
// 📊 GET PAYMENT STATISTICS
// ============================================
export const getPaymentStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const match = { 
      store: req.user?.store,
      isDeleted: false 
    };

    if (startDate || endDate) {
      match.paymentDate = {};
      if (startDate) match.paymentDate.$gte = new Date(startDate);
      if (endDate) match.paymentDate.$lte = new Date(endDate);
    }

    // Today's payments
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayPayments = await Payment.aggregate([
      {
        $match: {
          ...match,
          paymentDate: { $gte: today, $lt: tomorrow }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    // Payments by method
    const byMethod = await Payment.aggregate([
      { $match: match },
      {
        $group: {
          _id: '$method',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    // Payments by type
    const byType = await Payment.aggregate([
      { $match: match },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    // Total collections
    const totalStats = await Payment.aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' },
          averageAmount: { $avg: '$amount' },
          totalCount: { $sum: 1 },
          maxAmount: { $max: '$amount' },
          minAmount: { $min: '$amount' }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        today: todayPayments[0] || { total: 0, count: 0 },
        byMethod,
        byType,
        summary: totalStats[0] || { totalAmount: 0, totalCount: 0, averageAmount: 0 }
      }
    });
  } catch (error) {
    console.error("❌ Error fetching payment stats:", error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};