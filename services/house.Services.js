const {House} = require('../dataBase');

module.exports = {
    getAllHouses: (query = {}) => {
        const {
            perPage = 20,
            page = 1,
            sortBy = 'createdAt',
            order = 'asc',
            ...filters
        } = query;

        const findObject = {};
        const priceFilter = {};
        const volumeFilter = {};
        const personsFilter = {};

        Object.keys(filters).forEach((filterParam) => {
            switch (filterParam) {
                case 'country':
                    findObject.country = {$regex: `^${filters.country}`, $options: 'i'};
                    break;
                case 'region':
                    findObject.region = {$regex: `^${filters.region}`, $options: 'i'};
                    break;
                case 'price.gte':
                    Object.assign(priceFilter, {$gte: +filters['price.gte']});
                    break;
                case 'price.lte':
                    Object.assign(priceFilter, {$lte: +filters['price.lte']});
                    break;
                case 'volume.gte':
                    Object.assign(volumeFilter, {$gte: +filters['volume.gte']});
                    break;
                case 'volume.lte':
                    Object.assign(volumeFilter, {$lte: +filters['volume.lte']});
                    break;
                case 'person.lte':
                    Object.assign(personsFilter, {$lte: +filters['person.lte']});
                    break;
            }
        });

        if (Object.values(priceFilter).length) {
            findObject.price = priceFilter;
        }
        if (Object.values(volumeFilter).length) {
            findObject.volume = volumeFilter;
        }
        if (Object.values(personsFilter).length) {
            findObject.person = personsFilter;
        }


        const orderBy = order === 'asc' ? -1 : 1;

        return House
            .find(findObject)
            .sort({[sortBy]: orderBy})
            .limit(+perPage)
            .skip((page - 1) * perPage);
    }
};
