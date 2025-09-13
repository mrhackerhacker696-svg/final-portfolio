# MongoDB Portfolio API Documentation

## Overview

This API provides comprehensive CRUD operations for a portfolio management system with MongoDB backend. All endpoints return consistent response formats with proper error handling.

## Base URL
```
http://localhost:8080/api
```

## Authentication
Currently using a default user ID: `kanu-portfolio`

## Response Format
All API responses follow this structure:
```json
{
  "success": true/false,
  "data": {...}, // or null for errors
  "message": "Success/error message",
  "error": "Error type" // only for errors
}
```

## Health & Status Endpoints

### 1. Health Check
**GET** `/health`

Check overall system health and MongoDB status.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-01-09T12:00:00.000Z",
  "mongodb": {
    "status": "connected",
    "message": "MongoDB is connected and ready",
    "database": "kanu-portfolio"
  },
  "environment": "development",
  "uptime": 123.45,
  "memory": {...},
  "version": "v18.17.0"
}
```

### 2. MongoDB Status
**GET** `/mongodb/status`

Get detailed MongoDB connection status.

**Response:**
```json
{
  "status": "connected",
  "message": "MongoDB is connected and ready",
  "database": "kanu-portfolio"
}
```

### 3. Test MongoDB Connection
**POST** `/mongodb/test`

Test if MongoDB connection is working.

**Response:**
```json
{
  "success": true,
  "message": "MongoDB connection is working",
  "status": "connected"
}
```

## Profile Endpoints

### 1. Get Profile
**GET** `/profile`

Retrieve user profile information.

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "userId": "kanu-portfolio",
    "profileImage": "https://example.com/image.jpg",
    "logoText": "⚡ logo",
    "resumeUrl": "https://example.com/resume.pdf",
    "contactInfo": {
      "email": "kanuprajapati717@gmail.com",
      "phone": "+91 9876543210",
      "location": "Gujarat, India",
      "linkedin": "https://linkedin.com/in/kanuprajapati",
      "github": "https://github.com/kanuprajapati"
    },
    "createdAt": "2025-01-09T12:00:00.000Z",
    "updatedAt": "2025-01-09T12:00:00.000Z"
  },
  "message": "Profile retrieved successfully"
}
```

### 2. Update Profile
**PUT** `/profile`

Update entire profile information.

**Request Body:**
```json
{
  "profileImage": "https://new-image.com/image.jpg",
  "logoText": "🚀 New Logo",
  "contactInfo": {
    "email": "newemail@gmail.com",
    "phone": "+91 1234567890"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    // Updated profile object
  },
  "message": "Profile updated successfully"
}
```

### 3. Update Profile Image
**PUT** `/profile/image`

Update only the profile image.

**Request Body:**
```json
{
  "profileImage": "https://new-image.com/image.jpg"
}
```

### 4. Update Logo
**PUT** `/profile/logo`

Update only the logo text.

**Request Body:**
```json
{
  "logoText": "🚀 New Logo"
}
```

### 5. Update Resume URL
**PUT** `/profile/resume`

Update only the resume URL.

**Request Body:**
```json
{
  "resumeUrl": "https://example.com/new-resume.pdf"
}
```

### 6. Update Contact Info
**PUT** `/profile/contact`

Update only contact information.

**Request Body:**
```json
{
  "contactInfo": {
    "email": "newemail@gmail.com",
    "phone": "+91 1234567890",
    "location": "Mumbai, India"
  }
}
```

### 7. Get Profile Statistics
**GET** `/profile/stats`

Get profile completion statistics.

**Response:**
```json
{
  "success": true,
  "data": {
    "lastUpdated": "2025-01-09T12:00:00.000Z",
    "createdAt": "2025-01-09T12:00:00.000Z",
    "hasProfileImage": true,
    "hasResume": true,
    "contactInfoComplete": true,
    "socialLinks": {
      "linkedin": true,
      "github": true
    }
  },
  "message": "Profile statistics retrieved successfully"
}
```

### 8. Delete Profile
**DELETE** `/profile`

Delete user profile (admin only).

