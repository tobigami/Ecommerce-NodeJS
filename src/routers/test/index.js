const express = require('express');
const TestController = require('../../controllers/test.controller');

const asyncHandler = require('../../helper/asyncHandler');
const { rateLimit } = require('../../middlewares/rateLimit');
const router = new express.Router();
router.post('/add', asyncHandler(TestController.createTest));

// favorites
router.get('/favourites', asyncHandler(TestController.getFavourites));
router.post('/favourites/add', asyncHandler(TestController.addFavorite));
router.post('/favourites/delete', asyncHandler(TestController.bulkDeleteFavorite));

// history
router.get('/history', asyncHandler(TestController.getHistory));
router.post('/history/delete', asyncHandler(TestController.bulkDeleteHistory));

// click tracking
router.post('/click/add', rateLimit, asyncHandler(TestController.addClickTracking));

// download without stream
router.get('/download/wo', asyncHandler(TestController.downloadWoStream));

// download with stream
router.get('/download/wi', asyncHandler(TestController.downloadWiStream));

module.exports = router;
