'use strict';

const { SuccessResponse } = require('../core/success.response');
const DiscountService = require('../services/discount.service');

class DiscountController {
	// create discount code by shop
	createDiscountCode = async (req, res, next) => {
		return new SuccessResponse({
			message: `Create new discount success!`,
			metadata: await DiscountService.createDiscountCode({
				...req.body,
				shopId: req.user.userId
			})
		}).send(res);
	};

	// get list discount by shop
	getAllDiscountCodesByShop = async (req, res, next) => {
		return new SuccessResponse({
			message: 'Successful Code Found',
			metadata: await DiscountService.getAllDiscountCodeByShop({
				...req.query,
				shopId: req.user.userId
			})
		}).send(res);
	};

	// get list product available with discount
	getAllDiscountCodesWithProduct = async (req, res, next) => {
		return new SuccessResponse({
			message: `Get list product available with discount success`,
			metadata: await DiscountService.getProductsByDiscountCode({
				...req.query
			})
		}).send(res);
	};

	// get discount amount
	getDiscountAmount = async (req, res, next) => {
		return new SuccessResponse({
			message: `Get discount amount success`,
			metadata: await DiscountService.getDiscountAmount({
				...req.body
			})
		}).send(res);
	};

	// update discount code
	updateDiscountByShop = async (req, res, next) => {
		return new SuccessResponse({
			message: `Update discount success`,
			metadata: await DiscountService.updateDiscount({
				payload: req.body,
				discountId: req.params.discountId
			})
		}).send(res);
	};
}

module.exports = new DiscountController();