**Response:**
```json
{
  "success": true,
  "message": "Profile deleted successfully",
  "deletedProfile": {
    // Deleted profile object
  }
}
```

## Projects Endpoints

### 1. Get All Projects
**GET** `/projects`

Retrieve all projects with optional filtering and pagination.

**Query Parameters:**
- `status` - Filter by project status
- `category` - Filter by project category/tags
- `limit` - Number of projects per page (default: 10)
- `page` - Page number (default: 1)

**Example:** `GET /projects?status=Completed&limit=5&page=1`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "userId": "kanu-portfolio",
      "title": "Portfolio Website",
      "description": "Modern portfolio website built with React",
      "fullDescription": "Detailed description...",
      "tags": ["React", "TypeScript", "TailwindCSS"],
      "image": "https://example.com/project.jpg",
      "status": "Completed",
      "dateCompleted": "2025-01-01",
      "links": {
        "github": "https://github.com/user/project",
        "demo": "https://demo.com",
        "live": "https://live.com"
      },
      "screenshots": ["https://example.com/screenshot1.jpg"],
      "challenges": "Technical challenges faced...",
      "outcome": "Project outcomes...",
      "createdAt": "2025-01-09T12:00:00.000Z",
      "updatedAt": "2025-01-09T12:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  },
  "message": "Retrieved 10 projects successfully"
}
```

### 2. Get Project by ID
**GET** `/projects/:id`

Retrieve a specific project by ID.

**Response:**
```json
{
  "success": true,
  "data": {
    // Single project object
  },
  "message": "Project retrieved successfully"
}
```

### 3. Create New Project
**POST** `/projects`

Create a new project.

**Request Body:**
```json
{
  "title": "New Project",
  "description": "Project description",
  "fullDescription": "Detailed project description",
  "tags": ["React", "Node.js"],
  "image": "https://example.com/project.jpg",
  "status": "In Development",
  "links": {
    "github": "https://github.com/user/project",
    "demo": "https://demo.com"
  }
}
```

**Required Fields:** `title`, `description`, `image`

**Response:**
```json
{
  "success": true,
  "data": {
    // Created project object
  },
  "message": "Project created successfully"
}
```

### 4. Update Project
**PUT** `/projects/:id`

Update an existing project.

**Request Body:**
```json
{
  "title": "Updated Project Title",
  "status": "Completed",
  "dateCompleted": "2025-01-09"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    // Updated project object
  },
  "message": "Project updated successfully"
}
```

### 5. Delete Project
**DELETE** `/projects/:id`

Delete a project.

**Response:**
```json
{
  "success": true,
  "message": "Project deleted successfully",
  "deletedProject": {
    // Deleted project object
  }
}
```

### 6. Get Project Statistics
**GET** `/projects/stats/overview`

Get project overview statistics.

**Response:**
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalProjects": 25,
      "completedProjects": 15,
      "liveProjects": 8,
      "inDevelopmentProjects": 2,
      "publishedProjects": 5
    },
    "topTags": [
      { "_id": "React", "count": 12 },
      { "_id": "Node.js", "count": 8 }
    ],
    "totalTags": 15
  },
  "message": "Project statistics retrieved successfully"
}
```

### 7. Search Projects
**GET** `/projects/search`

Search projects with various filters.

**Query Parameters:**
- `q` - Search query text
- `status` - Filter by status
- `tags` - Filter by tags
- `limit` - Maximum results (default: 10)

**Example:** `GET /projects/search?q=React&status=Completed&limit=5`

**Response:**
```json
{
  "success": true,
  "data": [
    // Matching projects
  ],
  "count": 5,
  "message": "Found 5 projects matching your search"
}
```

## Contact Messages Endpoints

### 1. Get All Contact Messages
**GET** `/contacts`

