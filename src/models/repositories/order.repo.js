'use strict';

const orderModel = require('../order.model');

const createOrder = async ({ userId, order }) => {
	return await orderModel.create({
		order_userId: userId,
		order_checkout: order.order_checkout,
		order_shipping: order.order_shipping,
		order_payment: order.order_payment,
		order_products: order.order_products,
	});
};

module.exports = { createOrder };
