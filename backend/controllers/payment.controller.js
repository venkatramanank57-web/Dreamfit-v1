// controllers/paymentController.js
const Payment = require('../models/Payment');
const Order = require('../models/Order');

// @desc    Create new payment
// @route   POST /api/payments
// @access  Private
exports.createPayment = async (req, res) => {
  try {
    const { order: orderId, amount, type, method, referenceNumber, paymentDate, paymentTime, notes } = req.body;

    // Get order details
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Create payment
    const payment = await Payment.create({
      order: orderId,
      customer: order.customer,
      amount,
      type,
      method,
      referenceNumber,
      paymentDate,
      paymentTime,
      notes,
      receivedBy: req.user.id,
      store: req.user.store // From auth middleware
    });

    // Update order payment summary
    await updateOrderPaymentSummary(orderId);

    res.status(201).json({
      success: true,
      data: payment,
      message: 'Payment added successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get all payments for an order
// @route   GET /api/payments/order/:orderId
// @access  Private
exports.getOrderPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ 
      order: req.params.orderId,
      isDeleted: false 
    })
    .populate('receivedBy', 'name')
    .sort('-paymentDate -paymentTime');

    res.status(200).json({
      success: true,
      data: payments
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get single payment
// @route   GET /api/payments/:id
// @access  Private
exports.getPayment = async (req, res) => {
  try {
    const payment = await Payment.findOne({ 
      _id: req.params.id,
      isDeleted: false 
    })
    .populate('order')
    .populate('customer', 'firstName lastName phone')
    .populate('receivedBy', 'name');

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
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Update payment
// @route   PUT /api/payments/:id
// @access  Private
exports.updatePayment = async (req, res) => {
  try {
    const payment = await Payment.findOne({ 
      _id: req.params.id,
      isDeleted: false 
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    // Update allowed fields
    const allowedUpdates = ['amount', 'method', 'referenceNumber', 'notes', 'type'];
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        payment[field] = req.body[field];
      }
    });

    payment.updatedBy = req.user.id;
    await payment.save();

    // Update order summary
    await updateOrderPaymentSummary(payment.order);

    res.status(200).json({
      success: true,
      data: payment,
      message: 'Payment updated successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Delete payment (soft delete)
// @route   DELETE /api/payments/:id
// @access  Private
exports.deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findOne({ 
      _id: req.params.id,
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
    payment.deletedBy = req.user.id;
    await payment.save();

    // Update order summary
    await updateOrderPaymentSummary(payment.order);

    res.status(200).json({
      success: true,
      message: 'Payment deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get payment statistics for dashboard
// @route   GET /api/payments/stats
// @access  Private
exports.getPaymentStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const match = { 
      store: req.user.store,
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
        summary: totalStats[0] || { totalAmount: 0, totalCount: 0 }
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Helper function to update order payment summary
async function updateOrderPaymentSummary(orderId) {
  const Order = mongoose.model('Order');
  const Payment = mongoose.model('Payment');
  
  // Get order details
  const order = await Order.findById(orderId);
  if (!order) return;

  // Get all completed payments (excluding refunds)
  const payments = await Payment.find({ 
    order: orderId, 
    isDeleted: false,
    type: { $in: ['advance', 'full', 'partial', 'extra'] }
  });

  // Calculate totals
  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
  const lastPayment = payments.sort((a, b) => 
    new Date(b.paymentDate) - new Date(a.paymentDate)
  )[0];

  // Determine payment status
  let paymentStatus = 'pending';
  if (totalPaid >= order.totalAmount) {
    paymentStatus = totalPaid > order.totalAmount ? 'overpaid' : 'paid';
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
    balanceAmount: order.totalAmount - totalPaid
  });
}