Retrieve all contact messages.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "userId": "kanu-portfolio",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "subject": "Project Inquiry",
      "message": "I'm interested in your work...",
      "contactMethod": "email",
      "status": "new",
      "date": "2025-01-09",
      "createdAt": "2025-01-09T12:00:00.000Z",
      "updatedAt": "2025-01-09T12:00:00.000Z"
    }
  ],
  "message": "Contact messages retrieved successfully"
}
```

### 2. Create Contact Message
**POST** `/contacts`

Create a new contact message.

**Request Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "phone": "+1234567890",
  "subject": "Collaboration Request",
  "message": "I would like to collaborate...",
  "contactMethod": "email"
}
```

**Required Fields:** `name`, `email`, `subject`, `message`

### 3. Update Contact Message Status
**PUT** `/contacts/:id`

Update message status.

**Request Body:**
```json
{
  "status": "replied"
}
```

### 4. Delete Contact Message
**DELETE** `/contacts/:id`

Delete a contact message.

## Activities & Skills Endpoints

### 1. Get All Activities
**GET** `/activities`

Retrieve all activities.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "userId": "kanu-portfolio",
      "title": "Completed Portfolio Project",
      "description": "Successfully completed portfolio website",
      "type": "project",
      "date": "2025-01-09",
      "icon": "🎯",
      "category": "Development"
    }
  ],
  "message": "Activities retrieved successfully"
}
```

### 2. Create Activity
**POST** `/activities`

Create a new activity.

**Request Body:**
```json
{
  "title": "New Achievement",
  "description": "Description of achievement",
  "type": "achievement",
  "date": "2025-01-09",
  "icon": "🏆",
  "category": "Personal"
}
```

### 3. Get All Skills
**GET** `/activities/skills`

Retrieve all skills.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "userId": "kanu-portfolio",
      "name": "React",
      "category": "Frontend",
      "level": 85,
      "years": 3,
      "icon": "⚛️"
    }
  ],
  "message": "Skills retrieved successfully"
}
```

### 4. Create Skill
**POST** `/activities/skills`

Create a new skill.

**Request Body:**
```json
{
  "name": "TypeScript",
  "category": "Programming",
  "level": 75,
  "years": 2,
  "icon": "📘"
}
```

## Settings Endpoints

### 1. Get User Settings
**GET** `/settings`

Retrieve user settings.

**Response:**
```json
{
  "success": true,
  "data": {
    "userId": "kanu-portfolio",
    "siteSettings": {
      "siteName": "Kanu Prajapati Portfolio",
      "siteDescription": "Full-stack Developer...",
      "maintenanceMode": false,
      "allowRegistration": false,
      "seoEnabled": true
    },
    "notificationSettings": {
      "emailNotifications": true,
      "smsNotifications": false,
      "pushNotifications": true
    },
    "theme": "system",
    "language": "en"
  },
  "message": "Settings retrieved successfully"
}
```

### 2. Update Settings
**PUT** `/settings`

Update user settings.

**Request Body:**
```json
{
  "siteSettings": {
    "siteName": "New Site Name",
    "maintenanceMode": true
  },
  "theme": "dark"
}
```

## SMS Notifications Endpoints

### 1. Get SMS Notifications
**GET** `/sms/notifications`

Retrieve all SMS notifications.

### 2. Create SMS Notification
**POST** `/sms/notifications`

Create a new SMS notification.

**Request Body:**
```json
{
  "message": "New contact message received",
  "phone": "+1234567890",
  "category": "Contact"
}
```

### 3. Get SMS Categories
**GET** `/sms/categories`

Retrieve SMS categories.

### 4. Update SMS Categories
**PUT** `/sms/categories`

Update SMS categories.

**Request Body:**
```json
{
  "categories": ["Contact", "Urgent", "Support", "Inquiry"]
}
```

## Error Responses

### Validation Error (400)
```json
{
  "success": false,
  "error": "Validation Error",
  "message": "Validation failed",
  "details": {
    "title": {
      "message": "Project title is required"
    }
  }
}
```

### Not Found (404)
```json
{
  "success": false,
  "error": "Project not found",
  "message": "No project found with the provided ID"
}
```

### MongoDB Unavailable (503)
```json
{
  "error": "MongoDB not available",
  "message": "Please use localStorage or set up MongoDB connection",
  "code": "MONGODB_UNAVAILABLE"
}
```

