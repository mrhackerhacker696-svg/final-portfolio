// Sample data for testing migration
export const createSampleData = () => {
  // Sample projects
  const sampleProjects = [
    {
      id: "1",
      title: "E-commerce Platform",
      description: "A modern e-commerce platform built with React and Node.js",
      tags: ["React", "Node.js", "MongoDB", "TypeScript"],
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=500&h=300&fit=crop",
      status: "Completed",
      links: {
        github: "https://github.com/user/ecommerce",
        demo: "https://demo-ecommerce.com",
        live: "https://live-ecommerce.com"
      },
      dateCompleted: "2024-01-15"
    },
    {
      id: "2", 
      title: "Task Management App",
      description: "A collaborative task management application with real-time updates",
      tags: ["React", "Firebase", "Material-UI"],
      image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=500&h=300&fit=crop",
      status: "Live",
      links: {
        github: "https://github.com/user/taskapp",
        demo: "https://demo-taskapp.com"
      },
      dateCompleted: "2024-02-20"
    }
  ];

  // Sample contact messages
  const sampleContacts = [
    {
      id: 1,
      name: "John Smith",
      email: "john@example.com",
      phone: "+1-234-567-8900",
      subject: "Project Inquiry",
      message: "Hi, I'm interested in collaborating on a web development project.",
      contactMethod: "email",
      status: "new",
      date: "2024-01-10"
    },
    {
      id: 2,
      name: "Sarah Wilson",
      email: "sarah@company.com",
      subject: "Job Opportunity",
      message: "We have an exciting job opportunity that might interest you.",
      contactMethod: "email", 
      status: "replied",
      date: "2024-01-12"
    }
  ];

  // Sample git settings
  const sampleGitSettings = {
    username: "kanuprajapati",
    accessToken: "",
    isConnected: true
  };

  // Sample SMS notifications
  const sampleSMSNotifications = [
    {
      id: 1,
      message: "New contact form submission from John Smith",
      phone: "+91-9876543210",
      category: "Contact",
      status: "sent",
      timestamp: new Date("2024-01-10T10:30:00Z")
    },
    {
      id: 2,
      message: "Project milestone completed: E-commerce Platform",
      phone: "+91-9876543210", 
      category: "Project",
      status: "sent",
      timestamp: new Date("2024-01-15T15:45:00Z")
    }
  ];

  // Sample SMS categories
  const sampleSMSCategories = ["Contact", "Project", "Urgent", "Support", "Marketing"];

  // Sample notification settings
  const sampleNotificationSettings = {
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: false,
    emailOnNewMessage: true,
    smsOnUrgent: true
  };

  // Sample activities
  const sampleActivities = [
    {
      id: 1,
      title: "Completed E-commerce Platform",
      description: "Successfully delivered a full-stack e-commerce solution",
      type: "project",
      date: "2024-01-15",
      icon: "🚀",
      category: "Development"
    },
    {
      id: 2,
      title: "React Certification",
      description: "Earned React Developer Certification from Meta",
      type: "achievement",
      date: "2024-01-20",
      icon: "🏆",
      category: "Education"
    },
    {
      id: 3,
      title: "Started new project",
      description: "Beginning work on Task Management App",
      type: "project", 
      date: "2024-02-01",
      icon: "📋",
      category: "Development"
    }
  ];

  // Sample skills
  const sampleSkills = [
    {
      id: 1,
      name: "React",
      category: "Frontend",
      level: 95,
      years: 4,
      icon: "⚛️"
    },
    {
      id: 2,
      name: "Node.js",
      category: "Backend",
      level: 90,
      years: 3,
      icon: "🟢"
    },
    {
      id: 3,
      name: "TypeScript",
      category: "Language",
      level: 85,
      years: 2,
      icon: "🔷"
    },
    {
      id: 4,
      name: "MongoDB",
      category: "Database",
      level: 80,
      years: 3,
      icon: "🍃"
    },
    {
      id: 5,
      name: "Python", 
      category: "Language",
      level: 75,
      years: 2,
      icon: "🐍"
    }
  ];

  // Store data in localStorage
  localStorage.setItem("adminProjects", JSON.stringify(sampleProjects));
  localStorage.setItem("contactMessages", JSON.stringify(sampleContacts));
  localStorage.setItem("gitSettings", JSON.stringify(sampleGitSettings));
  localStorage.setItem("smsNotifications", JSON.stringify(sampleSMSNotifications));
  localStorage.setItem("smsCategories", JSON.stringify(sampleSMSCategories));
  localStorage.setItem("notificationSettings", JSON.stringify(sampleNotificationSettings));
  localStorage.setItem("activities", JSON.stringify(sampleActivities));
  localStorage.setItem("skills", JSON.stringify(sampleSkills));

  console.log("Sample data created in localStorage");
  return {
    projects: sampleProjects.length,
    contacts: sampleContacts.length,
    gitSettings: 1,
    smsNotifications: sampleSMSNotifications.length,
    smsCategories: sampleSMSCategories.length,
    activities: sampleActivities.length,
    skills: sampleSkills.length
  };
};

// Function to clear all sample data
export const clearSampleData = () => {
  const keys = [
    "adminProjects",
    "contactMessages", 
    "gitSettings",
    "smsNotifications",
    "smsCategories",
    "notificationSettings",
    "activities",
    "skills"
  ];
  
  keys.forEach(key => localStorage.removeItem(key));
  console.log("Sample data cleared from localStorage");
};
