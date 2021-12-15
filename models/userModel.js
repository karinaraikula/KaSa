'use strict';
const pool = require('../database/db');
const { httpError } = require('../utils/errors');
const promisePool = pool.promise();

const getAllUsers = async (next) => {
  try {
    const [rows] = await promisePool.execute(
      'SELECT UseriID, Tunnus, Email, Oikeus FROM Useri'
    );
    return rows;
  } catch (e) {
    console.error('getAllUsers error', e.message);
    next(httpError('Database error', 500));
  }
};

const getUser = async (id, next) => {
  try {
    const [rows] = await promisePool.execute(
      'SELECT UseriID, Tunnus, Email, Oikeus FROM Useri WHERE UseriID = ?',
      [id]
    );
    return rows;
  } catch (e) {
    console.error('getUser error', e.message);
    next(httpError('Database error', 500));
  }
};

const addUser = async (Tunnus, Email, Salasana, next) => {
  try {
    const [rows] = await promisePool.execute(
      'INSERT INTO Useri (Tunnus, Email, Salasana) VALUES (?, ?, ?)',
      [Tunnus, Email, Salasana]
    );
    return rows;
  } catch (e) {
    console.error('addUser error', e.message);
    next(httpError('Database error', 500));
  }
};

const getUserLogin = async (params) => {
  try {
    console.log('getUserLogin', params);
    const [rows] = await promisePool.execute(
      'SELECT * FROM Useri WHERE Email = ?;',
      params
    );
    return rows;
  } catch (e) {
    console.log('getUserLogin error', e.message);
    next(httpError('Database error', 500));
  }
};


module.exports = {
  getAllUsers,
  getUser,
  addUser,
  getUserLogin,
};