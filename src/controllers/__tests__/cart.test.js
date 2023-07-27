const request = require('supertest');
const expect = require('chai').expect;
const express = require('express');
const app = express();

// Import the Cart model and controller functions
const Cart = require('../models/cart');
const {
  createCart,
  getCartItems,
  addDishToCart,
} = require('../controllers/cart');

// Set up a test endpoint to simulate the Express routes
app.post('/cart', createCart);
app.get('/cart', getCartItems);
app.put('/cart/add-dish', addDishToCart);

describe('Cart Controller Tests', () => {
  beforeEach(() => {
    // Mock the Cart model methods for testing
    Cart.save = jest.fn();
    Cart.find = jest.fn();
    Cart.findOne = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Test createCart function
  describe('POST /cart', () => {
    it('should create a new cart', async () => {
      const mockRequest = {
        body: {
          user_id: 'user123',
          dish_id: 'dish123',
          quantity: 2,
        },
      };

      const mockResponse = {
        json: jest.fn((data) => data),
        status: jest.fn((code) => ({
          json: jest.fn((error) => error),
        })),
      };

      Cart.prototype.save.mockResolvedValue(mockRequest.body);

      await createCart(mockRequest, mockResponse);

      expect(mockResponse.json).toHaveBeenCalledWith(mockRequest.body);
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it('should return a 400 error when required fields are missing', async () => {
      const mockRequest = {
        body: {
          user_id: 'user123',
        },
      };

      const mockResponse = {
        json: jest.fn((data) => data),
        status: jest.fn((code) => ({
          json: jest.fn((error) => error),
        })),
      };

      await createCart(mockRequest, mockResponse);

      expect(mockResponse.json).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });

    it('should return a 500 error when an error occurs while creating the cart', async () => {
      const mockRequest = {
        body: {
          user_id: 'user123',
          dish_id: 'dish123',
          quantity: 2,
        },
      };

      const mockResponse = {
        json: jest.fn((data) => data),
        status: jest.fn((code) => ({
          json: jest.fn((error) => error),
        })),
      };

      Cart.prototype.save.mockRejectedValue(new Error('Mocked error'));

      await createCart(mockRequest, mockResponse);

      expect(mockResponse.json).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(500);
    });
  });

  // Test getCartItems function
  describe('GET /cart', () => {
    it('should return cart items for a user', async () => {
      const mockRequest = {
        query: {
          user_id: 'user123',
        },
      };

      const mockResponse = {
        json: jest.fn((data) => data),
        status: jest.fn((code) => ({
          json: jest.fn((error) => error),
        })),
      };

      const mockCartItems = [
        {
          _id: 'cart123',
          user_id: 'user123',
          dish_id: { _id: 'dish123', name: 'Dish 1', price: 10.99 },
          quantity: 2,
        },
        {
          _id: 'cart456',
          user_id: 'user123',
          dish_id: { _id: 'dish456', name: 'Dish 2', price: 15.99 },
          quantity: 1,
        },
      ];

      Cart.find.mockResolvedValue(mockCartItems);

      await getCartItems(mockRequest, mockResponse);

      expect(mockResponse.json).toHaveBeenCalledWith(mockCartItems);
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it('should return a 500 error when an error occurs while fetching cart items', async () => {
      const mockRequest = {
        query: {
          user_id: 'user123',
        },
      };

      const mockResponse = {
        json: jest.fn((data) => data),
        status: jest.fn((code) => ({
          json: jest.fn((error) => error),
        })),
      };

      Cart.find.mockRejectedValue(new Error('Mocked error'));

      await getCartItems(mockRequest, mockResponse);

      expect(mockResponse.json).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(500);
    });
  });

  // Test addDishToCart function
  describe('PUT /cart/add-dish', () => {
    it('should add a dish to the cart', async () => {
      const mockRequest = {
        body: {
          user_id: 'user123',
          dish_id: 'dish123',
          quantity: 2,
        },
      };

      const mockResponse = {
        json: jest.fn((data) => data),
        status: jest.fn((code) => ({
          json: jest.fn((error) => error),
        })),
      };

      const mockCart = {
        _id: 'cart123',
        user_id: null,
        dish_id: 'dish456',
        quantity: 1,
      };

      Cart.findOne.mockResolvedValue(mockCart);
      Cart.prototype.save.mockResolvedValue(mockRequest.body);

      await addDishToCart(mockRequest, mockResponse);

      expect(mockResponse.json).toHaveBeenCalledWith(mockRequest.body);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
    });

    it('should return a 400 error when required fields are missing', async () => {
      const mockRequest = {
        body: {
          user_id: 'user123',
          dish_id: 'dish123',
        },
      };

      const mockResponse = {
        json: jest.fn((data) => data),
        status: jest.fn((code) => ({
          json: jest.fn((error) => error),
        })),
      };

      await addDishToCart(mockRequest, mockResponse);

      expect(mockResponse.json).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });

    it('should return a 404 error when the cart is not found', async () => {
      const mockRequest = {
        body: {
          user_id: 'user123',
          dish_id: 'dish123',
          quantity: 2,
        },
      };

      const mockResponse = {
        json: jest.fn((data) => data),
        status: jest.fn((code) => ({
          json: jest.fn((error) => error),
        })),
      };

      Cart.findOne.mockResolvedValue(null);

      await addDishToCart(mockRequest, mockResponse);

      expect(mockResponse.json).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(404);
    });

    it('should return a 500 error when an error occurs while adding a dish to the cart', async () => {
      const mockRequest = {
        body: {
          user_id: 'user123',
          dish_id: 'dish123',
          quantity: 2,
        },
      };

      const mockResponse = {
        json: jest.fn((data) => data),
        status: jest.fn((code) => ({
          json: jest.fn((error) => error),
        })),
      };

      Cart.findOne.mockRejectedValue(new Error('Mocked error'));

      await addDishToCart(mockRequest, mockResponse);

      expect(mockResponse.json).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(500);
    });
  });
});
