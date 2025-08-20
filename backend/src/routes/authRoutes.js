const express = require('express');
const { signup, login, logout, me, updateMe } = require('../controllers/authController');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', me)
router.patch('/me', updateMe);

module.exports = router;
