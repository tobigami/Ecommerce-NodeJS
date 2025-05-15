'use strict';

const { product, clothing, electronic, furniture } = require('../product.model');
const { Types } = require('mongoose');
const { getSelectData, unGetSelectData, convertToObjectIdMongodb } = require('../../utils');

const findAllDraftForShop = async ({ query, limit, skip }) => {
	return await queryProduct({ query, limit, skip });
};

const findAllPublishForShop = async ({ query, limit, skip }) => {
	return await queryProduct({ query, limit, skip });
};

const searchProductByUser = async ({ keySearch }) => {
	const regexSearch = new RegExp(keySearch);
	const results = await product
		.find(
			{ is_published: true, $text: { $search: regexSearch } },
			{ score: { $meta: 'textScore' } },
		)
		.sort({ score: { $meta: 'textScore' } })
		.lean();
	return results;
};

const publishProductByShop = async ({ shop_id, product_id }) => {
	const foundShop = await product.findOne({
		product_shop: new Types.ObjectId(shop_id),
		_id: new Types.ObjectId(product_id),
	});

	if (!foundShop) return null;

	foundShop.is_draft = false;
	foundShop.is_published = true;
	const { modifiedCount } = await foundShop.updateOne(foundShop);
	return modifiedCount;
};

const unPublishProductByShop = async ({ shop_id, product_id }) => {
	const foundShop = await product.findOne({
		product_shop: new Types.ObjectId(shop_id),
		_id: new Types.ObjectId(product_id),
	});

	if (!foundShop) return null;

	foundShop.is_draft = true;
	foundShop.is_published = false;
	const { modifiedCount } = await foundShop.updateOne(foundShop);
	return modifiedCount;
};

const queryProduct = async ({ query, limit, skip }) => {
	return await product
		.find(query)
		.populate('product_shop', 'name email -_id')
		.sort({ updateAt: -1 })
		.skip(skip)
		.limit(limit)
		.lean()
		.exec();
};

const findAllProducts = async ({ limit, sort, page, filter, select }) => {
	const skip = (page - 1) * limit;
	sort = sort === 'ctime' ? { _id: -1 } : { _id: 1 };
	const products = await product
		.find(filter)
		.sort(sort)
		.skip(skip)
		.limit(limit)
		.select(getSelectData(select))
		.lean();

	return products;
};

const findProduct = async ({ product_id, unSelect }) => {
	return await product.findById(product_id).select(unGetSelectData(unSelect));
};

const updateProductById = async ({ productId, bodyUpdate, model, isNew = true }) => {
	return await model.findByIdAndUpdate(productId, bodyUpdate, { new: isNew });
};

const findProductById = async (productId) => {
	return await product.findOne({ _id: convertToObjectIdMongodb(productId) }).lean();
};

const checkListProduct = async (products) => {
	return await Promise.all(
		products.map(async (product) => {
			const foundProduct = await findProductById(product.productId);
			if (foundProduct) {
				return {
					price: foundProduct.product_price,
					productId: foundProduct._id,
					quantity: product.quantity,
				};
			}
		}),
	);
};

const updateProductQuantity = async ({ productId, quantity }) => {
	const query = {
			_id: convertToObjectIdMongodb(productId),
		},
		update = {
			$inc: {
				product_quantity: Number(quantity),
			},
		},
		options = {
			new: true,
		};

	return await product.findOneAndUpdate(query, update, options);
};

module.exports = {
	findAllDraftForShop,
	findAllPublishForShop,
	publishProductByShop,
	unPublishProductByShop,
	searchProductByUser,
	findAllProducts,
	findProduct,
	updateProductById,
	findProductById,
	checkListProduct,
	updateProductQuantity,
};
