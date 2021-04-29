'use strict';

const postModel = require('../models/postModel');
const {validationResult} = require('express-validator');
const { hash } = require('bcryptjs');

const post_list_get = async (req, res) => {
  const posts = await postModel.getAllPosts();
  return res.json(posts);
};

const feed_list_get = async (req, res) => {
  const posts = await postModel.getFeedPosts(req);
  return res.json(posts);
};

const feed_like = async (req, res) => {
  console.log('like', req.params.id, req.params.user);
  const like = await postModel.likePost(req.params.id, req.params.user);
  return res.json(like);
}

const post_list_get_postedBy = async (req, res) => {
  const posts = await postModel.getPostedBy();
  return res.json(posts);
};

const post_list_get_all_recipes = async (req, res) => {
  const recipes = await postModel.getAllRecipes();
  return res.json(recipes);
}

const post_add_comment = async (req, res) => {
  console.log('add comment ', req.body.comment);
  const comments = await postModel.addComment(req.params.postId, req.params.commenter, req.body.comment);
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

const post_create_recipe = async (req, res) => {
  console.log('controller req', req.params);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({errors: errors.array()});
  }
  try {
    const id = await postModel.uploadPostRecipe(req, req.params.id);
    const post = await postModel.getRecipe(id);
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

const post_get_all_tags = async (req, res) => {
  const tags = await postModel.getAllTags();
  return res.json(tags);
}

const post_get_all_tagRelations = async (req,res) => {
  const tagRelations = await postModel.getTagRelatedPosts(req.body.userInput);
  return res.json(tagRelations)
}

module.exports = {
  post_create,
  post_list_get,
  post_create_image,
  post_list_get_postedBy,
  feed_list_get,
  post_create_recipe,
  post_add_ingredient,
  post_list_get_all_recipes,
  post_list_get_ingredients,
  post_get_all_tags,
  post_get_all_tagRelations,
  post_add_comment,
  post_find_comments,
  feed_like,
};
