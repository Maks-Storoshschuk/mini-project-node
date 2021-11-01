const {S3services, houseService} = require('../services');
const {House} = require('../dataBase');

module.exports = {
    getAllHouses: async (req, res, next) => {
        try {
            const house = await houseService.getAllHouses(req.query);

            res.json(house);
        } catch (e) {
            next(e);
        }
    },

    createHouse: async (req, res, next) => {
        try {
            let house = await House.create(req.body);

            const {pic} = req.files;

            if (pic){
                const uploadInfo= await S3services.uploadImage(pic, 'houses', house._id.toString());

                house = await House.findByIdAndUpdate(house._id, {pic: uploadInfo.Location}, {new:true});
            }

            const normHouse = house.houseNormalizer(house);

            res.status(201).json(normHouse);
        } catch (e) {
            next(e);

        }
    },
};
