'use strict';

const testModel = require('../models/test.model');
const commentModel = require('../models/comment.model');
const { convertToObjectIdMongodb } = require('../utils');

class TestService {
    static async createTest({ name, old, gender, shop }) {
        const comment = await commentModel.findOne({
            comment_productId: convertToObjectIdMongodb(shop)
        });

        console.log('comment', comment);

        const newTest = await testModel.create({
            test_shop: shop,
            test_name: name,
            test_old: old,
            test_gender: gender
        });

        return newTest;
    }
}

module.exports = TestService;
