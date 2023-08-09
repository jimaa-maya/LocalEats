const Cart = require('../models/cart');
const express = require('express');

const createCart = async (req, res) => {
  try {
    const { user_id, dish_id, quantity } = req.body;
    console.log(user_id);
    // validation to ensure required fields are present
    if (!user_id || !dish_id || !quantity) {
      return res
        .status(400)
        .json({ error: 'dish_id and quantity are required fields' });
    }

    const cart = new Cart({
      user_id: userIdString,
      cartItems: [],
    });
    console.log(cart);

    const savedCart = await cart.save();
    res.status(201).json(savedCart);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create cart' });
  }
};

const addDishToCart = async (req, res) => {
  const { user_id, dish_id, quantity } = req.body;

  try {
    // Find the user's cart
    let cart = await Cart.findOne({ user_id });

    if (!cart) {
      cart = new Cart({
        user_id,
        cartItems: [],
      });
    }

    // Check if the dish is already in the cart
    const existingCartItem = cart.cartItems.find((item) =>
      item.dish_id.equals(dish_id)
    );

    if (existingCartItem) {
      existingCartItem.quantity += quantity;
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
    const cart = await Cart.findOne({ user_id }).populate(
      'cartItems.dish_id',
      'name price'
    );
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    res.json(cart.cartItems);
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
