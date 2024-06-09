'use strict';

const { SuccessResponse } = require('../core/success.response');
const NotificationService = require('../services/notification.service');

class notificationController {
    getListNotifyByUser = async (req, res, next) => {
        return new SuccessResponse({
            message: 'Get list notification success',
            metadata: await NotificationService.GetListNotifyByUser(req.query)
        }).send(res);
    };
}

module.exports = new notificationController();
