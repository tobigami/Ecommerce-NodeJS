'use strict';

const cartModel = require('../cart.model');

const createUserCart = async ({ userId, product }) => {
    const query = { cart_userId: userId, cart_state: 'active' },
        updateOrInsert = {
            $addToSet: {
                cart_products: product
            }
        },
        options = { upsert: true, new: true };

    return await cartModel.findOneAndUpdate(query, updateOrInsert, options);
};

const updateUserCartQuantity = async ({ userId, product }) => {
    const { productId, quantity } = product;
    const query = {
            cart_userId: userId,
            cart_state: 'active',
            'cart_products.productId': productId
        },
        updateSet = {
            $inc: {
                'cart_products.$.quantity': quantity
            }
        },
        options = { new: true, upSert: true };

    return await cartModel.findOneAndUpdate(query, updateSet, options);
};

module.exports = { createUserCart, updateUserCartQuantity };
