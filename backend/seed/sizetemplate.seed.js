import mongoose from "mongoose";
import dotenv from "dotenv";
import SizeTemplate from "../models/SizeTemplate.js";

dotenv.config();

const seedSizeTemplates = async () => {
  try {

    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");

    const templates = [

      {
        name: "Shirt Template",
        description: "Standard shirt measurements",
        sizeFields: [
          { name: "Chest", isRequired: true, order: 1 },
          { name: "Shoulder", isRequired: true, order: 2 },
          { name: "Sleeve Length", isRequired: true, order: 3 },
          { name: "Neck", isRequired: false, order: 4 },
          { name: "Shirt Length", isRequired: true, order: 5 }
        ]
      },

      {
        name: "Pant Template",
        description: "Standard pant measurements",
        sizeFields: [
          { name: "Waist", isRequired: true, order: 1 },
          { name: "Hip", isRequired: true, order: 2 },
          { name: "Thigh", isRequired: false, order: 3 },
          { name: "Knee", isRequired: false, order: 4 },
          { name: "Pant Length", isRequired: true, order: 5 }
        ]
      },

      {
        name: "Blazer Template",
        description: "Blazer measurement template",
        sizeFields: [
          { name: "Chest", isRequired: true, order: 1 },
          { name: "Shoulder", isRequired: true, order: 2 },
          { name: "Sleeve Length", isRequired: true, order: 3 },
          { name: "Waist", isRequired: true, order: 4 },
          { name: "Blazer Length", isRequired: true, order: 5 }
        ]
      },

      {
        name: "Kurta Template",
        description: "Kurta measurements",
        sizeFields: [
          { name: "Chest", isRequired: true, order: 1 },
          { name: "Shoulder", isRequired: true, order: 2 },
          { name: "Sleeve Length", isRequired: true, order: 3 },
          { name: "Kurta Length", isRequired: true, order: 4 }
        ]
      },

      {
        name: "Sherwani Template",
        description: "Wedding sherwani measurements",
        sizeFields: [
          { name: "Chest", isRequired: true, order: 1 },
          { name: "Shoulder", isRequired: true, order: 2 },
          { name: "Sleeve Length", isRequired: true, order: 3 },
          { name: "Waist", isRequired: true, order: 4 },
          { name: "Sherwani Length", isRequired: true, order: 5 }
        ]
      }

    ];

    for (const template of templates) {

      const exists = await SizeTemplate.findOne({ name: template.name });

      if (!exists) {
        await SizeTemplate.create(template);
      }

    }

    console.log("🎉 Size Templates seeded successfully");
    process.exit();

  } catch (error) {

    console.error("❌ Error seeding size templates:", error);
    process.exit(1);

  }
};

seedSizeTemplates();