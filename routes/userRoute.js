'use strict';

const express = require('express');
const router = express.Router();
const multer = require('multer');
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


router.route('/')
    .get(userController.get_user);

router.route('/username')
    .post(userController.user_list_get);


//Update user
router.put('/update',
    userController.update_user);

//Update username
router.post('/update/username',
    userController.update_username);

//Update email
router.post('/update/email',
    userController.update_email);

//Update password
router.post('/changepassword',
    body('password').matches('(?=.*[A-Z]).{8,}'),
    userController.update_password);

router.post('/update/avatar',
    upload.single('avatar'),
    testFile,
    userController.add_avatar);

module.exports = router;