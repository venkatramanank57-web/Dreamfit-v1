// // controllers/order.controller.js
// import Order from "../models/Order.js";
// import Garment from "../models/Garment.js";
// import Work from "../models/Work.js";
// import Customer from "../models/Customer.js";
// import Payment from "../models/Payment.js";
// import CuttingMaster from "../models/CuttingMaster.js";
// import Tailor from "../models/Tailor.js";
// import StoreKeeper from "../models/StoreKeeper.js";
// import { createNotification } from "./notification.controller.js";

// // ============================================
// // ✅ HELPER: UPDATE ORDER PAYMENT SUMMARY
// // ============================================
// const updateOrderPaymentSummary = async (orderId) => {
//   console.log(`\n💰 Updating payment summary for order: ${orderId}`);
  
//   try {
//     const order = await Order.findById(orderId);
//     if (!order) return;

//     // Get all completed payments for this order
//     const payments = await Payment.find({ 
//       order: orderId, 
//       isDeleted: false,
//       type: { $in: ['advance', 'full', 'partial', 'extra'] }
//     });

//     // Calculate totals
//     const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
//     const lastPayment = payments.sort((a, b) => 
//       new Date(b.paymentDate) - new Date(a.paymentDate)
//     )[0];

//     // Determine payment status
//     let paymentStatus = 'pending';
//     const totalAmount = order.priceSummary?.totalMax || 0;
    
//     if (totalPaid >= totalAmount) {
//       paymentStatus = totalPaid > totalAmount ? 'overpaid' : 'paid';
//     } else if (totalPaid > 0) {
//       paymentStatus = 'partial';
//     }

//     // Update order with payment summary
//     order.paymentSummary = {
//       totalPaid,
//       lastPaymentDate: lastPayment?.paymentDate,
//       lastPaymentAmount: lastPayment?.amount,
//       paymentCount: payments.length,
//       paymentStatus
//     };
    
//     // Update balance amount
//     order.balanceAmount = totalAmount - totalPaid;
    
//     await order.save();
//     console.log(`✅ Payment summary updated: Total Paid: ₹${totalPaid}, Status: ${paymentStatus}`);
    
//     return { success: true, totalPaid, paymentStatus };
//   } catch (error) {
//     console.error("❌ Error updating payment summary:", error);
//     return { success: false, error: error.message };
//   }
// };

// // ============================================
// // ✅ OPTIMIZED HELPER: CREATE WORKS FOR ORDER
// // ============================================
// const createWorksForOrder = async (orderId, garments, creatorId) => {
//   console.log(`\n🚀 Creating ${garments?.length || 0} works in parallel...`);
  
//   try {
//     if (!garments || garments.length === 0) return { success: true, works: [] };
    
//     // Get all garments in ONE query
//     const garmentDocs = await Garment.find({ _id: { $in: garments } }).lean();
    
//     // Get cutting masters for notifications - ONE query
//     const cuttingMasters = await CuttingMaster.find({ isActive: true }).lean();
    
//     // Create all works in PARALLEL
//     const workPromises = garmentDocs.map(garment => {
//       const workId = `WRK-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      
//       return Work.create({
//         workId,
//         order: orderId,
//         garment: garment._id,
//         createdBy: creatorId,
//         status: "pending",
//         cuttingMaster: null,
//         estimatedDelivery: garment.estimatedDelivery || new Date(Date.now() + 7*24*60*60*1000)
//       });
//     });
    
//     const works = await Promise.all(workPromises);
//     console.log(`✅ Created ${works.length} works`);
    
//     // Update garment references in PARALLEL
//     const updatePromises = works.map(work => 
//       Garment.findByIdAndUpdate(work.garment, { workId: work._id })
//     );
//     await Promise.all(updatePromises);
    
//     // Send notifications (fire and forget - don't await)
//     if (works.length > 0 && cuttingMasters.length > 0) {
//       cuttingMasters.forEach(master => {
//         createNotification({
//           type: 'work-available',
//           recipient: master._id,
//           title: '🔔 New Work Available',
//           message: `${works.length} new work(s) are waiting for acceptance`,
//           reference: {
//             orderId: orderId,
//             workCount: works.length,
//             workIds: works.map(w => w._id)
//           },
//           priority: 'high'
//         }).catch(() => {});
//       });
//     }
    
//     return { success: true, works };
//   } catch (error) {
//     console.error("\n❌ ERROR CREATING WORKS:", error);
//     return { success: false, error: error.message };
//   }
// };

// // ============================================
// // ✅ 1. GET ORDER STATS
// // ============================================
// export const getOrderStats = async (req, res) => {
//   console.log("\n📊 ===== GET ORDER STATS =====");
//   try {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     const startOfWeek = new Date(today);
//     startOfWeek.setDate(today.getDate() - today.getDay());

//     const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

//     const [todayCount, weekCount, monthCount, totalCount] = await Promise.all([
//       Order.countDocuments({ createdAt: { $gte: today }, isActive: true }),
//       Order.countDocuments({ createdAt: { $gte: startOfWeek }, isActive: true }),
//       Order.countDocuments({ createdAt: { $gte: startOfMonth }, isActive: true }),
//       Order.countDocuments({ isActive: true })
//     ]);

//     const statusStats = await Order.aggregate([
//       { $match: { isActive: true } },
//       { $group: { _id: "$status", count: { $sum: 1 } } }
//     ]);

//     const paymentStats = await Order.aggregate([
//       { $match: { isActive: true } },
//       { $group: { 
//         _id: "$paymentSummary.paymentStatus",
//         count: { $sum: 1 },
//         totalAmount: { $sum: "$priceSummary.totalMax" },
//         totalPaid: { $sum: "$paymentSummary.totalPaid" }
//       }}
//     ]);

//     res.status(200).json({
//       success: true,
//       stats: {
//         today: todayCount,
//         thisWeek: weekCount,
//         thisMonth: monthCount,
//         total: totalCount,
//         statusBreakdown: statusStats,
//         paymentBreakdown: paymentStats
//       }
//     });
//   } catch (error) {
//     console.error("❌ Stats Error:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // ============================================
// // ✅ OPTIMIZED 2. CREATE ORDER (WITH PAYMENTS)
// // ============================================
// export const createOrder = async (req, res) => {
//   console.log("\n🆕 ===== CREATE ORDER STARTED =====");
//   const startTime = Date.now();
  
//   try {
//     const {
//       customer,
//       deliveryDate,
//       garments,
//       specialNotes,
//       advancePayment,
//       priceSummary,
//       status,
//       orderDate,
//       payments = []
//     } = req.body;

//     // ✅ Get creator ID
//     const creatorId = req.user?._id || req.user?.id;
//     if (!creatorId) {
//       return res.status(401).json({ 
//         success: false, 
//         message: "Authentication failed" 
//       });
//     }

//     // Validate required fields
//     if (!customer || !deliveryDate) {
//       return res.status(400).json({ 
//         success: false, 
//         message: "Customer and Delivery Date are required" 
//       });
//     }

//     // ✅ OPTIMIZED: Generate order ID without countDocuments()
//     const date = new Date();
//     const day = String(date.getDate()).padStart(2, '0');
//     const month = String(date.getMonth() + 1).padStart(2, '0');
//     const year = date.getFullYear();
//     const orderId = `${day}${month}${year}-${Date.now().toString().slice(-4)}`;

//     // Calculate totals from garments (BATCH query)
//     let totalMin = priceSummary?.totalMin || 0;
//     let totalMax = priceSummary?.totalMax || 0;
    
//     if (garments && garments.length > 0) {
//       // Get all garments in ONE query
//       const garmentDocs = await Garment.find({ _id: { $in: garments } }).lean();
//       garmentDocs.forEach(g => {
//         totalMin += g.priceRange?.min || 0;
//         totalMax += g.priceRange?.max || 0;
//       });
//     }

//     // Combine payments
//     let allPayments = [...payments];
//     if (advancePayment?.amount > 0 && !allPayments.some(p => p.type === 'advance')) {
//       allPayments.push({
//         amount: advancePayment.amount,
//         type: 'advance',
//         method: advancePayment.method || 'cash',
//         paymentDate: advancePayment.date || new Date(),
//         paymentTime: new Date().toLocaleTimeString('en-US', { hour12: false }),
//         notes: 'Initial advance payment'
//       });
//     }

//     const totalInitialPaid = allPayments.reduce((sum, p) => sum + (p.amount || 0), 0);

//     // ✅ CREATE ORDER
//     const order = await Order.create({
//       orderId,
//       customer,
//       deliveryDate,
//       garments: garments || [],
//       specialNotes,
//       advancePayment: {
//         amount: advancePayment?.amount || 0,
//         method: advancePayment?.method || "cash",
//         date: advancePayment?.date || new Date(),
//       },
//       priceSummary: { totalMin, totalMax },
//       paymentSummary: {
//         totalPaid: totalInitialPaid,
//         lastPaymentDate: allPayments.length > 0 ? new Date() : null,
//         lastPaymentAmount: allPayments.length > 0 ? allPayments[allPayments.length - 1].amount : 0,
//         paymentCount: allPayments.length,
//         paymentStatus: totalInitialPaid >= totalMax ? 'paid' : (totalInitialPaid > 0 ? 'partial' : 'pending')
//       },
//       balanceAmount: totalMax - totalInitialPaid,
//       createdBy: creatorId,
//       status: status || "draft",
//       orderDate: orderDate || new Date(),
//     });

//     // ✅ PARALLEL OPERATIONS - Create payments and works simultaneously
//     const promises = [];

//     // 1. Create payments in PARALLEL - ✅ STORE FIELD REMOVED
//     if (allPayments.length > 0) {
//       console.log(`💰 Creating ${allPayments.length} payments in parallel...`);
      
//       const paymentPromises = allPayments.map(paymentData => 
//         Payment.create({
//           order: order._id,
//           customer: order.customer,
//           amount: paymentData.amount,
//           type: paymentData.type || 'advance',
//           method: paymentData.method || 'cash',
//           referenceNumber: paymentData.referenceNumber || '',
//           paymentDate: paymentData.paymentDate || new Date(),
//           paymentTime: paymentData.paymentTime || new Date().toLocaleTimeString('en-US', { hour12: false }),
//           notes: paymentData.notes || '',
//           receivedBy: creatorId
//           // ✅ STORE FIELD REMOVED - No more 'store' field!
//         })
//       );
      
//       promises.push(Promise.all(paymentPromises));
//     }

//     // 2. Create works in PARALLEL (if garments exist)
//     if (garments && garments.length > 0) {
//       console.log(`🔨 Creating ${garments.length} works in parallel...`);
      
//       const worksPromise = createWorksForOrder(order._id, garments, creatorId);
//       promises.push(worksPromise);
//     }

//     // Wait for all parallel operations
//     await Promise.all(promises);

//     // Update order status if works were created
//     if (garments && garments.length > 0) {
//       order.status = "confirmed";
//       await order.save();
//     }

//     await order.populate('customer', 'name phone customerId');

//     const endTime = Date.now();
//     console.log(`✅ Order created in ${((endTime - startTime) / 1000).toFixed(2)} seconds`);

//     res.status(201).json({ 
//       success: true, 
//       message: "Order created successfully",
//       order 
//     });
//   } catch (error) {
//     console.error("\n❌ CREATE ORDER ERROR:", error);
//     console.error("Error stack:", error.stack);
    
//     if (error.name === 'ValidationError') {
//       const errors = Object.values(error.errors).map(err => err.message);
//       return res.status(400).json({ success: false, message: "Validation failed", errors });
//     }
    
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // ============================================
// // ✅ 3. GET ALL ORDERS
// // ============================================
// export const getAllOrders = async (req, res) => {
//   console.log("\n📋 ===== GET ALL ORDERS =====");
  
//   try {
//     const {
//       page = 1,
//       limit = 10,
//       search = "",
//       status,
//       paymentStatus,
//       timeFilter = "all",
//       startDate,
//       endDate,
//     } = req.query;

//     let query = { isActive: true };

//     // Search
//     if (search) {
//       const customerIds = await Customer.find({
//         $or: [
//           { name: { $regex: search, $options: 'i' } },
//           { phone: { $regex: search, $options: 'i' } }
//         ]
//       }).distinct('_id');
      
//       query.$or = [
//         { orderId: { $regex: search, $options: 'i' } },
//         { customer: { $in: customerIds } }
//       ];
//     }

//     // Status filter
//     if (status && status !== "all") {
//       query.status = status;
//     }

//     // Payment status filter
//     if (paymentStatus && paymentStatus !== "all") {
//       query['paymentSummary.paymentStatus'] = paymentStatus;
//     }

//     // Time filters
//     const now = new Date();
//     if (timeFilter !== "all") {
//       let filterDate = new Date();
//       if (timeFilter === "week") filterDate.setDate(now.getDate() - 7);
//       else if (timeFilter === "month") filterDate.setMonth(now.getMonth() - 1);
//       else if (timeFilter === "3m") filterDate.setMonth(now.getMonth() - 3);
      
//       query.createdAt = { $gte: filterDate };
//     }

//     // Custom date range
//     if (startDate && endDate) {
//       query.createdAt = { 
//         $gte: new Date(startDate), 
//         $lte: new Date(endDate) 
//       };
//     }

//     const total = await Order.countDocuments(query);

//     const orders = await Order.find(query)
//       .populate('customer', 'name phone customerId')
//       .populate("garments")
//       .populate("createdBy", "name")
//       .sort({ createdAt: -1 })
//       .skip((page - 1) * limit)
//       .limit(parseInt(limit));

//     res.json({ 
//       success: true, 
//       orders, 
//       pagination: { 
//         page: parseInt(page), 
//         limit: parseInt(limit), 
//         total, 
//         pages: Math.ceil(total / limit) 
//       } 
//     });
//   } catch (error) {
//     console.error("❌ Get all orders error:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // ============================================
// // ✅ 4. GET ORDER BY ID
// // ============================================
// export const getOrderById = async (req, res) => {
//   console.log(`\n🔍 ===== GET ORDER BY ID: ${req.params.id} =====`);
  
//   try {
//     const order = await Order.findById(req.params.id)
//       .populate('customer', 'name phone customerId email address addressLine1 addressLine2 city state pincode')
//       .populate({
//         path: "garments",
//         populate: [
//           { path: "category", select: "name" },
//           { path: "item", select: "name" },
//           { path: "workId" }
//         ]
//       })
//       .populate("createdBy", "name");

//     if (!order) {
//       return res.status(404).json({ success: false, message: "Order not found" });
//     }

//     // Get payments
//     const payments = await Payment.find({ 
//       order: order._id,
//       isDeleted: false 
//     })
//     .populate('receivedBy', 'name')
//     .sort('-paymentDate -paymentTime');

//     // Get works
//     const works = await Work.find({ order: order._id, isActive: true })
//       .populate('garment', 'name item category')
//       .populate('cuttingMaster', 'name');

//     res.json({ 
//       success: true, 
//       order,
//       payments,
//       works
//     });
//   } catch (error) {
//     console.error("❌ Get order error:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // ============================================
// // ✅ 5. UPDATE ORDER
// // ============================================
// export const updateOrder = async (req, res) => {
//   console.log(`\n📝 ===== UPDATE ORDER: ${req.params.id} =====`);
  
//   try {
//     const { id } = req.params;
//     const {
//       deliveryDate,
//       specialNotes,
//       advancePayment,
//       priceSummary,
//       status,
//       newGarments
//     } = req.body;

//     const order = await Order.findById(id);
//     if (!order) {
//       return res.status(404).json({ success: false, message: "Order not found" });
//     }

//     // Update fields
//     if (deliveryDate) order.deliveryDate = deliveryDate;
//     if (specialNotes !== undefined) order.specialNotes = specialNotes;
    
//     if (advancePayment) {
//       order.advancePayment = {
//         amount: advancePayment.amount !== undefined ? advancePayment.amount : order.advancePayment.amount,
//         method: advancePayment.method || order.advancePayment.method,
//         date: advancePayment.date || order.advancePayment.date || new Date()
//       };
//     }
    
//     if (priceSummary) {
//       order.priceSummary = {
//         totalMin: priceSummary.totalMin !== undefined ? priceSummary.totalMin : order.priceSummary.totalMin,
//         totalMax: priceSummary.totalMax !== undefined ? priceSummary.totalMax : order.priceSummary.totalMax
//       };
//     }
    
//     if (status) order.status = status;

//     // Add new garments
//     if (newGarments && newGarments.length > 0) {
//       order.garments = [...order.garments, ...newGarments];
      
//       const creatorId = req.user?._id || req.user?.id;
//       await createWorksForOrder(order._id, newGarments, creatorId);
//     }

//     await order.save();
    
//     // Update payment summary
//     await updateOrderPaymentSummary(order._id);
    
//     res.json({ success: true, message: "Order updated successfully", order });
//   } catch (error) {
//     console.error("❌ Update error:", error);
    
//     if (error.name === 'ValidationError') {
//       const errors = Object.values(error.errors).map(err => err.message);
//       return res.status(400).json({ success: false, message: "Validation failed", errors });
//     }
    
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // ============================================
// // ✅ 6. UPDATE ORDER STATUS (UPDATED WITH ready-to-delivery)
// // ============================================
// export const updateOrderStatus = async (req, res) => {
//   console.log(`\n🔄 ===== UPDATE ORDER STATUS: ${req.params.id} =====`);
//   console.log("New Status:", req.body.status);
  
//   try {
//     const { status } = req.body;
//     const { id } = req.params;
//     const userId = req.user?._id || req.user?.id;
    
//     // ✅ Validate status
//     const validStatuses = ["draft", "confirmed", "in-progress", "ready-to-delivery", "delivered", "cancelled"];
//     if (!validStatuses.includes(status)) {
//       return res.status(400).json({ 
//         success: false, 
//         message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` 
//       });
//     }
    
//     // ✅ Find order with population
//     const order = await Order.findById(id)
//       .populate('customer', 'name phone')
//       .populate('garments');
      
//     if (!order) {
//       return res.status(404).json({ success: false, message: "Order not found" });
//     }
    
//     // ✅ Check valid transition
//     const validTransitions = {
//       'draft': ['confirmed', 'cancelled'],
//       'confirmed': ['in-progress', 'cancelled'],
//       'in-progress': ['ready-to-delivery', 'cancelled'],
//       'ready-to-delivery': ['delivered', 'cancelled'],
//       'delivered': [],
//       'cancelled': []
//     };
    
//     if (!validTransitions[order.status]?.includes(status)) {
//       return res.status(400).json({ 
//         success: false, 
//         message: `Cannot transition from ${order.status} to ${status}` 
//       });
//     }
    
//     // Store old status
//     const oldStatus = order.status;
    
//     // ✅ Update status
//     order.status = status;
//     await order.save();
    
//     console.log(`✅ Status updated: ${oldStatus} → ${status}`);
    
//     // ============================================
//     // ✅ NOTIFICATIONS BASED ON STATUS
//     // ============================================
    
//     // 1. READY-TO-DELIVERY - Notify Store Keepers
//     if (status === 'ready-to-delivery') {
//       console.log("📦 Order ready for delivery - Sending notifications");
      
//       const storeKeepers = await StoreKeeper.find({ isActive: true }).lean();
      
//       storeKeepers.forEach(keeper => {
//         createNotification({
//           type: 'delivery-ready',
//           recipient: keeper._id,
//           title: '📦 Order Ready for Delivery',
//           message: `Order #${order.orderId} for ${order.customer?.name || 'Customer'} is ready for delivery`,
//           reference: {
//             orderId: order._id,
//             orderNumber: order.orderId,
//             customerName: order.customer?.name
//           },
//           priority: 'high'
//         }).catch(() => {});
//       });
      
//       console.log(`📢 Notified ${storeKeepers.length} store keepers`);
//     }
    
//     // 2. DELIVERED - Update payment & notify
//     else if (status === 'delivered') {
//       console.log("✅ Order delivered - Updating records");
      
//       // Update payment summary
//       await updateOrderPaymentSummary(order._id);
      
//       const storeKeepers = await StoreKeeper.find({ isActive: true }).lean();
      
//       storeKeepers.forEach(keeper => {
//         createNotification({
//           type: 'order-delivered',
//           recipient: keeper._id,
//           title: '✅ Order Delivered',
//           message: `Order #${order.orderId} has been delivered to ${order.customer?.name || 'Customer'}`,
//           reference: {
//             orderId: order._id,
//             orderNumber: order.orderId
//           },
//           priority: 'medium'
//         }).catch(() => {});
//       });
//     }
    
//     // 3. CANCELLED - Update related records
//     else if (status === 'cancelled') {
//       console.log("❌ Order cancelled - Updating related works");
      
//       // Cancel all associated works
//       await Work.updateMany(
//         { order: order._id, status: { $ne: 'completed' } },
//         { status: 'cancelled', isActive: false }
//       );
      
//       const storeKeepers = await StoreKeeper.find({ isActive: true }).lean();
      
//       storeKeepers.forEach(keeper => {
//         createNotification({
//           type: 'order-cancelled',
//           recipient: keeper._id,
//           title: '❌ Order Cancelled',
//           message: `Order #${order.orderId} for ${order.customer?.name || 'Customer'} has been cancelled`,
//           reference: {
//             orderId: order._id,
//             orderNumber: order.orderId
//           },
//           priority: 'high'
//         }).catch(() => {});
//       });
//     }
    
//     // ============================================
//     // ✅ UPDATE RELATED WORKS
//     // ============================================
    
//     try {
//       if (status === 'in-progress') {
//         // Update pending works to in-progress
//         await Work.updateMany(
//           { order: order._id, status: 'pending' },
//           { status: 'in-progress' }
//         );
//         console.log("🔨 Updated related works to in-progress");
//       }
//       else if (status === 'delivered') {
//         // Mark all works as completed
//         await Work.updateMany(
//           { order: order._id, status: { $ne: 'completed' } },
//           { status: 'completed' }
//         );
//         console.log("✅ Updated related works to completed");
//       }
//       else if (status === 'ready-to-delivery') {
//         // Update works to ready status if you have that
//         console.log("📦 Works ready for delivery");
//       }
//     } catch (workErr) {
//       console.log("Work update error:", workErr.message);
//       // Don't fail the main operation
//     }
    
