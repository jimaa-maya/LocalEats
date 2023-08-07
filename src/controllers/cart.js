const Cart = require('../models/cart');

const createCart = async (req, res) => {
  const { user_id } = req.body;

  try {
    const userIdString = user_id.toString();

    const cart = new Cart({
      user_id: userIdString,
      cartItems: [],
    });
    console.log(cart);

    const savedCart = await cart.save();
    res.status(201).json(savedCart);
  } catch (error) {
    console.error('Error creating cart:', error);
    res.status(500).json({ error: 'Failed to create cart' });
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
      cart.cartItems.push({ dish_id, quantity });
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
  const { user_id } = req.params;

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
    console.error('Error getting cart items:', error);
    res.status(500).json({ error: 'Failed to get cart items' });
  }
};

module.exports = {
  createCart,
  addDishToCart,
  getCartItems,
};
