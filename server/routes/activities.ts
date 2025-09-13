import express from "express";
import { Activity, Skill } from "../models/index.js";

const router = express.Router();

// ACTIVITIES ROUTES

// Get all activities
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

// Create new activity
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

// Update activity
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const activity = await Activity.findByIdAndUpdate(id, updateData, {
      new: true,
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

// Delete activity
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

// SKILLS ROUTES

// Get all skills
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

// Create new skill
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

// Update skill
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

// Delete skill
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

export default router;
