'use strict';
const { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { AWS_S3_API_KEY, AWS_S3_SECRET_KEY } = process.env;

const s3Config = {
	region: 'ap-southeast-1',
	credentials: {
		accessKeyId: AWS_S3_API_KEY,
		secretAccessKey: AWS_S3_SECRET_KEY
	}
};

const S3 = new S3Client(s3Config);

module.exports = {
	S3,
	PutObjectCommand,
	GetObjectCommand,
	DeleteObjectCommand
};
