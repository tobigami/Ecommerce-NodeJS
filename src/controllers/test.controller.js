'use strict';

const { SuccessResponse } = require('../core/success.response');
const TestService = require('../services/test.service');

class TestController {
	createTest = async (req, res, next) => {
		return new SuccessResponse({
			message: 'create test successfully',
			metadata: await TestService.createTest(req.body)
		}).send(res);
	};
}

module.exports = new TestController();
