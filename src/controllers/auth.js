const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/users');
const { generateToken } = require('../middleware/checkAuth');
const sendEmail = require('../utils/email');

require('dotenv').config();

const signUp = async (req, res) => {
  console.log('Request Body:', req.body);

  try {
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
    const token = generateToken(newUser);

    // Send the welcome email to the user
    const subject = 'Welcome to LocalEats!';
    const welcomeMessage = `Welcome to LocalEats, ${req.body.userName}! Thank you for signing up with us. We are excited to have you on board.

Please start exploring the delicious dishes in your neighborhood and place your first order now!

If you have any questions or need assistance, please feel free to contact our support team at support@localeats.com.

Happy eating!

Best regards,
The LocalEats Team`;
    sendEmail(req.body.email, subject, welcomeMessage);
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 3600 * 24 * 14,
    });
    return res.status(200).json({ message: 'Sign-up successful' });
  } catch (error) {
    console.error('Error in signUp controller:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const signIn = async (req, res) => {
  try {
    const { userName, password } = req.body;

    if (!userName || !password) {
      return res
        .status(400)
        .json({ message: 'Username and password are required' });
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
    const token = generateToken(user);

    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 3600 * 24 * 14,
    });

    res.json({ message: 'Sign-in successful' });
  } catch (error) {
    console.error('Error in signIn controller:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const signOut = (req, res) => {
  try {
    res.clearCookie('token');

    res.json({ message: 'Sign-out successful' });

    //res.redirect('/');
  } catch (error) {
    console.error('Error in signOut controller:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { userName, oldPassword, newPassword } = req.body;

    // Find the user in the database
    const user = await User.findOne({ userName });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare the provided old password with the hashed old password stored in the database
    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isOldPasswordValid) {
      return res.status(401).json({ message: 'Invalid old password' });
    }

    // Update the user's password directly with the new hashed password
    user.password = newPassword;
    await user.save();

    // Send password reset confirmation email
    const subject = 'Password Reset Confirmation';
    const resetConfirmationMessage =
      'Your password has been successfully reset.';
    sendEmail(user.email, subject, resetConfirmationMessage);

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Error in resetPassword controller:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { signUp, signIn, signOut, resetPassword };
