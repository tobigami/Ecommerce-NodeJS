'use strict';
const { SuccessResponse } = require('../core/success.response');
const UploadService = require('../services/upload.service');

class Upload {
	upLoadByUrl = async (req, res, next) => {
		return new SuccessResponse({
			message: 'Upload Image success!',
			metadata: await UploadService.uploadByUrl(req.body.url)
		}).send(res);
	};
}

module.exports = new Upload();
