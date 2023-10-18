'use strict';

const { CREATED } = require('../core/success.response');
const AccessService = require('../services/access.service');

class AccessController {
    signUp = async (req, res, next) => {
        return new CREATED({
            message: 'Register OK',
            metadata: await AccessService.signUp(req.body),
            option: {
                limit: 1411,
            },
        }).send(res);
    };
}

module.exports = new AccessController();
