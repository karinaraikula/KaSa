'use strict';
const pool = require('../database/db');
const { httpError } = require('../utils/errors');
const promisePool = pool.promise();

const getHaku = async (input, next) => {
  console.log(`SELECT 
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
	  Tyyppi = Tyypit.TyyppiID
	  WHERE Kuvaus LIKE %${input}%`);
  try {
    const [rows] = await promisePool.execute(
    `SELECT 
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
	  Tyyppi = Tyypit.TyyppiID
	  WHERE Kuvaus LIKE 
	  ?`,
      [`%${input}%`]
    );
    return rows;
  } catch (e) {
    console.error('getCat error', e.message);
    next(httpError('Database error', 500));
  }
};

  module.exports = {
    getHaku
  };