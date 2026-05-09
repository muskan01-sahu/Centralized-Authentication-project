const express = require("express");
const router = express.Router();

const { getOrders, createOrder, deleteOrder } = require("../controllers/orderController");
const { verifyToken } = require("../middleware/verifyToken");
const { checkPermission } = require("../middleware/checkPermission");

/**
 * PDF Resource Service Endpoints — Orders
 *
 * ┌─────────────────────┬──────────────────┐
 * │ Endpoint            │ Permission       │
 * ├─────────────────────┼──────────────────┤
 * │ GET    /orders      │ orders:read      │
 * │ POST   /orders      │ orders:write     │
 * │ DELETE /orders/:id  │ orders:delete    │
 * └─────────────────────┴──────────────────┘
 *
 * Middleware chain on every route:
 *   verifyToken → checkPermission → controller
 *
 * PDF rules enforced:
 * → No token         → 401 Unauthorized  (verifyToken)
 * → Wrong permission → 403 Forbidden     (checkPermission)
 */

// GET /orders — needs orders:read permission
router.get(
  "/",
  verifyToken,
  checkPermission("orders:read"),
  getOrders
);

// POST /orders — needs orders:write permission
router.post(
  "/",
  verifyToken,
  checkPermission("orders:write"),
  createOrder
);

// DELETE /orders/:id — needs orders:delete permission
router.delete(
  "/:id",
  verifyToken,
  checkPermission("orders:delete"),
  deleteOrder
);

module.exports = router;