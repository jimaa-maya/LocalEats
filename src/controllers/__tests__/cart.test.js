const request = require('supertest');
const app = require('../../app');
const Cart = require('../../models/cart');

let userId;
let dishId;

beforeAll(async () => {
  userId = '64c91e14224bf98633eb9970';

  dishId = '64cbee1da34043e084a6929b';
});

describe('Cart Controllers - createCart', () => {
  it('should create a new cart', async () => {
    const requestBody = {
      user_id: userId,
    };

    const response = await request(app)
      .post('/api/cart/addcart')
      .send(requestBody);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('cart_id');
    expect(response.body.user_id).toEqual(requestBody.user_id);
    expect(response.body.cartItems).toHaveLength(0);
  });
});

describe('Cart Controllers - addDishToCart', () => {
  it('should add a dish to the cart', async () => {
    const requestBody = {
      user_id: userId,
      dish_id: dishId,
      quantity: 2,
    };

    const response = await request(app)
      .post('/api/cart/cartItems')
      .send(requestBody);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('cart_id');
    expect(response.body.user_id).toEqual(requestBody.user_id);
    expect(response.body.cartItems).toHaveLength(1);
    expect(response.body.cartItems[0].dish_id).toEqual(requestBody.dish_id);
    expect(response.body.cartItems[0].quantity).toEqual(requestBody.quantity);
  });
});

describe('Cart Controllers - getCartItems', () => {
    it('should get cart items for a user', async () => {
      const response = await request(app).get(`/api/cart/cartItems/${userId}`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        {
          _id: expect.any(String),
          dish_id: expect.objectContaining({
            _id: '64cbee1da34043e084a6929b',
            price: 10.99,
          }),
          quantity: 2,
        },
      ]);
    });
  
    it('should return 200 and an array containing an object with specific properties if cart not found for the user', async () => {
      const invalidUserId = '64c91e14224bf98633eb9970'; 
      const response = await request(app).get(`/api/cart/cartItems/${invalidUserId}`);
      expect(response.status).toBe(200); 
      expect(response.body).toEqual([
        {
          _id: expect.any(String),
          dish_id: expect.objectContaining({
            _id: '64cbee1da34043e084a6929b',
            price: 10.99, 
          }),
          quantity: 2,
        },
      ]);
    });
  });
})