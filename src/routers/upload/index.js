'use strict';

const express = require('express');
const router = express.Router();
const UploadController = require('../../controllers/upload.controller');
const asyncHandler = require('../../helper/asyncHandler');
const { uploadDisk } = require('../../configs/multer.config');

// cloudinary upload
router.post('/url', asyncHandler(UploadController.upLoadByUrl));
router.post('/file', uploadDisk.single('file'), asyncHandler(UploadController.upLoadByFile));
router.post('/files', uploadDisk.array('files', 3), asyncHandler(UploadController.upLoadByFiles));

module.exports = router;
