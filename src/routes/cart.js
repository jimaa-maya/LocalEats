const express =require('express');
const routes =express.Router();

const { createCart, getCartItems, addDishToCart } = require('../controllers/cart');



routes.post('/cart',createCart);
routes.get('./cartItems',  getCartItems);
routes.post('/cartItems', addDishToCart);

module.exports = routes;

