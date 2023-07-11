const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/checkAuth');
const { signUp, signIn, signOut, resetPassword } = require('../controllers/authController');



router.post('/signup', signUp);
router.post('/signin', signIn);
router.get('/signout', checkAuth, signOut);
router.post('/reset-password', checkAuth, resetPassword);



module.exports = router;


