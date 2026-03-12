// backend/seed/cuttingmaster.seed.js

import mongoose from "mongoose";
import dotenv from "dotenv";
import CuttingMaster from "../models/CuttingMaster.js";

dotenv.config();

const seedCuttingMaster = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB Connected");

    // check already exists
    const existing = await CuttingMaster.findOne({
      email: "cuttingmaster@test.com"
    });

    if (existing) {
      console.log("⚠️ Cutting Master already exists");
      process.exit();
    }

    const cuttingMaster = new CuttingMaster({
      name: "Default Cutting Master",
      phone: "9876543211",
      email: "cutting@dreamfit.com",
      password: "123456",
      specialization: ["Shirt Cutting", "Pant Cutting"],
      experience: 5,
      address: {
        street: "Industrial Area",
        city: "Chennai",
        state: "Tamil Nadu",
        pincode: "600001"
      }
    });

    await cuttingMaster.save();

    console.log("🎉 Cutting Master seeded successfully");
    console.log(`ID: ${cuttingMaster.cuttingMasterId}`);

    process.exit();

  } catch (error) {
    console.error("❌ Error seeding Cutting Master:", error);
    process.exit(1);
    
  }
};

seedCuttingMaster();