//     // ✅ Get updated order
//     const updatedOrder = await Order.findById(id)
//       .populate('customer', 'name phone customerId')
//       .populate('garments');
    
//     res.json({ 
//       success: true, 
//       message: `Order status updated from ${oldStatus} to ${status}`,
//       order: updatedOrder 
//     });
    
//   } catch (error) {
//     console.error("❌ Update status error:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // ============================================
// // ✅ 7. DELETE ORDER (SOFT DELETE)
// // ============================================
// export const deleteOrder = async (req, res) => {
//   console.log(`\n🗑️ ===== DELETE ORDER: ${req.params.id} =====`);
  
//   try {
//     const order = await Order.findById(req.params.id);
//     if (!order) {
//       return res.status(404).json({ success: false, message: "Order not found" });
//     }

//     // Soft delete related records
//     await Garment.updateMany({ _id: { $in: order.garments } }, { isActive: false });
//     await Work.updateMany({ order: order._id }, { isActive: false });
//     await Payment.updateMany({ order: order._id }, { isDeleted: true });

//     order.isActive = false;
//     await order.save();

//     res.json({ success: true, message: "Order deleted successfully" });
//   } catch (error) {
//     console.error("❌ Delete error:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // ============================================
// // ✅ 8. ADD PAYMENT TO ORDER - ✅ STORE FIELD REMOVED
// // ============================================
// export const addPaymentToOrder = async (req, res) => {
//   console.log(`\n💰 ===== ADD PAYMENT TO ORDER: ${req.params.id} =====`);
  
//   try {
//     const { id } = req.params;
//     const paymentData = req.body;
    
//     const order = await Order.findById(id);
//     if (!order) {
//       return res.status(404).json({ success: false, message: "Order not found" });
//     }
    
//     const creatorId = req.user?._id || req.user?.id;
    
//     // Create payment - ✅ STORE FIELD REMOVED
//     const payment = await Payment.create({
//       order: order._id,
//       customer: order.customer,
//       amount: paymentData.amount,
//       type: paymentData.type || 'advance',
//       method: paymentData.method || 'cash',
//       referenceNumber: paymentData.referenceNumber || '',
//       paymentDate: paymentData.paymentDate || new Date(),
//       paymentTime: paymentData.paymentTime || new Date().toLocaleTimeString('en-US', { hour12: false }),
//       notes: paymentData.notes || '',
//       receivedBy: creatorId
//       // ✅ STORE FIELD REMOVED - No more 'store' field!
//     });
    
//     // Update order payment summary
//     await updateOrderPaymentSummary(order._id);
    
//     res.status(201).json({ success: true, message: "Payment added", payment });
//   } catch (error) {
//     console.error("❌ Add payment error:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // ============================================
// // ✅ 9. GET ORDER PAYMENTS
// // ============================================
// export const getOrderPayments = async (req, res) => {
//   console.log(`\n💰 ===== GET ORDER PAYMENTS: ${req.params.id} =====`);
  
//   try {
//     const payments = await Payment.find({ 
//       order: req.params.id,
//       isDeleted: false 
//     })
//     .populate('receivedBy', 'name')
//     .sort('-paymentDate -paymentTime');
    
//     res.json({ success: true, payments });
//   } catch (error) {
//     console.error("❌ Get payments error:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // ============================================
// // ✅ 10. GET DASHBOARD DATA
// // ============================================
// export const getDashboardData = async (req, res) => {
//   console.log("\n📊 ===== GET DASHBOARD DATA =====");
  
//   try {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     // Today's orders
//     const todayOrders = await Order.find({
//       createdAt: { $gte: today },
//       isActive: true
//     }).populate('customer', 'name');

//     // Pending deliveries - UPDATED to include ready-to-delivery
//     const pendingDeliveries = await Order.find({
//       deliveryDate: { $lt: new Date() },
//       status: { $nin: ['delivered', 'cancelled'] },
//       isActive: true
//     }).populate('customer', 'name phone');

//     // Orders ready for delivery - NEW
//     const readyForDelivery = await Order.find({
//       status: 'ready-to-delivery',
//       isActive: true
//     }).populate('customer', 'name phone');

//     // Recent orders
//     const recentOrders = await Order.find({ isActive: true })
//       .populate('customer', 'name')
//       .sort({ createdAt: -1 })
//       .limit(10);

//     // Payment collection today
//     const todayPayments = await Payment.find({
//       paymentDate: { $gte: today },
//       isDeleted: false
//     });

//     const todayCollection = todayPayments.reduce((sum, p) => sum + p.amount, 0);

//     res.json({
//       success: true,
//       dashboard: {
//         todayOrders: {
//           count: todayOrders.length,
//           orders: todayOrders
//         },
//         pendingDeliveries: {
//           count: pendingDeliveries.length,
//           orders: pendingDeliveries
//         },
//         readyForDelivery: {
//           count: readyForDelivery.length,
//           orders: readyForDelivery
//         },
//         recentOrders,
//         todayCollection
//       }
//     });
//   } catch (error) {
//     console.error("❌ Dashboard error:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // ============================================
// // ✅ 11. GET ORDERS BY CUSTOMER
// // ============================================
// export const getOrdersByCustomer = async (req, res) => {
//   try {
//     const { customerId } = req.params;
    
//     console.log(`🔍 Fetching orders for customer: ${customerId}`);
    
//     // Find all orders for this customer that are active
//     const orders = await Order.find({ 
//       customer: customerId,
//       isActive: true 
//     })
//     .populate('customer', 'name phone email customerId')
//     .populate('garments')
//     .sort('-createdAt'); // Most recent first
    
//     console.log(`✅ Found ${orders.length} orders for customer ${customerId}`);
    
//     res.status(200).json({
//       success: true,
//       count: orders.length,
//       orders: orders
//     });
    
//   } catch (error) {
//     console.error(`❌ Error fetching orders for customer ${req.params.customerId}:`, error);
//     res.status(500).json({
//       success: false,
//       error: error.message
//     });
//   }
// };

// // ============================================
// // ✅ 12. GET READY TO DELIVERY ORDERS (NEW)
// // ============================================
// export const getReadyToDeliveryOrders = async (req, res) => {
//   console.log("\n📦 ===== GET READY TO DELIVERY ORDERS =====");
  
//   try {
//     const orders = await Order.find({ 
//       status: 'ready-to-delivery',
//       isActive: true 
//     })
//     .populate('customer', 'name phone')
//     .populate('garments')
//     .sort({ updatedAt: -1 });
    
//     res.json({
//       success: true,
//       count: orders.length,
//       orders
//     });
//   } catch (error) {
//     console.error("❌ Get ready to delivery error:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };





// // controllers/order.controller.js
// import Order from "../models/Order.js";
// import Garment from "../models/Garment.js";
// import Work from "../models/Work.js";
// import Customer from "../models/Customer.js";
// import Payment from "../models/Payment.js";
// import CuttingMaster from "../models/CuttingMaster.js";
// import Tailor from "../models/Tailor.js";
// import StoreKeeper from "../models/StoreKeeper.js";
// import { createNotification } from "./notification.controller.js";

// // ============================================
// // 🔍 DEBUG HELPER FOR NOTIFICATIONS
// // ============================================
// const debugNotification = (stage, data) => {
//   console.log("\n🔔🔔🔔 NOTIFICATION DEBUG 🔔🔔🔔");
//   console.log(`Stage: ${stage}`);
//   console.log("Data:", JSON.stringify(data, null, 2));
//   console.log("🔔🔔🔔🔔🔔🔔🔔🔔🔔🔔🔔🔔🔔🔔🔔\n");
// };

// // ============================================
// // ✅ HELPER: UPDATE ORDER PAYMENT SUMMARY
// // ============================================
// const updateOrderPaymentSummary = async (orderId) => {
//   console.log(`\n💰 Updating payment summary for order: ${orderId}`);
  
//   try {
//     const order = await Order.findById(orderId);
//     if (!order) return;

//     // Get all completed payments for this order
//     const payments = await Payment.find({ 
//       order: orderId, 
//       isDeleted: false,
//       type: { $in: ['advance', 'full', 'partial', 'extra'] }
//     });

//     // Calculate totals
//     const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
//     const lastPayment = payments.sort((a, b) => 
//       new Date(b.paymentDate) - new Date(a.paymentDate)
//     )[0];

//     // Determine payment status
//     let paymentStatus = 'pending';
//     const totalAmount = order.priceSummary?.totalMax || 0;
    
//     if (totalPaid >= totalAmount) {
//       paymentStatus = totalPaid > totalAmount ? 'overpaid' : 'paid';
//     } else if (totalPaid > 0) {
//       paymentStatus = 'partial';
//     }

//     // Update order with payment summary
//     order.paymentSummary = {
//       totalPaid,
//       lastPaymentDate: lastPayment?.paymentDate,
//       lastPaymentAmount: lastPayment?.amount,
//       paymentCount: payments.length,
//       paymentStatus
//     };
    
//     // Update balance amount
//     order.balanceAmount = totalAmount - totalPaid;
    
//     await order.save();
//     console.log(`✅ Payment summary updated: Total Paid: ₹${totalPaid}, Status: ${paymentStatus}`);
    
//     return { success: true, totalPaid, paymentStatus };
//   } catch (error) {
//     console.error("❌ Error updating payment summary:", error);
//     return { success: false, error: error.message };
//   }
// };

// // ============================================
// // ✅ OPTIMIZED HELPER: CREATE WORKS FOR ORDER
// // ============================================
// const createWorksForOrder = async (orderId, garments, creatorId) => {
//   console.log(`\n🚀 Creating ${garments?.length || 0} works in parallel...`);
  
//   try {
//     if (!garments || garments.length === 0) return { success: true, works: [] };
    
//     // Get all garments in ONE query
//     const garmentDocs = await Garment.find({ _id: { $in: garments } }).lean();
//     console.log(`📦 Found ${garmentDocs.length} garments`);
    
//     // 🔍 DEBUG: Get cutting masters
//     console.log("🔍 Searching for active cutting masters...");
//     const cuttingMasters = await CuttingMaster.find({ isActive: true }).lean();
    
//     debugNotification("CUTTING_MASTERS_FOUND", {
//       count: cuttingMasters.length,
//       masters: cuttingMasters.map(m => ({ 
//         id: m._id, 
//         name: m.name,
//         email: m.email 
//       }))
//     });

//     // Create all works in PARALLEL
//     const workPromises = garmentDocs.map(garment => {
//       const workId = `WRK-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      
//       return Work.create({
//         workId,
//         order: orderId,
//         garment: garment._id,
//         createdBy: creatorId,
//         status: "pending",
//         cuttingMaster: null,
//         estimatedDelivery: garment.estimatedDelivery || new Date(Date.now() + 7*24*60*60*1000)
//       });
//     });
    
//     const works = await Promise.all(workPromises);
//     console.log(`✅ Created ${works.length} works`);
    
//     // Update garment references in PARALLEL
//     const updatePromises = works.map(work => 
//       Garment.findByIdAndUpdate(work.garment, { workId: work._id })
//     );
//     await Promise.all(updatePromises);
    
//     // 🔍 DEBUG: Send notifications
//     if (works.length > 0) {
//       console.log(`📢 Attempting to send notifications...`);
//       console.log(`   Works count: ${works.length}`);
//       console.log(`   Cutting masters count: ${cuttingMasters.length}`);
      
//       if (cuttingMasters.length === 0) {
//         console.warn("⚠️ No cutting masters found in database!");
//         console.warn("   Please add cutting masters to receive notifications.");
//       } else {
//         console.log(`   Sending to ${cuttingMasters.length} cutting masters`);
        
//         // Test one notification first
//         try {
//           const testMaster = cuttingMasters[0];
//           console.log(`   Testing notification to: ${testMaster.name} (${testMaster._id})`);
          
//           const testResult = await createNotification({
//             type: 'work-available',
//             recipient: testMaster._id,
//             title: '🔔 TEST: New Work Available',
//             message: `TEST: ${works.length} new work(s) are waiting`,
//             reference: {
//               orderId: orderId,
//               workCount: works.length,
//               workIds: works.map(w => w._id)
//             },
//             priority: 'high'
//           });
          
//           console.log(`   ✅ Test notification sent successfully:`, testResult);
//         } catch (testError) {
//           console.error(`   ❌ Test notification failed:`, testError.message);
//           debugNotification("TEST_NOTIFICATION_ERROR", {
//             error: testError.message,
//             stack: testError.stack
//           });
//         }
        
//         // Send to all cutting masters
//         cuttingMasters.forEach((master, index) => {
//           console.log(`   📨 Sending to master ${index + 1}/${cuttingMasters.length}: ${master.name}`);
          
//           createNotification({
//             type: 'work-available',
//             recipient: master._id,
//             title: '🔔 New Work Available',
//             message: `${works.length} new work(s) are waiting for acceptance`,
//             reference: {
//               orderId: orderId,
//               workCount: works.length,
//               workIds: works.map(w => w._id)
//             },
//             priority: 'high'
//           })
//           .then(result => {
//             console.log(`      ✅ Notification sent to ${master.name}`);
//           })
//           .catch(err => {
//             console.error(`      ❌ Failed to send to ${master.name}:`, err.message);
//           });
//         });
//       }
//     } else {
//       console.log("⚠️ No works created, skipping notifications");
//     }
    
//     return { success: true, works };
//   } catch (error) {
//     console.error("\n❌ ERROR CREATING WORKS:", error);
//     debugNotification("CREATE_WORKS_ERROR", {
//       error: error.message,
//       stack: error.stack
//     });
//     return { success: false, error: error.message };
//   }
// };

// // ============================================
// // ✅ 1. GET ORDER STATS
// // ============================================
// export const getOrderStats = async (req, res) => {
//   console.log("\n📊 ===== GET ORDER STATS =====");
//   try {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     const startOfWeek = new Date(today);
//     startOfWeek.setDate(today.getDate() - today.getDay());

//     const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

//     const [todayCount, weekCount, monthCount, totalCount] = await Promise.all([
//       Order.countDocuments({ createdAt: { $gte: today }, isActive: true }),
//       Order.countDocuments({ createdAt: { $gte: startOfWeek }, isActive: true }),
//       Order.countDocuments({ createdAt: { $gte: startOfMonth }, isActive: true }),
//       Order.countDocuments({ isActive: true })
//     ]);

//     const statusStats = await Order.aggregate([
//       { $match: { isActive: true } },
//       { $group: { _id: "$status", count: { $sum: 1 } } }
//     ]);

//     const paymentStats = await Order.aggregate([
//       { $match: { isActive: true } },
//       { $group: { 
//         _id: "$paymentSummary.paymentStatus",
//         count: { $sum: 1 },
//         totalAmount: { $sum: "$priceSummary.totalMax" },
//         totalPaid: { $sum: "$paymentSummary.totalPaid" }
//       }}
//     ]);

//     res.status(200).json({
//       success: true,
//       stats: {
//         today: todayCount,
//         thisWeek: weekCount,
//         thisMonth: monthCount,
//         total: totalCount,
//         statusBreakdown: statusStats,
//         paymentBreakdown: paymentStats
//       }
//     });
//   } catch (error) {
//     console.error("❌ Stats Error:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // ============================================
// // ✅ OPTIMIZED 2. CREATE ORDER (WITH PAYMENTS)
// // ============================================
// export const createOrder = async (req, res) => {
//   console.log("\n🆕 ===== CREATE ORDER STARTED =====");
//   const startTime = Date.now();
  
//   try {
//     const {
//       customer,
//       deliveryDate,
//       garments,
//       specialNotes,
//       advancePayment,
//       priceSummary,
//       status,
//       orderDate,
//       payments = []
//     } = req.body;

//     // ✅ Get creator ID
//     const creatorId = req.user?._id || req.user?.id;
//     if (!creatorId) {
//       return res.status(401).json({ 
//         success: false, 
//         message: "Authentication failed" 
//       });
//     }

//     // Validate required fields
//     if (!customer || !deliveryDate) {
//       return res.status(400).json({ 
//         success: false, 
//         message: "Customer and Delivery Date are required" 
//       });
//     }

//     // ✅ OPTIMIZED: Generate order ID without countDocuments()
//     const date = new Date();
//     const day = String(date.getDate()).padStart(2, '0');
//     const month = String(date.getMonth() + 1).padStart(2, '0');
//     const year = date.getFullYear();
//     const orderId = `${day}${month}${year}-${Date.now().toString().slice(-4)}`;

//     // Calculate totals from garments (BATCH query)
//     let totalMin = priceSummary?.totalMin || 0;
//     let totalMax = priceSummary?.totalMax || 0;
    
//     if (garments && garments.length > 0) {
//       // Get all garments in ONE query
//       const garmentDocs = await Garment.find({ _id: { $in: garments } }).lean();
//       garmentDocs.forEach(g => {
//         totalMin += g.priceRange?.min || 0;
//         totalMax += g.priceRange?.max || 0;
//       });
//     }

//     // Combine payments
//     let allPayments = [...payments];
//     if (advancePayment?.amount > 0 && !allPayments.some(p => p.type === 'advance')) {
//       allPayments.push({
//         amount: advancePayment.amount,
//         type: 'advance',
//         method: advancePayment.method || 'cash',
//         paymentDate: advancePayment.date || new Date(),
//         paymentTime: new Date().toLocaleTimeString('en-US', { hour12: false }),
//         notes: 'Initial advance payment'
//       });
//     }

//     const totalInitialPaid = allPayments.reduce((sum, p) => sum + (p.amount || 0), 0);

//     // ✅ CREATE ORDER
//     const order = await Order.create({
//       orderId,
//       customer,
//       deliveryDate,
//       garments: garments || [],
//       specialNotes,
//       advancePayment: {
//         amount: advancePayment?.amount || 0,
//         method: advancePayment?.method || "cash",
//         date: advancePayment?.date || new Date(),
//       },
//       priceSummary: { totalMin, totalMax },
//       paymentSummary: {
//         totalPaid: totalInitialPaid,
//         lastPaymentDate: allPayments.length > 0 ? new Date() : null,
//         lastPaymentAmount: allPayments.length > 0 ? allPayments[allPayments.length - 1].amount : 0,
//         paymentCount: allPayments.length,
//         paymentStatus: totalInitialPaid >= totalMax ? 'paid' : (totalInitialPaid > 0 ? 'partial' : 'pending')
//       },
//       balanceAmount: totalMax - totalInitialPaid,
//       createdBy: creatorId,
//       status: status || "draft",
//       orderDate: orderDate || new Date(),
//     });

//     // ✅ PARALLEL OPERATIONS - Create payments and works simultaneously
//     const promises = [];

//     // 1. Create payments in PARALLEL
//     if (allPayments.length > 0) {
//       console.log(`💰 Creating ${allPayments.length} payments in parallel...`);
      
//       const paymentPromises = allPayments.map(paymentData => 
//         Payment.create({
//           order: order._id,
//           customer: order.customer,
//           amount: paymentData.amount,
//           type: paymentData.type || 'advance',
//           method: paymentData.method || 'cash',
//           referenceNumber: paymentData.referenceNumber || '',
//           paymentDate: paymentData.paymentDate || new Date(),
//           paymentTime: paymentData.paymentTime || new Date().toLocaleTimeString('en-US', { hour12: false }),
//           notes: paymentData.notes || '',
//           receivedBy: creatorId
//         })
//       );
      
//       promises.push(Promise.all(paymentPromises));
//     }

//     // 2. Create works in PARALLEL (if garments exist)
//     if (garments && garments.length > 0) {
//       console.log(`🔨 Creating ${garments.length} works in parallel...`);
      
//       const worksPromise = createWorksForOrder(order._id, garments, creatorId);
//       promises.push(worksPromise);
//     }

//     // Wait for all parallel operations
//     await Promise.all(promises);

//     // Update order status if works were created
//     if (garments && garments.length > 0) {
//       order.status = "confirmed";
//       await order.save();
//     }

//     await order.populate('customer', 'name phone customerId');

//     const endTime = Date.now();
//     console.log(`✅ Order created in ${((endTime - startTime) / 1000).toFixed(2)} seconds`);

//     res.status(201).json({ 
//       success: true, 
//       message: "Order created successfully",
//       order 
//     });
//   } catch (error) {
//     console.error("\n❌ CREATE ORDER ERROR:", error);
//     console.error("Error stack:", error.stack);
    
//     if (error.name === 'ValidationError') {
//       const errors = Object.values(error.errors).map(err => err.message);
//       return res.status(400).json({ success: false, message: "Validation failed", errors });
//     }
    
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // ============================================
// // ✅ 3. GET ALL ORDERS
// // ============================================
// export const getAllOrders = async (req, res) => {
//   console.log("\n📋 ===== GET ALL ORDERS =====");
  
//   try {
//     const {
//       page = 1,
//       limit = 10,
//       search = "",
//       status,
//       paymentStatus,
//       timeFilter = "all",
//       startDate,
//       endDate,
//     } = req.query;

//     let query = { isActive: true };

//     // Search
//     if (search) {
//       const customerIds = await Customer.find({
//         $or: [
//           { name: { $regex: search, $options: 'i' } },
//           { phone: { $regex: search, $options: 'i' } }
//         ]
//       }).distinct('_id');
      
//       query.$or = [
//         { orderId: { $regex: search, $options: 'i' } },
//         { customer: { $in: customerIds } }
//       ];
//     }

//     // Status filter
//     if (status && status !== "all") {
//       query.status = status;
//     }

//     // Payment status filter
//     if (paymentStatus && paymentStatus !== "all") {
//       query['paymentSummary.paymentStatus'] = paymentStatus;
//     }

//     // Time filters
//     const now = new Date();
//     if (timeFilter !== "all") {
//       let filterDate = new Date();
//       if (timeFilter === "week") filterDate.setDate(now.getDate() - 7);
//       else if (timeFilter === "month") filterDate.setMonth(now.getMonth() - 1);
//       else if (timeFilter === "3m") filterDate.setMonth(now.getMonth() - 3);
      
//       query.createdAt = { $gte: filterDate };
//     }

//     // Custom date range
//     if (startDate && endDate) {
//       query.createdAt = { 
//         $gte: new Date(startDate), 
//         $lte: new Date(endDate) 
//       };
//     }

//     const total = await Order.countDocuments(query);

