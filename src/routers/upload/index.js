'use strict';

const express = require('express');
const router = express.Router();
const UploadController = require('../../controllers/upload.controller');
const asyncHandler = require('../../helper/asyncHandler');

router.post('/url', asyncHandler(UploadController.upLoadByUrl));

module.exports = router;
