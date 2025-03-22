const express = require('express');
const TestController = require('../../controllers/test.controller');

const asyncHandler = require('../../helper/asyncHandler');
const router = new express.Router();
router.post('/add', asyncHandler(TestController.createTest));

// favorites
router.get('/favourites', asyncHandler(TestController.getFavourites));
router.post('/favourites/add', asyncHandler(TestController.addFavorite));
router.post('/favourites/delete', asyncHandler(TestController.bulkDeleteFavorite));

// history
router.get('/history', asyncHandler(TestController.getHistory));
router.post('/history/delete', asyncHandler(TestController.bulkDeleteHistory));

module.exports = router;
