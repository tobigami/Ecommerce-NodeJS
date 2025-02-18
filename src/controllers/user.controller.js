'use strict';

const { SuccessResponse } = require('../core/success.response');
const UserService = require('../services/user.service');

class UserController {
	getInfo = async (req, res, next) => {
		console.log(req.headers);
		return new SuccessResponse({
			message: 'get info successfully',
			metadata: await UserService.getInfo(req.headers['x-client-id'])
		}).send(res);
	};
}

module.exports = new UserController();
