const router = require('express').Router();

const {userController} = require('../controllers');
const {fileMiddleware, userMiddleware, authMiddleware, adminMiddleware} = require('../middlewares');

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
router.delete(
    '/:user_id',
    authMiddleware.checkAccessToken,
    adminMiddleware.checkAdmin,
    userMiddleware.userIdMiddleware,
    userController.deleteUser
);

router.get(
    '/',
    authMiddleware.checkAccessToken,
    adminMiddleware.checkManager,
    userController.getUsers
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

router.put(
    '/ban/:user_id',
    authMiddleware.checkAccessToken,
    adminMiddleware.checkManager,
    userMiddleware.userIdMiddleware,
    userController.banUser,
);

router.get(
    '/:user_id/:rating',
    userMiddleware.userIdMiddleware,
    userController.ratingUser
);


module.exports = router;
