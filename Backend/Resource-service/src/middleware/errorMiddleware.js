const { sendError } = require("../utils/responseHandler");

// 404 — route not found
const notFound = (req, res, next) => {
  const err = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  err.statusCode = 404;
  next(err);
};

// Global error handler — PDF: centralized error handling
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  if (err.name === "JsonWebTokenError") { statusCode = 401; message = "Invalid token"; }
  if (err.name === "TokenExpiredError") { statusCode = 401; message = "Token has expired"; }

  if (process.env.NODE_ENV === "development") {
    console.error(`[RESOURCE ERROR] ${statusCode} — ${message}`);
  }

  return sendError(res, statusCode, message);
};

module.exports = { notFound, errorHandler };