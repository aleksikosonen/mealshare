'use strict';

const postModel = require('../models/postModel');
const {validationResult} = require('express-validator');

const post_list_get = async (req, res) => {
  const posts = await postModel.getAllPosts();
  return res.json(posts);
};

//Made for later adding more details to post
const post_create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({errors: errors.array()});
  }
  try {
    const id = await postModel.uploadPost(req);
    const post = await postModel.getPost(id);
    res.send(post);
  } catch (e) {
    res.status(400).json({error: e.message});
  }
};

const post_create_image = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({errors: errors.array()});
  }
  try {
    console.log('get a user from controller', req.user);
    const id = await postModel.uploadPostImage(req);
    const post = await postModel.getPost(id);
    res.send(post);
  } catch (e) {
    res.status(400).json({error: e.message});
  }
};

module.exports = {
  post_create,
  post_list_get,
  post_create_image,
};
