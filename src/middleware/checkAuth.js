/* eslint-disable no-unused-vars */
require('dotenv').config();
const jwt = require('jsonwebtoken');
const express = require('express');
const User = require('../models/users');

const generateToken = (user) => {
  const { userName, email } = user;
  const payload = {
    userName,
    email,
  };
  const token = jwt.sign(payload, process.env.SECRET_KEY, {
    expiresIn: '14d',
  });
  return token;
  
};

const authenticate = (req, res, next) => {
  const token = req.cookies.token || req.header('Authorization');

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Check if the token starts with "Bearer " and extract the actual token
  let actualToken;
  if (token.startsWith('Bearer ')) {
    actualToken = token.split(' ')[1]; 
  } else {
    actualToken = token; 
  }

  try {
    const decoded = jwt.verify(actualToken, process.env.SECRET_KEY,  {algorithms: ['HS256']} );
    req.user = decoded;
    next();
  } catch (error) {
    console.error(error);
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
