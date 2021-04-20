'use strict';

const pool = require('../database/db');
const promisePool = pool.promise();

const getUser = async(id) => {
    try{
        const [rows] = await promisePool.query(`SELECT * FROM ms_user WHERE userId = ${id}`);
        return rows;
    }catch(e) {
        console.error('error', e.message);
    }
}

const getAllUsers = async () => {
    try {
        const [rows] = await promisePool.execute('SELECT * FROM ms_user');
        return rows;
    } catch (e) {
        console.error('userModel:', e.message);
    }
};

module.exports = {
    getUser,
    getAllUsers,
};