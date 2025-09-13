import express from "express";
import { UserSettings } from "../models/index.js";

const router = express.Router();

// Get user settings
router.get("/", async (req, res) => {
  try {
    const userId = "kanu-portfolio";
    let settings = await UserSettings.findOne({ userId });

    if (!settings) {
      // Create default settings if doesn't exist
      settings = new UserSettings({ userId });
      await settings.save();
    }

    res.json(settings);
  } catch (error) {
    console.error("Error fetching user settings:", error);
    res.status(500).json({ error: "Failed to fetch user settings" });
  }
});

// Update user settings (site + notification)
router.put("/", async (req, res) => {
  try {
    const userId = "kanu-portfolio";
    const updateData = req.body;

    const settings = await UserSettings.findOneAndUpdate(
      { userId },
      updateData,
      { new: true, upsert: true },
    );

    res.json(settings);
  } catch (error) {
    console.error("Error updating user settings:", error);
    res.status(500).json({ error: "Failed to update user settings" });
  }
});

// Update notification settings specifically
router.put("/notifications", async (req, res) => {
  try {
    const userId = "kanu-portfolio";
    const { notificationSettings } = req.body;

    const settings = await UserSettings.findOneAndUpdate(
      { userId },
      { notificationSettings },
      { new: true, upsert: true },
    );

    res.json(settings);
  } catch (error) {
    console.error("Error updating notification settings:", error);
    res.status(500).json({ error: "Failed to update notification settings" });
  }
});

// Update site settings specifically
router.put("/site", async (req, res) => {
  try {
    const userId = "kanu-portfolio";
    const { siteSettings } = req.body;

    const settings = await UserSettings.findOneAndUpdate(
      { userId },
      { siteSettings },
      { new: true, upsert: true },
    );

    res.json(settings);
  } catch (error) {
    console.error("Error updating site settings:", error);
    res.status(500).json({ error: "Failed to update site settings" });
  }
});

export default router;
