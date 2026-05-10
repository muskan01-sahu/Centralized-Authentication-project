const Order = require("../models/order.js");
const { sendSuccess, sendError } = require("../utils/responseHandler");

// GET ORDERS
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find();

    return sendSuccess(res, 200, "Orders fetched successfully", {
      total: orders.length,
      requestedBy: req.user.email,
      orders,
    });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// CREATE ORDER
const createOrder = async (req, res) => {
  try {
    const { item, qty, price } = req.body;

    if (!item || !qty || !price) {
      return sendError(res, 400, "item, qty, and price are required");
    }

    // Find last order
    const lastOrder = await Order.findOne().sort({ id: -1 });

    // Generate next numeric ID
    const nextId = lastOrder ? lastOrder.id + 1 : 1;

    const newOrder = await Order.create({
      id: nextId,
      item,
      qty,
      price,
      createdBy: req.user.email,
    });

    return sendSuccess(res, 201, "Order created successfully", newOrder);
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// DELETE ORDER
const deleteOrder = async (req, res) => {
  try {
    const deleted = await Order.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return sendError(res, 404, "Order not found");
    }

    return sendSuccess(res, 200, "Order deleted successfully", deleted);
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

module.exports = {
  getOrders,
  createOrder,
  deleteOrder,
};