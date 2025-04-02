'use strict';

const { SuccessResponse } = require('../core/success.response');
const IpaService = require('../services/ipa.service');

class IpaController {
	getIPA = async (req, res, next) => {
		return new SuccessResponse({
			message: 'Get IPA successfully',
			metadata: await IpaService.getIpa(req.body),
		}).send(res);
	};
}

module.exports = new IpaController();
