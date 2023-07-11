require('dotenv').config();
const express = require('express');
const routes = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const checkAuth = require('../middleware/checkAuth');

routes.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email', 'openid'],
  })
);

routes.get(
  '/facebook',
  passport.authenticate('facebook', {
    scope: ['profile', 'email', 'openid'],
  })
);

routes.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    const user = req.user;
    console.log(user);
    const token = jwt.sign(
      {
        userName: user.userName,
        email: user.email,
        providerId: user._id,
      },
      process.env.SECRET_KEY,
      { expiresIn: '14d' }
    );
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 14 * 24 * 60 * 60 * 1000,
    });

    res.redirect('/');
  }
);

routes.get(
  '/facebook/callback',
  passport.authenticate('facebook', { session: false }),
  (req, res) => {
    const user = req.user;
    console.log(user);
    const token = jwt.sign(
      {
        userName: user.userName,
        email: user.email,
        providerId: user._id,
      },
      process.env.SECRET_KEY,
      { expiresIn: '14d' }
    );
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 14 * 24 * 60 * 60 * 1000,
    });

    res.redirect('/');
  }
);

module.exports = routes;
