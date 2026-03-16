// // backend/routes/cuttingMaster.routes.js
// import express from "express";
// import {
//   createCuttingMaster,
//   getAllCuttingMasters,
//   getCuttingMasterById,
//   updateCuttingMaster,
//   deleteCuttingMaster,
//   getCuttingMasterStats
// } from "../controllers/cuttingMaster.controller.js";
// import { protect, authorize } from "../middleware/auth.middleware.js";

// const router = express.Router();

// // Debug middleware
// router.use((req, res, next) => {
//   console.log(`📡 CuttingMaster Route: ${req.method} ${req.originalUrl}`);
//   next();
// });

// // All routes require authentication
// router.use(protect);

// /**
//  * @route   POST /api/cutting-masters
//  * @desc    Create new cutting master
//  * @access  Admin only
//  */
// router.post("/", authorize("ADMIN"), createCuttingMaster);

// /**
//  * @route   GET /api/cutting-masters/stats
//  * @desc    Get cutting master statistics
//  * @access  Admin, Store Keeper
//  */
// router.get("/stats", authorize("ADMIN", "STORE_KEEPER"), getCuttingMasterStats);

// /**
//  * @route   GET /api/cutting-masters
//  * @desc    Get all cutting masters
//  * @access  Admin, Store Keeper
//  */
// router.get("/", authorize("ADMIN", "STORE_KEEPER"), getAllCuttingMasters);

// /**
//  * @route   GET /api/cutting-masters/:id
//  * @desc    Get cutting master by ID
//  * @access  Admin, Store Keeper, Cutting Master (self)
//  */
// router.get("/:id", authorize("ADMIN", "STORE_KEEPER", "CUTTING_MASTER"), getCuttingMasterById);

// /**
//  * @route   PUT /api/cutting-masters/:id
//  * @desc    Update cutting master
//  * @access  Admin, Store Keeper
//  */
// router.put("/:id", authorize("ADMIN", "STORE_KEEPER"), updateCuttingMaster);

// /**
//  * @route   DELETE /api/cutting-masters/:id
//  * @desc    Delete cutting master
//  * @access  Admin only
//  */
// router.delete("/:id", authorize("ADMIN"), deleteCuttingMaster);

// export default router;







// // backend/routes/
// cuttingMaster.routes.js

// import express from 'express';
// import {
//   // CRUD Operations (Admin)
//   createCuttingMaster,
//   getAllCuttingMasters,
//   getCuttingMasterById,
//   updateCuttingMaster,
//   deleteCuttingMaster,
//   getCuttingMasterStats,

//   // Dashboard Operations (Cutting Master Self)
//   getDashboardStats,
//   getWorkStatusBreakdown,
//   getTailorPerformance,
//   getAvailableTailors,
//   getWorkQueue,
//   updateWorkStatus,
//   getDashboardSummary
// } from '../controllers/cuttingMaster.controller.js';
// import { protect, authorize } from '../middleware/auth.middleware.js';

// const router = express.Router();

// // Debug middleware - log all requests
// router.use((req, res, next) => {
//   console.log(`📡 CuttingMaster Route: ${req.method} ${req.originalUrl}`);
//   console.log('👤 User Role:', req.user?.role);
//   next();
// });

// // ============================================
// // 🔐 ALL ROUTES REQUIRE AUTHENTICATION
// // ============================================
// router.use(protect);

// // ============================================
// // 📊 SECTION 1: ADMIN ONLY ROUTES (CRUD Operations)
// // ============================================

// /**
//  * @route   POST /api/cutting-masters
//  * @desc    Create new cutting master
//  * @access  ADMIN only
//  */
// router.post("/", authorize("ADMIN"), createCuttingMaster);

// /**
//  * @route   DELETE /api/cutting-masters/:id
//  * @desc    Delete cutting master
//  * @access  ADMIN only
//  */
// router.delete("/:id", authorize("ADMIN"), deleteCuttingMaster);

// // ============================================
// // 📈 SECTION 2: ADMIN + STORE_KEEPER ROUTES
// // ============================================

