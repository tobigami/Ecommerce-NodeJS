'use strict';

const { CREATED, SuccessResponse } = require('../core/success.response');
const AccessService = require('../services/access.service');

class AccessController {
    logout = async (req, res, next) => {
        return new SuccessResponse({
            message: 'Logout Successfully',
            metadata: await AccessService.logout({ keyStore: req.keyStore }),
        }).send(res);
    };

    login = async (req, res, next) => {
        return new SuccessResponse({
            message: 'Login Successfully',
            metadata: await AccessService.login(req.body),
        }).send(res);
    };

    signUp = async (req, res, next) => {
        return new CREATED({
            message: 'Register OK',
            metadata: await AccessService.signUp(req.body),
            option: {
                limit: 10,
            },
        }).send(res);
    };
}

module.exports = new AccessController();
