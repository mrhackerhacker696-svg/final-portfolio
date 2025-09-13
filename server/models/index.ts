import mongoose from "mongoose";

// Profile Schema with improved validation
const ProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: [true, 'User ID is required'],
      unique: true,
      trim: true,
      minlength: [3, 'User ID must be at least 3 characters long']
    },
    name: {
      type: String,
      default: "",
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    bio: {
      type: String,
      default: "",
      trim: true,
      maxlength: [1000, 'Bio cannot exceed 1000 characters']
    },
    tagline: {
      type: String,
      default: "",
      trim: true,
      maxlength: [200, 'Tagline cannot exceed 200 characters']
    },
    experience: {
      type: String,
      default: "",
      trim: true,
      maxlength: [100, 'Experience cannot exceed 100 characters']
    },
    availability: {
      type: String,
      default: "",
      trim: true,
      maxlength: [200, 'Availability cannot exceed 200 characters']
    },
    profileImage: {
      type: String,
      default: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
      validate: {
        validator: function (v: string) {
          return v === "" || /^https?:\/\/.+/.test(v);
        },
        message: 'Profile image must be a valid URL'
      }
    },
    logoText: {
      type: String,
      default: "⚡ logo",
      trim: true,
      maxlength: [50, 'Logo text cannot exceed 50 characters']
    },
    resumeUrl: {
      type: String,
      default: "",
      validate: {
        validator: function (v: string) {
          return v === "" || /^https?:\/\/.+/.test(v);
        },
        message: 'Resume URL must be a valid URL'
      }
    },
    contactInfo: {
      email: {
        type: String,
        default: "kanuprajapati717@gmail.com",
        validate: {
          validator: function (v: string) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
          },
          message: 'Please provide a valid email address'
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
        maxlength: [100, 'Location cannot exceed 100 characters']
      },
      linkedin: {
        type: String,
        default: "https://linkedin.com/in/kanuprajapati",
        validate: {
          validator: function (v: string) {
            return /^https?:\/\/.+/.test(v);
          },
          message: 'LinkedIn URL must be a valid URL'
        }
      },
      github: {
        type: String,
        default: "https://github.com/kanuprajapati",
        validate: {
          validator: function (v: string) {
            return /^https?:\/\/.+/.test(v);
          },
          message: 'GitHub URL must be a valid URL'
        }
      },
      website: {
        type: String,
        default: "",
        validate: {
          validator: function (v: string) {
            return v === "" || /^https?:\/\/.+/.test(v);
          },
          message: 'Website URL must be a valid URL'
        }
      },
      twitter: {
        type: String,
        default: "",
        validate: {
          validator: function (v: string) {
            return v === "" || /^https?:\/\/.+/.test(v);
          },
          message: 'Twitter URL must be a valid URL'
        }
      },
    },
    // Simple skills array for profile overview (separate Skill model exists for detailed skills)
    skills: [{
      type: String,
      trim: true,
      maxlength: [50, 'Each skill cannot exceed 50 characters']
    }],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  },
);

// Project Schema with improved validation
const ProjectSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: [true, 'User ID is required'],
      trim: true
    },
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
      maxlength: [100, 'Project title cannot exceed 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Project description is required'],
      trim: true,
      maxlength: [500, 'Project description cannot exceed 500 characters']
    },
    fullDescription: {
      type: String,
      default: "",
      trim: true,
      maxlength: [2000, 'Full description cannot exceed 2000 characters']
    },
    tags: [{
      type: String,
      trim: true,
      maxlength: [30, 'Each tag cannot exceed 30 characters']
    }],
    image: {
      type: String,
      required: [true, 'Project image is required'],
      validate: {
        validator: function (v: string) {
          return /^https?:\/\/.+/.test(v);
        },
        message: 'Project image must be a valid URL'
      }
    },
    status: {
      type: String,
      enum: {
        values: ["In Development", "Completed", "Live", "Published"],
        message: 'Status must be one of: In Development, Completed, Live, Published'
      },
      default: "In Development",
    },
    dateCompleted: {
      type: String,
      default: "",
      validate: {
        validator: function (v: string) {
          if (v === "") return true;
          return /^\d{4}-\d{2}-\d{2}$/.test(v);
        },
        message: 'Date completed must be in YYYY-MM-DD format'
      }
    },
    links: {
      github: {
        type: String,
        default: "",
        validate: {
          validator: function (v: string) {
            return v === "" || /^https?:\/\/.+/.test(v);
          },
          message: 'GitHub link must be a valid URL'
        }
      },
      demo: {
        type: String,
        default: "",
        validate: {
          validator: function (v: string) {
            return v === "" || /^https?:\/\/.+/.test(v);
          },
          message: 'Demo link must be a valid URL'
        }
      },
      live: {
        type: String,
        default: "",
        validate: {
          validator: function (v: string) {
            return v === "" || /^https?:\/\/.+/.test(v);
          },
          message: 'Live link must be a valid URL'
        }
      },
    },
    screenshots: [{
      type: String,
      validate: {
        validator: function (v: string) {
          return /^https?:\/\/.+/.test(v);
        },
        message: 'Screenshot must be a valid URL'
      }
    }],
    challenges: {
      type: String,
      default: "",
      trim: true,
      maxlength: [1000, 'Challenges cannot exceed 1000 characters']
    },
    outcome: {
      type: String,
      default: "",
      trim: true,
      maxlength: [1000, 'Outcome cannot exceed 1000 characters']
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  },
);

