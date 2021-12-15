'use strict';
const { validationResult } = require('express-validator');
// catController
const {
  getAllCats,
  getCat,
  addCat,
  modifyCat,
  deleteCat,
} = require('../models/catModel');
const { httpError } = require('../utils/errors');
const { getCoordinates } = require('../utils/imageMeta');
const { makeThumbnail } = require('../utils/resize');

const cat_list_get = async (req, res, next) => {
  try {
    const cats = await getAllCats(next);
    /*console.log('cats',cats);*/
    if (cats.length > 0) {
      res.json(cats);
    } else {
      next(httpError('No cats found', 404));
    } 
  } catch (e) {
    console.log('cat_list_get error', e.message);
    next(httpError('internal server error', 500));
  }
};

const cat_get = async (req, res, next) => {
  try {
    const vastaus = await getCat(req.params.id, next);
    if (vastaus.length > 0) {
      res.json(vastaus.pop());
    } else {
      next(httpError('No cat found', 404));
    }
  } catch (e) {
    console.log('cat_get error', e.message);
    next(httpError('internal server error', 500));
  }
};

const cat_post = async (req, res, next) => {
  console.log('cat_post', req.body, req.file, req.user);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('cat_post validation', errors.array());
    next(httpError('invalid data', 400));
    return;
  }

  if (!req.file) {
    const err = httpError('file not valid', 400);
    next(err);
    return;
  }

  try {
    const thumb = await makeThumbnail(
      req.file.path,
      './thumbnails/' + req.file.filename
    );
    const { Kuvaus, Tyyppi } = req.body;
    const tulos = await addCat(
      req.file.filename,
      Kuvaus,
      Tyyppi,
      req.user.UseriID,
      next
    );


    if (thumb) {
      if (tulos.affectedRows > 0) {
        res.json({
          message: 'cat added',
          PostID: tulos.insertId,
        });
      } else {
        next(httpError('No cat inserted', 400));
      }
    }
  } catch (e) {
    console.log('cat_post error', e.message);
    next(httpError('internal server error', 500));
  }
};

const cat_put = async (req, res, next) => {
  console.log('cat_put', req.body, req.params);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('cat_put validation', errors.array());
    next(httpError('invalid data', 400));
    return;
  }
  // pvm VVVV-KK-PP esim 2010-05-28
  try {
    const { Kuvaus, Tyyppi } = req.body;
    /*let Postaaja = req.user.UseriID;
    if (req.user.Oikeus === 0) {
      Postaaja = req.body.Postaaja;
    }*/

    const Postaaja = req.user.Oikeus === 0 ? req.body.Postaaja : req.user.UseriID;

    const tulos = await modifyCat(
      Kuvaus,
      Tyyppi,
      Postaaja,
      req.params.id,
      req.user.Oikeus,
      next
    );
    if (tulos.affectedRows > 0) {
      res.json({
        message: 'cat modified',
        PostID: tulos.insertId,
      });
    } else {
      next(httpError('No cat modified', 400));
    }
  } catch (e) {
    console.log('cat_put error', e.message);
    next(httpError('internal server error', 500));
  }
};

const cat_delete = async (req, res, next) => {
  try {
    const vastaus = await deleteCat(
      req.params.id,
      req.user.UseriID,
      req.user.Oikeus,
      next
    );
    if (vastaus.affectedRows > 0) {
      res.json({
        message: 'cat deleted',
        cat_id: vastaus.insertId,
      });
    } else {
      next(httpError('No cat found', 404));
    }
  } catch (e) {
    console.log('cat_delete error', e.message);
    next(httpError('internal server error', 500));
  }
};

module.exports = {
  cat_list_get,
  cat_get,
  cat_post,
  cat_put,
  cat_delete,
};