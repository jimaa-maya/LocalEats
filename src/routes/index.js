const express = require('express');
const routes = express.Router();

const userRoutes = require('./users');
const dishesRoutes = require('./dishes');
const ordersRoutes = require('./orders');
const cartRoutes = require('./cart');
const authRoutes = require('./auth');
const authRoutes = require('./auth');
const userRoutes = require('./users');

routes.use('/auth', authRoutes);
routes.use('/user', userRoutes);
router.use('/dishes', dishesRoutes);
router.use('/orders', ordersRoutes);
router.use('/cart', cartRoutes);


module.exports = routes;