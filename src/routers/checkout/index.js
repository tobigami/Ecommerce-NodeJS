const express = require('express');
const checkoutController = require('../../controllers/checkout.controller');

const asyncHandler = require('../../helper/asyncHandler');

const router = express.Router();

router.post('/review', asyncHandler(checkoutController.reviewCheckout));

module.exports = router;
