'use strict';
const crypto = require('crypto');
const cloudinary = require('../configs/cloudinary.config');
const { PutObjectCommand, S3, GetObjectCommand } = require('../configs/s3.config');
const { getSignedUrl } = require('@aws-sdk/cloudfront-signer');

const { AWS_S3_NAME, AWS_CLOUD_FRONT, CLOUD_FRONT_PRIVATE_KEY, AWS_KEY_PUBLIC_ID } = process.env;

class UploadService {
	// upload cloudinary
	static uploadByUrl = async (url) => {
		return await cloudinary.uploader.upload(url);
	};

	static uploadByFile = async ({ path, folderName = 'product/1411' }) => {
		const result = await cloudinary.uploader.upload(path, {
			public_id: 'thumb',
			folder_name: folderName,
		});

		return {
			shopId: 1411,
			image_url: result.secure_url,
			thumb_url: await cloudinary.url(result.public_id, {
				width: 100,
				height: 100,
				format: 'jpg',
			}),
		};
	};

	static uploadByFiles = async ({ files, folderName = 'product/1411' }) => {
		if (!files.length) return;
		let uploadList = [];
		for (const file of files) {
			const res = await cloudinary.uploader.upload(file.path, {
				folder_name: folderName,
			});
			uploadList.push({
				shopId: 1411,
				image_url: res.secure_url,
				thumb_url: await cloudinary.url(res.public_id, {
					width: 100,
					height: 100,
					format: 'jpg',
				}),
			});
		}
		return uploadList;
	};

	// upload S3 use cloud front
	static uploadS3ByFile = async (file) => {
		const randomImageName = crypto.randomBytes(16).toString('hex');
		const command = new PutObjectCommand({
			Bucket: AWS_S3_NAME,
			Key: randomImageName,
			Body: file.buffer,
			ContentType: file.mimetype,
		});

		// upload file to S3 server
		const uploadResult = await S3.send(command);

		const url = await getSignedUrl({
			url: `${AWS_CLOUD_FRONT}/${randomImageName}`,
			keyPairId: AWS_KEY_PUBLIC_ID,
			dateLessThan: new Date(Date.now() + 1000 * 60),
			privateKey: CLOUD_FRONT_PRIVATE_KEY,
		});
		return {
			url,
			...uploadResult,
		};
	};

	// upload S3 without cloud front
	static uploadS3ByFileWo = async (file) => {
		const randomImageName = crypto.randomBytes(16).toString('hex');
		const command = new PutObjectCommand({
			Bucket: AWS_S3_NAME,
			Key: randomImageName,
			Body: file.buffer,
			ContentType: file.mimetype,
		});

		// upload file to S3 server
		const uploadResult = await S3.send(command);
		const url = await getSignedUrl({
			url: `${AWS_CLOUD_FRONT}/${randomImageName}`,
			keyPairId: AWS_KEY_PUBLIC_ID,
			dateLessThan: new Date(Date.now() + 1000 * 60),
			privateKey: CLOUD_FRONT_PRIVATE_KEY,
		});
		return {
			url,
			...uploadResult,
		};
	};
}

module.exports = UploadService;
