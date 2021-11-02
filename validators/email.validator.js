const Joi = require('joi');

const {regExp} = require('../config');

const putEmail = Joi.object({
    email: Joi
        .string()
        .regex(regExp.emailRegExp)
        .trim(),
});

module.exports = {
    putEmail
};
