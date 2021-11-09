const jwt = require('jsonwebtoken');

const {
    JWT_ACCESS_SECRET,
    JWT_ACTION_SECRET,
    JWT_AGREE_SECRET,
    JWT_REFRESH_SECRET,
    JWT_REFUSE_SECRET
} = require('../config/config');
const {ErrorBuilder, Errors} = require('../errorHandler');
const {tokenTypeEnum} = require('../config');

module.exports = {
    generateTokenPair: () => {
        const access_token = jwt.sign({}, JWT_ACCESS_SECRET, {expiresIn: '15m'});
        const refresh_token = jwt.sign({}, JWT_REFRESH_SECRET, {expiresIn: '30d'});

        return {
            access_token,
            refresh_token
        };
    },

    createActionToken: () => jwt.sign({}, JWT_ACTION_SECRET, {expiresIn: '1d'}),

    verifyToken: async (token, tokenType = tokenTypeEnum.ACCESS) => {
        try {
            let secret = '';
            switch (tokenType) {
                case tokenTypeEnum.ACCESS:
                    secret = JWT_ACCESS_SECRET;
                    break;
                case tokenTypeEnum.REFRESH:
                    secret = JWT_REFRESH_SECRET;
                    break;
                case tokenTypeEnum.ACTION:
                    secret = JWT_ACTION_SECRET;
                    break;
                case tokenTypeEnum.AGREE:
                    secret = JWT_AGREE_SECRET;
                    break;
                case tokenTypeEnum.REFUSE:
                    secret = JWT_REFUSE_SECRET;
                    break;
            }

            await jwt.verify(token, secret);
        } catch (e) {
            ErrorBuilder(Errors.err401);
        }
    },

    generateRentToken: () => {
        const agree_token = jwt.sign({}, JWT_AGREE_SECRET, {expiresIn: '1d'});
        const refuse_token = jwt.sign({}, JWT_REFUSE_SECRET, {expiresIn: '1d'});

        return {
            agree_token,
            refuse_token
        };
    },

    verifyRent: async (token) => {
        try {
            await jwt.verify(token, JWT_AGREE_SECRET);
        } catch (e) {
            try {
                await jwt.verify(token, JWT_REFUSE_SECRET);
            } catch (e) {
                ErrorBuilder(Errors.err401);
            }
        }
    },
};
