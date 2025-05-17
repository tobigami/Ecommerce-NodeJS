'use strict';

const { Schema, model } = require('mongoose');
const COLLECTION_NAME = 'Orders';
const DOCUMENT_NAME = 'Orders';

const cartSchema = new Schema(
	{
		order_userId: { type: Number, required: true },
		/**
		 * order_checkout = {
		 *    totalPrice: 0,
		 *    totalDiscount: 0,
		 *    feeShip: 0
		 *  }
		 */
		order_checkout: { type: Object, required: true, default: {} },

		/**
		 * order_products = {
		 * street: "",
		 * city: "",
		 * state: "",
		 * country: "",
		 * }
		 */
		order_shipping: { type: Object, required: true, default: {} },
		order_payment: { type: Object, required: true, default: {} },
		order_products: { type: Array, required: true, default: [] },
		order_tracking: { type: String, required: true, default: '#001234' },
		order_status: {
			type: String,
			required: true,
			enum: ['pending', 'completed', 'cancelled', 'confirmed', 'delivered', 'shipped'],
			default: 'pending',
		},
	},
	{
		collection: COLLECTION_NAME,
		timestamps: true,
	},
);

module.exports = model(DOCUMENT_NAME, cartSchema);
