const {userValidator} = require("../validators");
const {ErrorBuilder, Errors} = require('../ErrorHandler');
const {jwtService} = require('../services');
const {constants} = require('../config');
const {User, oAuth, Comment} = require('../dataBase');

module.exports = {
    checkRole: async (req, res, next) => {
        try {
            const token = req.get(constants.AUTHORIZATION);

            if (token) {
                await jwtService.verifyToken(token);

                const tokenResponse = await oAuth.findOne({access_token: token});

                if (tokenResponse){

                    const user = await User.findById(tokenResponse.user_id);

                    req.userLevel = user.role;
                }
            }

            if (req.userLevel !== constants.ADMIN) {
                req.body.role = constants.USER;
            }

            next();
        } catch (e) {
            next(e);
        }
    },
    checkManager: (req, res, next) => {
        try {

            if (![
                constants.ADMIN,
                constants.MANAGER
            ].includes(req.userLevel)) {
                ErrorBuilder(Errors.err401MA);
            }

            next();
        } catch (e) {
            next(e);
        }
    },

    checkAdmin: (req, res, next) => {
        try {
            if (req.userLevel !== constants.ADMIN) {
                ErrorBuilder(Errors.err401A);
            }

            next();
        } catch (e) {
            next(e);
        }
    },

    isUserValid: (req, res, next) => {
        try {
            const {error, value} = userValidator.updateUserValidator.validate(req.body);

            if (error) {
                next({
                    message: error.details[0].message,
                    status: constants.code400
                });
            }

            req.body = value;

            next();
        } catch (e) {
            next(e);
        }
    },

    checkCommentId: async (req, res, next) => {
        try {
            const {comment_id} = req.params;

            const comment = await Comment.findById(comment_id);

            if(!comment) {
                ErrorBuilder(Errors.err404WI);
            }

            req.comment = comment.commentNormalizer(comment);

            next();
        } catch (e) {
            next(e);
        }
    },
};

