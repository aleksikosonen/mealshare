'use strict';

const pool = require('../database/db');
const promisePool = pool.promise();
const date = (new Date().toLocaleString());


const getUser = async(id) => {
    try{
        const [rows] = await promisePool.query(`SELECT * FROM ms_user WHERE userId = ${id}`);
        return rows;
    }catch(e) {
        console.error('error', e.message);
    }
}

const insertUser = async (req) => {
    try{
        console.log('usermodel insert', req.username)
        const [rows] = await promisePool.execute(
            'INSERT INTO ms_user (username, lname, email, fname, password, avatar, bio, admin, vst, vet) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);',
        [req.username, req.lname, req.email, req.fname, req.password, null, null, false, date ,null]);
        console.log('usermodel inserts:',rows)
        return rows.insertId;
    } catch(e){
        console.error('userModel from insertUser: ', e);
        return 0;
    }
};

module.exports = {
    getUser,
    insertUser,
};