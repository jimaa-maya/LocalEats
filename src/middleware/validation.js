const { check, validationResult, body } = require('express-validator');

// Validate the username
const validateUsername = (value) => {
  return [
    // The username should not be empty
    check('userName').notEmpty().withMessage('Username should not be empty'),

    // The username must be at least 4 characters long
    check('userName').isLength({ min: 4 }).withMessage('Username must be at least 4 characters long'),

    // The username should not include spaces
    check('userName')
      .custom((val) => !/\s/.test(val))
      .withMessage('Username should not include space'),
  ];
};

// Validate the email
const validateEmail = (value) => {
  return [
    // The email should not already be used
    check('email')
      .custom(async (val) => {
        // (e.g., querying your database or an array of used emails).
        const usedEmails = ['user1@example.com', 'user2@example.com'];
        if (usedEmails.includes(val)) {
          throw new Error('Email already exists');
        }
      }),

    // The email should be a valid email format
    check('email').isEmail().withMessage('Invalid email'),

    // The email should not be empty
    check('email').notEmpty().withMessage('Email should not be empty'),
  ];
};

// Validate the password
const validatePassword = () => {
  return [
    // The password should not be empty
    body('newPassword').notEmpty().withMessage('Password should not be empty'),

    // The password must be at least 5 characters long
    body('newPassword').isLength({ min: 5 }).withMessage('Password must be at least 5 characters long'),

    // The password must contain at least one number, one uppercase letter, and one lowercase letter
    body('newPassword')
      .custom((val) => /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).+$/.test(val))
      .withMessage('Password must contain a number, uppercase, and lowercase'),
  ];
};

// Function to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = { validateUsername, validateEmail, validatePassword, handleValidationErrors };
