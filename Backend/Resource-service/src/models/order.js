const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      unique: true,
    },
    item: {
      type: String,
      required: true,
    },
    qty: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    createdBy: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);