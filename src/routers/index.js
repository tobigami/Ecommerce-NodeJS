'use strict';

const express = require('express');
const { apiKey, permission } = require('../auth/checkAuth');
const router = express.Router();

// create api key
router.get(
    '/v1/api/create-api-key',
    require('../services/apikey.service').creatApiKey
);

console.log('123');

// check api key
router.use(apiKey);
// check permission
router.use(permission('0000'));

router.use('/v1/api', require('./access'));
router.use('/v1/api/product', require('./product'));

module.exports = router;
