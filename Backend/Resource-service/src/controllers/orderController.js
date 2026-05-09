const { sendSuccess, sendError } = require("../utils/responseHandler");

/**
 * In-memory orders store
 * PDF only requires a working example Resource Service.
 * No database needed here — just demonstrates RBAC working correctly.
 */
let orders = [
  { id: "1", item: "Laptop",   qty: 1, price: 75000, createdBy: "admin@example.com" },
  { id: "2", item: "Monitor",  qty: 2, price: 12000, createdBy: "admin@example.com" },
  { id: "3", item: "Keyboard", qty: 3, price: 1500,  createdBy: "manager@example.com" },
];

let nextId = 4;

// ─── GET /orders ──────────────────────────────────────────────────────────────
// PDF Required Permission: orders:read
const getOrders = (req, res) => {
  return sendSuccess(res, 200, "Orders fetched successfully", {
    total: orders.length,
    requestedBy: req.user.email,  // who is accessing (from token)
    orders,
  });
};

// ─── POST /orders ─────────────────────────────────────────────────────────────
// PDF Required Permission: orders:write
const createOrder = (req, res) => {
  const { item, qty, price } = req.body;

  if (!item || !qty || !price) {
    return sendError(res, 400, "item, qty, and price are required");
  }

  const newOrder = {
    id: String(nextId++),
    item,
    qty: Number(qty),
    price: Number(price),
    createdBy: req.user.email, // who created (from token)
    createdAt: new Date().toISOString(),
  };

  orders.push(newOrder);
  return sendSuccess(res, 201, "Order created successfully", newOrder);
};

// ─── DELETE /orders/:id ───────────────────────────────────────────────────────
// PDF Required Permission: orders:delete
const deleteOrder = (req, res) => {
  const { id } = req.params;
  const index = orders.findIndex((o) => o.id === id);

  if (index === -1) {
    return sendError(res, 404, `Order with id "${id}" not found`);
  }

  const deleted = orders.splice(index, 1)[0];
  return sendSuccess(res, 200, "Order deleted successfully", deleted);
};

module.exports = { getOrders, createOrder, deleteOrder };