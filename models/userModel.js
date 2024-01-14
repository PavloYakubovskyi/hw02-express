const { Schema, model } = require("mongoose");
const { handleMongooseError } = require("../helpers");
const Joi = require("joi");

const emailRegExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const passwordRegexp = /^[A-Za-z]\w{7,14}$/;

const userSchema = new Schema({
  password: {
    type: String,
    required: [true, "Set password for user"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  subscription: {
    type: String,
    enum: ["starter", "pro", "business"],
    default: "starter",
  },
  token: String,
  avatarURL: String,
});

userSchema.post("save", handleMongooseError);

const registerSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .pattern(emailRegExp)
    .message({ "any.required": "Missing required email field." }),
  password: Joi.string()
    .min(6)
    .required()
    .messages({ "any.required": "Missing required password field." }),
});

const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .pattern(emailRegExp)
    .message({ "any.required": "Missing required email field." }),
  password: Joi.string()
    .min(6)
    .required()
    .messages({ "any.required": "Missing required password field." }),
});

const emailSchema = Joi.object({
  email: Joi.string().pattern(emailRegExp).required(),
});

const validateSchema = Joi.object({
  email: Joi.string().pattern(emailRegExp).required(),
  password: Joi.string().pattern(passwordRegexp).required(),
  subscription: Joi.string(),
});

const validateSubscription = Joi.object({
  subscription: Joi.string().valid("starter", "pro", "business").required(),
});

const schemas = {
  registerSchema,
  loginSchema,
  emailSchema,
  validateSchema,
  validateSubscription,
};

const User = model("user", userSchema);

module.exports = { User, schemas };
