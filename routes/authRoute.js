/**
 * Js-file for login / logout / register routes.
 *
 *
 * @Author Aleksi Kytö, Niko Lindborg, Aleksi Kosonen
 * */

'use strict';
const express = require('express');
const multer = require('multer');
const router = express.Router();
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const { body } = require('express-validator');


// Login
router.post('/login', authController.login);

//Logout
router.get('/logout', authController.logout);
const logger = (req, res, next) =>{
    console.log('regist ', req.body)
    next();
}
//Register
router.post('/register',
    logger,
    body('username').isLength({min: 3}).escape().blacklist(';'),
    body('password').matches('(?=.*[A-Z]).{8,}'),
    body('email').isEmail(),
    body('fname').isLength({min: 2}).escape().blacklist(';'),
    body('lname').isLength({min: 2}).escape().blacklist(';'),
    userController.create_user,
    authController.login
);

module.exports = router;
