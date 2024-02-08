'use strict';

const {
    product,
    clothing,
    electronic,
    furniture
} = require('../product.model');
const { Types } = require('mongoose');

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
            { score: { $meta: 'textScore' } }
        )
        .sort({ score: { $meta: 'textScore' } })
        .lean();
    return results;
};

const publishProductByShop = async ({ shop_id, product_id }) => {
    const foundShop = await product.findOne({
        product_shop: new Types.ObjectId(shop_id),
        _id: new Types.ObjectId(product_id)
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
        _id: new Types.ObjectId(product_id)
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

module.exports = {
    findAllDraftForShop,
    findAllPublishForShop,
    publishProductByShop,
    unPublishProductByShop,
    searchProductByUser
};
