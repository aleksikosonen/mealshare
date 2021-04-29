'use strict';

const userModel = require('../models/userModel');
const {validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');

const get_user = async(req, res) => {
    const id = req.user.userId;
    const user = await userModel.getUser(id);
    return res.status(200).json(user);
}

const user_list_get = async (req, res) => {
    const users = await userModel.getAllUsers();
    res.json(users);
}

const create_user = async(req, res, next) => {
    //checking if the request has any validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    const user = {};
    user.username = req.body.username;
    user.email = req.body.email;
    user.fname = req.body.fname;
    user.lname = req.body.lname;
    const salt = bcrypt.genSaltSync(12);
    user.password = bcrypt.hashSync(req.body.password, salt);
    
    const id = await userModel.insertUser(user);
    if(id>0){
        next();
    } else{
        res.status(400).json({error: 'register error'}).end()
    }
};

const get_all_usernames = async(req, res) => {
    const usernames = await userModel.getAllUsernames();
    res.json(usernames);
}

module.exports = {
    get_user,
    user_list_get,
    create_user,
    get_all_usernames,
};