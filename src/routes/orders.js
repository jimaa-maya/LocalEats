const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/orders');
const { param } = require('express-validator');

// Routes
router.post('/', ordersController.createOrder);

router.get('/', ordersController.getAllOrders);

router.get('/:order_id', param('order_id').isMongoId().withMessage('Invalid order_id'), ordersController.getOrderById);

router.put('/:order_id', param('order_id').isMongoId().withMessage('Invalid order_id'), ordersController.updateOrder);

router.delete('/:order_id', param('order_id').isMongoId().withMessage('Invalid order_id'), validate, ordersController.deleteOrder);

module.exports = router;