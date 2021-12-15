'use strict';
const pool = require('../database/db');
const { httpError } = require('../utils/errors');
const promisePool = pool.promise();

const getAllComs = async (next) => {
  try {
    const [rows] = await promisePool.execute(`
    SELECT 
    KommenttiID, 
    Sisalto,
    Kommenttiaika,
    PostausID,
    KayttajaID,
    Useri.Tunnus as Kommentoija
    FROM Kommentti
    JOIN Post ON
    PostausID = Post.PostID
    JOIN Useri ON
    KayttajaID = Useri.UseriID`);
    return rows;
  } catch (e) {
    console.error('getAllComs error', e.message);
    next(httpError('Database error', 500));
  }
};

const getCom = async (id, next) => {
  try {
    const [rows] = await promisePool.execute(
    `
    SELECT 
	  KommenttiID, 
	  Sisalto,
    Kommenttiaika,
    PostausID,
    KayttajaID,
    Useri.Tunnus as Kommentoija
	  FROM Kommentti
	  JOIN Post ON 
	  PostausID = Post.PostID
    JOIN Useri ON
    KayttajaID = Useri.UseriID
    WHERE PostID = ?`,
      [id]
    );
    return rows;
  } catch (e) {
    console.error('getCom error', e.message);
    next(httpError('Database error', 500));
  }
};

const addCom = async (Sisalto, PostausID, KayttajaID, next) => {
  try {
    const [rows] = await promisePool.execute(
      'INSERT INTO Kommentti (Sisalto, PostausID, KayttajaID) VALUES (?, ?, ?)',
      [Sisalto, PostausID, KayttajaID]
    );
    return rows;
  } catch (e) {
    console.error('addCom error', e.message);
    next(httpError('Database error', 500));
  }
};


const deleteCom = async (id, KayttajaID_id, Oikeus, next) => {
  let sql = 'DELETE FROM Kommentti WHERE KommenttiID = ? AND KayttajaID = ?';
  let params = [id, KayttajaID_id];
  if (Oikeus === 0) {
    sql = 'DELETE FROM Kommentti WHERE KommenttiID = ?';
    params = [id];
  }
  try {
    const [rows] = await promisePool.execute(sql, params);
    return rows;
  } catch (e) {
    console.error('getCat error', e.message);
    next(httpError('Database error', 500));
  }
};

module.exports = {
  getAllComs,
  getCom,
  addCom,
  deleteCom,
};