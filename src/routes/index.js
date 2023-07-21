const express = require('express');
const router = express.Router();

const userRoutes = require('./users');
const dishesRoutes = require('./dishes');
const ordersRoutes = require('./orders');
const cartRoutes = require('./cart');
const authRoutes = require('./auth');
const authRoutes = require('./auth');
const userRoutes = require('./users');

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/dishes', dishesRoutes);
router.use('/orders', ordersRoutes);
router.use('/cart', cartRoutes);


module.exports = router;