const Cart = require('../models/cart');


const createCart = async (req, res) => {
  
  try {
    const { user_id, dish_id, quantity } = req.body;
    console.log(user_id)
    // validation to ensure required fields are present
    if (!user_id || !dish_id || !quantity) {
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

const addDishToCart = async (req, res) => {
  const { user_id, dish_id, quantity } = req.body;

  try {
    // Find the user's cart
    let cart = await Cart.findOne({ user_id: user_id });

    // Check if the dish is already in the cart
    const existingCartItem = cart.cartItems.find((item) =>
      item.dish_id.equals(dish_id)
    );

    if (existingCartItem) {
      existingCartItem.quantity += quantity;
    } else {
      cart.push({ dish_id, quantity });
    }

    const savedCart = await cart.save();
    res.status(201).json(savedCart);
  } catch (error) {
    console.error('Error adding dish to cart:', error);
    res.status(500).json({ error: 'Unable to add dish to cart' });
  }
};

// Get the user's cart items
const getCartItems = async (req, res) => {
  try {
    const userId = req.query.user_id;
    const cartItems = await Cart.find({ user_id: userId }).populate('dish_id');
    res.status(200).json(cartItems);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to get cart items' });
  }
};

module.exports = {
  createCart,
  addDishToCart,
  getCartItems,
};
