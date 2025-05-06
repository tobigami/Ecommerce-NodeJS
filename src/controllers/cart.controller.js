'use strict';

const { SuccessResponse } = require('../core/success.response');
const CartService = require('../services/cart.service');

class CartController {
	addToCart = async (req, res, next) => {
		return new SuccessResponse({
			message: `Add to cart success!`,
			metadata: await CartService.addToCart({ ...req.body }),
		}).send(res);
	};

	updateCartItem = async (req, res, next) => {
		return new SuccessResponse({
			message: `Update cart item success`,
			metadata: await CartService.updateCartItem({ ...req.body }),
		}).send(res);
	};

	deleteCartItem = async (req, res, next) => {
		return new SuccessResponse({
			message: `Delete cart item success`,
			metadata: await CartService.deleteCart({ ...req.body }),
		}).send(res);
	};

	getCart = async (req, res, next) => {
		return new SuccessResponse({
			message: `Get cart by userId success`,
			metadata: await CartService.getCartByUserId(req.query.userId),
		}).send(res);
	};
}

module.exports = new CartController();