// /**
//  * @route   GET /api/cutting-masters/stats
//  * @desc    Get cutting master statistics (Admin view)
//  * @access  ADMIN, STORE_KEEPER
//  */
// router.get("/stats", authorize("ADMIN", "STORE_KEEPER"), getCuttingMasterStats);

// /**
//  * @route   GET /api/cutting-masters
//  * @desc    Get all cutting masters list
//  * @access  ADMIN, STORE_KEEPER
//  */
// router.get("/", authorize("ADMIN", "STORE_KEEPER"), getAllCuttingMasters);

// /**
//  * @route   PUT /api/cutting-masters/:id
//  * @desc    Update cutting master details
//  * @access  ADMIN, STORE_KEEPER
//  */
// router.put("/:id", authorize("ADMIN", "STORE_KEEPER"), updateCuttingMaster);

// // ============================================
// // 🎯 SECTION 3: CUTTING MASTER SELF ROUTES (Dashboard)
// //    These can be accessed by:
// //    - CUTTING_MASTER (themselves)
// //    - ADMIN (can view anyone)
// //    - STORE_KEEPER (can view for management)
// // ============================================

// /**
//  * @route   GET /api/cutting-masters/dashboard/stats
//  * @desc    Get dashboard KPI stats for cutting master
//  * @access  CUTTING_MASTER, ADMIN, STORE_KEEPER
//  */
// router.get(
//   "/dashboard/stats", 
//   authorize("CUTTING_MASTER", "ADMIN", "STORE_KEEPER"), 
//   getDashboardStats
// );

// /**
//  * @route   GET /api/cutting-masters/dashboard/work-status
//  * @desc    Get work status breakdown (Pie chart data)
//  * @access  CUTTING_MASTER, ADMIN, STORE_KEEPER
//  */
// router.get(
//   "/dashboard/work-status", 
//   authorize("CUTTING_MASTER", "ADMIN", "STORE_KEEPER"), 
//   getWorkStatusBreakdown
// );

// /**
//  * @route   GET /api/cutting-masters/dashboard/tailor-performance
//  * @desc    Get tailor performance data
//  * @access  CUTTING_MASTER, ADMIN, STORE_KEEPER
//  */
// router.get(
//   "/dashboard/tailor-performance", 
//   authorize("CUTTING_MASTER", "ADMIN", "STORE_KEEPER"), 
//   getTailorPerformance
// );

// /**
//  * @route   GET /api/cutting-masters/dashboard/available-tailors
//  * @desc    Get available tailors summary
//  * @access  CUTTING_MASTER, ADMIN, STORE_KEEPER
//  */
// router.get(
//   "/dashboard/available-tailors", 
//   authorize("CUTTING_MASTER", "ADMIN", "STORE_KEEPER"), 
//   getAvailableTailors
// );

// /**
//  * @route   GET /api/cutting-masters/dashboard/work-queue
//  * @desc    Get cutting master's work queue
//  * @access  CUTTING_MASTER (self), ADMIN (any), STORE_KEEPER (any)
//  */
// router.get(
//   "/dashboard/work-queue", 
//   authorize("CUTTING_MASTER", "ADMIN", "STORE_KEEPER"), 
//   getWorkQueue
// );

// /**
//  * @route   PUT /api/cutting-masters/dashboard/update-status/:workId
//  * @desc    Update work status (cutting started/completed)
//  * @access  CUTTING_MASTER (self), ADMIN (any)
//  */
// router.put(
//   "/dashboard/update-status/:workId", 
//   authorize("CUTTING_MASTER", "ADMIN"), 
//   updateWorkStatus
// );

// /**
//  * @route   GET /api/cutting-masters/dashboard/summary
//  * @desc    Get complete dashboard summary (all data in one call)
//  * @access  CUTTING_MASTER, ADMIN, STORE_KEEPER
//  */
// router.get(
//   "/dashboard/summary", 
//   authorize("CUTTING_MASTER", "ADMIN", "STORE_KEEPER"), 
//   getDashboardSummary
// );

// // ============================================
// // 🆔 SECTION 4: GET BY ID (Mixed Access)
// // ============================================

