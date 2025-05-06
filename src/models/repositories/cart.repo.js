'use strict';

const cartModel = require('../cart.model');
const { convertToObjectIdMongodb } = require('../../utils');

const createUserCart = async ({ userId, product }) => {
	const query = { cart_userId: userId, cart_state: 'active' },
		updateOrInsert = {
			$addToSet: {
				cart_products: product,
			},
		},
		options = { upsert: true, new: true };

	return await cartModel.findOneAndUpdate(query, updateOrInsert, options);
};

const updateUserCartQuantity = async ({ userId, product }) => {
	const { productId, quantity } = product;
	const query = {
			cart_userId: userId,
			cart_state: 'active',
			'cart_products.productId': productId,
		},
		updateSet = {
			$inc: {
				'cart_products.$.quantity': quantity,
			},
		},
		options = { new: true, upSert: true };

	return await cartModel.findOneAndUpdate(query, updateSet, options);
};

const findCartById = async (cartId) => {
	return cartModel.findOne({ _id: convertToObjectIdMongodb(cartId), cart_state: 'active' }).lean();
};

const pushProductToCart = async ({ userId, product }) => {
	const query = {
			cart_userId: userId,
			cart_state: 'active',
		},
		update = {
			$push: { cart_products: product },
		},
		options = { new: true };

	return await cartModel.findOneAndUpdate(query, update, options);
};

module.exports = { createUserCart, updateUserCartQuantity, findCartById, pushProductToCart };
