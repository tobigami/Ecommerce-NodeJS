const express = require('express');
const cartController = require('../../controllers/cart.controller');
const asyncHandler = require('../../helper/asyncHandler');
// const { authentication } = require('../../auth/authUtils');
const router = express.Router();

// add to cart
router.post('', asyncHandler(cartController.addToCart));

// get list product for discount by user
router.post('/update', asyncHandler(cartController.updateCartItem));

// delete
router.delete('', asyncHandler(cartController.deleteCartItem));

// get cart
router.get('', asyncHandler(cartController.getCart));

module.exports = router;
