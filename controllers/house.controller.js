const {constants} = require('../config');
const {Comment, House, Rent, User} = require('../dataBase');
const {ErrorBuilder, Errors} = require('../errorHandler');
const {MAX_AVATAR_SIZE, PHOTOS_MIMETYPES} = require('../config/constans');
const {emailService, houseService, jwtService, S3services} = require('../services');


module.exports = {
    getAllHouses: async (req, res, next) => {
        try {
            const houses = await houseService.getAllHouses(req.query);
            const actualHouses = [];
            houses.forEach(house => {
                const normHouse = house.houseNormalizer(house);

                if (normHouse) {
                    actualHouses.push(normHouse);
                }
            });

            res.json(actualHouses);
        } catch (e) {
            next(e);
        }
    },

    createHouse: async (req, res, next) => {
        try {
            req.body.user_email = req.user.email;
            req.body.user_id = req.user._id;

            let house = await House.create(req.body);

            if (req.files) {

                const {pic} = req.files;

                if (pic) {
                    const {name, size, mimetype} = pic;

                    if (!PHOTOS_MIMETYPES.includes(mimetype)) {
                        ErrorBuilder(Errors.err400);
                    }

                    if (MAX_AVATAR_SIZE < size) {
                        ErrorBuilder({message: `Image ${name} to large`, code: 400});
                    }

                    const uploadInfo = await S3services.uploadImage(pic, 'houses', house._id.toString());

                    house = await House.findByIdAndUpdate(house._id, {pic: uploadInfo.Location}, {new: true});
                }
            }

            const normHouse = house.houseNormalizer(house);

            res.status(201).json(normHouse);
        } catch (e) {
            next(e);

        }
    },

    getHouse: (req, res, next) => {
        try {
            const house = req.house;

            const normHouse = house.houseNormalizer(house);

            res.json(normHouse);
        } catch (e) {
            next(e);
        }
    },

    buckHouse: async (req, res, next) => {
        try {
            const {sum, daysOne, daysTwo} = req.buk;
            const {_id} = req.house;
            const user = req.body.user_id;

            const info = await House.findByIdAndUpdate({_id}, {
                payment: sum,
                from: daysOne,
                to: daysTwo,
                is_actual: false
            }, {new: true});

            const boss = await User.findById(info.user_id);

            const {email, name} = boss;

            const rentTokens = jwtService.generateRentToken();

            await Rent.create({
                ...rentTokens,
                house_id: _id,
                tenant: user.email,
                tenant_id: user._id
            });

            const {agree_token, refuse_token} = rentTokens;

            await emailService.sendMail(email, constants.buk, {
                name,
                info,
                user,
                agree_token,
                refuse_token,
            });

            res.json('success');
        } catch (e) {
            next(e);
        }
    },

    confirmed: async (req, res, next) => {
        try {
            const {refuse, agree} = req.body;

            if (refuse) {
                const {house_id, refuse_token} = refuse;
                const house = await House.findByIdAndUpdate(house_id, {is_actual: true});

                await emailService.sendMail(refuse.tenant, constants.reject, {
                    house
                });

                await Rent.findOneAndDelete(refuse_token);

                res.json('ви відмовили у оренді');
            }

            if (agree) {
                const {agree_token, house_id} = agree;

                const house = await House.findByIdAndUpdate(house_id, {for_rent: true});

                await emailService.sendMail(agree.tenant, constants.forRent, {
                    house
                });

                await Rent.findOneAndUpdate(agree_token, {agree_token: '', refuse_token: ''});

                res.json('ви підтвердили оренду');
            }

        } catch (e) {
            next(e);
        }
    },

    comment: async (req, res, next) => {
        try {
            const {_id} = req.house;
            const {comment} = req.body;

            const newComment = await Comment.create({house_id: _id, user_id: req.user._id, comment});

            const comments = newComment.commentNormalizer(newComment);

            res.json(comments);
        } catch (e) {
            next(e);
        }
    },

    getComments: async (req, res, next) => {
        try {
            const allComment = await Comment.find();

            const normComments = [];

            allComment.forEach(comment => {
                const normComment = comment.commentNormalizer(comment);
                normComments.push(normComment);
            });

            res.json(normComments);
        } catch (e) {
            next(e);
        }
    },

    getComment: (req, res, next) => {
        try {
            res.json(req.comment);
        } catch (e) {
            next(e);
        }
    },

    deleteComment: async (req, res, next) => {
        try {
            const {comment_id} = req.params;
            await Comment.findOneAndDelete({_id:comment_id});

            res.json('deleted').status(constants.code204);
        } catch (e) {
            next(e);
        }
    },

    deleteHouse: async (req, res, next) => {
        try {
            const {_id} = req.house;

            await House.findByIdAndDelete(_id);

            res.json('deleted').status(constants.code204);
        } catch (e) {
            next(e);
        }
    },

    ratingHouse: async (req, res, next) => {
        try {
            const {house_id, rating} = req.params;

            const house = await House.findByIdAndUpdate(house_id, {star: rating}, {new: true});

            const normHouse = house.houseNormalizer(house);

            res.json(normHouse);
        } catch (e) {
            next(e);
        }
    },
};
