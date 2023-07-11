const express = require('express');
const routes = express.Router();
const getAllDishes = require('../controllers/dishes')
routes.get('/dishes',getAllDishes);

module.exports = routes;