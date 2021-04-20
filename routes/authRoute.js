'use strict';
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { body } = require('express-validator');

//Register
router.post('/register',
    body('username').isLength({min: 3}).escape().blacklist(';'),
    body('password').matches('(?=.*[A-Z]).{8,}'),
    body('email').isEmail(),
    body('fname').isLength({min: 2}).escape().blacklist(';'),
    body('lname').isLength({min: 2}).escape().blacklist(';'),
    userController.create_user,
);

// Login
router.post('/login', authController.login);

module.exports = router;