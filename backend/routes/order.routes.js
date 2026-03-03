import express from "express";
import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  updateOrderStatus,
  deleteOrder,
  getOrderStats,
  // ✅ Add these new payment-related functions
  addPaymentToOrder,
  getOrderPayments
} from "../controllers/order.controller.js";
import { protect, authorize } from "../middleware/auth.middleware.js";

const router = express.Router();

// Debug middleware to track API hits
router.use((req, res, next) => {
  console.log(`📡 Order Route: ${req.method} ${req.originalUrl}`);
  next();
});

// All routes are PROTECTED (Must be logged in)
router.use(protect);

/**
 * @route   GET /api/orders/stats
 * @desc    Get order statistics
 * @access  Admin, Store Keeper
 */
router.get("/stats", authorize("ADMIN", "STORE_KEEPER"), getOrderStats);

/**
 * @route   POST /api/orders
 * @desc    Create new order (with optional payments)
 * @access  Admin, Store Keeper
 */
router.post("/", authorize("ADMIN", "STORE_KEEPER"), createOrder);

/**
 * @route   GET /api/orders
 * @desc    Get all orders with filters
 * @access  Admin, Store Keeper, Cutting Master
 */
router.get("/", authorize("ADMIN", "STORE_KEEPER", "CUTTING_MASTER"), getAllOrders);

// ===== PAYMENT ROUTES =====

/**
 * @route   POST /api/orders/:id/payments
 * @desc    Add payment to existing order
 * @access  Admin, Store Keeper ONLY
 */
router.post("/:id/payments", authorize("ADMIN", "STORE_KEEPER"), addPaymentToOrder);

/**
 * @route   GET /api/orders/:id/payments
 * @desc    Get all payments for an order
 * @access  Admin, Store Keeper, Cutting Master (VIEW ONLY)
 */
router.get("/:id/payments", authorize("ADMIN", "STORE_KEEPER", "CUTTING_MASTER"), getOrderPayments);

// ===== ORDER DETAIL ROUTES =====

/**
 * @route   GET /api/orders/:id
 * @desc    Get specific order details (includes payments & works)
 * @access  Admin, Store Keeper, Cutting Master
 */
router.get("/:id", authorize("ADMIN", "STORE_KEEPER", "CUTTING_MASTER"), getOrderById);

/**
 * @route   PUT /api/orders/:id
 * @desc    Update order details
 * @access  Admin, Store Keeper
 */
router.put("/:id", authorize("ADMIN", "STORE_KEEPER"), updateOrder);

/**
 * @route   PATCH /api/orders/:id/status
 * @desc    Update order status
 * @access  Admin, Store Keeper
 */
router.patch("/:id/status", authorize("ADMIN", "STORE_KEEPER"), updateOrderStatus);

/**
 * @route   DELETE /api/orders/:id
 * @desc    Delete order (soft delete)
 * @access  Admin ONLY
 */
router.delete("/:id", authorize("ADMIN"), deleteOrder);

export default router;