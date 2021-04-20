'use strict';

const userModel = require('../models/userModel');
const {validationResult} = require('express-validator');


const users = userModel.users;

const get_user = async(req, res) => {
    console.log('get a user from controller');
    const id = req.params.id;
    const user = await userModel.getUser(id);
    return res.status(200).json(user);
}

const user_list_get = async (req, res) => {
    const users = await userModel.getAllUsers();
    res.json(users);
};

module.exports = {
    get_user,
    user_list_get,
};