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
*info:
*  title: User Management API
*  description: API for managing user data
*  version: 1.0.0
*paths:
*  /users:
*    post:
*      summary: Create a new user
*      requestBody:
*        required: true
*        content:
*          application/json:
*            schema:
*              $ref: '#/components/schemas/UserInput'
*      responses:
*        '201':
*          description: User created successfully
*          content:
*            application/json:
*              schema:
*                $ref: '#/components/schemas/User'
*        '400':
*          description: Bad request
*    get:
*      summary: Get all users
*      responses:
*        '200':
*          description: List of users
*          content:
*            application/json:
*              schema:
*                type: array
*                items:
*                  $ref: '#/components/schemas/User'
*        '500':
*          description: Internal server error
*  /users/{userId}:
*    get:
*      summary: Get a user by ID
*      parameters:
*        - in: path
*          name: userId
*          required: true
*          schema:
*            type: string
*          description: ID of the user to retrieve
*      responses:
*        '200':
*          description: User details
*          content:
*            application/json:
*              schema:
*                $ref: '#/components/schemas/User'
*        '400':
*          description: Bad request
*        '404':
*          description: User not found
*        '500':
*          description: Internal server error
*    put:
*      summary: Update a user by ID
*      parameters:
*        - in: path
*          name: userId
*          required: true
*          schema:
*            type: string
*          description: ID of the user to update
*      requestBody:
*        required: true
*        content:
*          application/json:
*            schema:
*              $ref: '#/components/schemas/UserInput'
*      responses:
*        '200':
*          description: User updated successfully
*          content:
*            application/json:
*              schema:
*                $ref: '#/components/schemas/User'
*        '400':
*          description: Bad request
*        '404':
*          description: User not found
*        '500':
*          description: Internal server error
*    delete:
*      summary: Delete a user by ID
*      parameters:
*        - in: path
*          name: userId
*          required: true
*          schema:
*            type: string
*          description: ID of the user to delete
*      responses:
*        '200':
*          description: User deleted successfully
*        '400':
*          description: Bad request
*        '404':
*          description: User not found
*        '500':
*          description: Internal server error
*components:
*  schemas:
*    User:
*      type: object
*      properties:
*        _id:
*          type: string
*          description: User ID
*        userName:
*          type: string
*          description: User name
*        email:
*          type: string
*          description: User email
*        createdAt:
*          type: string
*          format: date-time
*          description: User creation timestamp
*        updatedAt:
*          type: string
*          format: date-time
*          description: User last update timestamp
*      required:
*        - _id
*        - userName
*        - email
*        - createdAt
*        - updatedAt
*    UserInput:
*      type: object
*      properties:
*        userName:
*          type: string
*          description: User name
*        email:
*          type: string
*          description: User email
*      required:
*        - userName
*        - email
*/

// Define routes without '/users' at the beginning
router.get('/', checkAuth.authenticate, userController.getAllUsers);
router.post('/', userController.createUser);
router.get('/:id', checkAuth.authenticate, userController.getUserById);
router.put('/:id', checkAuth.authenticate, userController.updateUser);
router.delete('/:id', checkAuth.authenticate, userController.deleteUser);

module.exports = router;