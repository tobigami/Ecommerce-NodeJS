'use strict';

const { SuccessResponse } = require('../core/success.response');
const TarotService = require('../services/tarot.service');

class TarotController {
	reading = async (req, res) => {
		const userIp =
			req.ip || req.headers['x-forwarded-for']?.split(',').shift() || req.socket?.remoteAddress;
		return new SuccessResponse({
			message: 'reading successfully',
			metadata: await TarotService.reading({ ...req.body, ip: userIp }),
		}).send(res);
	};

	addFeedback = async (req, res) => {
		return new SuccessResponse({
			message: 'add feedback successfully',
			metadata: await TarotService.addFeedback({ ...req.body }),
		}).send(res);
	};
}

module.exports = new TarotController();
