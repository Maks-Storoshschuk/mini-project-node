const {constants} = require('../config');
const {S3services, houseService, emailService, jwtService} = require('../services');
const {House,User, Rent} = require('../dataBase');

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
            }, {new: true});

            const boss = await User.findById(info.user_id);

            const {email, name} = boss;

            const rentTokens = jwtService.generateRentToken();

            await Rent.create({
                ...rentTokens,
                house_id: _id,
                tenant: user.email
            });

            const {agree_token, refuse_token} = rentTokens;

            await emailService.sendMail(email, constants.buk, {
                name,
                info,
                user,
                agree_token,
                refuse_token,
            });

            res.json('success');
        } catch (e) {
            next(e);
        }
    },

    confirmed: async (req, res, next) => {
        try {
            const {refuse, agree} = req.body;

            if (refuse) {
                const {house_id, refuse_token} = refuse;
                const house = await House.findByIdAndUpdate(house_id, {is_actual: true});

                await emailService.sendMail(refuse.tenant, constants.reject, {
                    house
                });

                await Rent.findOneAndDelete(refuse_token);

                res.json('ви відмовили у оренді');
            }

            if (agree) {
                const {agree_token, house_id} = agree;

                const house = await House.findByIdAndUpdate(house_id, {for_rent: true});

                await emailService.sendMail(agree.tenant, constants.forRent, {
                    house
                });

                await Rent.findOneAndDelete(agree_token);

                res.json('ви підтвердили оренду');
            }

        } catch (e) {
            next(e);
        }
    },
};
