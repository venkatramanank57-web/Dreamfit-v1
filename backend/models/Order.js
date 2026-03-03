import mongoose from "mongoose";

const advancePaymentSchema = new mongoose.Schema({
  amount: { type: Number, default: 0 },
  method: { 
    type: String, 
    enum: ["cash", "upi", "bank-transfer", "card"],
    default: "cash" 
  },
  date: { type: Date, default: Date.now },
}, { _id: false });

const priceSummarySchema = new mongoose.Schema({
  totalMin: { type: Number, default: 0 },
  totalMax: { type: Number, default: 0 },
}, { _id: false });

// ✅ NEW: Payment Summary Schema
const paymentSummarySchema = new mongoose.Schema({
  totalPaid: { type: Number, default: 0 },
  lastPaymentDate: Date,
  lastPaymentAmount: Number,
  paymentCount: { type: Number, default: 0 },
  paymentStatus: { 
    type: String, 
    enum: ["pending", "partial", "paid", "overpaid"],
    default: "pending" 
  }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  // ✅ Order ID (Format: DDMMYYYY-001)
  orderId: {
    type: String,
    unique: true,
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: [true, "Customer reference is required"],
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
  deliveryDate: {
    type: Date,
    required: [true, "Delivery date is required"],
  },
  // ✅ Logic: Initial status is 'draft' as per your requirement
  status: {
    type: String,
    enum: ["draft", "confirmed", "in-progress", "delivered", "cancelled"],
    default: "draft",
    index: true
  },
  garments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Garment",
  }],
  specialNotes: {
    type: String,
    default: "",
  },
  priceSummary: {
    type: priceSummarySchema,
    default: () => ({})
  },
  advancePayment: {
    type: advancePaymentSchema,
    default: () => ({})
  },
  // ✅ NEW: Payment Summary field (for multiple payments)
  paymentSummary: {
    type: paymentSummarySchema,
    default: () => ({})
  },
  balanceAmount: {
    type: Number,
    default: 0,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Created by is required"],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { 
  timestamps: true,
});

// ✅ MODERN ASYNC PRE-SAVE (No 'next' parameter)
orderSchema.pre('save', async function() {
  try {
    console.log("🔧 Order pre-save hook triggered");
    console.log("📋 Document state:", {
      hasCreatedBy: !!this.createdBy,
      createdByValue: this.createdBy,
      customer: this.customer,
      deliveryDate: this.deliveryDate
    });

    // 1. Generate Order ID if not exists
    if (!this.orderId) {
      console.log("📝 Generating new Order ID...");
      const date = new Date();
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      
      // Daily sequence count
      const count = await mongoose.model("Order").countDocuments({
        createdAt: { $gte: startOfDay, $lte: endOfDay }
      });
      
      const sequence = String(count + 1).padStart(3, '0');
      this.orderId = `${day}${month}${year}-${sequence}`;
      console.log(`🆔 Generated Order ID: ${this.orderId}`);
    }

    // 2. Logic: Balance Amount Calculation (using advancePayment for backward compatibility)
    if (this.priceSummary && this.advancePayment) {
      const totalAmount = this.priceSummary.totalMax || 0;
      const advanceAmount = this.advancePayment.amount || 0;
      this.balanceAmount = totalAmount - advanceAmount;
      console.log(`💰 Balance calculated: ${this.balanceAmount}`);
    }

    // 3. Update paymentSummary based on advancePayment (for backward compatibility)
    if (this.advancePayment && this.advancePayment.amount > 0) {
      this.paymentSummary = {
        totalPaid: this.advancePayment.amount,
        lastPaymentDate: this.advancePayment.date || new Date(),
        lastPaymentAmount: this.advancePayment.amount,
        paymentCount: 1,
        paymentStatus: this.balanceAmount <= 0 ? 'paid' : 'partial'
      };
    }
    
  } catch (error) {
    console.error("❌ Error in Order pre-save hook:", error);
    throw error;
  }
});

// ✅ Indexing for fast search
orderSchema.index({ orderId: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ customer: 1 });
orderSchema.index({ createdBy: 1 });
orderSchema.index({ 'paymentSummary.paymentStatus': 1 }); // ✅ New index

const Order = mongoose.model("Order", orderSchema);
console.log("✅ Order model registered");

export default Order;