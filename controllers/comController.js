'use strict';
const { validationResult } = require('express-validator');
// comController
const {
  getAllComs,
  getCom,
  addCom,
  deleteCom,
} = require('../models/comModel');
const { httpError } = require('../utils/errors');

const com_list_get = async (req, res, next) => {
  try {
    const coms = await getAllComs(next);
    console.log('coms',coms);  
    if (coms.length > 0) {
      res.json(coms);
    } else {
      next(httpError('No coms found', 404));
    } 
  } catch (e) {
    console.log('com_list_get error', e.message);
    next(httpError('internal server error', 500));
  }
};

const com_get = async (req, res, next) => {
  try {
    const vastaus = await getCom(req.params.id, next);
    if (vastaus.length > 0) {
      console.log(vastaus);
      res.json(vastaus);
    } else {
      next(httpError('No com found', 404));
    }
  } catch (e) {
    console.log('com_get error', e.message);
    next(httpError('internal server error', 500));
  }
};

const com_post = async (req, res, next) => {
  console.log('com_post', req.body, req.file, req.user);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('com_post validation', errors.array());
    next(httpError('invalid data', 400));
    return;
  }
  try {
    const { Sisalto, PostID } = req.body;
    const tulos = await addCom(
      Sisalto,
      PostID,
      req.user.UseriID,
      next
    );

    if (thumb) {
      if (tulos.affectedRows > 0) {
        res.json({
          message: 'Kommentti lisätty',
          KommenttiID: tulos.insertId,
        });
      } else {
        next(httpError('No com inserted', 400));
      }
    }
  } catch (e) {
    console.log('com_post error', e.message);
    next(httpError('internal server error', 500));
  }
};

const com_delete = async (req, res, next) => {
  console.log('com_delete', req.body, req.user, req.params);
  try {
    const vastaus = await deleteCom(
      req.params.id,
      req.user.UseriID,
      req.user.Oikeus,
      next
    );
    if (vastaus.affectedRows > 0) {
      res.json({
        message: 'Kommentti poistettu',
        KommenttiID: vastaus.insertId,
      });
    } else {
      next(httpError('No com found', 404));
    }
  } catch (e) {
    console.log('com_delete error', e.message);
    next(httpError('internal server error', 500));
  }
};

module.exports = {
  com_list_get,
  com_get,
  com_post,
  com_delete,
};