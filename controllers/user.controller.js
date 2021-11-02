const {tokenTypeEnum, constants} = require('../config');
const {emailService, jwtService, S3services} = require('../services');
const {User, Action} = require('../dataBase');

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

            const {avatar} = req.files;

            if (avatar) {
                const uploadInfo = await S3services.uploadImage(avatar, 'users', user._id.toString());

                user = await User.findByIdAndUpdate(user._id, {avatar: uploadInfo.Location}, {new: true});
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

            const user = await User.findByIdAndUpdate(user_id,{email}, {new: true});

            const newUser = user.userNormalizer(user);

            res.status(constants.code201).json(newUser);
        } catch (e) {
            next(e);
        }
    },
};
