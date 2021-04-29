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

module.exports = {
    getUser,
    insertUser,
    getUserLogin,
    getAllUsers,
    getAllUsernames,
};