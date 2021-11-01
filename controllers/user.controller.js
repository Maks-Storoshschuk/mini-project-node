const {tokenTypeEnum, constants} = require('../config');
const {emailService, jwtService, S3services} = require('../services');
const {User, Action} = require('../dataBase');

module.exports = {

    createUser: async (req, res, next) => {
        try {
            let user = await User.createUserWithHashPassword(req.body);

            const token = jwtService.createActionToken();

            await Action.create({token, type: tokenTypeEnum.ACTION, user_id: user._id});

            await emailService.sendMail(req.body.email, constants.welcome, {userName: req.body.name, token});

            const {avatar} = req.files;

            if (avatar){
                const uploadInfo= await S3services.uploadImage(avatar, 'users', user._id.toString());

                user = await User.findByIdAndUpdate(user._id, {avatar: uploadInfo.Location}, {new:true});
            }

            const normUser = user.userNormalizer(user);

            res.status(201).json(normUser);
        } catch (e) {
            next(e);

        }
    },
};
