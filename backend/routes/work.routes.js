// // routes/work.routes.js
// import express from 'express';
// import { protect, authorize } from '../middleware/auth.middleware.js';
// import {
//   createWorksFromOrder,
//   getWorks,
//   getWorkById,
//   acceptWork,
//   assignTailor,
//   updateWorkStatus,
//   deleteWork,
//   getWorksByCuttingMaster,
//   getWorksByTailor,
//   getWorkStats,
//   assignCuttingMaster
// } from '../controllers/work.controller.js';

// const router = express.Router();

// // All routes require authentication
// router.use(protect);

// // ============================================
// // SPECIAL ROUTES (must come BEFORE /:id)
// // ============================================

// /**
//  * @route   POST /api/works/create-from-order/:orderId
//  * @desc    Create works for each garment in an order
//  * @access  Admin, Store Keeper
//  */
// router.post(
//   '/create-from-order/:orderId',
//   authorize('ADMIN', 'STORE_KEEPER'),
//   createWorksFromOrder
// );

// /**
//  * @route   PATCH /api/works/:id/assign-cutting-master
//  * @desc    Assign a cutting master to a work (manual assignment)
//  * @access  Admin, Store Keeper, Cutting Master
//  */
// router.patch(
//   '/:id/assign-cutting-master', 
//   authorize('ADMIN', 'STORE_KEEPER', 'CUTTING_MASTER'), 
//   assignCuttingMaster
// );

// /**
//  * @route   GET /api/works/stats
//  * @desc    Get work statistics for dashboard
//  * @access  Admin, Store Keeper
//  */
// router.get(
//   '/stats', 
//   authorize('ADMIN', 'STORE_KEEPER'), 
//   getWorkStats
// );

// /**
//  * @route   GET /api/works/my-works
//  * @desc    Get works assigned to the logged-in cutting master
//  * @access  Cutting Master
//  */
// router.get(
//   '/my-works', 
//   authorize('CUTTING_MASTER'), 
//   getWorksByCuttingMaster
// );

// /**
//  * @route   GET /api/works/tailor-works
//  * @desc    Get works assigned to the logged-in tailor
//  * @access  Tailor
//  */
// router.get(
//   '/tailor-works', 
//   authorize('TAILOR'), 
//   getWorksByTailor
// );

// // ============================================
// // MAIN ROUTES
// // ============================================

// /**
//  * @route   GET /api/works
//  * @desc    Get all works with filters (pagination, status, etc.)
//  * @access  Admin, Store Keeper
//  */
// router.get(
//   '/', 
//   authorize('ADMIN', 'STORE_KEEPER'), 
//   getWorks
// );

// // ============================================
// // DYNAMIC ROUTES (with :id) - MUST come LAST
// // ============================================

// /**
//  * @route   GET /api/works/:id
//  * @desc    Get work by ID
//  * @access  All authenticated users
//  */
// router.get('/:id', getWorkById);

// /**
//  * @route   PATCH /api/works/:id/accept
//  * @desc    Accept a work (changes from pending to accepted)
//  * @access  Cutting Master only
//  */
// router.patch(
//   '/:id/accept', 
//   authorize('CUTTING_MASTER'), 
//   acceptWork
// );

// /**
//  * @route   PATCH /api/works/:id/assign-tailor
//  * @desc    Assign a tailor to a work
//  * @access  Cutting Master only
//  */
// router.patch(
//   '/:id/assign-tailor', 
//   authorize('CUTTING_MASTER'), 
//   assignTailor
// );

// /**
//  * @route   PATCH /api/works/:id/status
//  * @desc    Update work status (cutting-started, cutting-completed, etc.)
//  * @access  Cutting Master only
//  */
// router.patch(
//   '/:id/status', 
//   authorize('CUTTING_MASTER'), 
//   updateWorkStatus
// );

// /**
//  * @route   DELETE /api/works/:id
//  * @desc    Soft delete a work
//  * @access  Admin only
//  */
// router.delete(
//   '/:id', 
//   authorize('ADMIN'), 
//   deleteWork
// );

// export default router;




// routes/work.routes.js - UPDATED WITH DASHBOARD ROUTES
import express from 'express';
import { protect, authorize } from '../middleware/auth.middleware.js';
import {
  createWorksFromOrder,
  getWorks,
  getWorkById,
  acceptWork,
  assignTailor,
  updateWorkStatus,
  deleteWork,
  getWorksByCuttingMaster,
  getWorksByTailor,
  getWorkStats,
  assignCuttingMaster,
  // ✅ NEW: Import dashboard functions
  getDashboardWorkStats,
  getRecentWorks,
  getWorkStatusBreakdown,
  recalculateTailorStats,
  recalculateAllTailorStats,
 getCuttingMasterDashboardStats,
 getTailorPerformanceForMaster,
 getCalendarWorkData,
 getTodaySummaryForMaster
} from '../controllers/work.controller.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// ============================================
// ✅ DASHBOARD ROUTES (NEW)
// ============================================

/**
 * @route   GET /api/works/dashboard/stats
 * @desc    Get work statistics for dashboard (with date filters)
 * @query   ?period=today|week|month&startDate=...&endDate=...
 * @access  Admin, Store Keeper
 */