// /**
//  * @route   GET /api/cutting-masters/:id
//  * @desc    Get cutting master by ID
//  * @access  ADMIN (any), STORE_KEEPER (any), CUTTING_MASTER (self only)
//  */
// router.get("/:id", (req, res, next) => {
//   // Special logic for CUTTING_MASTER - can only access their own data
//   if (req.user.role === "CUTTING_MASTER" && req.params.id !== req.user.id) {
//     return res.status(403).json({
//       success: false,
//       message: "Access denied. You can only view your own profile."
//     });
//   }
//   // For ADMIN and STORE_KEEPER, allow access
//   next();
// }, authorize("CUTTING_MASTER", "ADMIN", "STORE_KEEPER"), getCuttingMasterById);

// export default router;




// // backend/routes/cuttingMaster.routes.js

// import express from 'express';
// import {
//   // CRUD Operations (Admin)
//   createCuttingMaster,
//   getAllCuttingMasters,
//   getCuttingMasterById,
//   updateCuttingMaster,
//   deleteCuttingMaster,
//   getCuttingMasterStats,

//   // Dashboard Operations (Cutting Master Self)
//   getDashboardStats,
//   getWorkStatusBreakdown,
//   getTailorPerformance,
//   getAvailableTailors,
//   getWorkQueue,
//   updateWorkStatus,
//   getTodaySummary,
//   getHighPriorityWorks,
//   getDashboardSummary
// } from '../controllers/cuttingMaster.controller.js';
// import { protect, authorize } from '../middleware/auth.middleware.js';

// const router = express.Router();

// // Debug middleware - log all requests
// router.use((req, res, next) => {
//   console.log(`📡 CuttingMaster Route: ${req.method} ${req.originalUrl}`);
//   console.log('👤 User Role:', req.user?.role);
//   next();
// });

// // ============================================
// // 🔐 ALL ROUTES REQUIRE AUTHENTICATION
// // ============================================
// router.use(protect);

// // ============================================
// // 📊 SECTION 1: ADMIN ONLY ROUTES (CRUD Operations)
// // ============================================

// /**
//  * @route   POST /api/cutting-masters
//  * @desc    Create new cutting master
//  * @access  ADMIN only
//  */
// router.post("/", authorize("ADMIN"), createCuttingMaster);

// /**
//  * @route   DELETE /api/cutting-masters/:id
//  * @desc    Delete cutting master
//  * @access  ADMIN only
//  */
// router.delete("/:id", authorize("ADMIN"), deleteCuttingMaster);

// // ============================================
// // 📈 SECTION 2: ADMIN + STORE_KEEPER ROUTES
// // ============================================

// /**
//  * @route   GET /api/cutting-masters/stats
//  * @desc    Get cutting master statistics (Admin view)
//  * @access  ADMIN, STORE_KEEPER
//  */
// router.get("/stats", authorize("ADMIN", "STORE_KEEPER"), getCuttingMasterStats);

// /**
//  * @route   GET /api/cutting-masters
//  * @desc    Get all cutting masters list
//  * @access  ADMIN, STORE_KEEPER
//  */
// router.get("/", authorize("ADMIN", "STORE_KEEPER"), getAllCuttingMasters);

// /**
//  * @route   PUT /api/cutting-masters/:id
//  * @desc    Update cutting master details
//  * @access  ADMIN, STORE_KEEPER
//  */
// router.put("/:id", authorize("ADMIN", "STORE_KEEPER"), updateCuttingMaster);

// // ============================================
// // 🎯 SECTION 3: CUTTING MASTER DASHBOARD ROUTES
// //    These can be accessed by:
// //    - CUTTING_MASTER (themselves)
// //    - ADMIN (can view anyone)
// //    - STORE_KEEPER (can view for management)
// // ============================================

// /**
//  * @route   GET /api/cutting-masters/dashboard/stats
//  * @desc    Get dashboard KPI stats for cutting master
//  * @access  CUTTING_MASTER, ADMIN, STORE_KEEPER
//  */
// router.get(
//   "/dashboard/stats", 
//   authorize("CUTTING_MASTER", "ADMIN", "STORE_KEEPER"), 
//   getDashboardStats
// );

