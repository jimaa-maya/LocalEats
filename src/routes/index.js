const express = require('express');

const routes = express.Router();

const authRoutes = require('./auth');
const userRoutes = require('./users');
const dishRoutes = require('./dishes');
const signRoutes = require('./sign');

routes.use('/auth', authRoutes);
routes.use('/sign', signRoutes);
routes.use('/user', userRoutes);
routes.use('/dishes', dishRoutes);

module.exports = routes;
