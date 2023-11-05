const express = require('express');
const productController = require('../../controllers/product.controller');
const asyncHandler = require('../../helper/asyncHandler');
const { authentication } = require('../../auth/authUtils');
const router = express.Router();

// authentication
router.use(authentication);
// create product
router.use('', asyncHandler(productController.createProduct));

module.exports = router;
