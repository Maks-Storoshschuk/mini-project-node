const dayJs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const {constants} = require('../config');

dayJs.extend(utc);

const {Rent, House} = require('../dataBase');
const {emailService} = require('../services');

module.exports = async () => {

    const days = dayJs.utc().subtract(1, 'day');

    const endOfLease = await House.findOneAndUpdate({to: {$lt: days}}, {
        to: '',
        for_rent: 'false',
        payment: '',
        from: '',
        is_actual: true
    }, {new: true});
    const {_id, user_email} = endOfLease;

    const deleted = await Rent.findOneAndDelete({house_id: _id});

    const {tenant, tenant_id} = deleted;

    await emailService.sendMail(tenant, constants.ratingHouse, _id);

    await emailService.sendMail(user_email, constants.ratingUser, {user_id: tenant_id});
};
