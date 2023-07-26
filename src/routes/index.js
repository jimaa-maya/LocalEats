const express = require('express');

const routes = express.Router();

const authRoutes = require('./auth');
const userRoutes = require('./users');

const dishRoutes = require('./dishes');
const signRoutes = require('./sign');
const signRoutes = require('./sign');
const cartRoutes = require('./cart')


routes.use('/auth', authRoutes);
routes.use('/sign', signRoutes);
routes.use('/user', userRoutes);
routes.use('/dishes', dishRoutes);
routes.use('/cart', cartRoutes);

module.exports = routes;