//     const orders = await Order.find(query)
//       .populate('customer', 'name phone customerId')
//       .populate("garments")
//       .populate("createdBy", "name")
//       .sort({ createdAt: -1 })
//       .skip((page - 1) * limit)
//       .limit(parseInt(limit));

//     res.json({ 
//       success: true, 
//       orders, 
//       pagination: { 
//         page: parseInt(page), 
//         limit: parseInt(limit), 
//         total, 
//         pages: Math.ceil(total / limit) 
//       } 
//     });
//   } catch (error) {
//     console.error("❌ Get all orders error:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // ============================================
// // ✅ 4. GET ORDER BY ID
// // ============================================
// export const getOrderById = async (req, res) => {
//   console.log(`\n🔍 ===== GET ORDER BY ID: ${req.params.id} =====`);
  
//   try {
//     const order = await Order.findById(req.params.id)
//       .populate('customer', 'name phone customerId email address addressLine1 addressLine2 city state pincode')
//       .populate({
//         path: "garments",
//         populate: [
//           { path: "category", select: "name" },
//           { path: "item", select: "name" },
//           { path: "workId" }
//         ]
//       })
//       .populate("createdBy", "name");

//     if (!order) {
//       return res.status(404).json({ success: false, message: "Order not found" });
//     }

//     // Get payments
//     const payments = await Payment.find({ 
//       order: order._id,
//       isDeleted: false 
//     })
//     .populate('receivedBy', 'name')
//     .sort('-paymentDate -paymentTime');

//     // Get works
//     const works = await Work.find({ order: order._id, isActive: true })
//       .populate('garment', 'name item category')
//       .populate('cuttingMaster', 'name');

//     res.json({ 
//       success: true, 
//       order,
//       payments,
//       works
//     });
//   } catch (error) {
//     console.error("❌ Get order error:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // ============================================
// // ✅ 5. UPDATE ORDER
// // ============================================
// export const updateOrder = async (req, res) => {
//   console.log(`\n📝 ===== UPDATE ORDER: ${req.params.id} =====`);
  
//   try {
//     const { id } = req.params;
//     const {
//       deliveryDate,
//       specialNotes,
//       advancePayment,
//       priceSummary,
//       status,
//       newGarments
//     } = req.body;

//     const order = await Order.findById(id);
//     if (!order) {
//       return res.status(404).json({ success: false, message: "Order not found" });
//     }

//     // Update fields
//     if (deliveryDate) order.deliveryDate = deliveryDate;
//     if (specialNotes !== undefined) order.specialNotes = specialNotes;
    
//     if (advancePayment) {
//       order.advancePayment = {
//         amount: advancePayment.amount !== undefined ? advancePayment.amount : order.advancePayment.amount,
//         method: advancePayment.method || order.advancePayment.method,
//         date: advancePayment.date || order.advancePayment.date || new Date()
//       };
//     }
    
//     if (priceSummary) {
//       order.priceSummary = {
//         totalMin: priceSummary.totalMin !== undefined ? priceSummary.totalMin : order.priceSummary.totalMin,
//         totalMax: priceSummary.totalMax !== undefined ? priceSummary.totalMax : order.priceSummary.totalMax
//       };
//     }
    
//     if (status) order.status = status;

//     // Add new garments
//     if (newGarments && newGarments.length > 0) {
//       order.garments = [...order.garments, ...newGarments];
      
//       const creatorId = req.user?._id || req.user?.id;
//       await createWorksForOrder(order._id, newGarments, creatorId);
//     }

//     await order.save();
    
//     // Update payment summary
//     await updateOrderPaymentSummary(order._id);
    
//     res.json({ success: true, message: "Order updated successfully", order });
//   } catch (error) {
//     console.error("❌ Update error:", error);
    
//     if (error.name === 'ValidationError') {
//       const errors = Object.values(error.errors).map(err => err.message);
//       return res.status(400).json({ success: false, message: "Validation failed", errors });
//     }
    
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // ============================================
// // ✅ 6. UPDATE ORDER STATUS (UPDATED WITH ready-to-delivery)
// // ============================================
// export const updateOrderStatus = async (req, res) => {
//   console.log(`\n🔄 ===== UPDATE ORDER STATUS: ${req.params.id} =====`);
//   console.log("New Status:", req.body.status);
  
//   try {
//     const { status } = req.body;
//     const { id } = req.params;
//     const userId = req.user?._id || req.user?.id;
    
//     // ✅ Validate status
//     const validStatuses = ["draft", "confirmed", "in-progress", "ready-to-delivery", "delivered", "cancelled"];
//     if (!validStatuses.includes(status)) {
//       return res.status(400).json({ 
//         success: false, 
//         message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` 
//       });
//     }
    
//     // ✅ Find order with population
//     const order = await Order.findById(id)
//       .populate('customer', 'name phone')
//       .populate('garments');
      
//     if (!order) {
//       return res.status(404).json({ success: false, message: "Order not found" });
//     }
    
//     // ✅ Check valid transition
//     const validTransitions = {
//       'draft': ['confirmed', 'cancelled'],
//       'confirmed': ['in-progress', 'cancelled'],
//       'in-progress': ['ready-to-delivery', 'cancelled'],
//       'ready-to-delivery': ['delivered', 'cancelled'],
//       'delivered': [],
//       'cancelled': []
//     };
    
//     if (!validTransitions[order.status]?.includes(status)) {
//       return res.status(400).json({ 
//         success: false, 
//         message: `Cannot transition from ${order.status} to ${status}` 
//       });
//     }
    
//     // Store old status
//     const oldStatus = order.status;
    
//     // ✅ Update status
//     order.status = status;
//     await order.save();
    
//     console.log(`✅ Status updated: ${oldStatus} → ${status}`);
    
//     // ============================================
//     // ✅ NOTIFICATIONS BASED ON STATUS
//     // ============================================
    
//     // 1. READY-TO-DELIVERY - Notify Store Keepers
//     if (status === 'ready-to-delivery') {
//       console.log("📦 Order ready for delivery - Sending notifications");
      
//       const storeKeepers = await StoreKeeper.find({ isActive: true }).lean();
//       console.log(`🔍 Found ${storeKeepers.length} store keepers`);
      
//       storeKeepers.forEach(keeper => {
//         createNotification({
//           type: 'delivery-ready',
//           recipient: keeper._id,
//           title: '📦 Order Ready for Delivery',
//           message: `Order #${order.orderId} for ${order.customer?.name || 'Customer'} is ready for delivery`,
//           reference: {
//             orderId: order._id,
//             orderNumber: order.orderId,
//             customerName: order.customer?.name
//           },
//           priority: 'high'
//         }).catch(() => {});
//       });
      
//       console.log(`📢 Notified ${storeKeepers.length} store keepers`);
//     }
    
//     // 2. DELIVERED - Update payment & notify
//     else if (status === 'delivered') {
//       console.log("✅ Order delivered - Updating records");
      
//       // Update payment summary
//       await updateOrderPaymentSummary(order._id);
      
//       const storeKeepers = await StoreKeeper.find({ isActive: true }).lean();
//       console.log(`🔍 Found ${storeKeepers.length} store keepers`);
      
//       storeKeepers.forEach(keeper => {
//         createNotification({
//           type: 'order-delivered',
//           recipient: keeper._id,
//           title: '✅ Order Delivered',
//           message: `Order #${order.orderId} has been delivered to ${order.customer?.name || 'Customer'}`,
//           reference: {
//             orderId: order._id,
//             orderNumber: order.orderId
//           },
//           priority: 'medium'
//         }).catch(() => {});
//       });
//     }
    
//     // 3. CANCELLED - Update related records
//     else if (status === 'cancelled') {
//       console.log("❌ Order cancelled - Updating related works");
      
//       // Cancel all associated works
//       await Work.updateMany(
//         { order: order._id, status: { $ne: 'completed' } },
//         { status: 'cancelled', isActive: false }
//       );
      
//       const storeKeepers = await StoreKeeper.find({ isActive: true }).lean();
//       console.log(`🔍 Found ${storeKeepers.length} store keepers`);
      
//       storeKeepers.forEach(keeper => {
//         createNotification({
//           type: 'order-cancelled',
//           recipient: keeper._id,
//           title: '❌ Order Cancelled',
//           message: `Order #${order.orderId} for ${order.customer?.name || 'Customer'} has been cancelled`,
//           reference: {
//             orderId: order._id,
//             orderNumber: order.orderId
//           },
//           priority: 'high'
//         }).catch(() => {});
//       });
//     }
    
//     // ============================================
//     // ✅ UPDATE RELATED WORKS
//     // ============================================
    
//     try {
//       if (status === 'in-progress') {
//         // Update pending works to in-progress
//         await Work.updateMany(
//           { order: order._id, status: 'pending' },
//           { status: 'in-progress' }
//         );
//         console.log("🔨 Updated related works to in-progress");
//       }
//       else if (status === 'delivered') {
//         // Mark all works as completed
//         await Work.updateMany(
//           { order: order._id, status: { $ne: 'completed' } },
//           { status: 'completed' }
//         );
//         console.log("✅ Updated related works to completed");
//       }
//       else if (status === 'ready-to-delivery') {
//         // Update works to ready status if you have that
//         console.log("📦 Works ready for delivery");
//       }
//     } catch (workErr) {
//       console.log("Work update error:", workErr.message);
//       // Don't fail the main operation
//     }
    
//     // ✅ Get updated order
//     const updatedOrder = await Order.findById(id)
//       .populate('customer', 'name phone customerId')
//       .populate('garments');
    
//     res.json({ 
//       success: true, 
//       message: `Order status updated from ${oldStatus} to ${status}`,
//       order: updatedOrder 
//     });
    
//   } catch (error) {
//     console.error("❌ Update status error:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // ============================================
// // ✅ 7. DELETE ORDER (SOFT DELETE)
// // ============================================
// export const deleteOrder = async (req, res) => {
//   console.log(`\n🗑️ ===== DELETE ORDER: ${req.params.id} =====`);
  
//   try {
//     const order = await Order.findById(req.params.id);
//     if (!order) {
//       return res.status(404).json({ success: false, message: "Order not found" });
//     }

//     // Soft delete related records
//     await Garment.updateMany({ _id: { $in: order.garments } }, { isActive: false });
//     await Work.updateMany({ order: order._id }, { isActive: false });
//     await Payment.updateMany({ order: order._id }, { isDeleted: true });

//     order.isActive = false;
//     await order.save();

//     res.json({ success: true, message: "Order deleted successfully" });
//   } catch (error) {
//     console.error("❌ Delete error:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // ============================================
// // ✅ 8. ADD PAYMENT TO ORDER
// // ============================================
// export const addPaymentToOrder = async (req, res) => {
//   console.log(`\n💰 ===== ADD PAYMENT TO ORDER: ${req.params.id} =====`);
  
//   try {
//     const { id } = req.params;
//     const paymentData = req.body;
    
//     const order = await Order.findById(id);
//     if (!order) {
//       return res.status(404).json({ success: false, message: "Order not found" });
//     }
    
//     const creatorId = req.user?._id || req.user?.id;
    
//     // Create payment
//     const payment = await Payment.create({
//       order: order._id,
//       customer: order.customer,
//       amount: paymentData.amount,
//       type: paymentData.type || 'advance',
//       method: paymentData.method || 'cash',
//       referenceNumber: paymentData.referenceNumber || '',
//       paymentDate: paymentData.paymentDate || new Date(),
//       paymentTime: paymentData.paymentTime || new Date().toLocaleTimeString('en-US', { hour12: false }),
//       notes: paymentData.notes || '',
//       receivedBy: creatorId
//     });
    
//     // Update order payment summary
//     await updateOrderPaymentSummary(order._id);
    
//     res.status(201).json({ success: true, message: "Payment added", payment });
//   } catch (error) {
//     console.error("❌ Add payment error:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // ============================================
// // ✅ 9. GET ORDER PAYMENTS
// // ============================================
// export const getOrderPayments = async (req, res) => {
//   console.log(`\n💰 ===== GET ORDER PAYMENTS: ${req.params.id} =====`);
  
//   try {
//     const payments = await Payment.find({ 
//       order: req.params.id,
//       isDeleted: false 
//     })
//     .populate('receivedBy', 'name')
//     .sort('-paymentDate -paymentTime');
    
//     res.json({ success: true, payments });
//   } catch (error) {
//     console.error("❌ Get payments error:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // ============================================
// // ✅ 10. GET DASHBOARD DATA
// // ============================================
// export const getDashboardData = async (req, res) => {
//   console.log("\n📊 ===== GET DASHBOARD DATA =====");
  
//   try {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     // Today's orders
//     const todayOrders = await Order.find({
//       createdAt: { $gte: today },
//       isActive: true
//     }).populate('customer', 'name');

//     // Pending deliveries
//     const pendingDeliveries = await Order.find({
//       deliveryDate: { $lt: new Date() },
//       status: { $nin: ['delivered', 'cancelled'] },
//       isActive: true
//     }).populate('customer', 'name phone');

//     // Orders ready for delivery
//     const readyForDelivery = await Order.find({
//       status: 'ready-to-delivery',
//       isActive: true
//     }).populate('customer', 'name phone');

//     // Recent orders
//     const recentOrders = await Order.find({ isActive: true })
//       .populate('customer', 'name')
//       .sort({ createdAt: -1 })
//       .limit(10);

//     // Payment collection today
//     const todayPayments = await Payment.find({
//       paymentDate: { $gte: today },
//       isDeleted: false
//     });

//     const todayCollection = todayPayments.reduce((sum, p) => sum + p.amount, 0);

//     res.json({
//       success: true,
//       dashboard: {
//         todayOrders: {
//           count: todayOrders.length,
//           orders: todayOrders
//         },
//         pendingDeliveries: {
//           count: pendingDeliveries.length,
//           orders: pendingDeliveries
//         },
//         readyForDelivery: {
//           count: readyForDelivery.length,
//           orders: readyForDelivery
//         },
//         recentOrders,
//         todayCollection
//       }
//     });
//   } catch (error) {
//     console.error("❌ Dashboard error:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // ============================================
// // ✅ 11. GET ORDERS BY CUSTOMER
// // ============================================
// export const getOrdersByCustomer = async (req, res) => {
//   try {
//     const { customerId } = req.params;
    
//     console.log(`🔍 Fetching orders for customer: ${customerId}`);
    
//     // Find all orders for this customer that are active
//     const orders = await Order.find({ 
//       customer: customerId,
//       isActive: true 
//     })
//     .populate('customer', 'name phone email customerId')
//     .populate('garments')
//     .sort('-createdAt');
    
//     console.log(`✅ Found ${orders.length} orders for customer ${customerId}`);
    
//     res.status(200).json({
//       success: true,
//       count: orders.length,
//       orders: orders
//     });
    
//   } catch (error) {
//     console.error(`❌ Error fetching orders for customer ${req.params.customerId}:`, error);
//     res.status(500).json({
//       success: false,
//       error: error.message
//     });
//   }
// };

// // ============================================
// // ✅ 12. GET READY TO DELIVERY ORDERS
// // ============================================
// export const getReadyToDeliveryOrders = async (req, res) => {
//   console.log("\n📦 ===== GET READY TO DELIVERY ORDERS =====");
  
//   try {
//     const orders = await Order.find({ 
//       status: 'ready-to-delivery',
//       isActive: true 
//     })
//     .populate('customer', 'name phone')
//     .populate('garments')
//     .sort({ updatedAt: -1 });
    
//     res.json({
//       success: true,
//       count: orders.length,
//       orders
//     });
//   } catch (error) {
//     console.error("❌ Get ready to delivery error:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };



// // controllers/order.controller.js
// import Order from "../models/Order.js";
// import Garment from "../models/Garment.js";
// import Work from "../models/Work.js";
// import Customer from "../models/Customer.js";
// import Payment from "../models/Payment.js";
// import Transaction from "../models/Transaction.js";
// import CuttingMaster from "../models/CuttingMaster.js";
// import Tailor from "../models/Tailor.js";
// import StoreKeeper from "../models/StoreKeeper.js";
// import { createNotification } from "./notification.controller.js";

// // ============================================
// // ✅ HELPER: CREATE INCOME FROM PAYMENT
// // ============================================
// const createIncomeFromPayment = async (payment, order, creatorId) => {
//   try {
//     console.log(`💰 Creating income from payment: ₹${payment.amount}`);
    
//     const accountType = payment.method === 'cash' ? 'hand-cash' : 'bank';
    
//     let category = 'customer-advance';
//     if (payment.type === 'full') {
//       category = 'full-payment';
//     } else if (payment.type === 'advance' && order.paymentSummary?.paymentStatus === 'paid') {
//       category = 'full-payment';
//     } else if (payment.type === 'extra') {
//       category = 'fabric-sale';
//     }
    
//     const customer = await Customer.findById(order.customer);
    
//     const incomeTransaction = await Transaction.create({
//       type: 'income',
//       category: category,
//       amount: payment.amount,
//       paymentMethod: payment.method,
//       accountType: accountType,
//       customer: order.customer,
//       customerDetails: customer ? {
//         name: customer.name || `${customer.firstName || ''} ${customer.lastName || ''}`.trim(),
//         phone: customer.phone,
//         id: customer.customerId || customer._id
//       } : null,
//       order: order._id,
//       description: `Payment for Order #${order.orderId} - ${payment.notes || payment.type || 'advance'}`,
//       transactionDate: payment.paymentDate || new Date(),
//       referenceNumber: payment.referenceNumber || '',
//       createdBy: creatorId,
//       status: 'completed'
//     });
    
//     console.log(`✅ Income created: ₹${payment.amount} (${category}) - ${accountType}`);
//     return incomeTransaction;
//   } catch (error) {
//     console.error("❌ Error creating income:", error);
//     return null;
//   }
// };

// // ============================================
// // ✅ HELPER: UPDATE ORDER PAYMENT SUMMARY
// // ============================================
// const updateOrderPaymentSummary = async (orderId) => {
//   console.log(`\n💰 Updating payment summary for order: ${orderId}`);
  
//   try {
//     const order = await Order.findById(orderId);
//     if (!order) return;

//     const payments = await Payment.find({ 
//       order: orderId, 
//       isDeleted: false,
//       type: { $in: ['advance', 'full', 'partial', 'extra'] }
//     });

//     const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
//     const lastPayment = payments.sort((a, b) => 
//       new Date(b.paymentDate) - new Date(a.paymentDate)
//     )[0];

//     let paymentStatus = 'pending';
//     const totalAmount = order.priceSummary?.totalMax || 0;
    
//     if (totalPaid >= totalAmount) {
//       paymentStatus = totalPaid > totalAmount ? 'overpaid' : 'paid';
//     } else if (totalPaid > 0) {
//       paymentStatus = 'partial';
//     }

//     order.paymentSummary = {
//       totalPaid,
//       lastPaymentDate: lastPayment?.paymentDate,
//       lastPaymentAmount: lastPayment?.amount,
//       paymentCount: payments.length,
//       paymentStatus
//     };
    
//     order.balanceAmount = totalAmount - totalPaid;
    
//     await order.save();
//     console.log(`✅ Payment summary updated: Paid: ₹${totalPaid}, Status: ${paymentStatus}`);
    
//     return { success: true, totalPaid, paymentStatus };
//   } catch (error) {
//     console.error("❌ Error updating payment summary:", error);
//     return { success: false, error: error.message };
//   }
// };

// // ============================================
// // ✅ HELPER: CREATE WORKS FOR ORDER
// // ============================================
// const createWorksForOrder = async (orderId, garments, creatorId) => {
//   console.log(`\n🚀 Creating ${garments?.length || 0} works...`);
  
//   try {
//     if (!garments || garments.length === 0) return { success: true, works: [] };
    
//     const garmentDocs = await Garment.find({ _id: { $in: garments } }).lean();
//     console.log(`📦 Found ${garmentDocs.length} garments`);
    
//     const cuttingMasters = await CuttingMaster.find({ isActive: true }).lean();

//     const workPromises = garmentDocs.map(garment => {
//       const workId = `WRK-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      
//       return Work.create({
//         workId,
//         order: orderId,
//         garment: garment._id,
//         createdBy: creatorId,
//         status: "pending",
//         cuttingMaster: null,
//         estimatedDelivery: garment.estimatedDelivery || new Date(Date.now() + 7*24*60*60*1000)
//       });
//     });
    
//     const works = await Promise.all(workPromises);
//     console.log(`✅ Created ${works.length} works`);
    
//     const updatePromises = works.map(work => 
//       Garment.findByIdAndUpdate(work.garment, { workId: work._id })
//     );
//     await Promise.all(updatePromises);
    
//     // Send notifications to cutting masters
//     if (works.length > 0 && cuttingMasters.length > 0) {
//       cuttingMasters.forEach(master => {
//         createNotification({
//           type: 'work-available',
//           recipient: master._id,
//           title: '🔔 New Work Available',
//           message: `${works.length} new work(s) are waiting for acceptance`,
//           reference: {
//             orderId: orderId,
//             workCount: works.length,
//             workIds: works.map(w => w._id)
//           },
//           priority: 'high'
//         }).catch(() => {});
//       });
//     }
    
//     return { success: true, works };
//   } catch (error) {
//     console.error("\n❌ ERROR CREATING WORKS:", error);
//     return { success: false, error: error.message };
//   }
// };

// // ============================================
// // ✅ 1. GET ORDER STATS (ORIGINAL)
// // ============================================
// export const getOrderStats = async (req, res) => {
//   console.log("\n📊 ===== GET ORDER STATS =====");
//   try {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     const startOfWeek = new Date(today);
//     startOfWeek.setDate(today.getDate() - today.getDay());

//     const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

//     const [todayCount, weekCount, monthCount, totalCount] = await Promise.all([
//       Order.countDocuments({ createdAt: { $gte: today }, isActive: true }),
//       Order.countDocuments({ createdAt: { $gte: startOfWeek }, isActive: true }),
//       Order.countDocuments({ createdAt: { $gte: startOfMonth }, isActive: true }),
//       Order.countDocuments({ isActive: true })
//     ]);

//     const statusStats = await Order.aggregate([
//       { $match: { isActive: true } },
//       { $group: { _id: "$status", count: { $sum: 1 } } }
//     ]);

