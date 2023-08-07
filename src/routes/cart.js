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

/**
 * @swagger
 * tags:
 *   name: Books
 *   description: The books managing API
 * /books:
 *   post:
 *     summary: Create a new book
 *     tags: [Books]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *     responses:
 *       200:
 *         description: The created book.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       500:
 *         description: Some server error
 *
 */

routes.post('/addcart', cartController.createCart);
routes.get('/cartItems/:user_id', cartController.getCartItems);
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