// Contact Message Schema with improved validation
const ContactMessageSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: [true, 'User ID is required'],
      trim: true
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      validate: {
        validator: function (v: string) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: 'Please provide a valid email address'
      }
    },
    phone: {
      type: String,
      default: "",
      trim: true,
      validate: {
        validator: function (v: string) {
          return v === "" || /^[\+]?[0-9\s\-\(\)]{10,}$/.test(v);
        },
        message: 'Please provide a valid phone number'
      }
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
      maxlength: [200, 'Subject cannot exceed 200 characters']
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
      maxlength: [2000, 'Message cannot exceed 2000 characters']
    },
    contactMethod: {
      type: String,
      enum: {
        values: ["email", "sms", "call"],
        message: 'Contact method must be one of: email, sms, call'
      },
      default: "email",
    },
    status: {
      type: String,
      enum: {
        values: ["new", "replied"],
        message: 'Status must be one of: new, replied'
      },
      default: "new"
    },
    date: {
      type: String,
      default: () => new Date().toISOString().split("T")[0],
      validate: {
        validator: function (v: string) {
          return /^\d{4}-\d{2}-\d{2}$/.test(v);
        },
        message: 'Date must be in YYYY-MM-DD format'
      }
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  },
);

// Git Settings Schema with improved validation
const GitSettingsSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: [true, 'User ID is required'],
      unique: true,
      trim: true
    },
    username: {
      type: String,
      default: "kanuprajapati",
      trim: true,
      maxlength: [50, 'Username cannot exceed 50 characters']
    },
    accessToken: {
      type: String,
      default: "",
      trim: true
    },
    isConnected: {
      type: Boolean,
      default: true
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  },
);

// Project Screenshots Schema (for additional screenshots)
const ProjectScreenshotSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: [true, 'User ID is required'],
      trim: true
    },
    projectId: {
      type: String,
      required: [true, 'Project ID is required'],
      trim: true
    },
    screenshots: [{
      type: String,
      validate: {
        validator: function (v: string) {
          return /^https?:\/\/.+/.test(v);
        },
        message: 'Screenshot must be a valid URL'
      }
    }],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  },
);

// SMS Notification Schema with improved validation
const SMSNotificationSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: [true, 'User ID is required'],
      trim: true
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
      maxlength: [500, 'Message cannot exceed 500 characters']
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      validate: {
        validator: function (v: string) {
          return /^[\+]?[0-9\s\-\(\)]{10,}$/.test(v);
        },
        message: 'Please provide a valid phone number'
      }
    },
    category: {
      type: String,
      default: "Contact",
      trim: true,
      maxlength: [50, 'Category cannot exceed 50 characters']
    },
    status: {
      type: String,
      enum: {
        values: ["sent", "pending", "failed"],
        message: 'Status must be one of: sent, pending, failed'
      },
      default: "sent"
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  },
);

// SMS Categories Schema with improved validation
const SMSCategorySchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: [true, 'User ID is required'],
      trim: true
    },
    categories: [{
      type: String,
      trim: true,
      maxlength: [50, 'Each category cannot exceed 50 characters']
    }],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  },
);

// User Settings Schema with improved validation
const UserSettingsSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: [true, 'User ID is required'],
      unique: true,
      trim: true
    },
    // Admin site settings
    siteSettings: {
      siteName: {
        type: String,
        default: "Kanu Prajapati Portfolio",
        trim: true,
        maxlength: [100, 'Site name cannot exceed 100 characters']
      },
      siteDescription: {
        type: String,
        default: "Full-stack Developer specializing in modern web technologies",
        trim: true,
        maxlength: [300, 'Site description cannot exceed 300 characters']
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
      },
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
          validator: function (v: string) {
            return v === "" || /^[\+]?[0-9\s\-\(\)]{10,}$/.test(v);
          },
          message: 'Please provide a valid mobile number'
        }
      },
    },
    theme: {
      type: String,
      enum: {
        values: ["light", "dark", "system"],
        message: 'Theme must be one of: light, dark, system'
      },
      default: "system"
    },
    language: {
      type: String,
      default: "en",
      enum: {
        values: ["en", "hi", "gu"],
        message: 'Language must be one of: en, hi, gu'
      }
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  },
);

// Activities Schema with improved validation
const ActivitySchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: [true, 'User ID is required'],
      trim: true
    },
    title: {
      type: String,
      required: [true, 'Activity title is required'],
      trim: true,
      maxlength: [100, 'Activity title cannot exceed 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Activity description is required'],
      trim: true,
      maxlength: [500, 'Activity description cannot exceed 500 characters']
    },
    type: {
      type: String,
      enum: {
        values: ["project", "skill", "achievement", "education", "work"],
        message: 'Type must be one of: project, skill, achievement, education, work'
      },
      default: "project",
    },
    date: {
      type: String,
      required: [true, 'Activity date is required'],
      validate: {
        validator: function (v: string) {
          return /^\d{4}-\d{2}-\d{2}$/.test(v);
        },
        message: 'Date must be in YYYY-MM-DD format'
      }
    },
    icon: {
      type: String,
      default: "📋",
      trim: true,
      maxlength: [10, 'Icon cannot exceed 10 characters']
    },
    category: {
      type: String,
      default: "General",
      trim: true,
      maxlength: [50, 'Category cannot exceed 50 characters']
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  },
);

