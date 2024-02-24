'use strict';

const { SuccessResponse } = require('../core/success.response');
const ProductService = require('../services/product.service');

class ProductController {
    createProduct = async (req, res, next) => {
        return new SuccessResponse({
            message: 'Create Product success!',
            metadata: await ProductService.createProduct(req.body.product_type, {
                ...req.body,
                product_shop: req.user.userId
            })
        }).send(res);
    };

    updateProduct = async (req, res, next) => {
        return new SuccessResponse({
            message: `Update Product Success`,
            metadata: await ProductService.updateProduct(
                req.body.product_type,
                req.params.productId,
                {
                    ...req.body,
                    product_shop: req.user.userId
                }
            )
        }).send(res);
    };

    /**
     *
     * @param {String} shop_id
     * @param {String} product_id
     * @returns {JSON}
     */
    publishProductByShop = async (req, res, next) => {
        return new SuccessResponse({
            message: 'Publish Product success!',
            metadata: await ProductService.publishProductByShop({
                shop_id: req.user.userId,
                product_id: req.params.id
            })
        }).send(res);
    };

    /**
     *
     * @param {String} shop_id
     * @param {String} product_id
     * @returns {JSON}
     */
    unPublishProductByShop = async (req, res, next) => {
        return new SuccessResponse({
            message: 'Unpublish Product success!',
            metadata: await ProductService.unPublishProductByShop({
                shop_id: req.user.userId,
                product_id: req.params.id
            })
        }).send(res);
    };

    /**
     * @desc Get all draft product by shop
     * @param {String} product_shop
     * @returns {JSON}
     */
    getAllDraftProductForShop = async (req, res, next) => {
        return new SuccessResponse({
            message: 'Get All Draft Product!',
            metadata: await ProductService.findAllDraftForShop({
                product_shop: req.user.userId
            })
        }).send(res);
    };

    /**
     * @desc Get all publish product by shop
     * @param {String} product_shop
     * @returns {JSON}
     */
    getAllPublishProductForShop = async (req, res, next) => {
        return new SuccessResponse({
            message: 'Get All Published Product!',
            metadata: await ProductService.findAllPublishForShop({
                product_shop: req.user.userId
            })
        }).send(res);
    };

    /**
     * @desc Search list product
     * @param {String} keySearch
     * @returns {JSON}
     */
    getListSearchProduct = async (req, res, next) => {
        return new SuccessResponse({
            message: 'Get List Search Product!',
            metadata: await ProductService.searchProductByUser(req.params)
        }).send(res);
    };

    findAllProducts = async (req, res, next) => {
        return new SuccessResponse({
            message: 'Get list findAllProducts success',
            metadata: await ProductService.findAllProducts(req.params)
        }).send(res);
    };

    findProduct = async (req, res, next) => {
        return new SuccessResponse({
            message: 'Get Product Detail success',
            metadata: await ProductService.findProduct(req.params)
        }).send(res);
    };
}

module.exports = new ProductController();
