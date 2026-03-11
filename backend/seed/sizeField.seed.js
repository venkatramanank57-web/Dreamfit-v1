import mongoose from "mongoose";
import dotenv from "dotenv";
import SizeField from "../models/SizeField.js";

dotenv.config();

const seedSizeFields = async () => {
  try {

    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");

    const sizeFields = [
      { name: "chest", displayName: "Chest", category: "upper", order: 1 },
      { name: "shoulder", displayName: "Shoulder", category: "upper", order: 2 },
      { name: "sleeveLength", displayName: "Sleeve Length", category: "upper", order: 3 },
      { name: "neck", displayName: "Neck", category: "upper", order: 4 },
      { name: "shirtLength", displayName: "Shirt Length", category: "upper", order: 5 },

      { name: "waist", displayName: "Waist", category: "lower", order: 6 },
      { name: "hip", displayName: "Hip", category: "lower", order: 7 },
      { name: "thigh", displayName: "Thigh", category: "lower", order: 8 },
      { name: "knee", displayName: "Knee", category: "lower", order: 9 },
      { name: "bottom", displayName: "Bottom", category: "lower", order: 10 },

      { name: "pantLength", displayName: "Pant Length", category: "lower", order: 11 },
      { name: "inseam", displayName: "Inseam", category: "lower", order: 12 },

      { name: "fullLength", displayName: "Full Length", category: "full", order: 13 },
      { name: "armHole", displayName: "Arm Hole", category: "upper", order: 14 },
      { name: "wrist", displayName: "Wrist", category: "upper", order: 15 }
    ];

    for (const field of sizeFields) {

      const exists = await SizeField.findOne({ name: field.name });

      if (!exists) {
        const newField = new SizeField(field);
        await newField.save();
      }

    }

    console.log("🎉 Size fields seeded successfully");
    process.exit();

  } catch (error) {

    console.error("❌ Error seeding size fields:", error);
    process.exit(1);

  }
};

seedSizeFields();