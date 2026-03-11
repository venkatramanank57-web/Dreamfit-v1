// // backend/models/Item.js
// import mongoose from "mongoose";

// const itemSchema = new mongoose.Schema({
//   name: { 
//     type: String, 
//     required: true, 
//     trim: true 
//   },
//   category: { 
//     type: mongoose.Schema.Types.ObjectId, 
//     ref: "Category", 
//     required: true 
//   },
//   // ✅ NEW: Price range fields
//   priceRange: {
//     min: {
//       type: Number,
//       required: true,
//       min: 0,
//       default: 0
//     },
//     max: {
//       type: Number,
//       required: true,
//       min: 0,
//       default: 0
//     }
//   },
//   isActive: { 
//     type: Boolean, 
//     default: true 
//   }
// }, { 
//   timestamps: true,
//   toJSON: { virtuals: true },
//   toObject: { virtuals: true }
// });

// // ✅ Virtual for formatted price range
// itemSchema.virtual('formattedPriceRange').get(function() {
//   return `₹${this.priceRange.min} - ₹${this.priceRange.max}`;
// });

// // ✅ Validate that min <= max
// itemSchema.pre('save', function(next) {
//   if (this.priceRange.min > this.priceRange.max) {
//     next(new Error('Minimum price cannot be greater than maximum price'));
//   }
//   next();
// });

// const Item = mongoose.model("Item", itemSchema);
// export default Item;




import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
{
  name: { 
    type: String, 
    required: true, 
    trim: true 
  },

  category: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Category", 
    required: true 
  },

  // ✅ Price Range
  priceRange: {
    min: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },
    max: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    }
  },

  isActive: { 
    type: Boolean, 
    default: true 
  }

},
{
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
}
);

// ✅ Virtual field for formatted price
itemSchema.virtual("formattedPriceRange").get(function () {
  return `₹${this.priceRange.min} - ₹${this.priceRange.max}`;
});

// ✅ Validation: min price should not exceed max price
itemSchema.pre("save", function () {

  if (!this.priceRange) return;

  if (this.priceRange.min > this.priceRange.max) {
    throw new Error("Minimum price cannot be greater than maximum price");
  }

});

const Item = mongoose.model("Item", itemSchema);

export default Item;