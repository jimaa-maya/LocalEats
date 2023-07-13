const bcrypt = require('bcrypt');
const User = require('../models/users');
const jwt = require('jsonwebtoken');


const signUp = async (req, res) => {
    try {
        const { userName, email, password, address, phoneNumber, profileType } = req.body;

        if (!userName || !email || !password || !address || !phoneNumber || !profileType) {
            return res.status(400).json({ message: 'All required fields must be provided' });
        }

        // Check if user already exists in the database
        const existingUser = await User.findOne({ userName });
        if (existingUser) {
            return res.status(409).json({ message: 'Username already exists' });
        }

        // Generate a new user instance
        const newUser = new User({ userName, email, password, address, phoneNumber, profileType });

        // Save the user to trigger the pre-save middleware for password hashing
        await newUser.save();

        // Generate JWT token
        const token = jwt.sign({ userId: newUser.user_id }, process.env.JWT_SECRET);

        // Set the token as a cookie or include it in the response body
        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 3600000,
            secure: true,
        });

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

        // Generate JWT token
        const token = jwt.sign({ userId: user.user_id }, process.env.JWT_SECRET);

        // Set the token as a cookie or include it in the response body, if desired
        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 3600000, // Set the expiration time as desired
            secure: true, // Set to true if using HTTPS
        });

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

        // Additional sign-out actions for Google authentication
        if (req.user && req.user.authMethod === 'google') {
            // Perform Google sign-out actions, such as revoking tokens, etc.
            // ...
        }

        res.json({ message: 'Sign-out successful' });
        // Redirect the user to a specific route after sign-out
        res.redirect('/');
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
