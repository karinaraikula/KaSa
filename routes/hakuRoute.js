'use strict';
// hakuRoute
const express = require('express');
const { body } = require('express-validator');

const {
  haku_get
} = require('../controllers/hakuController');

const router = express.Router();

router
  .route('/')
  .get(haku_get)


module.exports = router;