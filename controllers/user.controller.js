const userService = require('../services/user.service');
const passwordService = require('../services/password.service');
const {tokenTypeEnum, constants} = require('../config');
const {emailService, jwtService, S3services} = require('../services');
const {User, Action, oAuth, House, Comment} = require('../dataBase');

module.exports = {

    createUser: async (req, res, next) => {
        try {
            let user = await User.createUserWithHashPassword(req.body);

            const {email, name} = req.body;

            if (email) {
                const token = jwtService.createActionToken();

                await Action.create({token, type: tokenTypeEnum.ACTION, user_id: user._id});

                await emailService.sendMail(email, constants.welcome, {userName: name, token});
            }

            if (req.files) {
                const {avatar} = req.files;

                if (avatar) {
                    const uploadInfo = await S3services.uploadImage(avatar, 'users', user._id.toString());

                    user = await User.findByIdAndUpdate(user._id, {avatar: uploadInfo.Location}, {new: true});
                }
            }

            const normUser = user.userNormalizer(user);

            res.status(201).json(normUser);
        } catch (e) {
            next(e);

        }
    },

    updateUser: async (req, res, next) => {
        try {
            const {user_id, email} = req.body;
            const {name} = user_id;

            const token = jwtService.createActionToken();

            await Action.create({token, type: tokenTypeEnum.ACTION, user_id});

            await emailService.sendMail(email, constants.welcome, {userName: name, token});

            const user = await User.findByIdAndUpdate(user_id, {email}, {new: true});

            const newUser = user.userNormalizer(user);

            res.status(constants.code201).json(newUser);
        } catch (e) {
            next(e);
        }
    },

    deleteUser: async (req, res, next) => {
        try {
            const {user_id} = req.params;
            await User.deleteOne({_id: user_id});
            await oAuth.deleteMany({user_id});
            await House.deleteMany({user_id});
            await Comment.deleteMany({user_id});
            await Action.deleteMany({user_id});

            res.json('deleted').status(constants.code204);
        } catch (e) {
            next(e);
        }
    },

    getUsers: async (req, res, next) => {
        try {
            const users = await userService.getAllUsers(req.query);

            const normUsers = [];
            users.forEach(user => {
                const normUser = user.userNormalizer(user);

                normUsers.push(normUser);
            });

            res.json(normUsers);
        } catch (e) {
            next(e);
        }
    },

    getUsersById: (req, res, next) => {
        try {
            const user = req.user;

            const normUser = user.userNormalizer(user);

            res.json(normUser);
        } catch (e) {
            next(e);
        }
    },

    updateUserAdmin: async (req, res, next) => {
        try {
            const {user_id} = req.params;
            const {
                email,
                name,
                number,
                role,
                is_active,
                avatar,
                password,
                ban,
            } = req.body;

            let user = {};

            if (password) {
                const hashedPassword = await passwordService.hash(password);
                user = await User.findByIdAndUpdate(user_id, {
                    email,
                    name,
                    number,
                    role,
                    is_active,
                    avatar,
                    ban,
                    password: hashedPassword
                }, {new: true});

            }

            user = await User.findByIdAndUpdate(user_id, {
                email,
                name,
                number,
                role,
                is_active,
                avatar,
                ban
            }, {new: true});

            const newUser = user.userNormalizer(user);

            res.status(constants.code201).json(newUser);
        } catch (e) {
            next(e);
        }
    },

    banUser: async (req, res, next) => {
        try {
            const {user_id} = req.params;
            const {ban} = req.body;

            const user = await User.findByIdAndUpdate(user_id, {ban}, {new: true});

            const normUser = user.userNormalizer(user);

            res.json(normUser);
        } catch (e) {
            next(e);
        }
    },

    ratingUser: async (req, res, next) => {
        try {
            const {user_id, rating} = req.params;

            const user = await User.findByIdAndUpdate(user_id, {star: rating}, {new: true});

            const normUser = user.userNormalizer(user);

            res.json(normUser);
        } catch (e) {
            next(e);
        }
    },
};
