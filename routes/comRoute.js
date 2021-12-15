
'use strict';
// comRoute
const passport = require('../utils/pass'); //Onko tämä tarpeellinen?
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
  com_list_get,
  com_get,
  com_post,
  com_delete,
} = require('../controllers/comController');
const router = express.Router();


router
  .route('/')
  .get(com_list_get)
  .post(
    passport.authenticate('jwt', { session: false }),
    body('Sisalto').notEmpty().escape(),
    com_post
  );

router
  .route('/:id')
  .get(com_get)
  .delete( passport.authenticate('jwt', { session: false }), com_delete)

module.exports = router;