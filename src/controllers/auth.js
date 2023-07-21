const jwt = require('jsonwebtoken');
//const bcrypt = require('bcrypt');
const bcrypt = require('bcryptjs');
const User = require('../models/users');
const { generateToken } = require('../middleware/checkAuth');
require('dotenv').config();
const { validationResult } = require('express-validator');
const {
  validateUsername,
  validateEmail,
  validatePassword,
  handleValidationErrors,
} = require('../middleware/validation');


const signUp = async (req, res) => {
  console.log('Request Body:', req.body);

  try {
    // Validate the request body using the validation functions
    await Promise.all([
      ...validateUsername(req.body.userName),
      ...validateEmail(req.body.email),
      ...validatePassword(req),
    ]);

    // Check if user already exists in the database
    const existingUserByEmail = await User.findOne({ email: req.body.email });
    if (existingUserByEmail) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    // Create a new user instance with the provided details
    const newUser = new User({
      userName: req.body.userName,
      email: req.body.email,
      password: req.body.password,
      address: { ...req.body.address },
      phoneNumber: req.body.phoneNumber,
      role: req.body.role,
    });

    // Save the user to the database
    await newUser.save();

    // Generate and set the JWT token for the newly signed-up user
    generateToken(res, newUser);

    return res.json({ message: 'Sign-up successful' });
  } catch (error) {
    console.error('Error in signUp controller:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};




const signIn = async (req, res) => {
  try {
    const { userName, password } = req.body;

    if (!userName || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    // Find the user in the database
    const user = await User.findOne({ userName });
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Compare the provided password with the hashed password stored in the database
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Generate and set the JWT token
    generateToken(res, user); // Pass the user object to the generateToken function

    res.json({ message: 'Sign-in successful' });
  } catch (error) {
    console.error('Error in signIn controller:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



const signOut = (req, res) => {
    try {
        // Clear session data, invalidate tokens, or perform any necessary sign-out actions
        req.session.destroy(); // Clear the session data for JWT-based authentication


        res.json({ message: 'Sign-out successful' });

        //res.redirect('/');
    } catch (error) {
        console.error('Error in signOut controller:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};



const resetPassword = async (req, res) => {
  try {
    // Validate the request body
    await Promise.all(validatePassword(req));

    const { userName, newPassword } = req.body;

    // Find the user in the database
    const user = await User.findOne({ userName });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the user's password directly with the new hashed password
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Error in resetPassword controller:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};




module.exports = { signUp, signIn, signOut, resetPassword };
