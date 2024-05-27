'use strict';

const Comment = require('../models/comment.model');
const { convertToObjectIdMongodb } = require('../utils');
const { Types } = require('mongoose');
/**
 * 1. Add comment [User, Shop]
 * 2. Get list child comment [User, Shop]
 * 3. Delete Comment [User, Shop, Admin]
 */

class CommentService {
    static async addComment({ productId, content, parentId, userId }) {
        const comment = new Comment({
            comment_productId: productId,
            comment_userId: userId,
            comment_parentId: parentId,
            comment_content: content
        });

        let rightValue;

        if (parentId) {
            // reply comment
        } else {
            // add comment
            const maxRightValue = await Comment.findOne(
                {
                    comment_productId: convertToObjectIdMongodb(productId)
                },
                'comment_right',
                {
                    sort: { comment_right: -1 },
                    collation: { locale: 'en', strength: 2 } // Example collation object
                }
            );

            if (maxRightValue) {
                rightValue = maxRightValue.comment_right + 1;
            } else {
                rightValue = 1;
            }
        }

        comment.comment_left = rightValue;
        comment.comment_right = rightValue + 1;

        return await comment.save();
    }
}

module.exports = CommentService;
