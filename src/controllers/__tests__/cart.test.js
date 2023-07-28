const express = require('express');
const request = require('supertest');
const chai = require('chai');
const expect = chai.expect;
// const connectToMongo = require('../../db/connection')
// connectToMongo();
const app = require('../../app');
app.use(express.json()); // Required for parsing JSON request bodies
const newCart = {
  user_id: 'user123',
  dish_id: 'dish456',
  quantity: 2,
};

describe("Creating cart", () => {
  it("POST /api/cart/cart it in the response", (done) => {
    request(app)
      .post("/api/cart/cart")
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

  it("get /api/cart/cart it in the response", (done) => {
    request(app)
      .get("/api/cart/cartitems?user_id=user123")
      .expect(200, async(err, res) => {
        if (err) return done(err);
        expect(res.body[0].quantity).to.equal(2);
        done();
      });
  });

  it("POST /api/cart/cart it in the response", (done) => {
    request(app)
      .post("/api/cart/cart")
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

})
// Test createCart function
// describe('createCart', () => {
//   it('should create a new cart', async () => {
//     const newCart = {
//       user_id: 'user123',
//       dish_id: 'dish456',
//       quantity: 2,
//     };

//     const response = await request(app).post('/api/cart/cart').send(newCart);
//     console.log(response.body)
//     expect(response.status).to.equal(200);
//     expect(response.body).to.have.property('_id');
//     expect(response.body.user_id).to.equal('user123');
//     expect(response.body.dish_id).to.equal('dish456');
//     expect(response.body.quantity).to.equal(2);
//   });

//   it('should return a 400 error when required fields are missing', async () => {
//     const invalidCart = {
//       user_id: 'user789',
//       // dish_id is missing
//     };

//     const response = await request(app).post('/cart').send(invalidCart);

//     expect(response.status).to.equal(400);
//     expect(response.body).to.deep.equal({ error: 'dish_id and quantity are required fields' });
//   });

//   // Add more test cases as needed
// });
