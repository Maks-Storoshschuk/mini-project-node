const dayJs = require('dayjs');
const utc = require('dayjs/plugin/utc');

dayJs.extend(utc);

const oAuth = require('../dataBase/oAuth');

module.exports = async () => {
    const previousMonth = dayJs.utc().subtract(1, 'month');

    await oAuth.deleteMany({
        createdAt: {$lt: previousMonth}
    });
};
