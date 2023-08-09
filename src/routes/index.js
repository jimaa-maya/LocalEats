const express = require('express');

const routes = express.Router();

const userRoutes = require('./users');
const ordersRoutes = require('./orders');
const cartRoutes = require('./cart');
const authRoutes = require('./auth');
const signRoutes = require('./sign');
const dishRoutes = require('./dishes');
const signRoutes = require('./sign');
const signRoutes = require('./sign');
const cartRoutes = require('./cart');

routes.use('/auth', authRoutes);
routes.use('/sign', signRoutes);
routes.use('/user', userRoutes);
routes.use('/orders', ordersRoutes);
routes.use('/dishes', dishRoutes);
routes.use('/cart', cartRoutes);

module.exports = routes;
