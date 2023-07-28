const express = require('express');
const request = require('supertest');
const chai = require('chai');
const expect = chai.expect;

// Import the Cart model and controller functions
const Cart = require('../../models/cart');
const {
  createCart,
  getCartItems,
  addDishToCart,
} = require('../../controllers/cart');

const app = express();
app.use(express.json()); // Required for parsing JSON request bodies

// Set up a temporary in-memory database
const testCartItems = [
  {
    _id: 'cart1',
    user_id: 'user1',
    dish_id: 'dish1',
    quantity: 2,
  },
  {
    _id: 'cart2',
    user_id: 'user2',
    dish_id: 'dish2',
    quantity: 1,
  },
];

beforeEach(() => {
  Cart.find = jest.fn().mockResolvedValue(testCartItems);
  Cart.findOne = jest.fn().mockResolvedValue(testCartItems[0]);
  Cart.prototype.save = jest.fn().mockResolvedValue(testCartItems[0]);
});

afterEach(() => {
  jest.clearAllMocks();
});

// Test createCart function
describe('POST /cart', () => {
  it('should create a new cart', async () => {
    const newCart = {
      user_id: 'user3',
      dish_id: 'dish3',
      quantity: 3,
    };

    const response = await request(app).post('/cart').send(newCart);

    expect(response.status).to.equal(200);
    expect(response.body).to.deep.equal(testCartItems[0]);
  });

  it('should return a 400 error when required fields are missing', async () => {
    const invalidCart = {
      user_id: 'user4',
      // dish_id is missing
    };

    const response = await request(app).post('/cart').send(invalidCart);

    expect(response.status).to.equal(400);
    expect(response.body).to.deep.equal({ error: 'dish_id and quantity are required fields' });
  });

  it('should return a 500 error when an error occurs while creating the cart', async () => {
    Cart.prototype.save.mockRejectedValue(new Error('Mocked error'));

    const newCart = {
      user_id: 'user5',
      dish_id: 'dish5',
      quantity: 1,
    };

    const response = await request(app).post('/cart').send(newCart);

    expect(response.status).to.equal(500);
    expect(response.body).to.deep.equal({ error: 'Failed to create cart' });
  });
});

// Test getCartItems function
describe('GET /cart', () => {
  it('should return cart items for a user', async () => {
    const userId = 'user1';

    const response = await request(app).get('/cartitems').query({ user_id: userId });

    expect(response.status).to.equal(200);
    expect(response.body).to.deep.equal(testCartItems);
  });

  it('should return a 500 error when an error occurs while fetching cart items', async () => {
    Cart.find.mockRejectedValue(new Error('Mocked error'));

    const userId = 'user2';

    const response = await request(app).get('/cartitems').query({ user_id: userId });

    expect(response.status).to.equal(500);
    expect(response.body).to.deep.equal({ error: 'Failed to get cart items' });
  });
});

// Test addDishToCart function
describe('PUT /cart/add-dish', () => {
  it('should add a dish to the cart', async () => {
    const cartUpdate = {
      user_id: 'user1',
      dish_id: 'dish1',
      quantity: 5,
    };

    const response = await request(app).put('/cartitems/add').send(cartUpdate);

    expect(response.status).to.equal(201);
    expect(response.body).to.deep.equal(testCartItems[0]);
  });

  it('should return a 400 error when required fields are missing', async () => {
    const invalidCart = {
      user_id: 'user1',
      dish_id: 'dish1',
      // quantity is missing
    };

    const response = await request(app).put('/cartitems/add').send(invalidCart);

    expect(response.status).to.equal(400);
    expect(response.body).to.deep.equal({ error: 'user_id, dish_id, and quantity are required fields' });
  });

  it('should return a 404 error when the cart is not found', async () => {
    Cart.findOne.mockResolvedValue(null);

    const cartUpdate = {
      user_id: 'user1',
      dish_id: 'dish1',
      quantity: 3,
    };

    const response = await request(app).put('/cartitems/add').send(cartUpdate);

    expect(response.status).to.equal(404);
    expect(response.body).to.deep.equal({ error: 'Cart not found' });
  });

  it('should return a 500 error when an error occurs while adding a dish to the cart', async () => {
    Cart.findOne.mockRejectedValue(new Error('Mocked error'));

    const cartUpdate = {
      user_id: 'user1',
      dish_id: 'dish1',
      quantity: 3,
    };

    const response = await request(app).put('/cartitems/add').send(cartUpdate);

    expect(response.status).to.equal(500);
    expect(response.body).to.deep.equal({ error: 'Unable to add dish to cart' });
  });
});