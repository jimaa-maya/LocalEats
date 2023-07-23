const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/orders');
const { body, param } = require('express-validator');

// Validation middleware
const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res.status(400).json({ errors: errors.array() });
  };
};

// Routes
router.post(
  '/',
  [
    body('user_id').isMongoId().withMessage('Invalid user_id'),
    body('dish_id').isMongoId().withMessage('Invalid dish_id'),
    body('quantity').isInt({ min: 1 }).withMessage('Quantity must be a positive integer'),
    body('orderStatus').notEmpty().withMessage('Order status is required'),
  ],
  validate,
  ordersController.createOrder
);

router.get('/', ordersController.getAllOrders);

router.get('/:order_id', param('order_id').isMongoId().withMessage('Invalid order_id'), validate, ordersController.getOrderById);

router.put(
  '/:order_id',
  [
    param('order_id').isMongoId().withMessage('Invalid order_id'),
    body('user_id').isMongoId().withMessage('Invalid user_id'),
    body('dish_id').isMongoId().withMessage('Invalid dish_id'),
    body('quantity').isInt({ min: 1 }).withMessage('Quantity must be a positive integer'),
    body('orderStatus').notEmpty().withMessage('Order status is required'),
  ],
  validate,
  ordersController.updateOrder
);

router.delete('/:order_id', param('order_id').isMongoId().withMessage('Invalid order_id'), validate, ordersController.deleteOrder);

module.exports = router;

