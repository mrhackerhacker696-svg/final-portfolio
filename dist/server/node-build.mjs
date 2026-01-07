import path from "path";
import "dotenv/config";
import * as express from "express";
import express__default from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import { z } from "zod";
const handleDemo = (req, res) => {
  const response = {
    message: "Hello from Express server"
  };
  res.status(200).json(response);
};
dotenv.config();
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/kanu-portfolio";
const ENABLE_MONGODB = process.env.ENABLE_MONGODB !== "false";
let isConnected = false;
let connectionAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;
const connectDB = async () => {
  if (isConnected) {
    console.log("✅ MongoDB already connected");
    return true;
  }
  if (!ENABLE_MONGODB) {
    console.log("📱 MongoDB disabled - running in localStorage mode");
    return false;
  }
  try {
    console.log(`🔌 Attempting to connect to MongoDB...`);
    console.log(`📍 Connection URI: ${MONGODB_URI.replace(/\/\/.*@/, "//***:***@")}`);
    await mongoose.connect(MONGODB_URI);
    isConnected = true;
    connectionAttempts = 0;
    console.log("✅ MongoDB connected successfully");
    mongoose.connection.on("error", (error) => {
      console.error("❌ MongoDB connection error:", error);
      isConnected = false;
    });
    mongoose.connection.on("disconnected", () => {
      console.log("⚠️ MongoDB disconnected");
      isConnected = false;
    });
    mongoose.connection.on("reconnected", () => {
      console.log("🔄 MongoDB reconnected");
      isConnected = true;
    });
    return true;
  } catch (error) {
    connectionAttempts++;
    console.error(`❌ MongoDB connection attempt ${connectionAttempts} failed:`, error.message);
    if (connectionAttempts < MAX_RECONNECT_ATTEMPTS) {
      console.log(`🔄 Retrying connection in 5 seconds... (${connectionAttempts}/${MAX_RECONNECT_ATTEMPTS})`);
      setTimeout(() => {
        connectDB();
      }, 5e3);
      return false;
    } else {
      console.warn(`⚠️ Max reconnection attempts reached. MongoDB connection failed.`);
      console.warn(`📱 Falling back to localStorage mode`);
      return false;
    }
  }
};
const disconnectDB = async () => {
  if (!isConnected) {
    return;
  }
  try {
    await mongoose.disconnect();
    isConnected = false;
    console.log("✅ MongoDB disconnected");
  } catch (error) {
    console.error("❌ MongoDB disconnection error:", error);
  }
};
const isMongoDBAvailable = () => {
  if (!ENABLE_MONGODB) {
    return false;
  }
  return isConnected && mongoose.connection.readyState === 1;
};
const getConnectionStatus = () => {
  if (!ENABLE_MONGODB) {
    return { status: "disabled", message: "MongoDB is disabled" };
  }
  if (isConnected && mongoose.connection.readyState === 1) {
    return {
      status: "connected",
      message: "MongoDB is connected and ready",
      database: mongoose.connection.db?.databaseName || "unknown"
    };
  }
  return {
    status: "disconnected",
    message: "MongoDB is not connected",
    readyState: mongoose.connection.readyState
  };
};
process.on("SIGINT", disconnectDB);
process.on("SIGTERM", disconnectDB);
const ProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: [true, "User ID is required"],
      unique: true,
      trim: true,
      minlength: [3, "User ID must be at least 3 characters long"]
    },
    name: {
      type: String,
      default: "",
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"]
    },
    bio: {
      type: String,
      default: "",
      trim: true,
      maxlength: [1e3, "Bio cannot exceed 1000 characters"]
    },
    tagline: {
      type: String,
      default: "",
      trim: true,
      maxlength: [200, "Tagline cannot exceed 200 characters"]
    },
    experience: {
      type: String,
      default: "",
      trim: true,
      maxlength: [100, "Experience cannot exceed 100 characters"]
    },
    availability: {
      type: String,
      default: "",
      trim: true,
      maxlength: [200, "Availability cannot exceed 200 characters"]
    },
    profileImage: {
      type: String,
      default: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
      validate: {
        validator: function(v) {
          return v === "" || /^https?:\/\/.+/.test(v);
        },
        message: "Profile image must be a valid URL"
      }
    },
    logoText: {
      type: String,
      default: "⚡ logo",
      trim: true,
      maxlength: [50, "Logo text cannot exceed 50 characters"]
    },
    resumeUrl: {
      type: String,
      default: "",
      validate: {
        validator: function(v) {
          return v === "" || /^https?:\/\/.+/.test(v);
        },
        message: "Resume URL must be a valid URL"
      }
    },
    contactInfo: {
      email: {
        type: String,
        default: "kanuprajapati717@gmail.com",
        validate: {
          validator: function(v) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
          },
          message: "Please provide a valid email address"
        }
      },
      phone: {
        type: String,
        default: "+91 9876543210",
        trim: true
      },
      location: {
        type: String,
        default: "Gujarat, India",
        trim: true,
        maxlength: [100, "Location cannot exceed 100 characters"]
      },
      linkedin: {
        type: String,
        default: "https://linkedin.com/in/kanuprajapati",
        validate: {
          validator: function(v) {
            return /^https?:\/\/.+/.test(v);
          },
          message: "LinkedIn URL must be a valid URL"
        }
      },
      github: {
        type: String,
        default: "https://github.com/kanuprajapati",
        validate: {
          validator: function(v) {
            return /^https?:\/\/.+/.test(v);
          },
          message: "GitHub URL must be a valid URL"
        }
      },
      website: {
        type: String,
        default: "",
        validate: {
          validator: function(v) {
            return v === "" || /^https?:\/\/.+/.test(v);
          },
          message: "Website URL must be a valid URL"
        }
      },
      twitter: {
        type: String,
        default: "",
        validate: {
          validator: function(v) {
            return v === "" || /^https?:\/\/.+/.test(v);
          },
          message: "Twitter URL must be a valid URL"
        }
      }
    },
    // Simple skills array for profile overview (separate Skill model exists for detailed skills)
    skills: [{
      type: String,
      trim: true,
      maxlength: [50, "Each skill cannot exceed 50 characters"]
    }]
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);
const ProjectSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: [true, "User ID is required"],
      trim: true
    },
    title: {
      type: String,
      required: [true, "Project title is required"],
      trim: true,
      maxlength: [100, "Project title cannot exceed 100 characters"]
    },
    description: {
      type: String,
      required: [true, "Project description is required"],
      trim: true,
      maxlength: [500, "Project description cannot exceed 500 characters"]
    },
    fullDescription: {
      type: String,
      default: "",
      trim: true,
      maxlength: [2e3, "Full description cannot exceed 2000 characters"]
    },
    tags: [{
      type: String,
      trim: true,
      maxlength: [30, "Each tag cannot exceed 30 characters"]
    }],
    image: {
      type: String,
      required: [true, "Project image is required"],
      validate: {
        validator: function(v) {
          return /^https?:\/\/.+/.test(v);
        },
        message: "Project image must be a valid URL"
      }
    },
    status: {
      type: String,
      enum: {
        values: ["In Development", "Completed", "Live", "Published"],
        message: "Status must be one of: In Development, Completed, Live, Published"
      },
      default: "In Development"
    },
    dateCompleted: {
      type: String,
      default: "",
      validate: {
        validator: function(v) {
          if (v === "") return true;
          return /^\d{4}-\d{2}-\d{2}$/.test(v);
        },
        message: "Date completed must be in YYYY-MM-DD format"
      }
    },
    links: {
      github: {
        type: String,
        default: "",
        validate: {
          validator: function(v) {
            return v === "" || /^https?:\/\/.+/.test(v);
          },
          message: "GitHub link must be a valid URL"
        }
      },
      demo: {
        type: String,
        default: "",
        validate: {
          validator: function(v) {
            return v === "" || /^https?:\/\/.+/.test(v);
          },
          message: "Demo link must be a valid URL"
        }
      },
      live: {
        type: String,
        default: "",
        validate: {
          validator: function(v) {
            return v === "" || /^https?:\/\/.+/.test(v);
          },
          message: "Live link must be a valid URL"
        }
      }
    },
    screenshots: [{
      type: String,
      validate: {
        validator: function(v) {
          return /^https?:\/\/.+/.test(v);
        },
        message: "Screenshot must be a valid URL"
      }
    }],
    challenges: {
      type: String,
      default: "",
      trim: true,
      maxlength: [1e3, "Challenges cannot exceed 1000 characters"]
    },
    outcome: {
      type: String,
      default: "",
      trim: true,
      maxlength: [1e3, "Outcome cannot exceed 1000 characters"]
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);
const ContactMessageSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: [true, "User ID is required"],
      trim: true
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"]
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      validate: {
        validator: function(v) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: "Please provide a valid email address"
      }
    },
    phone: {
      type: String,
      default: "",
      trim: true,
      validate: {
        validator: function(v) {
          return v === "" || /^[\+]?[0-9\s\-\(\)]{10,}$/.test(v);
        },
        message: "Please provide a valid phone number"
      }
    },
    subject: {
      type: String,
      required: [true, "Subject is required"],
      trim: true,
      maxlength: [200, "Subject cannot exceed 200 characters"]
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
      maxlength: [2e3, "Message cannot exceed 2000 characters"]
    },
    contactMethod: {
      type: String,
      enum: {
        values: ["email", "sms", "call"],
        message: "Contact method must be one of: email, sms, call"
      },
      default: "email"
    },
    status: {
      type: String,
      enum: {
        values: ["new", "replied"],
        message: "Status must be one of: new, replied"
      },
      default: "new"
    },
    date: {
      type: String,
      default: () => (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      validate: {
        validator: function(v) {
          return /^\d{4}-\d{2}-\d{2}$/.test(v);
        },
        message: "Date must be in YYYY-MM-DD format"
      }
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);
const GitSettingsSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: [true, "User ID is required"],
      unique: true,
      trim: true
    },
    username: {
      type: String,
      default: "kanuprajapati",
      trim: true,
      maxlength: [50, "Username cannot exceed 50 characters"]
    },
    accessToken: {
      type: String,
      default: "",
      trim: true
    },
    isConnected: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);
const ProjectScreenshotSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: [true, "User ID is required"],
      trim: true
    },
    projectId: {
      type: String,
      required: [true, "Project ID is required"],
      trim: true
    },
    screenshots: [{
      type: String,
      validate: {
        validator: function(v) {
          return /^https?:\/\/.+/.test(v);
        },
        message: "Screenshot must be a valid URL"
      }
    }]
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);
const SMSNotificationSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: [true, "User ID is required"],
      trim: true
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
      maxlength: [500, "Message cannot exceed 500 characters"]
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      validate: {
        validator: function(v) {
          return /^[\+]?[0-9\s\-\(\)]{10,}$/.test(v);
        },
        message: "Please provide a valid phone number"
      }
    },
    category: {
      type: String,
      default: "Contact",
      trim: true,
      maxlength: [50, "Category cannot exceed 50 characters"]
    },
    status: {
      type: String,
      enum: {
        values: ["sent", "pending", "failed"],
        message: "Status must be one of: sent, pending, failed"
      },
      default: "sent"
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);
const SMSCategorySchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: [true, "User ID is required"],
      trim: true
    },
    categories: [{
      type: String,
      trim: true,
      maxlength: [50, "Each category cannot exceed 50 characters"]
    }]
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);
const UserSettingsSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: [true, "User ID is required"],
      unique: true,
      trim: true
    },
    // Admin site settings
    siteSettings: {
      siteName: {
        type: String,
        default: "Kanu Prajapati Portfolio",
        trim: true,
        maxlength: [100, "Site name cannot exceed 100 characters"]
      },
      siteDescription: {
        type: String,
        default: "Full-stack Developer specializing in modern web technologies",
        trim: true,
        maxlength: [300, "Site description cannot exceed 300 characters"]
      },
      maintenanceMode: {
        type: Boolean,
        default: false
      },
      allowRegistration: {
        type: Boolean,
        default: false
      },
      seoEnabled: {
        type: Boolean,
        default: true
      }
    },
    // Notification settings
    notificationSettings: {
      emailNotifications: {
        type: Boolean,
        default: true
      },
      smsNotifications: {
        type: Boolean,
        default: false
      },
      pushNotifications: {
        type: Boolean,
        default: true
      },
      emailOnNewMessage: {
        type: Boolean,
        default: true
      },
      smsOnUrgent: {
        type: Boolean,
        default: false
      },
      mobileNumber: {
        type: String,
        default: "",
        validate: {
          validator: function(v) {
            return v === "" || /^[\+]?[0-9\s\-\(\)]{10,}$/.test(v);
          },
          message: "Please provide a valid mobile number"
        }
      }
    },
    theme: {
      type: String,
      enum: {
        values: ["light", "dark", "system"],
        message: "Theme must be one of: light, dark, system"
      },
      default: "system"
    },
    language: {
      type: String,
      default: "en",
      enum: {
        values: ["en", "hi", "gu"],
        message: "Language must be one of: en, hi, gu"
      }
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);
const ActivitySchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: [true, "User ID is required"],
      trim: true
    },
    title: {
      type: String,
      required: [true, "Activity title is required"],
      trim: true,
      maxlength: [100, "Activity title cannot exceed 100 characters"]
    },
    description: {
      type: String,
      required: [true, "Activity description is required"],
      trim: true,
      maxlength: [500, "Activity description cannot exceed 500 characters"]
    },
    type: {
      type: String,
      enum: {
        values: ["project", "skill", "achievement", "education", "work"],
        message: "Type must be one of: project, skill, achievement, education, work"
      },
      default: "project"
    },
    date: {
      type: String,
      required: [true, "Activity date is required"],
      validate: {
        validator: function(v) {
          return /^\d{4}-\d{2}-\d{2}$/.test(v);
        },
        message: "Date must be in YYYY-MM-DD format"
      }
    },
    icon: {
      type: String,
      default: "📋",
      trim: true,
      maxlength: [10, "Icon cannot exceed 10 characters"]
    },
    category: {
      type: String,
      default: "General",
      trim: true,
      maxlength: [50, "Category cannot exceed 50 characters"]
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);
const SkillSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: [true, "User ID is required"],
      trim: true
    },
    name: {
      type: String,
      required: [true, "Skill name is required"],
      trim: true,
      maxlength: [100, "Skill name cannot exceed 100 characters"]
    },
    category: {
      type: String,
      required: [true, "Skill category is required"],
      trim: true,
      maxlength: [50, "Skill category cannot exceed 50 characters"]
    },
    level: {
      type: Number,
      min: [1, "Skill level must be at least 1"],
      max: [100, "Skill level cannot exceed 100"],
      default: 50,
      validate: {
        validator: Number.isInteger,
        message: "Skill level must be a whole number"
      }
    },
    years: {
      type: Number,
      default: 1,
      min: [0, "Years cannot be negative"],
      max: [50, "Years cannot exceed 50"],
      validate: {
        validator: Number.isInteger,
        message: "Years must be a whole number"
      }
    },
    icon: {
      type: String,
      default: "⚡",
      trim: true,
      maxlength: [10, "Icon cannot exceed 10 characters"]
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);
const FileStorageSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: [true, "User ID is required"],
      trim: true
    },
    filename: {
      type: String,
      required: [true, "Filename is required"],
      trim: true,
      maxlength: [255, "Filename cannot exceed 255 characters"]
    },
    originalName: {
      type: String,
      required: [true, "Original filename is required"],
      trim: true,
      maxlength: [255, "Original filename cannot exceed 255 characters"]
    },
    mimeType: {
      type: String,
      required: [true, "MIME type is required"],
      trim: true,
      maxlength: [100, "MIME type cannot exceed 100 characters"]
    },
    fileType: {
      type: String,
      required: [true, "File type is required"],
      enum: {
        values: ["profile-image", "project-image", "document", "resume"],
        message: "File type must be one of: profile-image, project-image, document, resume"
      }
    },
    fileSize: {
      type: Number,
      required: [true, "File size is required"],
      min: [1, "File size must be at least 1 byte"],
      max: [10 * 1024 * 1024, "File size cannot exceed 10MB"]
    },
    fileData: {
      type: Buffer,
      required: [true, "File data is required"]
    },
    publicUrl: {
      type: String,
      required: [true, "Public URL is required"],
      trim: true,
      maxlength: [500, "Public URL cannot exceed 500 characters"]
    },
    isActive: {
      type: Boolean,
      default: true
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function(doc, ret) {
        delete ret.fileData;
        return ret;
      }
    },
    toObject: { virtuals: true }
  }
);
ProjectSchema.index({ userId: 1, createdAt: -1 });
ProjectSchema.index({ userId: 1, status: 1 });
ContactMessageSchema.index({ userId: 1, createdAt: -1 });
ContactMessageSchema.index({ userId: 1, status: 1 });
ActivitySchema.index({ userId: 1, type: 1, date: -1 });
SkillSchema.index({ userId: 1, category: 1 });
FileStorageSchema.index({ userId: 1, fileType: 1 });
FileStorageSchema.index({ userId: 1, filename: 1 });
FileStorageSchema.index({ userId: 1, isActive: 1 });
const Profile = mongoose.models.Profile || mongoose.model("Profile", ProfileSchema);
const Project = mongoose.models.Project || mongoose.model("Project", ProjectSchema);
const ContactMessage = mongoose.models.ContactMessage || mongoose.model(
  "ContactMessage",
  ContactMessageSchema
);
const GitSettings = mongoose.models.GitSettings || mongoose.model("GitSettings", GitSettingsSchema);
mongoose.models.ProjectScreenshot || mongoose.model(
  "ProjectScreenshot",
  ProjectScreenshotSchema
);
const SMSNotification = mongoose.models.SMSNotification || mongoose.model(
  "SMSNotification",
  SMSNotificationSchema
);
const SMSCategory = mongoose.models.SMSCategory || mongoose.model("SMSCategory", SMSCategorySchema);
const UserSettings = mongoose.models.UserSettings || mongoose.model("UserSettings", UserSettingsSchema);
const Activity = mongoose.models.Activity || mongoose.model("Activity", ActivitySchema);
const Skill = mongoose.models.Skill || mongoose.model("Skill", SkillSchema);
const FileStorage = mongoose.models.FileStorage || mongoose.model("FileStorage", FileStorageSchema);
const router$8 = express__default.Router();
const checkMongoDB$1 = (req, res, next) => {
  if (!isMongoDBAvailable()) {
    return res.status(503).json({
      error: "MongoDB not available",
      message: "Please use localStorage or set up MongoDB connection",
      code: "MONGODB_UNAVAILABLE"
    });
  }
  next();
};
router$8.get("/", checkMongoDB$1, async (req, res) => {
  try {
    const userId = "kanu-portfolio";
    let profile = await Profile.findOne({ userId });
    if (!profile) {
      profile = new Profile({ userId });
      await profile.save();
      console.log("✅ Created default profile for user:", userId);
    }
    res.json({
      success: true,
      data: profile,
      message: "Profile retrieved successfully"
    });
  } catch (error) {
    console.error("❌ Error fetching profile:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch profile",
      message: error.message
    });
  }
});
router$8.put("/", checkMongoDB$1, async (req, res) => {
  try {
    const userId = "kanu-portfolio";
    const updateData = req.body;
    if (!updateData) {
      return res.status(400).json({
        success: false,
        error: "Missing update data",
        message: "Please provide data to update"
      });
    }
    const profile = await Profile.findOneAndUpdate(
      { userId },
      updateData,
      {
        new: true,
        upsert: true,
        runValidators: true
        // Run schema validators
      }
    );
    res.json({
      success: true,
      data: profile,
      message: "Profile updated successfully"
    });
  } catch (error) {
    console.error("❌ Error updating profile:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        error: "Validation Error",
        message: error.message,
        details: error.errors
      });
    }
    res.status(500).json({
      success: false,
      error: "Failed to update profile",
      message: error.message
    });
  }
});
router$8.put("/image", checkMongoDB$1, async (req, res) => {
  try {
    const userId = "kanu-portfolio";
    const { profileImage } = req.body;
    if (!profileImage) {
      return res.status(400).json({
        success: false,
        error: "Missing profile image",
        message: "Please provide a profile image URL"
      });
    }
    const profile = await Profile.findOneAndUpdate(
      { userId },
      { profileImage },
      {
        new: true,
        upsert: true,
        runValidators: true
      }
    );
    res.json({
      success: true,
      data: profile,
      message: "Profile image updated successfully"
    });
  } catch (error) {
    console.error("❌ Error updating profile image:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        error: "Validation Error",
        message: error.message,
        details: error.errors
      });
    }
    res.status(500).json({
      success: false,
      error: "Failed to update profile image",
      message: error.message
    });
  }
});
router$8.put("/logo", checkMongoDB$1, async (req, res) => {
  try {
    const userId = "kanu-portfolio";
    const { logoText } = req.body;
    if (!logoText) {
      return res.status(400).json({
        success: false,
        error: "Missing logo text",
        message: "Please provide logo text"
      });
    }
    const profile = await Profile.findOneAndUpdate(
      { userId },
      { logoText },
      {
        new: true,
        upsert: true,
        runValidators: true
      }
    );
    res.json({
      success: true,
      data: profile,
      message: "Logo updated successfully"
    });
  } catch (error) {
    console.error("❌ Error updating logo:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        error: "Validation Error",
        message: error.message,
        details: error.errors
      });
    }
    res.status(500).json({
      success: false,
      error: "Failed to update logo",
      message: error.message
    });
  }
});
router$8.put("/resume", checkMongoDB$1, async (req, res) => {
  try {
    const userId = "kanu-portfolio";
    const { resumeUrl } = req.body;
    if (!resumeUrl) {
      return res.status(400).json({
        success: false,
        error: "Missing resume URL",
        message: "Please provide a resume URL"
      });
    }
    const profile = await Profile.findOneAndUpdate(
      { userId },
      { resumeUrl },
      {
        new: true,
        upsert: true,
        runValidators: true
      }
    );
    res.json({
      success: true,
      data: profile,
      message: "Resume URL updated successfully"
    });
  } catch (error) {
    console.error("❌ Error updating resume URL:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        error: "Validation Error",
        message: error.message,
        details: error.errors
      });
    }
    res.status(500).json({
      success: false,
      error: "Failed to update resume URL",
      message: error.message
    });
  }
});
router$8.put("/contact", checkMongoDB$1, async (req, res) => {
  try {
    const userId = "kanu-portfolio";
    const { contactInfo } = req.body;
    if (!contactInfo) {
      return res.status(400).json({
        success: false,
        error: "Missing contact info",
        message: "Please provide contact information"
      });
    }
    const profile = await Profile.findOneAndUpdate(
      { userId },
      { contactInfo },
      {
        new: true,
        upsert: true,
        runValidators: true
      }
    );
    res.json({
      success: true,
      data: profile,
      message: "Contact info updated successfully"
    });
  } catch (error) {
    console.error("❌ Error updating contact info:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        error: "Validation Error",
        message: error.message,
        details: error.errors
      });
    }
    res.status(500).json({
      success: false,
      error: "Failed to update contact info",
      message: error.message
    });
  }
});
router$8.delete("/", checkMongoDB$1, async (req, res) => {
  try {
    const userId = "kanu-portfolio";
    const profile = await Profile.findOneAndDelete({ userId });
    if (!profile) {
      return res.status(404).json({
        success: false,
        error: "Profile not found",
        message: "No profile exists for this user"
      });
    }
    res.json({
      success: true,
      message: "Profile deleted successfully",
      deletedProfile: profile
    });
  } catch (error) {
    console.error("❌ Error deleting profile:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete profile",
      message: error.message
    });
  }
});
router$8.get("/stats", checkMongoDB$1, async (req, res) => {
  try {
    const userId = "kanu-portfolio";
    const profile = await Profile.findOne({ userId });
    if (!profile) {
      return res.status(404).json({
        success: false,
        error: "Profile not found",
        message: "No profile exists for this user"
      });
    }
    const stats = {
      lastUpdated: profile.updatedAt,
      createdAt: profile.createdAt,
      hasProfileImage: !!profile.profileImage,
      hasResume: !!profile.resumeUrl,
      contactInfoComplete: !!(profile.contactInfo?.email && profile.contactInfo?.phone),
      socialLinks: {
        linkedin: !!profile.contactInfo?.linkedin,
        github: !!profile.contactInfo?.github
      }
    };
    res.json({
      success: true,
      data: stats,
      message: "Profile statistics retrieved successfully"
    });
  } catch (error) {
    console.error("❌ Error fetching profile stats:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch profile statistics",
      message: error.message
    });
  }
});
const router$7 = express__default.Router();
const checkMongoDB = (req, res, next) => {
  if (!isMongoDBAvailable()) {
    return res.status(503).json({
      error: "MongoDB not available",
      message: "Please use localStorage or set up MongoDB connection",
      code: "MONGODB_UNAVAILABLE"
    });
  }
  next();
};
router$7.get("/", checkMongoDB, async (req, res) => {
  try {
    const userId = "kanu-portfolio";
    const { status, category, limit, page } = req.query;
    let query = { userId };
    if (status) {
      query.status = status;
    }
    if (category) {
      query.tags = { $in: [category] };
    }
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const skip = (pageNum - 1) * limitNum;
    const projects = await Project.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum);
    const total = await Project.countDocuments(query);
    res.json({
      success: true,
      data: projects,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      },
      message: `Retrieved ${projects.length} projects successfully`
    });
  } catch (error) {
    console.error("❌ Error fetching projects:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch projects",
      message: error.message
    });
  }
});
router$7.get("/:id", checkMongoDB, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = "kanu-portfolio";
    const project = await Project.findOne({ _id: id, userId });
    if (!project) {
      return res.status(404).json({
        success: false,
        error: "Project not found",
        message: "No project found with the provided ID"
      });
    }
    res.json({
      success: true,
      data: project,
      message: "Project retrieved successfully"
    });
  } catch (error) {
    console.error("❌ Error fetching project:", error);
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        error: "Invalid ID format",
        message: "Please provide a valid project ID"
      });
    }
    res.status(500).json({
      success: false,
      error: "Failed to fetch project",
      message: error.message
    });
  }
});
router$7.post("/", checkMongoDB, async (req, res) => {
  try {
    const userId = "kanu-portfolio";
    const projectData = { ...req.body, userId };
    if (!projectData.title || !projectData.description || !projectData.image) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields",
        message: "Title, description, and image are required",
        required: ["title", "description", "image"]
      });
    }
    if (!projectData.fullDescription) {
      projectData.fullDescription = `This is a project developed with modern web technologies.

Key Features:
• Modern and responsive design
• Clean and efficient code structure
• User-friendly interface
• Cross-platform compatibility

Technical Implementation:
Built using industry-standard technologies and best practices to ensure optimal performance and maintainability.`;
    }
    if (!projectData.challenges) {
      projectData.challenges = "Developing a robust and scalable solution while maintaining clean code architecture and ensuring optimal user experience.";
    }
    if (!projectData.outcome) {
      projectData.outcome = "Successfully delivered a high-quality project that meets all requirements and provides excellent user experience.";
    }
    if (!projectData.screenshots) {
      projectData.screenshots = [
        projectData.image,
        projectData.image,
        projectData.image
      ];
    }
    if (!projectData.dateCompleted) {
      projectData.dateCompleted = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    }
    const project = new Project(projectData);
    await project.save();
    console.log("✅ Created new project:", project.title);
    res.status(201).json({
      success: true,
      data: project,
      message: "Project created successfully"
    });
  } catch (error) {
    console.error("❌ Error creating project:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        error: "Validation Error",
        message: error.message,
        details: error.errors
      });
    }
    res.status(500).json({
      success: false,
      error: "Failed to create project",
      message: error.message
    });
  }
});
router$7.put("/:id", checkMongoDB, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = "kanu-portfolio";
    const updateData = req.body;
    if (!updateData || Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        error: "Missing update data",
        message: "Please provide data to update"
      });
    }
    const project = await Project.findOneAndUpdate(
      { _id: id, userId },
      updateData,
      {
        new: true,
        runValidators: true
      }
    );
    if (!project) {
      return res.status(404).json({
        success: false,
        error: "Project not found",
        message: "No project found with the provided ID"
      });
    }
    console.log("✅ Updated project:", project.title);
    res.json({
      success: true,
      data: project,
      message: "Project updated successfully"
    });
  } catch (error) {
    console.error("❌ Error updating project:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        error: "Validation Error",
        message: error.message,
        details: error.errors
      });
    }
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        error: "Invalid ID format",
        message: "Please provide a valid project ID"
      });
    }
    res.status(500).json({
      success: false,
      error: "Failed to update project",
      message: error.message
    });
  }
});
router$7.delete("/:id", checkMongoDB, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = "kanu-portfolio";
    const project = await Project.findOneAndDelete({ _id: id, userId });
    if (!project) {
      return res.status(404).json({
        success: false,
        error: "Project not found",
        message: "No project found with the provided ID"
      });
    }
    console.log("✅ Deleted project:", project.title);
    res.json({
      success: true,
      message: "Project deleted successfully",
      deletedProject: project
    });
  } catch (error) {
    console.error("❌ Error deleting project:", error);
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        error: "Invalid ID format",
        message: "Please provide a valid project ID"
      });
    }
    res.status(500).json({
      success: false,
      error: "Failed to delete project",
      message: error.message
    });
  }
});
router$7.get("/stats/overview", checkMongoDB, async (req, res) => {
  try {
    const userId = "kanu-portfolio";
    const stats = await Project.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: null,
          totalProjects: { $sum: 1 },
          completedProjects: {
            $sum: { $cond: [{ $eq: ["$status", "Completed"] }, 1, 0] }
          },
          liveProjects: {
            $sum: { $cond: [{ $eq: ["$status", "Live"] }, 1, 0] }
          },
          inDevelopmentProjects: {
            $sum: { $cond: [{ $eq: ["$status", "In Development"] }, 1, 0] }
          },
          publishedProjects: {
            $sum: { $cond: [{ $eq: ["$status", "Published"] }, 1, 0] }
          }
        }
      }
    ]);
    const totalTags = await Project.aggregate([
      { $match: { userId } },
      { $unwind: "$tags" },
      { $group: { _id: "$tags", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    const response = {
      success: true,
      data: {
        overview: stats[0] || {
          totalProjects: 0,
          completedProjects: 0,
          liveProjects: 0,
          inDevelopmentProjects: 0,
          publishedProjects: 0
        },
        topTags: totalTags,
        totalTags: totalTags.length
      },
      message: "Project statistics retrieved successfully"
    };
    res.json(response);
  } catch (error) {
    console.error("❌ Error fetching project stats:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch project statistics",
      message: error.message
    });
  }
});
router$7.get("/search", checkMongoDB, async (req, res) => {
  try {
    const userId = "kanu-portfolio";
    const { q, status, tags, limit = 10 } = req.query;
    let query = { userId };
    if (q) {
      query.$or = [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { fullDescription: { $regex: q, $options: "i" } },
        { tags: { $in: [new RegExp(q, "i")] } }
      ];
    }
    if (status) {
      query.status = status;
    }
    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : [tags];
      query.tags = { $in: tagArray };
    }
    const projects = await Project.find(query).sort({ createdAt: -1 }).limit(parseInt(limit));
    res.json({
      success: true,
      data: projects,
      count: projects.length,
      message: `Found ${projects.length} projects matching your search`
    });
  } catch (error) {
    console.error("❌ Error searching projects:", error);
    res.status(500).json({
      success: false,
      error: "Failed to search projects",
      message: error.message
    });
  }
});
const router$6 = express__default.Router();
router$6.get("/", async (req, res) => {
  try {
    const userId = "kanu-portfolio";
    const messages = await ContactMessage.find({ userId }).sort({
      createdAt: -1
    });
    res.json(messages);
  } catch (error) {
    console.error("Error fetching contact messages:", error);
    res.status(500).json({ error: "Failed to fetch contact messages" });
  }
});
router$6.post("/", async (req, res) => {
  try {
    const userId = "kanu-portfolio";
    const messageData = { ...req.body, userId };
    const message = new ContactMessage(messageData);
    await message.save();
    res.status(201).json(message);
  } catch (error) {
    console.error("Error creating contact message:", error);
    res.status(500).json({ error: "Failed to create contact message" });
  }
});
router$6.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const message = await ContactMessage.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    if (!message) {
      return res.status(404).json({ error: "Contact message not found" });
    }
    res.json(message);
  } catch (error) {
    console.error("Error updating contact message:", error);
    res.status(500).json({ error: "Failed to update contact message" });
  }
});
router$6.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const message = await ContactMessage.findByIdAndDelete(id);
    if (!message) {
      return res.status(404).json({ error: "Contact message not found" });
    }
    res.json({ message: "Contact message deleted successfully" });
  } catch (error) {
    console.error("Error deleting contact message:", error);
    res.status(500).json({ error: "Failed to delete contact message" });
  }
});
const router$5 = express__default.Router();
router$5.get("/", async (req, res) => {
  try {
    const userId = "kanu-portfolio";
    let settings = await GitSettings.findOne({ userId });
    if (!settings) {
      settings = new GitSettings({ userId });
      await settings.save();
    }
    res.json(settings);
  } catch (error) {
    console.error("Error fetching git settings:", error);
    res.status(500).json({ error: "Failed to fetch git settings" });
  }
});
router$5.put("/", async (req, res) => {
  try {
    const userId = "kanu-portfolio";
    const updateData = req.body;
    const settings = await GitSettings.findOneAndUpdate(
      { userId },
      updateData,
      { new: true, upsert: true }
    );
    res.json(settings);
  } catch (error) {
    console.error("Error updating git settings:", error);
    res.status(500).json({ error: "Failed to update git settings" });
  }
});
const router$4 = express__default.Router();
router$4.post("/migrate", async (req, res) => {
  try {
    if (!isMongoDBAvailable()) {
      return res.status(503).json({
        success: false,
        error: "MongoDB not available",
        message: "MongoDB is not connected. Please set up MongoDB and set ENABLE_MONGODB=true to use migration.",
        mongodbAvailable: false
      });
    }
    const { localStorageData } = req.body;
    const userId = "kanu-portfolio";
    const migrationResults = {
      profile: null,
      projects: [],
      contacts: [],
      gitSettings: null,
      smsNotifications: [],
      smsCategories: null,
      userSettings: null,
      activities: [],
      skills: [],
      errors: []
    };
    if (localStorageData.profileData) {
      try {
        const profileData = JSON.parse(localStorageData.profileData);
        const profile = await Profile.findOneAndUpdate(
          { userId },
          { ...profileData, userId },
          { new: true, upsert: true }
        );
        migrationResults.profile = profile;
      } catch (error) {
        migrationResults.errors.push(
          "Failed to migrate profile data: " + error.message
        );
      }
    }
    if (localStorageData.adminProjects) {
      try {
        const projectsData = JSON.parse(localStorageData.adminProjects);
        for (const projectData of projectsData) {
          const existingProject = await Project.findOne({
            userId,
            title: projectData.title
          });
          if (!existingProject) {
            const project = new Project({
              ...projectData,
              userId,
              fullDescription: projectData.fullDescription || `This is a project developed with modern web technologies.

Key Features:
• Modern and responsive design
• Clean and efficient code structure
• User-friendly interface
• Cross-platform compatibility

Technical Implementation:
Built using industry-standard technologies and best practices to ensure optimal performance and maintainability.`,
              challenges: projectData.challenges || "Developing a robust and scalable solution while maintaining clean code architecture and ensuring optimal user experience.",
              outcome: projectData.outcome || "Successfully delivered a high-quality project that meets all requirements and provides excellent user experience.",
              screenshots: projectData.screenshots || [
                projectData.image,
                projectData.image,
                projectData.image
              ],
              dateCompleted: projectData.dateCompleted || (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
            });
            await project.save();
            migrationResults.projects.push(project);
          }
        }
      } catch (error) {
        migrationResults.errors.push(
          "Failed to migrate projects data: " + error.message
        );
      }
    }
    if (localStorageData.contactMessages) {
      try {
        const contactsData = JSON.parse(localStorageData.contactMessages);
        for (const contactData of contactsData) {
          const existingMessage = await ContactMessage.findOne({
            userId,
            name: contactData.name,
            email: contactData.email,
            subject: contactData.subject
          });
          if (!existingMessage) {
            const message = new ContactMessage({
              ...contactData,
              userId
            });
            await message.save();
            migrationResults.contacts.push(message);
          }
        }
      } catch (error) {
        migrationResults.errors.push(
          "Failed to migrate contact messages: " + error.message
        );
      }
    }
    if (localStorageData.gitSettings) {
      try {
        const gitData = JSON.parse(localStorageData.gitSettings);
        const gitSettings = await GitSettings.findOneAndUpdate(
          { userId },
          { ...gitData, userId },
          { new: true, upsert: true }
        );
        migrationResults.gitSettings = gitSettings;
      } catch (error) {
        migrationResults.errors.push(
          "Failed to migrate git settings: " + error.message
        );
      }
    }
    if (localStorageData.smsNotifications) {
      try {
        const smsData = JSON.parse(localStorageData.smsNotifications);
        for (const smsItem of smsData) {
          const existingNotification = await SMSNotification.findOne({
            userId,
            message: smsItem.message,
            phone: smsItem.phone,
            timestamp: smsItem.timestamp
          });
          if (!existingNotification) {
            const notification = new SMSNotification({
              ...smsItem,
              userId
            });
            await notification.save();
            migrationResults.smsNotifications.push(notification);
          }
        }
      } catch (error) {
        migrationResults.errors.push(
          "Failed to migrate SMS notifications: " + error.message
        );
      }
    }
    if (localStorageData.smsCategories) {
      try {
        const categoriesData = JSON.parse(localStorageData.smsCategories);
        const smsCategories = await SMSCategory.findOneAndUpdate(
          { userId },
          { categories: categoriesData, userId },
          { new: true, upsert: true }
        );
        migrationResults.smsCategories = smsCategories;
      } catch (error) {
        migrationResults.errors.push(
          "Failed to migrate SMS categories: " + error.message
        );
      }
    }
    if (localStorageData.notificationSettings) {
      try {
        const settingsData = JSON.parse(localStorageData.notificationSettings);
        const userSettings = await UserSettings.findOneAndUpdate(
          { userId },
          { notificationSettings: settingsData, userId },
          { new: true, upsert: true }
        );
        migrationResults.userSettings = userSettings;
      } catch (error) {
        migrationResults.errors.push(
          "Failed to migrate notification settings: " + error.message
        );
      }
    }
    if (localStorageData.activities) {
      try {
        const activitiesData = JSON.parse(localStorageData.activities);
        for (const activityData of activitiesData) {
          const existingActivity = await Activity.findOne({
            userId,
            title: activityData.title,
            date: activityData.date
          });
          if (!existingActivity) {
            const activity = new Activity({
              ...activityData,
              userId
            });
            await activity.save();
            migrationResults.activities.push(activity);
          }
        }
      } catch (error) {
        migrationResults.errors.push(
          "Failed to migrate activities: " + error.message
        );
      }
    }
    if (localStorageData.skills) {
      try {
        const skillsData = JSON.parse(localStorageData.skills);
        for (const skillData of skillsData) {
          const existingSkill = await Skill.findOne({
            userId,
            name: skillData.name,
            category: skillData.category
          });
          if (!existingSkill) {
            const skill = new Skill({
              ...skillData,
              userId
            });
            await skill.save();
            migrationResults.skills.push(skill);
          }
        }
      } catch (error) {
        migrationResults.errors.push(
          "Failed to migrate skills: " + error.message
        );
      }
    }
    res.json({
      success: true,
      message: "Data migration completed",
      results: migrationResults
    });
  } catch (error) {
    console.error("Migration error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to migrate data",
      details: error.message
    });
  }
});
router$4.get("/status", async (req, res) => {
  try {
    if (!isMongoDBAvailable()) {
      return res.json({
        hasProfile: false,
        projectsCount: 0,
        contactsCount: 0,
        hasGitSettings: false,
        smsNotificationsCount: 0,
        hasSmsCategories: false,
        hasUserSettings: false,
        activitiesCount: 0,
        skillsCount: 0,
        migrated: false,
        mongodbAvailable: false,
        message: "MongoDB is not available. Currently running in localStorage mode."
      });
    }
    const userId = "kanu-portfolio";
    const profile = await Profile.findOne({ userId });
    const projectsCount = await Project.countDocuments({ userId });
    const contactsCount = await ContactMessage.countDocuments({ userId });
    const gitSettings = await GitSettings.findOne({ userId });
    const smsNotificationsCount = await SMSNotification.countDocuments({ userId });
    const smsCategories = await SMSCategory.findOne({ userId });
    const userSettings = await UserSettings.findOne({ userId });
    const activitiesCount = await Activity.countDocuments({ userId });
    const skillsCount = await Skill.countDocuments({ userId });
    res.json({
      hasProfile: !!profile,
      projectsCount,
      contactsCount,
      hasGitSettings: !!gitSettings,
      smsNotificationsCount,
      hasSmsCategories: !!smsCategories,
      hasUserSettings: !!userSettings,
      activitiesCount,
      skillsCount,
      migrated: !!(profile || projectsCount > 0 || contactsCount > 0 || gitSettings || smsNotificationsCount > 0 || smsCategories || userSettings || activitiesCount > 0 || skillsCount > 0),
      mongodbAvailable: true
    });
  } catch (error) {
    console.error("Error checking migration status:", error);
    res.status(500).json({ error: "Failed to check migration status" });
  }
});
const router$3 = express__default.Router();
router$3.post("/send-email", async (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({
      error: "Missing required fields",
      details: "Name, email, and message are required"
    });
  }
  const toAddress = process.env.NOTIFY_EMAIL_TO || "kanuprajapati717@gmail.com";
  try {
    let transporter;
    if (process.env.SMTP_HOST && process.env.SMTP_PORT && process.env.SMTP_USER && process.env.SMTP_PASS) {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: Number(process.env.SMTP_PORT) === 465,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });
    } else {
      transporter = nodemailer.createTransport({
        jsonTransport: true
      });
    }
    const mailOptions = {
      from: process.env.SMTP_FROM || `"Portfolio" <no-reply@localhost>`,
      to: toAddress,
      subject: subject || "Contact Form Submission",
      text: `From: ${name} (${email})
Phone: ${phone || "-"}

${message}`,
      html: `<p><strong>From:</strong> ${name} (${email})</p><p><strong>Phone:</strong> ${phone || "-"}</p><p>${message}</p>`
    };
    const info = await transporter.sendMail(mailOptions);
    return res.json({ success: true, messageId: info.messageId || void 0 });
  } catch (error) {
    console.error("Email send error:", error);
    return res.status(500).json({ success: false, error: error.message || "Failed to send email" });
  }
});
const EXOTEL_API_KEY = "54eb9c9619caf90688b7b471754ac2ec13cf8d8aee190085";
const EXOTEL_API_TOKEN = "5f4733d9896080a6e233b766a3ab157d9f26480325430b82";
const EXOTEL_SID = "kanu-portfolio";
const EXOTEL_FROM_NUMBER = "+919876543210";
const EXOTEL_SUBDOMAIN = "api.exotel.com";
async function sendSMSSimple(to, message) {
  try {
    console.log("📱 Attempting Fast2SMS service...");
    const FAST2SMS_API_KEY = "nA4xNrqjHmmtHQFJNC7cd3O7cmKdB2rinF9jf82STNRfrpyiyOc4snEA0VCK";
    const FAST2SMS_SENDER = "KANUPO";
    const cleanNumber = to.replace(/^\+91/, "").replace(/^\+/, "").replace(/\s/g, "");
    console.log("📱 Fast2SMS Details:");
    console.log("   To:", to, "-> Clean:", cleanNumber);
    console.log("   Message:", message);
    console.log("   Sender:", FAST2SMS_SENDER);
    const url = `https://www.fast2sms.com/dev/bulkV2?authorization=${FAST2SMS_API_KEY}&message=${encodeURIComponent(message)}&language=english&route=q&numbers=${cleanNumber}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "User-Agent": "Kanu-Portfolio/1.0"
      }
    });
    const data = await response.json();
    console.log("📱 Fast2SMS Response Status:", response.status);
    console.log("📱 Fast2SMS Response:", JSON.stringify(data, null, 2));
    if (response.ok && data.return === true) {
      console.log("✅ SMS sent via Fast2SMS:", data.request_id);
      return {
        success: true,
        messageId: data.request_id || `fast2sms_${Date.now()}`
      };
    } else {
      console.error("❌ Fast2SMS error:", data);
      return {
        success: false,
        error: data.message || data.error || "Fast2SMS API error"
      };
    }
  } catch (error) {
    console.error("❌ Fast2SMS SMS error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
}
let twilioClient = null;
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
  try {
    const twilio = require("twilio");
    twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    console.log("✅ Twilio configured for SMS sending");
  } catch (e) {
    console.warn("Twilio package not installed or failed to initialize. Run `npm i twilio` if you want SMS sending.");
  }
}
async function sendSMSViaExotel(to, message) {
  try {
    const url = `https://${EXOTEL_SUBDOMAIN}/v1/Accounts/${EXOTEL_SID}/Sms/send.json`;
    const auth = Buffer.from(`${EXOTEL_API_KEY}:${EXOTEL_API_TOKEN}`).toString("base64");
    const formData = new URLSearchParams({
      "From": EXOTEL_FROM_NUMBER,
      "To": to,
      "Body": message,
      "StatusCallback": "https://webhook.site/your-webhook-url"
      // Optional callback URL
    });
    console.log("📱 Sending SMS via Exotel to:", to);
    console.log("📱 Exotel URL:", url);
    console.log("📱 Auth Key:", EXOTEL_API_KEY.substring(0, 8) + "...");
    console.log("📱 From Number:", EXOTEL_FROM_NUMBER);
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept": "application/json",
        "User-Agent": "Kanu-Portfolio/1.0"
      },
      body: formData
    });
    const responseText = await response.text();
    console.log("📱 Exotel Response Status:", response.status);
    console.log("📱 Exotel Response:", responseText);
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error("❌ Failed to parse Exotel response:", parseError);
      return {
        success: false,
        error: `Invalid response from Exotel: ${responseText}`
      };
    }
    if (response.ok) {
      if (data.Response && data.Response.SmsSid) {
        console.log("✅ SMS sent via Exotel:", data.Response.SmsSid);
        return {
          success: true,
          messageId: data.Response.SmsSid
        };
      } else if (data.RestException) {
        console.error("❌ Exotel API error:", data.RestException);
        return {
          success: false,
          error: data.RestException.Message || "Exotel API error"
        };
      } else {
        console.error("❌ Unexpected Exotel response:", data);
        return {
          success: false,
          error: "Unexpected response from Exotel API"
        };
      }
    } else {
      console.error("❌ Exotel HTTP error:", response.status, data);
      return {
        success: false,
        error: data.RestException?.Message || `HTTP ${response.status}: ${response.statusText}`
      };
    }
  } catch (error) {
    console.error("❌ Exotel SMS request error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
}
const router$2 = express__default.Router();
router$2.get("/notifications", async (req, res) => {
  try {
    const userId = "kanu-portfolio";
    const notifications = await SMSNotification.find({ userId }).sort({
      createdAt: -1
    });
    res.json(notifications);
  } catch (error) {
    console.error("Error fetching SMS notifications:", error);
    res.status(500).json({ error: "Failed to fetch SMS notifications" });
  }
});
router$2.post("/notifications", async (req, res) => {
  try {
    const userId = "kanu-portfolio";
    const notificationData = { ...req.body, userId };
    const notification = new SMSNotification(notificationData);
    await notification.save();
    res.status(201).json(notification);
  } catch (error) {
    console.error("Error creating SMS notification:", error);
    res.status(500).json({ error: "Failed to create SMS notification" });
  }
});
router$2.post("/send", async (req, res) => {
  const userId = "kanu-portfolio";
  const { to, message, category = "Contact" } = req.body;
  if (!to || !message) {
    return res.status(400).json({ error: "'to' and 'message' are required" });
  }
  try {
    let smsResult;
    let provider = "";
    console.log("📱 Attempting to send SMS via Fast2SMS...");
    smsResult = await sendSMSSimple(to, message);
    if (smsResult.success) {
      provider = "Fast2SMS";
    } else {
      console.log("❌ Fast2SMS failed:", smsResult.error);
      console.log("📱 Trying Exotel fallback...");
      const exotelResult = await sendSMSViaExotel(to, message);
      if (exotelResult.success) {
        smsResult = exotelResult;
        provider = "Exotel";
      } else {
        console.log("❌ Exotel failed, trying Twilio fallback...");
        if (twilioClient && process.env.TWILIO_FROM_NUMBER) {
          try {
            const twilioResponse = await twilioClient.messages.create({
              body: message,
              to,
              from: process.env.TWILIO_FROM_NUMBER
            });
            smsResult = {
              success: true,
              messageId: twilioResponse.sid
            };
            provider = "Twilio";
          } catch (twilioError) {
            smsResult = {
              success: false,
              error: `Fast2SMS: ${smsResult.error}, Exotel: ${exotelResult.error}, Twilio: ${twilioError.message}`
            };
          }
        } else {
          smsResult = {
            success: false,
            error: `All SMS providers failed. Fast2SMS: ${smsResult.error}, Exotel: ${exotelResult.error}`
          };
        }
      }
    }
    const notification = new SMSNotification({
      userId,
      message,
      phone: to,
      category,
      status: smsResult.success ? "sent" : "failed",
      timestamp: /* @__PURE__ */ new Date()
    });
    await notification.save();
    if (smsResult.success) {
      return res.json({
        success: true,
        messageId: smsResult.messageId,
        provider,
        notification
      });
    } else {
      return res.status(500).json({
        success: false,
        error: smsResult.error,
        provider: provider || "None",
        notification
      });
    }
  } catch (error) {
    console.error("Error in SMS send endpoint:", error);
    const notification = new SMSNotification({
      userId,
      message,
      phone: to,
      category,
      status: "failed",
      timestamp: /* @__PURE__ */ new Date()
    });
    await notification.save();
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to send SMS",
      notification
    });
  }
});
router$2.put("/notifications/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const notification = await SMSNotification.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );
    if (!notification) {
      return res.status(404).json({ error: "SMS notification not found" });
    }
    res.json(notification);
  } catch (error) {
    console.error("Error updating SMS notification:", error);
    res.status(500).json({ error: "Failed to update SMS notification" });
  }
});
router$2.delete("/notifications/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await SMSNotification.findByIdAndDelete(id);
    if (!notification) {
      return res.status(404).json({ error: "SMS notification not found" });
    }
    res.json({ message: "SMS notification deleted successfully" });
  } catch (error) {
    console.error("Error deleting SMS notification:", error);
    res.status(500).json({ error: "Failed to delete SMS notification" });
  }
});
router$2.delete("/notifications", async (req, res) => {
  try {
    const userId = "kanu-portfolio";
    await SMSNotification.deleteMany({ userId });
    res.json({ message: "All SMS notifications cleared successfully" });
  } catch (error) {
    console.error("Error clearing SMS notifications:", error);
    res.status(500).json({ error: "Failed to clear SMS notifications" });
  }
});
router$2.get("/categories", async (req, res) => {
  try {
    const userId = "kanu-portfolio";
    let categories = await SMSCategory.findOne({ userId });
    if (!categories) {
      categories = new SMSCategory({
        userId,
        categories: ["Contact", "Inquiry", "Support", "Urgent"]
      });
      await categories.save();
    }
    res.json(categories.categories);
  } catch (error) {
    console.error("Error fetching SMS categories:", error);
    res.status(500).json({ error: "Failed to fetch SMS categories" });
  }
});
router$2.put("/categories", async (req, res) => {
  try {
    const userId = "kanu-portfolio";
    const { categories } = req.body;
    const result = await SMSCategory.findOneAndUpdate(
      { userId },
      { categories },
      { new: true, upsert: true }
    );
    res.json(result.categories);
  } catch (error) {
    console.error("Error updating SMS categories:", error);
    res.status(500).json({ error: "Failed to update SMS categories" });
  }
});
router$2.get("/status", async (req, res) => {
  try {
    const fast2smsConfigured = true;
    const exotelConfigured = !!(EXOTEL_API_KEY && EXOTEL_API_TOKEN && EXOTEL_SID && EXOTEL_FROM_NUMBER);
    const twilioConfigured = !!(twilioClient && process.env.TWILIO_FROM_NUMBER);
    const status = {
      fast2sms: {
        configured: fast2smsConfigured,
        apiKey: "✅ Configured",
        sender: "KANUPO",
        status: "✅ Ready"
      },
      exotel: {
        configured: exotelConfigured,
        apiKey: EXOTEL_API_KEY ? "✅ Configured" : "❌ Not configured",
        apiToken: EXOTEL_API_TOKEN ? "✅ Configured" : "❌ Not configured",
        sid: EXOTEL_SID,
        fromNumber: EXOTEL_FROM_NUMBER
      },
      twilio: {
        configured: twilioConfigured,
        accountSid: process.env.TWILIO_ACCOUNT_SID ? "✅ Configured" : "❌ Not configured",
        authToken: process.env.TWILIO_AUTH_TOKEN ? "✅ Configured" : "❌ Not configured",
        fromNumber: process.env.TWILIO_FROM_NUMBER || "❌ Not configured"
      },
      primaryProvider: "Fast2SMS",
      fallbackProvider: exotelConfigured ? "Exotel" : twilioConfigured ? "Twilio" : "None"
    };
    res.json(status);
  } catch (error) {
    console.error("Error getting SMS status:", error);
    res.status(500).json({ error: "Failed to get SMS status" });
  }
});
const router$1 = express__default.Router();
router$1.get("/", async (req, res) => {
  try {
    const userId = "kanu-portfolio";
    let settings = await UserSettings.findOne({ userId });
    if (!settings) {
      settings = new UserSettings({ userId });
      await settings.save();
    }
    res.json(settings);
  } catch (error) {
    console.error("Error fetching user settings:", error);
    res.status(500).json({ error: "Failed to fetch user settings" });
  }
});
router$1.put("/", async (req, res) => {
  try {
    const userId = "kanu-portfolio";
    const updateData = req.body;
    const settings = await UserSettings.findOneAndUpdate(
      { userId },
      updateData,
      { new: true, upsert: true }
    );
    res.json(settings);
  } catch (error) {
    console.error("Error updating user settings:", error);
    res.status(500).json({ error: "Failed to update user settings" });
  }
});
router$1.put("/notifications", async (req, res) => {
  try {
    const userId = "kanu-portfolio";
    const { notificationSettings } = req.body;
    const settings = await UserSettings.findOneAndUpdate(
      { userId },
      { notificationSettings },
      { new: true, upsert: true }
    );
    res.json(settings);
  } catch (error) {
    console.error("Error updating notification settings:", error);
    res.status(500).json({ error: "Failed to update notification settings" });
  }
});
router$1.put("/site", async (req, res) => {
  try {
    const userId = "kanu-portfolio";
    const { siteSettings } = req.body;
    const settings = await UserSettings.findOneAndUpdate(
      { userId },
      { siteSettings },
      { new: true, upsert: true }
    );
    res.json(settings);
  } catch (error) {
    console.error("Error updating site settings:", error);
    res.status(500).json({ error: "Failed to update site settings" });
  }
});
const router = express__default.Router();
router.get("/", async (req, res) => {
  try {
    const userId = "kanu-portfolio";
    const activities = await Activity.find({ userId }).sort({ createdAt: -1 });
    res.json(activities);
  } catch (error) {
    console.error("Error fetching activities:", error);
    res.status(500).json({ error: "Failed to fetch activities" });
  }
});
router.post("/", async (req, res) => {
  try {
    const userId = "kanu-portfolio";
    const activityData = { ...req.body, userId };
    const activity = new Activity(activityData);
    await activity.save();
    res.status(201).json(activity);
  } catch (error) {
    console.error("Error creating activity:", error);
    res.status(500).json({ error: "Failed to create activity" });
  }
});
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const activity = await Activity.findByIdAndUpdate(id, updateData, {
      new: true
    });
    if (!activity) {
      return res.status(404).json({ error: "Activity not found" });
    }
    res.json(activity);
  } catch (error) {
    console.error("Error updating activity:", error);
    res.status(500).json({ error: "Failed to update activity" });
  }
});
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const activity = await Activity.findByIdAndDelete(id);
    if (!activity) {
      return res.status(404).json({ error: "Activity not found" });
    }
    res.json({ message: "Activity deleted successfully" });
  } catch (error) {
    console.error("Error deleting activity:", error);
    res.status(500).json({ error: "Failed to delete activity" });
  }
});
router.get("/skills", async (req, res) => {
  try {
    const userId = "kanu-portfolio";
    const skills = await Skill.find({ userId }).sort({ category: 1, name: 1 });
    res.json(skills);
  } catch (error) {
    console.error("Error fetching skills:", error);
    res.status(500).json({ error: "Failed to fetch skills" });
  }
});
router.post("/skills", async (req, res) => {
  try {
    const userId = "kanu-portfolio";
    const skillData = { ...req.body, userId };
    const skill = new Skill(skillData);
    await skill.save();
    res.status(201).json(skill);
  } catch (error) {
    console.error("Error creating skill:", error);
    res.status(500).json({ error: "Failed to create skill" });
  }
});
router.put("/skills/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const skill = await Skill.findByIdAndUpdate(id, updateData, { new: true });
    if (!skill) {
      return res.status(404).json({ error: "Skill not found" });
    }
    res.json(skill);
  } catch (error) {
    console.error("Error updating skill:", error);
    res.status(500).json({ error: "Failed to update skill" });
  }
});
router.delete("/skills/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const skill = await Skill.findByIdAndDelete(id);
    if (!skill) {
      return res.status(404).json({ error: "Skill not found" });
    }
    res.json({ message: "Skill deleted successfully" });
  } catch (error) {
    console.error("Error deleting skill:", error);
    res.status(500).json({ error: "Failed to delete skill" });
  }
});
const uploadSchema = z.object({
  type: z.enum(["profile-image", "project-image", "document", "resume"]),
  filename: z.string().optional(),
  mimeType: z.string().optional(),
  data: z.string().min(1, "File data is required")
  // base64 data URL or pure base64
});
const handleFileUpload = async (req, res) => {
  try {
    if (!isMongoDBAvailable()) {
      return res.status(503).json({ success: false, error: "MongoDB not available" });
    }
    const { type, filename, mimeType, data } = uploadSchema.parse(req.body);
    const userId = "kanu-portfolio";
    const base64 = data.includes(",") ? data.split(",")[1] : data;
    const buffer = Buffer.from(base64, "base64");
    const MAX = 10 * 1024 * 1024;
    if (buffer.length > MAX) {
      return res.status(413).json({ success: false, error: "File too large (max 10MB)" });
    }
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
      metadata: { uploadedAt: /* @__PURE__ */ new Date() },
      publicUrl: `${req.protocol}://${req.get("host")}/api/files/${uniqueName}`
    });
    await fileRecord.save();
    const response = {
      // success: true,
      // url: `${req.protocol}://${req.get("host")}/api/upload/file/${fileRecord.filename}`,
      // filename: fileRecord.filename,
      // message: "File uploaded successfully (MongoDB only)",
      success: true,
      url: `${req.protocol}://${req.get("host")}/api/files/${fileRecord.filename}`,
      filename: fileRecord.filename,
      message: "File uploaded successfully (MongoDB only)"
    };
    res.json(response);
  } catch (error) {
    console.error("Upload error:", error);
    const errorResponse = {
      success: false,
      error: error instanceof Error ? error.message : "Upload failed"
    };
    res.status(400).json(errorResponse);
  }
};
const getFileFromMongoDB = async (req, res) => {
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
      "Cache-Control": "public, max-age=31536000"
      // 1 year cache
    });
    res.send(file.fileData);
  } catch (error) {
    console.error("Get file error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to retrieve file",
      message: error instanceof Error ? error.message : "Unknown error"
    });
  }
};
const handleFileDelete = async (req, res) => {
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
      error: error instanceof Error ? error.message : "Delete failed"
    });
  }
};
const getUploadConfig = (req, res) => {
  const config = {
    maxFileSize: 10 * 1024 * 1024,
    // 10MB
    allowedTypes: [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ],
    uploadEndpoint: "/api/upload",
    storageProvider: "mongodb"
    // always Mongo now
  };
  res.json(config);
};
function createServer() {
  const app2 = express__default();
  connectDB().then((connected) => {
    if (connected) {
      console.log("✅ MongoDB integration enabled");
    } else {
      console.log("❌ MongoDB not available");
    }
  }).catch((error) => {
    console.warn("MongoDB connection attempt failed:", error.message);
  });
  app2.use(cors());
  app2.use(express__default.json({ limit: "10mb" }));
  app2.use(express__default.urlencoded({ extended: true, limit: "10mb" }));
  app2.use((req, _res, next) => {
    console.log(`${(/* @__PURE__ */ new Date()).toISOString()} - ${req.method} ${req.path}`);
    next();
  });
  app2.get("/api/health", (_req, res) => {
    const mongoStatus = getConnectionStatus();
    res.json({
      status: "ok",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      mongodb: mongoStatus,
      environment: "production",
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: process.version
    });
  });
  app2.get("/api/mongodb/status", (_req, res) => {
    res.json(getConnectionStatus());
  });
  app2.post("/api/mongodb/test", (_req, res) => {
    if (isMongoDBAvailable()) {
      res.json({ success: true, message: "MongoDB connected" });
    } else {
      res.status(503).json({ success: false, message: "MongoDB not available" });
    }
  });
  app2.get("/api/ping", (_req, res) => {
    res.json({
      message: process.env.PING_MESSAGE ?? "pong",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      mongodb: isMongoDBAvailable() ? "connected" : "disconnected"
    });
  });
  app2.get("/api/demo", handleDemo);
  app2.use("/api/profile", router$8);
  app2.use("/api/projects", router$7);
  app2.use("/api/contacts", router$6);
  app2.use("/api/git", router$5);
  app2.use("/api/migrate", router$4);
  app2.use("/api/sms", router$2);
  app2.use("/api/settings", router$1);
  app2.use("/api/activities", router);
  app2.use("/api", router$3);
  app2.post("/api/upload", handleFileUpload);
  app2.delete("/api/upload/:filename", handleFileDelete);
  app2.get("/api/upload/config", getUploadConfig);
  app2.get("/api/files/:filename", getFileFromMongoDB);
  app2.use((error, _req, res, _next) => {
    console.error("Global error handler:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Something went wrong"
    });
  });
  app2.use("/api/*", (req, res) => {
    res.status(404).json({
      error: "Route not found",
      message: `The route ${req.originalUrl} does not exist`
    });
  });
  return app2;
}
const app = createServer();
const port = process.env.PORT || 3e3;
const __dirname = import.meta.dirname;
const distPath = path.join(__dirname, "../spa");
app.use(express.static(distPath));
app.get("*", (req, res) => {
  if (req.path.startsWith("/api/") || req.path.startsWith("/health")) {
    return res.status(404).json({ error: "API endpoint not found" });
  }
  res.sendFile(path.join(distPath, "index.html"));
});
app.listen(port, () => {
  console.log(`🚀 Fusion Starter server running on port ${port}`);
  console.log(`📱 Frontend: http://localhost:${port}`);
  console.log(`🔧 API: http://localhost:${port}/api`);
});
process.on("SIGTERM", () => {
  console.log("🛑 Received SIGTERM, shutting down gracefully");
  process.exit(0);
});
process.on("SIGINT", () => {
  console.log("🛑 Received SIGINT, shutting down gracefully");
  process.exit(0);
});
//# sourceMappingURL=node-build.mjs.map
