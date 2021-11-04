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
    adminMiddleware.checkRole,
    adminMiddleware.checkAdmin,
    userMiddleware.userIdMiddleware,
    userController.deleteUser
);

router.get(
    '/',
    authMiddleware.checkAccessToken,
    adminMiddleware.checkRole,
    adminMiddleware.checkManager,
    userController.getUsers
);

router.get(
    '/:user_id',
    authMiddleware.checkAccessToken,
    adminMiddleware.checkRole,
    adminMiddleware.checkManager,
    userMiddleware.userIdMiddleware,
    userController.getUsersById
);

router.put(
    '/:user_id',
    adminMiddleware.isUserValid,
    userMiddleware.userIdMiddleware,
    authMiddleware.checkAccessToken,
    adminMiddleware.checkRole,
    adminMiddleware.checkAdmin,
    userController.updateUserAdmin
);


module.exports = router;
