const mongoose = require("mongoose");
require("dotenv").config();

const Order = require("./models/order.js");

mongoose.connect(process.env.MONGO_URI);

const seedOrders = [
  {
    id: 1,
    item: "Laptop",
    qty: 1,
    price: 75000,
    createdBy: "admin@example.com",
  },
  {
    id: 2,
    item: "Monitor",
    qty: 2,
    price: 12000,
    createdBy: "admin@example.com",
  },
  {
    id: 3,
    item: "Keyboard",
    qty: 3,
    price: 1500,
    createdBy: "manager@example.com",
  },
];

const insertData = async () => {
  try {
    await Order.deleteMany();

    await Order.insertMany(seedOrders);

    console.log("✅ Mock orders inserted");

    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

insertData();