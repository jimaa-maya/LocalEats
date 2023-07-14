require('dotenv').config();
const jwt = require('jsonwebtoken');
const express = require('express');
const generateToken = (res, user) => {
  // eslint-disable-next-line camelcase
  const { user_id, userName, email } = user;
  const payload = {
    // eslint-disable-next-line camelcase
    user_id,
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
  // Get the token from the request, typically from the "Authorization" header
  const token = req.cookies.jwt;
  console.log(token);
  // Check if a token is present
  if (!token) {
    return res.status(401).json({ error: 'token Unauthorized' });
  }

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // Attach the decoded token to the request object
    req.user = decoded;

    // Call the next middleware or route handler
    next();
  } catch (error) {
    // Handle token verification error
    return res.status(401).json({ error: 'token Invalid token' });
  }
};

module.exports = { generateToken, authenticate };
