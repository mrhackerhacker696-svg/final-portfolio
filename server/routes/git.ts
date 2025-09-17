import express from "express";
import { GitSettings } from "../models/index.js";

const router = express.Router();

// Get git settings
router.get("/", async (req, res) => {
  try {
    const userId = "kanu-portfolio";
    let settings = await GitSettings.findOne({ userId });

    if (!settings) {
      // Create default settings if doesn't exist
      settings = new GitSettings({ userId });
      await settings.save();
    }

    res.json(settings);
  } catch (error) {
    console.error("Error fetching git settings:", error);
    res.status(500).json({ error: "Failed to fetch git settings" });
  }
});

// Update git settings
router.put("/", async (req, res) => {
  try {
    const userId = "kanu-portfolio";
    const updateData = req.body;

    const settings = await GitSettings.findOneAndUpdate(
      { userId },
      updateData,
      { new: true, upsert: true },
    );

    res.json(settings);
  } catch (error) {
    console.error("Error updating git settings:", error);
    res.status(500).json({ error: "Failed to update git settings" });
  }
});

export default router;