router.get(
  '/dashboard/stats',
  authorize('ADMIN', 'STORE_KEEPER'),
  getDashboardWorkStats
);

/**
 * @route   GET /api/works/dashboard/recent
 * @desc    Get recent works for dashboard
 * @query   ?limit=5&period=today|week|month&startDate=...&endDate=...
 * @access  Admin, Store Keeper
 */
router.get(
  '/dashboard/recent',
  authorize('ADMIN', 'STORE_KEEPER'),
  getRecentWorks
);

/**
 * @route   GET /api/works/dashboard/breakdown
 * @desc    Get work status breakdown for pie chart
 * @query   ?period=today|week|month&startDate=...&endDate=...
 * @access  Admin, Store Keeper
 */
router.get(
  '/dashboard/breakdown',
  authorize('ADMIN', 'STORE_KEEPER'),
  getWorkStatusBreakdown
);

// ============================================
// ✅ ADMIN UTILITY ROUTES (for fixing stats)
// ============================================

/**
 * @route   POST /api/works/recalculate-tailor-stats/:tailorId
 * @desc    Recalculate and update stats for a specific tailor
 * @access  Admin only
 */
router.post(
  '/recalculate-tailor-stats/:tailorId',
  authorize('ADMIN'),
  recalculateTailorStats
);

/**
 * @route   POST /api/works/recalculate-all-tailor-stats
 * @desc    Recalculate and update stats for ALL tailors
 * @access  Admin only
 */
router.post(
  '/recalculate-all-tailor-stats',
  authorize('ADMIN'),
  recalculateAllTailorStats
);

// ============================================
// SPECIAL ROUTES (must come BEFORE /:id)
// ============================================

/**
 * @route   POST /api/works/create-from-order/:orderId
 * @desc    Create works for each garment in an order
 * @access  Admin, Store Keeper
 */
router.post(
  '/create-from-order/:orderId',
  authorize('ADMIN', 'STORE_KEEPER'),
  createWorksFromOrder
);

/**
 * @route   PATCH /api/works/:id/assign-cutting-master
 * @desc    Assign a cutting master to a work (manual assignment)
 * @access  Admin, Store Keeper, Cutting Master
 */
router.patch(
  '/:id/assign-cutting-master', 
  authorize('ADMIN', 'STORE_KEEPER', 'CUTTING_MASTER'), 
  assignCuttingMaster
);

/**
 * @route   GET /api/works/stats
 * @desc    Get work statistics for dashboard
 * @access  Admin, Store Keeper
 */
router.get(
  '/stats', 
  authorize('ADMIN', 'STORE_KEEPER'), 
  getWorkStats
);

/**
 * @route   GET /api/works/my-works
 * @desc    Get works assigned to the logged-in cutting master
 * @access  Cutting Master
 */
router.get(
  '/my-works', 
  authorize('CUTTING_MASTER'), 
  getWorksByCuttingMaster
);

/**
 * @route   GET /api/works/tailor-works
 * @desc    Get works assigned to the logged-in tailor
 * @access  Tailor
 */
router.get(
  '/tailor-works', 
  authorize('TAILOR'), 
  getWorksByTailor
);

// ============================================
// MAIN ROUTES
// ============================================

/**
 * @route   GET /api/works
 * @desc    Get all works with filters (pagination, status, etc.)
 * @access  Admin, Store Keeper
 */
router.get(
  '/', 
  authorize('ADMIN', 'STORE_KEEPER'), 
  getWorks
);

// ============================================
// DYNAMIC ROUTES (with :id) - MUST come LAST
// ============================================

/**
 * @route   GET /api/works/:id
 * @desc    Get work by ID
 * @access  All authenticated users
 */
router.get('/:id', getWorkById);

/**
 * @route   PATCH /api/works/:id/accept
 * @desc    Accept a work (changes from pending to accepted)
 * @access  Cutting Master only
 */
router.patch(
  '/:id/accept', 
  authorize('CUTTING_MASTER'), 
  acceptWork
);

/**
 * @route   PATCH /api/works/:id/assign-tailor
 * @desc    Assign a tailor to a work
 * @access  Cutting Master only
 */
router.patch(
  '/:id/assign-tailor', 
  authorize('CUTTING_MASTER'), 
  assignTailor
);

/**
 * @route   PATCH /api/works/:id/status
 * @desc    Update work status (cutting-started, cutting-completed, etc.)
 * @access  Cutting Master only
 */
router.patch(
  '/:id/status', 
  authorize('CUTTING_MASTER'), 
  updateWorkStatus
);

/**
 * @route   DELETE /api/works/:id
 * @desc    Soft delete a work
 * @access  Admin only
 */
router.delete(
  '/:id', 
  authorize('ADMIN'), 
  deleteWork
);



//Cutting Master Dashbort 
// ============================================
// ✅ CUTTING MASTER DASHBOARD ROUTES
// ============================================
router.get('/dashboard/master-stats', getCuttingMasterDashboardStats);

router.get('/dashboard/tailors', getTailorPerformanceForMaster);

router.get('/dashboard/calendar', getCalendarWorkData);

router.get('/dashboard/today', getTodaySummaryForMaster);





export default router;