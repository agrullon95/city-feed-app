const express = require('express');
const router = express.Router();
const { signup, login, logout, me, updateMe } = require('../controllers/authController');

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', me)
router.patch('/me', updateMe);

module.exports = router;
