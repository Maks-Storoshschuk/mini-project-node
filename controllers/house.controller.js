const {User} = require("../dataBase");
const {constants} = require("../config");
const {emailService} = require("../services");
const {S3services, houseService} = require('../services');
const {House} = require('../dataBase');

module.exports = {
    getAllHouses: async (req, res, next) => {
        try {
            const houses = await houseService.getAllHouses(req.query);
            const actualHouses = [];
            houses.forEach(house => {
                const normHouse = house.houseNormalizer(house);

                if (normHouse) {
                    actualHouses.push(normHouse);
                }
            });

            res.json(actualHouses);
        } catch (e) {
            next(e);
        }
    },

    createHouse: async (req, res, next) => {
        try {
            let house = await House.create(req.body);

            const {pic} = req.files;

            if (pic) {
                const uploadInfo = await S3services.uploadImage(pic, 'houses', house._id.toString());

                house = await House.findByIdAndUpdate(house._id, {pic: uploadInfo.Location}, {new: true});
            }

            const normHouse = house.houseNormalizer(house);

            res.status(201).json(normHouse);
        } catch (e) {
            next(e);

        }
    },

    getHouse: (req, res, next) => {
        try {
            const house = req.house;

            const normHouse = house.houseNormalizer(house);

            res.json(normHouse);
        } catch (e) {
            next(e);
        }
    },

    buckHouse: async (req, res, next) => {
        try {
            const {sum, daysOne, daysTwo} = req.buk;
            const {_id} = req.house;
            const user = req.body.user_id;

            const info = await House.findByIdAndUpdate({_id}, {
                payment: sum,
                from: daysOne,
                to: daysTwo,
                is_actual: false
            });

            const boss = await User.findById(info.user_id);

            const {email, name} = boss;

            await emailService.sendMail(email, constants.buk, {
                userName: name,
                info,
                user
            });


            res.json('success');
        } catch (e) {
            next(e);
        }
    },
};
