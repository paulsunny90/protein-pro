import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app';
import User from '../models/user.model';
import bcrypt from 'bcryptjs';

describe('Auth Controller Tests', () => {
  // Clean up test database after each test
  afterEach(async () => {
    await User.deleteMany({});
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(200);

      expect(response.body.message).toBe('Signup successful');
      expect(response.body.user.email).toBe(userData.email);
      expect(response.body.user.name).toBe(userData.name);
      expect(response.body.user.password).toBeUndefined(); // Password should not be returned
    });

    it('should return error if user already exists', async () => {
      // First, create a user
      await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Existing User',
          email: 'existing@example.com',
          password: 'password123'
        });

      // Try to register with same email
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Another User',
          email: 'existing@example.com',
          password: 'password123'
        })
        .expect(400);

      expect(response.body.message).toBe('User exists');
    });

    it('should return error if required fields are missing', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Incomplete User',
          // Missing email and password
        })
        .expect(400);

      expect(response.body.message).toBe('All fields required');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Create a test user
      const hashedPassword = await bcrypt.hash('password123', 10);
      await User.create({
        name: 'Test User',
        email: 'login@example.com',
        password: hashedPassword,
        authProvider: 'local',
        isVerified: true
      });
    });

    it('should login a user with correct credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@example.com',
          password: 'password123'
        })
        .expect(200);

      expect(response.body.message).toBe('Login successful');
      expect(response.body.token).toBeDefined();
      expect(response.body.user.email).toBe('login@example.com');
    });

    it('should return error for invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@example.com',
          password: 'wrongpassword'
        })
        .expect(401);

      expect(response.body.message).toBe('Invalid credentials!');
    });

    it('should return error if user does not exist', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123'
        })
        .expect(401);

      expect(response.body.message).toBe('User not found!');
    });

    it('should return error if password is not provided', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@example.com',
          password: '' // Empty password
        })
        .expect(400);

      expect(response.body.message).toBe('Password is required!');
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should logout user and clear cookies', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .expect(200);

      expect(response.body.message).toBe('Logged out successfully');
    });
  });
});