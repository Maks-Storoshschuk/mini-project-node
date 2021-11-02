const {MAX_AVATAR_SIZE, PHOTOS_MIMETYPES} = require('../config/constans');
const {Errors, ErrorBuilder} = require('../errorHandler');

module.exports = {
    checkUserAvatar: (req, res, next) => {
        try {
            const {avatar} = req.files;

            if (!avatar) {
                next();
                return;
            }

            const {name, size, mimetype} = avatar;

            if (!PHOTOS_MIMETYPES.includes(mimetype)) {
                ErrorBuilder(Errors.err400);
            }

            if (MAX_AVATAR_SIZE < size) {
                ErrorBuilder({message: `Image ${name} to large`, code: 400});
            }

            next();
        } catch (e) {
            next(e);
        }
    }
};
