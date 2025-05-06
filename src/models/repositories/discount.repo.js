'use strict';
const { convertToObjectIdMongodb, unGetSelectData, getSelectData } = require('../../utils');
const discountModel = require('../discount.model');

const findDiscountByShop = async ({ code, shopId }) => {
	return discountModel
		.findOne({
			discount_code: code,
			discount_shop_id: convertToObjectIdMongodb(shopId),
		})
		.lean();
};

const findAllDiscountCodesUnSelectData = async ({
	limit = 50,
	page = 1,
	sort = 'ctime',
	filter,
	unSelect,
	model = discountModel,
}) => {
	const skip = (page - 1) * limit;
	const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 };
	const document = await model
		.find(filter)
		.sort(sortBy)
		.skip(skip)
		.limit(limit)
		.select(unGetSelectData(unSelect))
		.lean()
		.exec();
	return document;
};

const findAllDiscountCodesSelectData = async ({
	limit = 50,
	page = 1,
	sort = 'ctime',
	filter,
	select,
	model = discountModel,
}) => {
	const skip = (page - 1) * limit;
	const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 };
	const document = await model
		.find(filter)
		.sort(sortBy)
		.skip(skip)
		.limit(limit)
		.select(getSelectData(select))
		.lean()
		.exec();
	return document;
};

const findDiscountById = async (discountId) => {
	return discountModel.findOne({ _id: convertToObjectIdMongodb(discountId) }).lean();
};

const updateDiscountById = async ({ discountId, bodyUpdate, isNew = true }) => {
	return await discountModel.findByIdAndUpdate(discountId, bodyUpdate, { new: isNew }).lean();
};

module.exports = {
	findDiscountByShop,
	findAllDiscountCodesUnSelectData,
	findAllDiscountCodesSelectData,
	findDiscountById,
	updateDiscountById,
};
