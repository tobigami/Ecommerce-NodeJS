'use strict';

const { findById } = require('../services/apikey.service');

const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization',
};

const apiKey = async (req, res, next) => {
    try {
        const key = req.headers[HEADER.API_KEY]?.toString();
        if (!key) {
            return res.status(403).json({
                message: 'Forbidden Error 123',
            });
        }

        const objKey = await findById(key);
        console.log('objKey', objKey);
        if (!objKey) {
            return res.status(403).json({
                message: 'Forbidden Error 456',
            });
        }

        req.objKey = objKey;
        return next();
    } catch (error) {}
};

const permission = (permission) => {
    return (req, res, next) => {
        if (!req.objKey.permissions) {
            return res.status(403).json({
                message: 'Permission Denied',
            });
        }

        const validatePermission = req.objKey.permissions.includes(permission);
        if (!validatePermission) {
            return res.status(403).json({
                message: 'Permission Denied',
            });
        }
        return next();
    };
};

module.exports = { apiKey, permission };
