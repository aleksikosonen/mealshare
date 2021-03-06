/**
 * Js-file for post-related models
 *
 *
 * @Author Aleksi Kytö, Niko Lindborg, Aleksi Kosonen
 * */

'use strict';
const { promise } = require('../database/db');
const pool = require('../database/db');
const promisePool = pool.promise();
const date = new Date().toISOString().slice(0, 19).replace('T', ' ');

const uploadPost = async (req) => {
  //function for uploading images with multer
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
  //function for uploading posts into the database
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
  //function for getting a single post
  try {
    const [rows] = await promisePool.execute('SELECT * FROM ms_post WHERE postId = ?;', [id]);
    return rows[0];
  } catch (e) {
    console.error('postModel getPost :', e.message);
  }
};

const getRecipe = async (id) => {
  //function for getting a recipe
  try {
    const [rows] = await promisePool.execute('select ms_ingredient_object.ingredient, ms_ingredient_object.ingredientId, ms_post_ingredients.unit, ms_post_ingredients.amount, ms_post_ingredients.addOrder from ms_ingredient_object LEFT JOIN ms_post_ingredients ON ms_ingredient_object.ingredientId = ms_post_ingredients.ingredientId where ms_post_ingredients.postId = ? ORDER by ms_post_ingredients.addOrder desc limit 1;', [id]);
    return rows[0];
  } catch (e) {
    console.error('postModel getPost :', e.message);
  }
};

const getAllIngredients = async (id) => {
  //function for getting 1 recipes all ingredients
  try {
    const [rows] = await promisePool.execute('select ms_ingredient_object.ingredient, ms_ingredient_object.ingredientId, ms_post_ingredients.unit, ms_post_ingredients.amount, ms_post_ingredients.addOrder from ms_ingredient_object LEFT JOIN ms_post_ingredients ON ms_ingredient_object.ingredientId = ms_post_ingredients.ingredientId where ms_post_ingredients.postId = ? ORDER by ms_post_ingredients.addOrder;', [id]);
    return rows;
  } catch (e) {
    console.error('postModel getPost :', e.message);
  }
};

const getIngredientOwner = async(id) => {
  //function for finding the owner of a single ingredient
  try{
    const[rows] = await promisePool.execute('SELECT ms_post.userId FROM ms_post INNER JOIN ms_post_ingredients ON ms_post.postId = ms_post_ingredients.postId where ms_post_ingredients.addOrder = ?;',[id]);
    return rows[0];
  }catch(e){
    console.error('postmodel ingredientOwner :', e.message)
  }
};

const deleteIngredient = async (id) => {
  //function for deleting an ingredient
  try {
    const [rows] = await promisePool.execute('delete from ms_post_ingredients where addOrder = ? order by addOrder desc limit 1;', [id]);
    return rows[0];
  } catch (e) {
    console.error('postModel getPost :', e.message);
  }
};

const getIngredient = async (id) => {
  try {
    //function for getting a singular ingredient
    const [rows] = await promisePool.execute('SELECT ingredientId, ingredient FROM ms_ingredient_object WHERE ingredientId = ?', [id]);
    return rows[0];
  } catch (e) {
    console.error('postModel getIngredient :', e.message);
  }
};

const getUnits = async (id) => {
  try {
    //function for getting the units tied to the post
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
    //function for uploading ingredients to database
    const [rows] = await promisePool.execute('INSERT IGNORE INTO ms_ingredient_object (ingredient) VALUES (?);',[req.body.ingredient]);
    if (rows.insertId === 0) {
      const [ingId] = await promisePool.execute('SELECT ingredientId from ms_ingredient_object where ingredient = ?',[req.body.ingredient])
      return ingId[0].ingredientId;
    }
    return rows.insertId;
  } catch (e) {
    console.error('upload ingredient :', e.message);
    throw new Error('upload failed');
  }
};

const uploadWorkphases = async (req) => {
  try {
    //function for uploading workphases into database
    const [rows] = await promisePool.execute('INSERT INTO ms_workphases (postId, phases) VALUES (?, ?);',
        [req.params.id, req.body.workphases]);
    return rows.insertId;
  } catch (e) {
    console.error('upload ingredient :', e.message);
    throw new Error('upload failed');
  }
};

const getWorkphase = async (id) => {
  try {
    //function for getting a single workpahse
    const [rows] = await promisePool.execute('SELECT * FROM ms_workphases WHERE postId = ?;', [id]);
    return rows[0];
  } catch (e) {
    console.error('postModel getPost :', e.message);
  }
}

