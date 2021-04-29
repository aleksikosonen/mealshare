'use strict';

const pool = require('../database/db');
const promisePool = pool.promise();
const date = new Date().toISOString().slice(0, 19).replace('T', ' ');

const getUser = async(id) => {
    try{
        const [rows] = await promisePool.execute(`SELECT * FROM ms_user WHERE userId = ?`, [id]);
        return rows;
    }catch(e) {
        console.error('userModel getUser', e.message);
    }
}

const getAllUsers = async () => {
    try {
        const [rows] = await promisePool.execute('SELECT * FROM ms_user');
        return rows;
    } catch (e) {
        console.error('userModel:', e.message);
    }
}

const getAllUsernames = async () => {
    try {
        const [rows] = await promisePool.execute('SELECT username FROM ms_user');
        return rows;
    } catch (e) {
        console.error('userModel:', e.message);
    }
}

const insertUser = async (req) => {
    try{
        const [rows] = await promisePool.execute(
            'INSERT INTO ms_user (username, lname, email, fname, password, avatar, bio, admin, vst, vet) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);',
        [req.username, req.lname, req.email, req.fname, req.password, null, null, false, date ,null]);
        return rows.insertId;
    } catch(e){
        console.error('userModel from insertUser: ', e);
        return 0;
    }
};

const getUserLogin = async (params) => {
    try {
        const [rows] = await promisePool.execute(
            'SELECT * FROM ms_user WHERE username = ?;',
            params);
        return rows;
    } catch (e) {
        console.log('error', e.message);
    }
};

const updateUser = async (id, req) => {
    try {
        const [rows] = await promisePool.execute(
            'UPDATE ms_user SET fname = ?, lname = ?, bio = ? WHERE userId = ?;',
            [req.body.fname, req.body.lname, req.body.bio, id]);
        console.log('userModel update:', rows);
        return rows.affectedRows === 1;
    } catch (e) {
        return false;
    }
};

const updateUsername = async (req) => {
    try {
        const [rows] = await promisePool.execute(
            'UPDATE ms_user SET username = ? WHERE userId = ?;',
            [req.newUsername, req.loggedUser]);
        console.log('userModel update username:', rows);
        console.log('userModel affected rows:', rows.affectedRows);
        return rows.affectedRows === 1;
    } catch (e) {
        return false;
    }
};

const updateEmail = async (req) => {
    try {
        const [rows] = await promisePool.execute(
            'UPDATE ms_user SET email = ? WHERE userId = ?;',
            [req.newEmail, req.loggedUser]);
        console.log('userModel update email:', rows);
        console.log('userModel affected rows:', rows.affectedRows);
        return rows.affectedRows === 1;
    } catch (e) {
        return false;
    }
};

const updatePassword = async (req, id) => {
    try {
        const [rows] = await promisePool.execute(
            'UPDATE ms_user SET password = ? WHERE userId = ?;',
            [req.password, id]);
        console.log('userModel update:', rows);
        return rows.affectedRows === 1;
    } catch (e) {
        return false;
    }
}

const uploadAvatar = async (req) => {
    try {
        const [rows] = await promisePool.execute('UPDATE ms_user set avatar = ? WHERE userId = ?;',
            [req.file.filename, req.params.id]);
        return rows.insertId;
    } catch (e) {
        console.error('upload post :', e.message);
        throw new Error('upload failed');
    }
};

module.exports = {
    getUser,
    insertUser,
    getUserLogin,
    getAllUsers,
    getAllUsernames,
    updateUser,
    updatePassword,
    updateUsername,
    updateEmail,
    uploadAvatar,
};