const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

<<<<<<< HEAD
router.post('/signup', authController.register);
router.post('/register', authController.register); // Keep for backwards compatibility
=======
router.post('/register', authController.register);
>>>>>>> 405b5e56ca9d5592da3a749a72cb37743d414aaa
router.post('/login', authController.login);

module.exports = router;
