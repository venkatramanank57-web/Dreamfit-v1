// controllers/order.controller.js
import Order from "../models/Order.js";
import Garment from "../models/Garment.js";
import Work from "../models/Work.js";
import Customer from "../models/Customer.js";
import Payment from "../models/Payment.js";
import CuttingMaster from "../models/CuttingMaster.js";
import Tailor from "../models/Tailor.js";
import StoreKeeper from "../models/StoreKeeper.js";
import { createNotification } from "./notification.controller.js";

// ============================================
// ✅ HELPER: UPDATE ORDER PAYMENT SUMMARY
// ============================================
const updateOrderPaymentSummary = async (orderId) => {
  console.log(`\n💰 Updating payment summary for order: ${orderId}`);
  
  try {
    const order = await Order.findById(orderId);
    if (!order) return;

    // Get all completed payments for this order
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
    const totalAmount = order.priceSummary?.totalMax || 0;
    
    if (totalPaid >= totalAmount) {
      paymentStatus = totalPaid > totalAmount ? 'overpaid' : 'paid';
    } else if (totalPaid > 0) {
      paymentStatus = 'partial';
    }

    // Update order with payment summary
    order.paymentSummary = {
      totalPaid,
      lastPaymentDate: lastPayment?.paymentDate,
      lastPaymentAmount: lastPayment?.amount,
      paymentCount: payments.length,
      paymentStatus
    };
    
    // Update balance amount
    order.balanceAmount = totalAmount - totalPaid;
    
    await order.save();
    console.log(`✅ Payment summary updated: Total Paid: ₹${totalPaid}, Status: ${paymentStatus}`);
    
    return { success: true, totalPaid, paymentStatus };
  } catch (error) {
    console.error("❌ Error updating payment summary:", error);
    return { success: false, error: error.message };
  }
};

