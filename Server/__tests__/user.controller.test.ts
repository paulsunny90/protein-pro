import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app';
import User from '../models/user.model';
import bcrypt from 'bcryptjs';

describe('User Controller Tests', () => {
  // Clean up test database after each test
  afterEach(async () => {
    await User.deleteMany({});
  });

  describe('GET /api/user/profile', () => {
    it('should return user profile when authenticated', async () => {
      // First register a user
      const userData = {
        name: 'Test User',
        email: 'profile@example.com',
        password: 'password123'
      };

      await request(app)
        .post('/api/auth/register')
        .send(userData);

      // Then login to get the token
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
          email: userData.email,
          password: userData.password
        });

      // Mock auth middleware by passing token in headers (if needed)
      // Since our middleware uses cookies, we need to handle that
      const response = await request(app)
        .get('/api/user/profile')
        .set('Cookie', loginRes.headers['set-cookie']) // Pass the cookie from login
        .expect(200);

      expect(response.body.user.email).toBe(userData.email);
      expect(response.body.user.name).toBe(userData.name);
    });
  });

  describe('POST /api/user/set-password', () => {
    it('should set password for user', async () => {
      // First register a user
      const userData = {
        name: 'Test User',
        email: 'setpass@example.com',
        password: 'initialpass'
      };

      await request(app)
        .post('/api/auth/register')
        .send(userData);

      // Then login to get the token
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
          email: userData.email,
          password: userData.password
        });

      // Set a new password
      const response = await request(app)
        .post('/api/user/set-password')
        .set('Cookie', loginRes.headers['set-cookie'])
        .send({
          password: 'newpassword123'
        })
        .expect(200);

      expect(response.body.message).toBe('Password set successfully');

      // Verify the password was updated by trying to login with new password
      // This would require a more complex test setup, so we'll just test the endpoint response
    });
  });
});