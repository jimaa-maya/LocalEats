const express = require('express');
const routes = express.Router();
const User = require('../controllers/users');
const checkAuth = require('../middleware/checkAuth');
routes.get('/:id', checkAuth.authenticate, User.getUser);
routes.put('/:id', checkAuth.authenticate, User.putUser);
routes.put('/role', checkAuth.authenticate, User.addRole);
routes.get('/role', checkAuth.authenticate, User.addRole);
routes.put('/address', checkAuth.authenticate, User.addAddress);
routes.get('/address', checkAuth.authenticate, User.getAddress);

module.exports = routes;
