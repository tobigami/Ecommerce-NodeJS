'use strict';

const Comment = require('../models/comment.model');
const { convertToObjectIdMongodb } = require('../utils');
const { NotFoundError } = require('../core/error.response');
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
            console.log('di vao day roi nay');
            // reply comment
            /**
             * check parent comment is exits
             *
             */

            const parentComment = await Comment.findById(parentId);
            if (!parentComment) throw new NotFoundError('Could not find parent Comment');

            rightValue = parentComment.comment_right;

            await Comment.updateMany(
                {
                    comment_productId: convertToObjectIdMongodb(productId),
                    comment_right: { $gte: rightValue }
                },
                {
                    $inc: { comment_right: 2 }
                }
            );

            await Comment.updateMany(
                {
                    comment_productId: convertToObjectIdMongodb(productId),
                    comment_left: { $gt: rightValue }
                },
                {
                    $inc: { comment_left: 2 }
                }
            );

            rightValue = parentComment.comment_right;
        } else {
            // add comment
            const maxRightValue = await Comment.findOne(
                {
                    comment_productId: convertToObjectIdMongodb(productId)
                },
                'comment_right',
                {
                    sort: { comment_right: -1 }
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
