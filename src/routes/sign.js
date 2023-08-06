/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication and authorization
 */

const express = require('express');
const routes = express.Router();

const { signUp, signIn, signOut, resetPassword } = require('../controllers/auth');
const { authenticate } = require('../middleware/checkAuth');

/**
 * @swagger
 * /signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       description: User registration data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User registered successfully
 *       400:
 *         description: Invalid input
 */
routes.post('/signup', signUp);

/**
 * @swagger
 * /signin:
 *   post:
 *     summary: Sign in with credentials
 *     tags: [Authentication]
 *     requestBody:
 *       description: User login data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserCredentials'
 *     responses:
 *       200:
 *         description: Authentication successful
 *       401:
 *         description: Authentication failed
 */
routes.post('/signin', signIn);

/**
 * @swagger
 * /signout:
 *   get:
 *     summary: Sign out the authenticated user
 *     tags: [Authentication]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Sign-out successful
 *       401:
 *         description: Unauthorized
 */
routes.get('/signout', authenticate, signOut);

/**
 * @swagger
 * /reset-password:
 *   post:
 *     summary: Request password reset
 *     tags: [Authentication]
 *     requestBody:
 *       description: User email for password reset
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResetPasswordRequest'
 *     responses:
 *       200:
 *         description: Password reset request sent
 *       400:
 *         description: Invalid input
 */
routes.post('/reset-password',authenticate, resetPassword);

module.exports = routes;
