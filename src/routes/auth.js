const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/checkAuth');
const { signUp, signIn, signOut, resetPassword } = require('../controllers/authController');



router.post('/signup', signUp);
router.post('/signin', signIn);
router.get('/signout', authenticate, signOut);
router.post('/reset-password', authenticate, resetPassword);



module.exports = router;