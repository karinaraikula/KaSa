'use strict';
// catRoute
const passport = require('../utils/pass');
const express = require('express');
const { body } = require('express-validator');
const multer = require('multer');
const fileFilter = (req, file, cb) => {
  if (file.mimetype.includes('image')) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({ dest: './uploads/', fileFilter });
const {
  cat_list_get,
  cat_get,
  cat_post,
  cat_put,
  cat_delete,
} = require('../controllers/catController');
const router = express.Router();


router
  .route('/')
  .get(cat_list_get)
  .post(
    passport.authenticate('jwt', { session: false }),
    upload.single('post'),
    body('Kuvaus').notEmpty().escape(),
    body('Tyyppi').isNumeric(),
    cat_post
  );

router
  .route('/:id')
  .get(cat_get)
  .delete(passport.authenticate('jwt', { session: false }),cat_delete)
  .put(
    passport.authenticate('jwt', { session: false }),
    body('Kuvaus').notEmpty().escape(),
    body('Tyyppi').isNumeric(),
    cat_put
  );

module.exports = router;