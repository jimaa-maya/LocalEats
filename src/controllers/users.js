const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/users');
const jwt = require('jsonwebtoken');


// Create a new user
exports.createUser = async (req, res) => {
    try {
      const userData = req.body;
  
      // Check if the request body is empty
      if (Object.keys(userData).length === 0) {
        return res.status(400).json({ error: 'Empty request body. Please provide valid data for the new user.' });
      }
  
      // Check if the user name and email are provided
      if (!userData.userName || !userData.email) {
        return res.status(400).json({ error: 'User name and email are required fields.' });
      }
  
      // Check if the email is unique
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        return res.status(400).json({ error: 'Email is already registered. Please use a different email.' });
      }
  
      // Create a new user with the provided data
      const newUser = new User(userData);
      await newUser.save();
  
      // New user creation successful
      res.status(201).json(newUser);
    } catch (error) {
      // Handle unexpected server-side errors
      res.status(500).json({ error: 'Failed to create a new user.' });
    }
};
  

// Get all users
exports.getAllUsers = async (req, res) => {
    // Check authorization 
    const token = req.cookies.jwt;
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized!' });
    }

    try {
        // Verify the token and decode the data (e.g., user ID, role, etc.)
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
                
        // If authorization is successful, fetch all users
        const users = await User.find();
        res.json(users);
    } catch (error) {
        // Handle unexpected server-side errors
        res.status(500).json({ error: 'Failed to get all users.' });
    }
};


// Get a single user by ID
exports.getUserById = async (req, res) => {
    // Check authorization 
    const token = req.cookies.jwt;
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized!' });
    }

    try {
        // Verify the token and decode the data (e.g., user ID, role, etc.)
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);


        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
      }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get the user' });
    }
};


// Update a user by ID
exports.updateUser = async (req, res) => {
    // Check authorization 
    const token = req.cookies.jwt;
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized!' });
    }

    try {
        // Verify the token and decode the data (e.g., user ID, role, etc.)
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
        const userId = req.params.id;
        const updateData = req.body;

        // Check if the request body is empty
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ error: 'Empty request body. Please provide valid data for update.' });
        }

        // Check if the user ID is valid
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: 'Invalid user ID format.' });
        }

        // Find the user by ID and update the data
        const user = await User.findByIdAndUpdate(userId, updateData, { new: true });

        // Check if the user exists
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        // User update successful
        res.json(user);
    } catch (error) {
        // Handle unexpected server-side errors
        res.status(500).json({ error: 'Failed to update the user.' });
    }
};


// Delete a user by ID
exports.deleteUser = async (req, res) => {
    // Check authorization 
    const token = req.cookies.jwt;
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized!' });
    }

    try {
        // Verify the token and decode the data (e.g., user ID, role, etc.)
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
        
        const userId = req.params.id;
        // Check if the user ID is valid
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: 'Invalid user ID format.' });
        }

        // Find the user by ID and delete
        const user = await User.findByIdAndRemove(userId);

        // Check if the user exists
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        // User deletion successful
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        // Handle unexpected server-side errors
        res.status(500).json({ error: 'Failed to delete the user.' });
    }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  
};