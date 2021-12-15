'use strict';
const pool = require('../database/db');
const { httpError } = require('../utils/errors');
const promisePool = pool.promise();

const getAllCats = async (next) => {
  try {
    const [rows] = await promisePool.execute(`
    SELECT 
    PostID, 
    Filename,
    Kuvaus,
    Tyyppi,
    Aikaleima,
    Postaaja, 
    Useri.Tunnus as Kayttajanimi,
    Tyypit.Tyyppiluokka as Posttyyppi
    FROM Post
    JOIN Useri ON 
    Postaaja = Useri.UseriID
    JOIN Tyypit ON
    Tyyppi = Tyypit.TyyppiID`);
    return rows;
  } catch (e) {
    console.error('getAllCats error', e.message);
    next(httpError('Database error', 500));
  }
};

const getCat = async (id, next) => {
  try {
    const [rows] = await promisePool.execute(
    `
	  SELECT 
	  PostID, 
	  Filename, 
	  Kuvaus,  
	  Tyyppi,
    Aikaleima,
    Postaaja,
	  Useri.Tunnus as Kayttajanimi
	  FROM Post 
	  JOIN Useri ON 
	  Postaaja = Useri.UseriID
	  WHERE PostID = ?`,
      [id]
    );
    return rows;
  } catch (e) {
    console.error('getCat error', e.message);
    next(httpError('Database error', 500));
  }
};

const addCat = async (Filename, Kuvaus, Tyyppi, Postaaja, next) => {
  try {
    const [rows] = await promisePool.execute(
      'INSERT INTO Post (Filename, Kuvaus, Tyyppi, Postaaja) VALUES (?, ?, ?, ?)',
      [Filename, Kuvaus, Tyyppi, Postaaja]
    );
    return rows;
  } catch (e) {
    console.error('addCat error', e.message);
    next(httpError('Database error', 500));
  }
};

const modifyCat = async (
  Kuvaus,
  Tyyppi,
  Postaaja,
  PostID,
  Oikeus,
  next
) => {
  let sql =
    'UPDATE Post SET Kuvaus = ?, Tyyppi = ? WHERE PostID = ? AND Postaaja = ?;';
  let params = [Kuvaus, Tyyppi, PostID, Postaaja];
  if (Oikeus === 0) {
    sql =
      'UPDATE Post SET Kuvaus = ?, Tyyppi = ?, Postaaja = ? WHERE PostID = ?;';
    params = [Kuvaus, Tyyppi, Postaaja, PostID];
  }
  console.log('sql', sql);
  try {
    const [rows] = await promisePool.execute(sql, params);
    return rows;
  } catch (e) {
    console.error('modifyCat error', e.message);
    next(httpError('Database error', 500));
  }
};

const deleteCat = async (id, Postaaja_id, Oikeus, next) => {
  let sql = 'DELETE FROM Post WHERE PostID = ? AND Postaaja = ?';
  let params = [id, Postaaja_id];
  if (Oikeus === 0) {
    sql = 'DELETE FROM Post WHERE PostID = ?';
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
  getAllCats,
  getCat,
  addCat,
  modifyCat,
  deleteCat,
};