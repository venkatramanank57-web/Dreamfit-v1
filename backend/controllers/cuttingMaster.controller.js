// // backend/controllers/cuttingMaster.controller.js
// import CuttingMaster from "../models/CuttingMaster.js";
// import Work from "../models/Work.js";
// import bcrypt from "bcryptjs";

// // ===== CREATE CUTTING MASTER (Admin only) =====
// export const createCuttingMaster = async (req, res) => {
//   try {
//     console.log("📝 Creating cutting master with data:", req.body);
    
//     const { name, phone, email, password, address, specialization, experience } = req.body;

//     // Validate required fields
//     if (!name) return res.status(400).json({ message: "Name is required" });
//     if (!phone) return res.status(400).json({ message: "Phone number is required" });
//     if (!email) return res.status(400).json({ message: "Email is required" });
//     if (!password) return res.status(400).json({ message: "Password is required" });

//     // Check duplicates
//     const existingPhone = await CuttingMaster.findOne({ phone });
//     if (existingPhone) return res.status(400).json({ message: "Phone number already exists" });

//     const existingEmail = await CuttingMaster.findOne({ email });
//     if (existingEmail) return res.status(400).json({ message: "Email already exists" });

//     // Create cutting master
//     const cuttingMaster = await CuttingMaster.create({
//       name,
//       phone,
//       email,
//       password,
//       address: address || {},
//       specialization: specialization || [],
//       experience: experience || 0,
//       createdBy: req.user?._id,
//       joiningDate: new Date()
//     });

//     console.log("✅ Cutting Master created with ID:", cuttingMaster.cuttingMasterId);

//     // Don't send password back
//     const response = cuttingMaster.toObject();
//     delete response.password;

//     res.status(201).json({
//       message: "Cutting Master created successfully",
//       cuttingMaster: response
//     });
//   } catch (error) {
//     console.error("❌ Create error:", error);
//     handleError(error, res);
//   }
// };

// // ===== GET ALL CUTTING MASTERS (Admin/Store Keeper) =====
// export const getAllCuttingMasters = async (req, res) => {
//   try {
//     const { search, availability } = req.query;
//     let query = { isActive: true };

//     if (search) {
//       query.$or = [
//         { name: { $regex: search, $options: 'i' } },
//         { phone: { $regex: search, $options: 'i' } },
//         { email: { $regex: search, $options: 'i' } },
//         { cuttingMasterId: { $regex: search, $options: 'i' } }
//       ];
//     }

//     if (availability && availability !== 'all') {
//       query.isAvailable = availability === 'available';
//     }

//     const cuttingMasters = await CuttingMaster.find(query)
//       .populate('createdBy', 'name')
//       .select('-password')
//       .sort({ createdAt: -1 });

//     // Get work statistics
//     for (let cm of cuttingMasters) {
//       const workStats = await Work.aggregate([
//         { $match: { assignedTo: cm._id, isActive: true } },
//         { $group: {
//           _id: null,
//           total: { $sum: 1 },
//           completed: { $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] } },
//           pending: { $sum: { $cond: [{ $in: ["$status", ["pending", "accepted"]] }, 1, 0] } },
//           inProgress: { $sum: { $cond: [{ $in: ["$status", ["cutting", "stitching", "iron"]] }, 1, 0] } }
//         }}
//       ]);

//       cm.workStats = workStats[0] || { total: 0, completed: 0, pending: 0, inProgress: 0 };
//     }

//     res.json(cuttingMasters);
//   } catch (error) {
//     console.error("❌ Get all error:", error);
//     res.status(500).json({ message: error.message });
//   }
// };

// // ===== GET CUTTING MASTER BY ID =====
// export const getCuttingMasterById = async (req, res) => {
//   try {
//     const cuttingMaster = await CuttingMaster.findById(req.params.id)
//       .populate('createdBy', 'name')
//       .select('-password');

//     if (!cuttingMaster) {
//       return res.status(404).json({ message: "Cutting Master not found" });
//     }

//     // Get works assigned
//     const works = await Work.find({ 
//       assignedTo: cuttingMaster._id,
//       isActive: true 
//     })
//       .populate('order', 'orderId deliveryDate')
//       .populate('garment', 'name garmentId')
//       .sort({ createdAt: -1 });

//     const workStats = {
//       total: works.length,
//       completed: works.filter(w => w.status === 'completed').length,
//       pending: works.filter(w => ['pending', 'accepted'].includes(w.status)).length,
//       inProgress: works.filter(w => ['cutting', 'stitching', 'iron'].includes(w.status)).length
//     };

//     res.json({
//       cuttingMaster,
//       works,
//       workStats
//     });
//   } catch (error) {
//     console.error("❌ Get by ID error:", error);
//     res.status(500).json({ message: error.message });
//   }
// };

// // ===== UPDATE CUTTING MASTER =====
// export const updateCuttingMaster = async (req, res) => {
//   try {
//     const cuttingMaster = await CuttingMaster.findById(req.params.id);

//     if (!cuttingMaster) {
//       return res.status(404).json({ message: "Cutting Master not found" });
//     }

//     const isAdmin = req.user.role === 'ADMIN';
//     const isStoreKeeper = req.user.role === 'STORE_KEEPER';

//     if (!isAdmin && !isStoreKeeper) {
//       return res.status(403).json({ message: "Not authorized" });
//     }

//     // Fields that can be updated
//     const updatableFields = ['name', 'phone', 'email', 'address', 'specialization', 'experience', 'isActive', 'isAvailable'];

//     updatableFields.forEach(field => {
//       if (req.body[field] !== undefined) {
//         cuttingMaster[field] = req.body[field];
//       }
//     });

//     await cuttingMaster.save();

//     const response = cuttingMaster.toObject();
//     delete response.password;

//     res.json({
//       message: "Cutting Master updated successfully",
//       cuttingMaster: response
//     });
//   } catch (error) {
//     console.error("❌ Update error:", error);
//     res.status(500).json({ message: error.message });
//   }
// };

// // ===== DELETE CUTTING MASTER (soft delete) =====
// export const deleteCuttingMaster = async (req, res) => {
//   try {
//     if (req.user.role !== 'ADMIN') {
//       return res.status(403).json({ message: "Only admin can delete" });
//     }

//     const cuttingMaster = await CuttingMaster.findById(req.params.id);
//     if (!cuttingMaster) {
//       return res.status(404).json({ message: "Cutting Master not found" });
//     }

//     // Check active works
//     const activeWorks = await Work.countDocuments({
//       assignedTo: cuttingMaster._id,
//       status: { $nin: ['completed', 'cancelled'] }
//     });

//     if (activeWorks > 0) {
//       return res.status(400).json({ 
//         message: `Cannot delete with ${activeWorks} active works` 
//       });
//     }

//     cuttingMaster.isActive = false;
//     await cuttingMaster.save();

//     res.json({ message: "Cutting Master deleted successfully" });
//   } catch (error) {
//     console.error("❌ Delete error:", error);
//     res.status(500).json({ message: error.message });
//   }
// };

// // ===== GET CUTTING MASTER STATS =====
// export const getCuttingMasterStats = async (req, res) => {
//   try {
//     const stats = await CuttingMaster.aggregate([
//       { $match: { isActive: true } },
//       { $group: {
//         _id: null,
//         total: { $sum: 1 },
//         available: { $sum: { $cond: [{ $eq: ["$isAvailable", true] }, 1, 0] } }
//       }}
//     ]);

//     res.json({
//       cuttingMasterStats: stats[0] || { total: 0, available: 0 }
//     });
//   } catch (error) {
//     console.error("❌ Stats error:", error);
//     res.status(500).json({ message: error.message });
//   }
// };

// // Helper function
// const handleError = (error, res) => {
//   if (error.code === 11000) {
//     const field = Object.keys(error.keyPattern)[0];
//     return res.status(400).json({ message: `${field} already exists` });
//   }
//   if (error.name === "ValidationError") {
//     const errors = Object.values(error.errors).map(e => e.message);
//     return res.status(400).json({ message: "Validation failed", errors });
//   }
//   res.status(500).json({ message: error.message });
// };









// // backend/controllers/cuttingMaster.controller.js

// import CuttingMaster from "../models/CuttingMaster.js";
// import Work from "../models/Work.js";
// import Order from "../models/Order.js";      // Add this import
// import Tailor from "../models/Tailor.js";    // Add this import
// import bcrypt from "bcryptjs";

// // ===== CREATE CUTTING MASTER (Admin only) =====
// export const createCuttingMaster = async (req, res) => {
//   try {
//     console.log("📝 Creating cutting master with data:", req.body);
    
//     const { name, phone, email, password, address, specialization, experience } = req.body;

//     // Validate required fields
//     if (!name) return res.status(400).json({ message: "Name is required" });
//     if (!phone) return res.status(400).json({ message: "Phone number is required" });
//     if (!email) return res.status(400).json({ message: "Email is required" });
//     if (!password) return res.status(400).json({ message: "Password is required" });

//     // Check duplicates
//     const existingPhone = await CuttingMaster.findOne({ phone });
//     if (existingPhone) return res.status(400).json({ message: "Phone number already exists" });

//     const existingEmail = await CuttingMaster.findOne({ email });
//     if (existingEmail) return res.status(400).json({ message: "Email already exists" });

//     // Create cutting master
//     const cuttingMaster = await CuttingMaster.create({
//       name,
//       phone,
//       email,
//       password,
//       address: address || {},
//       specialization: specialization || [],
//       experience: experience || 0,
//       createdBy: req.user?._id,
//       joiningDate: new Date()
//     });

//     console.log("✅ Cutting Master created with ID:", cuttingMaster.cuttingMasterId);

//     // Don't send password back
//     const response = cuttingMaster.toObject();
//     delete response.password;

//     res.status(201).json({
//       message: "Cutting Master created successfully",
//       cuttingMaster: response
//     });
//   } catch (error) {
//     console.error("❌ Create error:", error);
//     handleError(error, res);
//   }
// };

// // ===== GET ALL CUTTING MASTERS (Admin/Store Keeper) =====
// export const getAllCuttingMasters = async (req, res) => {
//   try {
//     const { search, availability } = req.query;
//     let query = { isActive: true };

