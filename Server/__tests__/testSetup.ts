import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app';

// Connect to the in-memory database before running tests
beforeAll(async () => {
  // Use a test database
  const testDbUrl = process.env.TEST_DATABASE_URL || 'mongodb://localhost:27017/testdb';
  
  await mongoose.connect(testDbUrl);
});

// Clear all collections after each test
afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});

// Close database connection after all tests
afterAll(async () => {
  await mongoose.disconnect();
});

export { request, app };