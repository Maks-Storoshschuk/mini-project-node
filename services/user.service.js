const {User} = require('../dataBase');

module.exports = {
    getAllUsers: (query = {}) => {
        const {
            perPage = 20,
            page = 1,
            sortBy = 'createdAt',
            order = 'asc',
            ...filters
        } = query;

        const findObject = {};
        const ageFilter = {};

        Object.keys(filters).forEach((filterParam) => {
            switch (filterParam) {
                case 'name':
                    findObject.name = {$regex: `^${filters.name}`, $options: 'i'};
                    break;
                case 'role':
                    const rolesArray = filters.role.split(';');
                    findObject.role = {$in: rolesArray};
                    break;
                case 'age.gte':
                    Object.assign(ageFilter, {$gte: +filters['age.gte']});
                    break;
                case 'age.lte':
                    Object.assign(ageFilter, {$lte: +filters['age.lte']});
                    break;
            }
        });

        if (Object.values(ageFilter).length) {
            findObject.age = ageFilter;
        }

        const orderBy = order === 'asc' ? -1 : 1;

        return User
            .find(findObject)
            .sort({[sortBy]: orderBy})
            .limit(+perPage)
            .skip((page - 1) * perPage);
    }
};
