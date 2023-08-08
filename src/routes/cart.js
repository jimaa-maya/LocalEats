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
 *              user_id: 123
 *              dish_id: 555
 *              quantity: 2
 */

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: The cart managing API
 * /cart:
 *   post:
 *     summary: Create new cart
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/models/cart'
 *     responses:
 *       200:
 *         description: The created book.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/models/cart'
 *       500:
 *         description: Some server error
 * /cartitems/add:
 *   post:
 *     summary: Update cart
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/models/cartitems/add'
 *     responses:
 *       200:
 *         description: The created book.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/models/cart'
 * /cartitems:
 *   get:
 *     summary: Get cart
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/models/cartitems/add'
 *     responses:
 *       200:
 *         description: The created book.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/models/cart'
 *
 */

routes.post('/addcart', cartController.createCart);
routes.get('/cartitems', cartController.getCartItems);
routes.post('/cartitems', cartController.addDishToCart);

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
