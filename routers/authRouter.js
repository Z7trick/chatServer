const express = require('express');
const router = express.Router();
const { handleLogin, attemptLogin, attemptRegister } = require('../controllers/authController');

router.route('/login').get(handleLogin).post(attemptLogin);
router.post('/signup', attemptRegister);
module.exports = router;
