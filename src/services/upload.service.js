'use strict';
const cloudinary = require('../configs/cloudinary.config');

class UploadService {
	static uploadByUrl = async (url) => {
		return await cloudinary.uploader.upload(url);
	};
}

module.exports = UploadService;
