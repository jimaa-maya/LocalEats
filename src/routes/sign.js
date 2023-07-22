const express = require('express');
const routes = express.Router();

const { signUp, signIn, signOut, resetPassword } = require('../controllers/auth');
const {authenticate} = require('../middleware/checkAuth');

routes.post('/signup', signUp);
routes.post('/signin', signIn);
routes.get('/signout', signOut);
routes.post('/reset-password', resetPassword);

module.exports = routes;
