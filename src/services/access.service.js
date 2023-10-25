'use strict';

const shopModel = require('../models/shop.model');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { createKeyToken } = require('./keyToken.service');
const { createTokenPair } = require('../auth/authUtils');
const { getInfoData } = require('../utils');
const { BadRequestError, AuthFailureError } = require('../core/error.response');
const { findByEmail } = require('./shop.service');
const KeyTokenService = require('./keyToken.service');

const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN',
};

class AccessService {
    static logout = async ({ keyStore }) => {
        const delKey = await KeyTokenService.removeKeyById(keyStore._id);
        return delKey;
    };

    static login = async ({ email, password, refreshToken = null }) => {
        /**
         * 1. Check email in db
         * 2. Match Password
         * 3. Create and Save AT, RT
         * 4. Generate token
         * 5. Return data login
         */

        //1. Check email
        const foundShop = await findByEmail({ email });
        if (!foundShop) throw new BadRequestError('Shop not registered');

        //2. Match password
        const match = bcrypt.compare(password, foundShop.password);
        if (!match) throw new AuthFailureError('Authentication Error');

        //3. Create private key and public key
        const privateKey = crypto.randomBytes(64).toString('hex');
        const publicKey = crypto.randomBytes(64).toString('hex');

        //4. Create Token
        const tokens = await createTokenPair({ userId: foundShop._id, email }, publicKey, privateKey);

        await KeyTokenService.createKeyToken({
            refreshToken: tokens.refreshToken,
            privateKey,
            publicKey,
            userId: foundShop._id,
        });

        return {
            metadata: getInfoData({ fields: ['_id', 'name', 'email'], object: foundShop }),
            tokens,
        };
    };

    static signUp = async ({ name, email, password }) => {
        // step 1: check email exists?
        const holderShop = await shopModel.findOne({ email }).lean();
        if (holderShop) {
            throw new BadRequestError('Error: Email already register');
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const newShop = await shopModel.create({
            name,
            email,
            password: passwordHash,
            roles: [RoleShop.SHOP],
        });

        if (newShop) {
            // create public key and private key
            const privateKey = crypto.randomBytes(64).toString('hex');
            const publicKey = crypto.randomBytes(64).toString('hex');

            // Save collection keyStore
            const keyStore = await createKeyToken({
                userId: newShop._id,
                publicKey,
                privateKey,
            });

            if (!keyStore) {
                return {
                    code: 'xxxx',
                    message: 'error publickeyString',
                };
            }

            // create token pair
            const tokens = await createTokenPair({ userId: newShop._id, email }, publicKey, privateKey);

            return {
                code: 201,
                metadata: {
                    shop: getInfoData({ fields: ['_id', 'name', 'email'], object: newShop }),
                    tokens,
                },
            };
        }

        return {
            code: 200,
            metadata: null,
        };
    };
}

module.exports = AccessService;
