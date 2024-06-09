'use strict';

const express = require('express');
const notificationController = require('../../controllers/notification.controller');
const asyncHandler = require('../../helper/asyncHandler');
const { authentication } = require('../../auth/authUtils');
const router = express.Router();

// Here not login

// get list notification by user
router.get('/get_list', asyncHandler(notificationController.getListNotifyByUser));

// authentication
router.use(authentication);

module.exports = router;
