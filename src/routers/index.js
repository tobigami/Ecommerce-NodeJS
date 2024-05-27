'use strict';

const express = require('express');
const router = express.Router();
const { apiKey, permission } = require('../auth/checkAuth');
const { pushLogToDiscord } = require('../middlewares');

// create api key
router.get('/v1/api/create-api-key', require('../services/apikey.service').createApiKey);

// push log to discord
router.use(pushLogToDiscord);

// check api key
router.use(apiKey);
// check permission
router.use(permission('0000'));

router.use('/v1/api/checkout', require('./checkout'));
router.use('/v1/api/product', require('./product'));
router.use('/v1/api/discount', require('./discount'));
router.use('/v1/api/cart', require('./cart'));
router.use('/v1/api/comment', require('./comment'));

router.use('/v1/api', require('./access'));

module.exports = router;
