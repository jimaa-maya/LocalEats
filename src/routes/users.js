const express = require('express');
const router = express.Router();
const userController = require('../controllers/users');
const checkAuth = require('../middleware/checkAuth');

// Define routes without '/users' at the beginning
router.get('/', checkAuth.authenticate, userController.getAllUsers);
router.post('/', userController.createUser);
router.get('/:id', checkAuth.authenticate, userController.getUserById);
router.put('/:id', checkAuth.authenticate, userController.updateUser);
router.delete('/:id', checkAuth.authenticate, userController.deleteUser);

module.exports = router;
