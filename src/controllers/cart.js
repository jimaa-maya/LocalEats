const express = require('express');
const Cart = require('../models/cart');


const createCart = async (req, res) => {
  try {
    const { user_id, dish_id, quantity } = req.body;

    // validation to ensure required fields are present
    if (!dish_id || !quantity) {
      return res.status(400).json({ error: 'dish_id and quantity are required fields' });
    }

    const cart = new Cart({
      user_id: user_id || null,
      dish_id,
      quantity,
    });

    const savedCart = await cart.save();
    res.json(savedCart);
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

    // validation to ensure required fields are present
    if (!user_id || !dish_id || !quantity) {
      return res.status(400).json({ error: 'user_id, dish_id, and quantity are required fields' });
    }

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
