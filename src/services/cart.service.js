const cartModel = require('../models/cart.model');
const { NotFoundError, BadRequestError } = require('../core/error.response.js');
const { createUserCart, updateUserCartQuantity, pushProductToCart } = require('../models/repositories/cart.repo');
const { findProductById } = require('../models/repositories/product.repo');

/**
 * Cart service
 * 1. Add product to cart [user]
 * 2. Reduce product on cart [user]
 * 3. Increase product on cart [user]
 * 4. Get cart [user]
 * 5. Delete cart item [user]
 * 6. Delete cart
 */

class CartService {
	// 1. Add to cart
	static async addToCart({ userId, product = {} }) {
		// check cart userId exists
		const userCart = await cartModel.findOne({ cart_userId: userId });
		if (!userCart) {
			// create new cart  for user || note get name, price form db to create userCart (pending)
			return await createUserCart({ userId, product });
		}

		// case no item in cart
		if (!userCart.cart_products.length) {
			userCart.cart_products = [product];
			return await userCart.save();
		}

		if (userCart.cart_products.some((pro) => pro.productId === product.productId)) {
			// update quantity case update quantity item if product exist in cart
			console.log('entry to this caseeeeee');
			return await updateUserCartQuantity({ userId, product });
		}
		// push product to cart when product not exist in cart
		return await pushProductToCart({ userId: userId, product: product });
	}

	// 2. Update cart item
	/*
    shop_order_ids = [
        {
            shopId,
            item_products: [
                {
                    quantity,
                    price,
                    shopId,
                    old_quantity,
                    productId
                }
            ],
            version
        }
    ]
    */
	static async updateCartItem({ userId, shop_order_ids }) {
		const { productId, quantity, old_quantity } = shop_order_ids[0]?.item_products[0];
		const foundProduct = await findProductById(productId);

		if (!foundProduct) throw new NotFoundError(`Product not exists`);

		console.log('foundProduct.product_shop.toString()', foundProduct.product_shop.toString());
		console.log('shop_order_ids[0]?.shopId', shop_order_ids[0]?.shopId);

		if (foundProduct.product_shop.toString() !== shop_order_ids[0]?.shopId) {
			throw new NotFoundError(`Product do not belong to the shop`);
		}

		if (quantity === 0) {
			// delete product item in cart
		}

		return await updateUserCartQuantity({
			userId,
			product: {
				productId,
				quantity: quantity - old_quantity,
			},
		});
	}

	// 3. Delete item in cart
	static async deleteCart({ userId, productId }) {
		const query = { cart_userId: userId, cart_state: 'active' };
		const updateSet = {
			$pull: {
				cart_products: {
					productId,
				},
			},
		};

		const deleteItemInCart = await cartModel.updateOne(query, updateSet);

		return deleteItemInCart;
	}

	// 4. Get cart by userId
	static async getCartByUserId(userId) {
		return await cartModel.findOne({ cart_userId: +userId, cart_state: 'active' }).lean();
	}
}

module.exports = CartService;
