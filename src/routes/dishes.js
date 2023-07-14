const express = require('express');
const routes = express.Router();
const getAllDishes = require('../controllers/dishes');
const checkAuth = require('../middleware/checkAuth');

routes.get('/alldishes',getAllDishes);
routes.get('/:dishid',getDish);
routes.put('/:dishid',checkAuth.authenticate,putDish);
routes.delete('/:dishid',checkAuth.authenticate,deleteDish);


module.exports = routes;