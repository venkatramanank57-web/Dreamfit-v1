// backend/routes/customer.routes.js
import express from "express";
import { 
  // Search functions
  getCustomerByPhone,
  getCustomerByCustomerId,
  
  // Create function
  createCustomer,
  
  // List functions
  getAllCustomers,
  getCustomersWithPaymentSummary,
  
  // Single customer function
  getCustomerById,
  
  // Update/Delete functions
  updateCustomer,
  deleteCustomer,
  
  // Payment/Order specific functions
  getCustomerPayments,
  getCustomerOrders,
  getCustomerPaymentStats,
  getCustomerPaymentTrends, // ✅ Now this exists in your controller
  
  // Statistics function
  getCustomerStats
} from "../controllers/customer.controller.js";
import { protect, authorize } from "../middleware/auth.middleware.js";

console.log("📁 customer.routes.js is loading...");
console.log("   ✅ All functions imported successfully");

const router = express.Router();

// All routes are protected
router.use(protect);

// ==================== SEARCH ROUTES ====================

// 🔍 Search by Phone Number
router.get("/search/phone/:phone", authorize("ADMIN", "STORE_KEEPER"), getCustomerByPhone);

// 🔍 Search by Customer ID (CUST-2024-00001 format)
router.get("/search/id/:customerId", authorize("ADMIN", "STORE_KEEPER"), getCustomerByCustomerId);

// ==================== LIST ROUTES ====================

// 📋 Get all customers (basic info)
router.get("/all", authorize("ADMIN", "STORE_KEEPER"), getAllCustomers);

// 📋 Get all customers with payment summary
router.get("/with-payments", authorize("ADMIN", "STORE_KEEPER"), getCustomersWithPaymentSummary);

// 📊 Get customer statistics (Admin only)
router.get("/stats", authorize("ADMIN"), getCustomerStats);

// ==================== CUSTOMER PAYMENT/ORDER ROUTES ====================

// 💰 Get all payments for a customer
router.get("/:id/payments", authorize("ADMIN", "STORE_KEEPER"), getCustomerPayments);

// 📦 Get all orders for a customer
router.get("/:id/orders", authorize("ADMIN", "STORE_KEEPER"), getCustomerOrders);

// 📊 Get payment statistics for a customer
router.get("/:id/payment-stats", authorize("ADMIN", "STORE_KEEPER"), getCustomerPaymentStats);

// 📈 Get payment trends for a customer
router.get("/:id/payment-trends", authorize("ADMIN"), getCustomerPaymentTrends);

// ==================== SINGLE CUSTOMER ROUTES ====================

// 👤 Get customer by MongoDB ID (with payments and orders)
router.get("/:id", authorize("ADMIN", "STORE_KEEPER"), getCustomerById);

// 🆕 Create new customer
router.post("/create", authorize("ADMIN", "STORE_KEEPER"), createCustomer);

// ✏️ Update customer
router.put("/:id", authorize("ADMIN", "STORE_KEEPER"), updateCustomer);

// ❌ Delete customer (Admin only)
router.delete("/:id", authorize("ADMIN"), deleteCustomer);

console.log("   ✅ Routes added successfully:");
console.log("      🔍 GET  /search/phone/:phone");
console.log("      🔍 GET  /search/id/:customerId");
console.log("      📋 GET  /all");
console.log("      📋 GET  /with-payments");
console.log("      📊 GET  /stats");
console.log("      💰 GET  /:id/payments");
console.log("      📦 GET  /:id/orders");
console.log("      📊 GET  /:id/payment-stats");
console.log("      📈 GET  /:id/payment-trends");
console.log("      👤 GET  /:id");
console.log("      🆕 POST /create");
console.log("      ✏️ PUT  /:id");
console.log("      ❌ DEL  /:id");

export default router;