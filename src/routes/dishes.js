const express = require('express');

const routes = express.Router();
const Multer = require('multer');
require('dotenv').config();

// eslint-disable-next-line no-unused-vars
const dishesController = require('../controllers/dishes');
// const checkAuth = require('../middleware/checkAuth');

// SWAGGER

/**
 * @swagger
 * tags:
 *   name: Dishes
 *   description: APIs related to dishes
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Dish:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated ID of the dish
 *         user_id:
 *           type: string
 *           description: The ID of the user who created the dish
 *         dishName:
 *           type: string
 *           description: The name of the dish
 *         description:
 *           type: string
 *           description: The description of the dish
 *         image_url:
 *           type: string
 *           format: binary
 *           description: Base64-encoded image data
 *         price:
 *           type: number
 *           description: The price of the dish
 *         review:
 *           type: array
 *           items:
 *             $ref: '#/models/dishes'
 *           description: Array of review objects
 *         dishType:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of dish types
 *         preferences:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of dish preferences
 *       required:
 *         - user_id
 *         - dishName
 *         - price
 *         - dishType
 */

/**
 * @swagger
 * /dishes/{id}:
 *   get:
 *     summary: Get a specific dish by ID
 *     tags: [Dishes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the dish
 *     responses:
 *       200:
 *         description: Dish details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Dish'
 *       404:
 *         description: Dish not found
 *       500:
 *         description: An error occurred while fetching the dish

 * @swagger
 * /dishes:
 *   get:
 *     summary: Get all dishes
 *     tags: [Dishes]
 *     responses:
 *       200:
 *         description: List of all dishes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Dish'
 *       500:
 *         description: An error occurred while fetching the dishes

 * @swagger
 * /dishes/create:
 *   post:
 *     summary: Create a new dish
 *     tags: [Dishes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Dish'
 *     responses:
 *       201:
 *         description: Dish created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Dish'
 *       400:
 *         description: Invalid input or missing fields
 *       500:
 *         description: Failed to create dish

 * @swagger
 * /dishes/{dishId}:
 *   delete:
 *     summary: Delete a dish
 *     tags: [Dishes]
 *     parameters:
 *       - in: path
 *         name: dishId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the dish
 *     responses:
 *       200:
 *         description: Deleted dish details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Dish'
 *       404:
 *         description: Dish not found
 *       500:
 *         description: An error occurred while deleting the dish
 */

// multer config
const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 1024 * 1024 * 10, // no larger than 10mb
  },
});

routes.put(
  '/:dishId',
  // checkAuth.authenticate,
  // checkAuth.isCook,
  dishesController.updateDish
); // Update an existing dish

routes.put(
  '/:dishId/image',
  // checkAuth.authenticate,
  // checkAuth.isCook,
  multer.single('image_url'),
  dishesController.updateDishImage
); // Update an existing dish

// Only cooks allowed
routes.post(
  '/create',
  // checkAuth.authenticate,
  // checkAuth.isCook,
  multer.single('image_url'),
  dishesController.createDish
); // Create a new dish

// GET Routes
routes.get('/images/:dishId', dishesController.fetchDishImage); // Get a specific dish image by dish ID
routes.get('/location', dishesController.getDishesByLocation); // Get dishes by location
routes.get('/filter', dishesController.filterDishes); // Filter dishes based on certain criteria
routes.get('/images', dishesController.fetchAllDishImages); // Get all dish images
routes.get('/:id', dishesController.getDishById); // Get a specific dish by ID
routes.get('/', dishesController.getAllDishes); // Get all dishes

// NOTE: create a image update func and route.

routes.delete(
  '/:dishId',
  // checkAuth.authenticate,
  // checkAuth.isCook,
  dishesController.removeDish
); // Delete a dish

// Only customers allowed

routes.post(
  '/:dishId/reviews',
  // checkAuth.authenticate,
  // checkAuth.isUser,
  dishesController.addReview
); // Add a review to a dish

routes.put(
  '/:dishId/reviews/',
  // checkAuth.authenticate,
  // checkAuth.isUser,
  dishesController.updateReview
); // Update a review for a dish

module.exports = routes;