//     const paymentStats = await Order.aggregate([
//       { $match: { isActive: true } },
//       { $group: { 
//         _id: "$paymentSummary.paymentStatus",
//         count: { $sum: 1 },
//         totalAmount: { $sum: "$priceSummary.totalMax" },
//         totalPaid: { $sum: "$paymentSummary.totalPaid" }
//       }}
//     ]);

//     res.status(200).json({
//       success: true,
//       stats: {
//         today: todayCount,
//         thisWeek: weekCount,
//         thisMonth: monthCount,
//         total: totalCount,
//         statusBreakdown: statusStats,
//         paymentBreakdown: paymentStats
//       }
//     });
//   } catch (error) {
//     console.error("❌ Stats Error:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // ============================================
// // ✅ 2. CREATE ORDER (WITH PAYMENTS & AUTO-INCOME)
// // ============================================
// export const createOrder = async (req, res) => {
//   console.log("\n🆕 ===== CREATE ORDER =====");
  
//   try {
//     const {
//       customer,
//       deliveryDate,
//       garments,
//       specialNotes,
//       advancePayment,
//       priceSummary,
//       status,
//       orderDate,
//       payments = []
//     } = req.body;

//     const creatorId = req.user?._id || req.user?.id;
//     if (!creatorId) {
//       return res.status(401).json({ success: false, message: "Authentication failed" });
//     }

//     if (!customer || !deliveryDate) {
//       return res.status(400).json({ success: false, message: "Customer and Delivery Date are required" });
//     }

//     const date = new Date();
//     const day = String(date.getDate()).padStart(2, '0');
//     const month = String(date.getMonth() + 1).padStart(2, '0');
//     const year = date.getFullYear();
//     const orderId = `${day}${month}${year}-${Date.now().toString().slice(-4)}`;

//     let totalMin = priceSummary?.totalMin || 0;
//     let totalMax = priceSummary?.totalMax || 0;
    
//     if (garments && garments.length > 0) {
//       const garmentDocs = await Garment.find({ _id: { $in: garments } }).lean();
//       garmentDocs.forEach(g => {
//         totalMin += g.priceRange?.min || 0;
//         totalMax += g.priceRange?.max || 0;
//       });
//     }

//     let allPayments = [...payments];
//     if (advancePayment?.amount > 0 && !allPayments.some(p => p.type === 'advance')) {
//       allPayments.push({
//         amount: advancePayment.amount,
//         type: 'advance',
//         method: advancePayment.method || 'cash',
//         paymentDate: advancePayment.date || new Date(),
//         notes: 'Initial advance payment'
//       });
//     }

//     const totalInitialPaid = allPayments.reduce((sum, p) => sum + (p.amount || 0), 0);

//     const order = await Order.create({
//       orderId,
//       customer,
//       deliveryDate,
//       garments: garments || [],
//       specialNotes,
//       advancePayment: {
//         amount: advancePayment?.amount || 0,
//         method: advancePayment?.method || "cash",
//         date: advancePayment?.date || new Date(),
//       },
//       priceSummary: { totalMin, totalMax },
//       paymentSummary: {
//         totalPaid: totalInitialPaid,
//         lastPaymentDate: allPayments.length > 0 ? new Date() : null,
//         lastPaymentAmount: allPayments.length > 0 ? allPayments[allPayments.length - 1].amount : 0,
//         paymentCount: allPayments.length,
//         paymentStatus: totalInitialPaid >= totalMax ? 'paid' : (totalInitialPaid > 0 ? 'partial' : 'pending')
//       },
//       balanceAmount: totalMax - totalInitialPaid,
//       createdBy: creatorId,
//       status: status || "draft",
//       orderDate: orderDate || new Date(),
//     });

//     const promises = [];

//     if (allPayments.length > 0) {
//       const paymentPromises = allPayments.map(async (paymentData) => {
//         const payment = await Payment.create({
//           order: order._id,
//           customer: order.customer,
//           amount: paymentData.amount,
//           type: paymentData.type || 'advance',
//           method: paymentData.method || 'cash',
//           referenceNumber: paymentData.referenceNumber || '',
//           paymentDate: paymentData.paymentDate || new Date(),
//           notes: paymentData.notes || '',
//           receivedBy: creatorId
//         });
        
//         await createIncomeFromPayment(payment, order, creatorId);
//         return payment;
//       });
      
//       promises.push(Promise.all(paymentPromises));
//     }

//     if (garments && garments.length > 0) {
//       const worksPromise = createWorksForOrder(order._id, garments, creatorId);
//       promises.push(worksPromise);
//     }

//     await Promise.all(promises);

//     if (garments && garments.length > 0) {
//       order.status = "confirmed";
//       await order.save();
//     }

//     await order.populate('customer', 'name phone customerId');

//     res.status(201).json({ 
//       success: true, 
//       message: "Order created successfully",
//       order 
//     });
//   } catch (error) {
//     console.error("\n❌ CREATE ORDER ERROR:", error);
    
//     if (error.name === 'ValidationError') {
//       const errors = Object.values(error.errors).map(err => err.message);
//       return res.status(400).json({ success: false, message: "Validation failed", errors });
//     }
    
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // ============================================
// // ✅ 3. GET ALL ORDERS
// // ============================================
// export const getAllOrders = async (req, res) => {
//   console.log("\n📋 ===== GET ALL ORDERS =====");
  
//   try {
//     const {
//       page = 1,
//       limit = 10,
//       search = "",
//       status,
//       paymentStatus,
//       timeFilter = "all",
//       startDate,
//       endDate,
//     } = req.query;

//     let query = { isActive: true };

//     if (search) {
//       const customerIds = await Customer.find({
//         $or: [
//           { name: { $regex: search, $options: 'i' } },
//           { phone: { $regex: search, $options: 'i' } }
//         ]
//       }).distinct('_id');
      
//       query.$or = [
//         { orderId: { $regex: search, $options: 'i' } },
//         { customer: { $in: customerIds } }
//       ];
//     }

//     if (status && status !== "all") {
//       query.status = status;
//     }

//     if (paymentStatus && paymentStatus !== "all") {
//       query['paymentSummary.paymentStatus'] = paymentStatus;
//     }

//     const now = new Date();
//     if (timeFilter !== "all") {
//       let filterDate = new Date();
//       if (timeFilter === "week") filterDate.setDate(now.getDate() - 7);
//       else if (timeFilter === "month") filterDate.setMonth(now.getMonth() - 1);
//       else if (timeFilter === "3m") filterDate.setMonth(now.getMonth() - 3);
      
//       query.createdAt = { $gte: filterDate };
//     }

//     if (startDate && endDate) {
//       query.createdAt = { 
//         $gte: new Date(startDate), 
//         $lte: new Date(endDate) 
//       };
//     }

//     const total = await Order.countDocuments(query);

//     const orders = await Order.find(query)
//       .populate('customer', 'name phone customerId')
//       .populate("garments")
//       .populate("createdBy", "name")
//       .sort({ createdAt: -1 })
//       .skip((page - 1) * limit)
//       .limit(parseInt(limit));

//     res.json({ 
//       success: true, 
//       orders, 
//       pagination: { 
//         page: parseInt(page), 
//         limit: parseInt(limit), 
//         total, 
//         pages: Math.ceil(total / limit) 
//       } 
//     });
//   } catch (error) {
//     console.error("❌ Get all orders error:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // ============================================
// // ✅ 4. GET ORDER BY ID
// // ============================================
// export const getOrderById = async (req, res) => {
//   console.log(`\n🔍 ===== GET ORDER BY ID: ${req.params.id} =====`);
  
//   try {
//     const order = await Order.findById(req.params.id)
//       .populate('customer', 'name phone customerId email address addressLine1 addressLine2 city state pincode')
//       .populate({
//         path: "garments",
//         populate: [
//           { path: "category", select: "name" },
//           { path: "item", select: "name" },
//           { path: "workId" }
//         ]
//       })
//       .populate("createdBy", "name");

//     if (!order) {
//       return res.status(404).json({ success: false, message: "Order not found" });
//     }

//     const payments = await Payment.find({ 
//       order: order._id,
//       isDeleted: false 
//     })
//     .populate('receivedBy', 'name')
//     .sort('-paymentDate -paymentTime');

//     const works = await Work.find({ order: order._id, isActive: true })
//       .populate('garment', 'name item category')
//       .populate('cuttingMaster', 'name');

//     res.json({ 
//       success: true, 
//       order,
//       payments,
//       works
//     });
//   } catch (error) {
//     console.error("❌ Get order error:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // ============================================
// // ✅ 5. UPDATE ORDER
// // ============================================
// export const updateOrder = async (req, res) => {
//   console.log(`\n📝 ===== UPDATE ORDER: ${req.params.id} =====`);
  
//   try {
//     const { id } = req.params;
//     const {
//       deliveryDate,
//       specialNotes,
//       advancePayment,
//       priceSummary,
//       status,
//       newGarments
//     } = req.body;

//     const order = await Order.findById(id);
//     if (!order) {
//       return res.status(404).json({ success: false, message: "Order not found" });
//     }

//     if (deliveryDate) order.deliveryDate = deliveryDate;
//     if (specialNotes !== undefined) order.specialNotes = specialNotes;
    
//     if (advancePayment) {
//       order.advancePayment = {
//         amount: advancePayment.amount !== undefined ? advancePayment.amount : order.advancePayment.amount,
//         method: advancePayment.method || order.advancePayment.method,
//         date: advancePayment.date || order.advancePayment.date || new Date()
//       };
//     }
    
//     if (priceSummary) {
//       order.priceSummary = {
//         totalMin: priceSummary.totalMin !== undefined ? priceSummary.totalMin : order.priceSummary.totalMin,
//         totalMax: priceSummary.totalMax !== undefined ? priceSummary.totalMax : order.priceSummary.totalMax
//       };
//     }
    
//     if (status) order.status = status;

//     if (newGarments && newGarments.length > 0) {
//       order.garments = [...order.garments, ...newGarments];
      
//       const creatorId = req.user?._id || req.user?.id;
//       await createWorksForOrder(order._id, newGarments, creatorId);
//     }

//     await order.save();
    
//     await updateOrderPaymentSummary(order._id);
    
//     res.json({ success: true, message: "Order updated successfully", order });
//   } catch (error) {
//     console.error("❌ Update error:", error);
    
//     if (error.name === 'ValidationError') {
//       const errors = Object.values(error.errors).map(err => err.message);
//       return res.status(400).json({ success: false, message: "Validation failed", errors });
//     }
    
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // ============================================
// // ✅ 6. UPDATE ORDER STATUS
// // ============================================
// export const updateOrderStatus = async (req, res) => {
//   console.log(`\n🔄 ===== UPDATE ORDER STATUS: ${req.params.id} =====`);
  
//   try {
//     const { status } = req.body;
//     const { id } = req.params;
//     const userId = req.user?._id || req.user?.id;
    
//     const validStatuses = ["draft", "confirmed", "in-progress", "ready-to-delivery", "delivered", "cancelled"];
//     if (!validStatuses.includes(status)) {
//       return res.status(400).json({ 
//         success: false, 
//         message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` 
//       });
//     }
    
//     const order = await Order.findById(id)
//       .populate('customer', 'name phone')
//       .populate('garments');
      
//     if (!order) {
//       return res.status(404).json({ success: false, message: "Order not found" });
//     }
    
//     const validTransitions = {
//       'draft': ['confirmed', 'cancelled'],
//       'confirmed': ['in-progress', 'cancelled'],
//       'in-progress': ['ready-to-delivery', 'cancelled'],
//       'ready-to-delivery': ['delivered', 'cancelled'],
//       'delivered': [],
//       'cancelled': []
//     };
    
//     if (!validTransitions[order.status]?.includes(status)) {
//       return res.status(400).json({ 
//         success: false, 
//         message: `Cannot transition from ${order.status} to ${status}` 
//       });
//     }
    
//     const oldStatus = order.status;
//     order.status = status;
//     await order.save();
    
//     console.log(`✅ Status updated: ${oldStatus} → ${status}`);

//     // Notifications based on status
//     if (status === 'ready-to-delivery') {
//       const storeKeepers = await StoreKeeper.find({ isActive: true }).lean();
//       storeKeepers.forEach(keeper => {
//         createNotification({
//           type: 'delivery-ready',
//           recipient: keeper._id,
//           title: '📦 Order Ready for Delivery',
//           message: `Order #${order.orderId} for ${order.customer?.name || 'Customer'} is ready for delivery`,
//           reference: { orderId: order._id, orderNumber: order.orderId },
//           priority: 'high'
//         }).catch(() => {});
//       });
//     }
//     else if (status === 'delivered') {
//       await updateOrderPaymentSummary(order._id);
      
//       const storeKeepers = await StoreKeeper.find({ isActive: true }).lean();
//       storeKeepers.forEach(keeper => {
//         createNotification({
//           type: 'order-delivered',
//           recipient: keeper._id,
//           title: '✅ Order Delivered',
//           message: `Order #${order.orderId} has been delivered`,
//           reference: { orderId: order._id },
//           priority: 'medium'
//         }).catch(() => {});
//       });
//     }
//     else if (status === 'cancelled') {
//       await Work.updateMany(
//         { order: order._id, status: { $ne: 'completed' } },
//         { status: 'cancelled', isActive: false }
//       );
//     }

//     // Update related works
//     try {
//       if (status === 'in-progress') {
//         await Work.updateMany(
//           { order: order._id, status: 'pending' },
//           { status: 'in-progress' }
//         );
//       }
//       else if (status === 'delivered') {
//         await Work.updateMany(
//           { order: order._id, status: { $ne: 'completed' } },
//           { status: 'completed' }
//         );
//       }
//     } catch (workErr) {
//       console.log("Work update error:", workErr.message);
//     }
    
//     const updatedOrder = await Order.findById(id)
//       .populate('customer', 'name phone customerId')
//       .populate('garments');
    
//     res.json({ 
//       success: true, 
//       message: `Order status updated from ${oldStatus} to ${status}`,
//       order: updatedOrder 
//     });
    
//   } catch (error) {
//     console.error("❌ Update status error:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // ============================================
// // ✅ 7. DELETE ORDER (SOFT DELETE)
// // ============================================
// export const deleteOrder = async (req, res) => {
//   console.log(`\n🗑️ ===== DELETE ORDER: ${req.params.id} =====`);
  
//   try {
//     const order = await Order.findById(req.params.id);
//     if (!order) {
//       return res.status(404).json({ success: false, message: "Order not found" });
//     }

//     await Garment.updateMany({ _id: { $in: order.garments } }, { isActive: false });
//     await Work.updateMany({ order: order._id }, { isActive: false });
//     await Payment.updateMany({ order: order._id }, { isDeleted: true });
//     await Transaction.updateMany({ order: order._id }, { status: 'cancelled' });

//     order.isActive = false;
//     await order.save();

//     res.json({ success: true, message: "Order deleted successfully" });
//   } catch (error) {
//     console.error("❌ Delete error:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // ============================================
// // ✅ 8. ADD PAYMENT TO ORDER (WITH AUTO-INCOME)
// // ============================================
// export const addPaymentToOrder = async (req, res) => {
//   console.log(`\n💰 ===== ADD PAYMENT TO ORDER: ${req.params.id} =====`);
  
//   try {
//     const { id } = req.params;
//     const paymentData = req.body;
    
//     const order = await Order.findById(id).populate('customer');
//     if (!order) {
//       return res.status(404).json({ success: false, message: "Order not found" });
//     }
    
//     const creatorId = req.user?._id || req.user?.id;
    
//     const payment = await Payment.create({
//       order: order._id,
//       customer: order.customer,
//       amount: paymentData.amount,
//       type: paymentData.type || 'advance',
//       method: paymentData.method || 'cash',
//       referenceNumber: paymentData.referenceNumber || '',
//       paymentDate: paymentData.paymentDate || new Date(),
//       notes: paymentData.notes || '',
//       receivedBy: creatorId
//     });
    
//     await createIncomeFromPayment(payment, order, creatorId);
//     await updateOrderPaymentSummary(order._id);
    
//     res.status(201).json({ success: true, message: "Payment added and income created", payment });
//   } catch (error) {
//     console.error("❌ Add payment error:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // ============================================
// // ✅ 9. GET ORDER PAYMENTS
// // ============================================
// export const getOrderPayments = async (req, res) => {
//   console.log(`\n💰 ===== GET ORDER PAYMENTS: ${req.params.id} =====`);
  
//   try {
//     const payments = await Payment.find({ 
//       order: req.params.id,
//       isDeleted: false 
//     })
//     .populate('receivedBy', 'name')
//     .sort('-paymentDate -paymentTime');
    
//     res.json({ success: true, payments });
//   } catch (error) {
//     console.error("❌ Get payments error:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // ============================================
// // ✅ 10. GET DASHBOARD DATA
// // ============================================
// export const getDashboardData = async (req, res) => {
//   console.log("\n📊 ===== GET DASHBOARD DATA =====");
  
//   try {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     const todayOrders = await Order.find({
//       createdAt: { $gte: today },
//       isActive: true
//     }).populate('customer', 'name');

//     const pendingDeliveries = await Order.find({
//       deliveryDate: { $lt: new Date() },
//       status: { $nin: ['delivered', 'cancelled'] },
//       isActive: true
//     }).populate('customer', 'name phone');

//     const readyForDelivery = await Order.find({
//       status: 'ready-to-delivery',
//       isActive: true
//     }).populate('customer', 'name phone');

//     const recentOrders = await Order.find({ isActive: true })
//       .populate('customer', 'name')
//       .sort({ createdAt: -1 })
//       .limit(10);

//     const todayPayments = await Payment.find({
//       paymentDate: { $gte: today },
//       isDeleted: false
//     });

//     const todayCollection = todayPayments.reduce((sum, p) => sum + p.amount, 0);

//     const todayIncome = await Transaction.find({
//       transactionDate: { $gte: today },
//       type: 'income',
//       status: 'completed'
//     });

//     const totalIncomeToday = todayIncome.reduce((sum, t) => sum + t.amount, 0);

//     res.json({
//       success: true,
//       dashboard: {
//         todayOrders: { count: todayOrders.length, orders: todayOrders },
//         pendingDeliveries: { count: pendingDeliveries.length, orders: pendingDeliveries },
//         readyForDelivery: { count: readyForDelivery.length, orders: readyForDelivery },
//         recentOrders,
//         todayCollection,
//         totalIncomeToday,
//         incomeBreakdown: {
//           handCash: todayIncome.filter(t => t.accountType === 'hand-cash').reduce((sum, t) => sum + t.amount, 0),
//           bank: todayIncome.filter(t => t.accountType === 'bank').reduce((sum, t) => sum + t.amount, 0)
//         }
//       }
//     });
//   } catch (error) {
//     console.error("❌ Dashboard error:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // ============================================
// // ✅ 11. GET ORDERS BY CUSTOMER
// // ============================================
// export const getOrdersByCustomer = async (req, res) => {
//   try {
//     const { customerId } = req.params;
    
//     console.log(`🔍 Fetching orders for customer: ${customerId}`);
    
//     const orders = await Order.find({ 
//       customer: customerId,
//       isActive: true 
//     })
//     .populate('customer', 'name phone email customerId')
//     .populate('garments')
//     .sort('-createdAt');
    
//     console.log(`✅ Found ${orders.length} orders for customer ${customerId}`);
    
//     res.status(200).json({
//       success: true,
//       count: orders.length,
//       orders: orders
//     });
    
//   } catch (error) {
//     console.error(`❌ Error fetching orders for customer ${req.params.customerId}:`, error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ============================================
// // ✅ 12. GET READY TO DELIVERY ORDERS
// // ============================================
// export const getReadyToDeliveryOrders = async (req, res) => {
//   console.log("\n📦 ===== GET READY TO DELIVERY ORDERS =====");
  
//   try {
//     const orders = await Order.find({ 
//       status: 'ready-to-delivery',
//       isActive: true 
//     })
//     .populate('customer', 'name phone')
//     .populate('garments')
//     .sort({ updatedAt: -1 });
    
//     res.json({
//       success: true,
//       count: orders.length,
//       orders
//     });
//   } catch (error) {
//     console.error("❌ Get ready to delivery error:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // ============================================
// // ✅ 13. GET INCOME BY ORDER ID
// // ============================================
// export const getIncomeByOrder = async (req, res) => {
//   console.log(`\n💰 ===== GET INCOME FOR ORDER: ${req.params.id} =====`);
  
//   try {
//     const incomes = await Transaction.find({
//       order: req.params.id,
//       type: 'income',
//       status: 'completed'
//     })
//     .populate('customer', 'name phone')
//     .sort('-transactionDate');
    
//     const totalIncome = incomes.reduce((sum, t) => sum + t.amount, 0);
    
//     res.json({
//       success: true,
//       count: incomes.length,
//       totalIncome,
//       incomes
//     });
//   } catch (error) {
//     console.error("❌ Get income error:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // ============================================
// // ✅ 14. GET ORDER STATS FOR DASHBOARD (WITH DATE FILTERS)
// // ============================================
// // export const getOrderStatsForDashboard = async (req, res) => {
// //   try {
// //     const { startDate, endDate, period } = req.query;
    
// //     console.log('📊 Getting order stats with filter:', { startDate, endDate, period });
    
// //     let dateFilter = { isActive: true };
    
// //     if (startDate && endDate) {
// //       dateFilter.orderDate = {
// //         $gte: new Date(startDate),
// //         $lte: new Date(endDate + 'T23:59:59.999Z')
// //       };
// //     } else {
// //       const now = new Date();
// //       const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
// //       const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
      
// //       dateFilter.orderDate = {
// //         $gte: firstDay,
// //         $lte: lastDay
// //       };
// //     }

// //     const pendingOrders = await Order.countDocuments({ 
// //       ...dateFilter,
// //       status: 'confirmed'
// //     });
    
// //     const cuttingOrders = await Order.countDocuments({ 
// //       ...dateFilter,
// //       status: 'in-progress'
// //     });
    
// //     const readyOrders = await Order.countDocuments({ 
// //       ...dateFilter,
// //       status: 'ready-to-delivery'
// //     });
    
// //     const deliveredOrders = await Order.countDocuments({ 
// //       ...dateFilter,
// //       status: 'delivered'
// //     });

// //     const cancelledOrders = await Order.countDocuments({ 
// //       ...dateFilter,
// //       status: 'cancelled'
// //     });

