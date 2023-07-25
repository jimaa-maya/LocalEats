const express = require('express');

const routes = express.Router();
const multer = require('multer');
// eslint-disable-next-line no-unused-vars
const dishesController = require('../controllers/dishes');
const checkAuth = require('../middleware/checkAuth');

// multer config to store the file in memory (as a buffer)

const upload = multer({ storage: multer.memoryStorage() });
// GET Routes

routes.get('/', dishesController.getAllDishes); // Get all dishes
routes.get('/:id', dishesController.getDishById); // Get a spesific dish by ID
routes.get('/filter', dishesController.filterDishes); // Filter dishes based on certain criteria
routes.get('/location', dishesController.getDishesByLocation); // Get dishes by location
routes.get('/images', dishesController.fetchAllDishImages); // Get all dish images
routes.get('/images/:dishId', dishesController.fetchDishImage); // Get a spesific dish image by dish ID

// Only cooks allowed
routes.post(
  '/create',
  checkAuth.authenticate,
  checkAuth.isCook,
  upload.single('image_url'),
  dishesController.createDish
); // Create a new dish

routes.put(
  '/:dishId',
  checkAuth.authenticate,
  checkAuth.isCook,
  dishesController.updateDish
); // Update an existing dish
routes.put(
  '/images/:id',
  checkAuth.authenticate,
  checkAuth.isCook,
  upload.single('image_url'),
  dishesController.updateDishImage
); // Update a dish image

routes.delete(
  '/:dishId',
  checkAuth.authenticate,
  checkAuth.isCook,
  dishesController.removeDish
); // Delete a dish

// Only customers allowed

routes.post(
  '/:dishId/reviews',
  checkAuth.authenticate,
  checkAuth.isUser,
  dishesController.addReview
); // Add a review to a dish

routes.put(
  '/:dishId/reviews/:reviewId',
  checkAuth.authenticate,
  checkAuth.isUser,
  dishesController.updateReview
); // Update a review for a dish

module.exports = routes;
