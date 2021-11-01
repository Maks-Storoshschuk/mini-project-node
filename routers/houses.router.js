const router = require('express').Router();

const {houseController} = require('../controllers');

router.get(
    '/',
    houseController.getAllHouses
);
router.post(
    '/',
    houseController.createHouse
);

module.exports = router;