//     if (search) {
//       query.$or = [
//         { name: { $regex: search, $options: 'i' } },
//         { phone: { $regex: search, $options: 'i' } },
//         { email: { $regex: search, $options: 'i' } },
//         { cuttingMasterId: { $regex: search, $options: 'i' } }
//       ];
//     }

//     if (availability && availability !== 'all') {
//       query.isAvailable = availability === 'available';
//     }

//     const cuttingMasters = await CuttingMaster.find(query)
//       .populate('createdBy', 'name')
//       .select('-password')
//       .sort({ createdAt: -1 });

//     // Get work statistics
//     for (let cm of cuttingMasters) {
//       const workStats = await Work.aggregate([
//         { $match: { assignedTo: cm._id, isActive: true } },
//         { $group: {
//           _id: null,
//           total: { $sum: 1 },
//           completed: { $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] } },
//           pending: { $sum: { $cond: [{ $in: ["$status", ["pending", "accepted"]] }, 1, 0] } },
//           inProgress: { $sum: { $cond: [{ $in: ["$status", ["cutting", "stitching", "iron"]] }, 1, 0] } }
//         }}
//       ]);

//       cm.workStats = workStats[0] || { total: 0, completed: 0, pending: 0, inProgress: 0 };
//     }

//     res.json(cuttingMasters);
//   } catch (error) {
//     console.error("❌ Get all error:", error);
//     res.status(500).json({ message: error.message });
//   }
// };

// // ===== GET CUTTING MASTER BY ID =====
// export const getCuttingMasterById = async (req, res) => {
//   try {
//     const cuttingMaster = await CuttingMaster.findById(req.params.id)
//       .populate('createdBy', 'name')
//       .select('-password');

//     if (!cuttingMaster) {
//       return res.status(404).json({ message: "Cutting Master not found" });
//     }

//     // Get works assigned
//     const works = await Work.find({ 
//       assignedTo: cuttingMaster._id,
//       isActive: true 
//     })
//       .populate('order', 'orderId deliveryDate')
//       .populate('garment', 'name garmentId')
//       .sort({ createdAt: -1 });

//     const workStats = {
//       total: works.length,
//       completed: works.filter(w => w.status === 'completed').length,
//       pending: works.filter(w => ['pending', 'accepted'].includes(w.status)).length,
//       inProgress: works.filter(w => ['cutting', 'stitching', 'iron'].includes(w.status)).length
//     };

//     res.json({
//       cuttingMaster,
//       works,
//       workStats
//     });
//   } catch (error) {
//     console.error("❌ Get by ID error:", error);
//     res.status(500).json({ message: error.message });
//   }
// };

// // ===== UPDATE CUTTING MASTER =====
// export const updateCuttingMaster = async (req, res) => {
//   try {
//     const cuttingMaster = await CuttingMaster.findById(req.params.id);

//     if (!cuttingMaster) {
//       return res.status(404).json({ message: "Cutting Master not found" });
//     }

//     const isAdmin = req.user.role === 'ADMIN';
//     const isStoreKeeper = req.user.role === 'STORE_KEEPER';

//     if (!isAdmin && !isStoreKeeper) {
//       return res.status(403).json({ message: "Not authorized" });
//     }

//     // Fields that can be updated
//     const updatableFields = ['name', 'phone', 'email', 'address', 'specialization', 'experience', 'isActive', 'isAvailable'];

//     updatableFields.forEach(field => {
//       if (req.body[field] !== undefined) {
//         cuttingMaster[field] = req.body[field];
//       }
//     });

//     await cuttingMaster.save();

//     const response = cuttingMaster.toObject();
//     delete response.password;

//     res.json({
//       message: "Cutting Master updated successfully",
//       cuttingMaster: response
//     });
//   } catch (error) {
//     console.error("❌ Update error:", error);
//     res.status(500).json({ message: error.message });
//   }
// };

// // ===== DELETE CUTTING MASTER (soft delete) =====
// export const deleteCuttingMaster = async (req, res) => {
//   try {
//     if (req.user.role !== 'ADMIN') {
//       return res.status(403).json({ message: "Only admin can delete" });
//     }

//     const cuttingMaster = await CuttingMaster.findById(req.params.id);
//     if (!cuttingMaster) {
//       return res.status(404).json({ message: "Cutting Master not found" });
//     }

//     // Check active works
//     const activeWorks = await Work.countDocuments({
//       assignedTo: cuttingMaster._id,
//       status: { $nin: ['completed', 'cancelled'] }
//     });

//     if (activeWorks > 0) {
//       return res.status(400).json({ 
//         message: `Cannot delete with ${activeWorks} active works` 
//       });
//     }

//     cuttingMaster.isActive = false;
//     await cuttingMaster.save();

//     res.json({ message: "Cutting Master deleted successfully" });
//   } catch (error) {
//     console.error("❌ Delete error:", error);
//     res.status(500).json({ message: error.message });
//   }
// };

// // ===== GET CUTTING MASTER STATS =====
// export const getCuttingMasterStats = async (req, res) => {
//   try {
//     const stats = await CuttingMaster.aggregate([
//       { $match: { isActive: true } },
//       { $group: {
//         _id: null,
//         total: { $sum: 1 },
//         available: { $sum: { $cond: [{ $eq: ["$isAvailable", true] }, 1, 0] } }
//       }}
//     ]);

//     res.json({
//       cuttingMasterStats: stats[0] || { total: 0, available: 0 }
//     });
//   } catch (error) {
//     console.error("❌ Stats error:", error);
//     res.status(500).json({ message: error.message });
//   }
// };

// // ============================================
// // 📊 DASHBOARD FUNCTIONS - UPDATED WITH IMPORTS
// // ============================================

// /**
//  * 📊 1. DASHBOARD STATS - KPI Boxes
//  * GET /api/cutting-master/dashboard/stats
//  */
// export const getDashboardStats = async (req, res) => {
//   try {
//     const { startDate, endDate } = req.query;
//     const cuttingMasterId = req.user._id; // Logged in cutting master

//     // Date filter
//     const dateFilter = {};
//     if (startDate && endDate) {
//       dateFilter.createdAt = {
//         $gte: new Date(startDate),
//         $lte: new Date(endDate)
//       };
//     }

//     // Run all counts in parallel for performance
//     const [
//       totalWork,
//       assignedWork,
//       myAssignedWork,
//       completedWork
//     ] = await Promise.all([
//       // Total Work (All orders)
//       Order.countDocuments(dateFilter),

//       // Assigned Work (Orders assigned to any tailor)
//       Order.countDocuments({
//         ...dateFilter,
//         'garments.0': { $exists: true } // At least one garment
//       }),

//       // My Assigned Work (Works assigned to this cutting master)
//       Work.countDocuments({
//         ...dateFilter,
//         cuttingMaster: cuttingMasterId,
//         status: { $in: ['pending', 'accepted', 'cutting-started'] }
//       }),

//       // Completed Work (Cutting completed by this master)
//       Work.countDocuments({
//         ...dateFilter,
//         cuttingMaster: cuttingMasterId,
//         status: 'cutting-completed'
//       })
//     ]);

//     res.json({
//       success: true,
//       data: {
//         totalWork,
//         assignedWork,
//         myAssignedWork,
//         completedWork
//       }
//     });

//   } catch (error) {
//     console.error('Dashboard Stats Error:', error);
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// /**
//  * 📈 2. WORK STATUS BREAKDOWN - Pie Chart
//  * GET /api/cutting-master/dashboard/work-status
//  */
// export const getWorkStatusBreakdown = async (req, res) => {
//   try {
//     const { startDate, endDate } = req.query;

//     // Date filter
//     const dateFilter = {};
//     if (startDate && endDate) {
//       dateFilter.createdAt = {
//         $gte: new Date(startDate),
//         $lte: new Date(endDate)
//       };
//     }

//     // All possible statuses from Work model
//     const statuses = [
//       'pending',
//       'accepted',
//       'cutting-started',
//       'cutting-completed',
//       'sewing-started',
//       'sewing-completed',
//       'ironing',
//       'ready-to-deliver'
//     ];

//     // Get counts for each status
//     const statusCounts = await Promise.all(
//       statuses.map(async (status) => {
//         const count = await Work.countDocuments({
//           ...dateFilter,
//           status: status
//         });

//         // Format for display
//         const displayName = status
//           .split('-')
//           .map(word => word.charAt(0).toUpperCase() + word.slice(1))
//           .join(' ');

//         return {
//           name: displayName,
//           value: count,
//           status: status // original for reference
//         };
//       })
//     );

//     // Filter out zero values if any
//     const nonZeroStatuses = statusCounts.filter(item => item.value > 0);

//     res.json({
//       success: true,
//       data: nonZeroStatuses
//     });

//   } catch (error) {
//     console.error('Work Status Error:', error);
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// /**
//  * 👥 3. TAILOR PERFORMANCE
//  * GET /api/cutting-master/dashboard/tailor-performance
//  */
// export const getTailorPerformance = async (req, res) => {
//   try {
//     // Get all active tailors
//     const tailors = await Tailor.find({ 
//       isActive: true
//     })
//     .select('name phone workStats performance')
//     .lean();

//     if (!tailors.length) {
//       return res.json({
//         success: true,
//         data: []
//       });
//     }

//     // Get work counts for each tailor
//     const performanceData = await Promise.all(
//       tailors.map(async (tailor) => {
//         // Get assigned works count
//         const assigned = await Work.countDocuments({
//           tailor: tailor._id,
//           status: { $ne: 'cancelled' }
//         });

//         // Get completed works
//         const completed = await Work.countDocuments({
//           tailor: tailor._id,
//           status: 'sewing-completed'
//         });

//         // Get in-progress works
//         const inProgress = await Work.countDocuments({
//           tailor: tailor._id,
//           status: { 
//             $in: ['sewing-started', 'ironing'] 
//           }
//         });

//         // Calculate efficiency
//         const efficiency = assigned > 0 
//           ? Math.round((completed / assigned) * 100) 
//           : 0;

