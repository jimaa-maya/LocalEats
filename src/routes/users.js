const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const checkAuth = require('../middleware/checkAuth');

// Define routes without '/users' at the beginning
router.get('/', checkAuth.authenticate, userController.getAll);
router.post('/', checkAuth.authenticate, userController.add);
router.get('/:id', checkAuth.authenticate, userController.getUserByID);
router.put('/:id', checkAuth.authenticate, userController.updateUser);
router.delete('/:id', checkAuth.authenticate, userController.deleteUser);

module.exports = router;