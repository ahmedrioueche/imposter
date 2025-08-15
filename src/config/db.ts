import mongoose from 'mongoose';

// Environment-based database configuration
const getDatabaseConfig = () => {
  const nodeEnv = process.env.NODE_ENV || 'development';

  if (nodeEnv === 'production') {
    // Production: Use the production database
    return {
      uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/lets_play_prod',
      name: 'lets_play_prod',
    };
  } else {
    // Development: Use the test database for development
    return {
      uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/test',
      name: 'test',
    };
  }
};

const { uri: MONGODB_URI, name: DB_NAME } = getDatabaseConfig();

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

console.log(
  `🔗 Connecting to database: ${DB_NAME} (${process.env.NODE_ENV || 'development'} mode)`
);

declare global {
  var _mongoosePromise: Promise<typeof mongoose> | undefined;
  var _mongooseConnection: typeof mongoose | undefined;
}

async function dbConnect() {
  if (global._mongooseConnection) {
    return global._mongooseConnection;
  }

  if (!global._mongoosePromise) {
    const opts = {
      bufferCommands: false,
    };

    global._mongoosePromise = mongoose.connect(MONGODB_URI as string, opts);
  }

  try {
    global._mongooseConnection = await global._mongoosePromise;
    console.log(`✅ Connected to MongoDB: ${DB_NAME}`);

    // Fix any problematic indexes on first connection
    await fixDatabaseIndexes();
  } catch (e) {
    global._mongoosePromise = undefined; // Reset promise on error
    console.error(`❌ Failed to connect to MongoDB: ${DB_NAME}`, e);
    throw e;
  }

  return global._mongooseConnection;
}

// Function to fix problematic database indexes
async function fixDatabaseIndexes() {
  try {
    const db = mongoose.connection.db;
    const usersCollection = db?.collection('users');

    // List all indexes
    const indexes = await usersCollection?.indexes();

    // Find and drop the problematic id index
    const idIndex = indexes?.find(
      (index) => index.key && index.key.id === 1 && index.unique === true
    );

    if (idIndex) {
      console.log(`🔧 Dropping problematic index: ${idIndex.name}`);
      await usersCollection?.dropIndex(idIndex?.name!);
      console.log('✅ Successfully dropped the id index');
    }

    // Ensure proper indexes exist
    const emailIndex = indexes?.find(
      (index) => index.key && index.key.email === 1 && index.unique === true
    );

    if (!emailIndex) {
      console.log('🔧 Creating unique index on email...');
      await usersCollection?.createIndex({ email: 1 }, { unique: true });
      console.log('✅ Created unique index on email');
    }
  } catch (error) {
    console.error('⚠️  Error fixing database indexes:', error);
    // Don't throw error, just log it
  }
}

// Function to get MongoDB database instance for direct operations
async function connectToDatabase() {
  await dbConnect();
  return { db: mongoose.connection.db };
}

export default dbConnect;
export { connectToDatabase, getDatabaseConfig };
