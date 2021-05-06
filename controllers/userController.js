'use strict';

const userModel = require('../models/userModel');
const {validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');

const get_user = async(req, res) => {
    try{
        const id = req.user.userId;
        const user = await userModel.getUser(id);
        return res.status(200).json(user);
    }catch(e){
        res.status(400).message({error: e.message});
    }
    
}

const user_list_get = async (req, res) => {
    try{
        const users = await userModel.getAllUsers();
    res.json(users);
    }catch(e){
        res.status(400).message({error: e.message});
    }
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
    try{
        const usernames = await userModel.getAllUsernames();
        res.json(usernames);
    }catch(e){
        res.status(400).json({error: e.message});
    }

}

const update_user = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    try{
        const updateOk = await userModel.updateUser(req.user.userId, req);
        console.log(`updated... ${updateOk}`);
        res.send(`updated... ${updateOk}`);
    }catch(e){
        res.tatus(400).json({error: e.message});
    }
    
};

const update_username = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    console.log('controller req', req.body);
    const updateOk = await userModel.updateUsername(req.user.userId, req.body);
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
    const updateOk = await userModel.updateEmail(req.user.userId, req.body);
    console.log(`updated... ${updateOk}`);
    if (!updateOk) {
        res.status(400).json({error: 'Email already in use'}).end()
    } else {
        return res.status(200).json({message: 'Great success!'}); // VERY NICE!!!
    }
};

const update_password = async (req, res) => {
    try{
        const user = {};
        const salt = bcrypt.genSaltSync(12);
        user.password = bcrypt.hashSync(req.body.password, salt);
        console.log(user)
        const updateOk = await userModel.updatePassword(user, req.user.userId);
        res.send(`updated... ${updateOk}`);
    }catch(e){
        return res.status(400).json({error: e.message});
    }
    
};

const add_avatar = async (req, res) => {
    try {
        const avatar = await userModel.uploadAvatar(req);
        return res.status(200).json({message: 'Updated avatar!'});
    } catch (e) {
        res.status(400).json({error: e.message});
    }
}

const get_users_likes = async (req, res) => {
    try{
        const listOfLikes = await userModel.getUsersLikes(req.user.userId);
        res.json(listOfLikes);
    }catch(e){
        res.status(400).json({error: e.message})
    }
};

module.exports = {
    get_user,
    user_list_get,
    create_user,
    get_all_usernames,
    update_user,
    update_password,
    update_username,
    update_email,
    add_avatar,
    get_users_likes
};