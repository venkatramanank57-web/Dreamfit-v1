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
// controllers/paymentController.js
const mongoose = require('mongoose');
const Payment = require('../models/Payment');

// ============================================
// 🔧 HELPER FUNCTION - Get Order model correctly
// ============================================
const getOrderModel = () => {
  try {
    const OrderImport = require('../models/Order');
    // Handle both ES Module and CommonJS exports
    const Order = OrderImport.default || OrderImport;
    
    console.log("📦 Order model loaded:", {
      exists: !!Order,
      type: typeof Order,
      hasFindById: typeof Order?.findById === 'function'
    });
    
    return Order;
  } catch (error) {
    console.error("❌ Failed to load Order model:", error.message);
    throw error;
  }
};

// ============================================
// 🔍 DEBUG FUNCTION - Optional, can remove later
// ============================================
const debugOrderModel = () => {
  console.log("\n🔍🔍🔍 DEBUGGING ORDER MODEL 🔍🔍🔍");
  
  try {
    const Order = getOrderModel();
    
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
// 💰 CREATE PAYMENT
// ============================================
exports.createPayment = async (req, res) => {
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

    // Get Order model
    const Order = getOrderModel();

    // Verify Order model is working
    if (typeof Order.findById !== 'function') {
      console.error("❌ Order model not properly initialized");
      return res.status(500).json({
        success: false,
        message: 'Server configuration error'
      });
    }

    // Find the order
    console.log("🔍 Finding order with ID:", orderId);
    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    console.log("✅ Order found:", order._id);

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
      receivedBy: req.user?.id || req.user?._id,
      store: req.user?.store
    });

    console.log("💰 Payment created:", payment._id);

    // Update order payment summary
    await updateOrderPaymentSummary(orderId);

    res.status(201).json({
      success: true,
      data: payment,
      message: 'Payment added successfully'
    });

  } catch (error) {
    console.error("❌ Error creating payment:", error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// ============================================
// 📋 GET ORDER PAYMENTS
// ============================================
exports.getOrderPayments = async (req, res) => {
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
exports.getPayment = async (req, res) => {
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
exports.updatePayment = async (req, res) => {
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

    // Update allowed fields
    const allowedUpdates = ['amount', 'method', 'referenceNumber', 'notes', 'type', 'paymentDate', 'paymentTime'];
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        payment[field] = req.body[field];
      }
    });

    payment.updatedBy = req.user?.id || req.user?._id;
    await payment.save();

    // Update order summary
    await updateOrderPaymentSummary(payment.order);

    res.status(200).json({
      success: true,
      data: payment,
      message: 'Payment updated successfully'
    });
  } catch (error) {
    console.error("❌ Error updating payment:", error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// ============================================
// 🗑️ DELETE PAYMENT (Soft Delete)
// ============================================
exports.deletePayment = async (req, res) => {
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

    // Soft delete
    payment.isDeleted = true;
    payment.deletedAt = new Date();
    payment.deletedBy = req.user?.id || req.user?._id;
    await payment.save();

    // Update order summary
    await updateOrderPaymentSummary(payment.order);

    res.status(200).json({
      success: true,
      message: 'Payment deleted successfully'
    });
  } catch (error) {
    console.error("❌ Error deleting payment:", error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// ============================================
// 📊 GET PAYMENT STATISTICS
// ============================================
exports.getPaymentStats = async (req, res) => {
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

// ============================================
// 🔄 HELPER FUNCTION - Update Order Payment Summary
// ============================================
async function updateOrderPaymentSummary(orderId) {
  try {
    // Get Order model using helper
    const Order = getOrderModel();
    const Payment = require('../models/Payment');
    
    console.log("📊 Updating payment summary for order:", orderId);

    // Get order details
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
    
  } catch (error) {
    console.error("❌ Error updating order payment summary:", error);
    throw error;
  }
}