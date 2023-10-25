'use strict';

const keyTokenModel = require('../models/keyToken.model');
const {
    Types: { ObjectId },
} = require('mongoose');

class KeyTokenService {
    static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }) => {
        try {
            // level 0
            // const token = await keyTokenModel.create({
            //     user: userId,
            //     privateKey,
            //     publicKey,
            // });
            // return token ? token.publicKey : null;
            // level 1

            const filter = { user: userId },
                update = { publicKey, privateKey, refreshTokenUsed: [], refreshToken },
                options = {
                    upsert: true,
                    new: true,
                };

            const token = await keyTokenModel.findOneAndUpdate(filter, update, options);

            return token ? token.publicKey : null;
        } catch (error) {
            return error;
        }
    };

    static findByUserId = async (userId) => {
        return await keyTokenModel.findOne({ user: new ObjectId(userId) }).lean();
    };

    static removeKeyById = async (id) => {
        return await keyTokenModel.deleteOne({ _id: new ObjectId(id) });
    };
}

module.exports = KeyTokenService;
