'use strict';

const userModel = require('../models/userModel');

const users = userModel.users;

const get_user = async(req, res) => {
    console.log('get a user from controller');
    const id = req.params.id;
    const user = await userModel.getUser(id);
    return res.status(200).json(user);
}

module.exports = {
    get_user,
};