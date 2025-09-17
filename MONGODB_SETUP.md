# MongoDB Setup Guide

This guide will help you set up MongoDB for your portfolio application to replace localStorage with persistent database storage.

## Option 1: Local MongoDB Installation

### 1. Install MongoDB Community Edition

**For Windows:**

1. Download MongoDB Community Server from https://www.mongodb.com/try/download/community
2. Run the installer and follow the setup wizard
3. Choose "Complete" installation
4. Install MongoDB as a Windows Service

**For macOS:**

```bash
# Using Homebrew
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB service
brew services start mongodb/brew/mongodb-community
```

**For Ubuntu/Debian:**

```bash
# Import MongoDB public key
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Update package list and install
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB service
sudo systemctl start mongod
sudo systemctl enable mongod
```

### 2. Verify Installation

```bash
# Check if MongoDB is running
mongosh

# You should see MongoDB shell connection message
# Type 'exit' to exit the shell
```

## Option 2: MongoDB Atlas (Cloud)

### 1. Create MongoDB Atlas Account

1. Go to https://www.mongodb.com/atlas
2. Sign up for a free account
3. Create a new project and cluster

### 2. Get Connection String

1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string
4. Replace `<password>` with your database user password

### 3. Configure Environment Variables

Update your `.env` file or use DevServerControl:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/portfolio?retryWrites=true&w=majority
```

## Using the Migration Tool

### 1. Start Your Application

```bash
npm run dev
```

### 2. Access Admin Settings

1. Go to your admin panel
2. Navigate to "Admin Settings"
3. Find the "Data Migration to MongoDB" section

### 3. Migrate Your Data

1. Click "Migrate to MongoDB" button
2. Wait for the migration to complete
3. Your localStorage data will be transferred to MongoDB
4. localStorage will be cleared after successful migration

## Benefits of MongoDB Integration

✅ **Data Persistence**: Your data survives browser clears and works across devices  
✅ **Backup & Recovery**: Automatic data backups and recovery options  
✅ **Scalability**: Handle large amounts of data efficiently  
✅ **Security**: Secure database storage with authentication  
✅ **Real-time Sync**: Multiple admin sessions stay synchronized

## Troubleshooting

### Connection Issues

- Ensure MongoDB service is running: `sudo systemctl status mongod`
- Check firewall settings for port 27017
- Verify connection string format

### Atlas Connection Issues

- Check IP whitelist in Atlas security settings
- Verify username/password in connection string
- Ensure network access is configured

### Migration Issues

- Check browser console for error messages
- Ensure MongoDB connection is working
- Verify admin panel access

## Database Structure

Your data will be organized in these collections:

- `profiles` - Profile information and settings
- `projects` - All your projects and portfolios
- `contactmessages` - Contact form submissions
- `gitsettings` - Git integration settings

## Need Help?

If you encounter any issues:

1. Check the browser console for error messages
2. Verify MongoDB connection in server logs
3. Ensure all environment variables are set correctly
4. Test the connection using the migration status check

Your portfolio application is now ready for production with MongoDB! 🚀
