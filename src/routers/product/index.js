const express = require('express');
const productController = require('../../controllers/product.controller');
const asyncHandler = require('../../helper/asyncHandler');
const { authentication } = require('../../auth/authUtils');
const router = express.Router();

// authentication
router.use(authentication);
// create product
router.post('', asyncHandler(productController.createProduct));
// get all draft product by shop
router.get('/drafts/all', asyncHandler(productController.getAllDraftProductForShop))

module.exports = router;
