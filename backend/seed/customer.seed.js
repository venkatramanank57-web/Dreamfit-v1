import mongoose from "mongoose";
import dotenv from "dotenv";
import Customer from "../models/Customer.js";

dotenv.config();

const seedCustomers = async () => {
  try {

    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");

    const customers = [

      {
        salutation: "Mr.",
        firstName: "Arun",
        lastName: "Kumar",
        phone: "9000000001",
        whatsappNumber: "9000000001",
        email: "arun@test.com",
        addressLine1: "12 Anna Nagar",
        city: "Chennai",
        state: "Tamil Nadu",
        pincode: "600040"
      },

      {
        salutation: "Mr.",
        firstName: "Vignesh",
        lastName: "R",
        phone: "9000000002",
        whatsappNumber: "9000000002",
        email: "vignesh@test.com",
        addressLine1: "45 T Nagar",
        city: "Chennai",
        state: "Tamil Nadu",
        pincode: "600017"
      },

      {
        salutation: "Mr.",
        firstName: "Karthik",
        lastName: "S",
        phone: "9000000003",
        whatsappNumber: "9000000003",
        email: "karthik@test.com",
        addressLine1: "21 Velachery",
        city: "Chennai",
        state: "Tamil Nadu",
        pincode: "600042"
      },

      {
        salutation: "Mr.",
        firstName: "Prakash",
        lastName: "M",
        phone: "9000000004",
        whatsappNumber: "9000000004",
        email: "prakash@test.com",
        addressLine1: "78 Tambaram",
        city: "Chennai",
        state: "Tamil Nadu",
        pincode: "600045"
      },

      {
        salutation: "Mrs.",
        firstName: "Lakshmi",
        lastName: "Devi",
        phone: "9000000005",
        whatsappNumber: "9000000005",
        email: "lakshmi@test.com",
        addressLine1: "9 Adyar",
        city: "Chennai",
        state: "Tamil Nadu",
        pincode: "600020"
      },

      {
        salutation: "Mr.",
        firstName: "Suresh",
        lastName: "Babu",
        phone: "9000000006",
        whatsappNumber: "9000000006",
        email: "suresh@test.com",
        addressLine1: "15 Porur",
        city: "Chennai",
        state: "Tamil Nadu",
        pincode: "600116"
      },

      {
        salutation: "Mr.",
        firstName: "Ramesh",
        lastName: "K",
        phone: "9000000007",
        whatsappNumber: "9000000007",
        email: "ramesh@test.com",
        addressLine1: "101 Ambattur",
        city: "Chennai",
        state: "Tamil Nadu",
        pincode: "600053"
      },

      {
        salutation: "Mr.",
        firstName: "Ganesh",
        lastName: "S",
        phone: "9000000008",
        whatsappNumber: "9000000008",
        email: "ganesh@test.com",
        addressLine1: "23 OMR",
        city: "Chennai",
        state: "Tamil Nadu",
        pincode: "600096"
      },

      {
        salutation: "Mrs.",
        firstName: "Divya",
        lastName: "R",
        phone: "9000000009",
        whatsappNumber: "9000000009",
        email: "divya@test.com",
        addressLine1: "44 Perungudi",
        city: "Chennai",
        state: "Tamil Nadu",
        pincode: "600096"
      },

      {
        salutation: "Mr.",
        firstName: "Hari",
        lastName: "Prasad",
        phone: "9000000010",
        whatsappNumber: "9000000010",
        email: "hari@test.com",
        addressLine1: "88 Pallavaram",
        city: "Chennai",
        state: "Tamil Nadu",
        pincode: "600043"
      }

    ];

    for (const data of customers) {
      const exists = await Customer.findOne({ phone: data.phone });

      if (!exists) {
        const customer = new Customer(data);
        await customer.save();
      }
    }

    console.log("🎉 10 Customers seeded successfully");
    process.exit();

  } catch (error) {

    console.error("❌ Error seeding customers:", error);
    process.exit(1);

  }
};

seedCustomers();