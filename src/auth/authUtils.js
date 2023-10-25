const JWT = require('jsonwebtoken');
const asyncHandler = require('../helper/asyncHandler');
const { AuthFailureError, NotFoundError } = require('../core/error.response');
const { findByUserId } = require('../services/keyToken.service');

const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization',
};

const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        const accessToken = await JWT.sign(payload, publicKey, {
            expiresIn: '2 days',
        });

        const refreshToken = await JWT.sign(payload, privateKey, {
            expiresIn: '7 days',
        });

        JWT.verify(accessToken, publicKey, (err, decode) => {
            if (err) {
                console.log('error verify', err);
            } else {
                console.log('decode verify', decode);
            }
        });

        return { accessToken, refreshToken };
    } catch (error) {}
};

const authentication = asyncHandler(async (req, res, next) => {
    /**
     * 1. Check userID missing
     * 2. Get accessToken
     * 3. Verify Token
     * 4. Check id in DB
     * 5. Check keyStore with this useId
     * 6. OK next()
     */

    // 1
    const userId = req.headers[HEADER.CLIENT_ID];
    if (!userId) throw new AuthFailureError('Invalid Request');

    //2
    const keyStore = await findByUserId(userId);
    if (!keyStore) throw new NotFoundError('Not found key store');

    //3
    const accessToken = req.headers[HEADER.AUTHORIZATION];
    if (!accessToken) throw new AuthFailureError('Invalid Request');

    try {
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
        if (decodeUser.userId !== userId) throw new AuthFailureError('Invalid User Id');
        req.keyStore = keyStore;
        return next();
    } catch (error) {
        throw error;
    }
});

module.exports = {
    createTokenPair,
    authentication,
};
