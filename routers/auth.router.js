const {constants} = require('../config');
const router = require('express').Router();

const {authController} = require('../controllers');
const {authMiddleware} = require('../middlewares');

router.get(
    '/activate/:token',
    authMiddleware.checkActivateToken,
    authController.activate
);

router.post(
    '/',
    authMiddleware.isAuthValid,
    authMiddleware.logInMiddleware,
    authMiddleware.checkUserRole([
        constants.USER,
        constants.MANAGER,
        constants.ADMIN
    ]),
    authController.logIn
);

router.post(
    '/refresh',
    authMiddleware.checkRefreshToken,
    authController.refreshToken,
);

module.exports = router;
