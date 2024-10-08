'use strict';
const { BadRequestError } = require('../core/error.response');
const { SuccessResponse } = require('../core/success.response');
const UploadService = require('../services/upload.service');

class Upload {
	upLoadByUrl = async (req, res, next) => {
		return new SuccessResponse({
			message: 'Upload Image success!',
			metadata: await UploadService.uploadByUrl(req.body.url)
		}).send(res);
	};

	upLoadByFile = async (req, res, next) => {
		const { file } = req;
		if (!file) throw new BadRequestError('Invalid file');
		return new SuccessResponse({
			message: 'Upload Image success!',
			metadata: await UploadService.uploadByFile(file)
		}).send(res);
	};

	upLoadByFiles = async (req, res, next) => {
		const { files } = req;
		if (!files.length) throw new BadRequestError('Invalid file');
		return new SuccessResponse({
			message: 'Upload Image success!',
			metadata: await UploadService.uploadByFiles({ files: files, ...res.body })
		}).send(res);
	};
}

module.exports = new Upload();
