// backend/models/Customer.js
import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
  customerId: {
    type: String,
    unique: true,
    index: true,
  },
  salutation: {
    type: String,
    enum: ["Mr.", "Mrs.", "Ms.", "Dr."],
    default: "Mr."
  },
  firstName: {
    type: String,
    required: [true, "First name is required"],
    trim: true
  },
  lastName: {
    type: String,
    trim: true
  },
  dateOfBirth: {
    type: Date,
    default: null
  },
  phone: {
    type: String,
    required: [true, "Phone number is required"],
    unique: true,
    trim: true
  },
  whatsappNumber: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  addressLine1: {
    type: String,
    required: [true, "Address is required"],
    trim: true
  },
  addressLine2: {
    type: String,
    trim: true
  },
  city: {
    type: String,
    trim: true
  },
  state: {
    type: String,
    trim: true
  },
  pincode: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    trim: true
  },
  name: {
    type: String,
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  totalOrders: {
    type: Number,
    default: 0
  }
}, { 
  timestamps: true,
  validateBeforeSave: false 
});

// Pre-save hook to generate customerId and computed fields
customerSchema.pre("save", async function() {
  try {
    console.log("🔧 Customer pre-save hook triggered for:", this.firstName);
    
    // Generate customerId if not exists
    if (!this.customerId) {
      const count = await mongoose.model("Customer").countDocuments();
      const year = new Date().getFullYear();
      const sequential = String(count + 1).padStart(5, "0");
      this.customerId = `CUST-${year}-${sequential}`;
      console.log(`✅ Generated customerId: ${this.customerId}`);
    }

    // Set computed name field
    this.name = `${this.salutation || ''} ${this.firstName || ''} ${this.lastName || ''}`.trim();
    
    // Set computed address field
    const addressParts = [
      this.addressLine1,
      this.addressLine2,
      this.city,
      this.state,
      this.pincode
    ].filter(Boolean);
    this.address = addressParts.join(', ');

    await this.validate();
    console.log("✅ Customer pre-save completed successfully");
    
  } catch (error) {
    console.error("❌ Error in customer pre-save hook:", error);
    throw error;
  }
});

// Virtual for fullName (alternative to computed name field)
customerSchema.virtual('fullName').get(function() {
  return `${this.salutation || ''} ${this.firstName || ''} ${this.lastName || ''}`.trim();
});

// Ensure virtuals are included in JSON/Object output
customerSchema.set('toJSON', { virtuals: true });
customerSchema.set('toObject', { virtuals: true });

// Create or retrieve model (prevents model recompilation error in development)
const Customer = mongoose.models.Customer || mongoose.model("Customer", customerSchema);

export default Customer;