require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/authRoutes");
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
        :  [
    
    "http://localhost:5001",
    "http://localhost:5173",
  ],
    credentials: true, 
  })
);

// ── Body Parsing ──────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser()); 

// HTTP Request Logger 
if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

// Health Check 
app.get("/health", (req, res) => {
  res.json({ success: true, service: "auth-service", status: "running" });
});

//  Auth Routes 
app.use("/auth", authRoutes);

// 404 Handler 
app.use(notFound);

// Global Error Handler 
app.use(errorHandler);

module.exports = app;