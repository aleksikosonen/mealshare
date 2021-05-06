const express = require('express');
const multer = require('multer');
const postController = require('../controllers/postController');
const {body} = require('express-validator');
const { route } = require('./userRoute');
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
router.post('/feed/:retrieved', postController.feed_list_get)
router.post('/tagmatches', postController.post_get_all_tagRelations);
router.post('/usermatches', postController.post_get_all_userRelations);

router.post('/feed/like/:id', postController.feed_like);
router.delete('/feed/like/:id', postController.delete_like);
router.get('/feed/like/:id', postController.get_single_like);

router.post('/com/:postId',
    body('comment').isLength({min: 1}).escape().blacklist(';'),
    postController.post_add_comment
);

router.post('/comm', postController.post_find_comments);

router.post('/',
    upload.single('post'),
    testFile,
    postController.make_post,
    body('caption').isLength({min: 1}),
    postController.post_create_image
);

router.post('/ingredient/:id', postController.post_add_ingredient);
router.post('/workphases/:id', postController.post_add_workphases);

router.get('/:id', postController.post_list_get);
router.get('/ingredient/', postController.post_list_get_ingredients);
router.get('/recipe/ingredients/:id', postController.post_list_get_ingredients);
router.get('/recipe/workphases/:id', postController.post_list_get_workphases);
router.post('/recipe/allworkphases', postController.post_list_get_all_workphases);
router.post('/recipe/allingredientsfeed/', postController.post_list_get_all_ingredients_feed);

router.post('/tag', postController.post_get_all_tags);

router.get('/recipe/ingredients/:id', postController.post_list_get_ingredients)
router.get('/recipe/allingredients/:id', postController.post_list_get_all_ingredients)
router.delete('/delete/ingredient/:id', postController.post_delete_ingredient)
router.post('/likes', postController.post_get_likes)

router.put('/:id', postController.post_update);
router.delete('/:id', postController.post_delete);
router.delete('/comment/:id', postController.comment_delete);
module.exports = router;