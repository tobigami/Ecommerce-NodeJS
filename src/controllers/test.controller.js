'use strict';

const { SuccessResponse } = require('../core/success.response');
const TestService = require('../services/test.service');

class TestController {
	createTest = async (req, res, next) => {
		return new SuccessResponse({
			message: 'create test successfully',
			metadata: await TestService.createTest(req.body),
		}).send(res);
	};

	getFavourites = async (req, res, next) => {
		return new SuccessResponse({
			message: 'get favourites successfully',
			metadata: await TestService.getFavourites(req.query),
		}).send(res);
	};

	addFavorite = async (req, res, next) => {
		return new SuccessResponse({
			message: 'add favourite successfully',
			metadata: await TestService.addFavourites(req.body),
		}).send(res);
	};

	bulkDeleteFavorite = async (req, res, next) => {
		return new SuccessResponse({
			message: 'bulk delete favourite successfully',
			metadata: await TestService.bulkDeleteFavourites(req.body.ids),
		}).send(res);
	};

	// history
	getHistory = async (req, res, next) => {
		return new SuccessResponse({
			message: 'get history successfully',
			metadata: await TestService.getHistory(req.query),
		}).send(res);
	};

	bulkDeleteHistory = async (req, res, next) => {
		return new SuccessResponse({
			message: 'bulk delete history successfully',
			metadata: await TestService.bulkDeleteHistory(req.body.ids),
		}).send(res);
	};

	// click tracking
	addClickTracking = async (req, res, next) => {
		return new SuccessResponse({
			message: 'add click tracking successfully',
			metadata: await TestService.addClickTracking(req.body),
		}).send(res);
	};

	// download wo stream
	downloadWoStream = async (req, res, next) => {
		return new SuccessResponse({
			message: 'download with out stream',
			metadata: await TestService.downloadWithoutStream(),
		}).send(res);
	};

	downloadWiStream = async (req, res, next) => {
		try {
			const { stream, filename, mimetype, size } = await TestService.downloadWithStream();

			// Set headers for file download
			res.setHeader('Content-Type', mimetype);
			res.setHeader('Content-Length', size);
			res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

			// Pipe the stream directly to response
			stream.pipe(res);

			// Handle stream errors
			stream.on('error', (error) => {
				console.error('Stream error:', error);
				if (!res.headersSent) {
					res.status(500).json({ error: 'File streaming failed' });
				}
			});
		} catch (error) {
			next(error);
		}
	};

	viewCount = async (req, res, next) => {
		const ip1 = req.headers['x-forwarded-for'];
		const ip2 = req.ip;

		console.log('ip1', ip1);
		console.log('ip2', ip2);
		return new SuccessResponse({
			message: 'View count successfully',
			metadata: await TestService.viewCount(req.body),
		}).send(res);
	};
}

module.exports = new TestController();
