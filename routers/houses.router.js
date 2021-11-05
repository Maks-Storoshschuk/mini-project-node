const {adminMiddleware} = require("../middlewares");
const {authMiddleware, houseMiddleware} = require('../middlewares');
const router = require('express').Router();

const {houseController} = require('../controllers');

router.get(
    '/',
    houseController.getAllHouses
);
router.post(
    '/',
    authMiddleware.checkAccessToken,
    authMiddleware.isUserActive,
    houseMiddleware.isHouseValid,
    houseController.createHouse
);

router.get(
    '/comments',
    authMiddleware.checkAccessToken,
    adminMiddleware.checkRole,
    adminMiddleware.checkManager,
    houseController.getComments
);

router.get(
    '/comments/:comment_id',
    authMiddleware.checkAccessToken,
    adminMiddleware.checkRole,
    adminMiddleware.checkManager,
    adminMiddleware.checkCommentId,
    houseController.getComment
);

router.get(
    '/:house_id',
    houseMiddleware.checkIdHouse,
    houseController.getHouse
);

router.put(
    '/:house_id',
    authMiddleware.checkAccessToken,
    authMiddleware.isUserActive,
    houseMiddleware.checkIdHouse,
    houseMiddleware.checkDate,
    houseController.buckHouse
);

router.post(
    '/comment/:house_id',
    authMiddleware.checkAccessToken,
    authMiddleware.isUserActive,
    adminMiddleware.checkBan,
    houseMiddleware.checkIdHouse,
    houseMiddleware.checkComment,
    houseController.comment
);

router.get(
    '/confirmed/:token',
    houseMiddleware.checkRentToken,
    houseController.confirmed
);

router.delete(
    '/comments/:comment_id',
    authMiddleware.checkAccessToken,
    adminMiddleware.checkRole,
    adminMiddleware.checkManager,
    adminMiddleware.checkCommentId,
    houseController.deleteComment
);

router.delete(
    '/:house_id',
    authMiddleware.checkAccessToken,
    adminMiddleware.checkRole,
    adminMiddleware.checkManager,
    houseMiddleware.checkIdHouse,
    houseController.deleteHouse
);

router.get(
    '/:house_id/:rating',
    houseMiddleware.checkIdHouse,
    houseController.ratingHouse
);

module.exports = router;
