const {constants} = require('../config');
const {ErrorBuilder, Errors} = require('../errorHandler');
const {User} = require('../dataBase');
const {userValidator, emailValidator} = require('../validators');

module.exports = {
    createUserMiddleware: async (req, res, next) => {
        try {
            const {email, number} = req.body;

            if (email){
                const userByEmail = await User.findOne({email});
                if (userByEmail) {
                    ErrorBuilder(Errors.err409);
                }
            }

            if (number){
                const userByNumber = await User.findOne({number});
                if (userByNumber) {
                    ErrorBuilder(Errors.err409);
                }
            }

            next();
        } catch (e) {
            next(e);
        }
    },

    isUserValid: (req, res, next) => {
        const {email, number} = req.body;
        if (!email && !number) {
            ErrorBuilder(Errors.err422R);
        }
        try {
            const {error, value} = userValidator.createUserValidator.validate(req.body);

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

    isEmailValid: async (req, res, next) => {
        const {email} = req.body;
        if (!email) {
            ErrorBuilder(Errors.err422R);
        }
        try {
            const {error} = emailValidator.putEmail.validate({email});

            if (error) {
                next({
                    message: error.details[0].message,
                    status: constants.code400
                });
            }

            if (await User.findOne({email})) {
                ErrorBuilder(Errors.err409);
            }

            next();
        } catch (e) {
            next(e);
        }
    },

    userIdMiddleware: async (req, res, next) => {
        try {
            const {user_id} = req.params;
            const checkId = await User.findById(user_id);

            if (!checkId) {
                ErrorBuilder(Errors.err404WI);
            }

            req.user = checkId;

            next();
        } catch (e) {
            next(e);
        }
    }
};


