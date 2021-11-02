const {authMiddleware,houseMiddleware} = require('../middlewares');
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

module.exports = router;