// //     const today = new Date();
// //     today.setHours(0, 0, 0, 0);
    
// //     const tomorrow = new Date(today);
// //     tomorrow.setDate(tomorrow.getDate() + 1);

// //     const todayOrders = await Order.countDocuments({
// //       orderDate: { $gte: today, $lt: tomorrow },
// //       isActive: true
// //     });

// //     const todayDeliveries = await Order.countDocuments({
// //       deliveryDate: { $gte: today, $lt: tomorrow },
// //       status: { $ne: 'delivered' },
// //       isActive: true
// //     });

// //     const tomorrowDeliveries = await Order.countDocuments({
// //       deliveryDate: { $gte: tomorrow, $lt: new Date(tomorrow.setDate(tomorrow.getDate() + 1)) },
// //       status: { $ne: 'delivered' },
// //       isActive: true
// //     });

// //     const lateDeliveries = await Order.countDocuments({
// //       deliveryDate: { $lt: today },
// //       status: { $nin: ['delivered', 'cancelled'] },
// //       isActive: true
// //     });

// //     const totalOrders = pendingOrders + cuttingOrders + readyOrders + deliveredOrders;
// //     const inProgressTotal = cuttingOrders;

// //     res.json({
// //       success: true,
// //       stats: {
// //         pending: pendingOrders,
// //         cutting: cuttingOrders,
// //         stitching: cuttingOrders,
// //         ready: readyOrders,
// //         delivered: deliveredOrders,
// //         cancelled: cancelledOrders,
// //         total: totalOrders,
// //         inProgress: inProgressTotal,
// //         today: todayOrders,
// //         deliveries: {
// //           today: todayDeliveries,
// //           tomorrow: tomorrowDeliveries,
// //           late: lateDeliveries,
// //           total: todayDeliveries + tomorrowDeliveries + lateDeliveries
// //         },
// //         filterPeriod: period || 'month',
// //         startDate: dateFilter.orderDate?.$gte || null,
// //         endDate: dateFilter.orderDate?.$lte || null
// //       }
// //     });

// //   } catch (error) {
// //     console.error("❌ Order stats error:", error);
// //     res.status(500).json({ success: false, message: error.message });
// //   }
// // };
// // ============================================
// // ✅ 14. GET ORDER STATS FOR DASHBOARD - WITH DEBUG
// // ============================================
// export const getOrderStatsForDashboard = async (req, res) => {
//   try {
//     const { startDate, endDate, period } = req.query;
    
//     console.log('\n🔴🔴🔴 ===== GET ORDER STATS FOR DASHBOARD ===== 🔴🔴🔴');
//     console.log('📥 Received query params:', { startDate, endDate, period });
//     console.log('👤 User making request:', req.user?._id, req.user?.role);
    
//     // Build date filter
//     let dateFilter = { isActive: true };
    
//     if (period === 'today') {
//       const today = new Date();
//       today.setHours(0, 0, 0, 0);
//       const tomorrow = new Date(today);
//       tomorrow.setDate(tomorrow.getDate() + 1);
      
//       dateFilter.orderDate = {
//         $gte: today,
//         $lt: tomorrow
//       };
//       console.log('📅 Date filter (today):', { 
//         from: today.toISOString(), 
//         to: tomorrow.toISOString() 
//       });
//     } 
//     else if (period === 'week') {
//       const today = new Date();
//       const startOfWeek = new Date(today);
//       startOfWeek.setDate(today.getDate() - today.getDay());
//       startOfWeek.setHours(0, 0, 0, 0);
      
//       const endOfWeek = new Date(startOfWeek);
//       endOfWeek.setDate(startOfWeek.getDate() + 7);
      
//       dateFilter.orderDate = {
//         $gte: startOfWeek,
//         $lt: endOfWeek
//       };
//       console.log('📅 Date filter (week):', { 
//         from: startOfWeek.toISOString(), 
//         to: endOfWeek.toISOString() 
//       });
//     }
//     else if (period === 'month') {
//       const now = new Date();
//       const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
//       const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
//       endOfMonth.setHours(23, 59, 59, 999);
      
//       dateFilter.orderDate = {
//         $gte: startOfMonth,
//         $lte: endOfMonth
//       };
//       console.log('📅 Date filter (month):', { 
//         from: startOfMonth.toISOString(), 
//         to: endOfMonth.toISOString() 
//       });
//     }
//     else if (startDate && endDate) {
//       dateFilter.orderDate = {
//         $gte: new Date(startDate),
//         $lte: new Date(endDate + 'T23:59:59.999Z')
//       };
//       console.log('📅 Date filter (custom):', { 
//         from: startDate, 
//         to: endDate 
//       });
//     }

//     console.log('🔍 Final MongoDB filter:', JSON.stringify(dateFilter, null, 2));

//     // Check total orders in this date range
//     const totalOrdersInRange = await Order.countDocuments(dateFilter);
//     console.log(`📊 Total orders in date range: ${totalOrdersInRange}`);

//     // Get ALL orders to debug
//     const ordersInRange = await Order.find(dateFilter).select('orderId status orderDate');
//     console.log('📋 Orders in range:', ordersInRange.map(o => ({
//       orderId: o.orderId,
//       status: o.status,
//       date: o.orderDate
//     })));

//     // Get counts by status
//     const pendingOrders = await Order.countDocuments({ 
//       ...dateFilter,
//       status: 'confirmed'
//     });
//     console.log('✅ confirmed orders:', pendingOrders);
    
//     const cuttingOrders = await Order.countDocuments({ 
//       ...dateFilter,
//       status: 'in-progress'
//     });
//     console.log('✅ in-progress orders:', cuttingOrders);
    
//     const readyOrders = await Order.countDocuments({ 
//       ...dateFilter,
//       status: 'ready-to-delivery'
//     });
//     console.log('✅ ready-to-delivery orders:', readyOrders);
    
//     const deliveredOrders = await Order.countDocuments({ 
//       ...dateFilter,
//       status: 'delivered'
//     });
//     console.log('✅ delivered orders:', deliveredOrders);

//     const cancelledOrders = await Order.countDocuments({ 
//       ...dateFilter,
//       status: 'cancelled'
//     });
//     console.log('✅ cancelled orders:', cancelledOrders);

//     const draftOrders = await Order.countDocuments({ 
//       ...dateFilter,
//       status: 'draft'
//     });
//     console.log('✅ draft orders:', draftOrders);

//     // Prepare stats object matching your frontend
//     const stats = {
//       total: totalOrdersInRange,
//       pending: pendingOrders,
//       cutting: cuttingOrders,
//       stitching: cuttingOrders, // Same as cutting for now
//       ready: readyOrders,
//       delivered: deliveredOrders,
//       cancelled: cancelledOrders,
//       draft: draftOrders,
//       confirmed: pendingOrders,
//       'in-progress': cuttingOrders,
//       'ready-to-delivery': readyOrders
//     };

//     console.log('📊 FINAL STATS SENDING TO FRONTEND:', stats);
//     console.log('🔴🔴🔴 ===== END ORDER STATS ===== 🔴🔴🔴\n');

//     res.status(200).json({
//       success: true,
//       data: stats
//     });

//   } catch (error) {
//     console.error('❌ ERROR in getOrderStatsForDashboard:', error);
//     res.status(500).json({ 
//       success: false, 
//       message: error.message 
//     });
//   }
// };

// // ============================================
// // ✅ 15. GET RECENT ORDERS (WITH DATE FILTERS)
// // ============================================
// export const getRecentOrders = async (req, res) => {
//   try {
//     const { limit = 10, startDate, endDate, period } = req.query;
    
//     console.log('📋 Getting recent orders with filter:', { startDate, endDate, period, limit });

//     let dateFilter = { isActive: true };
    
//     if (startDate && endDate) {
//       dateFilter.orderDate = {
//         $gte: new Date(startDate),
//         $lte: new Date(endDate + 'T23:59:59.999Z')
//       };
//     } else {
//       const thirtyDaysAgo = new Date();
//       thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
//       dateFilter.orderDate = { $gte: thirtyDaysAgo };
//     }

//     const orders = await Order.find(dateFilter)
//       .populate('customer', 'name phone')
//       .populate('garments', 'name type quantity')
//       .sort({ orderDate: -1 })
//       .limit(parseInt(limit));

//     const formattedOrders = orders.map(order => ({
//       _id: order._id,
//       orderId: order.orderId,
//       orderDate: order.orderDate,
//       customer: order.customer ? {
//         _id: order.customer._id,
//         name: order.customer.name,
//         phone: order.customer.phone
//       } : null,
//       garments: order.garments?.map(g => ({
//         name: g.name,
//         type: g.type,
//         quantity: g.quantity
//       })) || [],
//       deliveryDate: order.deliveryDate,
//       status: order.status,
//       totalAmount: order.priceSummary?.totalMax || 0,
//       paidAmount: order.paymentSummary?.totalPaid || 0,
//       balanceAmount: order.balanceAmount || 0,
//       paymentStatus: order.paymentSummary?.paymentStatus || 'pending'
//     }));

//     console.log(`✅ Found ${formattedOrders.length} recent orders`);

//     res.json({
//       success: true,
//       orders: formattedOrders,
//       count: formattedOrders.length,
//       filter: { startDate, endDate, period }
//     });

//   } catch (error) {
//     console.error("❌ Recent orders error:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // ============================================
// // ✅ 16. GET FILTERED ORDERS
// // ============================================
// export const getFilteredOrders = async (req, res) => {
//   try {
//     const { 
//       startDate, 
//       endDate, 
//       period,
//       status,
//       page = 1,
//       limit = 20
//     } = req.query;

//     console.log('🔍 Getting filtered orders:', { startDate, endDate, period, status });

//     let filter = { isActive: true };
    
//     if (startDate && endDate) {
//       filter.orderDate = {
//         $gte: new Date(startDate),
//         $lte: new Date(endDate + 'T23:59:59.999Z')
//       };
//     }
    
//     if (status && status !== 'all') {
//       filter.status = status;
//     }

//     const skip = (parseInt(page) - 1) * parseInt(limit);
    
//     const orders = await Order.find(filter)
//       .populate('customer', 'name phone')
//       .populate('garments', 'name type quantity price')
//       .sort({ orderDate: -1 })
//       .skip(skip)
//       .limit(parseInt(limit));

//     const totalCount = await Order.countDocuments(filter);

//     const summary = await Order.aggregate([
//       { $match: filter },
//       {
//         $group: {
//           _id: null,
//           totalOrders: { $sum: 1 },
//           totalRevenue: { $sum: '$priceSummary.totalMax' },
//           totalPaid: { $sum: '$paymentSummary.totalPaid' },
//           pendingAmount: { $sum: '$balanceAmount' },
//           avgOrderValue: { $avg: '$priceSummary.totalMax' }
//         }
//       }
//     ]);

//     const formattedOrders = orders.map(order => ({
//       _id: order._id,
//       orderId: order.orderId,
//       orderDate: order.orderDate,
//       customer: order.customer,
//       garments: order.garments,
//       garmentCount: order.garments?.length || 0,
//       deliveryDate: order.deliveryDate,
//       status: order.status,
//       totalAmount: order.priceSummary?.totalMax || 0,
//       paidAmount: order.paymentSummary?.totalPaid || 0,
//       balanceAmount: order.balanceAmount || 0,
//       paymentStatus: order.paymentSummary?.paymentStatus || 'pending'
//     }));

//     res.json({
//       success: true,
//       orders: formattedOrders,
//       summary: summary[0] || {
//         totalOrders: 0,
//         totalRevenue: 0,
//         totalPaid: 0,
//         pendingAmount: 0,
//         avgOrderValue: 0
//       },
//       pagination: {
//         currentPage: parseInt(page),
//         totalPages: Math.ceil(totalCount / parseInt(limit)),
//         totalCount,
//         limit: parseInt(limit)
//       },
//       filter: { startDate, endDate, period, status }
//     });

//   } catch (error) {
//     console.error("❌ Filtered orders error:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };





// //Delivery Clander 


// // ============================================
// // ✅ SIMPLE: Get dates that have orders (just for green dots)
// // ============================================
// export const getOrderDates = async (req, res) => {
//   console.log("\n🟢 ===== GET ORDER DATES =====");
  
//   try {
//     const { month, year } = req.query;
    
//     if (!month || !year) {
//       return res.status(400).json({ 
//         success: false, 
//         message: "Month and year are required" 
//       });
//     }

//     const monthNum = parseInt(month);
//     const yearNum = parseInt(year);

//     // Calculate date range
//     const startDate = new Date(yearNum, monthNum, 1);
//     const endDate = new Date(yearNum, monthNum + 1, 0, 23, 59, 59);

//     // Just get unique dates that have orders
//     const orderDates = await Order.aggregate([
//       {
//         $match: {
//           deliveryDate: { 
//             $gte: startDate, 
//             $lte: endDate 
//           },
//           status: { $ne: 'cancelled' },
//           isActive: true
//         }
//       },
//       {
//         $group: {
//           _id: {
//             $dateToString: { format: "%Y-%m-%d", date: "$deliveryDate" }
//           }
//         }
//       },
//       {
//         $project: {
//           _id: 0,
//           date: "$_id"
//         }
//       },
//       { $sort: { date: 1 } }
//     ]);

//     // Return just array of dates
//     const dates = orderDates.map(item => item.date);

//     console.log(`✅ Found ${dates.length} dates with orders`);
    
//     res.json({
//       success: true,
//       dates: dates,
//       month: monthNum,
//       year: yearNum
//     });

//   } catch (error) {
//     console.error("❌ Error in getOrderDates:", error);
//     res.status(500).json({ 
//       success: false, 
//       message: error.message 
//     });
//   }
// };





// // controllers/order.controller.js
// import Order from "../models/Order.js";
// import Garment from "../models/Garment.js";
// import Work from "../models/Work.js";
// import Customer from "../models/Customer.js";
// import Payment from "../models/Payment.js";
// import Transaction from "../models/Transaction.js";
// import CuttingMaster from "../models/CuttingMaster.js";
// import Tailor from "../models/Tailor.js";
// import StoreKeeper from "../models/StoreKeeper.js";
// import { createNotification } from "./notification.controller.js";
// import crypto from "crypto";

// // ============================================
// // ✅ HELPER: CREATE INCOME FROM PAYMENT
// // ============================================
// const createIncomeFromPayment = async (payment, order, creatorId) => {
//   try {
//     console.log(`💰 Creating income from payment: ₹${payment.amount}`);
    
//     const accountType = payment.method === 'cash' ? 'hand-cash' : 'bank';
    
//     let category = 'customer-advance';
//     if (payment.type === 'full') {
//       category = 'full-payment';
//     } else if (payment.type === 'advance' && order.paymentSummary?.paymentStatus === 'paid') {
//       category = 'full-payment';
//     } else if (payment.type === 'extra') {
//       category = 'fabric-sale';
//     }
    
//     const customer = await Customer.findById(order.customer);
    
//     const incomeTransaction = await Transaction.create({
//       type: 'income',
//       category: category,
//       amount: payment.amount,
//       paymentMethod: payment.method,
//       accountType: accountType,
//       customer: order.customer,
//       customerDetails: customer ? {
//         name: customer.name || `${customer.firstName || ''} ${customer.lastName || ''}`.trim(),
//         phone: customer.phone,
//         id: customer.customerId || customer._id
//       } : null,
//       order: order._id,
//       description: `Payment for Order #${order.orderId} - ${payment.notes || payment.type || 'advance'}`,
//       transactionDate: payment.paymentDate || new Date(),
//       referenceNumber: payment.referenceNumber || '',
//       createdBy: creatorId,
//       status: 'completed'
//     });
    
//     console.log(`✅ Income created: ₹${payment.amount} (${category}) - ${accountType}`);
//     return incomeTransaction;
//   } catch (error) {
//     console.error("❌ Error creating income:", error);
//     return null;
//   }
// };

// // ============================================
// // ✅ HELPER: UPDATE ORDER PAYMENT SUMMARY
// // ============================================
// const updateOrderPaymentSummary = async (orderId) => {
//   console.log(`\n💰 Updating payment summary for order: ${orderId}`);
  
//   try {
//     const order = await Order.findById(orderId);
//     if (!order) return;

//     const payments = await Payment.find({ 
//       order: orderId, 
//       isDeleted: false,
//       type: { $in: ['advance', 'full', 'partial', 'extra'] }
//     });

//     const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
//     const lastPayment = payments.sort((a, b) => 
//       new Date(b.paymentDate) - new Date(a.paymentDate)
//     )[0];

//     let paymentStatus = 'pending';
//     const totalAmount = order.priceSummary?.totalMax || 0;
    
//     if (totalPaid >= totalAmount) {
//       paymentStatus = totalPaid > totalAmount ? 'overpaid' : 'paid';
//     } else if (totalPaid > 0) {
//       paymentStatus = 'partial';
//     }

//     order.paymentSummary = {
//       totalPaid,
//       lastPaymentDate: lastPayment?.paymentDate,
//       lastPaymentAmount: lastPayment?.amount,
//       paymentCount: payments.length,
//       paymentStatus
//     };
    
//     order.balanceAmount = totalAmount - totalPaid;
    
//     await order.save();
//     console.log(`✅ Payment summary updated: Paid: ₹${totalPaid}, Status: ${paymentStatus}`);
    
//     return { success: true, totalPaid, paymentStatus };
//   } catch (error) {
//     console.error("❌ Error updating payment summary:", error);
//     return { success: false, error: error.message };
//   }
// };

// // ============================================
// // ✅ HELPER: CREATE WORKS FROM EXISTING GARMENTS
// // ============================================
// const createWorksFromGarments = async (orderId, garmentIds, creatorId) => {
//   console.log(`\n🚀 Creating works for ${garmentIds?.length || 0} garments...`);
  
//   try {
//     if (!garmentIds || garmentIds.length === 0) return { success: true, works: [] };
    
//     // Check if works already exist for these garments
//     const existingWorks = await Work.find({ 
//       garment: { $in: garmentIds },
//       isActive: true 
//     });
    
//     if (existingWorks.length > 0) {
//       console.log(`⚠️ Works already exist for ${existingWorks.length} garments, skipping creation`);
//       return { success: true, works: existingWorks };
//     }
    
//     // Get the garment documents to access their data
//     const garmentDocs = await Garment.find({ _id: { $in: garmentIds } }).lean();
//     console.log(`📦 Found ${garmentDocs.length} garments in database`);
    
//     const cuttingMasters = await CuttingMaster.find({ isActive: true }).lean();

//     const workPromises = garmentDocs.map(garment => {
//       const workId = `WRK-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      
//       return Work.create({
//         workId,
//         order: orderId,
//         garment: garment._id,
//         createdBy: creatorId,
//         status: "pending",
//         cuttingMaster: null,
//         estimatedDelivery: garment.estimatedDelivery || new Date(Date.now() + 7*24*60*60*1000)
//       });
//     });
    
//     const works = await Promise.all(workPromises);
//     console.log(`✅ Created ${works.length} works`);
    
//     // Update garments with their work IDs
//     const updatePromises = works.map(work => 
//       Garment.findByIdAndUpdate(work.garment, { workId: work._id })
//     );
//     await Promise.all(updatePromises);
//     console.log(`✅ Updated ${works.length} garments with work IDs`);
    
//     // Send notifications to cutting masters
//     if (works.length > 0 && cuttingMasters.length > 0) {
//       cuttingMasters.forEach(master => {
//         createNotification({
//           type: 'work-available',
//           recipient: master._id,
//           title: '🔔 New Work Available',
//           message: `${works.length} new work(s) are waiting for acceptance`,
//           reference: {
//             orderId: orderId,
//             workCount: works.length,
//             workIds: works.map(w => w._id)
//           },
//           priority: 'high'
//         }).catch(() => {});
//       });
//     }
    
//     return { success: true, works };
//   } catch (error) {
//     console.error("\n❌ ERROR CREATING WORKS:", error);
//     return { success: false, error: error.message };
//   }
// };

// // ============================================
// // ✅ 1. GET ORDER STATS (ORIGINAL)
// // ============================================
// export const getOrderStats = async (req, res) => {
//   console.log("\n📊 ===== GET ORDER STATS =====");
//   try {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     const startOfWeek = new Date(today);
//     startOfWeek.setDate(today.getDate() - today.getDay());

//     const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

//     const [todayCount, weekCount, monthCount, totalCount] = await Promise.all([
//       Order.countDocuments({ createdAt: { $gte: today }, isActive: true }),
//       Order.countDocuments({ createdAt: { $gte: startOfWeek }, isActive: true }),
//       Order.countDocuments({ createdAt: { $gte: startOfMonth }, isActive: true }),
//       Order.countDocuments({ isActive: true })
//     ]);

//     const statusStats = await Order.aggregate([
//       { $match: { isActive: true } },
//       { $group: { _id: "$status", count: { $sum: 1 } } }
//     ]);

//     const paymentStats = await Order.aggregate([
//       { $match: { isActive: true } },
//       { $group: { 
//         _id: "$paymentSummary.paymentStatus",
//         count: { $sum: 1 },
//         totalAmount: { $sum: "$priceSummary.totalMax" },
//         totalPaid: { $sum: "$paymentSummary.totalPaid" }
//       }}
//     ]);

//     res.status(200).json({
//       success: true,
//       stats: {
//         today: todayCount,
//         thisWeek: weekCount,
//         thisMonth: monthCount,
//         total: totalCount,
//         statusBreakdown: statusStats,
//         paymentBreakdown: paymentStats
//       }
//     });
//   } catch (error) {
//     console.error("❌ Stats Error:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // ============================================
// // ✅ 2. CREATE ORDER (WITH PAYMENTS & AUTO-INCOME) - COMPLETELY FIXED WITH DUPLICATE PREVENTION
// // ============================================
// export const createOrder = async (req, res) => {
//   console.log("\n🆕 ===== CREATE ORDER =====");
  
//   try {
//     const {
//       customer,
//       deliveryDate,
//       garments,
//       specialNotes,
//       advancePayment,
//       priceSummary,
//       status,
//       orderDate,
//       payments = [],
//       requestId // 🔥 NEW: Add requestId to prevent duplicates
//     } = req.body;

//     const creatorId = req.user?._id || req.user?.id;
//     if (!creatorId) {
//       return res.status(401).json({ success: false, message: "Authentication failed" });
//     }

