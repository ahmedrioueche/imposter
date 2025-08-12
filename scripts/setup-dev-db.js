import mongoose from 'mongoose';

async function setupDevDatabase() {
  try {
    // Connect to the test database (development)
    const mongoUri = 'mongodb://localhost:27017/test';
    console.log('🔗 Connecting to development database:', mongoUri);

    await mongoose.connect(mongoUri);
    console.log('✅ Connected successfully');

    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');

    // List all current indexes
    console.log('\n📋 Current indexes in users collection:');
    const indexes = await usersCollection.indexes();
    indexes.forEach((index, i) => {
      console.log(`${i + 1}. ${index.name}:`, index.key);
    });

    // Find and drop the problematic id index
    const idIndex = indexes.find(
      (index) => index.key && index.key.id === 1 && index.unique === true
    );

    if (idIndex) {
      console.log(`\n🔧 Found problematic index: ${idIndex.name}`);
      console.log('🗑️  Dropping it...');
      await usersCollection.dropIndex(idIndex.name);
      console.log('✅ Successfully dropped the id index');
    } else {
      console.log('\n✅ No problematic id index found');
    }

    // Show updated indexes
    console.log('\n📋 Updated indexes:');
    const updatedIndexes = await usersCollection.indexes();
    updatedIndexes.forEach((index, i) => {
      console.log(`${i + 1}. ${index.name}:`, index.key);
    });

    // Create proper indexes for the User model
    console.log('\n🔧 Creating proper indexes...');

    // Ensure email is unique
    await usersCollection.createIndex({ email: 1 }, { unique: true });
    console.log('✅ Created unique index on email');

    // Create index for online status queries
    await usersCollection.createIndex({ isOnline: 1 });
    console.log('✅ Created index on isOnline');

    // Create index for verification status
    await usersCollection.createIndex({ isVerified: 1 });
    console.log('✅ Created index on isVerified');

    console.log('\n🎉 Development database setup completed successfully!');
    console.log('📊 Database: test');
    console.log('🌍 Environment: development');
  } catch (error) {
    console.error('❌ Error setting up development database:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from database');
  }
}

setupDevDatabase();
