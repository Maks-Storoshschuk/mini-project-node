const dayJs = require('dayjs');
const utc = require('dayjs/plugin/utc');

dayJs.extend(utc);

const {jwtService} = require('../services');
const {House, Rent} = require('../dataBase');
const {houseValidator} = require('../validators');
const {ErrorBuilder, Errors} = require('../errorHandler');

module.exports = {
    isHouseValid: (req, res, next) => {
        try {
            const {error} = houseValidator.houseValidator.validate(req.body);

            if (error) {
                ErrorBuilder(Errors.err422ID);
            }

            next();
        } catch (e) {
            next(e);
        }
    },

    checkIdHouse: async (req, res, next) => {
        try {
            const {house_id} = req.params;
            const checkId = await House.findById(house_id);

            if (!checkId) {
                ErrorBuilder(Errors.err404WI);
            }

            req.house = checkId;
            next();
        } catch (e) {
            next(e);
        }
    },

    checkDate: (req, res, next) => {
        try {
            const {from, to} = req.body;

            if (!from || !to) {
                ErrorBuilder(Errors.err422ID);
            }

            if (from > to) {
                ErrorBuilder(Errors.err422ID);
            }

            const {price} = req.house;
            const sum = (to - from) * price;

            const daysOne = dayJs.utc().subtract(-from, 'day');

            const daysTwo = dayJs.utc().subtract(-to, 'day');

            req.buk = {sum, daysOne, daysTwo};

            next();
        } catch (e) {
            next(e);
        }
    },

    checkRentToken: async (req, res, next) => {
        try {
            const {token} = req.params;

            if (!token) {
                ErrorBuilder(Errors.err401);
            }
            await jwtService.verifyRent(token);

            const agree = await Rent.findOne({agree_token: token});

            const refuse = await Rent.findOne({refuse_token: token});

            if (!(refuse || agree)) {
                ErrorBuilder(Errors.err401);
            }

            req.body = {refuse, agree};

            next();
        } catch (e) {
            next(e);
        }
    },

    checkComment: (req, res, next) => {
        try {

            if (req.user._id === req.house.user_id){
                res.json('fuck its your house');
            }
            const {comment} = req.body;

            if (!comment){
                ErrorBuilder(Errors.err422ID);
            }

            const {error} = houseValidator.commentValidator.validate(comment.toObject);

            if (error) {
                ErrorBuilder(Errors.err422ID);
            }

            next();
        } catch (e) {
            next(e);
        }
    },

};
