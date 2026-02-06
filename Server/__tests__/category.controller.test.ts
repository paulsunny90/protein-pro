import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app';
import Category from '../models/category.model';

describe('Category Controller Tests', () => {
  // Clean up test database after each test
  afterEach(async () => {
    await Category.deleteMany({});
  });

  describe('POST /api/category', () => {
    it('should create a new category', async () => {
      const categoryData = {
        name: 'Test Category',
        description: 'Test Description'
      };

      const response = await request(app)
        .post('/api/category')
        .send(categoryData)
        .expect(201);

      expect(response.body.name).toBe(categoryData.name);
      expect(response.body.description).toBe(categoryData.description);
    });

    it('should return error if category already exists', async () => {
      // First create a category
      const categoryData = {
        name: 'Duplicate Category',
        description: 'Test Description'
      };

      await request(app)
        .post('/api/category')
        .send(categoryData);

      // Try to create the same category again
      const response = await request(app)
        .post('/api/category')
        .send(categoryData)
        .expect(400);

      expect(response.body.message).toBe('Category already exists');
    });
  });

  describe('GET /api/category', () => {
    beforeEach(async () => {
      // Create some test categories
      await Category.create([
        {
          name: 'Category 1',
          description: 'Description 1'
        },
        {
          name: 'Category 2',
          description: 'Description 2'
        }
      ]);
    });

    it('should get all categories', async () => {
      const response = await request(app)
        .get('/api/category')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
    });
  });

  describe('GET /api/category/:id', () => {
    let categoryId: string;

    beforeEach(async () => {
      const category = await Category.create({
        name: 'Single Category',
        description: 'Single Description'
      });
      categoryId = category._id.toString();
    });

    it('should get a category by ID', async () => {
      const response = await request(app)
        .get(`/api/category/${categoryId}`)
        .expect(200);

      expect(response.body.name).toBe('Single Category');
      expect(response.body.description).toBe('Single Description');
    });

    it('should return error for non-existent category', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      
      const response = await request(app)
        .get(`/api/category/${fakeId}`)
        .expect(404);

      expect(response.body.message).toBe('Category not found');
    });
  });

  describe('PUT /api/category/:id', () => {
    let categoryId: string;

    beforeEach(async () => {
      const category = await Category.create({
        name: 'Original Category',
        description: 'Original Description'
      });
      categoryId = category._id.toString();
    });

    it('should update an existing category', async () => {
      const updateData = {
        name: 'Updated Category',
        description: 'Updated Description'
      };

      const response = await request(app)
        .put(`/api/category/${categoryId}`)
        .send(updateData)
        .expect(200);

      expect(response.body.name).toBe(updateData.name);
      expect(response.body.description).toBe(updateData.description);
    });

    it('should return error for non-existent category', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      const updateData = {
        name: 'Non-existent Update',
        description: 'Updated Description'
      };

      const response = await request(app)
        .put(`/api/category/${fakeId}`)
        .send(updateData)
        .expect(404);

      expect(response.body.message).toBe('Category not found');
    });
  });

  describe('DELETE /api/category/:id', () => {
    let categoryId: string;

    beforeEach(async () => {
      const category = await Category.create({
        name: 'Category to Delete',
        description: 'Description to Delete'
      });
      categoryId = category._id.toString();
    });

    it('should delete an existing category', async () => {
      const response = await request(app)
        .delete(`/api/category/${categoryId}`)
        .expect(200);

      expect(response.body.message).toBe('Category deleted successfully');

      // Verify the category was actually deleted
      await request(app)
        .get(`/api/category/${categoryId}`)
        .expect(404);
    });

    it('should return error when trying to delete non-existent category', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      
      const response = await request(app)
        .delete(`/api/category/${fakeId}`)
        .expect(404);

      expect(response.body.message).toBe('Category not found');
    });
  });
});