//         return {
//           id: tailor._id,
//           name: tailor.name,
//           phone: tailor.phone,
//           assigned,
//           completed,
//           inProgress,
//           efficiency,
//           rating: tailor.performance?.rating || 0
//         };
//       })
//     );

//     // Sort by completed work (highest first)
//     performanceData.sort((a, b) => b.completed - a.completed);

//     res.json({
//       success: true,
//       data: performanceData
//     });

//   } catch (error) {
//     console.error('Tailor Performance Error:', error);
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// /**
//  * 🟢 4. AVAILABLE TAILORS SUMMARY
//  * GET /api/cutting-master/dashboard/available-tailors
//  */
// export const getAvailableTailors = async (req, res) => {
//   try {
//     // Total active tailors
//     const total = await Tailor.countDocuments({ 
//       isActive: true
//     });

//     // Available tailors (isAvailable true AND leaveStatus present)
//     const available = await Tailor.countDocuments({
//       isActive: true,
//       isAvailable: true,
//       leaveStatus: 'present'
//     });

//     // On leave tailors
//     const onLeave = await Tailor.countDocuments({
//       isActive: true,
//       $or: [
//         { isAvailable: false },
//         { leaveStatus: { $ne: 'present' } }
//       ]
//     });

//     // Get list of available tailors with current workload
//     const availableTailorsList = await Tailor.find({
//       isActive: true,
//       isAvailable: true,
//       leaveStatus: 'present'
//     })
//     .select('name phone specialization workStats')
//     .lean();

//     // Add current work count for each tailor
//     const tailorsWithWorkload = await Promise.all(
//       availableTailorsList.map(async (tailor) => {
//         const currentWork = await Work.countDocuments({
//           tailor: tailor._id,
//           status: { $in: ['sewing-started', 'ironing'] }
//         });

//         return {
//           ...tailor,
//           currentWork,
//           canTakeMore: currentWork < 3 // Max 3 works at a time
//         };
//       })
//     );

//     res.json({
//       success: true,
//       data: {
//         summary: {
//           total,
//           available,
//           onLeave,
//           availabilityRate: total > 0 
//             ? Math.round((available / total) * 100) 
//             : 0
//         },
//         availableTailors: tailorsWithWorkload
//       }
//     });

//   } catch (error) {
//     console.error('Available Tailors Error:', error);
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// /**
//  * 📋 5. CUTTING MASTER WORK QUEUE
//  * GET /api/cutting-master/dashboard/work-queue
//  */
// export const getWorkQueue = async (req, res) => {
//   try {
//     const cuttingMasterId = req.user._id;
//     const { status, priority, search } = req.query;

//     // Build filter
//     const filter = {
//       cuttingMaster: cuttingMasterId
//     };

//     // Only cutting-relevant statuses
//     if (status && status !== 'all') {
//       filter.status = status;
//     } else {
//       filter.status = { 
//         $in: ['pending', 'accepted', 'cutting-started', 'cutting-completed']
//       };
//     }

//     // Search by order or customer
//     if (search) {
//       const orders = await Order.find({
//         $or: [
//           { orderId: new RegExp(search, 'i') }
//         ]
//       }).select('_id');
      
//       filter.order = { $in: orders.map(o => o._id) };
//     }

//     // Get works with populated data
//     let works = await Work.find(filter)
//       .populate({
//         path: 'order',
//         populate: {
//           path: 'customer',
//           select: 'name phone'
//         }
//       })
//       .populate('garment', 'name type')
//       .sort({ 
//         createdAt: -1 
//       });

//     // Format for frontend
//     const formattedQueue = works.map(work => ({
//       id: work._id,
//       workId: work.workId,
//       orderId: work.order?.orderId || 'N/A',
//       customer: work.order?.customer?.name || 'Unknown',
//       dress: work.garment?.name || 'Unknown',
//       status: work.status,
//       expectedDate: work.estimatedDelivery,
//       priority: work.priority || 'normal',
//       createdAt: work.createdAt,
//       timestamps: {
//         accepted: work.acceptedAt,
//         cuttingStarted: work.cuttingStartedAt,
//         cuttingCompleted: work.cuttingCompletedAt
//       }
//     }));

//     // Get counts by status
//     const counts = {
//       pending: works.filter(w => w.status === 'pending').length,
//       accepted: works.filter(w => w.status === 'accepted').length,
//       'cutting-started': works.filter(w => w.status === 'cutting-started').length,
//       'cutting-completed': works.filter(w => w.status === 'cutting-completed').length,
//       total: works.length
//     };

//     res.json({
//       success: true,
//       data: {
//         queue: formattedQueue,
//         counts
//       }
//     });

//   } catch (error) {
//     console.error('Work Queue Error:', error);
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// /**
//  * ✅ 6. UPDATE WORK STATUS
//  * PUT /api/cutting-master/dashboard/update-status/:workId
//  */
// export const updateWorkStatus = async (req, res) => {
//   try {
//     const { workId } = req.params;
//     const { status, notes } = req.body;
//     const cuttingMasterId = req.user._id;

//     // Valid status transitions for cutting master
//     const validStatuses = [
//       'accepted',
//       'cutting-started',
//       'cutting-completed'
//     ];

//     if (!validStatuses.includes(status)) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid status transition'
//       });
//     }

//     // Find and update work
//     const work = await Work.findOne({
//       _id: workId,
//       cuttingMaster: cuttingMasterId
//     });

//     if (!work) {
//       return res.status(404).json({
//         success: false,
//         message: 'Work not found'
//       });
//     }

//     // Update status
//     work.status = status;
    
//     // Add notes if provided
//     if (notes) {
//       work.cuttingNotes = notes;
//     }

//     await work.save();

//     res.json({
//       success: true,
//       message: 'Work status updated successfully',
//       data: work
//     });

//   } catch (error) {
//     console.error('Update Status Error:', error);
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// /**
//  * 🚀 7. DASHBOARD SUMMARY - All in one API
//  * GET /api/cutting-master/dashboard/summary
//  */
// export const getDashboardSummary = async (req, res) => {
//   try {
//     const { startDate, endDate } = req.query;
//     const cuttingMasterId = req.user._id;

//     // Run all queries in parallel
//     const [
//       stats,
//       workStatus,
//       tailorPerformance,
//       availableTailors,
//       workQueue
//     ] = await Promise.all([
//       // Stats
//       (async () => {
//         const dateFilter = startDate && endDate ? {
//           createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) }
//         } : {};

//         const [total, assigned, myAssigned, completed] = await Promise.all([
//           Order.countDocuments(dateFilter),
//           Order.countDocuments({ ...dateFilter, 'garments.0': { $exists: true } }),
//           Work.countDocuments({ ...dateFilter, cuttingMaster: cuttingMasterId }),
//           Work.countDocuments({ 
//             ...dateFilter, 
//             cuttingMaster: cuttingMasterId,
//             status: 'cutting-completed' 
//           })
//         ]);

//         return { 
//           totalWork: total, 
//           assignedWork: assigned, 
//           myAssignedWork: myAssigned, 
//           completedWork: completed 
//         };
//       })(),

//       // Work Status
//       (async () => {
//         const dateFilter = startDate && endDate ? {
//           createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) }
//         } : {};

//         const statuses = [
//           'pending', 'accepted', 'cutting-started', 'cutting-completed',
//           'sewing-started', 'sewing-completed', 'ironing', 'ready-to-deliver'
//         ];

//         const counts = await Promise.all(
//           statuses.map(async (status) => {
//             const count = await Work.countDocuments({ ...dateFilter, status });
//             return {
//               name: status.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
//               value: count
//             };
//           })
//         );

//         return counts.filter(c => c.value > 0);
//       })(),

//       // Tailor Performance
//       (async () => {
//         const tailors = await Tailor.find({ isActive: true }).lean();
        
//         const performance = await Promise.all(
//           tailors.map(async (t) => {
//             const assigned = await Work.countDocuments({ tailor: t._id });
//             const completed = await Work.countDocuments({ 
//               tailor: t._id, 
//               status: 'sewing-completed' 
//             });
            
//             return {
//               name: t.name,
//               assigned,
//               completed,
//               inProgress: assigned - completed,
//               efficiency: assigned > 0 ? Math.round((completed / assigned) * 100) : 0
//             };
//           })
//         );

//         return performance.sort((a, b) => b.completed - a.completed);
//       })(),

//       // Available Tailors
//       (async () => {
//         const [total, available, onLeave] = await Promise.all([
//           Tailor.countDocuments({ isActive: true }),
//           Tailor.countDocuments({ isActive: true, isAvailable: true, leaveStatus: 'present' }),
//           Tailor.countDocuments({ isActive: true, $or: [{ isAvailable: false }, { leaveStatus: { $ne: 'present' } }] })
//         ]);

//         return { total, available, onLeave };
//       })(),

//       // Work Queue
//       (async () => {
//         const works = await Work.find({
//           cuttingMaster: cuttingMasterId,
//           status: { $in: ['pending', 'accepted', 'cutting-started'] }
//         })
//         .populate({
//           path: 'order',
//           populate: { path: 'customer', select: 'name' }
//         })
//         .populate('garment', 'name')
//         .sort({ createdAt: -1 })
//         .limit(20);

//         return works.map(w => ({
//           id: w._id,
//           workId: w.workId,
//           customer: w.order?.customer?.name || 'Unknown',
//           dress: w.garment?.name || 'Unknown',
//           status: w.status,
//           expectedDate: w.estimatedDelivery
//         }));
//       })()
//     ]);

//     res.json({
//       success: true,
//       data: {
//         stats,
//         workStatus,
//         tailorPerformance,
//         availableTailors,
//         workQueue
//       }
//     });

//   } catch (error) {
//     console.error('Dashboard Summary Error:', error);
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // Helper function
// const handleError = (error, res) => {
//   if (error.code === 11000) {
//     const field = Object.keys(error.keyPattern)[0];
//     return res.status(400).json({ message: `${field} already exists` });
//   }
//   if (error.name === "ValidationError") {
//     const errors = Object.values(error.errors).map(e => e.message);
//     return res.status(400).json({ message: "Validation failed", errors });
//   }
//   res.status(500).json({ message: error.message });
// };










