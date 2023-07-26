// cartService.js
const mongoose = require('mongoose');
const Cart = require('../models/cart');

const updateUserInCart = async (user) => {
  try {
    await mongoose.connect('mongodb://localhost:27017/your_database_name', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to the database');

    const cart = await Cart.findOne({ user_id: null });

    if (cart) {
      cart.user_id = user.id; // Please make sure to define `user` appropriately
      await cart.save();
      console.log('Cart updated successfully');
    } else {
      console.log('Cart not found');
    }

    mongoose.connection.close();
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
};

module.exports = {
  updateUserInCart,
};