### Internal Server Error (500)
```json
{
  "success": false,
  "error": "Internal Server Error",
  "message": "Something went wrong"
}
```

## Postman Collection

### Import this collection into Postman:

```json
{
  "info": {
    "name": "Portfolio MongoDB API",
    "description": "Complete API collection for Portfolio Management System",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Health & Status",
      "item": [
        {
          "name": "Health Check",
          "request": {
            "method": "GET",
            "url": "{{baseUrl}}/health"
          }
        },
        {
          "name": "MongoDB Status",
          "request": {
            "method": "GET",
            "url": "{{baseUrl}}/mongodb/status"
          }
        },
        {
          "name": "Test MongoDB Connection",
          "request": {
            "method": "POST",
            "url": "{{baseUrl}}/mongodb/test"
          }
        }
      ]
    },
    {
      "name": "Profile",
      "item": [
        {
          "name": "Get Profile",
          "request": {
            "method": "GET",
            "url": "{{baseUrl}}/profile"
          }
        },
        {
          "name": "Update Profile",
          "request": {
            "method": "PUT",
            "url": "{{baseUrl}}/profile",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"profileImage\": \"https://example.com/new-image.jpg\",\n  \"logoText\": \"🚀 New Logo\"\n}"
            }
          }
        },
        {
          "name": "Update Profile Image",
          "request": {
            "method": "PUT",
            "url": "{{baseUrl}}/profile/image",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"profileImage\": \"https://example.com/new-image.jpg\"\n}"
            }
          }
        },
        {
          "name": "Get Profile Stats",
          "request": {
            "method": "GET",
            "url": "{{baseUrl}}/profile/stats"
          }
        }
      ]
    },
    {
      "name": "Projects",
      "item": [
        {
          "name": "Get All Projects",
          "request": {
            "method": "GET",
            "url": "{{baseUrl}}/projects"
          }
        },
        {
          "name": "Get Projects with Filters",
          "request": {
            "method": "GET",
            "url": "{{baseUrl}}/projects?status=Completed&limit=5&page=1"
          }
        },
        {
          "name": "Get Project by ID",
          "request": {
            "method": "GET",
            "url": "{{baseUrl}}/projects/{{projectId}}"
          }
        },
        {
          "name": "Create New Project",
          "request": {
            "method": "POST",
            "url": "{{baseUrl}}/projects",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"title\": \"New Portfolio Project\",\n  \"description\": \"A modern portfolio website built with React and Node.js\",\n  \"tags\": [\"React\", \"Node.js\", \"MongoDB\"],\n  \"image\": \"https://example.com/project.jpg\",\n  \"status\": \"In Development\",\n  \"links\": {\n    \"github\": \"https://github.com/user/project\"\n  }\n}"
            }
          }
        },
        {
          "name": "Update Project",
          "request": {
            "method": "PUT",
            "url": "{{baseUrl}}/projects/{{projectId}}",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"title\": \"Updated Project Title\",\n  \"status\": \"Completed\",\n  \"dateCompleted\": \"2025-01-09\"\n}"
            }
          }
        },
        {
          "name": "Delete Project",
          "request": {
            "method": "DELETE",
            "url": "{{baseUrl}}/projects/{{projectId}}"
          }
        },
        {
          "name": "Get Project Stats",
          "request": {
            "method": "GET",
            "url": "{{baseUrl}}/projects/stats/overview"
          }
        },
        {
          "name": "Search Projects",
          "request": {
            "method": "GET",
            "url": "{{baseUrl}}/projects/search?q=React&status=Completed&limit=5"
          }
        }
      ]
    },
    {
      "name": "Contact Messages",
      "item": [
        {
          "name": "Get All Messages",
          "request": {
            "method": "GET",
            "url": "{{baseUrl}}/contacts"
          }
        },
        {
          "name": "Create Message",
          "request": {
            "method": "POST",
            "url": "{{baseUrl}}/contacts",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"name\": \"John Doe\",\n  \"email\": \"john@example.com\",\n  \"phone\": \"+1234567890\",\n  \"subject\": \"Project Inquiry\",\n  \"message\": \"I'm interested in your portfolio work and would like to discuss a potential project.\",\n  \"contactMethod\": \"email\"\n}"
            }
          }
        },
        {
          "name": "Update Message Status",
          "request": {
            "method": "PUT",
            "url": "{{baseUrl}}/contacts/{{messageId}}",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"status\": \"replied\"\n}"
            }
          }
        }
      ]
    },
    {
      "name": "Activities & Skills",
      "item": [
        {
          "name": "Get All Activities",
          "request": {
            "method": "GET",
            "url": "{{baseUrl}}/activities"
          }
        },
        {
          "name": "Create Activity",
          "request": {
            "method": "POST",
            "url": "{{baseUrl}}/activities",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"title\": \"Completed Certification\",\n  \"description\": \"Successfully completed AWS Solutions Architect certification\",\n  \"type\": \"achievement\",\n  \"date\": \"2025-01-09\",\n  \"icon\": \"🏆\",\n  \"category\": \"Professional\"\n}"
            }
          }
        },
        {
          "name": "Get All Skills",
          "request": {
            "method": "GET",
            "url": "{{baseUrl}}/activities/skills"
          }
        },
        {
          "name": "Create Skill",
          "request": {
            "method": "POST",
            "url": "{{baseUrl}}/activities/skills",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"name\": \"Docker\",\n  \"category\": \"DevOps\",\n  \"level\": 70,\n  \"years\": 2,\n  \"icon\": \"🐳\"\n}"
            }
          }
        }
      ]
    },
    {
      "name": "Settings",
      "item": [
        {
          "name": "Get Settings",
          "request": {
            "method": "GET",
            "url": "{{baseUrl}}/settings"
          }
        },
        {
          "name": "Update Settings",
          "request": {
            "method": "PUT",
            "url": "{{baseUrl}}/settings",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"siteSettings\": {\n    \"siteName\": \"Updated Portfolio Site\",\n    \"maintenanceMode\": false\n  },\n  \"theme\": \"dark\"\n}"
            }
          }
        }
      ]
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:8080/api",
      "type": "string"
    },
    {
      "key": "projectId",
      "value": "507f1f77bcf86cd799439011",
      "type": "string"
    },
    {
      "key": "messageId",
      "value": "507f1f77bcf86cd799439012",
      "type": "string"
    }
  ]
}
```

