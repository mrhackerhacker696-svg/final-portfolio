import express from "express";
import { Project } from "../models/index.js";
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

// Get all projects
router.get("/", checkMongoDB, async (req, res) => {
  try {
    const userId = "kanu-portfolio";
    const { status, category, limit, page } = req.query;

    // Build query
    let query: any = { userId };

    if (status) {
      query.status = status;
    }

    if (category) {
      query.tags = { $in: [category] };
    }

    // Pagination
    const pageNum = parseInt(page as string) || 1;
    const limitNum = parseInt(limit as string) || 10;
    const skip = (pageNum - 1) * limitNum;

    const projects = await Project.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

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

// Get project by ID
router.get("/:id", checkMongoDB, async (req, res) => {
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

    if (error.name === 'CastError') {
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

// Create new project
router.post("/", checkMongoDB, async (req, res) => {
  try {
    const userId = "kanu-portfolio";
    const projectData = { ...req.body, userId };

    // Validate required fields
    if (!projectData.title || !projectData.description || !projectData.image) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields",
        message: "Title, description, and image are required",
        required: ["title", "description", "image"]
      });
    }

    // Set default values for missing fields
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
      projectData.challenges =
        "Developing a robust and scalable solution while maintaining clean code architecture and ensuring optimal user experience.";
    }

    if (!projectData.outcome) {
      projectData.outcome =
        "Successfully delivered a high-quality project that meets all requirements and provides excellent user experience.";
    }

    if (!projectData.screenshots) {
      projectData.screenshots = [
        projectData.image,
        projectData.image,
        projectData.image,
      ];
    }

    if (!projectData.dateCompleted) {
      projectData.dateCompleted = new Date().toISOString().split("T")[0];
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
      error: "Failed to create project",
      message: error.message
    });
  }
});

// Update project
router.put("/:id", checkMongoDB, async (req, res) => {
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

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: "Validation Error",
        message: error.message,
        details: error.errors
      });
    }

    if (error.name === 'CastError') {
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

// Delete project
router.delete("/:id", checkMongoDB, async (req, res) => {
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

    if (error.name === 'CastError') {
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

// Get project statistics
router.get("/stats/overview", checkMongoDB, async (req, res) => {
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

// Search projects
router.get("/search", checkMongoDB, async (req, res) => {
  try {
    const userId = "kanu-portfolio";
    const { q, status, tags, limit = 10 } = req.query;

    let query: any = { userId };

    // Text search
    if (q) {
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { fullDescription: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q, 'i')] } }
      ];
    }

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Filter by tags
    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : [tags];
      query.tags = { $in: tagArray };
    }

    const projects = await Project.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit as string));

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

export default router;
