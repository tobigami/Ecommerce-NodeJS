'use strict';

const express = require('express');
const router = express.Router();
const { apiKey, permission } = require('../auth/checkAuth');
const { pushLogToDiscord } = require('../middlewares');

// push log to discord
router.use(pushLogToDiscord);

// create api key
router.get('/v1/api/create-api-key', require('../services/apikey.service').createApiKey);
router.use('/v1/api/ipa', require('./ipa'));
router.use('/v1/api/test', require('./test'));
router.use('/v1/api/tarot', require('./tarot.routes'));

// check api key
router.use(apiKey);
// check permission
router.use(permission('0000'));

router.use('/v1/api/checkout', require('./checkout.route'));
router.use('/v1/api/product', require('./product'));
router.use('/v1/api/discount', require('./discount'));
router.use('/v1/api/cart', require('./cart'));
router.use('/v1/api/comments', require('./comment'));
router.use('/v1/api/notification', require('./notification'));
router.use('/v1/api/upload', require('./upload'));
router.use('/v1/api', require('./access'));

module.exports = router;
