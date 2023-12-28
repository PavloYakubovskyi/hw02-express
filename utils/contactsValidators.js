const Joi = require("joi");

exports.createContactsValidator = (data) =>
  Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
  }).validate(data);

exports.updateContactsValidator = (data) =>
  Joi.object({
    name: Joi.string().min(3),
    email: Joi.string().email(),
    phone: Joi.string(),
  })
    .min(1)
    .validate(data);
