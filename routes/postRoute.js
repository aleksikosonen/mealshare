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
router.get('/postedBy', postController.post_list_get_postedBy);
router.post('/feed/:retrieved', postController.feed_list_get);
router.post('/matches/', postController.post_get_all_tagRelations);
router.get('/recipe', postController.post_list_get_all_recipes);

router.post('/',
    upload.single('post'),
    testFile,
    body('caption').isLength({min: 1}),
    postController.post_create_image);

router.post('/recipe/:id', postController.post_create_recipe);

router.post('/ingredient/:id', postController.post_add_ingredient);

router.get('/:id', postController.post_list_get);
router.get('/ingredient/', postController.post_list_get_ingredients);
router.get('/recipe/ingredients/:id', postController.post_list_get_ingredients);

router.post('/tag', postController.post_get_all_tags);


module.exports = router;
