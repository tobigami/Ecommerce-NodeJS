'use strict';

const { BadRequestError, NotFoundError } = require('../core/error.response');
const { findCartById } = require('../models/repositories/cart.repo');
const { checkListProduct } = require('../models/repositories/product.repo');
const { getDiscountAmount } = require('./discount.service');

class CheckoutService {
	/*
    login and without login
    payload:
    {
    "cartId": "",
    "userId": "",
    "shopOrderIds": [
        {
            "shopId": "",
            "shopDiscounts": "",
            "itemProducts": [
                {
                    "productId": "",
                    "price": "",
                    "quantity": ""
                }
            ]
        },
        {
            "shopId": "",
            "shopDiscounts": [
                {
                    "shopId": "",
                    "discountId": "",
                    "codeId": ""
                }
            ],
            "itemProducts": [
                {
                    "productId": "",
                    "price": "",
                    "quantity": ""
                }
            ]
        }
    ]
}
    */

	static async checkoutReview({ cartId, userId, shopOrderIds }) {
		// check xem cartId do co ton tai hay khong
		const foundCart = await findCartById(cartId);

		if (!foundCart) throw new NotFoundError(`CartId is not found`);

		const checkoutOrder = {
			totalPrice: 0, // tong tien hang
			feeShip: 0, // phi van chuyen,
			totalDiscount: 0, // tong tien discount giam gia
			totalCheckout: 0, // tong tien phai thanh toan
		};

		const shopOrderIdsNew = []; // trả về thông tin giá sản phẩm từ DB

		// tính tổng tiền bill
		for (let i = 0; i < shopOrderIds.length; i++) {
			const { shopId, shopDiscounts, itemProducts } = shopOrderIds[i];

			// check list product có tồn tại trong db hay không và trả về price từ DB
			const checkProducts = await checkListProduct(itemProducts);
			// Nếu không tồn tại bất kì 1 sản phẩm nào hợp lệ
			if (!checkProducts[0]) throw new BadRequestError('Order wrong');

			// tính tổng tiền có trong đơn hàng price * quantity
			const checkoutPrice = checkProducts.reduce((acc, product) => {
				return acc + product.price * product.quantity;
			}, 0);

			// tong tien truoc khi xy ly
			checkoutOrder.totalPrice = +checkoutPrice;

			const itemCheckout = {
				shopId,
				shopDiscounts,
				priceRaw: checkoutPrice,
				priceApplyDiscount: checkoutPrice,
				itemProducts: checkProducts,
			};

			// neu shopDiscounts ton tai > 0, check xem co hop le hay khong
			if (shopDiscounts.length) {
				// neu chi co 1 disoucnt
				// get discount amount ben discount service
				const { totalPrice = 0, discount = 0 } = await getDiscountAmount({
					products: checkProducts,
					codeId: shopDiscounts[0].codeId,
					userId,
					shopId,
				});

				checkoutOrder.totalDiscount += discount;

				if (discount > 0) {
					itemCheckout.priceApplyDiscount = checkoutPrice - discount;
				}
			}

			checkoutOrder.totalCheckout += itemCheckout.priceApplyDiscount;

			shopOrderIdsNew.push(itemCheckout);
		}

		return {
			shopOrderIds,
			shopOrderIdsNew,
			checkoutOrder,
		};
	}

	static async finalCheckoutByUser({ cartId, userId, shopOrderIds, userAddress = {}, usePayment = {} }) {
		const { shopOrderIdsNew, checkoutOrder } = CheckoutService.checkoutReview({ cartId, userId, shopOrderIds });

		//
		const products = shopOrderIdsNew.flatMap((order) => order.itemProducts);
		for (let i = 0; i < products.length; i++) {
			const { productId, quantity } = products[i];
		}
	}
}

module.exports = CheckoutService;
