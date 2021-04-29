'use strict';
const express = require('express');
const multer = require('multer');
const router = express.Router();
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const { body } = require('express-validator');


const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' ||
      file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const testFile = (req, res, next) => {
  if (req.file) {
    next();
  } else {
    res.status(400).json({errors: 'The file was not an image'});
  }
};

const upload = multer({dest: 'uploads/', fileFilter});

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

//Update user
router.put('/update/:id',
    userController.update_user);

//Update username
router.post('/update/username/',
    userController.update_username);

//Update email
router.post('/update/email/',
    userController.update_email);

//Update password
router.post('/changepassword/:id',
    body('password').matches('(?=.*[A-Z]).{8,}'),
    userController.update_password);

router.post('/update/avatar/:id',
    upload.single('avatar'),
    testFile,
    userController.add_avatar);

module.exports = router;
