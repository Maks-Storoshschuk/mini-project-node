const router = require('express').Router();

const {adminMiddleware, authMiddleware, fileMiddleware, userMiddleware} = require('../middlewares');
const {userController} = require('../controllers');

router.post(
    '/',
    userMiddleware.isUserValid,
    fileMiddleware.checkUserAvatar,
    adminMiddleware.checkRole,
    userMiddleware.createUserMiddleware,
    userController.createUser
);
router.put(
    '/',
    authMiddleware.checkAccessToken,
    userMiddleware.isEmailValid,
    userController.updateUser
);
router.get(
    '/',
    authMiddleware.checkAccessToken,
    adminMiddleware.checkManager,
    userController.getUsers
);

router.delete(
    '/:user_id',
    authMiddleware.checkAccessToken,
    adminMiddleware.checkAdmin,
    userMiddleware.userIdMiddleware,
    userController.deleteUser
);
router.get(
    '/:user_id',
    authMiddleware.checkAccessToken,
    adminMiddleware.checkManager,
    userMiddleware.userIdMiddleware,
    userController.getUsersById
);
router.put(
    '/:user_id',
    adminMiddleware.isUserValid,
    authMiddleware.checkAccessToken,
    adminMiddleware.checkAdmin,
    userMiddleware.userIdMiddleware,
    userController.updateUserAdmin
);
router.get(
    '/:user_id/:rating',
    userMiddleware.userIdMiddleware,
    userController.ratingUser
);

router.put(
    '/ban/:user_id',
    authMiddleware.checkAccessToken,
    adminMiddleware.checkManager,
    userMiddleware.userIdMiddleware,
    userController.banUser,
);

module.exports = router;
