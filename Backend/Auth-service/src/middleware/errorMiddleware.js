const { sendError } = require("../utils/responseHandler");

// 404 — route not found
const notFound = (req, res, next) => {
  const err = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  err.statusCode = 404;
  next(err);
};

// Global error handler — centralized error handling + proper HTTP codes
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || err.status || 500;
  let message = err.message || "Internal Server Error";

  // Mongoose duplicate key (e.g. duplicate email)
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || "field";
    message = `${field} already exists`;
  }

  // Mongoose validation errors
  if (err.name === "ValidationError") {
    statusCode = 422;
    message = Object.values(err.errors).map((e) => e.message).join(", ");
  }

  // JWT errors — token expiration handling
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  }
  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token has expired";
  }

  // no sensitive data leakage — never expose stack in production
  if (process.env.NODE_ENV === "development") {
  console.error("FULL ERROR =>", err);
}

  return sendError(res, statusCode, message);
};

module.exports = { notFound, errorHandler };