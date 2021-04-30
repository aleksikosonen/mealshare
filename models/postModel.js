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
    console.log('upload image', req.file)
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
    const [rows] = await promisePool.execute('select ms_ingredient_object.ingredient, ms_ingredient_object.ingredientId from ms_ingredient_object LEFT JOIN ms_post_ingredients ON ms_ingredient_object.ingredientId = ms_post_ingredients.ingredientId where ms_post_ingredients.postId = ? ORDER BY addOrder DESC LIMIT 1;', [id]);
    return rows[0];
  } catch (e) {
    console.error('postModel getPost :', e.message);
  }
};

const getIngredient = async (id) => {
  try {
    const [rows] = await promisePool.execute('SELECT ingredientId, ingredient FROM ms_ingredient_object WHERE ingredientId = ?', [id]);
    return rows[0];
  } catch (e) {
    console.error('postModel getIngredient :', e.message);
  }
};

const getUnits = async (id) => {
  try {
    const [rows] = await promisePool.execute('select ingredientId from ms_post_ingredients where postId = ?', [id]);
    return rows[0];
  } catch (e) {
    console.error('postModel getIngredient :', e.message);
  }
}

const getIngredients = async () => {
  try {
    const [rows] = await promisePool.execute('SELECT * FROM ms_ingredient_object');
    return rows[0];
  } catch (e) {
    console.error('postModel getIngredient :', e.message);
  }
};

const uploadIngredient = async (req) => {
  try {
    const [rows] = await promisePool.execute('INSERT IGNORE INTO ms_ingredient_object (ingredient) VALUES (?);',
        [req.body.ingredient]);
    if (rows.insertId === 0) {
      console.log('ingredient already exists');
      const [ingId] = await promisePool.execute('SELECT ingredientId from ms_ingredient_object where ingredient = ?',[req.body.ingredient])
      return ingId[0].ingredientId;
    }
    return rows.insertId;
  } catch (e) {
    console.error('upload ingredient :', e.message);
    throw new Error('upload failed');
  }
};

const uploadPostIngredients = async (req, id) => {
  try {
    const [rows] = await promisePool.execute('INSERT INTO ms_post_ingredients (ingredientId, postId, unit, amount) VALUES (?, ?, ?, ?);',
        [id, req.params.id, req.body.unit, req.body.amount]);
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
    console.error('postModel:', e.message);
    console.error('postModel getAllPosts:', e.message);
  }
};

const likePost = async (postId, user) => {
  console.log('likepost ', user);
  try {
    const [rows] = await promisePool.execute('INSERT INTO ms_likes (postId, userId, vst) VALUES (?, ?, ?);',
        [postId, user, date]);
    return rows.insertId;
  } catch (e) {
    console.error('like :', e.message);
    throw new Error('like failed');
  }
}

const getPostedBy = async () => {
  try {
    const [rows] = await promisePool.execute('SELECT postId, ms_user.username AS Poster FROM ms_post LEFT JOIN ms_user ON ms_post.userId = ms_user.userId ORDER BY postId DESC LIMIT 1');
    return rows;
  } catch (e) {
    console.error('postmodel getPostedBy:', e.message);
  }
};


const getAllTags = async () => {
  try{
    const [rows] = await promisePool.execute('SELECT * from ms_hashtags');
    return rows;
  }catch (e) {
    console.error('postModel getAllTags', e.message)
  }
}

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
      } else if (!tag.includes(tags[i][i].tag)){
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

const getTagRelatedPosts = async (input) => {
  try {
    const [rows] = await promisePool.execute('SELECT ms_post.postId, ms_post.file, ms_post.caption, ms_user.userId, ms_user.username as username, ms_user.avatar as avatar, ms_tag_post_relations.postId, ms_tag_post_relations.tagId, ms_hashtags.tagId, ms_hashtags.tag FROM ms_post INNER JOIN ms_user ON ms_post.userId = ms_user.userId INNER JOIN ms_tag_post_relations on ms_post.postId = ms_tag_post_relations.postId INNER JOIN ms_hashtags on ms_tag_post_relations.tagId = ms_hashtags.tagId where ms_hashtags.tag = ? ORDER BY ms_post.postId', [input]);
    return rows;
  } catch (e) {
    console.error('postModel getTagRelatedPosts:', e.message);
  }
};

const addComment = async (postId, userId, comment) => {
 // console.log(postId, " ",userId, " ", comment)
  try{
    const [rows] = await promisePool.execute('INSERT INTO ms_postcomment (userId, postId, comment, vst) values (?, ?, ?, ?);', [userId, postId, comment, date]);
    return rows;
  }catch(e){
    console.error('addcomment, error ', e.message);
  }
}

const findComments = async(postId) => {
  try {
    const comments = [];
    for(let i = 0; i < postId.length; i++){
      const [rows] = await promisePool.execute('SELECT ms_postcomment.userId, ms_postcomment.comment, ms_postcomment.postId, ms_user.username, ms_user.avatar from ms_postcomment left join ms_user on ms_postcomment.userId = ms_user.userId where postId = ? ORDER BY commentId', [postId[i]]);
      comments.push(rows);
    }
    return comments;
  }catch(e){
    console.error('findComments, error ', e.message);
  }
}

const deletePost = async (id) => {
  try {
    const [rows] = await promisePool.execute('DELETE FROM ms_post WHERE postId = ?', [id]);
    return rows.affectedRows === 1;
  } catch (e) {
    console.error('delete Post:', e.message);
  }
};

const updatePost = async (id, caption) => {
  try {
    const [rows] = await promisePool.execute('UPDATE ms_post SET caption = ? WHERE postId = ?;', [caption, id]);
    return rows.affectedRows === 1;
  } catch (e) {
    console.error('delete Post:', e.message);
  }
};

const getLikes = async (id) => {
  try {
    const [rows] = await promisePool.execute('SELECT count(postId) as likes FROM ms_likes WHERE postId = ?;', [id]);
    return rows[0];
  } catch (e) {
    console.error('postModel getLikes :', e.message);
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
  getRecipe,
  uploadIngredient,
  getAllRecipes,
  getIngredient,
  getIngredients,
  getAllTags,
  getTagRelatedPosts,
  addComment,
  findComments,
  getUnits,
  likePost,
  deletePost,
  getLikes,
  updatePost,
  uploadPostIngredients,
};