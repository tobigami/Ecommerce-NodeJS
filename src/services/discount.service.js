const discountModel = require('../models/discount.model');
const { BadRequestError, NotFoundError } = require('../core/error.response');

const { findAllProducts } = require('../models/repositories/product.repo');
const {
	findDiscountByShop,
	findDiscountById,
	updateDiscountById,
	findAllDiscountCodesUnSelectData
} = require('../models/repositories/discount.repo');
const {
	convertToObjectIdMongodb,
	removeUndefinedObject,
	updateNestedObjectParse
} = require('../utils');
const { product } = require('../models/product.model');

/**
 * Discount Service
 * 1. Generator Discount Code [Shop | Admin]
 * 2. Cancel Discount Code [User]
 * 3. Get All Discount Code [User | Shop]
 * 4. Get Discount Amount [User]
 * 5. Delete Discount Code [Shop | Admin]
 * 6. Update Discount Code [Shop | Admin]
 */

class DiscountService {
	// 1.Create discount
	static async createDiscountCode(payload) {
		const {
			name,
			description,
			shopId,
			type,
			value,
			code,
			startDate,
			endDate,
			maxQuantity,
			usesCount,
			userUsed,
			maxUsesPerUser,
			minOrderValue,
			isActive,
			appliesTo,
			productIds
		} = payload;

		// check payload

		if (new Date() < new Date(startDate) || new Date() > new Date(endDate)) {
			throw new BadRequestError(`Discount code has expire!`);
		}

		if (new Date(startDate) >= new Date(endDate)) {
			throw new BadRequestError(`Star Date must be less than End Date`);
		}

		// create index for discount code
		const foundDiscount = await findDiscountByShop({ code, shopId });

		if (foundDiscount && foundDiscount.discount_is_active) {
			throw new BadRequestError(`Discount code is exists`);
		}

		const newDiscount = await discountModel.create({
			discount_name: name,
			discount_description: description,
			discount_shop_id: shopId,
			discount_type: type,
			discount_value: value,
			discount_code: code,
			discount_start_date: new Date(startDate),
			discount_end_date: new Date(endDate),
			discount_max_quantity: maxQuantity,
			discount_uses_count: usesCount,
			discount_users_used: userUsed,
			discount_max_uses_per_user: maxUsesPerUser,
			discount_min_order_value: minOrderValue || 0,
			discount_is_active: isActive,
			discount_applies_to: appliesTo,
			discount_product_ids: appliesTo === 'all' ? [] : productIds
		});

		return newDiscount;
	}

	// 2.Cancel discount code
	static async cancelDiscountCode({ codeId, shopId, userId }) {
		const foundDiscount = await findDiscountByShop({ code: codeId, shopId: shopId });

		if (!foundDiscount) throw new NotFoundError(`Discount code doesn't exists`);

		const updateDiscount = await discountModel.findByIdAndUpdate(foundDiscount._id, {
			// loại bỏ đi các phần từ trong mảng khớp với giá trị userId
			$pull: {
				discount_users_used: userId
			},
			// discount_max_quantity + 1 || discount_uses_count -1
			$inc: {
				discount_max_quantity: 1,
				discount_uses_count: -1
			}
		});

		return updateDiscount;
	}

	// 3.1 Get list product can use this discount by User or Shop
	static async getProductsByDiscountCode({ code, shopId, userId, limit, page }) {
		const foundDiscount = await findDiscountByShop({ code, shopId });

		if (!foundDiscount || !foundDiscount.discount_is_active) {
			throw new NotFoundError('Discount Code Not Exists!');
		}

		const { discount_applies_to, discount_product_ids } = foundDiscount;

		let products;

		// Get all product
		if (discount_applies_to === 'all') {
			products = await findAllProducts({
				limit: +limit,
				sort: 'ctime',
				page: +page,
				filter: { is_published: true, product_shop: convertToObjectIdMongodb(shopId) },
				select: ['product_name']
			});
		}

		// Get product Ids
		if (discount_applies_to === 'specific') {
			products = await findAllProducts({
				limit: +limit,
				sort: 'ctime',
				page: +page,
				filter: { _id: { $in: discount_product_ids }, is_published: true },
				select: ['product_name']
			});
		}

		return products;
	}

	// 3.2 Get list discount code by Shop
	static async getAllDiscountCodeByShop({ limit, page, shopId }) {
		const discounts = await findAllDiscountCodesUnSelectData({
			limit: +limit,
			page: +page,
			filter: {
				discount_shop_id: convertToObjectIdMongodb(shopId),
				discount_is_active: true
			},
			unSelect: ['__v', 'discount_shop_id'],
			model: discountModel
		});

		return discounts;
	}

	// 4. Get discount amount
	/*
    products = [
        {
            productId,
            shopId,
            name,
            quantity,
            price
        },
        {
            productId,
            shopId,
            name,
            quantity,
            price
        }
    ];
    */
	static async getDiscountAmount({ products, codeId, shopId, userId }) {
		const foundDiscount = await findDiscountByShop({
			code: codeId,
			shopId: shopId
		});

		if (!foundDiscount) throw new NotFoundError(`Discount code doesn't exists`);

		const {
			discount_start_date,
			discount_end_date,
			discount_is_active,
			discount_max_quantity,
			discount_min_order_value,
			discount_max_uses_per_user,
			discount_users_used,
			discount_type,
			discount_value,
			discount_applies_to
		} = foundDiscount;

		if (!discount_is_active) throw new NotFoundError(`Discount code expired`);

		if (new Date() < new Date(discount_start_date) || new Date() > new Date(discount_end_date)) {
			throw new NotFoundError(`Discount code expired`);
		}

		if (!discount_max_quantity) throw new NotFoundError(`Discount Code out stock`);

		let totalOrder = 0;
		if (discount_min_order_value > 0) {
			// get total Order
			totalOrder = products.reduce((acc, product) => {
				return acc + product.price * product.quantity;
			}, 0);

			if (totalOrder < discount_min_order_value) {
				throw new NotFoundError(
					`Discount code requires minimum amount order ${discount_min_order_value}`
				);
			}

			if (discount_max_uses_per_user > 0) {
				const userUseDiscountCount = discount_users_used.find((user) => user.userId === userId);
				if (userUseDiscountCount) {
					// handle here .....
				}
			}

			const amount =
				discount_type === 'fixed_amount' ? discount_value : (totalOrder * discount_value) / 100;

			return {
				totalOrder,
				discount: amount,
				totalPrice: totalOrder - amount
			};
		}
	}

	// 5 Delete Discount code
	static async deleteDiscountCode({ codeId, shopId }) {
		const deleted = await discountModel.findByIdAndDelete({
			discount_code: codeId,
			discount_shop_id: convertToObjectIdMongodb(shopId)
		});

		return deleted;
	}

	// 6.Update discount
	static async updateDiscount({ discountId, payload }) {
		const foundDiscount = await findDiscountById(discountId);
		if (!foundDiscount) throw new NotFoundError(`Could not found discountId: ${discountId}`);

		payload = removeUndefinedObject(payload);

		const newDiscount = await updateDiscountById({
			discountId,
			bodyUpdate: updateNestedObjectParse(payload)
		});

		return newDiscount;
	}
}

module.exports = DiscountService;
