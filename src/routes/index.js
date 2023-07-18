const express = require('express');
const routes = express.Router();

const authRoutes = require('./auth');
const userRoutes = require('./users');

routes.use('/auth', authRoutes);
routes.use('/user', userRoutes);


module.exports = routes;
