const Cart = require('../models/cart');
const express = require('express');

const createCart = async (req, res) => {
  try {
    const { user_id, dish_id, quantity } = req.body;
    // validation to ensure required fields are present
    if (!user_id || !dish_id || !quantity) {
      return res.status(400).json({ error: 'dish_id and quantity are required fields' });
    }

    const cart = {
      user_id: user_id,
      dish_id: dish_id,
      quantity: quantity,
    };
    const savedCart = await Cart.create(cart);
    res.status(201).json(savedCart);
    
  } catch (error) {
    res.status(400).json({ error: 'Failed to create carttttt' });
  }
};

const addDishToCart = async (req, res) => {
  const { user_id, dish_id, quantity } = req.body;

  try {
    // Find the user's cart item
    let cartItem = await Cart.findOne({ user_id: user_id, dish_id: dish_id });

    if (!cartItem) {
      // Create a new cart item if none exists for the user and dish
      cartItem = await Cart.create({ user_id, dish_id, quantity });
    } else {
      // If the cart item exists, update the quantity
      cartItem.quantity += quantity;
      await cartItem.save();
    }

    res.status(201).json(cartItem);
  } catch (error) {
    console.error('Error adding dish to cart:', error);
    res.status(500).json({ error: 'Unable to add dish to cart' });
  }
};

// Get the user's cart items
const getCartItems = async (req, res) => {
  try {
    const userId = req.params.user_id;
    console.log(userId)
    const cartItems = await Cart.find({ user_id: userId });
    res.status(200).json(cartItems);
  } catch (error) {
    console.error('Error retrieving cart items:', error);
    res.status(500).json({ error: 'Failed to get cart items' });
  }
};


module.exports = {
  createCart,
  addDishToCart,
  getCartItems,
};
