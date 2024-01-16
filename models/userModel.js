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
  token: {
    type: String,
    default: "",
  },
  avatarURL: {
    type: String,
    required: true,
  },
  verify: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
    required: [true, "Verify token is required"],
  },
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
    .pattern(passwordRegexp)
    .required()
    .messages({ "any.required": "Missing required password field." }),
  subscription: Joi.string(),
});

const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .pattern(emailRegExp)
    .message({ "any.required": "Missing required email field." }),
  password: Joi.string()
    .min(6)
    .pattern(passwordRegexp)
    .required()
    .messages({ "any.required": "Missing required password field." }),
  subscription: Joi.string(),
});

const emailSchema = Joi.object({
  email: Joi.string().pattern(emailRegExp).required(),
});

const validateSubscription = Joi.object({
  subscription: Joi.string().valid("starter", "pro", "business").required(),
});

const schemas = {
  registerSchema,
  loginSchema,
  emailSchema,
  validateSubscription,
};

const User = model("user", userSchema);

module.exports = { User, schemas };
