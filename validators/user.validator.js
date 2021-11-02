const Joi = require('joi');

const {constants, regExp} = require('../config');

const createUserValidator = Joi.object({
    name: Joi
        .string()
        .alphanum()
        .min(2)
        .max(30)
        .trim()
        .required(),
    number: Joi
        .number()
        .min(99999999999)
        .max(999999999999),
    email: Joi
        .string()
        .regex(regExp.emailRegExp)
        .trim(),
    role: Joi
        .string()
        .allow(
            constants.USER,
            constants.ADMIN,
            constants.MANAGER
        ),
    password: Joi
        .string()
        .trim()
        .regex(regExp.passwordRegExp)
        .required(),
});

module.exports = {
    createUserValidator
};
