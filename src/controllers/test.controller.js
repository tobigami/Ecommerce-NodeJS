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
}

module.exports = new TestController();