//     if (!customer || !deliveryDate) {
//       return res.status(400).json({ success: false, message: "Customer and Delivery Date are required" });
//     }

//     // 🔥 NEW: Check if this request was already processed (using requestId)
//     if (requestId) {
//       const existingOrder = await Order.findOne({ 'metadata.requestId': requestId });
//       if (existingOrder) {
//         console.log(`⚠️ Duplicate request detected: ${requestId}`);
//         return res.status(409).json({ 
//           success: false, 
//           message: "This order has already been created",
//           orderId: existingOrder._id
//         });
//       }
//     }

//     const date = new Date();
//     const day = String(date.getDate()).padStart(2, '0');
//     const month = String(date.getMonth() + 1).padStart(2, '0');
//     const year = date.getFullYear();
//     const orderId = `${day}${month}${year}-${Date.now().toString().slice(-4)}`;

//     // Calculate totals from the garment objects directly
//     let totalMin = priceSummary?.totalMin || 0;
//     let totalMax = priceSummary?.totalMax || 0;
    
//     if (garments && garments.length > 0) {
//       console.log(`📦 Received ${garments.length} garments with full data`);
      
//       garments.forEach(g => {
//         if (g.priceRange) {
//           totalMin += g.priceRange.min || 0;
//           totalMax += g.priceRange.max || 0;
//         }
//       });
      
//       console.log(`💰 Calculated totals - Min: ${totalMin}, Max: ${totalMax}`);
//     }

//     let allPayments = [...payments];
//     if (advancePayment?.amount > 0 && !allPayments.some(p => p.type === 'advance')) {
//       allPayments.push({
//         amount: advancePayment.amount,
//         type: 'advance',
//         method: advancePayment.method || 'cash',
//         paymentDate: advancePayment.date || new Date(),
//         notes: 'Initial advance payment'
//       });
//     }

//     const totalInitialPaid = allPayments.reduce((sum, p) => sum + (p.amount || 0), 0);

//     // Create order with empty garments array initially
//     const order = await Order.create({
//       orderId,
//       customer,
//       deliveryDate,
//       garments: [],
//       specialNotes,
//       advancePayment: {
//         amount: advancePayment?.amount || 0,
//         method: advancePayment?.method || "cash",
//         date: advancePayment?.date || new Date(),
//       },
//       priceSummary: { totalMin, totalMax },
//       paymentSummary: {
//         totalPaid: totalInitialPaid,
//         lastPaymentDate: allPayments.length > 0 ? new Date() : null,
//         lastPaymentAmount: allPayments.length > 0 ? allPayments[allPayments.length - 1].amount : 0,
//         paymentCount: allPayments.length,
//         paymentStatus: totalInitialPaid >= totalMax ? 'paid' : (totalInitialPaid > 0 ? 'partial' : 'pending')
//       },
//       balanceAmount: totalMax - totalInitialPaid,
//       createdBy: creatorId,
//       status: status || "draft",
//       orderDate: orderDate || new Date(),
//       metadata: {
//         requestId: requestId || null,
//         createdAt: new Date()
//       }
//     });

//     console.log(`✅ Order created with ID: ${order._id}`);

//     const promises = [];

//     // 🔥 FIX: Create payments with duplicate prevention
//     if (allPayments.length > 0) {
//       // Check if payments already exist for this order
//       const existingPayments = await Payment.find({ order: order._id });
      
//       if (existingPayments.length === 0) {
//         const paymentPromises = allPayments.map(async (paymentData) => {
//           // Format time as HH:MM:SS
//           const now = new Date();
//           const hours = String(now.getHours()).padStart(2, '0');
//           const minutes = String(now.getMinutes()).padStart(2, '0');
//           const seconds = String(now.getSeconds()).padStart(2, '0');
//           const paymentTime = `${hours}:${minutes}:${seconds}`;
          
//           // Create a unique identifier for this payment to prevent duplicates
//           const paymentHash = crypto
//             .createHash('md5')
//             .update(`${order._id}-${paymentData.amount}-${paymentData.type}-${Date.now()}`)
//             .digest('hex');
          
//           const payment = await Payment.create({
//             order: order._id,
//             customer: order.customer,
//             amount: paymentData.amount,
//             type: paymentData.type || 'advance',
//             method: paymentData.method || 'cash',
//             referenceNumber: paymentData.referenceNumber || '',
//             paymentDate: paymentData.paymentDate || new Date(),
//             paymentTime: paymentTime,
//             notes: paymentData.notes || '',
//             receivedBy: creatorId,
//             metadata: {
//               hash: paymentHash,
//               requestId: requestId
//             }
//           });
          
//           await createIncomeFromPayment(payment, order, creatorId);
//           return payment;
//         });
        
//         promises.push(Promise.all(paymentPromises));
//       } else {
//         console.log(`⚠️ Payments already exist for order ${order._id}, skipping creation`);
//       }
//     }

//     // 🔥 FIX: Create garments with duplicate prevention
//     if (garments && garments.length > 0) {
//       console.log(`👕 Creating ${garments.length} garment documents...`);
      
//       // Check if garments already exist for this order
//       const existingGarments = await Garment.find({ order: order._id });
      
//       if (existingGarments.length === 0) {
//         // Create actual Garment documents
//         const garmentPromises = garments.map(async (g) => {
//           // Prepare garment data with proper handling of fields
//           const garmentData = {
//             name: g.name,
//             garmentType: g.garmentType || g.item || g.itemName || g.name,
//             category: g.category,
//             item: g.item,
//             categoryName: g.categoryName,
//             itemName: g.itemName,
//             measurements: g.measurements || [],
//             measurementTemplate: g.measurementTemplate && g.measurementTemplate !== '' 
//               ? g.measurementTemplate 
//               : null,
//             measurementSource: g.measurementSource || 'customer',
//             additionalInfo: g.additionalInfo || '',
//             estimatedDelivery: g.estimatedDelivery || deliveryDate,
//             priority: g.priority || 'normal',
//             priceRange: {
//               min: Number(g.priceRange?.min) || 0,
//               max: Number(g.priceRange?.max) || 0
//             },
//             fabricSource: g.fabricSource || 'customer',
//             fabricPrice: g.fabricPrice || '0',
//             order: order._id,
//             createdBy: creatorId,
//             status: 'pending',
//             metadata: {
//               requestId: requestId
//             }
//           };

//           // Remove undefined fields
//           Object.keys(garmentData).forEach(key => 
//             garmentData[key] === undefined && delete garmentData[key]
//           );

//           console.log(`📝 Creating garment with data:`, JSON.stringify(garmentData, null, 2));
          
//           const garment = await Garment.create(garmentData);
          
//           console.log(`✅ Created garment: ${garment._id}`);
//           return garment;
//         });
        
//         const createdGarments = await Promise.all(garmentPromises);
//         const garmentIds = createdGarments.map(g => g._id);
        
//         // Update the order with the actual garment IDs
//         order.garments = garmentIds;
//         order.status = "confirmed";
//         await order.save();
//         console.log(`✅ Order updated with ${garmentIds.length} garment IDs`);
        
//         // Create works for these garments
//         const worksPromise = createWorksFromGarments(order._id, garmentIds, creatorId);
//         promises.push(worksPromise);
//       } else {
//         console.log(`⚠️ Garments already exist for order ${order._id}, skipping creation`);
//       }
//     }

//     await Promise.all(promises);

//     await order.populate('customer', 'name phone customerId');

//     res.status(201).json({ 
//       success: true, 
//       message: "Order created successfully",
//       order 
//     });
//   } catch (error) {
//     console.error("\n❌ CREATE ORDER ERROR:", error);
    
//     if (error.name === 'ValidationError') {
//       const errors = Object.values(error.errors).map(err => err.message);
//       return res.status(400).json({ success: false, message: "Validation failed", errors });
//     }
    
//     // Handle duplicate key errors
//     if (error.code === 11000) {
//       const field = Object.keys(error.keyPattern)[0];
//       const value = error.keyValue[field];
//       return res.status(400).json({ 
//         success: false, 
//         message: `Duplicate ${field}: ${value}. Please try again.` 
//       });
//     }
    
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // ============================================
// // ✅ 3. GET ALL ORDERS
// // ============================================
// export const getAllOrders = async (req, res) => {
//   console.log("\n📋 ===== GET ALL ORDERS =====");
  
//   try {
//     const {
//       page = 1,
//       limit = 10,
//       search = "",
//       status,
//       paymentStatus,
//       timeFilter = "all",
//       startDate,
//       endDate,
//     } = req.query;

//     let query = { isActive: true };

//     if (search) {
//       const customerIds = await Customer.find({
//         $or: [
//           { name: { $regex: search, $options: 'i' } },
//           { phone: { $regex: search, $options: 'i' } }
//         ]
//       }).distinct('_id');
      
//       query.$or = [
//         { orderId: { $regex: search, $options: 'i' } },
//         { customer: { $in: customerIds } }
//       ];
//     }

//     if (status && status !== "all") {
//       query.status = status;
//     }

//     if (paymentStatus && paymentStatus !== "all") {
//       query['paymentSummary.paymentStatus'] = paymentStatus;
//     }

//     const now = new Date();
//     if (timeFilter !== "all") {
//       let filterDate = new Date();
//       if (timeFilter === "week") filterDate.setDate(now.getDate() - 7);
//       else if (timeFilter === "month") filterDate.setMonth(now.getMonth() - 1);
//       else if (timeFilter === "3m") filterDate.setMonth(now.getMonth() - 3);
      
//       query.createdAt = { $gte: filterDate };
//     }

//     if (startDate && endDate) {
//       query.createdAt = { 
//         $gte: new Date(startDate), 
//         $lte: new Date(endDate) 
//       };
//     }

//     const total = await Order.countDocuments(query);

//     const orders = await Order.find(query)
//       .populate('customer', 'name phone customerId')
//       .populate("garments")
//       .populate("createdBy", "name")
//       .sort({ createdAt: -1 })
//       .skip((page - 1) * limit)
//       .limit(parseInt(limit));

//     res.json({ 
//       success: true, 
//       orders, 
//       pagination: { 
//         page: parseInt(page), 
//         limit: parseInt(limit), 
//         total, 
//         pages: Math.ceil(total / limit) 
//       } 
//     });
//   } catch (error) {
//     console.error("❌ Get all orders error:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // ============================================
// // ✅ 4. GET ORDER BY ID
// // ============================================
// export const getOrderById = async (req, res) => {
//   console.log(`\n🔍 ===== GET ORDER BY ID: ${req.params.id} =====`);
  
//   try {
//     const order = await Order.findById(req.params.id)
//       .populate('customer', 'name phone customerId email address addressLine1 addressLine2 city state pincode')
//       .populate({
//         path: "garments",
//         populate: [
//           { path: "category", select: "name" },
//           { path: "item", select: "name" },
//           { path: "workId" }
//         ]
//       })
//       .populate("createdBy", "name");

//     if (!order) {
//       return res.status(404).json({ success: false, message: "Order not found" });
//     }

//     const payments = await Payment.find({ 
//       order: order._id,
//       isDeleted: false 
//     })
//     .populate('receivedBy', 'name')
//     .sort('-paymentDate -paymentTime');

//     const works = await Work.find({ order: order._id, isActive: true })
//       .populate('garment', 'name item category')
//       .populate('cuttingMaster', 'name');

//     res.json({ 
//       success: true, 
//       order,
//       payments,
//       works
//     });
//   } catch (error) {
//     console.error("❌ Get order error:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // ============================================
// // ✅ 5. UPDATE ORDER
// // ============================================
// export const updateOrder = async (req, res) => {
//   console.log(`\n📝 ===== UPDATE ORDER: ${req.params.id} =====`);
  
//   try {
//     const { id } = req.params;
//     const {
//       deliveryDate,
//       specialNotes,
//       advancePayment,
//       priceSummary,
//       status,
//       newGarments
//     } = req.body;

//     const order = await Order.findById(id);
//     if (!order) {
//       return res.status(404).json({ success: false, message: "Order not found" });
//     }

//     if (deliveryDate) order.deliveryDate = deliveryDate;
//     if (specialNotes !== undefined) order.specialNotes = specialNotes;
    
//     if (advancePayment) {
//       order.advancePayment = {
//         amount: advancePayment.amount !== undefined ? advancePayment.amount : order.advancePayment.amount,
//         method: advancePayment.method || order.advancePayment.method,
//         date: advancePayment.date || order.advancePayment.date || new Date()
//       };
//     }
    
//     if (priceSummary) {
//       order.priceSummary = {
//         totalMin: priceSummary.totalMin !== undefined ? priceSummary.totalMin : order.priceSummary.totalMin,
//         totalMax: priceSummary.totalMax !== undefined ? priceSummary.totalMax : order.priceSummary.totalMax
//       };
//     }
    
//     if (status) order.status = status;

//     if (newGarments && newGarments.length > 0) {
//       order.garments = [...order.garments, ...newGarments];
      
//       const creatorId = req.user?._id || req.user?.id;
//       await createWorksFromGarments(order._id, newGarments, creatorId);
//     }

//     await order.save();
    
//     await updateOrderPaymentSummary(order._id);
    
//     res.json({ success: true, message: "Order updated successfully", order });
//   } catch (error) {
//     console.error("❌ Update error:", error);
    
//     if (error.name === 'ValidationError') {
//       const errors = Object.values(error.errors).map(err => err.message);
//       return res.status(400).json({ success: false, message: "Validation failed", errors });
//     }
    
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // ============================================
// // ✅ 6. UPDATE ORDER STATUS
// // ============================================
// export const updateOrderStatus = async (req, res) => {
//   console.log(`\n🔄 ===== UPDATE ORDER STATUS: ${req.params.id} =====`);
  
//   try {
//     const { status } = req.body;
//     const { id } = req.params;
//     const userId = req.user?._id || req.user?.id;
    
//     const validStatuses = ["draft", "confirmed", "in-progress", "ready-to-delivery", "delivered", "cancelled"];
//     if (!validStatuses.includes(status)) {
//       return res.status(400).json({ 
//         success: false, 
//         message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` 
//       });
//     }
    
//     const order = await Order.findById(id)
//       .populate('customer', 'name phone')
//       .populate('garments');
      
//     if (!order) {
//       return res.status(404).json({ success: false, message: "Order not found" });
//     }
    
//     const validTransitions = {
//       'draft': ['confirmed', 'cancelled'],
//       'confirmed': ['in-progress', 'cancelled'],
//       'in-progress': ['ready-to-delivery', 'cancelled'],
//       'ready-to-delivery': ['delivered', 'cancelled'],
//       'delivered': [],
//       'cancelled': []
//     };
    
//     if (!validTransitions[order.status]?.includes(status)) {
//       return res.status(400).json({ 
//         success: false, 
//         message: `Cannot transition from ${order.status} to ${status}` 
//       });
//     }
    
//     const oldStatus = order.status;
//     order.status = status;
//     await order.save();
    
//     console.log(`✅ Status updated: ${oldStatus} → ${status}`);

//     // Notifications based on status
//     if (status === 'ready-to-delivery') {
//       const storeKeepers = await StoreKeeper.find({ isActive: true }).lean();
//       storeKeepers.forEach(keeper => {
//         createNotification({
//           type: 'delivery-ready',
//           recipient: keeper._id,
//           title: '📦 Order Ready for Delivery',
//           message: `Order #${order.orderId} for ${order.customer?.name || 'Customer'} is ready for delivery`,
//           reference: { orderId: order._id, orderNumber: order.orderId },
//           priority: 'high'
//         }).catch(() => {});
//       });
//     }
//     else if (status === 'delivered') {
//       await updateOrderPaymentSummary(order._id);
      
//       const storeKeepers = await StoreKeeper.find({ isActive: true }).lean();
//       storeKeepers.forEach(keeper => {
//         createNotification({
//           type: 'order-delivered',
//           recipient: keeper._id,
//           title: '✅ Order Delivered',
//           message: `Order #${order.orderId} has been delivered`,
//           reference: { orderId: order._id },
//           priority: 'medium'
//         }).catch(() => {});
//       });
//     }
//     else if (status === 'cancelled') {
//       await Work.updateMany(
//         { order: order._id, status: { $ne: 'completed' } },
//         { status: 'cancelled', isActive: false }
//       );
//     }

//     // Update related works
//     try {
//       if (status === 'in-progress') {
//         await Work.updateMany(
//           { order: order._id, status: 'pending' },
//           { status: 'in-progress' }
//         );
//       }
//       else if (status === 'delivered') {
//         await Work.updateMany(
//           { order: order._id, status: { $ne: 'completed' } },
//           { status: 'completed' }
//         );
//       }
//     } catch (workErr) {
//       console.log("Work update error:", workErr.message);
//     }
    
//     const updatedOrder = await Order.findById(id)
//       .populate('customer', 'name phone customerId')
//       .populate('garments');
    
//     res.json({ 
//       success: true, 
//       message: `Order status updated from ${oldStatus} to ${status}`,
//       order: updatedOrder 
//     });
    
//   } catch (error) {
//     console.error("❌ Update status error:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // ============================================
// // ✅ 7. DELETE ORDER (SOFT DELETE)
// // ============================================
// export const deleteOrder = async (req, res) => {
//   console.log(`\n🗑️ ===== DELETE ORDER: ${req.params.id} =====`);
  
//   try {
//     const order = await Order.findById(req.params.id);
//     if (!order) {
//       return res.status(404).json({ success: false, message: "Order not found" });
//     }

//     await Garment.updateMany({ _id: { $in: order.garments } }, { isActive: false });
//     await Work.updateMany({ order: order._id }, { isActive: false });
//     await Payment.updateMany({ order: order._id }, { isDeleted: true });
//     await Transaction.updateMany({ order: order._id }, { status: 'cancelled' });

//     order.isActive = false;
//     await order.save();

//     res.json({ success: true, message: "Order deleted successfully" });
//   } catch (error) {
//     console.error("❌ Delete error:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // ============================================
// // ✅ 8. ADD PAYMENT TO ORDER (WITH AUTO-INCOME)
// // ============================================
// export const addPaymentToOrder = async (req, res) => {
//   console.log(`\n💰 ===== ADD PAYMENT TO ORDER: ${req.params.id} =====`);
  
//   try {
//     const { id } = req.params;
//     const paymentData = req.body;
    
//     const order = await Order.findById(id).populate('customer');
//     if (!order) {
//       return res.status(404).json({ success: false, message: "Order not found" });
//     }
    
//     const creatorId = req.user?._id || req.user?.id;
    
//     // Format time as HH:MM:SS
//     const now = new Date();
//     const hours = String(now.getHours()).padStart(2, '0');
//     const minutes = String(now.getMinutes()).padStart(2, '0');
//     const seconds = String(now.getSeconds()).padStart(2, '0');
//     const paymentTime = `${hours}:${minutes}:${seconds}`;
    
//     const payment = await Payment.create({
//       order: order._id,
//       customer: order.customer,
//       amount: paymentData.amount,
//       type: paymentData.type || 'advance',
//       method: paymentData.method || 'cash',
//       referenceNumber: paymentData.referenceNumber || '',
//       paymentDate: paymentData.paymentDate || new Date(),
//       paymentTime: paymentTime,
//       notes: paymentData.notes || '',
//       receivedBy: creatorId
//     });
    
//     await createIncomeFromPayment(payment, order, creatorId);
//     await updateOrderPaymentSummary(order._id);
    
//     res.status(201).json({ success: true, message: "Payment added and income created", payment });
//   } catch (error) {
//     console.error("❌ Add payment error:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // ============================================
// // ✅ 9. GET ORDER PAYMENTS
// // ============================================
// export const getOrderPayments = async (req, res) => {
//   console.log(`\n💰 ===== GET ORDER PAYMENTS: ${req.params.id} =====`);
  
//   try {
//     const payments = await Payment.find({ 
//       order: req.params.id,
//       isDeleted: false 
//     })
//     .populate('receivedBy', 'name')
//     .sort('-paymentDate -paymentTime');
    
//     res.json({ success: true, payments });
//   } catch (error) {
//     console.error("❌ Get payments error:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // ============================================
// // ✅ 10. GET DASHBOARD DATA
// // ============================================
// export const getDashboardData = async (req, res) => {
//   console.log("\n📊 ===== GET DASHBOARD DATA =====");
  
//   try {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     const todayOrders = await Order.find({
//       createdAt: { $gte: today },
//       isActive: true
//     }).populate('customer', 'name');

//     const pendingDeliveries = await Order.find({
//       deliveryDate: { $lt: new Date() },
//       status: { $nin: ['delivered', 'cancelled'] },
//       isActive: true
//     }).populate('customer', 'name phone');

//     const readyForDelivery = await Order.find({
//       status: 'ready-to-delivery',
//       isActive: true
//     }).populate('customer', 'name phone');

//     const recentOrders = await Order.find({ isActive: true })
//       .populate('customer', 'name')
//       .sort({ createdAt: -1 })
//       .limit(10);

//     const todayPayments = await Payment.find({
//       paymentDate: { $gte: today },
//       isDeleted: false
//     });

//     const todayCollection = todayPayments.reduce((sum, p) => sum + p.amount, 0);

//     const todayIncome = await Transaction.find({
//       transactionDate: { $gte: today },
//       type: 'income',
//       status: 'completed'
//     });

//     const totalIncomeToday = todayIncome.reduce((sum, t) => sum + t.amount, 0);

//     res.json({
//       success: true,
//       dashboard: {
//         todayOrders: { count: todayOrders.length, orders: todayOrders },
//         pendingDeliveries: { count: pendingDeliveries.length, orders: pendingDeliveries },
//         readyForDelivery: { count: readyForDelivery.length, orders: readyForDelivery },
//         recentOrders,
//         todayCollection,
//         totalIncomeToday,
//         incomeBreakdown: {
//           handCash: todayIncome.filter(t => t.accountType === 'hand-cash').reduce((sum, t) => sum + t.amount, 0),
//           bank: todayIncome.filter(t => t.accountType === 'bank').reduce((sum, t) => sum + t.amount, 0)
//         }
//       }
//     });
//   } catch (error) {
//     console.error("❌ Dashboard error:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // ============================================
// // ✅ 11. GET ORDERS BY CUSTOMER
// // ============================================
// export const getOrdersByCustomer = async (req, res) => {
//   try {
//     const { customerId } = req.params;
    
