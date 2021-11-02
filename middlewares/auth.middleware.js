const {authValidator} = require('../validators');
const {ErrorBuilder, Errors} = require('../errorHandler');
const {Action, User, oAuth} = require('../dataBase');
const {jwtService} = require('../services');
const {tokenTypeEnum, constants} = require('../config');

module.exports = {
    checkActivateToken: async (req, res, next) => {
        try {
            const {token} = req.params;
            await jwtService.verifyToken(token, tokenTypeEnum.ACTION);

            const {user_id: user, _id} = await Action.findOne({token, type: tokenTypeEnum.ACTION}).populate('user_id');

            if (!user) {
                ErrorBuilder(Errors.err401);
            }

            await Action.deleteOne({_id});
            req.user = user;

            next();
        } catch (e) {
            next(e);
        }
    },

    isAuthValid: (req, res, next) => {
        try {
            const {password, number, email} = req.body;

            if (!password || !(email || number)) {
                ErrorBuilder(Errors.err422ID);
            }

            if (password && number) {
                const {error, value} = authValidator.authValidatorNumber.validate({password, number});

                if (error) {
                    ErrorBuilder(Errors.err422N);
                }

                req.body = value;
            }

            if (password && email) {
                const {error, value} = authValidator.authValidatorEmail.validate({password, email});

                if (error) {
                    ErrorBuilder(Errors.err422E);
                }

                req.body = value;
            }

            next();
        } catch (e) {
            next(e);
        }
    },

    logInMiddleware: async (req, res, next) => {
        try {
            const {email, number} = req.body;

            let checkEmail = {};

            if (email) {
                checkEmail = await User
                    .findOne({email});
            }

            if (number) {
                checkEmail = await User
                    .findOne({number});
            }

            if (!checkEmail) {
                ErrorBuilder(Errors.err404);
            }

            req.user = checkEmail;

            next();
        } catch (e) {
            next(e);
        }
    },

    checkUserRole: (roleArr = []) => (req, res, next) => {
        try {
            const {role} = req.user;

            if (!roleArr.includes(role)) {
                ErrorBuilder(Errors.err403);
            }

            next();
        } catch (e) {
            next(e);
        }
    },
    checkAccessToken: async (req, res, next) => {
        try {
            const token = req.get(constants.AUTHORIZATION);

            if (!token) {
                ErrorBuilder(Errors.err401);
            }

            await jwtService.verifyToken(token);

            const tokenResponse = await oAuth.findOne({access_token: token});

            if (!tokenResponse) {
                ErrorBuilder(Errors.err401);
            }

            req.token = token;
            req.user = tokenResponse.user_id.userNormalizer(tokenResponse.user_id);
            req.body.user_id = tokenResponse.user_id;

            next();
        } catch (e) {
            next(e);
        }
    },

    isUserActive: (req, res, next) => {
        try {
            const {user} = req;

            if (!user.email) {
                ErrorBuilder(Errors.err403NE);
            }

            if (!user.is_active) {
                ErrorBuilder(Errors.err403NA);
            }

            next();
        } catch (e) {
            next(e);
        }
    },

};
