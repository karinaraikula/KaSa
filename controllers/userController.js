'use strict';
const { validationResult } = require('express-validator');
// userController
const { getAllUsers, getUser, addUser, modifyUser, deleteUser} = require('../models/userModel');
const { httpError } = require('../utils/errors');

const user_list_get = async (req, res, next) => {
  try {
    const users = await getAllUsers(next);
    if (users.length > 0) {
      res.json(users);
    } else {
      next('No users found', 404);
    }
  } catch (e) {
    console.log('user_list_get error', e.message);
    next(httpError('internal server error', 500));
  }
};

const user_get = async (req, res, next) => {
  try {
    const vastaus = await getUser(req.params.id, next);
    if (vastaus.length > 0) {
      res.json(vastaus.pop());
    } else {
      next(httpError('No user found', 404));
    }
  } catch (e) {
    console.log('user_get error', e.message);
    next(httpError('internal server error', 500));
  }
};

const checkToken = (req, res, next) => {
  if (!req.user) {
    next(new Error('token not valid'));
  } else {
    res.json({ user: req.user });
  }
};


const user_put = async (req, res, next) => {
  console.log('user_put', req.body, req.params);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('user_put validation', errors.array());
    next(httpError('invalid data', 400));
    return;
  }
  try {
    const { Tunnus, Email, Salasana } = req.body;

    const Kayttaja = req.user.Oikeus === 0 ? req.body.Tunnus : req.user.UseriID;

    const tulos = await modifyUser(
      Tunnus,
      Email,
      Salasana,
      Kayttaja,
      req.params.id,
      req.user.Oikeus,
      next
    );
    if (tulos.affectedRows > 0) {
      res.json({
        message: 'user modified',
        UseriID: tulos.insertId,
      });
    } else {
      next(httpError('No user modified', 400));
    }
  } catch (e) {
    console.log('user_put error', e.message);
    next(httpError('internal server error', 500));
  }
};

const user_delete = async (req, res, next) => {
  try {
    const vastaus = await deleteCat(
      req.params.id,
      req.user.UseriID,
      req.user.Oikeus,
      next
    );
    if (vastaus.affectedRows > 0) {
      res.json({
        message: 'User deleted',
        cat_id: vastaus.insertId,
      });
    } else {
      next(httpError('No user found', 404));
    }
  } catch (e) {
    console.log('user_delete error', e.message);
    next(httpError('internal server error', 500));
  }
};

module.exports = {
  user_list_get,
  user_get,
  checkToken,
  user_put,
  user_delete
};