// // backend/controllers/cuttingMaster.controller.js

// import CuttingMaster from "../models/CuttingMaster.js";
// import Work from "../models/Work.js";
// import Order from "../models/Order.js";
// import Tailor from "../models/Tailor.js";
// import bcrypt from "bcryptjs";

// // ===== CREATE CUTTING MASTER (Admin only) =====
// export const createCuttingMaster = async (req, res) => {
//   try {
//     console.log("📝 Creating cutting master with data:", req.body);
    
//     const { name, phone, email, password, address, specialization, experience } = req.body;

//     // Validate required fields
//     if (!name) return res.status(400).json({ message: "Name is required" });
//     if (!phone) return res.status(400).json({ message: "Phone number is required" });
//     if (!email) return res.status(400).json({ message: "Email is required" });
//     if (!password) return res.status(400).json({ message: "Password is required" });

//     // Check duplicates
//     const existingPhone = await CuttingMaster.findOne({ phone });
//     if (existingPhone) return res.status(400).json({ message: "Phone number already exists" });

//     const existingEmail = await CuttingMaster.findOne({ email });
//     if (existingEmail) return res.status(400).json({ message: "Email already exists" });

//     // Create cutting master
//     const cuttingMaster = await CuttingMaster.create({
//       name,
//       phone,
//       email,
//       password,
//       address: address || {},
//       specialization: specialization || [],
//       experience: experience || 0,
//       createdBy: req.user?._id,
//       joiningDate: new Date()
//     });

//     console.log("✅ Cutting Master created with ID:", cuttingMaster.cuttingMasterId);

//     // Don't send password back
//     const response = cuttingMaster.toObject();
//     delete response.password;

//     res.status(201).json({
//       message: "Cutting Master created successfully",
//       cuttingMaster: response
//     });
//   } catch (error) {
//     console.error("❌ Create error:", error);
//     handleError(error, res);
//   }
// };

// // ===== GET ALL CUTTING MASTERS (Admin/Store Keeper) =====
// export const getAllCuttingMasters = async (req, res) => {
//   try {
//     const { search, availability } = req.query;
//     let query = { isActive: true };

//     if (search) {
//       query.$or = [
//         { name: { $regex: search, $options: 'i' } },
//         { phone: { $regex: search, $options: 'i' } },
//         { email: { $regex: search, $options: 'i' } },
//         { cuttingMasterId: { $regex: search, $options: 'i' } }
//       ];
//     }

//     if (availability && availability !== 'all') {
//       query.isAvailable = availability === 'available';
//     }

//     const cuttingMasters = await CuttingMaster.find(query)
//       .populate('createdBy', 'name')
//       .select('-password')
//       .sort({ createdAt: -1 });

//     // Get work statistics
//     for (let cm of cuttingMasters) {
//       const workStats = await Work.aggregate([
//         { $match: { assignedTo: cm._id, isActive: true } },
//         { $group: {
//           _id: null,
//           total: { $sum: 1 },
//           completed: { $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] } },
//           pending: { $sum: { $cond: [{ $in: ["$status", ["pending", "accepted"]] }, 1, 0] } },
//           inProgress: { $sum: { $cond: [{ $in: ["$status", ["cutting", "stitching", "iron"]] }, 1, 0] } }
//         }}
//       ]);

//       cm.workStats = workStats[0] || { total: 0, completed: 0, pending: 0, inProgress: 0 };
//     }

//     res.json(cuttingMasters);
//   } catch (error) {
//     console.error("❌ Get all error:", error);
//     res.status(500).json({ message: error.message });
//   }
// };

// // ===== GET CUTTING MASTER BY ID =====
// export const getCuttingMasterById = async (req, res) => {
//   try {
//     const cuttingMaster = await CuttingMaster.findById(req.params.id)
//       .populate('createdBy', 'name')
//       .select('-password');

//     if (!cuttingMaster) {
//       return res.status(404).json({ message: "Cutting Master not found" });
//     }

//     // Get works assigned
//     const works = await Work.find({ 
//       assignedTo: cuttingMaster._id,
//       isActive: true 
//     })
//       .populate('order', 'orderId deliveryDate')
//       .populate('garment', 'name garmentId')
//       .sort({ createdAt: -1 });

//     const workStats = {
//       total: works.length,
//       completed: works.filter(w => w.status === 'completed').length,
//       pending: works.filter(w => ['pending', 'accepted'].includes(w.status)).length,
//       inProgress: works.filter(w => ['cutting', 'stitching', 'iron'].includes(w.status)).length
//     };

//     res.json({
//       cuttingMaster,
//       works,
//       workStats
//     });
//   } catch (error) {
//     console.error("❌ Get by ID error:", error);
//     res.status(500).json({ message: error.message });
//   }
// };

// // ===== UPDATE CUTTING MASTER =====
// export const updateCuttingMaster = async (req, res) => {
//   try {
//     const cuttingMaster = await CuttingMaster.findById(req.params.id);

//     if (!cuttingMaster) {
//       return res.status(404).json({ message: "Cutting Master not found" });
//     }

//     const isAdmin = req.user.role === 'ADMIN';
//     const isStoreKeeper = req.user.role === 'STORE_KEEPER';

//     if (!isAdmin && !isStoreKeeper) {
//       return res.status(403).json({ message: "Not authorized" });
//     }

//     // Fields that can be updated
//     const updatableFields = ['name', 'phone', 'email', 'address', 'specialization', 'experience', 'isActive', 'isAvailable'];

//     updatableFields.forEach(field => {
//       if (req.body[field] !== undefined) {
//         cuttingMaster[field] = req.body[field];
//       }
//     });

//     await cuttingMaster.save();

//     const response = cuttingMaster.toObject();
//     delete response.password;

//     res.json({
//       message: "Cutting Master updated successfully",
//       cuttingMaster: response
//     });
//   } catch (error) {
//     console.error("❌ Update error:", error);
//     res.status(500).json({ message: error.message });
//   }
// };

// // ===== DELETE CUTTING MASTER (soft delete) =====
// export const deleteCuttingMaster = async (req, res) => {
//   try {
//     if (req.user.role !== 'ADMIN') {
//       return res.status(403).json({ message: "Only admin can delete" });
//     }

//     const cuttingMaster = await CuttingMaster.findById(req.params.id);
//     if (!cuttingMaster) {
//       return res.status(404).json({ message: "Cutting Master not found" });
//     }

//     // Check active works
//     const activeWorks = await Work.countDocuments({
//       assignedTo: cuttingMaster._id,
//       status: { $nin: ['completed', 'cancelled'] }
//     });

//     if (activeWorks > 0) {
//       return res.status(400).json({ 
//         message: `Cannot delete with ${activeWorks} active works` 
//       });
//     }

//     cuttingMaster.isActive = false;
//     await cuttingMaster.save();

//     res.json({ message: "Cutting Master deleted successfully" });
//   } catch (error) {
//     console.error("❌ Delete error:", error);
//     res.status(500).json({ message: error.message });
//   }
// };

// // ===== GET CUTTING MASTER STATS =====
// export const getCuttingMasterStats = async (req, res) => {
//   try {
//     const stats = await CuttingMaster.aggregate([
//       { $match: { isActive: true } },
//       { $group: {
//         _id: null,
//         total: { $sum: 1 },
//         available: { $sum: { $cond: [{ $eq: ["$isAvailable", true] }, 1, 0] } }
//       }}
//     ]);

//     res.json({
//       cuttingMasterStats: stats[0] || { total: 0, available: 0 }
//     });
//   } catch (error) {
//     console.error("❌ Stats error:", error);
//     res.status(500).json({ message: error.message });
//   }
// };

// // ============================================
// // 📊 DASHBOARD FUNCTIONS - ADDED ALL REQUIRED FUNCTIONS
// // ============================================

// /**
//  * 📊 1. DASHBOARD STATS - KPI Boxes
//  * GET /api/cutting-master/dashboard/stats
//  */
// export const getDashboardStats = async (req, res) => {
//   try {
//     const { startDate, endDate } = req.query;
//     const cuttingMasterId = req.user._id;

//     const dateFilter = {};
//     if (startDate && endDate) {
//       dateFilter.createdAt = {
//         $gte: new Date(startDate),
//         $lte: new Date(endDate)
//       };
//     }

//     const [totalWork, assignedWork, myAssignedWork, completedWork] = await Promise.all([
//       Order.countDocuments(dateFilter),
//       Order.countDocuments({ ...dateFilter, 'garments.0': { $exists: true } }),
//       Work.countDocuments({ ...dateFilter, cuttingMaster: cuttingMasterId }),
//       Work.countDocuments({ 
//         ...dateFilter, 
//         cuttingMaster: cuttingMasterId,
//         status: 'cutting-completed' 
//       })
//     ]);

//     res.json({
//       success: true,
//       data: {
//         totalWork,
//         assignedWork,
//         myAssignedWork,
//         completedWork
//       }
//     });
//   } catch (error) {
//     console.error('Dashboard Stats Error:', error);
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// /**
//  * 📈 2. WORK STATUS BREAKDOWN - Pie Chart
//  * GET /api/cutting-master/dashboard/work-status
//  */
// export const getWorkStatusBreakdown = async (req, res) => {
//   try {
//     const { startDate, endDate } = req.query;

//     const dateFilter = {};
//     if (startDate && endDate) {
//       dateFilter.createdAt = {
//         $gte: new Date(startDate),
//         $lte: new Date(endDate)
//       };
//     }

//     const statuses = [
//       'pending', 'accepted', 'cutting-started', 'cutting-completed',
//       'sewing-started', 'sewing-completed', 'ironing', 'ready-to-deliver'
//     ];

//     const statusCounts = await Promise.all(
//       statuses.map(async (status) => {
//         const count = await Work.countDocuments({ ...dateFilter, status });
//         return {
//           name: status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
//           value: count,
//           status: status
//         };
//       })
//     );

