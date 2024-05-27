'use  strict';

const { Schema, model } = require('mongoose');

const DOCUMENT_NAME = 'Comment';
const COLLECTION_NAME = 'Comments';

const commentSchema = new Schema(
    {
        comment_userId: { type: Number, required: true, default: 1 },
        comment_productId: { type: Schema.Types.ObjectId, required: true, ref: 'Product' },
        comment_content: { type: String, required: true, default: 'content' },
        comment_parentId: { type: Schema.Types.ObjectId, ref: DOCUMENT_NAME },
        comment_left: { type: Number, required: true, default: 1 },
        comment_right: { type: Number, required: true, default: 1 },
        comment_isDelete: { type: Boolean, default: false }
    },
    {
        collation: COLLECTION_NAME,
        timestamps: true
    }
);

module.exports = model(DOCUMENT_NAME, commentSchema);
