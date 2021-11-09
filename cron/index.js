const cron = require('node-cron');

const removeOldTokens = require('../cron/removeOldTokens');
const sendMail = require('./sendMail');

module.exports = () => {
    cron.schedule('*/20 * * * * *', async () => {
        await removeOldTokens();
        await sendMail();
    });
};
