const bcrypt = require('bcrypt');
const User = require('../models/users');
const jwt = require('jsonwebtoken');
const generateToken = require('../middleware/checkAuth.js');


const signUp = async (req, res) => {
    try {
      const { userName, email, password, address, phoneNumber, role } = req.body;
  
      if (!userName || !email || !password || !role) {
        return res.status(400).json({ message: 'All required fields must be provided' });
      }
  
      // Check if user already exists in the database
      const existingUser = await User.findOne({ userName });
      if (existingUser) {
        return res.status(409).json({ message: 'Username already exists' });
      }
  
      // Generate a salt
      const salt = await bcrypt.genSalt(10);
  
      // Hash the password with the generated salt
      const hashedPassword = await bcrypt.hash(password, salt);
  
      // Create a new user instance with the hashed password
      const newUser = new User({
        userName,
        email,
        password: hashedPassword,
        address,
        phoneNumber,
        profileType,
      });
  
      // Save the user to the database
      await newUser.save();
  
      // Generate and set the JWT token
      generateToken(res, newUser);
  
      res.json({ message: 'Sign-up successful', token });
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
        generateToken(res, newUser);

        res.json({ message: 'Sign-in successful', token });
    } catch (error) {
        console.error('Error in signIn controller:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};



const signOut = (req, res) => {
    try {
        // Clear session data, invalidate tokens, or perform any necessary sign-out actions
        req.session.destroy(); // Clear the session data for JWT-based authentication

        res.redirect('./');
    } catch (error) {
        console.error('Error in signOut controller:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


const resetPassword = async (req, res) => {
    try {
        const { userName, newPassword } = req.body;

        if (!userName || !newPassword) {
            return res.status(400).json({ message: 'Username and new password are required' });
        }

        // Find the user in the database 
        const user = await User.findOne({ userName });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

         // Generate a salt
    const salt = await bcrypt.genSalt(10);

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the user's password in the database
        user.password = hashedPassword;
        await user.save();

        // Optionally, send a password reset confirmation email or perform any other necessary actions

        res.json({ message: 'Password reset successful' });
    } catch (error) {
        console.error('Error in resetPassword controller:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { signUp, signIn, signOut, resetPassword };