// /**
//  * @route   GET /api/cutting-masters/dashboard/work-status
//  * @desc    Get work status breakdown (Pie chart data)
//  * @access  CUTTING_MASTER, ADMIN, STORE_KEEPER
//  */
// router.get(
//   "/dashboard/work-status", 
//   authorize("CUTTING_MASTER", "ADMIN", "STORE_KEEPER"), 
//   getWorkStatusBreakdown
// );

// /**
//  * @route   GET /api/cutting-masters/dashboard/tailor-performance
//  * @desc    Get tailor performance data
//  * @access  CUTTING_MASTER, ADMIN, STORE_KEEPER
//  */
// router.get(
//   "/dashboard/tailor-performance", 
//   authorize("CUTTING_MASTER", "ADMIN", "STORE_KEEPER"), 
//   getTailorPerformance
// );

// /**
//  * @route   GET /api/cutting-masters/dashboard/available-tailors
//  * @desc    Get available tailors summary
//  * @access  CUTTING_MASTER, ADMIN, STORE_KEEPER
//  */
// router.get(
//   "/dashboard/available-tailors", 
//   authorize("CUTTING_MASTER", "ADMIN", "STORE_KEEPER"), 
//   getAvailableTailors
// );

// /**
//  * @route   GET /api/cutting-masters/dashboard/work-queue
//  * @desc    Get cutting master's work queue
//  * @access  CUTTING_MASTER, ADMIN, STORE_KEEPER
//  */
// router.get(
//   "/dashboard/work-queue", 
//   authorize("CUTTING_MASTER", "ADMIN", "STORE_KEEPER"), 
//   getWorkQueue
// );

// /**
//  * @route   PUT /api/cutting-masters/dashboard/update-status/:workId
//  * @desc    Update work status (cutting started/completed)
//  * @access  CUTTING_MASTER, ADMIN
//  */
// router.put(
//   "/dashboard/update-status/:workId", 
//   authorize("CUTTING_MASTER", "ADMIN"), 
//   updateWorkStatus
// );

// /**
//  * @route   GET /api/cutting-masters/dashboard/today-summary
//  * @desc    Get today's summary (completed, pending, progress)
//  * @access  CUTTING_MASTER, ADMIN, STORE_KEEPER
//  */
// router.get(
//   "/dashboard/today-summary", 
//   authorize("CUTTING_MASTER", "ADMIN", "STORE_KEEPER"), 
//   getTodaySummary
// );

// /**
//  * @route   GET /api/cutting-masters/dashboard/high-priority
//  * @desc    Get high priority works list
//  * @access  CUTTING_MASTER, ADMIN, STORE_KEEPER
//  */
// router.get(
//   "/dashboard/high-priority", 
//   authorize("CUTTING_MASTER", "ADMIN", "STORE_KEEPER"), 
//   getHighPriorityWorks
// );

// /**
//  * @route   GET /api/cutting-masters/dashboard/summary
//  * @desc    Get complete dashboard summary (all data in one call)
//  * @access  CUTTING_MASTER, ADMIN, STORE_KEEPER
//  */
// router.get(
//   "/dashboard/summary", 
//   authorize("CUTTING_MASTER", "ADMIN", "STORE_KEEPER"), 
//   getDashboardSummary
// );

// // ============================================
// // 🆔 SECTION 4: GET BY ID (Mixed Access)
// // ============================================

// /**
//  * @route   GET /api/cutting-masters/:id
//  * @desc    Get cutting master by ID
//  * @access  ADMIN (any), STORE_KEEPER (any), CUTTING_MASTER (self only)
//  */
// router.get("/:id", (req, res, next) => {
//   // Special logic for CUTTING_MASTER - can only access their own data
//   if (req.user.role === "CUTTING_MASTER" && req.params.id !== req.user.id) {
//     return res.status(403).json({
//       success: false,
//       message: "Access denied. You can only view your own profile."
//     });
//   }
//   // For ADMIN and STORE_KEEPER, allow access
//   next();
// }, authorize("CUTTING_MASTER", "ADMIN", "STORE_KEEPER"), getCuttingMasterById);

// export default router;





















// backend/routes/cuttingMaster.routes.js

