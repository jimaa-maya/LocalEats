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
 *          properties:
 *            user_id:
 *              type: String
 *              description: The id given for a specific cart
 *            dish_id:
 *              type: String
 *              description: the given for the dish
 *            status:
 *              type: String
 *              description: show the status for the cart
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
 *   description: Cart managing API
 * /cart:
 *   post:
 *     summary: Create new cart
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cart'
 *     responses:
 *       200:
 *         description: The created book.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       400:
 *         description: user_id,dish_id and quantity are required fields
 *       500:
 *         description: Failed to create cart
 * /cart/cartitems:
 *   post:
 *     summary: Add A dish to the cart
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cart'
 *     responses:
 *       200:
 *         description: The created book.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *   get:
 *     summary: Get cart with the user_id
 *     tags: [Cart]
 *     parameters:
 *       - in: parameter
 *         user_id: user_id
 *         schema:
 *           type: string
 *
 *         description: Id of the cart
 *     responses:
 *       200:
 *         description: The created book.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
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
