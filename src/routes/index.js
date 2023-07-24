const express = require('express');
const routes = express.Router();

const authRoutes = require('./auth');
const userRoutes = require('./users');
const signRoutes = require('./sign')
const ordersRoutes = require('./orders');

routes.use('/auth', authRoutes);
routes.use('/sign', signRoutes);
routes.use('/user', userRoutes);
routes.use('/orders', ordersRoutes);


module.exports = routes;
