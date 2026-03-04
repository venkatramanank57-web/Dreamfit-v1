// backend/controllers/customer.controller.js
import Customer from "../models/Customer.js";
import Payment from "../models/Payment.js";
import Order from "../models/Order.js";
import mongoose from "mongoose";

// ===== HELPER FUNCTION TO GET CUSTOMER PAYMENT SUMMARY =====
const getCustomerPaymentSummary = async (customerId) => {
  try {
    console.log(`💰 Getting payment summary for customer: ${customerId}`);
    
    // Get all payments for this customer
    const payments = await Payment.find({ 
      customer: customerId,  // ✅ FIXED: changed from customerId to customer
      isDeleted: false 
    });

    // Get all orders for this customer
    const orders = await Order.find({ 
      customer: customerId,  // ✅ FIXED: changed from customerId to customer
      isActive: true 
    });

    // Calculate totals
    const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
    const totalOrders = orders.length;
    const completedOrders = orders.filter(o => o.status === 'delivered').length;
    
    // Get recent payments
    const recentPayments = await Payment.find({ 
      customer: customerId,  // ✅ FIXED: changed from customerId to customer
      isDeleted: false 
    })
    .populate('order', 'orderId')  // ✅ FIXED: changed from orderId to order
    .sort('-paymentDate -paymentTime')
    .limit(5);

    // Calculate payment by method
    const byMethod = {
      cash: payments.filter(p => p.method === 'cash').reduce((sum, p) => sum + p.amount, 0),  // ✅ FIXED: paymentMethod → method
      upi: payments.filter(p => p.method === 'upi').reduce((sum, p) => sum + p.amount, 0),
      card: payments.filter(p => p.method === 'card').reduce((sum, p) => sum + p.amount, 0),
      'bank-transfer': payments.filter(p => p.method === 'bank-transfer').reduce((sum, p) => sum + p.amount, 0)
    };

    // Calculate payment by type
    const byType = {
      advance: payments.filter(p => p.type === 'advance').reduce((sum, p) => sum + p.amount, 0),  // ✅ FIXED: paymentType → type
      full: payments.filter(p => p.type === 'full').reduce((sum, p) => sum + p.amount, 0),
      partial: payments.filter(p => p.type === 'partial').reduce((sum, p) => sum + p.amount, 0),
      extra: payments.filter(p => p.type === 'extra').reduce((sum, p) => sum + p.amount, 0)
    };

    return {
      totalPaid,
      totalOrders,
      completedOrders,
      pendingOrders: totalOrders - completedOrders,
      paymentCount: payments.length,
      recentPayments,
      byMethod,
      byType,
      lastPayment: payments.length > 0 ? payments[0] : null
    };
  } catch (error) {
    console.error("❌ Error getting customer payment summary:", error);
    return {
      totalPaid: 0,
      totalOrders: 0,
      completedOrders: 0,
      pendingOrders: 0,
      paymentCount: 0,
      recentPayments: [],
      byMethod: {},
      byType: {},
      lastPayment: null
    };
  }
};

// ==================== SEARCH FUNCTIONS ====================

/**
 * @desc    Search customer by phone number
 * @route   GET /api/customers/search/phone/:phone
 * @access  Private
 */
