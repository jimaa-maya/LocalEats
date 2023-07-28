const express = require('express');
const Cart = require('../models/cart');

const createCart = async (req, res) => {
  try {
    const { user_id, dish_id, quantity } = req.body;
    console.log(quantity)
    // validation to ensure required fields are present
    if (!dish_id || !quantity) {
      return res.status(400).json({ error: 'dish_id and quantity are required fields' });
    }

    const cart = {
      user_id: user_id,
      dish_id: dish_id,
      quantity: quantity,
    };
    console.log(cart)
    const savedCart = await Cart.create(cart);
    
    res.status(201).json(savedCart);
    
  } catch (error) {
    res.status(400).json({ error: 'Failed to create carttttt' });
  }
};

const getCartItems = async (req, res) => {
  try {
    console.log(req.query)
    const userId = req.query.user_id;
    console.log(userId)
    const cartItems = await Cart.find({ user_id: userId }).populate('dish_id');
    console.log(cartItems[0])
    res.status(200).json(cartItems);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to get cart items' });
  }
};

const addDishToCart = async (req, res) => {
  try {
    const { user_id, dish_id, quantity } = req.body;

    // validation to ensure required fields are present
    if (!user_id || !dish_id || !quantity) {
      return res.status(404).json({ error: 'user_id, dish_id, and quantity are required fields' });
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
