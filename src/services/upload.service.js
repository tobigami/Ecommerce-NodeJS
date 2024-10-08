'use strict';
const cloudinary = require('../configs/cloudinary.config');

class UploadService {
	// upload S3

	// upload cloudinary
	static uploadByUrl = async (url) => {
		return await cloudinary.uploader.upload(url);
	};

	static uploadByFile = async ({ path, folderName = 'product/1411' }) => {
		const result = await cloudinary.uploader.upload(path, {
			public_id: 'thumb',
			folder_name: folderName
		});

		return {
			shopId: 1411,
			image_url: result.secure_url,
			thumb_url: await cloudinary.url(result.public_id, {
				width: 100,
				height: 100,
				format: 'jpg'
			})
		};
	};

	static uploadByFiles = async ({ files, folderName = 'product/1411' }) => {
		if (!files.length) return;
		let uploadList = [];
		for (const file of files) {
			const res = await cloudinary.uploader.upload(file.path, {
				folder_name: folderName
			});
			uploadList.push({
				shopId: 1411,
				image_url: res.secure_url,
				thumb_url: await cloudinary.url(res.public_id, {
					width: 100,
					height: 100,
					format: 'jpg'
				})
			});
		}

		return uploadList;
	};
}

module.exports = UploadService;
