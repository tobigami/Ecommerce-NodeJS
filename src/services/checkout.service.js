'use strict';

const { BadRequestError, NotFoundError } = require('../core/error.response');
const { findCartById } = require('../models/repositories/cart.repo');
const { reservationInventory } = require('../models/repositories/inventory.repo');
const { createOrder } = require('../models/repositories/order.repo');
const { checkListProduct, updateProductQuantity } = require('../models/repositories/product.repo');
const { getDiscountAmount } = require('./discount.service');
const { acquireLock, releaseLock } = require('./redis.service'); // Added redis lock service

class CheckoutService {
	/**
 	* {
	"cartId": "",
	"userId": "",
	"shopOrderIds": 
		[
			{
					"shopId": "",
					"shopDiscounts": ["code1", "code2"],
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
					"shopDiscounts": ["code3", "code4"],
					"itemProducts": [
							{
									"productId": "",
									"price": "",
									"quantity": ""
							}
					]
			}
		]
 	*/
	static async checkoutReview({ cartId, userId, shopOrderIds }) {
		// check cartId exists
		const foundCart = await findCartById(cartId);

		if (!foundCart) throw new NotFoundError(`CartId is not found`);

		const checkoutOrder = {
			totalPrice: 0,
			feeShip: 0,
			totalDiscount: 0,
			totalCheckout: 0,
		};

		const shopOrderIdsNew = [];

		// calculator total price of each shop
		for (let i = 0; i < shopOrderIds.length; i++) {
			const { shopId, shopDiscounts, itemProducts } = shopOrderIds[i];

			// query products from databases
			const checkProducts = await checkListProduct(itemProducts);
			// When product not found
			if (!checkProducts[0]) throw new BadRequestError('Order wrong');

			// calculator total price * quantity of each product of each shop
			const checkoutPrice = checkProducts.reduce((acc, product) => {
				return acc + product.price * product.quantity;
			}, 0);

			// total price of each shop before discount
			checkoutOrder.totalPrice += +checkoutPrice;

			const itemCheckout = {
				shopId,
				shopDiscounts,
				priceRaw: checkoutPrice,
				priceApplyDiscount: checkoutPrice,
				itemProducts: checkProducts,
			};

			// check discount of each shop
			if (shopDiscounts.length) {
				// if have multiple discounts
				let totalDiscountForShop = 0;
				for (const codeId of shopDiscounts) {
					const { discount = 0 } = await getDiscountAmount({
						products: checkProducts,
						codeId: codeId, // Use the current discount code in the loop
						userId,
						shopId,
					});
					totalDiscountForShop += discount;
				}

				checkoutOrder.totalDiscount += totalDiscountForShop;

				if (totalDiscountForShop > 0) {
					itemCheckout.priceApplyDiscount = checkoutPrice - totalDiscountForShop;
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

	static async finalCheckoutByUser({
		cartId,
		userId,
		shopOrderIds,
		userAddress = {},
		usePayment = {},
	}) {
		const { shopOrderIdsNew, checkoutOrder } = await CheckoutService.checkoutReview({
			cartId,
			userId,
			shopOrderIds,
		});

		// Check lai mot lan nua xem co vuot ton kho hay khong?
		const products = shopOrderIdsNew.flatMap((order) => order.itemProducts);
		console.log('[CheckoutService] products::', products);

		const acquireProduct = [];
		for (let i = 0; i < products.length; i++) {
			const { productId, quantity } = products[i];
			const keyLock = await acquireLock(productId, cartId);
			if (keyLock) {
				acquireProduct.push(keyLock);
			} else {
				// Rollback: Release acquired locks if any product fails to lock
				for (const lock of acquireProduct) {
					await releaseLock(lock);
				}
				throw new BadRequestError('Some products are updated, please return to cart');
			}
		}

		// If all products are locked, proceed to update quantities (simulating order placement)
		let updateQuantityPromise = [];
		let updateInventoryPromise = [];
		products.forEach((product) => {
			updateQuantityPromise.push(
				updateProductQuantity({ productId: product.productId, quantity: -product.quantity }),
			);
			updateInventoryPromise.push(
				reservationInventory({
					productId: product.productId,
					quantity: product.quantity,
					cardId: cartId,
				}),
			);
		});

		try {
			await Promise.all(updateQuantityPromise);
			await Promise.all(updateInventoryPromise);
			// Simulate order success, then release locks
			console.log('Order successful, releasing locks');
		} catch (error) {
			// If updating quantities fails, this is a critical error.
			// Depending on the strategy, you might try to rollback inventory changes or flag for manual intervention.
			// For now, we will still release the locks as the transaction didn't complete fully.
			console.error(`Failed to update product quantities: ${error}`);
			// Consider a more sophisticated rollback for inventory if partial updates occurred.
			throw new BadRequestError('Failed to process order due to inventory update issues.', error);
		} finally {
			// Release all acquired locks
			for (const lock of acquireProduct) {
				await releaseLock(lock);
			}
		}

		const newOrder = await createOrder({
			userId,
			order: {
				order_checkout: checkoutOrder,
				order_shipping: userAddress,
				order_payment: usePayment,
				order_products: shopOrderIdsNew,
			},
		});

		console.log('New order created:', newOrder);

		// remove products in cart
		if (newOrder) {
			console.log('111111111111111111111111');
		}

		return newOrder;
	}
}

module.exports = CheckoutService;
