const Joi = require("joi");

exports.createRegistrationValidator = (data) =>
  Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  }).validate(data);
