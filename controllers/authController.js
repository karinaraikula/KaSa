'use strict';
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { addUser } = require('../models/userModel');
const { httpError } = require('../utils/errors');
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(12);

const login = (req, res, next) => {
  // TODO: add passport authenticateeeee
  passport.authenticate('local', { session: false }, (err, user, info) => {
    console.log('login info', err, user, info);
    if (err || !user) {
      next(httpError('Invalid username/password', 400));
      return;
    }
    req.login(user, { session: false }, (err) => {
      if (err) {
        next(httpError('Login error', 400));
        return;
      }
      delete user.password;
      const token = jwt.sign(user, process.env.JWT_SECRET);
      return res.json({ user, token });
    });
  })(req, res, next);
};

const user_post = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('user_post validation', errors.array());
    next(httpError('invalid data', 400));
    return;
  }

  try {
    console.log('lomakkeesta', req.body);
    const { tunnus, email, salasana } = req.body;
    // hash password
    const hash = bcrypt.hashSync(salasana, salt);
    const tulos = await addUser(tunnus, email, hash, next);
    if (tulos.affectedRows > 0) {
      res.json({
        message: 'user added',
        UserID: tulos.insertId,
      });
    } else {
      next(httpError('No user inserted', 400));
    }
  } catch (e) {
    console.log('user_post error', e.message);
    next(httpError('internal server error', 500));
  }
};

module.exports = {
  login,
  user_post,
};