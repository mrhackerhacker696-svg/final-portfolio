// import "dotenv/config";
// import express from "express";
// import cors from "cors";
// import { handleDemo } from "./routes/demo.js";
// import { connectDB, isMongoDBAvailable, getConnectionStatus } from "./database/connection.js";
// import profileRoutes from "./routes/profile.js";
// import projectsRoutes from "./routes/projects.js";
// import contactsRoutes from "./routes/contacts.js";
// import gitRoutes from "./routes/git.js";
// import migrateRoutes from "./routes/migrate.js";
// import emailTestRoutes from "./routes/email-test.js";
// import smsRoutes from "./routes/sms.js";
// import settingsRoutes from "./routes/settings.js";
// import activitiesRoutes from "./routes/activities.js";
// import { handleFileUpload, handleFileDelete, getUploadConfig, restoreFilesFromMongoDB, getFileFromMongoDB } from "./routes/upload.js";
// import emailTestRoutes from "./routes/email-test.js";
// import path from "path";

// export function createServer() {
//   const app = express();

//   // Try to connect to MongoDB (non-blocking)
//   connectDB()
//     .then(async (connected) => {
//       if (connected) {
//         console.log("✅ MongoDB integration enabled");

//         // Restore files from MongoDB to filesystem on startup
//         try {
//           const { restoreFilesFromMongoDB } = await import("./routes/upload.js");
//           const mockReq = {} as any;
//           const mockRes = {
//             json: (data: any) => {
//               if (data.success) {
//                 console.log(`📁 File restoration: ${data.restoredCount} files restored, ${data.skippedCount} skipped`);
//               }
//             }
//           } as any;

//           await restoreFilesFromMongoDB(mockReq, mockRes);
//         } catch (error) {
//           console.warn("File restoration failed:", error);
//         }
//       } else {
//         console.log("📱 Running in localStorage mode");
//       }
//     })
//     .catch((error) => {
//       console.warn("MongoDB connection attempt failed:", error.message);
//     });

//   // Middleware
//   app.use(cors());
//   app.use(express.json({ limit: "10mb" }));
//   app.use(express.urlencoded({ extended: true, limit: "10mb" }));

//   // Request logging middleware
//   app.use((req, res, next) => {
//     console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
//     next();
//   });

//   // Health check endpoint with detailed MongoDB status
//   app.get("/api/health", async (_req, res) => {
//     try {
//       const mongoStatus = getConnectionStatus();
//       const healthData = {
//         status: "ok",
//         timestamp: new Date().toISOString(),
//         mongodb: mongoStatus,
//         environment: process.env.NODE_ENV || "development",
//         uptime: process.uptime(),
//         memory: process.memoryUsage(),
//         version: process.version
//       };

//       res.json(healthData);
//     } catch (error) {
//       res.status(500).json({
//         status: "error",
//         message: "Health check failed",
//         error: error.message
//       });
//     }
//   });

//   // MongoDB status endpoint
//   app.get("/api/mongodb/status", (_req, res) => {
//     try {
//       const status = getConnectionStatus();
//       res.json(status);
//     } catch (error) {
//       res.status(500).json({
//         error: "Failed to get MongoDB status",
//         message: error.message
//       });
//     }
//   });

//   // Test MongoDB connection endpoint
//   app.post("/api/mongodb/test", async (_req, res) => {
//     try {
//       if (isMongoDBAvailable()) {
//         res.json({
//           success: true,
//           message: "MongoDB connection is working",
//           status: "connected"
//         });
//       } else {
//         res.status(503).json({
//           success: false,
//           message: "MongoDB is not available",
//           status: "disconnected"
//         });
//       }
//     } catch (error) {
//       res.status(500).json({
//         success: false,
//         error: "Failed to test MongoDB connection",
//         message: error.message
//       });
//     }
//   });

//   // Example API routes
//   app.get("/api/ping", (_req, res) => {
//     const ping = process.env.PING_MESSAGE ?? "pong";
//     res.json({
//       message: ping,
//       timestamp: new Date().toISOString(),
//       mongodb: isMongoDBAvailable() ? "connected" : "disconnected"
//     });
//   });

//   app.get("/api/demo", handleDemo);

//   // Portfolio API routes
//   app.use("/api/profile", profileRoutes);
//   app.use("/api/projects", projectsRoutes);
//   app.use("/api/contacts", contactsRoutes);
//   app.use("/api/git", gitRoutes);
//   app.use("/api/migrate", migrateRoutes);
//   app.use("/api/sms", smsRoutes);
//   app.use("/api/settings", settingsRoutes);
//   app.use("/api/activities", activitiesRoutes);
//   app.use("/api", emailTestRoutes); // Email send endpoint

//   // File upload endpoints
//   app.post("/api/upload", handleFileUpload);
//   app.delete("/api/upload/:filename", handleFileDelete);
//   app.get("/api/upload/config", getUploadConfig);
//   app.post("/api/upload/restore", restoreFilesFromMongoDB);
//   app.get("/api/files/:filename", getFileFromMongoDB);

//   // Serve uploaded files (with fallback to MongoDB)
//   app.use("/uploads", express.static(path.resolve(process.cwd(), "public", "uploads")));

//   // Fallback middleware for missing files - serve from MongoDB
//   app.use("/uploads/*", async (req, res, next) => {
//     if (isMongoDBAvailable()) {
//       try {
//         const filename = req.path.split('/').pop();
//         const { getFileFromMongoDB } = await import("./routes/upload.js");

//         // Mock request with filename parameter
//         const mockReq = { params: { filename } } as any;
//         const mockRes = {
//           status: (code: number) => ({
//             json: (data: any) => res.status(code).json(data)
//           }),
//           set: (headers: any) => res.set(headers),
//           send: (data: any) => res.send(data)
//         } as any;

//         await getFileFromMongoDB(mockReq, mockRes);
//       } catch (error) {
//         next(); // Continue to 404 handler if file not found in MongoDB
//       }
//     } else {
//       next(); // Continue to 404 handler if MongoDB not available
//     }
//   });

//   // Global error handling middleware
//   app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
//     console.error('Global error handler:', error);

//     if (error.name === 'ValidationError') {
//       return res.status(400).json({
//         error: 'Validation Error',
//         message: error.message,
//         details: error.errors
//       });
//     }

//     if (error.name === 'CastError') {
//       return res.status(400).json({
//         error: 'Invalid ID Format',
//         message: 'The provided ID is not valid'
//       });
//     }

//     if (error.name === 'MongoError' && error.code === 11000) {
//       return res.status(409).json({
//         error: 'Duplicate Entry',
//         message: 'A record with this information already exists'
//       });
//     }

//     res.status(500).json({
//       error: 'Internal Server Error',
//       message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
//     });
//   });

//   // 404 handler for undefined API routes only (do not intercept SPA routes)
//   app.use("/api/*", (req, res) => {
//     res.status(404).json({
//       error: "Route not found",
//       message: `The route ${req.originalUrl} does not exist`,
//       availableRoutes: [
//         "/api/health",
//         "/api/mongodb/status",
//         "/api/mongodb/test",
//         "/api/ping",
//         "/api/demo",
//         "/api/profile",
//         "/api/projects",
//         "/api/contacts",
//         "/api/git",
//         "/api/migrate",
//         "/api/sms",
//         "/api/settings",
//         "/api/activities",
//         "/api/upload"
//       ]
//     });
//   });

//   return app;
// }





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
