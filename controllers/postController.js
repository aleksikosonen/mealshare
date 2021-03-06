/**
 * Js-file for post-related controllers
 *
 *
 * @Author Aleksi Kytö, Niko Lindborg, Aleksi Kosonen
 * */

'use strict';

const postModel = require('../models/postModel');
const {validationResult} = require('express-validator');
const { hash } = require('bcryptjs');
const {makePost} = require('../utils/resize');
const { json } = require('express');

const post_list_get = async (req, res) => {
  try{
    //function for getting users posts own posts
    const posts = await postModel.getAllPosts(req.user.userId);
    return res.json(posts);
  }catch(e){
    return res.status(400).json({error: e.message});
  }
};

const feed_list_get = async (req, res) => {
  try{
    //getting the posts for the front page feed
    const posts = await postModel.getFeedPosts(req);
    return res.json(posts);
  }catch(e){
    return res.status(400).json({error: e.message});
  }
};

const feed_like = async (req, res) => {
  try{
    //function for adding likes to posts
    const like = await postModel.likePost(req.params.id, req.user.userId);
    return res.json(like);
  }catch(e){
    return res.status(400).json({error: e.message});
  }
};

const post_list_get_postedBy = async (req, res) => {
  try{
    //function for getting the person who posted the post
    const posts = await postModel.getPostedBy();
    return res.json(posts);
  }catch(e){
    return res.status(400).json({error: e.message});
  }
};

const post_add_comment = async (req, res) => {
  try{
    //function for adding a comment
    const comments = await postModel.addComment(req.params.postId, req.user.userId, req.body.comment);
    return res.json(comments);
  }catch(e){
    return res.status(400).json({error: e.message});
  }
};

const post_find_comments = async(req, res) => {
  try{
    //function for finding comments
    const comments = await postModel.findComments(req.body);
    return res.json(comments);
  }catch(e){
    return res.status(400).json({error: e.message});
  }
};

const post_list_get_ingredients = async (req, res) => {
  try{
    //function for getting ingredients
    const ingredients = await postModel.getRecipe(req.params.id);
    return res.json(ingredients);
  }catch(e){
    return res.status(400).json({error: e.message});
  }
};

const post_list_get_all_ingredients = async (req, res) => {
  try{
    //function for getting ingredients
    const ingredients = await postModel.getAllIngredients(req.params.id);
    return res.json(ingredients);
  }catch(e){
    return res.status(400).json({error: e.message});
  }
};

const post_delete_ingredient = async (req, res) => {
  try{
    //function for deleting an ingredient
    const owner = await postModel.getIngredientOwner(req.params.id);
    if(req.user.userId = owner.userId){
      const ingredients = await postModel.deleteIngredient(req.params.id);
      return res.json(ingredients);
   }
  }catch(e){
    return res.status(400).json({error: e.message});
  }
};

const post_list_get_workphases = async (req, res) => {
  try{
    //function for getting workphases
    const workphases = await postModel.getWorkphase(req.params.id);
    return res.json(workphases);
  }catch(e){
    return res.status(400).json({error: e.message});
  }
};

const post_list_get_all_workphases = async (req, res) => {
  try{
    //function for getting all workphases to feed
    const allWorkphases = await postModel.getAllWorkphases(req.body);
    return res.json(allWorkphases);
  }catch(e){
    return res.status(400).json({error: e.message});
  }
};

const post_list_get_all_ingredients_feed = async (req, res) => {
  try{
    const ingredients = await postModel.getAllIngredientsFeed(req.body);
    return res.json(ingredients);
  }catch(e) {
    return res.status(400).json({error: e.message});
  }
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
  //function used in the next functions hashtag digging
  return arr.filter(el => el.toLowerCase().indexOf(query.toLowerCase()) !== -1)
};

const post_create_image =  async (req, res) => {
  //function for creating post
  const errors = validationResult(req);
  const stringed = req.body.caption.split(/(\s+)/);
  const hashtags = filterItems(stringed, '#');
  if (!errors.isEmpty()) {
    return res.status(400).json({errors: errors.array()});
  }
  try {
    const id = await postModel.uploadPostImage(req);
    const post = await postModel.getPost(id);
    if(!(Object.entries(hashtags).length === 0)){
      //if the caption has hashtags, create new hashtags to database
      const tags = await postModel.createTags(id, hashtags);
    }
    res.send(post);
  } catch (e) {
    res.status(400).json({error: e.message});
  }
};

const post_add_ingredient = async (req, res) => {
  //function for adding an ingredient
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
  //function for adding a workphase
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
  //function for deleting a post
  try{
    const owner = await postModel.getPost(req.params.id);
    if (req.user.userId === owner.userId || req.user.admin === 1){
      //check if its the users own post, or if the user is an admin
      const deleteOk = await postModel.deletePost(req.params.id);
      res.json(deleteOk);
    }
  }catch(e){
    res.status(403).json({error: e.message});
  }
};

const post_update = async (req, res) => {
  //function for updating the posts caption
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
  //function for getting likes
  try{
    const likes = await postModel.getLikes(req.body);
    res.json(likes);
  }catch(e){
    res.status(400).json({error: e.message});
  }
};

const post_get_all_tags = async (req, res) => {
  //function for getting all tags
  try{
    const tags = await postModel.getAllTags();
    return res.json(tags);
  }catch(e){
    res.status(400).json({error: e.message});
  }
};

const post_get_all_tagRelations = async (req,res) => {
  try{
    //function for getting tag relations
    const tagRelations = await postModel.getTagRelatedPosts(req.body.userInput);
    return res.json(tagRelations)
  }catch(e){
    res.status(400).json({error: e.message});
  }
};

const post_get_all_userRelations = async (req,res) => {
  try{
    //function for getting user relations
    const userRelations = await postModel.getUserRelatedPosts(req.body.userInput);
    return res.json(userRelations);
  }catch(e){
    res.status(400).json({error: e.message});
  }
}

const make_post = async (req, res, next) => {
  try {
    //function for uploading images
    const post = await makePost(req.file.path, req.file.filename);
    if (post) {
      next();
    } 
  } catch (e) {
    res.status(400).json({error: e.message});
  }
};

const comment_delete = async (req, res) => {
  try{
    //function for deleting comments
    const ownerId = await postModel.getCommentOwner(req.params.id);
    if(req.user.admin === 1 || req.user.userId === ownerId[0].userId){
      //check if the user is admin or the owner of the post
      const deleteOk = postModel.deleteComment(req.params.id);
      res.json(deleteOk);
    }
  }catch(e){
    res.status(400).json({error: e.message});
  }
};

const delete_like = async (req, res) => {
  try{
    //function for deleting users own likes
    const deleteLikes = await postModel.deleteLike(req.params.id, req.user.userId);
    res.json(deleteLikes);
  }catch(e){
    res.status(400).json({error: e.message});
  }
};

const get_single_like = async (req, res) => {
  try{
    //function for getting a single posts likes
    const getSingleLike = await postModel.getSingleLike(req.params.id);
    res.json(getSingleLike);
  }catch(e){
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
  post_delete_ingredient,
  post_list_get_all_workphases,
  post_list_get_all_ingredients_feed,
  post_list_get_all_ingredients,
  comment_delete,
  delete_like,
  get_single_like,
};

