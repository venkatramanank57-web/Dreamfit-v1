// import express from "express";
// import {
//   createTailor,
//   getAllTailors,
//   getTailorById,
//   updateTailor,
//   deleteTailor,
//   updateLeaveStatus,
//   getTailorStats
// } from "../controllers/tailor.controller.js";
// import { protect, authorize } from "../middleware/auth.middleware.js";

// const router = express.Router();

// // Debug middleware
// router.use((req, res, next) => {
//   console.log(`📡 Tailor Route: ${req.method} ${req.originalUrl}`);
//   next();
// });

// // All routes require authentication
// router.use(protect);

// /**
//  * @route   POST /api/tailors
//  * @desc    Create new tailor
//  * @access  Admin, Store Keeper
//  */
// router.post("/", authorize("ADMIN", "STORE_KEEPER"), createTailor);

// /**
//  * @route   GET /api/tailors/stats
//  * @desc    Get tailor statistics
//  * @access  Admin, Store Keeper, Cutting Master
//  */
// router.get("/stats", authorize("ADMIN", "STORE_KEEPER", "CUTTING_MASTER"), getTailorStats);

// /**
//  * @route   GET /api/tailors
//  * @desc    Get all tailors
//  * @access  Admin, Store Keeper, Cutting Master
//  */
// router.get("/", authorize("ADMIN", "STORE_KEEPER", "CUTTING_MASTER"), getAllTailors);

// /**
//  * @route   GET /api/tailors/:id
//  * @desc    Get tailor by ID
//  * @access  Admin, Store Keeper, Cutting Master, Tailor (self)
//  */
// router.get("/:id", authorize("ADMIN", "STORE_KEEPER", "CUTTING_MASTER", "TAILOR"), getTailorById);

// /**
//  * @route   PUT /api/tailors/:id
//  * @desc    Update tailor
//  * @access  Admin, Store Keeper, Tailor (self - limited fields)
//  */
// router.put("/:id", authorize("ADMIN", "STORE_KEEPER", "TAILOR"), updateTailor);

// /**
//  * @route   PATCH /api/tailors/:id/leave
//  * @desc    Update leave status
//  * @access  Admin, Store Keeper, Cutting Master, Tailor (self)
//  */
// router.patch("/:id/leave", authorize("ADMIN", "STORE_KEEPER", "CUTTING_MASTER", "TAILOR"), updateLeaveStatus);

// /**
//  * @route   DELETE /api/tailors/:id
//  * @desc    Delete tailor
//  * @access  Admin
//  */
// router.delete("/:id", authorize("ADMIN"), deleteTailor);

// export default router;






import express from "express";
import {
  createTailor,
  getAllTailors,
  getTailorById,
  updateTailor,
  deleteTailor,
  updateLeaveStatus,
  getTailorStats,
  // ✅ NEW: Import dashboard functions
  getTopTailors,
  getTailorPerformance,
  fixAllTailorStats
} from "../controllers/tailor.controller.js";
import { protect, authorize } from "../middleware/auth.middleware.js";

const router = express.Router();

// Debug middleware
router.use((req, res, next) => {
  console.log(`📡 Tailor Route: ${req.method} ${req.originalUrl}`);
  next();
});

// All routes require authentication
router.use(protect);

// ============================================
// ✅ DASHBOARD ROUTES (NEW)
// ============================================

/**
 * @route   GET /api/tailors/stats
 * @desc    Get tailor statistics for dashboard cards
 * @access  Admin, Store Keeper, Cutting Master
 */
router.get("/stats", authorize("ADMIN", "STORE_KEEPER", "CUTTING_MASTER"), getTailorStats);

/**
 * @route   GET /api/tailors/top
 * @desc    Get top performing tailors for dashboard
 * @query   ?limit=5&period=month
 * @access  Admin, Store Keeper
 */
router.get("/top", authorize("ADMIN", "STORE_KEEPER"), getTopTailors);

/**
 * @route   GET /api/tailors/performance
 * @desc    Get tailor performance data for dashboard
 * @query   ?period=month&tailorId=...
 * @access  Admin, Store Keeper
 */
router.get("/performance", authorize("ADMIN", "STORE_KEEPER"), getTailorPerformance);

// ============================================
// ✅ ADMIN UTILITY ROUTES
// ============================================

/**
 * @route   POST /api/tailors/fix-stats
 * @desc    Fix all tailor stats (admin only)
 * @access  Admin
 */
router.post("/fix-stats", authorize("ADMIN"), fixAllTailorStats);

// ============================================
// ✅ MAIN TAILOR ROUTES
// ============================================

/**
 * @route   POST /api/tailors
 * @desc    Create new tailor
 * @access  Admin, Store Keeper
 */
router.post("/", authorize("ADMIN", "STORE_KEEPER"), createTailor);

/**
 * @route   GET /api/tailors
 * @desc    Get all tailors (with filters)
 * @access  Admin, Store Keeper, Cutting Master
 */
router.get("/", authorize("ADMIN", "STORE_KEEPER", "CUTTING_MASTER"), getAllTailors);

// ============================================
// ✅ DYNAMIC ROUTES (with :id)
// ============================================

/**
 * @route   GET /api/tailors/:id
 * @desc    Get tailor by ID
 * @access  Admin, Store Keeper, Cutting Master, Tailor (self)
 */
router.get("/:id", authorize("ADMIN", "STORE_KEEPER", "CUTTING_MASTER", "TAILOR"), getTailorById);

/**
 * @route   PUT /api/tailors/:id
 * @desc    Update tailor
 * @access  Admin, Store Keeper, Tailor (self - limited fields)
 */
router.put("/:id", authorize("ADMIN", "STORE_KEEPER", "TAILOR"), updateTailor);

/**
 * @route   PATCH /api/tailors/:id/leave
 * @desc    Update leave status
 * @access  Admin, Store Keeper, Cutting Master, Tailor (self)
 */
router.patch("/:id/leave", authorize("ADMIN", "STORE_KEEPER", "CUTTING_MASTER", "TAILOR"), updateLeaveStatus);

/**
 * @route   DELETE /api/tailors/:id
 * @desc    Delete tailor (soft delete)
 * @access  Admin
 */
router.delete("/:id", authorize("ADMIN"), deleteTailor);

export default router;