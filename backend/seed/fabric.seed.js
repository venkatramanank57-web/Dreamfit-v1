import mongoose from "mongoose";
import dotenv from "dotenv";
import Fabric from "../models/Fabric.js";

dotenv.config();

const seedFabrics = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");

    const fabrics = [
      { name: "Cotton", color: "White", pricePerMeter: 120 },
      { name: "Cotton", color: "Black", pricePerMeter: 130 },
      { name: "Linen", color: "Beige", pricePerMeter: 200 },
      { name: "Denim", color: "Blue", pricePerMeter: 250 },
      { name: "Silk", color: "Red", pricePerMeter: 450 },
      { name: "Polyester", color: "Grey", pricePerMeter: 110 },
      { name: "Rayon", color: "Green", pricePerMeter: 180 },
      { name: "Wool", color: "Brown", pricePerMeter: 320 },
      { name: "Khadi", color: "Cream", pricePerMeter: 210 },
      { name: "Velvet", color: "Maroon", pricePerMeter: 500 }
    ];

    for (const fabricData of fabrics) {
      const fabric = new Fabric(fabricData);
      await fabric.save();
    }

    console.log("🎉 10 Fabrics seeded successfully");
    process.exit();

  } catch (error) {
    console.error("❌ Error seeding fabrics:", error);
    process.exit(1);
  }
};

seedFabrics();