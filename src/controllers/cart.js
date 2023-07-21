const express = require('express');
const Cart = require('../models/cart');

const createCart = async (req, res) => {
  try {
    const cart = new Cart({
      user_id: req.user ? req.user.id : null, // Check if req.user exists before accessing the id property
    });

    const savedCart = await cart.save();

    if (savedCart) {
      res.json(savedCart);
    } else {
      res.status(500).json({ error: 'Failed to create cart' }); // Use 'err' instead of err (not defined)
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to create cart' });
  }
};

const getCartItems = async (req, res) => {
  try {
    const userId = req.query.user_id;
    const cartItems = await Cart.find({ user_id: userId }).populate('dish_id');
    return res.json(cartItems);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to get cart items' });
  }
};

const addDishToCart = async (req, res) => {
  try {
    const { user_id, dish_id, quantity } = req.body;
    const cart = await Cart.findOne({ user_id: null });

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    cart.user_id = user_id;
    cart.dish_id = dish_id;
    cart.quantity = quantity;
    const savedCart = await cart.save();
    res.status(201).json(savedCart);
  } catch (error) {
    res.status(500).json({ error: 'Unable to add dish to cart' });
  }
};

module.exports = {
  createCart,
  getCartItems,
  addDishToCart,
};
