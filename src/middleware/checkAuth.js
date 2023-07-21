require('dotenv').config();
const jwt = require('jsonwebtoken');
const express = require('express');
const User = require('../models/users');


const generateToken = (res, user) => {
  const { userName, email } = user;
  const payload = {
    userName,
    email,
  };
  const token = jwt.sign(payload, process.env.SECRET_KEY, {
    expiresIn: '14d',
  });
  res.cookie('token', token, {
    httpOnly: true,
    maxAge: 1000 * 3600 * 24 * 14,
    signed: true,
  });
};


// eslint-disable-next-line consistent-return
const authenticate = (req, res, next) => {
  const token = req.cookies.jwt || req.header('Authorization');

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};


module.exports = { generateToken, authenticate };
