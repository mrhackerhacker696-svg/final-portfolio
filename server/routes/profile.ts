import express from "express";
import { Profile } from "../models/index.js";
import { isMongoDBAvailable } from "../database/connection.js";

const router = express.Router();

// Middleware to check MongoDB availability
const checkMongoDB = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (!isMongoDBAvailable()) {
    return res.status(503).json({
      error: "MongoDB not available",
      message: "Please use localStorage or set up MongoDB connection",
      code: "MONGODB_UNAVAILABLE"
    });
  }
  next();
};

// Get profile
router.get("/", checkMongoDB, async (req, res) => {
  try {
    const userId = "kanu-portfolio"; // Default user ID
    let profile = await Profile.findOne({ userId });

    if (!profile) {
      // Create default profile if doesn't exist
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

// Update profile
router.put("/", checkMongoDB, async (req, res) => {
  try {
    const userId = "kanu-portfolio";
    const updateData = req.body;

    // Validate required fields
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
        runValidators: true // Run schema validators
      }
    );

    res.json({
      success: true,
      data: profile,
      message: "Profile updated successfully"
    });
  } catch (error) {
    console.error("❌ Error updating profile:", error);

    if (error.name === 'ValidationError') {
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

// Update profile image
router.put("/image", checkMongoDB, async (req, res) => {
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

    if (error.name === 'ValidationError') {
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

// Update logo
router.put("/logo", checkMongoDB, async (req, res) => {
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

    if (error.name === 'ValidationError') {
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

// Update resume URL
router.put("/resume", checkMongoDB, async (req, res) => {
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

    if (error.name === 'ValidationError') {
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

// Update contact info
router.put("/contact", checkMongoDB, async (req, res) => {
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

    if (error.name === 'ValidationError') {
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

// Delete profile (admin only)
router.delete("/", checkMongoDB, async (req, res) => {
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

// Get profile statistics
router.get("/stats", checkMongoDB, async (req, res) => {
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

export default router;
