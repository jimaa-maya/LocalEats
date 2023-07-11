const express = require('express');

const routes = express.Router();

const passport = require('passport');

const jwt = require('jsonwebtoken');

routes.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email', 'openid'],
  })
);

routes.get('/google/callback',passport.authenticate('google',{session: false}),(req,res) =>{
    const user = req.user;
    console.log(user);
    res.redirect('/')
});




module.exports = routes;