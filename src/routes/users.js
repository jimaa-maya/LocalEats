const express = require('express');
const routes = express.Router();
const User = require('../controllers/users');
const checkAuth = require('../middleware/checkAuth')
routes.get('/',checkAuth.authenticate,User.getUser);
routes.put('/', checkAuth.authenticate,User.putUser);
routes.put('/addrole', checkAuth.authenticate,User.addRole);
// get the role of the user
// set the address for the user

routes.put('/address', checkAuth.authenticate, User.addAddress);

// get the address for the user
/**************/

module.exports = routes;
