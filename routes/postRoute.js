const express = require('express');
const multer = require('multer');
const postController = require('../controllers/postController');
const {body} = require('express-validator');
const router = express.Router();

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

router.get('/', postController.post_list_get);

router.post('/',
    upload.single('post'),
    testFile,
    body('caption').isLength({min: 1}),
    postController.post_create_image);

router.get('/:id', postController.post_list_get);

module.exports = router;