import express from 'express';
import {
  // CRUD Operations (Admin)
  createCuttingMaster,
  getAllCuttingMasters,
  getCuttingMasterById,
  updateCuttingMaster,
  deleteCuttingMaster,
  getCuttingMasterStats,

  // Dashboard Operations (Cutting Master Self)
  getDashboardStats,
  getWorkStatusBreakdown,
  getTailorPerformance,
  getAvailableTailors,
  getWorkQueue,
  updateWorkStatus,
  getTodaySummary,
  getHighPriorityWorks,
  getOverdueWorks,           // ✅ Added missing import
  getMonthlySchedule,        // ✅ Added missing import
  getWorksByDate,            // ✅ Added missing import
  getDashboardSummary
} from '../controllers/cuttingMaster.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// Debug middleware - log all requests
router.use((req, res, next) => {
  console.log(`📡 CuttingMaster Route: ${req.method} ${req.originalUrl}`);
  console.log('👤 User Role:', req.user?.role);
  console.log('👤 User ID:', req.user?._id);
  next();
});

// ============================================
// 🔐 ALL ROUTES REQUIRE AUTHENTICATION
// ============================================
router.use(protect);

// ============================================
// 📊 SECTION 1: ADMIN ONLY ROUTES (CRUD Operations)
// ============================================

/**
 * @route   POST /api/cutting-masters
 * @desc    Create new cutting master
 * @access  ADMIN only
 */
router.post("/", authorize("ADMIN"), createCuttingMaster);

/**
 * @route   DELETE /api/cutting-masters/:id
 * @desc    Delete cutting master
 * @access  ADMIN only
 */
router.delete("/:id", authorize("ADMIN"), deleteCuttingMaster);

// ============================================
// 📈 SECTION 2: ADMIN + STORE_KEEPER ROUTES
// ============================================

/**
 * @route   GET /api/cutting-masters/stats
 * @desc    Get cutting master statistics (Admin view)
 * @access  ADMIN, STORE_KEEPER
 */
router.get("/stats", authorize("ADMIN", "STORE_KEEPER"), getCuttingMasterStats);

/**
 * @route   GET /api/cutting-masters
 * @desc    Get all cutting masters list
 * @access  ADMIN, STORE_KEEPER
 */
router.get("/", authorize("ADMIN", "STORE_KEEPER"), getAllCuttingMasters);

/**
 * @route   PUT /api/cutting-masters/:id
 * @desc    Update cutting master details
 * @access  ADMIN, STORE_KEEPER
 */
router.put("/:id", authorize("ADMIN", "STORE_KEEPER"), updateCuttingMaster);

// ============================================
// 🎯 SECTION 3: CUTTING MASTER DASHBOARD ROUTES
//    These can be accessed by:
//    - CUTTING_MASTER (themselves)
//    - ADMIN (can view anyone)
//    - STORE_KEEPER (can view for management)
// ============================================

/**
 * @route   GET /api/cutting-masters/dashboard/stats
 * @desc    Get dashboard KPI stats for cutting master
 * @access  CUTTING_MASTER, ADMIN, STORE_KEEPER
 */
router.get(
  "/dashboard/stats", 
  authorize("CUTTING_MASTER", "ADMIN", "STORE_KEEPER"), 
  getDashboardStats
);

/**
 * @route   GET /api/cutting-masters/dashboard/work-status
 * @desc    Get work status breakdown (Pie chart data)
 * @access  CUTTING_MASTER, ADMIN, STORE_KEEPER
 */
router.get(
  "/dashboard/work-status", 
  authorize("CUTTING_MASTER", "ADMIN", "STORE_KEEPER"), 
  getWorkStatusBreakdown
);

/**
 * @route   GET /api/cutting-masters/dashboard/tailor-performance
 * @desc    Get tailor performance data
 * @access  CUTTING_MASTER, ADMIN, STORE_KEEPER
 */
router.get(
  "/dashboard/tailor-performance", 
  authorize("CUTTING_MASTER", "ADMIN", "STORE_KEEPER"), 
  getTailorPerformance
);

/**
 * @route   GET /api/cutting-masters/dashboard/available-tailors
 * @desc    Get available tailors summary
 * @access  CUTTING_MASTER, ADMIN, STORE_KEEPER
 */
