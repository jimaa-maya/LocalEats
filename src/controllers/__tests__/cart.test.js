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
const newCart2 = {
  user_id: 'user456',
  dish_id: 'dish999',
  quantity: 4,
};


describe("Creating cart", () => {
  it("POST /api/cart/cart it in the response", (done) => {
    request(app)
      .post('/api/cart/addcart')
      .send(newCart)
      .expect(201, async(err, res) => {
        if (err) return done(err);
        expect(res.body.user_id).to.equal('user123');
        expect(res.body.dish_id).to.equal('dish456');
        expect(res.body.quantity).to.equal(2);
        done();
      });
  });

  it("get /api/cart/cartitems? it in the response", (done) => {
    request(app)
      .get('/api/cart/cartitems/user123')
      .expect(200, async(err, res) => {
        if (err) return done(err);
        expect(res.body[0].quantity).to.equal(2);
        done();
      });
  });

  it("POST /api/cart/cartitems it in the response", (done) => {
    request(app)
      .post("/api/cart/cartitems")
      .set("Content-Type", "application/json")
      .send(newCart2)
      .expect(201, async(err, res) => {
        if (err) return done(err);
        expect(res.body.user_id).to.equal('user456');
        expect(res.body.dish_id).to.equal('dish999');
        done();
      });
  });
})