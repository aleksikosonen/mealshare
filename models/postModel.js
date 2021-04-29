'use strict';
const { promise } = require('../database/db');
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
    const [rows] = await promisePool.execute('SELECT * FROM ms_post WHERE postId = ?;', [id]);
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
    const [rows] = await promisePool.execute('SELECT * from ms_post ORDER BY postId;');
    return rows;
  } catch (e) {
    console.error('postModel:', e.message);
  }
};

const getFeedPosts = async (req) => {
  try {
    const [rows] = await promisePool.execute('SELECT postId, file, caption, ms_user.userId, ms_user.username as username, ms_user.avatar as avatar FROM ms_post LEFT JOIN ms_user ON ms_post.userId = ms_user.userId ORDER BY postId DESC LIMIT 6 OFFSET ?', [req.params.retrieved]);
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


const createTags = async (postId, tag) => {
  try{
    const tags = [];
    const ids = [];
    const final = [];

    for (let i = 0; i < tag.length; i++){
      const [rows] = await promisePool.execute('SELECT tag from ms_hashtags where tag = ?;', [tag[i]]);
      tags.push(rows)
      if(tags[i].length === 0){
        const [rows] = await promisePool.execute('INSERT INTO ms_hashtags (tag) VALUES (?);',[tag[i]]);
          tags.push(rows);
        }else if (!tag.includes(tags[i][i].tag)){
          const [rows] = await promisePool.execute('INSERT INTO ms_hashtags (tag) VALUES (?);',[tag[i]]);
          tags.push(rows);
      }
    }
    for(let i = 0; i < tag.length; i++){
      const [rows] = await promisePool.execute('SELECT tagId from ms_hashtags where tag = ?', [tag[i]]);
      ids.push(rows);
    }

    for(let i = 0; i < tag.length; i++){
      console.log('insert id, ', ids)
      const [rows] = await promisePool.execute('INSERT INTO ms_tag_post_relations (postId, tagId) values (?, ?)', [postId, ids[i][i].tagId]);
      final.push(rows);
      console.log('rows ', final[i])
      return [final, tags];
    }
  }catch(e) {
    console.error('postModel createtags', e.message);
  }
}

const getAllTags = async () => {
  try{
    const [rows] = await promisePool.execute('SELECT * from ms_hashtags');
    return rows;
  }catch (e) {
    console.error('postModel getAllTags', e.message)
  }
}

const getTagRelatedPosts = async (input) => {
  try {
    const [rows] = await promisePool.execute('SELECT ms_post.postId, ms_post.file, ms_post.caption, ms_user.userId, ms_user.username as username, ms_user.avatar as avatar, ms_tag_post_relations.postId, ms_tag_post_relations.tagId, ms_hashtags.tagId, ms_hashtags.tag FROM ms_post INNER JOIN ms_user ON ms_post.userId = ms_user.userId INNER JOIN ms_tag_post_relations on ms_post.postId = ms_tag_post_relations.postId INNER JOIN ms_hashtags on ms_tag_post_relations.tagId = ms_hashtags.tagId where ms_hashtags.tag = ? ORDER BY ms_post.postId', [input]);
    return rows;
  } catch (e) {
    console.error('postModel getTagRelatedPosts:', e.message);
  }
};

module.exports = {
  uploadPost,
  getPost,
  getAllPosts,
  uploadPostImage,
  getPostedBy,
  getFeedPosts,
  createTags,
  uploadPostRecipe,
  getRecipe,
  uploadIngredient,
  getAllRecipes,
  getIngredient,
  getIngredients,
  getAllTags,
  getTagRelatedPosts,
};