const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/orders');
const { param } = require('express-validator');

// SWAGGER

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: APIs to manage orders
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       required:
 *         - user_id
 *         - dish_id
 *         - quantity
 * 
 *       properties:
 *         user_id:
 *           type: string
 *           description: The ID of the user who created the order
 *         dish_id: 
 *           type: string
 *           description: The id of the chosen dish
 *         quantity:
 *           type: number
 *           description: The number of the dish that you requested
 *         orderStatus:
 *           type: string
 *           description: The status of requested dish order 
 *         otherInfo:
 *           type: string
 *             
 *       example:
 *           user_id: 64d273aa8e8a0d531db1dec8
 *           dish_id: 64cbcdee5ed1bde7ee8f1ae5
 *           quantity: 2
 */

/**
* @swagger
* /orders/create:
*   post:
*     summary: Create a new order
*     tags: [Orders]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/Order'
*     responses:
*       201:
*         description: Order created successfully
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Order'
*       500:
*         description: Server error
*/
router.post('/', ordersController.createOrder);

/**
@swagger
 * /orders:
 *   get:
 *     summary: Get all orders
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: List of all orders
 *         content:
 *           application/json:
 *             schema:
 *                 $ref: '#/components/schemas/Order'
 *       500:
 *         description: Server error
 */
router.get('/', ordersController.getAllOrders);

/**
 * @swagger
 * /orders/{order_id}:
 *   get:
 *     summary: Get a specific order by ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: order_id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the order
 *     responses:
 *       200:
 *         description: Order details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 */
router.get('/:order_id', param('order_id').isMongoId().withMessage('Invalid order_id'), ordersController.getOrderById);

/**
@swagger
*    /orders/{order_id}:
*        put:
*            tags: [Orders]
*            description: Update an order by ID
*            parameters:
*                - in: path
*                  name: order_id
*                  schema:
*                      type: string
*                  required: true
*                  description: ID of the order
*            requestBody:
*                required: true
*                content:
*                    application/json:
*                        schema:
*                            $ref: '#/components/schemas/Order'
*            responses:
*                200:
*                    description: The updated order
*                    content:
*                        application/json:
*                            schema:
*                                $ref: '#/components/schemas/Order'
*                404:
*                    description: Order not found
*                    content:
*                        application/json:
*                            schema:
*                                $ref: '#/components/schemas/Order' 
*/
router.put('/:order_id', param('order_id').isMongoId().withMessage('Invalid order_id'), ordersController.updateOrder);

/**
* @swagger
* /orders/{order_id}:
*   delete:
*     summary: Delete an order
*     tags: [Orders]
*     parameters:
*       - in: path
*         name: order_id
*         schema:
*           type: string
*         required: true
*         description: ID of the order
*     responses:
*       200:
*         description: Order deleted successfully
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Order'
*       404:
*         description: Order not found
*       500:
*         description: Server error
*/
router.delete('/:order_id', param('order_id').isMongoId().withMessage('Invalid order_id'), ordersController.deleteOrder);

module.exports = router;