'use strict';

const {
    product,
    clothing,
    electronic,
    furniture
} = require('../models/product.model');
const { BadRequestError, ForbiddenError } = require('../core/error.response');
const { findAllDraftForShop } = require('../models/repositories/product.repo')

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

    static async createProduct(type, payload) {
        const productClass = ProductFactory.productRegister[type];
        if (!productClass) {
            throw new BadRequestError(`Invalid Product Type: ${type}`);
        }
        return new productClass(payload).createProduct();
    }

    static async findAllDraftForShop({ product_shop, skip = 0, limit = 50 }) {
        const query = { product_shop: product_shop, is_draft: true }
        return await findAllDraftForShop({ query, limit, skip })
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
        product_attributes
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
        return await product.create({ ...this, _id: product_id });
    }
}

// define clothing class
class Clothing extends Product {
    async createProduct() {
        const newClothing = await clothing.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        });
        if (!newClothing)
            throw new BadRequestError('Create new clothing error');

        const newProduct = await super.createProduct(newClothing._id);
        if (!newProduct) throw new BadRequestError('Create new product error');

        return newProduct;
    }
}

// define electronic class
class Electronic extends Product {
    async createProduct() {
        const newElectronic = await electronic.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        });
        if (!newElectronic)
            throw new BadRequestError('Create new electronic error');

        const newProduct = await super.createProduct(newElectronic._id);
        if (!newProduct) throw new BadRequestError('Create new product error');

        return newProduct;
    }
}

class Furniture extends Product {
    async createProduct() {
        const newFurniture = await furniture.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        });
        if (!newFurniture)
            throw new BadRequestError('Create new electronic error');

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
