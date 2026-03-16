// // routes/paymentRoutes.js
// import express from "express";
// import {
//   createPayment,
//   getOrderPayments,
//   getPayment,
//   updatePayment,
//   deletePayment,
//   getPaymentStats
// } from "../controllers/payment.controller.js";
// import { protect, authorize } from "../middleware/auth.middleware.js";

// const router = express.Router();

// // Debug middleware
// router.use((req, res, next) => {
//   console.log(`💰 Payment Route: ${req.method} ${req.originalUrl}`);
//   next();
// });

// // All routes are PROTECTED (Must be logged in)
// router.use(protect);

// /**
//  * @route   GET /api/payments/stats
//  * @desc    Get payment statistics
//  * @access  Admin, Store Keeper ONLY
//  */
// router.get("/stats", authorize("ADMIN", "STORE_KEEPER"), getPaymentStats);

// /**
//  * @route   GET /api/payments/order/:orderId
//  * @desc    Get all payments for an order
//  * @access  Admin, Store Keeper, Cutting Master (VIEW ONLY - can see payments)
//  */
// router.get("/order/:orderId", authorize("ADMIN", "STORE_KEEPER", "CUTTING_MASTER"), getOrderPayments);

// /**
//  * @route   GET /api/payments/:id
//  * @desc    Get single payment details
//  * @access  Admin, Store Keeper, Cutting Master (VIEW ONLY)
//  */
// router.get("/:id", authorize("ADMIN", "STORE_KEEPER", "CUTTING_MASTER"), getPayment);

// /**
//  * @route   POST /api/payments
//  * @desc    Create new payment
//  * @access  Admin, Store Keeper ONLY
//  */
// router.post("/", authorize("ADMIN", "STORE_KEEPER"), createPayment);

// /**
//  * @route   PUT /api/payments/:id
//  * @desc    Update payment details
//  * @access  Admin, Store Keeper ONLY
//  */
// router.put("/:id", authorize("ADMIN", "STORE_KEEPER"), updatePayment);

// /**
//  * @route   DELETE /api/payments/:id
//  * @desc    Delete payment (soft delete)
//  * @access  Admin ONLY (Store keeper cannot delete)
//  */
// router.delete("/:id", authorize("ADMIN"), deletePayment);

// export default router;


// routes/paymentRoutes.js - FIXED VERSION
import express from "express";
import * as paymentController from "../controllers/payment.controller.js";  // ← CHANGE THIS LINE
import { protect, authorize } from "../middleware/auth.middleware.js";

const router = express.Router();

// Debug middleware
router.use((req, res, next) => {
  console.log(`💰 Payment Route: ${req.method} ${req.originalUrl}`);
  next();
});

// All routes are PROTECTED (Must be logged in)
router.use(protect);

/**
 * @route   GET /api/payments/stats
 * @desc    Get payment statistics
 * @access  Admin, Store Keeper ONLY
 */
router.get("/stats", authorize("ADMIN", "STORE_KEEPER"), paymentController.getPaymentStats);

/**
 * @route   GET /api/payments/order/:orderId
 * @desc    Get all payments for an order
 * @access  Admin, Store Keeper, Cutting Master (VIEW ONLY - can see payments)
 */
router.get("/order/:orderId", authorize("ADMIN", "STORE_KEEPER", "CUTTING_MASTER"), paymentController.getOrderPayments);

/**
 * @route   GET /api/payments/:id
 * @desc    Get single payment details
 * @access  Admin, Store Keeper, Cutting Master (VIEW ONLY)
 */
router.get("/:id", authorize("ADMIN", "STORE_KEEPER", "CUTTING_MASTER"), paymentController.getPayment);

/**
 * @route   POST /api/payments
 * @desc    Create new payment
 * @access  Admin, Store Keeper ONLY
 */
router.post("/", authorize("ADMIN", "STORE_KEEPER"), paymentController.createPayment);

/**
 * @route   PUT /api/payments/:id
 * @desc    Update payment details
 * @access  Admin, Store Keeper ONLY
 */
router.put("/:id", authorize("ADMIN", "STORE_KEEPER"), paymentController.updatePayment);

/**
 * @route   DELETE /api/payments/:id
 * @desc    Delete payment (soft delete)
 * @access  Admin ONLY (Store keeper cannot delete)
 */
router.delete("/:id", authorize("ADMIN"), paymentController.deletePayment);

export default router;