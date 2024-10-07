'use strict';

const { model, Schema } = require('mongoose');
const slugify = require('slugify');

const DOCUMENT_NAME = 'Product';
const COLLECTION_NAME = 'Products';

const productSchema = new Schema(
	{
		product_name: { type: String, required: true },
		product_thumb: { type: String, required: true },
		product_description: String,
		product_slug: String,
		product_price: { type: Number, required: true },
		product_quantity: { type: Number, required: true },
		product_type: {
			type: String,
			required: true,
			enum: ['Clothing', 'Electronic', 'Furniture']
		},
		product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
		product_attributes: { type: Schema.Types.Mixed, required: true },
		product_variantions: { type: Array, default: [] },
		product_rattingsAverage: {
			type: Number,
			default: 4.5,
			min: [1, 'Ratting must above 1.0'],
			max: [5, 'Ratting must under 5.0'],
			set: (value) => Math.round(value * 10) / 10
		},
		is_draft: { type: Boolean, default: true, index: true, select: false },
		is_published: {
			type: Boolean,
			default: false,
			index: true,
			select: false
		}
	},
	{
		timestamps: true,
		collection: COLLECTION_NAME
	}
);

// webhook middleware before .save or .create product schema
productSchema.pre('save', function (next) {
	this.product_slug = slugify(this.product_name, { lower: true });
	next();
});

// create index for full text search
productSchema.index({ product_name: 'text', product_description: 'text' });

// define product type = clothing
const clothingSchema = new Schema(
	{
		brand: { type: String, required: true },
		size: String,
		material: String,
		product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' }
	},
	{
		timestamps: true,
		collection: 'clothes'
	}
);

// define product type = electronic
const electronicSchema = new Schema(
	{
		manufacture: { type: String, required: true },
		model: String,
		color: String,
		product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' }
	},
	{
		timestamps: true,
		collection: 'electronic'
	}
);

// define product type = furniture
const furnitureSchema = new Schema(
	{
		manufacture: { type: String, required: true },
		model: String,
		color: String,
		product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' }
	},
	{
		timestamps: true,
		collection: 'furniture'
	}
);

module.exports = {
	product: model(DOCUMENT_NAME, productSchema),
	clothing: model('Clothing', clothingSchema),
	electronic: model('Electronic', electronicSchema),
	furniture: model('Furniture', furnitureSchema)
};
