import mongoose from "mongoose";

// ✅ PAYMENT ENTRY SCHEMA - Store field removed (since no Store model exists)
const paymentEntrySchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  method: { 
    type: String, 
    enum: ["cash", "upi", "bank-transfer", "card"], 
    default: "cash" 
  },
type: { 
  type: String, 
  enum: ["advance", "partial", "full", "final-settlement", "refund", "extra"], 
  default: "advance" 
},
  referenceNumber: { type: String, default: "" },
  date: { type: Date, default: Date.now },
  notes: { type: String, default: "" }
  // ✅ STORE FIELD REMOVED - No Store model exists
}, { _id: true });

// ✅ PRICE SUMMARY SCHEMA
const priceSummarySchema = new mongoose.Schema({
  totalMin: { type: Number, default: 0 },
  totalMax: { type: Number, default: 0 },
}, { _id: false });

// ✅ PAYMENT SUMMARY SCHEMA
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

// ✅ MAIN ORDER SCHEMA
const orderSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: [true, "Customer reference is required"],
  },
  orderId: { type: String, unique: true },
  orderDate: { type: Date, default: Date.now },
  deliveryDate: { type: Date, required: [true, "Delivery date is required"] },
  status: {
    type: String,
    enum: ["draft", "confirmed", "in-progress", "delivered", "cancelled"],
    default: "draft",
    index: true
  },
  garments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Garment" }],
  specialNotes: { type: String, default: "" },
  priceSummary: { type: priceSummarySchema, default: () => ({ totalMin: 0, totalMax: 0 }) },
  payments: [paymentEntrySchema],
  advancePayment: {
    amount: { type: Number, default: 0 },
    method: { type: String, default: "cash" },
    date: { type: Date, default: Date.now }
  },
  paymentSummary: { type: paymentSummarySchema, default: () => ({
    totalPaid: 0,
    paymentCount: 0,
    paymentStatus: "pending"
  }) },
  balanceAmount: { type: Number, default: 0 },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Created by is required"],
  },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

// ============================================
// ✅ COMPLETELY FIXED PRE-SAVE HOOK
// ============================================
orderSchema.pre('save', async function() {
  try {
    console.log("\n🔧 ===== ORDER PRE-SAVE HOOK STARTED =====");
    console.log("📦 Order ID:", this.orderId);
    console.log("👤 Customer:", this.customer);
    console.log("📅 Delivery Date:", this.deliveryDate);
    console.log("💰 Price Summary:", JSON.stringify(this.priceSummary));
    console.log("💳 Payments count:", this.payments?.length || 0);
    console.log("👤 Created By:", this.createdBy);

    // Check required fields
    if (!this.customer) throw new Error("Customer is required");
    if (!this.deliveryDate) throw new Error("Delivery date is required");
    if (!this.createdBy) throw new Error("Created by is required");

    // Generate Order ID if not present
    if (!this.orderId) {
      const date = new Date();
      const dateStr = `${String(date.getDate()).padStart(2, '0')}${String(date.getMonth() + 1).padStart(2, '0')}${date.getFullYear()}`;
      this.orderId = `${dateStr}-${Date.now().toString().slice(-4)}`;
      console.log("📋 Generated Order ID:", this.orderId);
    }

    // Process payments
    const totalMax = Number(this.priceSummary?.totalMax) || 0;
    
    if (this.payments && this.payments.length > 0) {
      console.log("💰 Processing", this.payments.length, "payments");
      
      const totalPaid = this.payments.reduce((sum, p) => {
        const amount = Number(p.amount) || 0;
        return sum + amount;
      }, 0);
      
      const lastPayment = this.payments[this.payments.length - 1];
      
      let paymentStatus = 'pending';
      if (totalPaid >= totalMax) {
        paymentStatus = totalPaid > totalMax ? 'overpaid' : 'paid';
      } else if (totalPaid > 0) {
        paymentStatus = 'partial';
      }
      
      this.paymentSummary = {
        totalPaid,
        lastPaymentDate: lastPayment?.date || new Date(),
        lastPaymentAmount: lastPayment?.amount || 0,
        paymentCount: this.payments.length,
        paymentStatus
      };
      
      this.advancePayment = {
        amount: this.payments[0]?.amount || 0,
        method: this.payments[0]?.method || 'cash',
        date: this.payments[0]?.date || new Date()
      };
      
      this.balanceAmount = totalMax - totalPaid;
      console.log(`💰 Total Paid: ${totalPaid}, Balance: ${this.balanceAmount}`);
    } else {
      this.balanceAmount = totalMax;
      this.paymentSummary.paymentStatus = 'pending';
    }

    console.log("✅ Pre-save hook completed successfully");
    
  } catch (error) {
    console.error("\n❌ PRE-SAVE HOOK ERROR:");
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    
    throw new Error(`Order validation failed: ${error.message}`);
  }
});

// ============================================
// ✅ POST-SAVE HOOK for logging
// ============================================
orderSchema.post('save', function(doc) {
  console.log(`✅ Order saved to database: ${doc.orderId}`);
});

// ============================================
// ✅ ERROR HANDLING for duplicate keys
// ============================================
orderSchema.post('save', function(error, doc, next) {
  if (error.name === 'MongoServerError' || error.name === 'MongoError') {
    if (error.code === 11000) {
      next(new Error('Order ID already exists. Please try again.'));
    } else {
      next(error);
    }
  } else {
    next(error);
  }
});

// ============================================
// ✅ INDEXES
// ============================================
orderSchema.index({ orderId: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ customer: 1 });
orderSchema.index({ 'paymentSummary.paymentStatus': 1 });
orderSchema.index({ orderDate: -1 });
orderSchema.index({ createdAt: -1 });

// ============================================
// ✅ VIRTUAL FIELDS
// ============================================
orderSchema.virtual('isFullyPaid').get(function() {
  return this.balanceAmount <= 0;
});

orderSchema.virtual('paymentProgress').get(function() {
  const total = this.priceSummary?.totalMax || 0;
  const paid = this.paymentSummary?.totalPaid || 0;
  return total > 0 ? Math.round((paid / total) * 100) : 0;
});

// Enable virtuals in JSON
orderSchema.set('toJSON', { 
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.__v;
    return ret;
  }
});

orderSchema.set('toObject', { 
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.__v;
    return ret;
  }
});

// ============================================
// ✅ EXPORT MODEL
// ============================================
const Order = mongoose.model("Order", orderSchema);
export default Order;