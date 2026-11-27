const express = require("express");
const authRoutes = require("./routes/auth.routes");
const errorHandler = require("./middlewares/error.middleware");

const app = express();

// Global middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/health", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Application is healthy",
    timestamp: new Date().toISOString(),
  });
});

// Root route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to Production REST API",
  });
});

app.use("/api/v1/auth", authRoutes);

app.use(errorHandler);

module.exports = app;
