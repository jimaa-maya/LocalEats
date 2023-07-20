const express = require('express');

const routes = express.Router();
// eslint-disable-next-line no-unused-vars
const dishesController = require('../controllers/dishes');
const checkAuth = require('../middleware/checkAuth');

// GET Routes
routes.get('/test', (req, res) => {
  res.send('Test Route Works!');
});
routes.get('/dishes', dishesController.getAllDishes);
routes.get('/dishes/:id', dishesController.getDishById);
routes.get('/dishes/filter', dishesController.filterDishes);
routes.get('/dishes/location', dishesController.getDishesByLocation);
routes.get('/dishes/images', dishesController.fetchAllDishImages);
routes.get('/dishes/images/:dishId', dishesController.fetchDishImage);

// Only cooks allowed
routes.post('/dishes', checkAuth.authenticate, dishesController.createDish);
routes.put(
  '/dishes/:dishId',
  checkAuth.authenticate,
  dishesController.updateDish
);
routes.put(
  '/dishes/images/:id',
  checkAuth.authenticate,
  dishesController.updateDishImage
);

routes.delete(
  '/dishes/:dishId',
  checkAuth.authenticate,
  dishesController.removeDish
);

// Only customers allowed

routes.post(
  '/dishes/:dishId/reviews',
  checkAuth.authenticate,
  dishesController.addReview
);

routes.put(
  '/dishes/:dishId/reviews',
  checkAuth.authenticate,
  dishesController.updateReview
);

module.exports = routes;
