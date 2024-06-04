const express = require('express');
const commentController = require('../../controllers/comment.controller');
const asyncHandler = require('../../helper/asyncHandler');
const { authentication } = require('../../auth/authUtils');
const router = express.Router();

// authentication
router.use(authentication);

// get comments
router.get('/', asyncHandler(commentController.getComments));

// add comment
router.post('/add', asyncHandler(commentController.addComment));

module.exports = router;
