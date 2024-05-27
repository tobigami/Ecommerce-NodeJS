const express = require('express');
const commentController = require('../../controllers/comment.controller');
const asyncHandler = require('../../helper/asyncHandler');
const { authentication } = require('../../auth/authUtils');
const router = express.Router();

// authentication
router.use(authentication);

// add comment
router.post('/add', asyncHandler(commentController.addComment));

module.exports = router;
