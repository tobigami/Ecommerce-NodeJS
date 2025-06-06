'use strict';

const { product, clothing, electronic, furniture } = require('../models/product.model');
const { BadRequestError, ForbiddenError } = require('../core/error.response');
const {
	findAllDraftForShop,
	findAllPublishForShop,
	publishProductByShop,
	unPublishProductByShop,
	searchProductByUser,
	findAllProducts,
	findProduct,
	updateProductById,
} = require('../models/repositories/product.repo');
const { removeUndefinedObject, updateNestedObjectParse } = require('../utils');
const { insertInventory } = require('../models/repositories/inventory.repo');
const NotificationService = require('../services/notification.service');
const { NotifyEnum } = require('../configs/enum');

// define Factory Class to create Product
class ProductFactory {
	/**
	 * type: 'Clothing'
	 * payload
	 */

	static productRegister = {}; // key-class

	static registerProductType(type, classRef) {
		ProductFactory.productRegister[type] = classRef;
	}
	// POST
	static async createProduct(type, payload) {
		const productClass = ProductFactory.productRegister[type];
		if (!productClass) {
			throw new BadRequestError(`Invalid Product Type: ${type}`);
		}
		return new productClass(payload).createProduct();
	}

	static async updateProduct(type, productId, payload) {
		const productClass = ProductFactory.productRegister[type];
		if (!productClass) {
			throw new BadRequestError(`Invalid Product Type: ${type}`);
		}
		return new productClass(payload).updateProduct(productId);
	}
	// PUT
	static async publishProductByShop({ shop_id, product_id }) {
		return await publishProductByShop({ shop_id, product_id });
	}
	static async unPublishProductByShop({ shop_id, product_id }) {
		return await unPublishProductByShop({ shop_id, product_id });
	}
	// QUERY
	static async findAllDraftForShop({ product_shop, skip = 0, limit = 50 }) {
		const query = { product_shop: product_shop, is_draft: true };
		return await findAllDraftForShop({ query, limit, skip });
	}

	static async findAllPublishForShop({ product_shop, skip = 0, limit = 50 }) {
		const query = { product_shop: product_shop, is_published: true };
		return await findAllPublishForShop({ query, limit, skip });
	}

	static async searchProductByUser({ keySearch }) {
		return await searchProductByUser({ keySearch });
	}

	static async findAllProducts({ limit = 50, sort = 'ctime', page = 1, filter = { is_published: true } }) {
		return await findAllProducts({
			limit,
			sort,
			page,
			filter,
			select: ['product_name', 'product_price', 'product_thumb', 'product_shop'],
		});
	}

	static async findProduct({ product_id }) {
		return await findProduct({ product_id, unSelect: ['__v'] });
	}
}

// define base product class
class Product {
	constructor({
		product_name,
		product_thumb,
		product_description,
		product_price,
		product_quantity,
		product_type,
		product_shop,
		product_attributes,
	}) {
		this.product_name = product_name;
		this.product_thumb = product_thumb;
		this.product_description = product_description;
		this.product_price = product_price;
		this.product_quantity = product_quantity;
		this.product_type = product_type;
		this.product_shop = product_shop;
		this.product_attributes = product_attributes;
	}
	// create Product
	async createProduct(product_id) {
		const newProduct = await product.create({ ...this, _id: product_id });

		// insert product to inventory
		if (newProduct) {
			await insertInventory({
				productId: newProduct._id,
				shopId: this.product_shop,
				stock: this.product_quantity,
			});

			// push to notify system
			NotificationService.PushToNotifySystem({
				type: NotifyEnum.SHOP_NEW_PRO,
				receiver: 1,
				sender: this.product_shop,
				options: {
					product_name: this.product_name,
					shop_name: this.product_shop,
				},
			})
				.then((rs) => console.log(rs))
				.catch((err) => console.log(err));
		}

		return newProduct;
	}

	// update Product
	async updateProduct(productId, bodyUpdate) {
		return await updateProductById({ productId, bodyUpdate, model: product });
	}
}

// define clothing class
class Clothing extends Product {
	async createProduct() {
		const newClothing = await clothing.create({
			...this.product_attributes,
			product_shop: this.product_shop,
		});
		if (!newClothing) throw new BadRequestError('Create new clothing error');

		const newProduct = await super.createProduct(newClothing._id);
		if (!newProduct) throw new BadRequestError('Create new product error');

		return newProduct;
	}

	async updateProduct(productId) {
		//1. Remove attr has null or undefined
		// const obj1 = updateNestedObjectParse(this);
		// console.log('000000 :>> ', obj1);
		const objectParams = removeUndefinedObject(this);

		//2. Check xem update o dau
		if (objectParams.product_attributes) {
			// update child clothing model
			await updateProductById({
				productId,
				bodyUpdate: updateNestedObjectParse(objectParams.product_attributes),
				model: clothing,
			});
		}

		// update parent product model
		const updateProduct = await super.updateProduct(productId, updateNestedObjectParse(objectParams));
		return updateProduct;
	}
}

// define electronic class
class Electronic extends Product {
	async createProduct() {
		const newElectronic = await electronic.create({
			...this.product_attributes,
			product_shop: this.product_shop,
		});
		if (!newElectronic) throw new BadRequestError('Create new electronic error');

		const newProduct = await super.createProduct(newElectronic._id);
		if (!newProduct) throw new BadRequestError('Create new product error');

		return newProduct;
	}
}

class Furniture extends Product {
	async createProduct() {
		const newFurniture = await furniture.create({
			...this.product_attributes,
			product_shop: this.product_shop,
		});
		if (!newFurniture) throw new BadRequestError('Create new electronic error');

		const newProduct = await super.createProduct(newFurniture._id);
		if (!newProduct) throw new BadRequestError('Create new product error');

		return newProduct;
	}
}

// Register product types
ProductFactory.registerProductType('Clothing', Clothing);
ProductFactory.registerProductType('Electronic', Electronic);
ProductFactory.registerProductType('Furniture', Furniture);

module.exports = ProductFactory;
