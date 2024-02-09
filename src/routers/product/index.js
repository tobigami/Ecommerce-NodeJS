const express = require('express');
const productController = require('../../controllers/product.controller');
const asyncHandler = require('../../helper/asyncHandler');
const { authentication } = require('../../auth/authUtils');
const router = express.Router();

// find all product
router.get('', asyncHandler(productController.findAllProducts));
// find detail product
router.get('/:product_id', asyncHandler(productController.findProduct));
// search list product by user
router.get('/search/:keySearch', asyncHandler(productController.getListSearchProduct));

// authentication
router.use(authentication);
// create product
router.post('', asyncHandler(productController.createProduct));
// get all draft product by shop
router.get('/drafts/all', asyncHandler(productController.getAllDraftProductForShop));
router.get('/publish/all', asyncHandler(productController.getAllPublishProductForShop));

// PUT publish product by shop
router.put('/publish/:id', asyncHandler(productController.publishProductByShop));
// PUT unpublish product by shop
router.put('/unpublish/:id', asyncHandler(productController.unPublishProductByShop));

module.exports = router;
