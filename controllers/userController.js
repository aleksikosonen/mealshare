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

const update_user = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    const updateOk = await userModel.updateUser(req.params.id, req);
    console.log(`updated... ${updateOk}`);
    res.send(`updated... ${updateOk}`);
};

const update_username = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    console.log('controller req', req.body);
    const updateOk = await userModel.updateUsername(req.body);
    console.log(`updated... ${updateOk}`);
    if (!updateOk) {
        res.status(400).json({error: 'Username already in use'}).end()
    } else {
        return res.status(200).json({message: 'Great success!'}); // VERY NICE!!!
    }
};

const update_email = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    console.log('controller req', req.body);
    const updateOk = await userModel.updateEmail(req.body);
    console.log(`updated... ${updateOk}`);
    if (!updateOk) {
        res.status(400).json({error: 'Email already in use'}).end()
    } else {
        return res.status(200).json({message: 'Great success!'}); // VERY NICE!!!
    }
};

const update_password = async (req, res) => {
    const user = {};
    const salt = bcrypt.genSaltSync(12);
    user.password = bcrypt.hashSync(req.body.password, salt);
    console.log(user)
    const updateOk = await userModel.updatePassword(user, req.params.id);
    res.send(`updated... ${updateOk}`);
};

const add_avatar = async (req, res) => {
    try {
        const avatar = await userModel.uploadAvatar(req);
        //res.send(avatar);
        return res.status(200).json({message: 'Updated avatar!'});
    } catch (e) {
        res.status(400).json({error: e.message});
    }
}

module.exports = {
    get_user,
    user_list_get,
    create_user,
    update_user,
    update_password,
    update_username,
    update_email,
    add_avatar,
};