

import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";

import { handleDemo } from "./routes/demo.js";
import { connectDB, isMongoDBAvailable, getConnectionStatus } from "./database/connection.js";
import profileRoutes from "./routes/profile.js";
import projectsRoutes from "./routes/projects.js";
import contactsRoutes from "./routes/contacts.js";
import gitRoutes from "./routes/git.js";
import migrateRoutes from "./routes/migrate.js";
import emailTestRoutes from "./routes/email-test.js";
import smsRoutes from "./routes/sms.js";
import settingsRoutes from "./routes/settings.js";
import activitiesRoutes from "./routes/activities.js";
import { handleFileUpload, handleFileDelete, getUploadConfig, getFileFromMongoDB } from "./routes/upload.js";

export function createServer() {
  const app = express();

  // Try to connect to MongoDB (non-blocking)
  connectDB()
    .then((connected) => {
      if (connected) {
        console.log("✅ MongoDB integration enabled");
      } else {
        console.log("❌ MongoDB not available");
      }
    })
    .catch((error) => {
      console.warn("MongoDB connection attempt failed:", error.message);
    });

  // Middleware
  app.use(cors());
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  // Request logging
  app.use((req, _res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });

  // Health check
  app.get("/api/health", (_req, res) => {
    const mongoStatus = getConnectionStatus();
    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      mongodb: mongoStatus,
      environment: process.env.NODE_ENV || "development",
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: process.version
    });
  });

  // MongoDB status
  app.get("/api/mongodb/status", (_req, res) => {
    res.json(getConnectionStatus());
  });

  app.post("/api/mongodb/test", (_req, res) => {
    if (isMongoDBAvailable()) {
      res.json({ success: true, message: "MongoDB connected" });
    } else {
      res.status(503).json({ success: false, message: "MongoDB not available" });
    }
  });

  // Example routes
  app.get("/api/ping", (_req, res) => {
    res.json({
      message: process.env.PING_MESSAGE ?? "pong",
      timestamp: new Date().toISOString(),
      mongodb: isMongoDBAvailable() ? "connected" : "disconnected"
    });
  });
  app.get("/api/demo", handleDemo);

  // Portfolio routes
  app.use("/api/profile", profileRoutes);
  app.use("/api/projects", projectsRoutes);
  app.use("/api/contacts", contactsRoutes);
  app.use("/api/git", gitRoutes);
  app.use("/api/migrate", migrateRoutes);
  app.use("/api/sms", smsRoutes);
  app.use("/api/settings", settingsRoutes);
  app.use("/api/activities", activitiesRoutes);
  app.use("/api", emailTestRoutes);

  // File routes (MongoDB only)
  app.post("/api/upload", handleFileUpload);
  app.delete("/api/upload/:filename", handleFileDelete);
  app.get("/api/upload/config", getUploadConfig);
  app.get("/api/files/:filename", getFileFromMongoDB);

  // Error handler
  app.use((error, _req, res, _next) => {
    console.error("Global error handler:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: process.env.NODE_ENV === "development" ? error.message : "Something went wrong"
    });
  });

  // 404 handler
  app.use("/api/*", (req, res) => {
    res.status(404).json({
      error: "Route not found",
      message: `The route ${req.originalUrl} does not exist`
    });
  });

  return app;
}
