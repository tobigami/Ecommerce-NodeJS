const express = require('express');
const TestController = require('../../controllers/test.controller');

const asyncHandler = require('../../helper/asyncHandler');
const router = new express.Router();

router.get('/favourites', asyncHandler(TestController.getFavourites));

router.post('/add', asyncHandler(TestController.createTest));
router.post('/favourites/add', asyncHandler(TestController.addFavorite));
router.post('/favourites/delete', asyncHandler(TestController.bulkDeleteFavorite));

module.exports = router;
