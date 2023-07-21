const express = require('express');
const routes = express.Router();
const User = require('../controllers/users');
const checkAuth = require('../middleware/checkAuth');

routes.get('/users', checkAuth.authenticate, User.getAll);
routes.post('/users', checkAuth.authenticate, User.add);
routes.get('/users/:id', checkAuth.authenticate, User.getUserByID);
routes.put('/users/:id', checkAuth.authenticate, User.updateUser);
routes.delete('/users/:id', checkAuth.authenticate, User.deleteUser);

module.exports = routes;