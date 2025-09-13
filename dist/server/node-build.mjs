import path from "path";
import "dotenv/config";
import * as express from "express";
import express__default from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { z } from "zod";
const handleDemo = (req, res) => {
  const response = {
    message: "Hello from Express server"
  };
  res.status(200).json(response);
};
dotenv.config();
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/portfolio";
const ENABLE_MONGODB = process.env.ENABLE_MONGODB !== "false";
let isConnected = false;
const connectDB = async () => {
  if (isConnected) {
    console.log("MongoDB already connected");
    return true;
  }
  if (!ENABLE_MONGODB) {
    console.log("MongoDB disabled - running in localStorage mode");
    return false;
  }
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5e3
      // Timeout after 5s instead of 30s
    });
    isConnected = true;
    console.log("MongoDB connected successfully");
    return true;
  } catch (error) {
    console.warn(
      "MongoDB connection failed - falling back to localStorage mode:",
      error.message
    );
    return false;
  }
};
const disconnectDB = async () => {
  if (!isConnected) {
    return;
  }
  try {
    await mongoose.disconnect();
    isConnected = false;
    console.log("MongoDB disconnected");
  } catch (error) {
    console.error("MongoDB disconnection error:", error);
  }
};
const isMongoDBAvailable = () => {
  if (!ENABLE_MONGODB) {
    return false;
  }
  return isConnected && mongoose.connection.readyState === 1;
};
process.on("SIGINT", disconnectDB);
process.on("SIGTERM", disconnectDB);
const ProfileSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true },
    profileImage: {
      type: String,
      default: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face"
    },
    logoText: { type: String, default: "⚡ logo" },
    resumeUrl: { type: String, default: "" },
    contactInfo: {
      email: { type: String, default: "kanuprajapati717@gmail.com" },
      phone: { type: String, default: "+91 9876543210" },
      location: { type: String, default: "Gujarat, India" },
      linkedin: {
        type: String,
        default: "https://linkedin.com/in/kanuprajapati"
      },
      github: { type: String, default: "https://github.com/kanuprajapati" }
    }
  },
  { timestamps: true }
);
const ProjectSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    fullDescription: { type: String, default: "" },
    tags: [{ type: String }],
    image: { type: String, required: true },
    status: {
      type: String,
      enum: ["In Development", "Completed", "Live", "Published"],
      default: "In Development"
    },
    dateCompleted: { type: String, default: "" },
    links: {
      github: { type: String, default: "" },
      demo: { type: String, default: "" },
      live: { type: String, default: "" }
    },
    screenshots: [{ type: String }],
    challenges: { type: String, default: "" },
    outcome: { type: String, default: "" }
  },
  { timestamps: true }
);
const ContactMessageSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: "" },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    contactMethod: {
      type: String,
      enum: ["email", "sms", "call"],
      default: "email"
    },
    status: { type: String, enum: ["new", "replied"], default: "new" },
    date: {
      type: String,
      default: () => (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
    }
  },
  { timestamps: true }
);
const GitSettingsSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true },
    username: { type: String, default: "kanuprajapati" },
    accessToken: { type: String, default: "" },
    isConnected: { type: Boolean, default: true }
  },
  { timestamps: true }
);
const ProjectScreenshotSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    projectId: { type: String, required: true },
    screenshots: [{ type: String }]
  },
  { timestamps: true }
);
const SMSNotificationSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    message: { type: String, required: true },
    phone: { type: String, required: true },
    category: { type: String, default: "Contact" },
    status: { type: String, enum: ["sent", "pending", "failed"], default: "sent" },
    timestamp: { type: Date, default: Date.now }
  },
  { timestamps: true }
);
const SMSCategorySchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    categories: [{ type: String }]
  },
  { timestamps: true }
);
const UserSettingsSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true },
    notificationSettings: {
      emailNotifications: { type: Boolean, default: true },
      smsNotifications: { type: Boolean, default: false },
      pushNotifications: { type: Boolean, default: true },
      emailOnNewMessage: { type: Boolean, default: true },
      smsOnUrgent: { type: Boolean, default: false }
    },
    theme: { type: String, enum: ["light", "dark", "system"], default: "system" },
    language: { type: String, default: "en" }
  },
  { timestamps: true }
);
const ActivitySchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: {
      type: String,
      enum: ["project", "skill", "achievement", "education", "work"],
      default: "project"
    },
    date: { type: String, required: true },
    icon: { type: String, default: "📋" },
    category: { type: String, default: "General" }
  },
  { timestamps: true }
);
const SkillSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    level: { type: Number, min: 1, max: 100, default: 50 },
    years: { type: Number, default: 1 },
    icon: { type: String, default: "⚡" }
  },
  { timestamps: true }
);
const Profile = mongoose.model("Profile", ProfileSchema);
const Project = mongoose.model("Project", ProjectSchema);
const ContactMessage = mongoose.model(
  "ContactMessage",
  ContactMessageSchema
);
const GitSettings = mongoose.model("GitSettings", GitSettingsSchema);
mongoose.model(
  "ProjectScreenshot",
  ProjectScreenshotSchema
);
const SMSNotification = mongoose.model(
  "SMSNotification",
  SMSNotificationSchema
);
const SMSCategory = mongoose.model("SMSCategory", SMSCategorySchema);
const UserSettings = mongoose.model("UserSettings", UserSettingsSchema);
const Activity = mongoose.model("Activity", ActivitySchema);
const Skill = mongoose.model("Skill", SkillSchema);
const router$8 = express__default.Router();
router$8.get("/", async (req, res) => {
  try {
    if (!isMongoDBAvailable()) {
      return res.status(503).json({
        error: "MongoDB not available",
        message: "Please use localStorage or set up MongoDB connection"
      });
    }
    const userId = "kanu-portfolio";
    let profile = await Profile.findOne({ userId });
    if (!profile) {
      profile = new Profile({ userId });
      await profile.save();
    }
    res.json(profile);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});
router$8.put("/", async (req, res) => {
  try {
    const userId = "kanu-portfolio";
    const updateData = req.body;
    const profile = await Profile.findOneAndUpdate({ userId }, updateData, {
      new: true,
      upsert: true
    });
    res.json(profile);
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
});
router$8.put("/image", async (req, res) => {
  try {
    const userId = "kanu-portfolio";
    const { profileImage } = req.body;
    const profile = await Profile.findOneAndUpdate(
      { userId },
      { profileImage },
      { new: true, upsert: true }
    );
    res.json(profile);
  } catch (error) {
    console.error("Error updating profile image:", error);
    res.status(500).json({ error: "Failed to update profile image" });
  }
});
router$8.put("/logo", async (req, res) => {
  try {
    const userId = "kanu-portfolio";
    const { logoText } = req.body;
    const profile = await Profile.findOneAndUpdate(
      { userId },
      { logoText },
      { new: true, upsert: true }
    );
    res.json(profile);
  } catch (error) {
    console.error("Error updating logo:", error);
    res.status(500).json({ error: "Failed to update logo" });
  }
});
router$8.put("/resume", async (req, res) => {
  try {
    const userId = "kanu-portfolio";
    const { resumeUrl } = req.body;
    const profile = await Profile.findOneAndUpdate(
      { userId },
      { resumeUrl },
      { new: true, upsert: true }
    );
    res.json(profile);
  } catch (error) {
    console.error("Error updating resume:", error);
    res.status(500).json({ error: "Failed to update resume" });
  }
});
router$8.put("/contact", async (req, res) => {
  try {
    const userId = "kanu-portfolio";
    const { contactInfo } = req.body;
    const profile = await Profile.findOneAndUpdate(
      { userId },
      { contactInfo },
      { new: true, upsert: true }
    );
    res.json(profile);
  } catch (error) {
    console.error("Error updating contact info:", error);
    res.status(500).json({ error: "Failed to update contact info" });
  }
});
const router$7 = express__default.Router();
router$7.get("/", async (req, res) => {
  try {
    const userId = "kanu-portfolio";
    const projects = await Project.find({ userId }).sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ error: "Failed to fetch projects" });
  }
});
router$7.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }
    res.json(project);
  } catch (error) {
    console.error("Error fetching project:", error);
    res.status(500).json({ error: "Failed to fetch project" });
  }
});
router$7.post("/", async (req, res) => {
  try {
    const userId = "kanu-portfolio";
    const projectData = { ...req.body, userId };
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
    res.status(201).json(project);
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ error: "Failed to create project" });
  }
});
router$7.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const project = await Project.findByIdAndUpdate(id, updateData, {
      new: true
    });
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }
    res.json(project);
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).json({ error: "Failed to update project" });
  }
});
router$7.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findByIdAndDelete(id);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }
    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({ error: "Failed to delete project" });
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
    res.json({
      hasProfile: !!profile,
      projectsCount,
      contactsCount,
      hasGitSettings: !!gitSettings,
      migrated: !!(profile || projectsCount > 0 || contactsCount > 0 || gitSettings),
      mongodbAvailable: true
    });
  } catch (error) {
    console.error("Error checking migration status:", error);
    res.status(500).json({ error: "Failed to check migration status" });
  }
});
const router$3 = express__default.Router();
router$3.post("/send-email", (req, res) => {
  console.log("📧 Development email test received:", req.body);
  const { name, email, phone, subject, message, contactMethod } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({
      error: "Missing required fields",
      details: "Name, email, and message are required"
    });
  }
  setTimeout(() => {
    console.log(`📨 Simulated email sent to kanuprajapati717@gmail.com`);
    console.log(`📧 From: ${name} (${email})`);
    console.log(`📝 Subject: ${subject || "Contact Form Submission"}`);
    console.log(`💬 Message: ${message}`);
    console.log(`📞 Contact Method: ${contactMethod}`);
    console.log(`🎯 Phone: ${phone || "Not provided"}`);
    res.status(200).json({
      success: true,
      message: "Email sent successfully (development mode)",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      development: true,
      details: {
        recipient: "kanuprajapati717@gmail.com",
        sender: email,
        subject: subject || "Contact Form Submission"
      }
    });
  }, 500);
});
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
  type: z.enum(["profile-image", "project-image", "document"]),
  filename: z.string().optional()
});
const handleFileUpload = async (req, res) => {
  try {
    const { type, filename } = uploadSchema.parse(req.body);
    const response = {
      success: true,
      url: `https://example.com/uploads/${Date.now()}-${filename || "profile.jpg"}`,
      filename: filename || "profile.jpg",
      message: "File uploaded successfully"
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
const handleFileDelete = async (req, res) => {
  try {
    const { filename } = req.params;
    if (!filename) {
      return res.status(400).json({
        success: false,
        error: "Filename is required"
      });
    }
    const response = {
      success: true,
      message: "File deleted successfully"
    };
    res.json(response);
  } catch (error) {
    console.error("Delete error:", error);
    const errorResponse = {
      success: false,
      error: error instanceof Error ? error.message : "Delete failed"
    };
    res.status(500).json(errorResponse);
  }
};
const getUploadConfig = (req, res) => {
  const config = {
    maxFileSize: 5 * 1024 * 1024,
    // 5MB
    allowedTypes: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
    uploadEndpoint: "/api/upload",
    storageProvider: "localStorage"
    // In production: 's3', 'cloudinary', etc.
  };
  res.json(config);
};
function createServer() {
  const app2 = express__default();
  connectDB().then((connected) => {
    if (connected) {
      console.log("✅ MongoDB integration enabled");
    } else {
      console.log("📱 Running in localStorage mode");
    }
  }).catch((error) => {
    console.warn("MongoDB connection attempt failed:", error.message);
  });
  app2.use(cors());
  app2.use(express__default.json({ limit: "10mb" }));
  app2.use(express__default.urlencoded({ extended: true, limit: "10mb" }));
  app2.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      mongodb: isMongoDBAvailable() ? "connected" : "disconnected"
    });
  });
  app2.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
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