const getAllWorkphases = async (postIds) => {
  try {
    //function to get workphases to feed
    const matches = [];
    for(let i = 0; i < postIds.length; i++){
      const [rows] = await promisePool.execute('SELECT * FROM ms_workphases WHERE postId = ?;', [postIds[i]]);
      if(rows[0] != null){
        matches.push(rows);
      }
    }
    return matches
  } catch (e) {
    console.error('postModel getAllWorkphases :', e.message);
  }
}

const uploadPostIngredients = async (req, id) => {
  try {
    //function for uploading the "recipe"
    const [rows] = await promisePool.execute('INSERT INTO ms_post_ingredients (ingredientId, postId, unit, amount) VALUES (?, ?, ?, ?);',
        [id, req.params.id, req.body.unit, req.body.amount]);
    return rows.insertId;
  } catch (e) {
    console.error('upload ingredient :', e.message);
    throw new Error('upload failed');
  }
};

const getAllPosts = async (id) => {
  try {
    //function for getting users own posts
    const [rows] = await promisePool.execute('SELECT * from ms_post where userId = ? ORDER BY postId;', [id]);
    return rows;
  } catch (e) {
    console.error('postModel:', e.message);
  }
};

const getFeedPosts = async (req) => {
  try {
    //function for getting the posts that get rendered in feed
    const [rows] = await promisePool.execute('SELECT postId, file, caption, ms_user.userId, ms_user.username as username, ms_user.avatar as avatar FROM ms_post LEFT JOIN ms_user ON ms_post.userId = ms_user.userId ORDER BY postId DESC LIMIT 6 OFFSET ?', [req.params.retrieved]);
    return rows;
  } catch (e) {
    console.error('postModel getAllPosts:', e.message);
  }
};

const likePost = async (postId, user) => {
  try {
    //function where we upload likes into database
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
    //function to find the latest post posted to the site
    const [rows] = await promisePool.execute('SELECT postId, ms_user.username AS Poster FROM ms_post LEFT JOIN ms_user ON ms_post.userId = ms_user.userId ORDER BY postId DESC LIMIT 1');
    return rows;
  } catch (e) {
    console.error('postmodel getPostedBy:', e.message);
  }
};


const getAllTags = async () => {
  try{
    //function to find all hashtags
    const [rows] = await promisePool.execute('SELECT * from ms_hashtags');
    return rows;
  }catch (e) {
    console.error('postModel getAllTags', e.message)
  }
}

const createTags = async (postId, tag) => {
  try{
    //function for creating hashtags
    const tags = [];
    const ids = [];
    const final = [];

    for (let i = 0; i < tag.length; i++){
      const [rows] = await promisePool.execute('SELECT tag from ms_hashtags where tag = ?;', [tag[i]]);
      //check if there are already tags in the database that we have in the requests body
      tags.push(rows);
      if(tags[i].length === 0){
        const [rows] = await promisePool.execute('INSERT INTO ms_hashtags (tag) VALUES (?);',[tag[i]]);
        //insert the new tags into the database
        tags.push(rows);
      }
    }
    for(let i = 0; i < tag.length; i++){
      const [rows] = await promisePool.execute('SELECT tagId from ms_hashtags where tag = ?', [tag[i]]);
      //we get the tagIds from here
      ids.push(rows);
    }

    for(let i = 0; i < tag.length; i++){
      const [rows] = await promisePool.execute('INSERT INTO ms_tag_post_relations (postId, tagId) values (?, ?)', [postId, ids[i][i].tagId]);
      //here we tie the tags to the posts
      final.push(rows);
      return [final, tags];
    }
  }catch(e) {
    console.error('postModel createtags', e.message);
  }
}

const getTagRelatedPosts = async (input) => {
  try {
    //finding posts based on tags with search
    const [rows] = await promisePool.execute('SELECT ms_post.postId, ms_post.file, ms_post.caption, ms_user.userId, ms_user.username as username, ms_user.avatar as avatar, ms_tag_post_relations.postId, ms_tag_post_relations.tagId, ms_hashtags.tagId, ms_hashtags.tag FROM ms_post INNER JOIN ms_user ON ms_post.userId = ms_user.userId INNER JOIN ms_tag_post_relations on ms_post.postId = ms_tag_post_relations.postId INNER JOIN ms_hashtags on ms_tag_post_relations.tagId = ms_hashtags.tagId WHERE ms_hashtags.tag = ?  ORDER BY ms_post.postId DESC', [input]);
    return rows;
  } catch (e) {
    console.error('postModel getTagRelatedPosts:', e.message);
  }
};

const addComment = async (postId, userId, comment) => {
  try{
    //adding comment to the database
    const [rows] = await promisePool.execute('INSERT INTO ms_postcomment (userId, postId, comment, vst) values (?, ?, ?, ?);', [userId, postId, comment, date]);
    return rows;
  }catch(e){
    console.error('addcomment, error ', e.message);
  }
}

