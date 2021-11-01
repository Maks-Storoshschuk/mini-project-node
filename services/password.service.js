const bcrypt = require('bcrypt');

const {Errors, ErrorBuilder} = require('../errorHandler');

module.exports = {
    hash: (password) => bcrypt.hash(password, 10),
    compare: async (password, hashPassword) => {
        const isPasswordMatched = await bcrypt.compare(password, hashPassword);

        if (!isPasswordMatched) {
            ErrorBuilder(Errors.err404);
        }
    }
};
