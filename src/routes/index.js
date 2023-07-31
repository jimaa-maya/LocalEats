const express = require('express');
const router = express.Router();

const userRoutes = require('./users');
const ordersRoutes = require('./orders');
const cartRoutes = require('./cart');
const authRoutes = require('./auth');
const authRoutes = require('./auth');
const userRoutes = require('./users');
const signRoutes = require('./sign');
const dishRoutes = require('./dishes');


routes.use('/auth', authRoutes);
routes.use('/sign', signRoutes);
routes.use('/user', userRoutes);
routes.use('/orders', ordersRoutes);
routes.use('/dishes', dishRoutes);
routes.use('/cart', cartRoutes);


module.exports = router;
