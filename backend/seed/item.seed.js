import mongoose from "mongoose";
import dotenv from "dotenv";
import Item from "../models/Item.js";
import Category from "../models/Category.js";

dotenv.config();

const seedItems = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");

    const categories = await Category.find();

    if (categories.length === 0) {
      console.log("❌ No categories found. Seed categories first.");
      process.exit();
    }

    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat.name] = cat._id;
    });

    const items = [
      { name: "Formal Shirt", category: "Shirt", priceRange: { min: 800, max: 1500 } },
      { name: "Casual Shirt", category: "Shirt", priceRange: { min: 600, max: 1200 } },
      { name: "Slim Fit Pant", category: "Pant", priceRange: { min: 900, max: 1800 } },
      { name: "Regular Pant", category: "Pant", priceRange: { min: 700, max: 1500 } },
      { name: "Office Blazer", category: "Blazer", priceRange: { min: 2500, max: 5000 } },
      { name: "Wedding Blazer", category: "Blazer", priceRange: { min: 4000, max: 9000 } },
      { name: "2 Piece Suit", category: "Suit", priceRange: { min: 5000, max: 12000 } },
      { name: "3 Piece Suit", category: "Suit", priceRange: { min: 8000, max: 18000 } },
      { name: "School Uniform", category: "Uniform", priceRange: { min: 700, max: 1200 } },
      { name: "Office Uniform", category: "Uniform", priceRange: { min: 900, max: 1500 } },
      { name: "Kurta Plain", category: "Kurta", priceRange: { min: 700, max: 1500 } },
      { name: "Kurta Designer", category: "Kurta", priceRange: { min: 1200, max: 3000 } },
      { name: "Wedding Sherwani", category: "Sherwani", priceRange: { min: 7000, max: 20000 } },
      { name: "Simple Sherwani", category: "Sherwani", priceRange: { min: 4000, max: 9000 } },
      { name: "Ladies Casual Top", category: "Ladies Top", priceRange: { min: 500, max: 1200 } },
      { name: "Designer Top", category: "Ladies Top", priceRange: { min: 900, max: 2500 } },
      { name: "Salwar Set", category: "Salwar", priceRange: { min: 1500, max: 3500 } },
      { name: "Designer Salwar", category: "Salwar", priceRange: { min: 2500, max: 6000 } },
      { name: "Winter Jacket", category: "Jacket", priceRange: { min: 2000, max: 5000 } },
      { name: "Leather Jacket", category: "Jacket", priceRange: { min: 4000, max: 9000 } }
    ];

    for (const itemData of items) {
      const item = new Item({
        name: itemData.name,
        category: categoryMap[itemData.category],
        priceRange: itemData.priceRange
      });

      await item.save();
    }

    console.log("🎉 20 Items seeded successfully");
    process.exit();

  } catch (error) {
    console.error("❌ Error seeding items:", error);
    process.exit(1);
  }
};

seedItems();