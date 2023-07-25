/* eslint-disable no-unused-vars */
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

// eslint-disable-next-line consistent-return
const isCook = (req, res, next) => {
  if (req.user.role !== 'cooks') {
    return res.status(403).json({
      error: 'Forbidden - Only cooks are allowed to access this route',
    });
  }
  next();
};

// eslint-disable-next-line consistent-return
const isUser = (req, res, next) => {
  if (req.user.role !== 'users') {
    return res.status(403).json({
      error: 'Forbidden - Only users are allowed to access this route',
    });
  }
  next();
};

module.exports = { generateToken, authenticate, isCook, isUser };
