require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const orderRoutes = require("./routes/orderRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();

// Security Headers 
app.use(helmet());

// CORS
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? ["https://yourdomain.com"]
        : [ "http://localhost:5000", "http://localhost:5001","http://localhost:5173"],
    credentials: true,
  })
);

// Rate Limiting 
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { success: false, message: "Too many requests. Please slow down." },
  })
);

// Body Parsing
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Logger
if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

// Health Check
app.get("/health", (req, res) => {
  res.json({ success: true, service: "resource-service", status: "running" });
});

// Order Routes 
app.use("/orders", orderRoutes);

// 404 + Error Handlers 
app.use(notFound);
app.use(errorHandler);

module.exports = app;