//     console.log(`🔍 Fetching orders for customer: ${customerId}`);
    
//     const orders = await Order.find({ 
//       customer: customerId,
//       isActive: true 
//     })
//     .populate('customer', 'name phone email customerId')
//     .populate('garments')
//     .sort('-createdAt');
    
//     console.log(`✅ Found ${orders.length} orders for customer ${customerId}`);
    
//     res.status(200).json({
//       success: true,
//       count: orders.length,
//       orders: orders
//     });
    
//   } catch (error) {
//     console.error(`❌ Error fetching orders for customer ${req.params.customerId}:`, error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ============================================
// // ✅ 12. GET READY TO DELIVERY ORDERS
// // ============================================
// export const getReadyToDeliveryOrders = async (req, res) => {
//   console.log("\n📦 ===== GET READY TO DELIVERY ORDERS =====");
  
//   try {
//     const orders = await Order.find({ 
//       status: 'ready-to-delivery',
//       isActive: true 
//     })
//     .populate('customer', 'name phone')
//     .populate('garments')
//     .sort({ updatedAt: -1 });
    
//     res.json({
//       success: true,
//       count: orders.length,
//       orders
//     });
//   } catch (error) {
//     console.error("❌ Get ready to delivery error:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // ============================================
// // ✅ 13. GET INCOME BY ORDER ID
// // ============================================
// export const getIncomeByOrder = async (req, res) => {
//   console.log(`\n💰 ===== GET INCOME FOR ORDER: ${req.params.id} =====`);
  
//   try {
//     const incomes = await Transaction.find({
//       order: req.params.id,
//       type: 'income',
//       status: 'completed'
//     })
//     .populate('customer', 'name phone')
//     .sort('-transactionDate');
    
//     const totalIncome = incomes.reduce((sum, t) => sum + t.amount, 0);
    
//     res.json({
//       success: true,
//       count: incomes.length,
//       totalIncome,
//       incomes
//     });
//   } catch (error) {
//     console.error("❌ Get income error:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // ============================================
// // ✅ 14. GET ORDER STATS FOR DASHBOARD - WITH DEBUG
// // ============================================
// export const getOrderStatsForDashboard = async (req, res) => {
//   try {
//     const { startDate, endDate, period } = req.query;
    
//     console.log('\n🔴🔴🔴 ===== GET ORDER STATS FOR DASHBOARD ===== 🔴🔴🔴');
//     console.log('📥 Received query params:', { startDate, endDate, period });
//     console.log('👤 User making request:', req.user?._id, req.user?.role);
    
//     // Build date filter
//     let dateFilter = { isActive: true };
    
//     if (period === 'today') {
//       const today = new Date();
//       today.setHours(0, 0, 0, 0);
//       const tomorrow = new Date(today);
//       tomorrow.setDate(tomorrow.getDate() + 1);
      
//       dateFilter.orderDate = {
//         $gte: today,
//         $lt: tomorrow
//       };
//       console.log('📅 Date filter (today):', { 
//         from: today.toISOString(), 
//         to: tomorrow.toISOString() 
//       });
//     } 
//     else if (period === 'week') {
//       const today = new Date();
//       const startOfWeek = new Date(today);
//       startOfWeek.setDate(today.getDate() - today.getDay());
//       startOfWeek.setHours(0, 0, 0, 0);
      
//       const endOfWeek = new Date(startOfWeek);
//       endOfWeek.setDate(startOfWeek.getDate() + 7);
      
//       dateFilter.orderDate = {
//         $gte: startOfWeek,
//         $lt: endOfWeek
//       };
//       console.log('📅 Date filter (week):', { 
//         from: startOfWeek.toISOString(), 
//         to: endOfWeek.toISOString() 
//       });
//     }
//     else if (period === 'month') {
//       const now = new Date();
//       const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
//       const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
//       endOfMonth.setHours(23, 59, 59, 999);
      
//       dateFilter.orderDate = {
//         $gte: startOfMonth,
//         $lte: endOfMonth
//       };
//       console.log('📅 Date filter (month):', { 
//         from: startOfMonth.toISOString(), 
//         to: endOfMonth.toISOString() 
//       });
//     }
//     else if (startDate && endDate) {
//       dateFilter.orderDate = {
//         $gte: new Date(startDate),
//         $lte: new Date(endDate + 'T23:59:59.999Z')
//       };
//       console.log('📅 Date filter (custom):', { 
//         from: startDate, 
//         to: endDate 
//       });
//     }

//     console.log('🔍 Final MongoDB filter:', JSON.stringify(dateFilter, null, 2));

//     // Check total orders in this date range
//     const totalOrdersInRange = await Order.countDocuments(dateFilter);
//     console.log(`📊 Total orders in date range: ${totalOrdersInRange}`);

//     // Get ALL orders to debug
//     const ordersInRange = await Order.find(dateFilter).select('orderId status orderDate');
//     console.log('📋 Orders in range:', ordersInRange.map(o => ({
//       orderId: o.orderId,
//       status: o.status,
//       date: o.orderDate
//     })));

//     // Get counts by status
//     const pendingOrders = await Order.countDocuments({ 
//       ...dateFilter,
//       status: 'confirmed'
//     });
//     console.log('✅ confirmed orders:', pendingOrders);
    
//     const cuttingOrders = await Order.countDocuments({ 
//       ...dateFilter,
//       status: 'in-progress'
//     });
//     console.log('✅ in-progress orders:', cuttingOrders);
    
//     const readyOrders = await Order.countDocuments({ 
//       ...dateFilter,
//       status: 'ready-to-delivery'
//     });
//     console.log('✅ ready-to-delivery orders:', readyOrders);
    
//     const deliveredOrders = await Order.countDocuments({ 
//       ...dateFilter,
//       status: 'delivered'
//     });
//     console.log('✅ delivered orders:', deliveredOrders);

//     const cancelledOrders = await Order.countDocuments({ 
//       ...dateFilter,
//       status: 'cancelled'
//     });
//     console.log('✅ cancelled orders:', cancelledOrders);

//     const draftOrders = await Order.countDocuments({ 
//       ...dateFilter,
//       status: 'draft'
//     });
//     console.log('✅ draft orders:', draftOrders);

//     // Prepare stats object matching your frontend
//     const stats = {
//       total: totalOrdersInRange,
//       pending: pendingOrders,
//       cutting: cuttingOrders,
//       stitching: cuttingOrders,
//       ready: readyOrders,
//       delivered: deliveredOrders,
//       cancelled: cancelledOrders,
//       draft: draftOrders,
//       confirmed: pendingOrders,
//       'in-progress': cuttingOrders,
//       'ready-to-delivery': readyOrders
//     };

//     console.log('📊 FINAL STATS SENDING TO FRONTEND:', stats);
//     console.log('🔴🔴🔴 ===== END ORDER STATS ===== 🔴🔴🔴\n');

//     res.status(200).json({
//       success: true,
//       data: stats
//     });

//   } catch (error) {
//     console.error('❌ ERROR in getOrderStatsForDashboard:', error);
//     res.status(500).json({ 
//       success: false, 
//       message: error.message 
//     });
//   }
// };

// // ============================================
// // ✅ 15. GET RECENT ORDERS (WITH DATE FILTERS)
// // ============================================
// export const getRecentOrders = async (req, res) => {
//   try {
//     const { limit = 10, startDate, endDate, period } = req.query;
    
//     console.log('📋 Getting recent orders with filter:', { startDate, endDate, period, limit });

//     let dateFilter = { isActive: true };
    
//     if (startDate && endDate) {
//       dateFilter.orderDate = {
//         $gte: new Date(startDate),
//         $lte: new Date(endDate + 'T23:59:59.999Z')
//       };
//     } else {
//       const thirtyDaysAgo = new Date();
//       thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
//       dateFilter.orderDate = { $gte: thirtyDaysAgo };
//     }

//     const orders = await Order.find(dateFilter)
//       .populate('customer', 'name phone')
//       .populate('garments', 'name type quantity')
//       .sort({ orderDate: -1 })
//       .limit(parseInt(limit));

//     const formattedOrders = orders.map(order => ({
//       _id: order._id,
//       orderId: order.orderId,
//       orderDate: order.orderDate,
//       customer: order.customer ? {
//         _id: order.customer._id,
//         name: order.customer.name,
//         phone: order.customer.phone
//       } : null,
//       garments: order.garments?.map(g => ({
//         name: g.name,
//         type: g.type,
//         quantity: g.quantity
//       })) || [],
//       deliveryDate: order.deliveryDate,
//       status: order.status,
//       totalAmount: order.priceSummary?.totalMax || 0,
//       paidAmount: order.paymentSummary?.totalPaid || 0,
//       balanceAmount: order.balanceAmount || 0,
//       paymentStatus: order.paymentSummary?.paymentStatus || 'pending'
//     }));

//     console.log(`✅ Found ${formattedOrders.length} recent orders`);

//     res.json({
//       success: true,
//       orders: formattedOrders,
//       count: formattedOrders.length,
//       filter: { startDate, endDate, period }
//     });

//   } catch (error) {
//     console.error("❌ Recent orders error:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // ============================================
// // ✅ 16. GET FILTERED ORDERS
// // ============================================
// export const getFilteredOrders = async (req, res) => {
//   try {
//     const { 
//       startDate, 
//       endDate, 
//       period,
//       status,
//       page = 1,
//       limit = 20
//     } = req.query;

//     console.log('🔍 Getting filtered orders:', { startDate, endDate, period, status });

//     let filter = { isActive: true };
    
//     if (startDate && endDate) {
//       filter.orderDate = {
//         $gte: new Date(startDate),
//         $lte: new Date(endDate + 'T23:59:59.999Z')
//       };
//     }
    
//     if (status && status !== 'all') {
//       filter.status = status;
//     }

//     const skip = (parseInt(page) - 1) * parseInt(limit);
    
//     const orders = await Order.find(filter)
//       .populate('customer', 'name phone')
//       .populate('garments', 'name type quantity price')
//       .sort({ orderDate: -1 })
//       .skip(skip)
//       .limit(parseInt(limit));

//     const totalCount = await Order.countDocuments(filter);

//     const summary = await Order.aggregate([
//       { $match: filter },
//       {
//         $group: {
//           _id: null,
//           totalOrders: { $sum: 1 },
//           totalRevenue: { $sum: '$priceSummary.totalMax' },
//           totalPaid: { $sum: '$paymentSummary.totalPaid' },
//           pendingAmount: { $sum: '$balanceAmount' },
//           avgOrderValue: { $avg: '$priceSummary.totalMax' }
//         }
//       }
//     ]);

//     const formattedOrders = orders.map(order => ({
//       _id: order._id,
//       orderId: order.orderId,
//       orderDate: order.orderDate,
//       customer: order.customer,
//       garments: order.garments,
//       garmentCount: order.garments?.length || 0,
//       deliveryDate: order.deliveryDate,
//       status: order.status,
//       totalAmount: order.priceSummary?.totalMax || 0,
//       paidAmount: order.paymentSummary?.totalPaid || 0,
//       balanceAmount: order.balanceAmount || 0,
//       paymentStatus: order.paymentSummary?.paymentStatus || 'pending'
//     }));

//     res.json({
//       success: true,
//       orders: formattedOrders,
//       summary: summary[0] || {
//         totalOrders: 0,
//         totalRevenue: 0,
//         totalPaid: 0,
//         pendingAmount: 0,
//         avgOrderValue: 0
//       },
//       pagination: {
//         currentPage: parseInt(page),
//         totalPages: Math.ceil(totalCount / parseInt(limit)),
//         totalCount,
//         limit: parseInt(limit)
//       },
//       filter: { startDate, endDate, period, status }
//     });

//   } catch (error) {
//     console.error("❌ Filtered orders error:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // ============================================
// // ✅ SIMPLE: Get dates that have orders (just for green dots)
// // ============================================
// export const getOrderDates = async (req, res) => {
//   console.log("\n🟢 ===== GET ORDER DATES =====");
  
//   try {
//     const { month, year } = req.query;
    
//     if (!month || !year) {
//       return res.status(400).json({ 
//         success: false, 
//         message: "Month and year are required" 
//       });
//     }

//     const monthNum = parseInt(month);
//     const yearNum = parseInt(year);

//     // Calculate date range
//     const startDate = new Date(yearNum, monthNum, 1);
//     const endDate = new Date(yearNum, monthNum + 1, 0, 23, 59, 59);

//     // Just get unique dates that have orders
//     const orderDates = await Order.aggregate([
//       {
//         $match: {
//           deliveryDate: { 
//             $gte: startDate, 
//             $lte: endDate 
//           },
//           status: { $ne: 'cancelled' },
//           isActive: true
//         }
//       },
//       {
//         $group: {
//           _id: {
//             $dateToString: { format: "%Y-%m-%d", date: "$deliveryDate" }
//           }
//         }
//       },
//       {
//         $project: {
//           _id: 0,
//           date: "$_id"
//         }
//       },
//       { $sort: { date: 1 } }
//     ]);

//     // Return just array of dates
//     const dates = orderDates.map(item => item.date);

//     console.log(`✅ Found ${dates.length} dates with orders`);
    
//     res.json({
//       success: true,
//       dates: dates,
//       month: monthNum,
//       year: yearNum
//     });

//   } catch (error) {
//     console.error("❌ Error in getOrderDates:", error);
//     res.status(500).json({ 
//       success: false, 
//       message: error.message 
//     });
//   }
// };




































































































































// controllers/order.controller.js
import Order from "../models/Order.js";
import Garment from "../models/Garment.js";
import Work from "../models/Work.js";
import Customer from "../models/Customer.js";
import Payment from "../models/Payment.js";
import Transaction from "../models/Transaction.js";
import CuttingMaster from "../models/CuttingMaster.js";
import Tailor from "../models/Tailor.js";
import StoreKeeper from "../models/StoreKeeper.js";
import { createNotification } from "./notification.controller.js";
import crypto from "crypto";

// ============================================
// ✅ HELPER: CREATE INCOME FROM PAYMENT
// ============================================
const createIncomeFromPayment = async (payment, order, creatorId) => {
  try {
    console.log(`💰 Creating income from payment: ₹${payment.amount}`);
    
    const accountType = payment.method === 'cash' ? 'hand-cash' : 'bank';
    
    let category = 'customer-advance';
    if (payment.type === 'full') {
      category = 'full-payment';
    } else if (payment.type === 'advance' && order.paymentSummary?.paymentStatus === 'paid') {
      category = 'full-payment';
    } else if (payment.type === 'extra') {
      category = 'fabric-sale';
    }
    
    const customer = await Customer.findById(order.customer);
    
    const incomeTransaction = await Transaction.create({
      type: 'income',
      category: category,
      amount: payment.amount,
      paymentMethod: payment.method,
      accountType: accountType,
      customer: order.customer,
      customerDetails: customer ? {
        name: customer.name || `${customer.firstName || ''} ${customer.lastName || ''}`.trim(),
        phone: customer.phone,
        id: customer.customerId || customer._id
      } : null,
      order: order._id,
      description: `Payment for Order #${order.orderId} - ${payment.notes || payment.type || 'advance'}`,
      transactionDate: payment.paymentDate || new Date(),
      referenceNumber: payment.referenceNumber || '',
      createdBy: creatorId,
      status: 'completed'
    });
    
    console.log(`✅ Income created: ₹${payment.amount} (${category}) - ${accountType}`);
    return incomeTransaction;
  } catch (error) {
    console.error("❌ Error creating income:", error);
    return null;
  }
};

// ============================================
// ✅ HELPER: UPDATE ORDER PAYMENT SUMMARY
// ============================================
const updateOrderPaymentSummary = async (orderId) => {
  console.log(`\n💰 Updating payment summary for order: ${orderId}`);
  
  try {
    const order = await Order.findById(orderId);
    if (!order) return;

    const payments = await Payment.find({ 
      order: orderId, 
      isDeleted: false,
      type: { $in: ['advance', 'full', 'partial', 'extra'] }
    });

    const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
    const lastPayment = payments.sort((a, b) => 
      new Date(b.paymentDate) - new Date(a.paymentDate)
    )[0];

    let paymentStatus = 'pending';
    const totalAmount = order.priceSummary?.totalMax || 0;
    
    if (totalPaid >= totalAmount) {
      paymentStatus = totalPaid > totalAmount ? 'overpaid' : 'paid';
    } else if (totalPaid > 0) {
      paymentStatus = 'partial';
    }

    order.paymentSummary = {
      totalPaid,
      lastPaymentDate: lastPayment?.paymentDate,
      lastPaymentAmount: lastPayment?.amount,
      paymentCount: payments.length,
      paymentStatus
    };
    
    order.balanceAmount = totalAmount - totalPaid;
    
    await order.save();
    console.log(`✅ Payment summary updated: Paid: ₹${totalPaid}, Status: ${paymentStatus}`);
    
    return { success: true, totalPaid, paymentStatus };
  } catch (error) {
    console.error("❌ Error updating payment summary:", error);
    return { success: false, error: error.message };
  }
};

