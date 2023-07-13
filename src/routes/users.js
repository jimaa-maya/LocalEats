const express = require('express');
const routes = express.Router();
const User = require('../controllers/users');
const checkAuth = require('../middleware/checkAuth')
routes.get('/',checkAuth,User.getUser);
routes.put('/', checkAuth,User.putUser);

module.exports = routes;