//     res.json({
//       success: true,
//       data: statusCounts.filter(item => item.value > 0)
//     });
//   } catch (error) {
//     console.error('Work Status Error:', error);
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// /**
//  * 👥 3. TAILOR PERFORMANCE
//  * GET /api/cutting-master/dashboard/tailor-performance
//  */
// export const getTailorPerformance = async (req, res) => {
//   try {
//     const tailors = await Tailor.find({ isActive: true })
//       .select('name phone workStats performance')
//       .lean();

//     if (!tailors.length) {
//       return res.json({
//         success: true,
//         data: []
//       });
//     }

//     const performanceData = await Promise.all(
//       tailors.map(async (tailor) => {
//         const assigned = await Work.countDocuments({ tailor: tailor._id });
//         const completed = await Work.countDocuments({ 
//           tailor: tailor._id, 
//           status: 'sewing-completed' 
//         });
//         const inProgress = await Work.countDocuments({
//           tailor: tailor._id,
//           status: { $in: ['sewing-started', 'ironing'] }
//         });

//         return {
//           id: tailor._id,
//           name: tailor.name,
//           phone: tailor.phone,
//           assigned,
//           completed,
//           inProgress,
//           efficiency: assigned > 0 ? Math.round((completed / assigned) * 100) : 0,
//           rating: tailor.performance?.rating || 0
//         };
//       })
//     );

//     performanceData.sort((a, b) => b.completed - a.completed);

//     res.json({
//       success: true,
//       data: performanceData
//     });
//   } catch (error) {
//     console.error('Tailor Performance Error:', error);
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// /**
//  * 🟢 4. AVAILABLE TAILORS SUMMARY
//  * GET /api/cutting-master/dashboard/available-tailors
//  */
// export const getAvailableTailors = async (req, res) => {
//   try {
//     const total = await Tailor.countDocuments({ isActive: true });
    
//     const available = await Tailor.countDocuments({
//       isActive: true,
//       isAvailable: true,
//       leaveStatus: 'present'
//     });

//     const onLeave = await Tailor.countDocuments({
//       isActive: true,
//       $or: [
//         { isAvailable: false },
//         { leaveStatus: { $ne: 'present' } }
//       ]
//     });

//     const availableTailorsList = await Tailor.find({
//       isActive: true,
//       isAvailable: true,
//       leaveStatus: 'present'
//     })
//     .select('name phone specialization workStats')
//     .lean();

//     const tailorsWithWorkload = await Promise.all(
//       availableTailorsList.map(async (tailor) => {
//         const currentWork = await Work.countDocuments({
//           tailor: tailor._id,
//           status: { $in: ['sewing-started', 'ironing'] }
//         });

//         return {
//           ...tailor,
//           currentWork,
//           canTakeMore: currentWork < 3
//         };
//       })
//     );

//     res.json({
//       success: true,
//       data: {
//         summary: {
//           total,
//           available,
//           onLeave,
//           availabilityRate: total > 0 ? Math.round((available / total) * 100) : 0
//         },
//         availableTailors: tailorsWithWorkload
//       }
//     });
//   } catch (error) {
//     console.error('Available Tailors Error:', error);
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// /**
//  * 📋 5. CUTTING MASTER WORK QUEUE
//  * GET /api/cutting-master/dashboard/work-queue
//  */
// export const getWorkQueue = async (req, res) => {
//   try {
//     const cuttingMasterId = req.user._id;
//     const { status, search } = req.query;

//     const filter = { cuttingMaster: cuttingMasterId };

//     if (status && status !== 'all') {
//       filter.status = status;
//     } else {
//       filter.status = { $in: ['pending', 'accepted', 'cutting-started', 'cutting-completed'] };
//     }

//     if (search) {
//       const orders = await Order.find({
//         orderId: new RegExp(search, 'i')
//       }).select('_id');
//       filter.order = { $in: orders.map(o => o._id) };
//     }

//     const works = await Work.find(filter)
//       .populate({
//         path: 'order',
//         populate: { path: 'customer', select: 'name phone' }
//       })
//       .populate('garment', 'name type')
//       .sort({ createdAt: -1 });

//     const formattedQueue = works.map(work => ({
//       id: work._id,
//       workId: work.workId,
//       orderId: work.order?.orderId || 'N/A',
//       customer: work.order?.customer?.name || 'Unknown',
//       dress: work.garment?.name || 'Unknown',
//       status: work.status,
//       expectedDate: work.estimatedDelivery,
//       priority: work.priority || 'normal',
//       createdAt: work.createdAt,
//       timestamps: {
//         accepted: work.acceptedAt,
//         cuttingStarted: work.cuttingStartedAt,
//         cuttingCompleted: work.cuttingCompletedAt
//       }
//     }));

//     const counts = {
//       pending: works.filter(w => w.status === 'pending').length,
//       accepted: works.filter(w => w.status === 'accepted').length,
//       'cutting-started': works.filter(w => w.status === 'cutting-started').length,
//       'cutting-completed': works.filter(w => w.status === 'cutting-completed').length,
//       total: works.length
//     };

//     res.json({
//       success: true,
//       data: { queue: formattedQueue, counts }
//     });
//   } catch (error) {
//     console.error('Work Queue Error:', error);
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// /**
//  * ✅ 6. UPDATE WORK STATUS
//  * PUT /api/cutting-master/dashboard/update-status/:workId
//  */
// export const updateWorkStatus = async (req, res) => {
//   try {
//     const { workId } = req.params;
//     const { status, notes } = req.body;
//     const cuttingMasterId = req.user._id;

//     const validStatuses = ['accepted', 'cutting-started', 'cutting-completed'];

//     if (!validStatuses.includes(status)) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid status transition'
//       });
//     }

//     const work = await Work.findOne({ _id: workId, cuttingMaster: cuttingMasterId });

//     if (!work) {
//       return res.status(404).json({
//         success: false,
//         message: 'Work not found'
//       });
//     }

//     work.status = status;
//     if (notes) work.cuttingNotes = notes;
//     await work.save();

//     res.json({
//       success: true,
//       message: 'Work status updated successfully',
//       data: work
//     });
//   } catch (error) {
//     console.error('Update Status Error:', error);
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// /**
//  * 📊 7. TODAY'S SUMMARY
//  * GET /api/cutting-master/dashboard/today-summary
//  */
// export const getTodaySummary = async (req, res) => {
//   try {
//     const cuttingMasterId = req.user._id;
    
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
    
//     const tomorrow = new Date(today);
//     tomorrow.setDate(tomorrow.getDate() + 1);

//     const todayFilter = {
//       createdAt: { $gte: today, $lt: tomorrow }
//     };

//     const [completed, pending, total] = await Promise.all([
//       Work.countDocuments({ 
//         ...todayFilter,
//         cuttingMaster: cuttingMasterId,
//         status: 'cutting-completed'
//       }),
//       Work.countDocuments({ 
//         ...todayFilter,
//         cuttingMaster: cuttingMasterId,
//         status: { $in: ['pending', 'accepted', 'cutting-started'] }
//       }),
//       Work.countDocuments({ 
//         ...todayFilter,
//         cuttingMaster: cuttingMasterId
//       })
//     ]);

//     res.json({
//       success: true,
//       data: {
//         completed,
//         pending,
//         total,
//         progress: total > 0 ? Math.round((completed / total) * 100) : 0
//       }
//     });
//   } catch (error) {
//     console.error('Today Summary Error:', error);
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// /**
//  * 📊 8. HIGH PRIORITY WORKS
//  * GET /api/cutting-master/dashboard/high-priority
//  */
// export const getHighPriorityWorks = async (req, res) => {
//   try {
//     const cuttingMasterId = req.user._id;

//     const highPriorityWorks = await Work.find({
//       cuttingMaster: cuttingMasterId,
//       priority: 'high',
//       status: { $in: ['pending', 'accepted', 'cutting-started'] }
//     })
//     .populate({
//       path: 'order',
//       populate: { path: 'customer', select: 'name phone' }
//     })
//     .populate('garment', 'name')
//     .sort({ expectedDate: 1 })
//     .limit(10);

//     const formatted = highPriorityWorks.map(work => ({
//       id: work._id,
//       workId: work.workId,
//       customer: work.order?.customer?.name || 'Unknown',
//       dress: work.garment?.name || 'Unknown',
//       expectedDate: work.expectedDate,
//       status: work.status
//     }));

//     res.json({
//       success: true,
//       data: formatted
//     });
//   } catch (error) {
//     console.error('High Priority Error:', error);
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// /**
//  * 🚀 9. DASHBOARD SUMMARY - All in one API
//  * GET /api/cutting-master/dashboard/summary
//  */
// export const getDashboardSummary = async (req, res) => {
//   try {
//     const { startDate, endDate } = req.query;
//     const cuttingMasterId = req.user._id;

//     const [
//       stats,
//       workStatus,
//       tailorPerformance,
//       availableTailors,
//       workQueue,
//       todaySummary,
//       highPriority
//     ] = await Promise.all([
//       // Stats
//       (async () => {
//         const dateFilter = startDate && endDate ? {
//           createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) }
//         } : {};

//         const [total, assigned, myAssigned, completed] = await Promise.all([
//           Order.countDocuments(dateFilter),
//           Order.countDocuments({ ...dateFilter, 'garments.0': { $exists: true } }),
//           Work.countDocuments({ ...dateFilter, cuttingMaster: cuttingMasterId }),
//           Work.countDocuments({ 
//             ...dateFilter, 
//             cuttingMaster: cuttingMasterId,
//             status: 'cutting-completed' 
//           })
//         ]);

//         return { 
//           totalWork: total, 
//           assignedWork: assigned, 
//           myAssignedWork: myAssigned, 
//           completedWork: completed 
//         };
//       })(),

//       // Work Status
//       (async () => {
//         const dateFilter = startDate && endDate ? {
//           createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) }
//         } : {};

//         const statuses = [
//           'pending', 'accepted', 'cutting-started', 'cutting-completed',
//           'sewing-started', 'sewing-completed', 'ironing', 'ready-to-deliver'
//         ];

//         const counts = await Promise.all(
//           statuses.map(async (status) => {
//             const count = await Work.countDocuments({ ...dateFilter, status });
//             return {
//               name: status.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
//               value: count
//             };
//           })
//         );

