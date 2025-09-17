import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/kanu-portfolio";
const ENABLE_MONGODB = process.env.ENABLE_MONGODB !== "false";

let isConnected = false;
let connectionAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;

export const connectDB = async () => {
  if (isConnected) {
    console.log("✅ MongoDB already connected");
    return true;
  }

  if (!ENABLE_MONGODB) {
    console.log("📱 MongoDB disabled - running in localStorage mode");
    return false;
  }

  try {
    console.log(`🔌 Attempting to connect to MongoDB...`);
    console.log(`📍 Connection URI: ${MONGODB_URI.replace(/\/\/.*@/, '//***:***@')}`);

    // Use minimal, compatible options (same behavior as test script)
    await mongoose.connect(MONGODB_URI);

    isConnected = true;
    connectionAttempts = 0;
    console.log("✅ MongoDB connected successfully");

    // Set up connection event handlers
    mongoose.connection.on('error', (error) => {
      console.error('❌ MongoDB connection error:', error);
      isConnected = false;
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected');
      isConnected = false;
    });

    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconnected');
      isConnected = true;
    });

    return true;
  } catch (error) {
    connectionAttempts++;
    console.error(`❌ MongoDB connection attempt ${connectionAttempts} failed:`, error.message);

    if (connectionAttempts < MAX_RECONNECT_ATTEMPTS) {
      console.log(`🔄 Retrying connection in 5 seconds... (${connectionAttempts}/${MAX_RECONNECT_ATTEMPTS})`);
      setTimeout(() => {
        connectDB();
      }, 5000);
      return false;
    } else {
      console.warn(`⚠️ Max reconnection attempts reached. MongoDB connection failed.`);
      console.warn(`📱 Falling back to localStorage mode`);
      return false;
    }
  }
};

export const disconnectDB = async () => {
  if (!isConnected) {
    return;
  }

  try {
    await mongoose.disconnect();
    isConnected = false;
    console.log("✅ MongoDB disconnected");
  } catch (error) {
    console.error("❌ MongoDB disconnection error:", error);
  }
};

export const isMongoDBAvailable = () => {
  if (!ENABLE_MONGODB) {
    return false;
  }
  return isConnected && mongoose.connection.readyState === 1;
};

export const getConnectionStatus = () => {
  if (!ENABLE_MONGODB) {
    return { status: 'disabled', message: 'MongoDB is disabled' };
  }

  if (isConnected && mongoose.connection.readyState === 1) {
    return {
      status: 'connected',
      message: 'MongoDB is connected and ready',
      database: mongoose.connection.db?.databaseName || 'unknown'
    };
  }

  return {
    status: 'disconnected',
    message: 'MongoDB is not connected',
    readyState: mongoose.connection.readyState
  };
};

// Handle process termination
process.on("SIGINT", disconnectDB);
process.on("SIGTERM", disconnectDB);
