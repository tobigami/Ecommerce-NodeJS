const express = require('express');
const UserController = require('../../controllers/user.controller');
const { authentication } = require('../../auth/authUtils');

const asyncHandler = require('../../helper/asyncHandler');
const router = new express.Router();

// check authentication
router.use(authentication);
router.get('/info', asyncHandler(UserController.getInfo));

module.exports = router;
