


import { RequestHandler } from "express";
import { z } from "zod";
import fs from "fs";
import path from "path";
import { FileStorage } from "../models/index.js";
import { isMongoDBAvailable } from "../database/connection.js";

import { RequestHandler } from "express";
import { z } from "zod";
import { FileStorage } from "../models/index.js";
import { isMongoDBAvailable } from "../database/connection.js";

// Validation schema for file upload (JSON base64)
const uploadSchema = z.object({
  type: z.enum(["profile-image", "project-image", "document", "resume"]),
  filename: z.string().optional(),
  mimeType: z.string().optional(),
  data: z.string().min(1, "File data is required"), // base64 data URL or pure base64
});

export interface UploadResponse {
  success: boolean;
  url?: string;
  filename?: string;
  message?: string;
  error?: string;
}

// -------------------- Upload File (MongoDB Only) --------------------
export const handleFileUpload: RequestHandler = async (req, res) => {
  try {
    if (!isMongoDBAvailable()) {
      return res.status(503).json({ success: false, error: "MongoDB not available" });
    }

    const { type, filename, mimeType, data } = uploadSchema.parse(req.body);
    const userId = "kanu-portfolio"; // default user

    // Extract base64 payload
    const base64 = data.includes(",") ? data.split(",")[1] : data;
    const buffer = Buffer.from(base64, "base64");

    // Validate size (max 10MB)
    const MAX = 10 * 1024 * 1024;
    if (buffer.length > MAX) {
      return res.status(413).json({ success: false, error: "File too large (max 10MB)" });
    }

    // Save in MongoDB
    const uniqueName = filename || `${Date.now()}-${type}`;
    const fileRecord = new FileStorage({
      userId,
      filename: uniqueName,
      originalName: filename || `${type}`,
      mimeType: mimeType || "application/octet-stream",
      fileType: type,
      fileSize: buffer.length,
      fileData: buffer,
      isActive: true,
      metadata: { uploadedAt: new Date() },
      publicUrl: `${req.protocol}://${req.get("host")}/api/files/${uniqueName}`, 
    });

    await fileRecord.save();

    const response: UploadResponse = {
      // success: true,
      // url: `${req.protocol}://${req.get("host")}/api/upload/file/${fileRecord.filename}`,
      // filename: fileRecord.filename,
      // message: "File uploaded successfully (MongoDB only)",

      success: true,
      url: `${req.protocol}://${req.get("host")}/api/files/${fileRecord.filename}`,
      filename: fileRecord.filename,
      message: "File uploaded successfully (MongoDB only)",
    };

    res.json(response);
  } catch (error) {
    console.error("Upload error:", error);

    const errorResponse: UploadResponse = {
      success: false,
      error: error instanceof Error ? error.message : "Upload failed",
    };

    res.status(400).json(errorResponse);
  }
};

// -------------------- Get File from MongoDB --------------------
export const getFileFromMongoDB: RequestHandler = async (req, res) => {
  try {
    const { filename } = req.params;
    const userId = "kanu-portfolio";

    if (!isMongoDBAvailable()) {
      return res.status(503).json({ success: false, error: "MongoDB not available" });
    }

    const file = await FileStorage.findOne({ userId, filename, isActive: true });

    if (!file) {
      return res.status(404).json({ success: false, error: "File not found" });
    }

    res.set({
      "Content-Type": file.mimeType,
      "Content-Length": file.fileSize.toString(),
      "Cache-Control": "public, max-age=31536000", // 1 year cache
    });

    res.send(file.fileData);
  } catch (error) {
    console.error("Get file error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to retrieve file",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// -------------------- Delete File from MongoDB --------------------
export const handleFileDelete: RequestHandler = async (req, res) => {
  try {
    const { filename } = req.params;
    const userId = "kanu-portfolio";

    if (!filename) {
      return res.status(400).json({ success: false, error: "Filename is required" });
    }

    const result = await FileStorage.deleteOne({ userId, filename });

    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, error: "File not found in MongoDB" });
    }

    res.json({ success: true, message: "File deleted successfully from MongoDB" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Delete failed",
    });
  }
};

// -------------------- Upload Config --------------------
export const getUploadConfig: RequestHandler = (req, res) => {
  const config = {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
    uploadEndpoint: "/api/upload",
    storageProvider: "mongodb", // always Mongo now
  };

  res.json(config);
};