// ============================================
// ✅ HELPER: CREATE WORKS FROM EXISTING GARMENTS (SEQUENTIAL)
// ============================================
const createWorksFromGarments = async (orderId, garmentIds, creatorId) => {
  console.log(`\n🚀 Creating works for ${garmentIds?.length || 0} garments...`);
  
  try {
    if (!garmentIds || garmentIds.length === 0) return { success: true, works: [] };
    
    // Check if works already exist for these garments
    const existingWorks = await Work.find({ 
      garment: { $in: garmentIds },
      isActive: true 
    });
    
    if (existingWorks.length > 0) {
      console.log(`⚠️ Works already exist for ${existingWorks.length} garments, skipping creation`);
      return { success: true, works: existingWorks };
    }
    
    // Get the garment documents to access their data
    const garmentDocs = await Garment.find({ _id: { $in: garmentIds } }).lean();
    console.log(`📦 Found ${garmentDocs.length} garments in database`);
    
    const cuttingMasters = await CuttingMaster.find({ isActive: true }).lean();
    const createdWorks = [];

    // 🔥 FIX: Sequential work creation to prevent duplicates
    for (const garment of garmentDocs) {
      const workId = `WRK-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      
      // Add small delay to ensure unique timestamps
      await new Promise(resolve => setTimeout(resolve, 10));
      
      const work = await Work.create({
        workId,
        order: orderId,
        garment: garment._id,
        createdBy: creatorId,
        status: "pending",
        cuttingMaster: null,
        estimatedDelivery: garment.estimatedDelivery || new Date(Date.now() + 7*24*60*60*1000)
      });
      
      createdWorks.push(work);
      
      // Update garment with work ID
      await Garment.findByIdAndUpdate(garment._id, { workId: work._id });
    }
    
    console.log(`✅ Created ${createdWorks.length} works sequentially`);
    
    // Send notifications to cutting masters
    if (createdWorks.length > 0 && cuttingMasters.length > 0) {
      cuttingMasters.forEach(master => {
        createNotification({
          type: 'work-available',
          recipient: master._id,
          title: '🔔 New Work Available',
          message: `${createdWorks.length} new work(s) are waiting for acceptance`,
          reference: {
            orderId: orderId,
            workCount: createdWorks.length,
            workIds: createdWorks.map(w => w._id)
          },
          priority: 'high'
        }).catch(() => {});
      });
    }
    
    return { success: true, works: createdWorks };
  } catch (error) {
    console.error("\n❌ ERROR CREATING WORKS:", error);
    return { success: false, error: error.message };
  }
};

// ============================================
// ✅ 1. GET ORDER STATS (ORIGINAL)
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
// ✅ 2. CREATE ORDER (WITH PAYMENTS & AUTO-INCOME) - SEQUENTIAL PROCESSING FIX
// ============================================
export const createOrder = async (req, res) => {
  console.log("\n🆕 ===== CREATE ORDER =====");
  
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
      payments = [],
      requestId
    } = req.body;

    const creatorId = req.user?._id || req.user?.id;
    if (!creatorId) {
      return res.status(401).json({ success: false, message: "Authentication failed" });
    }

    if (!customer || !deliveryDate) {
      return res.status(400).json({ success: false, message: "Customer and Delivery Date are required" });
    }

    // Check for duplicate request
    if (requestId) {
      const existingOrder = await Order.findOne({ 'metadata.requestId': requestId });
      if (existingOrder) {
        console.log(`⚠️ Duplicate request detected: ${requestId}`);
        return res.status(409).json({ 
          success: false, 
          message: "This order has already been created",
          orderId: existingOrder._id
        });
      }
    }

    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const orderId = `${day}${month}${year}-${Date.now().toString().slice(-4)}`;

    // Calculate totals from the garment objects directly
    let totalMin = priceSummary?.totalMin || 0;
    let totalMax = priceSummary?.totalMax || 0;
    
    if (garments && garments.length > 0) {
      console.log(`📦 Received ${garments.length} garments with full data`);
      
      garments.forEach(g => {
        if (g.priceRange) {
          totalMin += g.priceRange.min || 0;
          totalMax += g.priceRange.max || 0;
        }
      });
      
      console.log(`💰 Calculated totals - Min: ${totalMin}, Max: ${totalMax}`);
    }

    let allPayments = [...payments];
    if (advancePayment?.amount > 0 && !allPayments.some(p => p.type === 'advance')) {
      allPayments.push({
        amount: advancePayment.amount,
        type: 'advance',
        method: advancePayment.method || 'cash',
        paymentDate: advancePayment.date || new Date(),
        notes: 'Initial advance payment'
      });
    }

    const totalInitialPaid = allPayments.reduce((sum, p) => sum + (p.amount || 0), 0);

    // Create order with empty garments array initially
    const order = await Order.create({
      orderId,
      customer,
      deliveryDate,
      garments: [],
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
      metadata: {
        requestId: requestId || null,
        createdAt: new Date()
      }
    });

    console.log(`✅ Order created with ID: ${order._id}`);

    // 🔥 FIX 1: Create payments SEQUENTIALLY
    const createdPayments = [];
    if (allPayments.length > 0) {
      console.log(`💰 Creating ${allPayments.length} payments sequentially...`);
      
      // Check if payments already exist for this order
      const existingPayments = await Payment.find({ order: order._id });
      
      if (existingPayments.length === 0) {
        for (const paymentData of allPayments) {
          // Format time as HH:MM:SS
          const now = new Date();
          const hours = String(now.getHours()).padStart(2, '0');
          const minutes = String(now.getMinutes()).padStart(2, '0');
          const seconds = String(now.getSeconds()).padStart(2, '0');
          const paymentTime = `${hours}:${minutes}:${seconds}`;
          
          // Add small delay to ensure unique timestamps
          await new Promise(resolve => setTimeout(resolve, 10));
          
          const payment = await Payment.create({
            order: order._id,
            customer: order.customer,
            amount: paymentData.amount,
            type: paymentData.type || 'advance',
            method: paymentData.method || 'cash',
            referenceNumber: paymentData.referenceNumber || '',
            paymentDate: paymentData.paymentDate || new Date(),
            paymentTime: paymentTime,
            notes: paymentData.notes || '',
            receivedBy: creatorId,
            metadata: {
              requestId: requestId
            }
          });
          
          await createIncomeFromPayment(payment, order, creatorId);
          createdPayments.push(payment);
          console.log(`✅ Payment ${createdPayments.length} created: ₹${payment.amount}`);
        }
      } else {
        console.log(`⚠️ Payments already exist for order ${order._id}, skipping creation`);
      }
    }

    // 🔥 FIX 2: Create garments SEQUENTIALLY
    const createdGarmentIds = [];
    if (garments && garments.length > 0) {
      console.log(`👕 Creating ${garments.length} garments sequentially...`);
      
      // Check if garments already exist for this order
      const existingGarments = await Garment.find({ order: order._id });
      
      if (existingGarments.length === 0) {
        for (let i = 0; i < garments.length; i++) {
          const g = garments[i];
          
          // Add small delay between each garment creation
          if (i > 0) {
            await new Promise(resolve => setTimeout(resolve, 50));
          }
          
          // Prepare garment data with proper handling of fields
          const garmentData = {
            name: g.name,
            garmentType: g.garmentType || g.item || g.itemName || g.name,
            category: g.category,
            item: g.item,
            categoryName: g.categoryName,
            itemName: g.itemName,
            measurements: g.measurements || [],
            measurementTemplate: g.measurementTemplate && g.measurementTemplate !== '' 
              ? g.measurementTemplate 
              : null,
            measurementSource: g.measurementSource || 'customer',
            additionalInfo: g.additionalInfo || '',
            estimatedDelivery: g.estimatedDelivery || deliveryDate,
            priority: g.priority || 'normal',
            priceRange: {
              min: Number(g.priceRange?.min) || 0,
              max: Number(g.priceRange?.max) || 0
            },
            fabricSource: g.fabricSource || 'customer',
            fabricPrice: g.fabricPrice || '0',
            order: order._id,
            createdBy: creatorId,
            status: 'pending',
            metadata: {
              requestId: requestId,
              sequence: i + 1
            }
          };

          // Remove undefined fields
          Object.keys(garmentData).forEach(key => 
            garmentData[key] === undefined && delete garmentData[key]
          );

          console.log(`📝 Creating garment ${i + 1}/${garments.length}...`);
          
          const garment = await Garment.create(garmentData);
          
          console.log(`✅ Created garment ${i + 1}/${garments.length}: ${garment._id} (${garment.garmentId})`);
          createdGarmentIds.push(garment._id);
        }
        
        // Update the order with the actual garment IDs
        order.garments = createdGarmentIds;
        order.status = "confirmed";
        await order.save();
        console.log(`✅ Order updated with ${createdGarmentIds.length} garment IDs`);
        
        // 🔥 FIX 3: Create works SEQUENTIALLY
        if (createdGarmentIds.length > 0) {
          await createWorksFromGarments(order._id, createdGarmentIds, creatorId);
        }
      } else {
        console.log(`⚠️ Garments already exist for order ${order._id}, skipping creation`);
      }
    }

    await order.populate('customer', 'name phone customerId');

    res.status(201).json({ 
      success: true, 
      message: "Order created successfully",
      order 
    });
  } catch (error) {
    console.error("\n❌ CREATE ORDER ERROR:", error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ success: false, message: "Validation failed", errors });
    }
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      const value = error.keyValue[field];
      return res.status(400).json({ 
        success: false, 
        message: `Duplicate ${field}: ${value}. Please try again.` 
      });
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

    if (status && status !== "all") {
      query.status = status;
    }

    if (paymentStatus && paymentStatus !== "all") {
      query['paymentSummary.paymentStatus'] = paymentStatus;
    }

    const now = new Date();
    if (timeFilter !== "all") {
      let filterDate = new Date();
      if (timeFilter === "week") filterDate.setDate(now.getDate() - 7);
      else if (timeFilter === "month") filterDate.setMonth(now.getMonth() - 1);
      else if (timeFilter === "3m") filterDate.setMonth(now.getMonth() - 3);
      
      query.createdAt = { $gte: filterDate };
    }

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

    const payments = await Payment.find({ 
      order: order._id,
      isDeleted: false 
    })
    .populate('receivedBy', 'name')
    .sort('-paymentDate -paymentTime');

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

    if (newGarments && newGarments.length > 0) {
      order.garments = [...order.garments, ...newGarments];
      
      const creatorId = req.user?._id || req.user?.id;
      await createWorksFromGarments(order._id, newGarments, creatorId);
    }

    await order.save();
    
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
    const { id } = req.params;
    const userId = req.user?._id || req.user?.id;
    
    const validStatuses = ["draft", "confirmed", "in-progress", "ready-to-delivery", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` 
      });
    }
    
    const order = await Order.findById(id)
      .populate('customer', 'name phone')
      .populate('garments');
      
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    
    const validTransitions = {
      'draft': ['confirmed', 'cancelled'],
      'confirmed': ['in-progress', 'cancelled'],
      'in-progress': ['ready-to-delivery', 'cancelled'],
      'ready-to-delivery': ['delivered', 'cancelled'],
      'delivered': [],
      'cancelled': []
    };
    
    if (!validTransitions[order.status]?.includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: `Cannot transition from ${order.status} to ${status}` 
      });
    }
    
    const oldStatus = order.status;
    order.status = status;
    await order.save();
    
    console.log(`✅ Status updated: ${oldStatus} → ${status}`);

    // Notifications based on status
    if (status === 'ready-to-delivery') {
      const storeKeepers = await StoreKeeper.find({ isActive: true }).lean();
      storeKeepers.forEach(keeper => {
        createNotification({
          type: 'delivery-ready',
          recipient: keeper._id,
          title: '📦 Order Ready for Delivery',
          message: `Order #${order.orderId} for ${order.customer?.name || 'Customer'} is ready for delivery`,
          reference: { orderId: order._id, orderNumber: order.orderId },
          priority: 'high'
        }).catch(() => {});
      });
    }
    else if (status === 'delivered') {
      await updateOrderPaymentSummary(order._id);
      
      const storeKeepers = await StoreKeeper.find({ isActive: true }).lean();
      storeKeepers.forEach(keeper => {
        createNotification({
          type: 'order-delivered',
          recipient: keeper._id,
          title: '✅ Order Delivered',
          message: `Order #${order.orderId} has been delivered`,
          reference: { orderId: order._id },
          priority: 'medium'
        }).catch(() => {});
      });
    }
    else if (status === 'cancelled') {
      await Work.updateMany(
        { order: order._id, status: { $ne: 'completed' } },
        { status: 'cancelled', isActive: false }
      );
    }

    // Update related works
    try {
      if (status === 'in-progress') {
        await Work.updateMany(
          { order: order._id, status: 'pending' },
          { status: 'in-progress' }
        );
      }
      else if (status === 'delivered') {
        await Work.updateMany(
          { order: order._id, status: { $ne: 'completed' } },
          { status: 'completed' }
        );
      }
    } catch (workErr) {
      console.log("Work update error:", workErr.message);
    }
    
    const updatedOrder = await Order.findById(id)
      .populate('customer', 'name phone customerId')
      .populate('garments');
    
    res.json({ 
      success: true, 
      message: `Order status updated from ${oldStatus} to ${status}`,
      order: updatedOrder 
    });
    
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

    await Garment.updateMany({ _id: { $in: order.garments } }, { isActive: false });
    await Work.updateMany({ order: order._id }, { isActive: false });
    await Payment.updateMany({ order: order._id }, { isDeleted: true });
    await Transaction.updateMany({ order: order._id }, { status: 'cancelled' });

    order.isActive = false;
    await order.save();

    res.json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    console.error("❌ Delete error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================
// ✅ 8. ADD PAYMENT TO ORDER (WITH AUTO-INCOME)
// ============================================
export const addPaymentToOrder = async (req, res) => {
  console.log(`\n💰 ===== ADD PAYMENT TO ORDER: ${req.params.id} =====`);
  
  try {
    const { id } = req.params;
    const paymentData = req.body;
    
    const order = await Order.findById(id).populate('customer');
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    
    const creatorId = req.user?._id || req.user?.id;
    
    // Format time as HH:MM:SS
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const paymentTime = `${hours}:${minutes}:${seconds}`;
    
    const payment = await Payment.create({
      order: order._id,
      customer: order.customer,
      amount: paymentData.amount,
      type: paymentData.type || 'advance',
      method: paymentData.method || 'cash',
      referenceNumber: paymentData.referenceNumber || '',
      paymentDate: paymentData.paymentDate || new Date(),
      paymentTime: paymentTime,
      notes: paymentData.notes || '',
      receivedBy: creatorId
    });
    
    await createIncomeFromPayment(payment, order, creatorId);
    await updateOrderPaymentSummary(order._id);
    
    res.status(201).json({ success: true, message: "Payment added and income created", payment });
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

    const todayOrders = await Order.find({
      createdAt: { $gte: today },
      isActive: true
    }).populate('customer', 'name');

    const pendingDeliveries = await Order.find({
      deliveryDate: { $lt: new Date() },
      status: { $nin: ['delivered', 'cancelled'] },
      isActive: true
    }).populate('customer', 'name phone');

    const readyForDelivery = await Order.find({
      status: 'ready-to-delivery',
      isActive: true
    }).populate('customer', 'name phone');

    const recentOrders = await Order.find({ isActive: true })
      .populate('customer', 'name')
      .sort({ createdAt: -1 })
      .limit(10);

    const todayPayments = await Payment.find({
      paymentDate: { $gte: today },
      isDeleted: false
    });

    const todayCollection = todayPayments.reduce((sum, p) => sum + p.amount, 0);

    const todayIncome = await Transaction.find({
      transactionDate: { $gte: today },
      type: 'income',
      status: 'completed'
    });

    const totalIncomeToday = todayIncome.reduce((sum, t) => sum + t.amount, 0);

    res.json({
      success: true,
      dashboard: {
        todayOrders: { count: todayOrders.length, orders: todayOrders },
        pendingDeliveries: { count: pendingDeliveries.length, orders: pendingDeliveries },
        readyForDelivery: { count: readyForDelivery.length, orders: readyForDelivery },
        recentOrders,
        todayCollection,
        totalIncomeToday,
        incomeBreakdown: {
          handCash: todayIncome.filter(t => t.accountType === 'hand-cash').reduce((sum, t) => sum + t.amount, 0),
          bank: todayIncome.filter(t => t.accountType === 'bank').reduce((sum, t) => sum + t.amount, 0)
        }
      }
    });
  } catch (error) {
    console.error("❌ Dashboard error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================
// ✅ 11. GET ORDERS BY CUSTOMER
// ============================================
export const getOrdersByCustomer = async (req, res) => {
  try {
    const { customerId } = req.params;
    
    console.log(`🔍 Fetching orders for customer: ${customerId}`);
    
    const orders = await Order.find({ 
      customer: customerId,
      isActive: true 
    })
    .populate('customer', 'name phone email customerId')
    .populate('garments')
    .sort('-createdAt');
    
    console.log(`✅ Found ${orders.length} orders for customer ${customerId}`);
    
    res.status(200).json({
      success: true,
      count: orders.length,
      orders: orders
    });
    
  } catch (error) {
    console.error(`❌ Error fetching orders for customer ${req.params.customerId}:`, error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ============================================
// ✅ 12. GET READY TO DELIVERY ORDERS
// ============================================
export const getReadyToDeliveryOrders = async (req, res) => {
  console.log("\n📦 ===== GET READY TO DELIVERY ORDERS =====");
  
  try {
    const orders = await Order.find({ 
      status: 'ready-to-delivery',
      isActive: true 
    })
    .populate('customer', 'name phone')
    .populate('garments')
    .sort({ updatedAt: -1 });
    
    res.json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    console.error("❌ Get ready to delivery error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================
// ✅ 13. GET INCOME BY ORDER ID
// ============================================
export const getIncomeByOrder = async (req, res) => {
  console.log(`\n💰 ===== GET INCOME FOR ORDER: ${req.params.id} =====`);
  
  try {
    const incomes = await Transaction.find({
      order: req.params.id,
      type: 'income',
      status: 'completed'
    })
    .populate('customer', 'name phone')
    .sort('-transactionDate');
    
    const totalIncome = incomes.reduce((sum, t) => sum + t.amount, 0);
    
    res.json({
      success: true,
      count: incomes.length,
      totalIncome,
      incomes
    });
  } catch (error) {
    console.error("❌ Get income error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================
// ✅ 14. GET ORDER STATS FOR DASHBOARD - WITH DEBUG
// ============================================
export const getOrderStatsForDashboard = async (req, res) => {
  try {
    const { startDate, endDate, period } = req.query;
    
    console.log('\n🔴🔴🔴 ===== GET ORDER STATS FOR DASHBOARD ===== 🔴🔴🔴');
    console.log('📥 Received query params:', { startDate, endDate, period });
    console.log('👤 User making request:', req.user?._id, req.user?.role);
    
    // Build date filter
    let dateFilter = { isActive: true };
    
    if (period === 'today') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      dateFilter.orderDate = {
        $gte: today,
        $lt: tomorrow
      };
      console.log('📅 Date filter (today):', { 
        from: today.toISOString(), 
        to: tomorrow.toISOString() 
      });
    } 
    else if (period === 'week') {
      const today = new Date();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      startOfWeek.setHours(0, 0, 0, 0);
      
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 7);
      
      dateFilter.orderDate = {
        $gte: startOfWeek,
        $lt: endOfWeek
      };
      console.log('📅 Date filter (week):', { 
        from: startOfWeek.toISOString(), 
        to: endOfWeek.toISOString() 
      });
    }
    else if (period === 'month') {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      endOfMonth.setHours(23, 59, 59, 999);
      
      dateFilter.orderDate = {
        $gte: startOfMonth,
        $lte: endOfMonth
      };
      console.log('📅 Date filter (month):', { 
        from: startOfMonth.toISOString(), 
        to: endOfMonth.toISOString() 
      });
    }
    else if (startDate && endDate) {
      dateFilter.orderDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate + 'T23:59:59.999Z')
      };
      console.log('📅 Date filter (custom):', { 
        from: startDate, 
        to: endDate 
      });
    }

    console.log('🔍 Final MongoDB filter:', JSON.stringify(dateFilter, null, 2));

    // Check total orders in this date range
    const totalOrdersInRange = await Order.countDocuments(dateFilter);
    console.log(`📊 Total orders in date range: ${totalOrdersInRange}`);

    // Get ALL orders to debug
    const ordersInRange = await Order.find(dateFilter).select('orderId status orderDate');
    console.log('📋 Orders in range:', ordersInRange.map(o => ({
      orderId: o.orderId,
      status: o.status,
      date: o.orderDate
    })));

    // Get counts by status
    const pendingOrders = await Order.countDocuments({ 
      ...dateFilter,
      status: 'confirmed'
    });
    console.log('✅ confirmed orders:', pendingOrders);
    
    const cuttingOrders = await Order.countDocuments({ 
      ...dateFilter,
      status: 'in-progress'
    });
    console.log('✅ in-progress orders:', cuttingOrders);
    
    const readyOrders = await Order.countDocuments({ 
      ...dateFilter,
      status: 'ready-to-delivery'
    });
    console.log('✅ ready-to-delivery orders:', readyOrders);
    
    const deliveredOrders = await Order.countDocuments({ 
      ...dateFilter,
      status: 'delivered'
    });
    console.log('✅ delivered orders:', deliveredOrders);

    const cancelledOrders = await Order.countDocuments({ 
      ...dateFilter,
      status: 'cancelled'
    });
    console.log('✅ cancelled orders:', cancelledOrders);

    const draftOrders = await Order.countDocuments({ 
      ...dateFilter,
      status: 'draft'
    });
    console.log('✅ draft orders:', draftOrders);

    // Prepare stats object matching your frontend
    const stats = {
      total: totalOrdersInRange,
      pending: pendingOrders,
      cutting: cuttingOrders,
      stitching: cuttingOrders,
      ready: readyOrders,
      delivered: deliveredOrders,
      cancelled: cancelledOrders,
      draft: draftOrders,
      confirmed: pendingOrders,
      'in-progress': cuttingOrders,
      'ready-to-delivery': readyOrders
    };

    console.log('📊 FINAL STATS SENDING TO FRONTEND:', stats);
    console.log('🔴🔴🔴 ===== END ORDER STATS ===== 🔴🔴🔴\n');

    res.status(200).json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('❌ ERROR in getOrderStatsForDashboard:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// ============================================
// ✅ 15. GET RECENT ORDERS (WITH DATE FILTERS)
// ============================================
export const getRecentOrders = async (req, res) => {
  try {
    const { limit = 10, startDate, endDate, period } = req.query;
    
    console.log('📋 Getting recent orders with filter:', { startDate, endDate, period, limit });

    let dateFilter = { isActive: true };
    
    if (startDate && endDate) {
      dateFilter.orderDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate + 'T23:59:59.999Z')
      };
    } else {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      dateFilter.orderDate = { $gte: thirtyDaysAgo };
    }

    const orders = await Order.find(dateFilter)
      .populate('customer', 'name phone')
      .populate('garments', 'name type quantity')
      .sort({ orderDate: -1 })
      .limit(parseInt(limit));

    const formattedOrders = orders.map(order => ({
      _id: order._id,
      orderId: order.orderId,
      orderDate: order.orderDate,
      customer: order.customer ? {
        _id: order.customer._id,
        name: order.customer.name,
        phone: order.customer.phone
      } : null,
      garments: order.garments?.map(g => ({
        name: g.name,
        type: g.type,
        quantity: g.quantity
      })) || [],
      deliveryDate: order.deliveryDate,
      status: order.status,
      totalAmount: order.priceSummary?.totalMax || 0,
      paidAmount: order.paymentSummary?.totalPaid || 0,
      balanceAmount: order.balanceAmount || 0,
      paymentStatus: order.paymentSummary?.paymentStatus || 'pending'
    }));

    console.log(`✅ Found ${formattedOrders.length} recent orders`);

    res.json({
      success: true,
      orders: formattedOrders,
      count: formattedOrders.length,
      filter: { startDate, endDate, period }
    });

  } catch (error) {
    console.error("❌ Recent orders error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================
// ✅ 16. GET FILTERED ORDERS
// ============================================
export const getFilteredOrders = async (req, res) => {
  try {
    const { 
      startDate, 
      endDate, 
      period,
      status,
      page = 1,
      limit = 20
    } = req.query;

    console.log('🔍 Getting filtered orders:', { startDate, endDate, period, status });

    let filter = { isActive: true };
    
    if (startDate && endDate) {
      filter.orderDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate + 'T23:59:59.999Z')
      };
    }
    
    if (status && status !== 'all') {
      filter.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const orders = await Order.find(filter)
      .populate('customer', 'name phone')
      .populate('garments', 'name type quantity price')
      .sort({ orderDate: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalCount = await Order.countDocuments(filter);

    const summary = await Order.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: '$priceSummary.totalMax' },
          totalPaid: { $sum: '$paymentSummary.totalPaid' },
          pendingAmount: { $sum: '$balanceAmount' },
          avgOrderValue: { $avg: '$priceSummary.totalMax' }
        }
      }
    ]);

    const formattedOrders = orders.map(order => ({
      _id: order._id,
      orderId: order.orderId,
      orderDate: order.orderDate,
      customer: order.customer,
      garments: order.garments,
      garmentCount: order.garments?.length || 0,
      deliveryDate: order.deliveryDate,
      status: order.status,
      totalAmount: order.priceSummary?.totalMax || 0,
      paidAmount: order.paymentSummary?.totalPaid || 0,
      balanceAmount: order.balanceAmount || 0,
      paymentStatus: order.paymentSummary?.paymentStatus || 'pending'
    }));

    res.json({
      success: true,
      orders: formattedOrders,
      summary: summary[0] || {
        totalOrders: 0,
        totalRevenue: 0,
        totalPaid: 0,
        pendingAmount: 0,
        avgOrderValue: 0
      },
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / parseInt(limit)),
        totalCount,
        limit: parseInt(limit)
      },
      filter: { startDate, endDate, period, status }
    });

  } catch (error) {
    console.error("❌ Filtered orders error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================
// ✅ SIMPLE: Get dates that have orders (just for green dots)
// ============================================
export const getOrderDates = async (req, res) => {
  console.log("\n🟢 ===== GET ORDER DATES =====");
  
  try {
    const { month, year } = req.query;
    
    if (!month || !year) {
      return res.status(400).json({ 
        success: false, 
        message: "Month and year are required" 
      });
    }

    const monthNum = parseInt(month);
    const yearNum = parseInt(year);

    // Calculate date range
    const startDate = new Date(yearNum, monthNum, 1);
    const endDate = new Date(yearNum, monthNum + 1, 0, 23, 59, 59);

    // Just get unique dates that have orders
    const orderDates = await Order.aggregate([
      {
        $match: {
          deliveryDate: { 
            $gte: startDate, 
            $lte: endDate 
          },
          status: { $ne: 'cancelled' },
          isActive: true
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$deliveryDate" }
          }
        }
      },
      {
        $project: {
          _id: 0,
          date: "$_id"
        }
      },
      { $sort: { date: 1 } }
    ]);

    // Return just array of dates
    const dates = orderDates.map(item => item.date);

    console.log(`✅ Found ${dates.length} dates with orders`);
    
    res.json({
      success: true,
      dates: dates,
      month: monthNum,
      year: yearNum
    });

  } catch (error) {
    console.error("❌ Error in getOrderDates:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};