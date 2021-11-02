const router = require('express').Router();

const {userController} = require('../controllers');
const {fileMiddleware, userMiddleware,authMiddleware} = require('../middlewares');

router.post(
    '/',
    userMiddleware.isUserValid,
    fileMiddleware.checkUserAvatar,
    userMiddleware.createUserMiddleware,
    userController.createUser
);
router.put(
    '/',
    authMiddleware.checkAccessToken,
    userMiddleware.isEmailValid,
    userController.updateUser
);

module.exports = router;
