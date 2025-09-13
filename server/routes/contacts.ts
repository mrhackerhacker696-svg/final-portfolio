import express from "express";
import { ContactMessage } from "../models/index.js";

const router = express.Router();

// Get all contact messages
router.get("/", async (req, res) => {
  try {
    const userId = "kanu-portfolio";
    const messages = await ContactMessage.find({ userId }).sort({
      createdAt: -1,
    });
    res.json(messages);
  } catch (error) {
    console.error("Error fetching contact messages:", error);
    res.status(500).json({ error: "Failed to fetch contact messages" });
  }
});

// Create new contact message
router.post("/", async (req, res) => {
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

// Update contact message status
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const message = await ContactMessage.findByIdAndUpdate(
      id,
      { status },
      { new: true },
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

// Delete contact message
router.delete("/:id", async (req, res) => {
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

export default router;
