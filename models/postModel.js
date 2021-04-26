'use strict';
const pool = require('../database/db');
const promisePool = pool.promise();
const date = new Date().toISOString().slice(0, 19).replace('T', ' ');

const uploadPost = async (req) => {
  try {
    const [rows] = await promisePool.execute('INSERT INTO ms_post (userId, file, caption, hashtags, vst, vet) VALUES (?, ?, ?, ?, ?, ?);',
        [null, req.file.filename, null, null, date, null]);
    return rows.insertId;
  } catch (e) {
    console.error('upload post :', e.message);
    throw new Error('upload failed');
  }
};

const uploadPostImage = async (req) => {
  try {
    const [rows] = await promisePool.execute('INSERT INTO ms_post (userId, file, caption, vst) VALUES (?, ?, ?, ?);',
        [req.user.userId, req.file.filename, req.body.caption, date]);
    return rows.insertId;
  } catch (e) {
    console.error('upload post :', e.message);
    throw new Error('upload failed');
  }
};

const getPost = async (id) => {
  try {
    const [rows] = await promisePool.execute('SELECT * FROM ms_post WHERE postId = ?', [id]);
    return rows[0];
  } catch (e) {
    console.error('postModel getPost :', e.message);
  }
};

const getRecipe = async (id) => {
  try {
    const [rows] = await promisePool.execute('SELECT * FROM ms_recipe WHERE recipeId = ?', [id]);
    return rows[0];
  } catch (e) {
    console.error('postModel getPost :', e.message);
  }
};

const getIngredient = async (id) => {
  try {
    const [rows] = await promisePool.execute('SELECT ingredient, amount, unit FROM ms_ingredient_object WHERE recipeId = ? ORDER BY ingredient_id DESC LIMIT 1', [id]);
    return rows[0];
  } catch (e) {
    console.error('postModel getIngredient :', e.message);
  }
};

const getIngredients = async () => {
  try {
    const [rows] = await promisePool.execute('SELECT * FROM ms_ingredient_object');
    return rows[0];
  } catch (e) {
    console.error('postModel getIngredient :', e.message);
  }
};

const uploadPostRecipe = async (req, id) => {
  try {
    const [rows] = await promisePool.execute('INSERT INTO ms_recipe (postId) VALUES (?);', [id]);
    return rows.insertId;
  } catch (e) {
    console.error('upload recipe :', e.message);
    throw new Error('upload failed');
  }
};

const uploadIngredient = async (req, id) => {
  try {
    const [rows] = await promisePool.execute('INSERT INTO ms_ingredient_object (recipeId, ingredient, unit, amount) VALUES (?, ?, ?, ?);',
        [id, req.body.ingredient, req.body.unit, req.body.amount]);
    return rows.insertId;
  } catch (e) {
    console.error('upload ingredient :', e.message);
    throw new Error('upload failed');
  }
};

const getAllPosts = async () => {
  try {
    const [rows] = await promisePool.execute('SELECT * from ms_post ORDER BY postId');
    return rows;
  } catch (e) {
    console.error('postModel getAllPosts:', e.message);
  }
};

const getAllRecipes = async () => {
  try {
    const [rows] = await promisePool.execute('SELECT * from ms_recipe ORDER BY recipeId');
    return rows;
  } catch (e) {
    console.error('postModel getAllPosts:', e.message);
  }
};

const getPostedBy = async () => {
  try {
    const [rows] = await promisePool.execute('SELECT postId, ms_user.username AS Poster FROM ms_post LEFT JOIN ms_user ON ms_post.userId = ms_user.userId ORDER BY postId DESC LIMIT 1');
    return rows;
  } catch (e) {
    console.error('postmodel getPostedBy:', e.message);
  }
};

module.exports = {
  uploadPost,
  getPost,
  getAllPosts,
  uploadPostImage,
  getPostedBy,
  uploadPostRecipe,
  getRecipe,
  uploadIngredient,
  getAllRecipes,
  getIngredient,
  getIngredients,
};