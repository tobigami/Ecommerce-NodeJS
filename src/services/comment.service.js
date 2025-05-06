'use strict';

const Comment = require('../models/comment.model');
const { findProduct } = require('../models/repositories/product.repo');
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
			comment_content: content,
		});

		let rightValue;

		if (parentId) {
			const parentComment = await Comment.findById(parentId);
			if (!parentComment) throw new NotFoundError('Could not find parent Comment');

			rightValue = parentComment.comment_right;

			await Comment.updateMany(
				{
					comment_productId: convertToObjectIdMongodb(productId),
					comment_right: { $gte: rightValue },
				},
				{
					$inc: { comment_right: 2 },
				},
			);

			await Comment.updateMany(
				{
					comment_productId: convertToObjectIdMongodb(productId),
					comment_left: { $gt: rightValue },
				},
				{
					$inc: { comment_left: 2 },
				},
			);

			rightValue = parentComment.comment_right;
		} else {
			// add comment
			const maxRightValue = await Comment.findOne(
				{
					comment_productId: convertToObjectIdMongodb(productId),
				},
				'comment_right',
				{
					sort: { comment_right: -1 },
				},
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

	static async getCommentsByParentId({
		productId,
		parentId = null,
		limit = 2,
		skip = 0, // skip
	}) {
		if (parentId) {
			const foundComment = await Comment.findById(convertToObjectIdMongodb(parentId));
			if (!foundComment) throw new NotFoundError('Not found comment for product');

			const comments = await Comment.find({
				comment_productId: productId,
				comment_left: { $gt: foundComment.comment_left },
				comment_right: { $lt: foundComment.comment_right },
			})
				.select({
					comment_left: 1,
					comment_right: 1,
					comment_content: 1,
					comment_parentId: 1,
				})
				.sort({
					comment_left: 1,
				})
				.limit(limit)
				.skip(skip);

			return comments;
		}

		const comments = await Comment.find({
			comment_productId: productId,
			comment_parentId: parentId,
		})
			.select({
				comment_left: 1,
				comment_right: 1,
				comment_content: 1,
				comment_parentId: 1,
			})
			.sort({
				comment_left: 1,
			})
			.limit(limit)
			.skip(skip);

		return comments;
	}

	static async deleteComment({ productId, commentId }) {
		// 1. Check product Id
		const foundProduct = await findProduct({ product_id: productId });
		if (!foundProduct) throw new NotFoundError('Could not found this product');

		// 2. xac dinh left right cua comment
		const comment = await Comment.findById(commentId);
		if (!comment) throw new NotFoundError('Could not found comment');

		const rightValue = comment.comment_right;
		const leftValue = comment.comment_left;
		const width = rightValue - leftValue + 1;

		// 3. Xoa cac comment con va commentId
		await Comment.deleteMany({
			comment_productId: convertToObjectIdMongodb(productId),
			comment_left: { $gte: leftValue, $lte: rightValue },
		});

		// 4. Cap nhat lai gia tri left right cho cac comment con lai
		await Comment.updateMany(
			{
				comment_productId: convertToObjectIdMongodb(productId),
				comment_right: { $gt: rightValue },
			},
			{
				$inc: { comment_right: -width },
			},
		);

		await Comment.updateMany(
			{
				comment_productId: convertToObjectIdMongodb(productId),
				comment_left: { $gt: rightValue },
			},
			{
				$inc: { comment_left: -width },
			},
		);
		return true;
	}
}

module.exports = CommentService;
