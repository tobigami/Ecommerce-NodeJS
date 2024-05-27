'use strict';

const CommentService = require('../services/comment.service');
const { SuccessResponse } = require('../core/success.response');

class CommentController {
    addComment = async (req, res, next) => {
        return new SuccessResponse({
            message: 'Add comment Success',
            metadata: await CommentService.addComment(req.body)
        }).send(res);
    };
}

module.exports = new CommentController();
