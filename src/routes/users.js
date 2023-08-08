const express = require('express');
const router = express.Router();
const userController = require('../controllers/users');
const checkAuth = require('../middleware/checkAuth');

/**
 *  @swagger
 *    components:
 *      schemas:
 *        User:
 *          type: object
 *          required:
 *            - user_id
 *            - userName
 *            - email
 *            - password
 * 
 *          properties:
 *            user_id:
 *              type: integer
 *              description: The auto-generated id number of the user.
 *            userName:
 *              type: string
 *              description: The name of user.
 *            email:
 *              type: string
 *              description: user's email.
 *            password:
 *              type: string (hashed)
 *              description: user's password.
 *            address:
 *              type: subdocument
 *              description: user's address.
 *            phoneNumber:
 *              type: integer
 *              description: user's phone number.
 *            role:
 *              type: string
 *              description: user type (regular user or cook).
*/

/**
 * @swagger
 *      /users:
 *         post:
 *           summary: Create new user
 *           tags: [User]
 *           requestBody:
 *             required: true
 *             content:
 *               application/json:
 *                 schema:
 *                   $ref: '#/models/users'
 *           responses:
 *             201:
 *               description: The created user.
 *               content:
 *                 application/json:
 *                   schema:
 *                     $ref: '#/models/user'
 *             500:
 *               description: Some server error
 *             400:
 *               description: Invalid request
 *         get:
 *           summary: Get all users data
 *           tags: [User]
 *           requestBody:
 *             required: true
 *             content:
 *               application/json:
 *                 schema:
 *                   $ref: '#/models/users'
 *           responses:
 *             200:
 *               description: Users details.
 *               content:
 *                 application/json:
 *                   schema:
 *                     $ref: '#/models/users'
 *             500:
 *               description: Some server error
 * 
 *       /users/:id :
 *         put:
 *           summary: Update a user's data
 *           tags: [User]
 *           requestBody:
 *             required: true
 *             content:
 *               application/json:
 *                 schema:
 *                   $ref: '#/models/users'
 *           responses:
 *             200:
 *               description: Updated user's data.
 *               content:
 *                 application/json:
 *                   schema:
 *                     $ref: '#/models/cart'
 *            400:
 *               description: Invalid request
 *            404:
 *               description: User not found
 *            500:
 *               description: Some server error
 *         get:
 *           summary: Get a user data.
 *           tags: [User]
 *           requestBody:
 *             required: true
 *             content:
 *               application/json:
 *                 schema:
 *                   $ref: '#/models/users'
 *           responses:
 *             200:
 *               description: The created book.
 *               content:
 *                 application/json:
 *                   schema:
 *                     $ref: '#/models/cart'
 *             500:
 *               description: Some server error
 *          delete:
 *           summary: Delete a user.
 *           tags: [User]
 *           requestBody:
 *             required: true
 *             content:
 *               application/json:
 *                 schema:
 *                   $ref: '#/models/users'
 *           responses:
 *             200:
 *               description: User deleted.
 *            400:
 *               description: Invalid request
 *            404:
 *               description: User not found
 *            500:
 *               description: Some server error
 */


// Define routes without '/users' at the beginning
router.get('/', checkAuth.authenticate, userController.getAllUsers);
router.post('/', userController.createUser);
router.get('/:id', checkAuth.authenticate, userController.getUserById);
router.put('/:id', checkAuth.authenticate, userController.updateUser);
router.delete('/:id', checkAuth.authenticate, userController.deleteUser);

module.exports = router;