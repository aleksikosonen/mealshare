'use strict';
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const { body } = require('express-validator');

// Login
router.post('/login', authController.login);

//Logout
router.get('/logout', authController.logout);

//Register
router.post('/register',
    body('username').isLength({min: 3}).escape().blacklist(';'),
    body('password').matches('(?=.*[A-Z]).{8,}'),
    body('email').isEmail(),
    body('fname').isLength({min: 2}).escape().blacklist(';'),
    body('lname').isLength({min: 2}).escape().blacklist(';'),
    userController.create_user,
    authController.login
);

module.exports = router;