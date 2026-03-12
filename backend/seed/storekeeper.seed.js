// backend/seeds/storekeeper.seed.js

import mongoose from "mongoose";
import dotenv from "dotenv";
import StoreKeeper from "../models/StoreKeeper.js";

dotenv.config();

const seedStoreKeeper = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB Connected");

    // Check already exists
    const existing = await StoreKeeper.findOne({ email: "storekeeper@test.com" });

    if (existing) {
      console.log("⚠️ StoreKeeper already exists");
      process.exit();
    }

    const storekeeper = new StoreKeeper({
      name: "Default Store Keeper",
      phone: "9876543210",
      email: "store@dreamfit.com",
      password: "123456",
      department: "both",
      experience: 2,
      address: {
        street: "Main Street",
        city: "Chennai",
        state: "Tamil Nadu",
        pincode: "600001"
      }
    });

    await storekeeper.save();

    console.log("🎉 StoreKeeper seeded successfully");
    console.log(`ID: ${storekeeper.storeKeeperId}`);

    process.exit();

  } catch (error) {
    console.error("❌ Error seeding StoreKeeper:", error);
    process.exit(1);
  }
};

seedStoreKeeper();