'use strict';

const { Router } = require('express');
const express = require('express');
const route = express.Router();
const userController = require('../controllers/userController');

route.route('/')

route.route('/:id')
.get(userController.get_user);

module.exports = route;