//         return counts.filter(c => c.value > 0);
//       })(),

//       // Tailor Performance
//       (async () => {
//         const tailors = await Tailor.find({ isActive: true }).lean();
        
//         const performance = await Promise.all(
//           tailors.map(async (t) => {
//             const assigned = await Work.countDocuments({ tailor: t._id });
//             const completed = await Work.countDocuments({ 
//               tailor: t._id, 
//               status: 'sewing-completed' 
//             });
            
//             return {
//               name: t.name,
//               assigned,
//               completed,
//               inProgress: assigned - completed,
//               efficiency: assigned > 0 ? Math.round((completed / assigned) * 100) : 0
//             };
//           })
//         );

//         return performance.sort((a, b) => b.completed - a.completed);
//       })(),

//       // Available Tailors
//       (async () => {
//         const [total, available, onLeave] = await Promise.all([
//           Tailor.countDocuments({ isActive: true }),
//           Tailor.countDocuments({ isActive: true, isAvailable: true, leaveStatus: 'present' }),
//           Tailor.countDocuments({ isActive: true, $or: [{ isAvailable: false }, { leaveStatus: { $ne: 'present' } }] })
//         ]);

//         return { total, available, onLeave };
//       })(),

//       // Work Queue (limited)
//       (async () => {
//         const works = await Work.find({
//           cuttingMaster: cuttingMasterId,
//           status: { $in: ['pending', 'accepted', 'cutting-started'] }
//         })
//         .populate({
//           path: 'order',
//           populate: { path: 'customer', select: 'name' }
//         })
//         .populate('garment', 'name')
//         .sort({ createdAt: -1 })
//         .limit(10);

//         return works.map(w => ({
//           id: w._id,
//           workId: w.workId,
//           customer: w.order?.customer?.name || 'Unknown',
//           dress: w.garment?.name || 'Unknown',
//           status: w.status,
//           expectedDate: w.estimatedDelivery
//         }));
//       })(),

//       // Today Summary
//       (async () => {
//         const today = new Date();
//         today.setHours(0, 0, 0, 0);
//         const tomorrow = new Date(today);
//         tomorrow.setDate(tomorrow.getDate() + 1);

//         const completed = await Work.countDocuments({ 
//           cuttingMaster: cuttingMasterId,
//           status: 'cutting-completed',
//           createdAt: { $gte: today, $lt: tomorrow }
//         });

//         const total = await Work.countDocuments({ 
//           cuttingMaster: cuttingMasterId,
//           createdAt: { $gte: today, $lt: tomorrow }
//         });

//         return {
//           completed,
//           total,
//           progress: total > 0 ? Math.round((completed / total) * 100) : 0
//         };
//       })(),

//       // High Priority
//       (async () => {
//         return await Work.find({
//           cuttingMaster: cuttingMasterId,
//           priority: 'high',
//           status: { $in: ['pending', 'accepted', 'cutting-started'] }
//         })
//         .populate({
//           path: 'order',
//           populate: { path: 'customer', select: 'name' }
//         })
//         .populate('garment', 'name')
//         .sort({ expectedDate: 1 })
//         .limit(5)
//         .then(works => works.map(w => ({
//           id: w._id,
//           customer: w.order?.customer?.name || 'Unknown',
//           dress: w.garment?.name || 'Unknown',
//           expectedDate: w.expectedDate
//         })));
//       })()
//     ]);

//     res.json({
//       success: true,
//       data: {
//         stats,
//         workStatus,
//         tailorPerformance,
//         availableTailors,
//         workQueue,
//         todaySummary,
//         highPriority
//       }
//     });
//   } catch (error) {
//     console.error('Dashboard Summary Error:', error);
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // Helper function
// const handleError = (error, res) => {
//   if (error.code === 11000) {
//     const field = Object.keys(error.keyPattern)[0];
//     return res.status(400).json({ message: `${field} already exists` });
//   }
//   if (error.name === "ValidationError") {
//     const errors = Object.values(error.errors).map(e => e.message);
//     return res.status(400).json({ message: "Validation failed", errors });
//   }
//   res.status(500).json({ message: error.message });
// };















// backend/controllers/cuttingMaster.controller.js

import CuttingMaster from "../models/CuttingMaster.js";
import Work from "../models/Work.js";
import Order from "../models/Order.js";
import Tailor from "../models/Tailor.js";
import bcrypt from "bcryptjs";

// ===== CREATE CUTTING MASTER (Admin only) =====
export const createCuttingMaster = async (req, res) => {
  try {
    console.log("📝 Creating cutting master with data:", req.body);
    
    const { name, phone, email, password, address, specialization, experience } = req.body;

    // Validate required fields
    if (!name) return res.status(400).json({ message: "Name is required" });
    if (!phone) return res.status(400).json({ message: "Phone number is required" });
    if (!email) return res.status(400).json({ message: "Email is required" });
    if (!password) return res.status(400).json({ message: "Password is required" });

    // Check duplicates
    const existingPhone = await CuttingMaster.findOne({ phone });
    if (existingPhone) return res.status(400).json({ message: "Phone number already exists" });

    const existingEmail = await CuttingMaster.findOne({ email });
    if (existingEmail) return res.status(400).json({ message: "Email already exists" });

    // Create cutting master
    const cuttingMaster = await CuttingMaster.create({
      name,
      phone,
      email,
      password,
      address: address || {},
      specialization: specialization || [],
      experience: experience || 0,
      createdBy: req.user?._id,
      joiningDate: new Date()
    });

    console.log("✅ Cutting Master created with ID:", cuttingMaster.cuttingMasterId);

    // Don't send password back
    const response = cuttingMaster.toObject();
    delete response.password;

    res.status(201).json({
      message: "Cutting Master created successfully",
      cuttingMaster: response
    });
  } catch (error) {
    console.error("❌ Create error:", error);
    handleError(error, res);
  }
};

