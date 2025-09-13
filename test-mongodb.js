// MongoDB Connection Test Script
// Run this script to test your MongoDB connection

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/kanu-portfolio";

async function testMongoDBConnection() {
  console.log('🔌 Testing MongoDB connection...');
  console.log(`📍 Connection URI: ${MONGODB_URI.replace(/\/\/.*@/, '//***:***@')}`);
  
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    
    console.log('✅ MongoDB connected successfully!');
    
    // Test basic operations
    await testBasicOperations();
    
    // Disconnect
    await mongoose.disconnect();
    console.log('✅ MongoDB disconnected successfully!');
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.log('\n🔧 Troubleshooting tips:');
    console.log('1. Make sure MongoDB is running (mongod command)');
    console.log('2. Check if port 27017 is accessible');
    console.log('3. Verify your connection string in .env file');
    console.log('4. For MongoDB Atlas, check IP whitelist and credentials');
    
    process.exit(1);
  }
}

async function testBasicOperations() {
  console.log('\n🧪 Testing basic MongoDB operations...');
  
  try {
    // Test database creation and collection access
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    
    console.log('✅ Database access successful');
    console.log(`📊 Database name: ${db.databaseName}`);
    console.log(`📁 Collections: ${collections.length}`);
    
    if (collections.length > 0) {
      collections.forEach(col => {
        console.log(`   - ${col.name}`);
      });
    }
    
    // Test creating a test document
    const TestSchema = new mongoose.Schema({
      test: String,
      timestamp: { type: Date, default: Date.now }
    });
    
    const TestModel = mongoose.model('Test', TestSchema);
    
    // Create test document
    const testDoc = new TestModel({ test: 'Connection test' });
    await testDoc.save();
    console.log('✅ Document creation successful');
    
    // Read test document
    const foundDoc = await TestModel.findOne({ test: 'Connection test' });
    console.log('✅ Document reading successful');
    
    // Update test document
    await TestModel.updateOne(
      { test: 'Connection test' },
      { test: 'Connection test updated' }
    );
    console.log('✅ Document update successful');
    
    // Delete test document
    await TestModel.deleteOne({ test: 'Connection test updated' });
    console.log('✅ Document deletion successful');
    
    console.log('\n🎉 All MongoDB operations successful!');
    
  } catch (error) {
    console.error('❌ Basic operations test failed:', error.message);
    throw error;
  }
}

// Run the test
testMongoDBConnection().catch(console.error);
