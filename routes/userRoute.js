'use strict';
// userRoute
const express = require('express');
const { body } = require('express-validator');
const {
  user_list_get,
  user_get,
  user_post,
  checkToken,
  user_put,
  user_delete
} = require('../controllers/userController');
const router = express.Router();

router.get('/token', checkToken);
router.get('/', user_list_get);
router.get('/:id', user_get);

module.exports = router;