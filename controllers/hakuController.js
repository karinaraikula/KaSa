'use strict';
const { validationResult } = require('express-validator');
// hakuController
const {
  getHaku
} = require('../models/hakuModel');
const { httpError } = require('../utils/errors');


const haku_get = async (req, res, next) => {
    try {
      const vastaus = await getHaku(req.query.hakusana, next);
      console.log(vastaus);
      if (vastaus.length > 0) {
        res.json(vastaus);
      } else {
        next(httpError('No haku found', 404));
      }
    } catch (e) {
      console.log('haku_get error', e.message);
      next(httpError('internal server error', 500));
    }
  };

  module.exports = {
    haku_get
  };