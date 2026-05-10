const express = require("express");
const router = express.Router();

const { getOrders, createOrder, deleteOrder } = require("../controllers/orderController");
const { verifyToken } = require("../middleware/verifyToken");
const { checkPermission } = require("../middleware/checkPermission");


// GET /orders 
router.get(
  "/",
  verifyToken,
  checkPermission("orders:read"),
  getOrders
);

// POST /orders 
router.post(
  "/",
  verifyToken,
  checkPermission("orders:write"),
  createOrder
);

// DELETE /orders/:id — 
router.delete(
  "/:id",
  verifyToken,
  checkPermission("orders:delete"),
  deleteOrder
);

module.exports = router;