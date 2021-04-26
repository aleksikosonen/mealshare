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

const getAllPosts = async () => {
  try {
    const [rows] = await promisePool.execute('SELECT * from ms_post ORDER BY postId;');
    return rows;
  } catch (e) {
    console.error('catModel:', e.message);
  }
};

const getPostedBy = async () => {
  try {
    const [rows] = await promisePool.execute('SELECT postId, ms_user.username AS Poster FROM ms_post LEFT JOIN ms_user ON ms_post.userId = ms_user.userId;');
    return rows;
  } catch (e) {
    console.error('catModel:', e.message);
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

module.exports = {
  uploadPost,
  getPost,
  getAllPosts,
  uploadPostImage,
  getPostedBy,
  createTags,
};