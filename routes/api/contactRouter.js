const express = require("express");
const ctrl = require("../../controllers/contactController");
const { validateBody, isValidId, authorization } = require("../../middlewares");
const { schemas } = require("../../models/contactModel");

const router = express.Router();

router.get("/", authorization, ctrl.getAllContacts);

router.get("/:contactId", authorization, isValidId, ctrl.getContactById);

router.post(
  "/",
  authorization,
  validateBody(schemas.addSchema),
  ctrl.addContact
);

router.put(
  "/:contactId",
  authorization,
  isValidId,
  validateBody(schemas.addSchema),
  ctrl.updateContactById
);

router.patch(
  "/:contactId/favorite",
  authorization,
  isValidId,
  validateBody(schemas.updateFavoriteSchema),
  ctrl.updateStatusContact
);

router.delete("/:contactId", authorization, isValidId, ctrl.removeContactById);

module.exports = router;
