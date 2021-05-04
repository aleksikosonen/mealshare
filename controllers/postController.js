'use strict';

const postModel = require('../models/postModel');
const {validationResult} = require('express-validator');
const { hash } = require('bcryptjs');
const {makePost} = require('../utils/resize');


const post_list_get = async (req, res) => {
  const posts = await postModel.getAllPosts();
  return res.json(posts);
};

const feed_list_get = async (req, res) => {
  const posts = await postModel.getFeedPosts(req);
  return res.json(posts);
};

const feed_like = async (req, res) => {
  console.log('like', req.params.id, req.user.userId);
  const like = await postModel.likePost(req.params.id, req.user.userId);
  return res.json(like);
}

const post_list_get_postedBy = async (req, res) => {
  const posts = await postModel.getPostedBy();
  return res.json(posts);
};

const post_add_comment = async (req, res) => {
  console.log('add comment ', req.body.comment, req.user.userId);
  const comments = await postModel.addComment(req.params.postId, req.user.userId, req.body.comment);
  return res.json(comments);
};

const post_find_comments = async(req, res) => {
  const comments = await postModel.findComments(req.body);
  return res.json(comments);
}

const post_list_get_ingredients = async (req, res) => {
  const ingredients = await postModel.getRecipe(req.params.id);
  return res.json(ingredients);
};

const post_list_get_all_ingredients = async (req, res) => {
  const ingredients = await postModel.getAllIngredients(req.params.id);
  return res.json(ingredients);
};

const post_delete_last_ingredient = async (req, res) => {
  const ingredients = await postModel.deleteIngredient(req.params.id);
  return res.json(ingredients);
};

const post_list_get_workphases = async (req, res) => {
  const workphases = await postModel.getWorkphase(req.params.id);
  return res.json(workphases);
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

const filterItems = (arr, query) => {
  return arr.filter(el => el.toLowerCase().indexOf(query.toLowerCase()) !== -1)
}

const post_create_image =  async (req, res) => {
  const errors = validationResult(req);
  const stringed = req.body.caption.split(/(\s+)/);
  const hashtags = filterItems(stringed, '#');
  if (!errors.isEmpty()) {
    return res.status(400).json({errors: errors.array()});
  }
  try {
    const id = await postModel.uploadPostImage(req);
    const post = await postModel.getPost(id);

    console.log('image', post);

    if(!(Object.entries(hashtags).length === 0)){
      console.log('sending hashtags ', id," ", hashtags);
      const tags = await postModel.createTags(id, hashtags);
    }
    res.send(post);
  } catch (e) {
    res.status(400).json({error: e.message});
  }
};

const post_add_ingredient = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({errors: errors.array()});
  }
  try {
    const id = await postModel.uploadIngredient(req);
    await postModel.uploadPostIngredients(req, id);
    const ingredient = await postModel.getIngredient(id);
    res.send(ingredient);
  } catch (e) {
    res.status(400).json({error: e.message});
  }
};

const post_add_workphases = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({errors: errors.array()});
  }
  try {
    const id = await postModel.uploadWorkphases(req);
    const workphase = await postModel.getWorkphase(id);
    res.send(workphase);
  } catch (e) {
    res.status(400).json({error: e.message});
  }
};

const post_delete = async (req, res) => {
  try{
    const owner = await postModel.getPost(req.params.id);
    console.log('post_delete ', owner, " trying to delete")
    if (req.user.userId === owner.userId || req.user.admin === 1){
      const deleteOk = await postModel.deletePost(req.params.id);
      res.json(deleteOk);
    }
  }catch(e){
    res.status(403).json({error: e.message});
  }
};

const post_update = async (req, res) => {
  try{
    const owner = await postModel.getPost(req.params.id);
    if(req.user.userId === owner.userId){
      const deleteOk = await postModel.updatePost(req.params.id, req.body.caption);
      res.json(deleteOk);
    }
  }catch(e){
    res.status(403).json({error: e.message});
  }
};

const post_get_likes = async (req, res) => {
  const likes = await postModel.getLikes(req.params.id);
  res.json(likes);
};

const post_get_all_tags = async (req, res) => {
  const tags = await postModel.getAllTags();
  return res.json(tags);
}

const post_get_all_tagRelations = async (req,res) => {
  const tagRelations = await postModel.getTagRelatedPosts(req.body.userInput);
  return res.json(tagRelations)
}

const post_get_all_userRelations = async (req,res) => {
  const userRelations = await postModel.getUserRelatedPosts(req.body.userInput);
  return res.json(userRelations);
}

const make_post = async (req, res, next) => {
  try {
    const post = await makePost(req.file.path, req.file.filename);
    if (post) {
      next();
    }
  } catch (e) {
    res.status(400).json({error: e.message});
  }
};


module.exports = {
  post_create,
  post_list_get,
  post_create_image,
  post_list_get_postedBy,
  feed_list_get,
  post_add_ingredient,
  post_list_get_ingredients,
  post_get_all_tags,
  post_get_all_tagRelations,
  post_add_comment,
  post_find_comments,
  feed_like,
  post_delete,
  post_get_likes,
  post_update,
  post_get_all_userRelations,
  make_post,
  post_add_workphases,
  post_list_get_workphases,
  post_delete_last_ingredient,
  post_list_get_all_ingredients,
};

