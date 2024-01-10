const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");
const gravatar = require("gravatar");
require("dotenv").config();

const { httpError, ctrlWrapper } = require("../helpers");
const { User } = require("../models/userModel");
const { JWT_SECRET_KEY, JWT_EXPIRES } = process.env;

const publicPath = path.join(__dirname, "../", "public");

const register = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  console.log(User);
  if (user) {
    throw httpError(409, "Email in use");
  }

  const saltRounds = 10;
  const hashPassword = await bcrypt.hash(password, saltRounds);

  const avatarURL = gravatar.url(email, { s: "150", r: "pg", d: "identicon" });

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
  });

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
      avatarURL,
    },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw httpError(401, "Email or password is wrong");
  }

  const passwordCompare = await bcrypt.compare(password, user.password);

  if (!passwordCompare) {
    throw httpError(401, "Email or password is wrong");
  }

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: JWT_EXPIRES });

  await User.findByIdAndUpdate(user._id, { token });

  res.status(200).json({
    token: token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });

  res.status(204).json({
    message: "No content",
  });
};

const getCurrent = (req, res) => {
  const { email, subscription } = req.user;
  res.status(200).json({
    email,
    subscription,
  });
};

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  logout: ctrlWrapper(logout),
  getCurrent: ctrlWrapper(getCurrent),
  publicPath,
};
