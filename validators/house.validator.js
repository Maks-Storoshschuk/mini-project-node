const Joi = require('joi');

const houseValidator = Joi.object({
    price: Joi
        .number()
        .min(1)
        .max(10000)
        .required(),
    person: Joi
        .number()
        .min(1)
        .max(20),
    volume: Joi
        .number()
        .min(20)
        .max(300)
        .required(),
    region: Joi
        .string()
        .alphanum()
        .required(),
    country: Joi
        .string()
        .alphanum()
        .required(),
    city: Joi
        .string()
        .alphanum()
        .required(),
    description: Joi
        .string()
        .min(20)
        .max(100),
    is_actual: Joi
        .boolean()
        .default(true),
    user_id: Joi
        .object()
        .required()
});

module.exports = {
    houseValidator
};