// ============================================
// ✅ OPTIMIZED HELPER: CREATE WORKS FOR ORDER
// ============================================
const createWorksForOrder = async (orderId, garments, creatorId) => {
  console.log(`\n🚀 Creating ${garments?.length || 0} works in parallel...`);
  
  try {
    if (!garments || garments.length === 0) return { success: true, works: [] };
    
    // Get all garments in ONE query
    const garmentDocs = await Garment.find({ _id: { $in: garments } }).lean();
    
    // Get cutting masters for notifications - ONE query
    const cuttingMasters = await CuttingMaster.find({ isActive: true }).lean();
    
    // Create all works in PARALLEL
    const workPromises = garmentDocs.map(garment => {
      const workId = `WRK-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      
      return Work.create({
        workId,
        order: orderId,
        garment: garment._id,
        createdBy: creatorId,
        status: "pending",
        cuttingMaster: null,
        estimatedDelivery: garment.estimatedDelivery || new Date(Date.now() + 7*24*60*60*1000)
      });
    });
    
    const works = await Promise.all(workPromises);
    console.log(`✅ Created ${works.length} works`);
    
    // Update garment references in PARALLEL
    const updatePromises = works.map(work => 
      Garment.findByIdAndUpdate(work.garment, { workId: work._id })
    );
    await Promise.all(updatePromises);
    
    // Send notifications (fire and forget - don't await)
    if (works.length > 0 && cuttingMasters.length > 0) {
      cuttingMasters.forEach(master => {
        createNotification({
          type: 'work-available',
          recipient: master._id,
          title: '🔔 New Work Available',
          message: `${works.length} new work(s) are waiting for acceptance`,
          reference: {
            orderId: orderId,
            workCount: works.length,
            workIds: works.map(w => w._id)
          },
          priority: 'high'
        }).catch(() => {});
      });
    }
    
    return { success: true, works };
  } catch (error) {
    console.error("\n❌ ERROR CREATING WORKS:", error);
    return { success: false, error: error.message };
  }
};

// ============================================
// ✅ 1. GET ORDER STATS
// ============================================
export const getOrderStats = async (req, res) => {
  console.log("\n📊 ===== GET ORDER STATS =====");
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const [todayCount, weekCount, monthCount, totalCount] = await Promise.all([
      Order.countDocuments({ createdAt: { $gte: today }, isActive: true }),
      Order.countDocuments({ createdAt: { $gte: startOfWeek }, isActive: true }),
      Order.countDocuments({ createdAt: { $gte: startOfMonth }, isActive: true }),
      Order.countDocuments({ isActive: true })
    ]);

    const statusStats = await Order.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    const paymentStats = await Order.aggregate([
      { $match: { isActive: true } },
      { $group: { 
        _id: "$paymentSummary.paymentStatus",
        count: { $sum: 1 },
        totalAmount: { $sum: "$priceSummary.totalMax" },
        totalPaid: { $sum: "$paymentSummary.totalPaid" }
      }}
    ]);

    res.status(200).json({
      success: true,
      stats: {
        today: todayCount,
        thisWeek: weekCount,
        thisMonth: monthCount,
        total: totalCount,
        statusBreakdown: statusStats,
        paymentBreakdown: paymentStats
      }
    });
  } catch (error) {
    console.error("❌ Stats Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================
// ✅ OPTIMIZED 2. CREATE ORDER (WITH PAYMENTS)
// ============================================
export const createOrder = async (req, res) => {
  console.log("\n🆕 ===== CREATE ORDER STARTED =====");
  const startTime = Date.now();
  
  try {
    const {
      customer,
      deliveryDate,
      garments,
      specialNotes,
      advancePayment,
      priceSummary,
      status,
      orderDate,
      payments = []
    } = req.body;

    // ✅ Get creator ID
    const creatorId = req.user?._id || req.user?.id;
    if (!creatorId) {
      return res.status(401).json({ 
        success: false, 
        message: "Authentication failed" 
      });
    }

    // Validate required fields
    if (!customer || !deliveryDate) {
      return res.status(400).json({ 
        success: false, 
        message: "Customer and Delivery Date are required" 
      });
    }

    // ✅ OPTIMIZED: Generate order ID without countDocuments()
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const orderId = `${day}${month}${year}-${Date.now().toString().slice(-4)}`;

    // Calculate totals from garments (BATCH query)
    let totalMin = priceSummary?.totalMin || 0;
    let totalMax = priceSummary?.totalMax || 0;
    
    if (garments && garments.length > 0) {
      // Get all garments in ONE query
      const garmentDocs = await Garment.find({ _id: { $in: garments } }).lean();
      garmentDocs.forEach(g => {
        totalMin += g.priceRange?.min || 0;
        totalMax += g.priceRange?.max || 0;
      });
    }

    // Combine payments
    let allPayments = [...payments];
    if (advancePayment?.amount > 0 && !allPayments.some(p => p.type === 'advance')) {
      allPayments.push({
        amount: advancePayment.amount,
        type: 'advance',
        method: advancePayment.method || 'cash',
        paymentDate: advancePayment.date || new Date(),
        paymentTime: new Date().toLocaleTimeString('en-US', { hour12: false }),
        notes: 'Initial advance payment'
      });
    }

    const totalInitialPaid = allPayments.reduce((sum, p) => sum + (p.amount || 0), 0);

    // ✅ CREATE ORDER
    const order = await Order.create({
      orderId,
      customer,
      deliveryDate,
      garments: garments || [],
      specialNotes,
      advancePayment: {
        amount: advancePayment?.amount || 0,
        method: advancePayment?.method || "cash",
        date: advancePayment?.date || new Date(),
      },
      priceSummary: { totalMin, totalMax },
      paymentSummary: {
        totalPaid: totalInitialPaid,
        lastPaymentDate: allPayments.length > 0 ? new Date() : null,
        lastPaymentAmount: allPayments.length > 0 ? allPayments[allPayments.length - 1].amount : 0,
        paymentCount: allPayments.length,
        paymentStatus: totalInitialPaid >= totalMax ? 'paid' : (totalInitialPaid > 0 ? 'partial' : 'pending')
      },
      balanceAmount: totalMax - totalInitialPaid,
      createdBy: creatorId,
      status: status || "draft",
      orderDate: orderDate || new Date(),
    });

    // ✅ PARALLEL OPERATIONS - Create payments and works simultaneously
    const promises = [];

    // 1. Create payments in PARALLEL - ✅ STORE FIELD REMOVED
    if (allPayments.length > 0) {
      console.log(`💰 Creating ${allPayments.length} payments in parallel...`);
      
      const paymentPromises = allPayments.map(paymentData => 
        Payment.create({
          order: order._id,
          customer: order.customer,
          amount: paymentData.amount,
          type: paymentData.type || 'advance',
          method: paymentData.method || 'cash',
          referenceNumber: paymentData.referenceNumber || '',
          paymentDate: paymentData.paymentDate || new Date(),
          paymentTime: paymentData.paymentTime || new Date().toLocaleTimeString('en-US', { hour12: false }),
          notes: paymentData.notes || '',
          receivedBy: creatorId
          // ✅ STORE FIELD REMOVED - No more 'store' field!
        })
      );
      
      promises.push(Promise.all(paymentPromises));
    }

    // 2. Create works in PARALLEL (if garments exist)
    if (garments && garments.length > 0) {
      console.log(`🔨 Creating ${garments.length} works in parallel...`);
      
      const worksPromise = createWorksForOrder(order._id, garments, creatorId);
      promises.push(worksPromise);
    }

    // Wait for all parallel operations
    await Promise.all(promises);

    // Update order status if works were created
    if (garments && garments.length > 0) {
      order.status = "confirmed";
      await order.save();
    }

    await order.populate('customer', 'name phone customerId');

    const endTime = Date.now();
    console.log(`✅ Order created in ${((endTime - startTime) / 1000).toFixed(2)} seconds`);

    res.status(201).json({ 
      success: true, 
      message: "Order created successfully",
      order 
    });
  } catch (error) {
    console.error("\n❌ CREATE ORDER ERROR:", error);
    console.error("Error stack:", error.stack);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ success: false, message: "Validation failed", errors });
    }
    
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================
// ✅ 3. GET ALL ORDERS
// ============================================
export const getAllOrders = async (req, res) => {
  console.log("\n📋 ===== GET ALL ORDERS =====");
  
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      status,
      paymentStatus,
      timeFilter = "all",
      startDate,
      endDate,
    } = req.query;

    let query = { isActive: true };

    // Search
    if (search) {
      const customerIds = await Customer.find({
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { phone: { $regex: search, $options: 'i' } }
        ]
      }).distinct('_id');
      
      query.$or = [
        { orderId: { $regex: search, $options: 'i' } },
        { customer: { $in: customerIds } }
      ];
    }

    // Status filter
    if (status && status !== "all") {
      query.status = status;
    }

    // Payment status filter
    if (paymentStatus && paymentStatus !== "all") {
      query['paymentSummary.paymentStatus'] = paymentStatus;
    }

    // Time filters
    const now = new Date();
    if (timeFilter !== "all") {
      let filterDate = new Date();
      if (timeFilter === "week") filterDate.setDate(now.getDate() - 7);
      else if (timeFilter === "month") filterDate.setMonth(now.getMonth() - 1);
      else if (timeFilter === "3m") filterDate.setMonth(now.getMonth() - 3);
      
      query.createdAt = { $gte: filterDate };
    }

    // Custom date range
    if (startDate && endDate) {
      query.createdAt = { 
        $gte: new Date(startDate), 
        $lte: new Date(endDate) 
      };
    }

    const total = await Order.countDocuments(query);

    const orders = await Order.find(query)
      .populate('customer', 'name phone customerId')
      .populate("garments")
      .populate("createdBy", "name")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({ 
      success: true, 
      orders, 
      pagination: { 
        page: parseInt(page), 
        limit: parseInt(limit), 
        total, 
        pages: Math.ceil(total / limit) 
      } 
    });
  } catch (error) {
    console.error("❌ Get all orders error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================
// ✅ 4. GET ORDER BY ID
// ============================================
export const getOrderById = async (req, res) => {
  console.log(`\n🔍 ===== GET ORDER BY ID: ${req.params.id} =====`);
  
  try {
    const order = await Order.findById(req.params.id)
      .populate('customer', 'name phone customerId email address addressLine1 addressLine2 city state pincode')
      .populate({
        path: "garments",
        populate: [
          { path: "category", select: "name" },
          { path: "item", select: "name" },
          { path: "workId" }
        ]
      })
      .populate("createdBy", "name");

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // Get payments
    const payments = await Payment.find({ 
      order: order._id,
      isDeleted: false 
    })
    .populate('receivedBy', 'name')
    .sort('-paymentDate -paymentTime');

    // Get works
    const works = await Work.find({ order: order._id, isActive: true })
      .populate('garment', 'name item category')
      .populate('cuttingMaster', 'name');

    res.json({ 
      success: true, 
      order,
      payments,
      works
    });
  } catch (error) {
    console.error("❌ Get order error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================
// ✅ 5. UPDATE ORDER
// ============================================
export const updateOrder = async (req, res) => {
  console.log(`\n📝 ===== UPDATE ORDER: ${req.params.id} =====`);
  
  try {
    const { id } = req.params;
    const {
      deliveryDate,
      specialNotes,
      advancePayment,
      priceSummary,
      status,
      newGarments
    } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // Update fields
    if (deliveryDate) order.deliveryDate = deliveryDate;
    if (specialNotes !== undefined) order.specialNotes = specialNotes;
    
    if (advancePayment) {
      order.advancePayment = {
        amount: advancePayment.amount !== undefined ? advancePayment.amount : order.advancePayment.amount,
        method: advancePayment.method || order.advancePayment.method,
        date: advancePayment.date || order.advancePayment.date || new Date()
      };
    }
    
    if (priceSummary) {
      order.priceSummary = {
        totalMin: priceSummary.totalMin !== undefined ? priceSummary.totalMin : order.priceSummary.totalMin,
        totalMax: priceSummary.totalMax !== undefined ? priceSummary.totalMax : order.priceSummary.totalMax
      };
    }
    
    if (status) order.status = status;

    // Add new garments
    if (newGarments && newGarments.length > 0) {
      order.garments = [...order.garments, ...newGarments];
      
      const creatorId = req.user?._id || req.user?.id;
      await createWorksForOrder(order._id, newGarments, creatorId);
    }

    await order.save();
    
    // Update payment summary
    await updateOrderPaymentSummary(order._id);
    
    res.json({ success: true, message: "Order updated successfully", order });
  } catch (error) {
    console.error("❌ Update error:", error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ success: false, message: "Validation failed", errors });
    }
    
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================
// ✅ 6. UPDATE ORDER STATUS
// ============================================
export const updateOrderStatus = async (req, res) => {
  console.log(`\n🔄 ===== UPDATE ORDER STATUS: ${req.params.id} =====`);
  
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id, 
      { status }, 
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.json({ success: true, message: "Order status updated", order });
  } catch (error) {
    console.error("❌ Update status error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================
// ✅ 7. DELETE ORDER (SOFT DELETE)
// ============================================
export const deleteOrder = async (req, res) => {
  console.log(`\n🗑️ ===== DELETE ORDER: ${req.params.id} =====`);
  
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // Soft delete related records
    await Garment.updateMany({ _id: { $in: order.garments } }, { isActive: false });
    await Work.updateMany({ order: order._id }, { isActive: false });
    await Payment.updateMany({ order: order._id }, { isDeleted: true });

    order.isActive = false;
    await order.save();

    res.json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    console.error("❌ Delete error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================
// ✅ 8. ADD PAYMENT TO ORDER - ✅ STORE FIELD REMOVED
// ============================================
export const addPaymentToOrder = async (req, res) => {
  console.log(`\n💰 ===== ADD PAYMENT TO ORDER: ${req.params.id} =====`);
  
  try {
    const { id } = req.params;
    const paymentData = req.body;
    
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    
    const creatorId = req.user?._id || req.user?.id;
    
    // Create payment - ✅ STORE FIELD REMOVED
    const payment = await Payment.create({
      order: order._id,
      customer: order.customer,
      amount: paymentData.amount,
      type: paymentData.type || 'advance',
      method: paymentData.method || 'cash',
      referenceNumber: paymentData.referenceNumber || '',
      paymentDate: paymentData.paymentDate || new Date(),
      paymentTime: paymentData.paymentTime || new Date().toLocaleTimeString('en-US', { hour12: false }),
      notes: paymentData.notes || '',
      receivedBy: creatorId
      // ✅ STORE FIELD REMOVED - No more 'store' field!
    });
    
    // Update order payment summary
    await updateOrderPaymentSummary(order._id);
    
    res.status(201).json({ success: true, message: "Payment added", payment });
  } catch (error) {
    console.error("❌ Add payment error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================
// ✅ 9. GET ORDER PAYMENTS
// ============================================
export const getOrderPayments = async (req, res) => {
  console.log(`\n💰 ===== GET ORDER PAYMENTS: ${req.params.id} =====`);
  
  try {
    const payments = await Payment.find({ 
      order: req.params.id,
      isDeleted: false 
    })
    .populate('receivedBy', 'name')
    .sort('-paymentDate -paymentTime');
    
    res.json({ success: true, payments });
  } catch (error) {
    console.error("❌ Get payments error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================
// ✅ 10. GET DASHBOARD DATA
// ============================================
export const getDashboardData = async (req, res) => {
  console.log("\n📊 ===== GET DASHBOARD DATA =====");
  
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Today's orders
    const todayOrders = await Order.find({
      createdAt: { $gte: today },
      isActive: true
    }).populate('customer', 'name');

    // Pending deliveries
    const pendingDeliveries = await Order.find({
      deliveryDate: { $lt: new Date() },
      status: { $nin: ['delivered', 'cancelled'] },
      isActive: true
    }).populate('customer', 'name phone');

    // Recent orders
    const recentOrders = await Order.find({ isActive: true })
      .populate('customer', 'name')
      .sort({ createdAt: -1 })
      .limit(10);

    // Payment collection today
    const todayPayments = await Payment.find({
      paymentDate: { $gte: today },
      isDeleted: false
    });

    const todayCollection = todayPayments.reduce((sum, p) => sum + p.amount, 0);

    res.json({
      success: true,
      dashboard: {
        todayOrders: {
          count: todayOrders.length,
          orders: todayOrders
        },
        pendingDeliveries: {
          count: pendingDeliveries.length,
          orders: pendingDeliveries
        },
        recentOrders,
        todayCollection
      }
    });
  } catch (error) {
    console.error("❌ Dashboard error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add this to your order.controller.js file

/**
 * @desc    Get all orders for a specific customer
 * @route   GET /api/orders/customer/:customerId
 * @access  Private (Admin, Store Keeper, Cutting Master)
 */
export const getOrdersByCustomer = async (req, res) => {
  try {
    const { customerId } = req.params;
    
    console.log(`🔍 Fetching orders for customer: ${customerId}`);
    
    // Find all orders for this customer that are active
    const orders = await Order.find({ 
      customer: customerId,
      isActive: true 
    })
    .populate('customer', 'name phone email customerId')
    .populate('garments')
    .sort('-createdAt'); // Most recent first
    
    console.log(`✅ Found ${orders.length} orders for customer ${customerId}`);
    
    res.status(200).json({
      success: true,
      count: orders.length,
      orders: orders
    });
    
  } catch (error) {
    console.error(`❌ Error fetching orders for customer ${req.params.customerId}:`, error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};