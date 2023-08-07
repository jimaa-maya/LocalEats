// const request = require('supertest');
// const app = require('../../app');
// const Cart = require('../../models/cart');

// let userId="123";
// let dishId="123";

// // beforeAll(async () => {
  
// //   userId = '123';

 
// //   dishId = '123';
// // });

// describe('Cart Controllers - createCart', () => {
//   it('should create a new cart', async () => {
//     const requestBody = {
//       user_id: userId,
//     };

//     const response = await request(app)
//       .post('/api/cart/addcart')
//       .send(requestBody);

//     expect(response.status).toBe(201);
//     expect(response.body).toHaveProperty('cart_id');
//     expect(response.body.user_id).toEqual(requestBody.user_id);
//     expect(response.body.cartItems).toHaveLength(0);
//   });
// });

// describe('Cart Controllers - addDishToCart', () => {
//   it('should add a dish to the cart', async () => {
//     const requestBody = {
//       user_id: userId,
//       dish_id: dishId,
//       quantity: 2,
//     };

//     const response = await request(app)
//       .post('/api/cart/cartItems?user_id=')
//       .send(requestBody);

//     expect(response.status).toBe(201);
//     expect(response.body).toHaveProperty('cart_id');
//     expect(response.body.user_id).toEqual(requestBody.user_id);
//     expect(response.body.cartItems).toHaveLength(1);
//     expect(response.body.cartItems[0].dish_id).toEqual(requestBody.dish_id);
//     expect(response.body.cartItems[0].quantity).toEqual(requestBody.quantity);
//   });
// });


// describe('Cart Controllers - getCartItems', () => {
//     it('should get cart items for a user', async () => {
//       const response = await request(app).get(`/api/cart/cartItems/${userId}`);
//       expect(response.status).toBe(200);
//       expect(response.body).toEqual([
//         {
//           _id: expect.any(String),
//           dish_id: expect.objectContaining({
//             _id: '64cbee1da34043e084a6929b',
//             price: 10.99,
//           }),
//           quantity: 2,
//         },
//       ]);
//     });
  
//     it('should return 200 and an array containing an object with specific properties if cart not found for the user', async () => {
//       const invalidUserId = '64c91e14224bf98633eb9970'; 
//       const response = await request(app).get(`/api/cart/cartItems/${invalidUserId}`);
//       expect(response.status).toBe(200); 
//       expect(response.body).toEqual([
//         {
//           _id: expect.any(String),
//           dish_id: expect.objectContaining({
//             _id: '64cbee1da34043e084a6929b',
//             price: 10.99, 
//           }),
//           quantity: 2,
//         },
//       ]);
//     });
//   });
  
const request = require("supertest");
const expect = require("chai").expect;
// const connectToMongo = require('../../db/connection')
// connectToMongo();
const app = require('../../app');

const newCart = {
  user_id: 'user123',
  dish_id: 'dish456',
  quantity: 2,
};


describe("Creating cart", () => {
  it("POST /api/cart/cart it in the response", (done) => {
    request(app)
      .post('/api/cart/addcart')
      .set("Content-Type", "application/json")
      .send(newCart)
      .expect(201, async(err, res) => {
        if (err) return done(err);
        expect(res.body.user_id).to.equal('user123');
        expect(res.body.dish_id).to.equal('dish456');
        expect(res.body.quantity).to.equal(2);
        done();
      });
  });

  // it("get /api/cart/cartitems? it in the response", (done) => {
  //   request(app)
  //     .get('/api/cart/cartitems?user_id=user123')
  //     .expect(200, async(err, res) => {
  //       if (err) return done(err);
  //       expect(res.body[0].quantity).to.equal(2);
  //       done();
  //     });
  // });

  // it("POST /api/cart/cartitems it in the response", (done) => {
  //   request(app)
  //     .post("/api/cart/cartitems")
  //     .set("Content-Type", "application/json")
  //     .send(newCart2)
  //     .expect(201, async(err, res) => {
  //       if (err) return done(err);
  //       expect(res.body.user_id).to.equal('user123');
  //       expect(res.body.dish_id).to.equal('dish999');
  //       done();
  //     });
  // });
})