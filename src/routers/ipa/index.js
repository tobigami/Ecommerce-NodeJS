const express = require('express');
const router = new express.Router();

const asyncHandler = require('../../helper/asyncHandler');
const IpaController = require('../../controllers/ipa.controller');

// download with stream
router.post('/get', asyncHandler(IpaController.getIPA));

module.exports = router;