export const getCustomerByPhone = async (req, res) => {
  try {
    const { phone } = req.params;
    console.log(`🔍 Searching customer by phone: ${phone}`);
    
    const customer = await Customer.findOne({ phone });

    if (!customer) {
      console.log(`❌ Customer not found with phone: ${phone}`);
      return res.status(404).json({ 
        success: false,
        message: "Customer not found" 
      });
    }

    // Get payment summary
    const paymentSummary = await getCustomerPaymentSummary(customer._id);

    console.log(`✅ Customer found: ${customer.customerId} - ${customer.firstName} ${customer.lastName}`);

    res.status(200).json({
      success: true,
      customer: {
        ...customer.toObject(),
        paymentSummary
      }
    });
  } catch (error) {
    console.error("❌ Search by phone error:", error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

/**
 * @desc    Search customer by customer ID (CUST-2024-00001 format)
 * @route   GET /api/customers/search/id/:customerId
 * @access  Private
 */
export const getCustomerByCustomerId = async (req, res) => {
  try {
    const { customerId } = req.params;
    console.log(`🔍 Searching customer by ID: ${customerId}`);
    
    const customer = await Customer.findOne({ customerId });

    if (!customer) {
      console.log(`❌ Customer not found with ID: ${customerId}`);
      return res.status(404).json({ 
        success: false,
        message: "Customer not found" 
      });
    }

    // Get payment summary
    const paymentSummary = await getCustomerPaymentSummary(customer._id);

    console.log(`✅ Customer found: ${customer.customerId} - ${customer.firstName} ${customer.lastName}`);

    res.status(200).json({
      success: true,
      customer: {
        ...customer.toObject(),
        paymentSummary
      }
    });
  } catch (error) {
    console.error("❌ Search by customer ID error:", error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// ==================== CREATE FUNCTION ====================

/**
 * @desc    Create new customer
 * @route   POST /api/customers/create
 * @access  Private
 */
export const createCustomer = async (req, res) => {
  try {
    console.log("\n🔵 ========== CREATE CUSTOMER START ==========");
    console.log("📥 Request body:", JSON.stringify(req.body, null, 2));
    
    const { 
      salutation,
      firstName,
      lastName,
      dateOfBirth,
      phone,
      whatsappNumber,
      email,
      addressLine1,
      addressLine2,
      city,
      state,
      pincode,
      notes
    } = req.body;

    // ✅ Validate required fields
    const missingFields = [];
    if (!phone) missingFields.push('phone');
    if (!firstName) missingFields.push('firstName');
    if (!addressLine1) missingFields.push('addressLine1');
    
    if (missingFields.length > 0) {
      console.log("❌ Missing required fields:", missingFields);
      return res.status(400).json({ 
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}` 
      });
    }

    // Check if phone already exists
    console.log(`🔍 Checking if phone ${phone} already exists...`);
    const existing = await Customer.findOne({ phone });
    if (existing) {
      console.log(`❌ Phone ${phone} already exists for customer: ${existing.firstName} ${existing.lastName}`);
      return res.status(400).json({ 
        success: false,
        message: "Phone number already exists. Please use a different number." 
      });
    }
    console.log("✅ Phone number is available");

    // Create new customer
    const customerData = {
      salutation: salutation || "Mr.",
      firstName,
      lastName: lastName || "",
      dateOfBirth: dateOfBirth || null,
      phone,
      whatsappNumber: whatsappNumber || phone,
      email: email || "",
      addressLine1,
      addressLine2: addressLine2 || "",
      city: city || "",
      state: state || "",
      pincode: pincode || "",
      notes: notes || ""
    };

    console.log("📦 Creating customer with data:", customerData);
    
    const newCustomer = new Customer(customerData);
    await newCustomer.save();

    console.log("\n✅ Customer created successfully:");
    console.log("   - ID:", newCustomer._id);
    console.log("   - Customer ID:", newCustomer.customerId);
    console.log("   - Name:", newCustomer.firstName, newCustomer.lastName);
    console.log("🔵 ========== CREATE CUSTOMER END ==========\n");

    res.status(201).json({
      success: true,
      message: "Customer created successfully",
      customer: newCustomer
    });
  } catch (error) {
    console.error("\n❌ ERROR IN CREATE CUSTOMER:");
    console.error("   - Name:", error.name);
    console.error("   - Message:", error.message);
    console.error("   - Stack:", error.stack);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Phone number already exists. Please use a different number."
      });
    }
    
    // Handle validation errors
    if (error.name === "ValidationError") {
      const errors = {};
      Object.keys(error.errors).forEach(key => {
        errors[key] = error.errors[key].message;
      });
      return res.status(400).json({ 
        success: false,
        message: "Validation failed", 
        errors 
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: error.message || "Failed to create customer" 
    });
  }
};

// ==================== LIST FUNCTIONS ====================

/**
 * @desc    Get all customers
 * @route   GET /api/customers/all
 * @access  Private
 */
export const getAllCustomers = async (req, res) => {
  try {
    console.log("📋 Fetching all customers...");
    
    const customers = await Customer.find()
      .sort({ createdAt: -1 });
    
    console.log(`📋 Found ${customers.length} customers`);

    res.status(200).json({
      success: true,
      count: customers.length,
      customers
    });
  } catch (error) {
    console.error("❌ Get all customers error:", error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

/**
 * @desc    Get all customers with payment summary
 * @route   GET /api/customers/with-payments
 * @access  Private
 */
export const getCustomersWithPaymentSummary = async (req, res) => {
  try {
    console.log("📋 Fetching all customers with payment summary...");
    
    const customers = await Customer.find()
      .sort({ createdAt: -1 })
      .limit(50);
    
    // Get payment summaries for all customers
    const customersWithPayments = await Promise.all(
      customers.map(async (customer) => {
        const paymentSummary = await getCustomerPaymentSummary(customer._id);
        return {
          ...customer.toObject(),
          paymentSummary
        };
      })
    );
    
    console.log(`✅ Found ${customers.length} customers with payment data`);

    res.status(200).json({
      success: true,
      count: customers.length,
      customers: customersWithPayments
    });
  } catch (error) {
    console.error("❌ Get customers with payments error:", error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// ==================== SINGLE CUSTOMER FUNCTIONS ====================

/**
 * @desc    Get customer by MongoDB ID (with payments and orders)
 * @route   GET /api/customers/:id
 * @access  Private
 */
export const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🔍 Fetching customer by ID: ${id}`);
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid customer ID format"
      });
    }
    
    const customer = await Customer.findById(id);

    if (!customer) {
      return res.status(404).json({ 
        success: false,
        message: "Customer not found" 
      });
    }

    // Get all payments
    const payments = await Payment.find({ 
      customer: id,  // ✅ FIXED: changed from customerId to customer
      isDeleted: false 
    })
    .populate('order', 'orderId orderDate status')  // ✅ FIXED: changed from orderId to order
    .sort('-paymentDate -paymentTime');

    // Get all orders
    const orders = await Order.find({ 
      customer: id,  // ✅ FIXED: changed from customerId to customer
      isActive: true 
    })
    .sort('-createdAt');

    // Get payment summary
    const paymentSummary = await getCustomerPaymentSummary(id);

    res.status(200).json({
      success: true,
      customer,
      payments,
      orders,
      paymentSummary
    });
  } catch (error) {
    console.error("❌ Get customer by ID error:", error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// ==================== UPDATE/DELETE FUNCTIONS ====================

/**
 * @desc    Update customer
 * @route   PUT /api/customers/:id
 * @access  Private
 */
export const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    console.log(`📝 Updating customer ID: ${id}`);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid customer ID format"
      });
    }

    // Remove fields that shouldn't be updated
    delete updates.customerId;
    delete updates._id;
    delete updates.createdAt;

    // Check if updating phone to an existing one
    if (updates.phone) {
      const existing = await Customer.findOne({ 
        phone: updates.phone,
        _id: { $ne: id }
      });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: "Phone number already exists. Please use a different number."
        });
      }
    }

    const customer = await Customer.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    if (!customer) {
      return res.status(404).json({ 
        success: false,
        message: "Customer not found" 
      });
    }

    res.status(200).json({
      success: true,
      message: "Customer updated successfully",
      customer
    });
  } catch (error) {
    console.error("❌ Update customer error:", error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Phone number already exists. Please use a different number."
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

/**
 * @desc    Delete customer
 * @route   DELETE /api/customers/:id
 * @access  Private (Admin only)
 */
export const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🗑️ Deleting customer ID: ${id}`);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid customer ID format"
      });
    }
    
    // Check if customer has any orders or payments
    const orders = await Order.countDocuments({ customer: id, isActive: true });  // ✅ FIXED
    const payments = await Payment.countDocuments({ customer: id, isDeleted: false });  // ✅ FIXED

    if (orders > 0 || payments > 0) {
      return res.status(400).json({ 
        success: false,
        message: "Cannot delete customer with existing orders or payments." 
      });
    }
    
    const customer = await Customer.findByIdAndDelete(id);

    if (!customer) {
      return res.status(404).json({ 
        success: false,
        message: "Customer not found" 
      });
    }

    res.status(200).json({ 
      success: true,
      message: "Customer deleted successfully"
    });
  } catch (error) {
    console.error("❌ Delete customer error:", error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// ==================== PAYMENT/ORDER SPECIFIC FUNCTIONS ====================

/**
 * @desc    Get customer payments only
 * @route   GET /api/customers/:id/payments
 * @access  Private
 */
export const getCustomerPayments = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`💰 Fetching payments for customer: ${id}`);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid customer ID format"
      });
    }
    
    const payments = await Payment.find({ 
      customer: id,  // ✅ FIXED: changed from customerId to customer
      isDeleted: false 
    })
    .populate('order', 'orderId orderDate status')  // ✅ FIXED: changed from orderId to order
    .sort('-paymentDate -paymentTime');

    res.status(200).json({
      success: true,
      payments
    });
  } catch (error) {
    console.error("❌ Get customer payments error:", error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

/**
 * @desc    Get customer orders only
 * @route   GET /api/customers/:id/orders
 * @access  Private
 */
export const getCustomerOrders = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`📦 Fetching orders for customer: ${id}`);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid customer ID format"
      });
    }
    
    const orders = await Order.find({ 
      customer: id,  // ✅ FIXED: changed from customerId to customer
      isActive: true 
    })
    .sort('-createdAt');

    res.status(200).json({
      success: true,
      orders
    });
  } catch (error) {
    console.error("❌ Get customer orders error:", error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

/**
 * @desc    Get payment statistics for a customer
 * @route   GET /api/customers/:id/payment-stats
 * @access  Private
 */
export const getCustomerPaymentStats = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`📊 Fetching payment stats for customer: ${id}`);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid customer ID format"
      });
    }
    
    const paymentSummary = await getCustomerPaymentSummary(id);

    res.status(200).json({
      success: true,
      stats: paymentSummary
    });
  } catch (error) {
    console.error("❌ Get payment stats error:", error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

/**
 * @desc    Get payment trends for a customer
 * @route   GET /api/customers/:id/payment-trends
 * @access  Private
 */
export const getCustomerPaymentTrends = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`📈 Fetching payment trends for customer: ${id}`);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid customer ID format"
      });
    }
    
    // Get payments grouped by month
    const payments = await Payment.aggregate([
      { 
        $match: { 
          customer: new mongoose.Types.ObjectId(id),  // ✅ FIXED: changed from customerId to customer
          isDeleted: false 
        } 
      },
      {
        $group: {
          _id: {
            year: { $year: "$paymentDate" },
            month: { $month: "$paymentDate" }
          },
          totalAmount: { $sum: "$amount" },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
      { $limit: 12 }
    ]);

    res.status(200).json({
      success: true,
      trends: payments
    });
  } catch (error) {
    console.error("❌ Get payment trends error:", error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// ==================== STATISTICS FUNCTIONS ====================

/**
 * @desc    Get customer statistics
 * @route   GET /api/customers/stats
 * @access  Private (Admin only)
 */
export const getCustomerStats = async (req, res) => {
  try {
    console.log("📊 Fetching customer statistics...");
    
    const totalCustomers = await Customer.countDocuments();
    
    // Get customers with orders
    const customersWithOrders = await Order.distinct('customer', { isActive: true });  // ✅ FIXED
    const activeCustomers = customersWithOrders.length;
    
    // Get payment statistics
    const paymentStats = await Payment.aggregate([
      { $match: { isDeleted: false } },
      {
        $group: {
          _id: null,
          totalPayments: { $sum: '$amount' },
          averagePayment: { $avg: '$amount' },
          totalCount: { $sum: 1 }
        }
      }
    ]);

    // Get top customers by payment
    const topCustomers = await Payment.aggregate([
      { $match: { isDeleted: false } },
      {
        $group: {
          _id: '$customer',  // ✅ FIXED: changed from customerId to customer
          totalPaid: { $sum: '$amount' },
          paymentCount: { $sum: 1 }
        }
      },
      { $sort: { totalPaid: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'customers',
          localField: '_id',
          foreignField: '_id',
          as: 'customerDetails'
        }
      },
      { $unwind: '$customerDetails' }
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalCustomers,
        activeCustomers,
        totalPayments: paymentStats[0]?.totalPayments || 0,
        averagePayment: paymentStats[0]?.averagePayment || 0,
        paymentCount: paymentStats[0]?.totalCount || 0,
        topCustomers
      }
    });
  } catch (error) {
    console.error("❌ Get customer stats error:", error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};