'use strict';

const { Schema, model } = require('mongoose');
const COLLECTION_NAME = 'Cart';
const DOCUMENT_NAME = 'Carts';

const cartSchema = new Schema(
	{
		cart_state: {
			type: String,
			required: true,
			enum: ['active', 'complete', 'failed', 'pending'],
			default: 'active',
		},
		cart_products: { type: Array, required: true, default: [] },
		/**
        product = [{
            productId
            shopId
            price
            quantity
            name
        }]
        */
		cart_count_product: { type: Number, default: 0 },
		cart_userId: { type: Number, require: true },
	},
	{
		collection: COLLECTION_NAME,
		timestamps: true,
	},
);

module.exports = model(DOCUMENT_NAME, cartSchema);
