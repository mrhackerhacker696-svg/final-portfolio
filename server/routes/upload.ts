import { RequestHandler } from "express";
import { z } from "zod";
import fs from "fs";
import path from "path";
import { FileStorage } from "../models/index.js";
import { isMongoDBAvailable } from "../database/connection.js";

// Validation schema for file upload (JSON base64)
const uploadSchema = z.object({
  type: z.enum(['profile-image', 'project-image', 'document', 'resume']),
  filename: z.string().optional(),
  mimeType: z.string().optional(),
  data: z.string().min(1, 'File data is required'), // base64 data URL or pure base64
});

export interface UploadResponse {
  success: boolean;
  url?: string;
  filename?: string;
  message?: string;
  error?: string;
}

function ensureUploadsDir(): string {
  const uploadsDir = path.resolve(process.cwd(), "public", "uploads");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  return uploadsDir;
}

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

function inferExtension(filename?: string, mimeType?: string): string {
  if (filename && filename.includes('.')) return filename.split('.').pop() || '';
  if (!mimeType) return '';
  const map: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'application/pdf': 'pdf',
    'application/msword': 'doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
  };
  return map[mimeType] || '';
}

// Handle file upload for profile images and other assets
export const handleFileUpload: RequestHandler = async (req, res) => {
  try {
    const { type, filename, mimeType, data } = uploadSchema.parse(req.body);
    const userId = "kanu-portfolio"; // Default user ID

    // Extract base64 payload (strip data URL prefix if present)
    const base64 = data.includes(',') ? data.split(',')[1] : data;
    const buffer = Buffer.from(base64, 'base64');

    // Validate size (max 10MB)
    const MAX = 10 * 1024 * 1024;
    if (buffer.length > MAX) {
      return res.status(413).json({ success: false, error: 'File too large (max 10MB)' });
    }

    // Validate type
    const allowed = new Set([
      'image/jpeg', 'image/jpg', 'image/png', 'image/webp',
      'application/pdf', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ]);
    if (mimeType && !allowed.has(mimeType)) {
      return res.status(400).json({ success: false, error: 'Unsupported file type' });
    }

    const uploadsDir = ensureUploadsDir();
    const ext = inferExtension(filename, mimeType) || (type === 'document' ? 'pdf' : 'png');
    const safeName = sanitizeFilename(filename || `${type}`);
    const unique = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeName}.${ext}`;
    const filePath = path.join(uploadsDir, unique);

    // Write file to filesystem (for immediate access)
    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/${unique}`;
    const absoluteUrl = `${req.protocol}://${req.get('host')}${publicUrl}`;

    // Store file in MongoDB for persistence (if MongoDB is available)
    if (isMongoDBAvailable()) {
      try {
        // Deactivate any existing files of the same type for this user
        await FileStorage.updateMany(
          { userId, fileType: type, isActive: true },
          { isActive: false }
        );

        // Store new file in MongoDB
        const fileRecord = new FileStorage({
          userId,
          filename: unique,
          originalName: filename || `${type}.${ext}`,
          mimeType: mimeType || 'application/octet-stream',
          fileType: type,
          fileSize: buffer.length,
          fileData: buffer,
          publicUrl: absoluteUrl,
          isActive: true,
          metadata: {
            uploadedAt: new Date(),
            serverHost: req.get('host'),
            protocol: req.protocol
          }
        });

        await fileRecord.save();
        console.log(`✅ File stored in MongoDB: ${unique} (${type})`);
      } catch (mongoError) {
        console.error('❌ MongoDB storage error:', mongoError);
        // Continue with filesystem-only storage if MongoDB fails
      }
    }

    const response: UploadResponse = {
      success: true,
      url: absoluteUrl,
      filename: unique,
      message: 'File uploaded successfully',
    };

    res.json(response);
  } catch (error) {
    console.error('Upload error:', error);

    const errorResponse: UploadResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed'
    };

    res.status(400).json(errorResponse);
  }
};

// Handle file deletion
export const handleFileDelete: RequestHandler = async (req, res) => {
  try {
    const { filename } = req.params;

    if (!filename) {
      return res.status(400).json({
        success: false,
        error: 'Filename is required'
      });
    }

    const uploadsDir = ensureUploadsDir();
    const filePath = path.join(uploadsDir, sanitizeFilename(filename));

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    const response: UploadResponse = {
      success: true,
      message: 'File deleted successfully'
    };

    res.json(response);
  } catch (error) {
    console.error('Delete error:', error);

    const errorResponse: UploadResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Delete failed'
    };

    res.status(500).json(errorResponse);
  }
};

// Get upload configuration
export const getUploadConfig: RequestHandler = (req, res) => {
  const config = {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: [
      'image/jpeg', 'image/jpg', 'image/png', 'image/webp',
      'application/pdf', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
    uploadEndpoint: '/api/upload',
    storageProvider: isMongoDBAvailable() ? 'mongodb-filesystem' : 'local-filesystem',
  };

  res.json(config);
};

// Restore files from MongoDB to filesystem (called on server startup)
export const restoreFilesFromMongoDB: RequestHandler = async (req, res) => {
  try {
    if (!isMongoDBAvailable()) {
      return res.json({
        success: false,
        message: 'MongoDB not available',
        restoredCount: 0
      });
    }

    const userId = "kanu-portfolio";
    const uploadsDir = ensureUploadsDir();

    // Get all active files from MongoDB
    const files = await FileStorage.find({ userId, isActive: true });

    let restoredCount = 0;
    let skippedCount = 0;

    for (const file of files) {
      const filePath = path.join(uploadsDir, file.filename);

      // Check if file already exists in filesystem
      if (fs.existsSync(filePath)) {
        skippedCount++;
        continue;
      }

      try {
        // Restore file from MongoDB to filesystem
        fs.writeFileSync(filePath, file.fileData);
        restoredCount++;
        console.log(`✅ Restored file: ${file.filename}`);
      } catch (error) {
        console.error(`❌ Failed to restore file ${file.filename}:`, error);
      }
    }

    res.json({
      success: true,
      message: `File restoration completed`,
      restoredCount,
      skippedCount,
      totalFiles: files.length
    });

  } catch (error) {
    console.error('❌ File restoration error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to restore files',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get file from MongoDB (for serving files that might be missing from filesystem)
export const getFileFromMongoDB: RequestHandler = async (req, res) => {
  try {
    const { filename } = req.params;
    const userId = "kanu-portfolio";

    if (!isMongoDBAvailable()) {
      return res.status(503).json({
        success: false,
        error: 'MongoDB not available'
      });
    }

    const file = await FileStorage.findOne({
      userId,
      filename,
      isActive: true
    });

    if (!file) {
      return res.status(404).json({
        success: false,
        error: 'File not found'
      });
    }

    // Set appropriate headers
    res.set({
      'Content-Type': file.mimeType,
      'Content-Length': file.fileSize.toString(),
      'Cache-Control': 'public, max-age=31536000', // 1 year cache
    });

    // Send file data
    res.send(file.fileData);

  } catch (error) {
    console.error('❌ Get file from MongoDB error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve file',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
