'use strict';

const express = require('express');
const router = express.Router();
const UploadController = require('../../controllers/upload.controller');
const asyncHandler = require('../../helper/asyncHandler');
const { uploadDisk, uploadMemory } = require('../../configs/multer.config');

// cloudinary upload
router.post('/url', asyncHandler(UploadController.upLoadByUrl));
router.post('/file', uploadDisk.single('file'), asyncHandler(UploadController.upLoadByFile));
router.post('/files', uploadDisk.array('files', 3), asyncHandler(UploadController.upLoadByFiles));

// s3 upload with cloud front
router.post('/s3/file', uploadMemory.single('file'), asyncHandler(UploadController.upLoadS3ByFiles));

// s3 upload without cloud front
router.post('/s3/wo/file', uploadMemory.single('file'), asyncHandler(UploadController.upLoadS3ByFilesWo));

module.exports = router;
