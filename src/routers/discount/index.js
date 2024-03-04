const express = require('express');
const discountController = require('../../controllers/discount.controller');
const asyncHandler = require('../../helper/asyncHandler');
const { authentication } = require('../../auth/authUtils');
const router = express.Router();

// get discount amount
router.post('/amount', asyncHandler(discountController.getDiscountAmount));

// get list product for discount by user
router.get('/list_product_code', asyncHandler(discountController.getAllDiscountCodesWithProduct));

// authentication
router.use(authentication);

// create discount by shop
router.post('/create', asyncHandler(discountController.createDiscountCode));

// get list discount code by shop
router.get('/list_discount', asyncHandler(discountController.getAllDiscountCodesByShop));

// update discount code by shop
router.patch('/update/:discountId', asyncHandler(discountController.updateDiscountByShop));

module.exports = router;