// ===== GET ALL CUTTING MASTERS (Admin/Store Keeper) =====
export const getAllCuttingMasters = async (req, res) => {
  try {
    console.log("📋 Fetching all cutting masters with query:", req.query);
    
    const { search, availability } = req.query;
    let query = { isActive: true };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { cuttingMasterId: { $regex: search, $options: 'i' } }
      ];
    }

    if (availability && availability !== 'all') {
      query.isAvailable = availability === 'available';
    }

    console.log("🔍 Query:", JSON.stringify(query));

    const cuttingMasters = await CuttingMaster.find(query)
      .populate('createdBy', 'name')
      .select('-password')
      .sort({ createdAt: -1 });

    console.log(`✅ Found ${cuttingMasters.length} cutting masters`);

    // Get work statistics
    for (let cm of cuttingMasters) {
      const workStats = await Work.aggregate([
        { $match: { assignedTo: cm._id, isActive: true } },
        { $group: {
          _id: null,
          total: { $sum: 1 },
          completed: { $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] } },
          pending: { $sum: { $cond: [{ $in: ["$status", ["pending", "accepted"]] }, 1, 0] } },
          inProgress: { $sum: { $cond: [{ $in: ["$status", ["cutting", "stitching", "iron"]] }, 1, 0] } }
        }}
      ]);

      cm.workStats = workStats[0] || { total: 0, completed: 0, pending: 0, inProgress: 0 };
    }

    res.json(cuttingMasters);
  } catch (error) {
    console.error("❌ Get all error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ===== GET CUTTING MASTER BY ID =====
export const getCuttingMasterById = async (req, res) => {
  try {
    console.log(`🔍 Fetching cutting master by ID: ${req.params.id}`);
    
    const cuttingMaster = await CuttingMaster.findById(req.params.id)
      .populate('createdBy', 'name')
      .select('-password');

    if (!cuttingMaster) {
      console.log("❌ Cutting Master not found");
      return res.status(404).json({ message: "Cutting Master not found" });
    }

    // Get works assigned
    const works = await Work.find({ 
      assignedTo: cuttingMaster._id,
      isActive: true 
    })
      .populate('order', 'orderId deliveryDate')
      .populate('garment', 'name garmentId')
      .sort({ createdAt: -1 });

    const workStats = {
      total: works.length,
      completed: works.filter(w => w.status === 'completed').length,
      pending: works.filter(w => ['pending', 'accepted'].includes(w.status)).length,
      inProgress: works.filter(w => ['cutting', 'stitching', 'iron'].includes(w.status)).length
    };

    console.log(`✅ Found cutting master: ${cuttingMaster.name}, Works: ${works.length}`);

    res.json({
      cuttingMaster,
      works,
      workStats
    });
  } catch (error) {
    console.error("❌ Get by ID error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ===== UPDATE CUTTING MASTER =====
export const updateCuttingMaster = async (req, res) => {
  try {
    console.log(`📝 Updating cutting master: ${req.params.id}`, req.body);
    
    const cuttingMaster = await CuttingMaster.findById(req.params.id);

    if (!cuttingMaster) {
      return res.status(404).json({ message: "Cutting Master not found" });
    }

    const isAdmin = req.user.role === 'ADMIN';
    const isStoreKeeper = req.user.role === 'STORE_KEEPER';

    if (!isAdmin && !isStoreKeeper) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Fields that can be updated
    const updatableFields = ['name', 'phone', 'email', 'address', 'specialization', 'experience', 'isActive', 'isAvailable'];

    updatableFields.forEach(field => {
      if (req.body[field] !== undefined) {
        cuttingMaster[field] = req.body[field];
      }
    });

    await cuttingMaster.save();

    const response = cuttingMaster.toObject();
    delete response.password;

    console.log(`✅ Cutting master updated: ${cuttingMaster.name}`);

    res.json({
      message: "Cutting Master updated successfully",
      cuttingMaster: response
    });
  } catch (error) {
    console.error("❌ Update error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ===== DELETE CUTTING MASTER (soft delete) =====
export const deleteCuttingMaster = async (req, res) => {
  try {
    console.log(`🗑️ Deleting cutting master: ${req.params.id}`);
    
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: "Only admin can delete" });
    }

    const cuttingMaster = await CuttingMaster.findById(req.params.id);
    if (!cuttingMaster) {
      return res.status(404).json({ message: "Cutting Master not found" });
    }

    // Check active works
    const activeWorks = await Work.countDocuments({
      assignedTo: cuttingMaster._id,
      status: { $nin: ['completed', 'cancelled'] }
    });

    if (activeWorks > 0) {
      return res.status(400).json({ 
        message: `Cannot delete with ${activeWorks} active works` 
      });
    }

    cuttingMaster.isActive = false;
    await cuttingMaster.save();

    console.log(`✅ Cutting master deleted: ${cuttingMaster.name}`);

    res.json({ message: "Cutting Master deleted successfully" });
  } catch (error) {
    console.error("❌ Delete error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ===== GET CUTTING MASTER STATS =====
export const getCuttingMasterStats = async (req, res) => {
  try {
    console.log("📊 Fetching cutting master stats");
    
    const stats = await CuttingMaster.aggregate([
      { $match: { isActive: true } },
      { $group: {
        _id: null,
        total: { $sum: 1 },
        available: { $sum: { $cond: [{ $eq: ["$isAvailable", true] }, 1, 0] } }
      }}
    ]);

    console.log("✅ Stats:", stats[0] || { total: 0, available: 0 });

    res.json({
      cuttingMasterStats: stats[0] || { total: 0, available: 0 }
    });
  } catch (error) {
    console.error("❌ Stats error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ============================================
// 📊 DASHBOARD FUNCTIONS WITH DEBUG
// ============================================

/**
 * 📊 1. DASHBOARD STATS - KPI Boxes
 * GET /api/cutting-masters/dashboard/stats
 */
export const getDashboardStats = async (req, res) => {
  try {
    console.log("📊 ===== DASHBOARD STATS API CALLED =====");
    console.log("📅 Query params:", req.query);
    console.log("👤 User ID:", req.user?._id);
    console.log("👤 User Role:", req.user?.role);

    const { startDate, endDate } = req.query;
    const cuttingMasterId = req.user._id;

    const dateFilter = {};
    if (startDate && endDate) {
      dateFilter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
      console.log("📅 Date filter:", dateFilter);
    }

    console.log("🔍 Fetching stats for cutting master:", cuttingMasterId);

    const [totalWork, assignedWork, myAssignedWork, completedWork] = await Promise.all([
      Order.countDocuments(dateFilter),
      Order.countDocuments({ ...dateFilter, 'garments.0': { $exists: true } }),
      Work.countDocuments({ ...dateFilter, cuttingMaster: cuttingMasterId }),
      Work.countDocuments({ 
        ...dateFilter, 
        cuttingMaster: cuttingMasterId,
        status: 'cutting-completed' 
      })
    ]);

    console.log("✅ Stats results:", {
      totalWork,
      assignedWork,
      myAssignedWork,
      completedWork
    });

    res.json({
      success: true,
      data: {
        totalWork,
        assignedWork,
        myAssignedWork,
        completedWork
      }
    });
  } catch (error) {
    console.error('❌ Dashboard Stats Error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * 📈 2. WORK STATUS BREAKDOWN - Pie Chart
 * GET /api/cutting-masters/dashboard/work-status
 */
export const getWorkStatusBreakdown = async (req, res) => {
  try {
    console.log("📈 ===== WORK STATUS BREAKDOWN API CALLED =====");
    console.log("📅 Query params:", req.query);

    const { startDate, endDate } = req.query;

    const dateFilter = {};
    if (startDate && endDate) {
      dateFilter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const statuses = [
      'pending', 'accepted', 'cutting-started', 'cutting-completed',
      'sewing-started', 'sewing-completed', 'ironing', 'ready-to-deliver'
    ];

    console.log("🔍 Fetching counts for", statuses.length, "statuses");

    const statusCounts = await Promise.all(
      statuses.map(async (status) => {
        const count = await Work.countDocuments({ ...dateFilter, status });
        return {
          name: status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
          value: count,
          status: status
        };
      })
    );

    const filtered = statusCounts.filter(item => item.value > 0);
    console.log("✅ Found", filtered.length, "statuses with data");

    res.json({
      success: true,
      data: filtered
    });
  } catch (error) {
    console.error('❌ Work Status Error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * 👥 3. TAILOR PERFORMANCE
 * GET /api/cutting-masters/dashboard/tailor-performance
 */
export const getTailorPerformance = async (req, res) => {
  try {
    console.log("👥 ===== TAILOR PERFORMANCE API CALLED =====");

    const tailors = await Tailor.find({ isActive: true })
      .select('name phone workStats performance')
      .lean();

    console.log(`🔍 Found ${tailors.length} active tailors`);

    if (!tailors.length) {
      return res.json({
        success: true,
        data: []
      });
    }

    const performanceData = await Promise.all(
      tailors.map(async (tailor) => {
        const assigned = await Work.countDocuments({ tailor: tailor._id });
        const completed = await Work.countDocuments({ 
          tailor: tailor._id, 
          status: 'sewing-completed' 
        });
        const inProgress = await Work.countDocuments({
          tailor: tailor._id,
          status: { $in: ['sewing-started', 'ironing'] }
        });

        return {
          id: tailor._id,
          name: tailor.name,
          phone: tailor.phone,
          assigned,
          completed,
          inProgress,
          efficiency: assigned > 0 ? Math.round((completed / assigned) * 100) : 0,
          rating: tailor.performance?.rating || 0
        };
      })
    );

    performanceData.sort((a, b) => b.completed - a.completed);
    console.log("✅ Top performer:", performanceData[0]?.name);

    res.json({
      success: true,
      data: performanceData
    });
  } catch (error) {
    console.error('❌ Tailor Performance Error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * 🟢 4. AVAILABLE TAILORS SUMMARY
 * GET /api/cutting-masters/dashboard/available-tailors
 */
export const getAvailableTailors = async (req, res) => {
  try {
    console.log("🟢 ===== AVAILABLE TAILORS API CALLED =====");

    const total = await Tailor.countDocuments({ isActive: true });
    console.log("📊 Total tailors:", total);
    
    const available = await Tailor.countDocuments({
      isActive: true,
      isAvailable: true,
      leaveStatus: 'present'
    });

    const onLeave = await Tailor.countDocuments({
      isActive: true,
      $or: [
        { isAvailable: false },
        { leaveStatus: { $ne: 'present' } }
      ]
    });

    console.log("✅ Available:", available, "On Leave:", onLeave);

    const availableTailorsList = await Tailor.find({
      isActive: true,
      isAvailable: true,
      leaveStatus: 'present'
    })
    .select('name phone specialization workStats')
    .lean();

    const tailorsWithWorkload = await Promise.all(
      availableTailorsList.map(async (tailor) => {
        const currentWork = await Work.countDocuments({
          tailor: tailor._id,
          status: { $in: ['sewing-started', 'ironing'] }
        });

        return {
          ...tailor,
          currentWork,
          canTakeMore: currentWork < 3
        };
      })
    );

    res.json({
      success: true,
      data: {
        summary: {
          total,
          available,
          onLeave,
          availabilityRate: total > 0 ? Math.round((available / total) * 100) : 0
        },
        availableTailors: tailorsWithWorkload
      }
    });
  } catch (error) {
    console.error('❌ Available Tailors Error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * 📋 5. CUTTING MASTER WORK QUEUE
 * GET /api/cutting-masters/dashboard/work-queue
 */
export const getWorkQueue = async (req, res) => {
  try {
    console.log("📋 ===== WORK QUEUE API CALLED =====");
    console.log("👤 User ID:", req.user?._id);
    console.log("🔍 Query params:", req.query);

    const cuttingMasterId = req.user._id;
    const { status, search } = req.query;

    const filter = { cuttingMaster: cuttingMasterId };
    console.log("🔍 Initial filter:", filter);

    if (status && status !== 'all') {
      filter.status = status;
      console.log("📊 Status filter:", status);
    } else {
      filter.status = { $in: ['pending', 'accepted', 'cutting-started', 'cutting-completed'] };
      console.log("📊 Status filter: All cutting statuses");
    }

    if (search) {
      console.log("🔎 Search term:", search);
      const orders = await Order.find({
        orderId: new RegExp(search, 'i')
      }).select('_id');
      filter.order = { $in: orders.map(o => o._id) };
      console.log(`🔎 Found ${orders.length} matching orders`);
    }

    console.log("🔍 Final filter:", JSON.stringify(filter));

    const works = await Work.find(filter)
      .populate({
        path: 'order',
        populate: { path: 'customer', select: 'name phone' }
      })
      .populate('garment', 'name type')
      .sort({ createdAt: -1 });

    console.log(`✅ Found ${works.length} works in queue`);

    const formattedQueue = works.map(work => ({
      id: work._id,
      workId: work.workId,
      orderId: work.order?.orderId || 'N/A',
      customer: work.order?.customer?.name || 'Unknown',
      dress: work.garment?.name || 'Unknown',
      status: work.status,
      expectedDate: work.estimatedDelivery,
      priority: work.priority || 'normal',
      createdAt: work.createdAt,
      timestamps: {
        accepted: work.acceptedAt,
        cuttingStarted: work.cuttingStartedAt,
        cuttingCompleted: work.cuttingCompletedAt
      }
    }));

    const counts = {
      pending: works.filter(w => w.status === 'pending').length,
      accepted: works.filter(w => w.status === 'accepted').length,
      'cutting-started': works.filter(w => w.status === 'cutting-started').length,
      'cutting-completed': works.filter(w => w.status === 'cutting-completed').length,
      total: works.length
    };

    console.log("📊 Queue counts:", counts);

    res.json({
      success: true,
      data: { queue: formattedQueue, counts }
    });
  } catch (error) {
    console.error('❌ Work Queue Error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * ✅ 6. UPDATE WORK STATUS
 * PUT /api/cutting-masters/dashboard/update-status/:workId
 */
export const updateWorkStatus = async (req, res) => {
  try {
    console.log("✅ ===== UPDATE WORK STATUS API CALLED =====");
    console.log("📦 Work ID:", req.params.workId);
    console.log("📝 Request body:", req.body);
    console.log("👤 User ID:", req.user?._id);

    const { workId } = req.params;
    const { status, notes } = req.body;
    const cuttingMasterId = req.user._id;

    const validStatuses = ['accepted', 'cutting-started', 'cutting-completed'];
    console.log("🔄 Attempting to update to status:", status);

    if (!validStatuses.includes(status)) {
      console.log("❌ Invalid status:", status);
      return res.status(400).json({
        success: false,
        message: 'Invalid status transition'
      });
    }

    const work = await Work.findOne({ _id: workId, cuttingMaster: cuttingMasterId });

    if (!work) {
      console.log("❌ Work not found for ID:", workId);
      return res.status(404).json({
        success: false,
        message: 'Work not found'
      });
    }

    console.log("✅ Work found - Current status:", work.status);
    console.log("🔄 Updating to:", status);

    work.status = status;
    if (notes) work.cuttingNotes = notes;
    await work.save();

    console.log("✅ Work status updated successfully");

    res.json({
      success: true,
      message: 'Work status updated successfully',
      data: work
    });
  } catch (error) {
    console.error('❌ Update Status Error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * 📊 7. TODAY'S SUMMARY
 * GET /api/cutting-masters/dashboard/today-summary
 */
export const getTodaySummary = async (req, res) => {
  try {
    console.log("📊 ===== TODAY SUMMARY API CALLED =====");
    console.log("👤 User ID:", req.user?._id);

    const cuttingMasterId = req.user._id;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    console.log("📅 Today range:", { start: today, end: tomorrow });

    const todayFilter = {
      createdAt: { $gte: today, $lt: tomorrow }
    };

    console.log("🔍 Fetching today's stats...");

    const [completed, pending, total] = await Promise.all([
      Work.countDocuments({ 
        ...todayFilter,
        cuttingMaster: cuttingMasterId,
        status: 'cutting-completed'
      }),
      Work.countDocuments({ 
        ...todayFilter,
        cuttingMaster: cuttingMasterId,
        status: { $in: ['pending', 'accepted', 'cutting-started'] }
      }),
      Work.countDocuments({ 
        ...todayFilter,
        cuttingMaster: cuttingMasterId
      })
    ]);

    console.log("✅ Today's stats:", { completed, pending, total });

    res.json({
      success: true,
      data: {
        completed,
        pending,
        total,
        progress: total > 0 ? Math.round((completed / total) * 100) : 0
      }
    });
  } catch (error) {
    console.error('❌ Today Summary Error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * 📊 8. HIGH PRIORITY WORKS
 * GET /api/cutting-masters/dashboard/high-priority
 */
export const getHighPriorityWorks = async (req, res) => {
  try {
    console.log("🔴 ===== HIGH PRIORITY WORKS API CALLED =====");
    console.log("👤 User ID:", req.user?._id);

    const cuttingMasterId = req.user._id;

    console.log("🔍 Fetching high priority works...");

    const highPriorityWorks = await Work.find({
      cuttingMaster: cuttingMasterId,
      priority: 'high',
      status: { $in: ['pending', 'accepted', 'cutting-started'] }
    })
    .populate({
      path: 'order',
      populate: { path: 'customer', select: 'name phone' }
    })
    .populate('garment', 'name')
    .sort({ expectedDate: 1 })
    .limit(10);

    console.log(`✅ Found ${highPriorityWorks.length} high priority works`);

    const formatted = highPriorityWorks.map(work => ({
      id: work._id,
      workId: work.workId,
      customer: work.order?.customer?.name || 'Unknown',
      dress: work.garment?.name || 'Unknown',
      expectedDate: work.expectedDate,
      status: work.status
    }));

    res.json({
      success: true,
      data: formatted
    });
  } catch (error) {
    console.error('❌ High Priority Error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * 🚀 9. DASHBOARD SUMMARY - All in one API
 * GET /api/cutting-masters/dashboard/summary
 */
export const getDashboardSummary = async (req, res) => {
  try {
    console.log("🚀 ===== DASHBOARD SUMMARY API CALLED =====");
    console.log("📅 Query params:", req.query);
    console.log("👤 User ID:", req.user?._id);

    const { startDate, endDate } = req.query;
    const cuttingMasterId = req.user._id;

    console.log("🔍 Fetching all dashboard data in parallel...");

    const [
      stats,
      workStatus,
      tailorPerformance,
      availableTailors,
      workQueue,
      todaySummary,
      highPriority
    ] = await Promise.all([
      // Stats
      (async () => {
        console.log("📊 Fetching stats...");
        const dateFilter = startDate && endDate ? {
          createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) }
        } : {};

        const [total, assigned, myAssigned, completed] = await Promise.all([
          Order.countDocuments(dateFilter),
          Order.countDocuments({ ...dateFilter, 'garments.0': { $exists: true } }),
          Work.countDocuments({ ...dateFilter, cuttingMaster: cuttingMasterId }),
          Work.countDocuments({ 
            ...dateFilter, 
            cuttingMaster: cuttingMasterId,
            status: 'cutting-completed' 
          })
        ]);

        console.log("✅ Stats fetched:", { total, assigned, myAssigned, completed });

        return { 
          totalWork: total, 
          assignedWork: assigned, 
          myAssignedWork: myAssigned, 
          completedWork: completed 
        };
      })(),

      // Work Status
      (async () => {
        console.log("📈 Fetching work status...");
        const dateFilter = startDate && endDate ? {
          createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) }
        } : {};

        const statuses = [
          'pending', 'accepted', 'cutting-started', 'cutting-completed',
          'sewing-started', 'sewing-completed', 'ironing', 'ready-to-deliver'
        ];

        const counts = await Promise.all(
          statuses.map(async (status) => {
            const count = await Work.countDocuments({ ...dateFilter, status });
            return {
              name: status.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
              value: count
            };
          })
        );

        const filtered = counts.filter(c => c.value > 0);
        console.log("✅ Work status fetched,", filtered.length, "statuses with data");
        return filtered;
      })(),

      // Tailor Performance
      (async () => {
        console.log("👥 Fetching tailor performance...");
        const tailors = await Tailor.find({ isActive: true }).lean();
        
        const performance = await Promise.all(
          tailors.map(async (t) => {
            const assigned = await Work.countDocuments({ tailor: t._id });
            const completed = await Work.countDocuments({ 
              tailor: t._id, 
              status: 'sewing-completed' 
            });
            
            return {
              name: t.name,
              assigned,
              completed,
              inProgress: assigned - completed,
              efficiency: assigned > 0 ? Math.round((completed / assigned) * 100) : 0
            };
          })
        );

        performance.sort((a, b) => b.completed - a.completed);
        console.log("✅ Tailor performance fetched, top:", performance[0]?.name);
        return performance;
      })(),

      // Available Tailors
      (async () => {
        console.log("🟢 Fetching available tailors...");
        const [total, available, onLeave] = await Promise.all([
          Tailor.countDocuments({ isActive: true }),
          Tailor.countDocuments({ isActive: true, isAvailable: true, leaveStatus: 'present' }),
          Tailor.countDocuments({ isActive: true, $or: [{ isAvailable: false }, { leaveStatus: { $ne: 'present' } }] })
        ]);

        console.log("✅ Available tailors fetched:", { total, available, onLeave });
        return { total, available, onLeave };
      })(),

      // Work Queue (limited)
      (async () => {
        console.log("📋 Fetching work queue...");
        const works = await Work.find({
          cuttingMaster: cuttingMasterId,
          status: { $in: ['pending', 'accepted', 'cutting-started'] }
        })
        .populate({
          path: 'order',
          populate: { path: 'customer', select: 'name' }
        })
        .populate('garment', 'name')
        .sort({ createdAt: -1 })
        .limit(10);

        console.log(`✅ Work queue fetched, ${works.length} items`);
        return works.map(w => ({
          id: w._id,
          workId: w.workId,
          customer: w.order?.customer?.name || 'Unknown',
          dress: w.garment?.name || 'Unknown',
          status: w.status,
          expectedDate: w.estimatedDelivery
        }));
      })(),

      // Today Summary
      (async () => {
        console.log("📊 Fetching today summary...");
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const completed = await Work.countDocuments({ 
          cuttingMaster: cuttingMasterId,
          status: 'cutting-completed',
          createdAt: { $gte: today, $lt: tomorrow }
        });

        const total = await Work.countDocuments({ 
          cuttingMaster: cuttingMasterId,
          createdAt: { $gte: today, $lt: tomorrow }
        });

        console.log("✅ Today summary fetched:", { completed, total });
        return {
          completed,
          total,
          progress: total > 0 ? Math.round((completed / total) * 100) : 0
        };
      })(),

      // High Priority
      (async () => {
        console.log("🔴 Fetching high priority works...");
        const works = await Work.find({
          cuttingMaster: cuttingMasterId,
          priority: 'high',
          status: { $in: ['pending', 'accepted', 'cutting-started'] }
        })
        .populate({
          path: 'order',
          populate: { path: 'customer', select: 'name' }
        })
        .populate('garment', 'name')
        .sort({ expectedDate: 1 })
        .limit(5);

        console.log(`✅ High priority works fetched, ${works.length} items`);
        return works.map(w => ({
          id: w._id,
          customer: w.order?.customer?.name || 'Unknown',
          dress: w.garment?.name || 'Unknown',
          expectedDate: w.expectedDate
        }));
      })()
    ]);

    console.log("🚀 All dashboard data fetched successfully!");

    res.json({
      success: true,
      data: {
        stats,
        workStatus,
        tailorPerformance,
        availableTailors,
        workQueue,
        todaySummary,
        highPriority
      }
    });
  } catch (error) {
    console.error('❌ Dashboard Summary Error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Helper function
const handleError = (error, res) => {
  if (error.code === 11000) {
    const field = Object.keys(error.keyPattern)[0];
    return res.status(400).json({ message: `${field} already exists` });
  }
  if (error.name === "ValidationError") {
    const errors = Object.values(error.errors).map(e => e.message);
    return res.status(400).json({ message: "Validation failed", errors });
  }
  res.status(500).json({ message: error.message });
};