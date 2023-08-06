const mongoose = require('mongoose');
const Dishes = require('./dishes'); 
const User = require('./users'); 

const cartItemSchema = new mongoose.Schema({
  dish_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Dishes',
  },
  quantity: {
    type: Number,
    required: true,
    min: 1, 
  },
});

const cartSchema = new mongoose.Schema({
  cart_id: {
    type: mongoose.Schema.Types.ObjectId,
    default: function () {
      return new mongoose.Types.ObjectId(); // MongoDB will generate a unique ID
    },
    unique: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User', 
  },
  cartItems: [cartItemSchema],
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
