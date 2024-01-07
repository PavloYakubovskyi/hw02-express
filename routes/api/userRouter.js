const express = require("express");

const { validateBody, authorization } = require("../../middlewares");
const { schemas } = require("../../models/userModel");
const ctrl = require("../../controllers/userController");
const router = express.Router();

router.post("/register", validateBody(schemas.registerSchema), ctrl.register);

router.post("/login", validateBody(schemas.loginSchema), ctrl.login);

router.post("/logout", authorization, ctrl.logout);

router.get("/current", authorization, ctrl.getCurrent);

module.exports = router;
