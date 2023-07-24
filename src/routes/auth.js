require('dotenv').config();
const express = require('express');
const routes = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/users');

routes.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email', 'openid'],
  })
);



routes.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    const user = req.user;
    const token = jwt.sign(
      {
        userName: user.userName,
        email: user.email,
        providerId: `google-${user.providerId}`,
      },
      process.env.SECRET_KEY,
      { expiresIn: '14d' }
    );
      console.log(token,'tokenn')
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 14 * 24 * 60 * 60 * 1000,
    });

    res.redirect('/');
  }
);

// add the role for the user i.e cook or student




module.exports = routes;
