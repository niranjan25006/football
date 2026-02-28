const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) throw new Error('MONGO_URI not defined');

    // Attempt connection
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 2000 });
    console.log(`✅ MongoDB Connected: ${mongoose.connection.host}`);
  } catch (error) {
    console.warn(`⚠️ Local MongoDB failed, starting Memory Server... (${error.message})`);
    try {
      const mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      await mongoose.connect(uri);
      console.log(`🚀 MongoDB Memory Server Started: ${uri}`);
    } catch (innerError) {
      console.error(`❌ Fatal: Could not start Memory Server: ${innerError.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
