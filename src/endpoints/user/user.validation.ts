import Joi from 'joi';

const register = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required().max(30),
    birthDayDate: Joi.date().required(),
    birthPlace: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    address: Joi.string(),

})

const login = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
})

export default { register, login };