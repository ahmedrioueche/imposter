import mongoose from 'mongoose';

async function setupProdDatabase() {
  try {
    // Connect to the production database
    const mongoUri = 'mongodb://localhost:27017/lets_play_prod';
    console.log('🔗 Connecting to production database:', mongoUri);

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

    // Create index for onboarding status
    await usersCollection.createIndex({ hasCompletedOnboarding: 1 });
    console.log('✅ Created index on hasCompletedOnboarding');

    // Create compound index for location-based queries
    await usersCollection.createIndex({ 'location.cords': '2dsphere' });
    console.log('✅ Created geospatial index on location');

    console.log('\n🎉 Production database setup completed successfully!');
    console.log('📊 Database: lets_play_prod');
    console.log('🌍 Environment: production');
  } catch (error) {
    console.error('❌ Error setting up production database:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from database');
  }
}

setupProdDatabase();
