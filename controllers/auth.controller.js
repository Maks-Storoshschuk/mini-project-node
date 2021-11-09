const {User, oAuth} = require('../dataBase');
const {jwtService} = require('../services');

module.exports = {
    activate: async (req, res, next) => {
        try {
            const {_id} = req.user;
            await User.updateOne({_id}, {is_active: true});

            res.json('User is active');
        } catch (e) {
            next(e);
        }
    },

    logIn: async (req, res, next) => {
        try {
            const tokenPair = jwtService.generateTokenPair();

            const user = req.user;
            const {password} = req.body;
            await user.comparePassword(password);

            await oAuth.create({
                ...tokenPair,
                user_id: user._id
            });

            const normUser = user.userNormalizer(user);

            res.json({
                ...normUser,
                ...tokenPair
            });
        } catch (e) {
            next(e);
        }
    },

    refreshToken: async (req, res, next) => {
        try {
            const {refresh_token, user_id} = req.token;

            await oAuth.deleteOne({refresh_token});

            const tokenPair = jwtService.generateTokenPair();

            await oAuth.create({
                ...tokenPair,
                user_id
            });

            res.json(tokenPair);
        } catch (e) {
            next(e);
        }
    },

    logOut: async (req, res, next) => {
        try {
            const token = req.token;

            await oAuth.deleteOne({access_token: token});

            res.json('success');
        } catch (e) {
            next(e);
        }
    }
};