// Skills Schema with improved validation
const SkillSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: [true, 'User ID is required'],
      trim: true
    },
    name: {
      type: String,
      required: [true, 'Skill name is required'],
      trim: true,
      maxlength: [100, 'Skill name cannot exceed 100 characters']
    },
    category: {
      type: String,
      required: [true, 'Skill category is required'],
      trim: true,
      maxlength: [50, 'Skill category cannot exceed 50 characters']
    },
    level: {
      type: Number,
      min: [1, 'Skill level must be at least 1'],
      max: [100, 'Skill level cannot exceed 100'],
      default: 50,
      validate: {
        validator: Number.isInteger,
        message: 'Skill level must be a whole number'
      }
    },
    years: {
      type: Number,
      default: 1,
      min: [0, 'Years cannot be negative'],
      max: [50, 'Years cannot exceed 50'],
      validate: {
        validator: Number.isInteger,
        message: 'Years must be a whole number'
      }
    },
    icon: {
      type: String,
      default: "⚡",
      trim: true,
      maxlength: [10, 'Icon cannot exceed 10 characters']
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  },
);

// File Storage Schema for persistent file storage
const FileStorageSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: [true, 'User ID is required'],
      trim: true
    },
    filename: {
      type: String,
      required: [true, 'Filename is required'],
      trim: true,
      maxlength: [255, 'Filename cannot exceed 255 characters']
    },
    originalName: {
      type: String,
      required: [true, 'Original filename is required'],
      trim: true,
      maxlength: [255, 'Original filename cannot exceed 255 characters']
    },
    mimeType: {
      type: String,
      required: [true, 'MIME type is required'],
      trim: true,
      maxlength: [100, 'MIME type cannot exceed 100 characters']
    },
    fileType: {
      type: String,
      required: [true, 'File type is required'],
      enum: {
        values: ['profile-image', 'project-image', 'document', 'resume'],
        message: 'File type must be one of: profile-image, project-image, document, resume'
      }
    },
    fileSize: {
      type: Number,
      required: [true, 'File size is required'],
      min: [1, 'File size must be at least 1 byte'],
      max: [10 * 1024 * 1024, 'File size cannot exceed 10MB']
    },
    fileData: {
      type: Buffer,
      required: [true, 'File data is required']
    },
    publicUrl: {
      type: String,
      required: [true, 'Public URL is required'],
      trim: true,
      maxlength: [500, 'Public URL cannot exceed 500 characters']
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
      transform: function (doc, ret) {
        // Don't include fileData in JSON responses for performance
        delete ret.fileData;
        return ret;
      }
    },
    toObject: { virtuals: true }
  },
);

// Add indexes for better performance (avoid duplicating indexes created by unique fields)
ProjectSchema.index({ userId: 1, createdAt: -1 });
ProjectSchema.index({ userId: 1, status: 1 });
ContactMessageSchema.index({ userId: 1, createdAt: -1 });
ContactMessageSchema.index({ userId: 1, status: 1 });
ActivitySchema.index({ userId: 1, type: 1, date: -1 });
SkillSchema.index({ userId: 1, category: 1 });
FileStorageSchema.index({ userId: 1, fileType: 1 });
FileStorageSchema.index({ userId: 1, filename: 1 });
FileStorageSchema.index({ userId: 1, isActive: 1 });

// Export models
export const Profile = mongoose.models.Profile || mongoose.model("Profile", ProfileSchema);
export const Project = mongoose.models.Project || mongoose.model("Project", ProjectSchema);
export const ContactMessage = mongoose.models.ContactMessage || mongoose.model(
  "ContactMessage",
  ContactMessageSchema,
);
export const GitSettings = mongoose.models.GitSettings || mongoose.model("GitSettings", GitSettingsSchema);
export const ProjectScreenshot = mongoose.models.ProjectScreenshot || mongoose.model(
  "ProjectScreenshot",
  ProjectScreenshotSchema,
);
export const SMSNotification = mongoose.models.SMSNotification || mongoose.model(
  "SMSNotification",
  SMSNotificationSchema,
);
export const SMSCategory = mongoose.models.SMSCategory || mongoose.model("SMSCategory", SMSCategorySchema);
export const UserSettings = mongoose.models.UserSettings || mongoose.model("UserSettings", UserSettingsSchema);
export const Activity = mongoose.models.Activity || mongoose.model("Activity", ActivitySchema);
export const Skill = mongoose.models.Skill || mongoose.model("Skill", SkillSchema);
export const FileStorage = mongoose.models.FileStorage || mongoose.model("FileStorage", FileStorageSchema);
