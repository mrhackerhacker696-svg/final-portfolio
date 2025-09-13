# MongoDB Integration Setup Guide

## Overview

Your portfolio project has been successfully converted from localStorage to MongoDB backend with automatic fallback. The system intelligently switches between MongoDB and localStorage based on availability.

## How It Works

### Automatic Fallback System
- **MongoDB Available**: All data is stored in MongoDB database
- **MongoDB Unavailable**: Automatically falls back to localStorage
- **Seamless Transition**: No code changes needed, works in both modes

### Data Storage Types
All portfolio data is now stored in MongoDB:
- ✅ Profile information (image, contact info, bio, etc.)
- ✅ Projects (with full CRUD operations)
- ✅ Contact messages
- ✅ SMS notifications and categories  
- ✅ User settings and preferences
- ✅ Activities and skills data
- ✅ Git settings

## MongoDB Configuration

### Environment Variables
Configure your MongoDB connection in the environment:

```bash
# .env file
MONGODB_URI=mongodb://localhost:27017/portfolio
ENABLE_MONGODB=true
```

### Alternative Connection Strings
```bash
# Local MongoDB
MONGODB_URI=mongodb://localhost:27017/portfolio

# MongoDB Atlas (Cloud)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/portfolio

# MongoDB with authentication
MONGODB_URI=mongodb://username:password@localhost:27017/portfolio
```

## API Endpoints

### Profile API
- `GET /api/profile` - Get profile data
- `PUT /api/profile` - Update profile
- `PUT /api/profile/image` - Update profile image
- `PUT /api/profile/contact` - Update contact info

### Projects API  
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get single project
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Contact Messages API
- `GET /api/contacts` - Get all messages
- `POST /api/contacts` - Create new message
- `PUT /api/contacts/:id` - Update message status
- `DELETE /api/contacts/:id` - Delete message

### SMS Notifications API
- `GET /api/sms/notifications` - Get SMS notifications
- `POST /api/sms/notifications` - Create SMS notification
- `DELETE /api/sms/notifications` - Clear all notifications
- `GET /api/sms/categories` - Get SMS categories
- `PUT /api/sms/categories` - Update categories

### Settings API
- `GET /api/settings` - Get user settings
- `PUT /api/settings` - Update settings
- `PUT /api/settings/notifications` - Update notification settings

### Activities & Skills API
- `GET /api/activities` - Get activities
- `POST /api/activities` - Create activity
- `GET /api/activities/skills` - Get skills
- `POST /api/activities/skills` - Create skill

## Data Migration

### Automatic Migration
Your existing localStorage data can be migrated to MongoDB:

1. **Check Migration Status**: Visit the admin settings page
2. **Run Migration**: Click "Migrate Data to MongoDB" 
3. **Verify**: Data will be transferred and localStorage cleared

### Manual Migration via API
```javascript
// Check migration status
fetch('/api/migrate/status')

// Run migration
fetch('/api/migrate/migrate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ localStorageData: {...} })
})
```

## Frontend Integration

### Using the DataService
The frontend uses a unified `dataService` that automatically handles MongoDB/localStorage switching:

```javascript
import { dataService } from '../services/dataService';

// Get data (automatically uses MongoDB or localStorage)
const projects = await dataService.getProjects();
const profile = await dataService.getProfile();

// Save data
await dataService.createProject(projectData);
await dataService.updateProfile(profileData);
```

### Updated Components
The following components have been updated to use the dataService:
- ✅ ProfileContext - Profile management
- ✅ ContactForm - Contact message storage  
- ✅ Projects page - Project CRUD operations
- ✅ All admin panels - Settings and notifications

## Testing the Integration

### 1. Test MongoDB Connection
```bash
# Check health endpoint
curl http://localhost:8082/api/health

# Response should show:
{
  "status": "ok", 
  "mongodb": "connected"  // or "disconnected"
}
```

### 2. Test Data Operations
```bash
# Get profile data
curl http://localhost:8082/api/profile

# Create a project
curl -X POST http://localhost:8082/api/projects \\
  -H "Content-Type: application/json" \\
  -d '{"title":"Test Project","description":"Test"}'
```

### 3. Test Migration
1. Add some data in localStorage mode (disable MongoDB)
2. Enable MongoDB connection
3. Run migration from admin panel
4. Verify data appears in MongoDB

## Development vs Production

### Development Mode
- Default connection: `mongodb://localhost:27017/portfolio`
- Easy testing with local MongoDB instance
- Hot reloading works with both modes

### Production Mode  
- Use MongoDB Atlas or managed MongoDB service
- Set `MONGODB_URI` to your production connection string
- Automatic SSL/TLS encryption with cloud providers

## Troubleshooting

### MongoDB Connection Issues
1. **Check MongoDB is running**: `mongosh` or MongoDB Compass
2. **Verify connection string**: Check `MONGODB_URI` format
3. **Check firewall**: Ensure port 27017 is accessible
4. **Fallback mode**: App continues working with localStorage

### Data Not Saving
1. **Check API endpoints**: Use browser dev tools
2. **Verify permissions**: Check MongoDB user permissions
3. **Check logs**: Server logs show connection status

### Migration Issues
1. **Backup localStorage**: Export data before migration
2. **Partial migration**: Some data types might fail individually
3. **Retry migration**: Can be run multiple times safely

## Next Steps

### Connect to Cloud Database
For production, consider using:
- **MongoDB Atlas** (recommended)
- **AWS DocumentDB** 
- **Azure Cosmos DB**

### Enable Authentication
Add user authentication to secure data:
- JWT tokens
- Session management
- Role-based access

### Performance Optimization
- Add database indexing
- Implement caching
- Connection pooling

## Support

If you encounter issues:
1. Check the server logs for error messages
2. Verify your MongoDB connection string
3. Test the API endpoints directly
4. The app will continue working in localStorage mode as fallback

Your portfolio is now production-ready with MongoDB backend while maintaining full backward compatibility!
