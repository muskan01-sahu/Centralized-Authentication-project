const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");

const { login, refresh, logout, register } = require("../controllers/authController");
const { validateLogin, validateRegister } = require("../middleware/validateMiddleware");
const { protect } = require("../middleware/verifyTokenMiddleware");

// Rate limiter — login only (10 attempts per 15 minutes per IP)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: "Too many login attempts. Try again after 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Auth Endpoints:
 *   POST /auth/register → public  (new user signup)
 *   POST /auth/login    → public  (required by PDF)
 *   POST /auth/refresh  → public  (optional but recommended)
 *   POST /auth/logout   → private (optional)
 */

// POST /auth/register — create new user with default "user" role
router.post("/register", validateRegister, register);

// POST /auth/login — rate limited (10 req / 15 min per IP)
router.post("/login", loginLimiter, validateLogin, login);

// POST /auth/refresh
router.post("/refresh", refresh);

// POST /auth/logout
router.post("/logout", protect, logout);

module.exports = router;