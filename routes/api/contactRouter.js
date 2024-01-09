const express = require("express");
const ctrl = require("../../controllers/contactController");
const { validateBody, isValidId, authorization } = require("../../middlewares");
const { schemas } = require("../../models/contactModel");

const router = express.Router();

router.get("/contacts", authorization, ctrl.getAllContacts);

router.get(
  "/contacts/:contactId",
  authorization,
  isValidId,
  ctrl.getContactById
);

router.post(
  "/contacts",
  authorization,
  validateBody(schemas.addSchema),
  ctrl.addContact
);

router.put(
  "/contacts/:contactId",
  authorization,
  isValidId,
  validateBody(schemas.addSchema),
  ctrl.updateContactById
);

router.patch(
  "/contacts/:contactId/favorite",
  authorization,
  isValidId,
  validateBody(schemas.updateFavoriteSchema),
  ctrl.updateStatusContact
);

router.delete(
  "/contacts/:contactId",
  authorization,
  isValidId,
  ctrl.removeContactById
);

module.exports = router;
