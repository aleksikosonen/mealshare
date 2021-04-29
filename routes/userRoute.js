'use strict';

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.route('/')
    .get(userController.get_user);

router.route('/:id')
    .get(userController.get_user);

router.route('/username')
    .post(userController.user_list_get);

module.exports = router;