'use strict';

const userModel = require('../models/userModel');
const {validationResult} = require('express-validator');

const get_user = async(req, res) => {
    console.log('get a user from controller');
    const id = req.params.id;
    const user = await userModel.getUser(id);
    return res.status(200).json(user);
}

const create_user = async(req, res, next) => {
    //checking if the request has any validation errors
    console.log('creating user');
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    
    const user = {};
    user.username = req.body.username;
    user.password = req.body.password;
    user.email = req.body.email;
    user.fname = req.body.fname;
    user.lname = req.body.lname;
    console.log('userController create_user', user);
    
    const id = await userModel.insertUser(user);
    if(id>0){
        next();
    } else{
        res.status(400).json({error: 'register error'}).end()
    }
};

module.exports = {
    get_user,
    create_user,
};