## Testing the API

### 1. Start MongoDB
```bash
# Windows
mongod

# macOS/Linux
sudo systemctl start mongod
```

### 2. Start the Server
```bash
npm run dev
```

### 3. Test Health Endpoint
```bash
curl http://localhost:8080/api/health
```

### 4. Test Profile Creation
```bash
curl -X PUT http://localhost:8080/api/profile \
  -H "Content-Type: application/json" \
  -d '{
    "profileImage": "https://example.com/image.jpg",
    "logoText": "🚀 Portfolio"
  }'
```

### 5. Test Project Creation
```bash
curl -X POST http://localhost:8080/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Project",
    "description": "A test project for API testing",
    "image": "https://example.com/project.jpg",
    "tags": ["Test", "API"]
  }'
```

## Common Issues & Solutions

### 1. MongoDB Connection Failed
- Ensure MongoDB is running
- Check connection string in `.env` file
- Verify MongoDB port (27017) is accessible

### 2. Validation Errors
- Check required fields in request body
- Ensure data types match schema requirements
- Validate URL formats for image fields

### 3. 404 Errors
- Verify endpoint URLs are correct
- Check if resource ID exists
- Ensure MongoDB is connected

### 4. 500 Errors
- Check server logs for detailed error messages
- Verify MongoDB connection status
- Check request body format

## Best Practices

1. **Always check response status** before processing data
2. **Handle errors gracefully** with proper user feedback
3. **Use pagination** for large datasets
4. **Validate input data** on both client and server
5. **Implement proper error logging** for debugging
6. **Use consistent response formats** across all endpoints
7. **Test with Postman** before implementing in frontend
8. **Monitor MongoDB connection** status regularly
