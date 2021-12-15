'use strict';
const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const { login, user_post } = require('../controllers/authController');

router.post('/login', login);

router.post(
  '/register',
  body('tunnus').isLength({ min: 3 }).escape(),
  body('email').isEmail(),
  user_post
);
/*  body('salasana').matches('(?=.*[A-Z]).{8,}'), */
module.exports = router;