const router = require('express').Router();

const {userController} = require('../controllers');

router.post(
    '/',
    userController.createUser
);

module.exports = router;
