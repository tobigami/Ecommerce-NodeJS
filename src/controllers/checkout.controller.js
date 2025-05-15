'use strict';

const { SuccessResponse } = require('../core/success.response');

const CheckoutService = require('../services/checkout.service');

class CheckoutController {
	reviewCheckout = async (req, res, next) => {
		return new SuccessResponse({
			message: 'review checkout successfully',
			metadata: await CheckoutService.checkoutReview({ ...req.body }),
		}).send(res);
	};

	finalCheckout = async (req, res) => {
		return new SuccessResponse({
			message: 'final checkout successfully',
			metadata: await CheckoutService.finalCheckoutByUser({ ...req.body }),
		}).send(res);
	};
}

module.exports = new CheckoutController();