const findComments = async(postIds) => {
  try {
    //finding comments from database for index rendering
    const matches = [];
    for (let i = 0; i < postIds.length; i++) {
      const [rows] = await promisePool.execute(
          'SELECT ms_postcomment.userId, ms_postcomment.comment, ms_postcomment.postId, ms_postcomment.commentId, ms_user.username as username, ms_user.avatar as avatar FROM ms_postcomment LEFT JOIN ms_user ON ms_postcomment.userId = ms_user.userId WHERE ms_postcomment.postId = ? ORDER BY commentId',
          [postIds[i]]);
      if (rows[0] != null) {
        matches.push(rows);
      }
    }
    return matches
  }catch(e){
    console.error('findComments, error ', e.message);
  }
}

const deletePost = async (id) => {
  try {
    //deleting post from database
    const [rows] = await promisePool.execute('DELETE FROM ms_post WHERE postId = ?', [id]);
    return rows.affectedRows === 1;
  } catch (e) {
    console.error('delete Post:', e.message);
  }
};

const updatePost = async (id, caption) => {
  try {
    //updating caption of post in database
    const [rows] = await promisePool.execute('UPDATE ms_post SET caption = ? WHERE postId = ?;', [caption, id]);
    return rows.affectedRows === 1;
  } catch (e) {
    console.error('delete Post:', e.message);
  }
};

const getLikes = async (id) => {
  try {
    //finding likes from database for feed rendering
    const likes = [];
    for(let i = 0; i < id.length; i++) {
      const [rows] = await promisePool.execute('SELECT postId, count(postId) as likes  FROM ms_likes WHERE postId = ?;', [id[i].postId]);
      likes.push(rows[0])
    };
    return likes;
  } catch (e) {
    console.error('postModel getLikes :', e.message);
  }
};


const getUserRelatedPosts = async (input) => {
  try {
    //getting posts for search
    const [rows] = await promisePool.execute('SELECT ms_post.postId, ms_post.file, ms_post.caption, ms_user.userId, ms_user.username as username, ms_user.avatar as avatar FROM ms_post INNER JOIN ms_user ON ms_post.userId = ms_user.userId WHERE ms_user.username = ? ORDER BY ms_post.postId DESC', [input]);
    return rows;
  } catch (e) {
    console.error('postModel getUserRelatedPosts:', e.message);
  }
};


const getCommentOwner = async (id) => {
  try{
    //finding commenter from database
    const [rows] = await promisePool.execute('SELECT userId from ms_postcomment where commentId = ?;', [id])
    return rows;
  }catch(e) {
    console.error('postModel getCommentOwner ', e.message)
  }
};

const deleteComment = async (id) => {
  try {
    //delete for comment from database
    const [rows] = await promisePool.execute ('DELETE from ms_postcomment where commentId = ?;', [id]);
    return rows;
  }catch(e){
    console.error('postModel deleteComment ', e.message)
  }
};

const getAllIngredientsFeed = async (postIds) => {
  try {
    //function for getting ingredients for the feed
    const matches = [];
    for(let i = 0; i < postIds.length; i++){
    const [rows] = await promisePool.execute('select ms_ingredient_object.ingredient, ms_ingredient_object.ingredientId, ms_post_ingredients.unit, ms_post_ingredients.amount, ms_post_ingredients.postId , ms_post_ingredients.addOrder from ms_ingredient_object LEFT JOIN ms_post_ingredients ON ms_ingredient_object.ingredientId = ms_post_ingredients.ingredientId WHERE ms_post_ingredients.postId = ? ORDER by ms_post_ingredients.addOrder;', [postIds[i]]);
      if(rows[0] != null){
        matches.push(rows);
      }
  }
  return matches
  } catch (e) {
    console.error('postModel getPost :', e.message);
  }
};

const deleteLike = async(postId, userId) => {
  try{
    //function for deleting a like
    const [rows] = await promisePool.execute('delete from ms_likes where postId = ? AND userId = ?;', [postId, userId]);
    return rows;
  }catch(e){
    console.error('postModel deleteLike: ', e.message);
  }
}

const getSingleLike = async(postId) => {
  try{
    //getting the likes of a singular post
    const [rows] = await promisePool.execute('select count(postId) as likes from ms_likes where postId = ?;', [postId]);
    return rows;
  }catch(e){

  }
}

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
  getUserRelatedPosts,
  uploadWorkphases,
  getWorkphase,
  getAllWorkphases,
  getAllIngredientsFeed,
  deleteIngredient,
  getAllIngredients,
  getIngredientOwner,
  getCommentOwner,
  deleteComment,
  deleteLike,
  getSingleLike
};

