'use strict';
const pool = require('../database/db');
const promisePool = pool.promise();

const date = (new Date()).toLocaleString();


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

const getAllPosts = async () => {
  try {
    //const [rows] = await promisePool.execute('SELECT postId, ms_post.file AS postimage FROM ms_post LEFT JOIN ms_user ON ms_post.postId = ms_user.userId');
    const [rows] = await promisePool.execute('SELECT * from ms_post');
    return rows;
  } catch (e) {
    console.error('catModel:', e.message);
  }
};


module.exports = {
  uploadPost,
  getPost,
  getAllPosts,
  uploadPostImage,
};