router.get(
  "/dashboard/available-tailors", 
  authorize("CUTTING_MASTER", "ADMIN", "STORE_KEEPER"), 
  getAvailableTailors
);

/**
 * @route   GET /api/cutting-masters/dashboard/work-queue
 * @desc    Get cutting master's work queue with filters
 * @query   status, search, date, page, limit
 * @access  CUTTING_MASTER, ADMIN, STORE_KEEPER
 */
router.get(
  "/dashboard/work-queue", 
  authorize("CUTTING_MASTER", "ADMIN", "STORE_KEEPER"), 
  getWorkQueue
);

/**
 * @route   PUT /api/cutting-masters/dashboard/update-status/:workId
 * @desc    Update work status (accepted/cutting-started/cutting-completed)
 * @access  CUTTING_MASTER, ADMIN
 */
router.put(
  "/dashboard/update-status/:workId", 
  authorize("CUTTING_MASTER", "ADMIN"), 
  updateWorkStatus
);

/**
 * @route   GET /api/cutting-masters/dashboard/today-summary
 * @desc    Get today's summary (dueToday, highPriority, completedToday)
 * @access  CUTTING_MASTER, ADMIN, STORE_KEEPER
 */
router.get(
  "/dashboard/today-summary", 
  authorize("CUTTING_MASTER", "ADMIN", "STORE_KEEPER"), 
  getTodaySummary
);

/**
 * @route   GET /api/cutting-masters/dashboard/high-priority
 * @desc    Get high priority works list
 * @access  CUTTING_MASTER, ADMIN, STORE_KEEPER
 */
router.get(
  "/dashboard/high-priority", 
  authorize("CUTTING_MASTER", "ADMIN", "STORE_KEEPER"), 
  getHighPriorityWorks
);

/**
 * @route   GET /api/cutting-masters/dashboard/overdue-works
 * @desc    Get overdue works list
 * @access  CUTTING_MASTER, ADMIN, STORE_KEEPER
 */
router.get(
  "/dashboard/overdue-works", 
  authorize("CUTTING_MASTER", "ADMIN", "STORE_KEEPER"), 
  getOverdueWorks
);

/**
 * @route   GET /api/cutting-masters/dashboard/schedule
 * @desc    Get monthly schedule for calendar
 * @query   year, month
 * @access  CUTTING_MASTER, ADMIN, STORE_KEEPER
 */
router.get(
  "/dashboard/schedule", 
  authorize("CUTTING_MASTER", "ADMIN", "STORE_KEEPER"), 
  getMonthlySchedule
);

/**
 * @route   GET /api/cutting-masters/dashboard/works-by-date
 * @desc    Get works summary for a specific date
 * @query   date
 * @access  CUTTING_MASTER, ADMIN, STORE_KEEPER
 */
router.get(
  "/dashboard/works-by-date", 
  authorize("CUTTING_MASTER", "ADMIN", "STORE_KEEPER"), 
  getWorksByDate
);

/**
 * @route   GET /api/cutting-masters/dashboard/summary
 * @desc    Get complete dashboard summary (all data in one call)
 * @access  CUTTING_MASTER, ADMIN, STORE_KEEPER
 */
router.get(
  "/dashboard/summary", 
  authorize("CUTTING_MASTER", "ADMIN", "STORE_KEEPER"), 
  getDashboardSummary
);

// ============================================
// 🆔 SECTION 4: GET BY ID (Mixed Access)
// ============================================

/**
 * @route   GET /api/cutting-masters/:id
 * @desc    Get cutting master by ID
 * @access  ADMIN (any), STORE_KEEPER (any), CUTTING_MASTER (self only)
 */
router.get("/:id", (req, res, next) => {
  // Special logic for CUTTING_MASTER - can only access their own data
  if (req.user.role === "CUTTING_MASTER" && req.params.id !== req.user._id) {
    return res.status(403).json({
      success: false,
      message: "Access denied. You can only view your own profile."
    });
  }
  // For ADMIN and STORE_KEEPER, allow access
  next();
}, authorize("CUTTING_MASTER", "ADMIN", "STORE_KEEPER"), getCuttingMasterById);

export default router;

