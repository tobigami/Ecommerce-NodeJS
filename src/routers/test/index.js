const express = require('express');
const TestController = require('../../controllers/test.controller');

const asyncHandler = require('../../helper/asyncHandler');
const router = new express.Router();

router.post('/add', asyncHandler(TestController.createTest));

module.exports = router;
