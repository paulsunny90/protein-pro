import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app';
import Order from '../models/Order.model';
import Product from '../models/product.model';
import User from '../models/user.model';
import bcrypt from 'bcryptjs';

describe('Order Controller Tests', () => {
  // Clean up test database after each test
  afterEach(async () => {
    await Order.deleteMany({});
    await Product.deleteMany({});
    await User.deleteMany({});
  });

  // Helper function to authenticate user and return cookies
  const authenticateUser = async (): Promise<string[]> => {
    // Register a user first
    await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'orderuser@example.com',
        password: 'password123'
      });

    // Login to get authentication cookies
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'orderuser@example.com',
        password: 'password123'
      });

    return loginRes.headers['set-cookie'] || [];
  };

  // Helper function to create a product
  const createTestProduct = async () => {
    const productData = {
      name: 'Test Product',
      description: 'Test Description',
      brand: 'Test Brand',
      price: 100,
      category: 'TestCategory',
      stock: 10,
      imageUrl: '/uploads/test-image.jpg',
      sizes: ['M']
    };

    const product = await Product.create(productData);
    return product._id.toString();
  };

  describe('POST /api/orders', () => {
    it('should create a new order when authenticated', async () => {
      const cookies = await authenticateUser();
      const productId = await createTestProduct();

      const orderData = {
        orderItems: [
          {
            product: productId,
            name: 'Test Product',
            quantity: 2,
            price: 100,
            image: '/uploads/test-image.jpg'
          }
        ],
        shippingAddress: {
          fullName: 'John Doe',
          address: '123 Main St',
          city: 'New York',
          country: 'USA',
          postalCode: '10001'
        },
        itemsPrice: 200,
        shippingPrice: 10,
        totalPrice: 210
      };

      const response = await request(app)
        .post('/api/orders')
        .set('Cookie', cookies)
        .send(orderData)
        .expect(201);

      expect(response.body.orderItems.length).toBe(1);
      expect(response.body.shippingAddress.fullName).toBe('John Doe');
      expect(response.body.totalPrice).toBe(210);
      expect(response.body.isPaid).toBe(true);
      expect(response.body.orderStatus).toBe('Confirmed');
    });

    it('should return error when not authenticated', async () => {
      const productId = await createTestProduct();

      const orderData = {
        orderItems: [
          {
            product: productId,
            name: 'Test Product',
            quantity: 1,
            price: 100
          }
        ],
        shippingAddress: {
          fullName: 'John Doe',
          address: '123 Main St',
          city: 'New York',
          country: 'USA',
          postalCode: '10001'
        },
        itemsPrice: 100,
        shippingPrice: 10,
        totalPrice: 110
      };

      const response = await request(app)
        .post('/api/orders')
        .send(orderData)
        .expect(401);

      expect(response.body.message).toContain('Authentication failed');
    });

    it('should return error when order items are missing', async () => {
      const cookies = await authenticateUser();

      const orderData = {
        shippingAddress: {
          fullName: 'John Doe',
          address: '123 Main St',
          city: 'New York',
          country: 'USA',
          postalCode: '10001'
        },
        itemsPrice: 0,
        shippingPrice: 10,
        totalPrice: 10
      };

      const response = await request(app)
        .post('/api/orders')
        .set('Cookie', cookies)
        .send(orderData)
        .expect(400);

      expect(response.body.message).toBe('No order items');
    });
  });

  describe('GET /api/orders/:id', () => {
    let orderId: string;
    let cookies: string[];

    let cookies: string[];

    beforeEach(async () => {
      cookies = await authenticateUser();
      const productId = await createTestProduct();

      const orderData = {
        orderItems: [
          {
            product: productId,
            name: 'Test Product',
            quantity: 1,
            price: 100,
            image: '/uploads/test-image.jpg'
          }
        ],
        shippingAddress: {
          fullName: 'John Doe',
          address: '123 Main St',
          city: 'New York',
          country: 'USA',
          postalCode: '10001'
        },
        itemsPrice: 100,
        shippingPrice: 10,
        totalPrice: 110
      };

      const orderRes = await request(app)
        .post('/api/orders')
        .set('Cookie', cookies)
        .send(orderData);

      orderId = orderRes.body._id.toString();
    });

    it('should get an order by ID when authenticated', async () => {
      const response = await request(app)
        .get(`/api/orders/${orderId}`)
        .set('Cookie', cookies)
        .expect(200);

      expect(response.body._id.toString()).toBe(orderId);
      expect(response.body.totalPrice).toBe(110);
      expect(response.body.isPaid).toBe(true);
    });

    it('should return error for non-existent order', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      
      const response = await request(app)
        .get(`/api/orders/${fakeId}`)
        .set('Cookie', cookies)
        .expect(404);

      expect(response.body.message).toBe('Order not found');
    });
  });
});