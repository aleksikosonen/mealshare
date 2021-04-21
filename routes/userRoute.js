'use strict';

const { Router } = require('express');
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.route('/')
    .post(userController.create_user);

router.route('/:id')
    .get(userController.get_user);

module.exports = router;