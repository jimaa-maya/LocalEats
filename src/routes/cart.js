const express = require('express');
const routes = express.Router();
const cartController = require('../controllers/cart');
const cartService = require('../utils/cartService'); 

/**
*  @swagger
*    components:
*      schemas:
*        Cart:
*          type: object
*          required:
*            - user_id
*            - dish_id
*            - quantity
*          
*          example:
*              title: The Pragmatic Programmer
*              author: Andy Hunt / Dave Thomas
*              finished: true
*/


routes.post('/cart', cartController.createCart);
routes.get('/cartItems', cartController.getCartItems);
routes.post('/cartItems', cartController.addDishToCart);

routes.post('/updateUserInCart', async (req, res) => {
  try {
    const user = req.user; 

    await cartService.updateUserInCart(user);
    res.status(200).json({ message: 'Cart updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update cart' });
  }
});

module.exports = routes;
