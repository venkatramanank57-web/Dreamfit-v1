import mongoose from "mongoose";
import dotenv from "dotenv";
import Category from "../models/Category.js";

dotenv.config();

const seedCategories = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");

    const categories = [
      { name: "Shirt" },
      { name: "Pant" },
      { name: "Blazer" },
      { name: "Suit" },
      { name: "Uniform" },
      { name: "Kurta" },
      { name: "Sherwani" },
      { name: "Ladies Top" },
      { name: "Salwar" },
      { name: "Jacket" }
    ];

    for (const data of categories) {
      const exists = await Category.findOne({ name: data.name });

      if (!exists) {
        const category = new Category(data);
        await category.save();
      }
    }

    console.log("🎉 10 Categories seeded successfully");
    process.exit();

  } catch (error) {
    console.error("❌ Error seeding categories:", error);
    process.exit(1);
  }
};

seedCategories();