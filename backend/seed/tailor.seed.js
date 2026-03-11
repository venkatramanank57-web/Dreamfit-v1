import mongoose from "mongoose";
import dotenv from "dotenv";
import Tailor from "../models/Tailor.js";

dotenv.config();

const seedTailors = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");

    const tailors = [
      {
        name: "Ramesh Kumar",
        phone: "9876543201",
        email: "ramesh@tailor.com",
        password: "123456",
        specialization: ["Shirt", "Pant"],
        experience: 5
      },
      {
        name: "Suresh Babu",
        phone: "9876543202",
        email: "suresh@tailor.com",
        password: "123456",
        specialization: ["Blazer", "Coat"],
        experience: 7
      },
      {
        name: "Karthik",
        phone: "9876543203",
        email: "karthik@tailor.com",
        password: "123456",
        specialization: ["Salwar", "Ladies Wear"],
        experience: 4
      },
      {
        name: "Arun Prakash",
        phone: "9876543204",
        email: "arun@tailor.com",
        password: "123456",
        specialization: ["Uniform"],
        experience: 6
      }
    ];

    for (const data of tailors) {
      const tailor = new Tailor(data);
      await tailor.save(); // ✅ pre-save hook will run
    }

    console.log("🎉 4 Tailors seeded successfully");
    process.exit();

  } catch (error) {
    console.error("❌ Error seeding Tailors:", error);
    process.exit(1);
  }
};

seedTailors();