const express = require("express");

const { validateBody, authorization, upload } = require("../../middlewares");
const { schemas } = require("../../models/userModel");
const ctrl = require("../../controllers/userController");
const router = express.Router();

router.post("/register", validateBody(schemas.registerSchema), ctrl.register);

router.get("/verify/:verificationToken", ctrl.verifyEmail);

router.get(
  "/verify",
  validateBody(schemas.emailSchema),
  ctrl.resendVerifyEmail
);

router.post("/login", validateBody(schemas.loginSchema), ctrl.login);

router.post("/logout", authorization, ctrl.logout);

router.get("/current", authorization, ctrl.getCurrent);

router.patch(
  "/avatars",
  authorization,
  upload.single("avatar"),
  ctrl.updateAvatar
);

router.patch(
  "/",
  authorization,
  validateBody(schemas.validateSubscription),
  ctrl.updateSubscription
);

module.exports = router;
