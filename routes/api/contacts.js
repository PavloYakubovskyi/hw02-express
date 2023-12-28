const express = require("express");

const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
} = require("../../models/contacts");

const { HttpError, contactsValidators } = require("../../utils");
const { Contact } = require("../../models");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const contacts = await listContacts();
    res.status(200).json({ message: "Success!", contacts });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error fetching contacts" });
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const contactId = req.params.id;

    const contact = await getContactById(contactId);

    if (!contact) {
      return res.status(404).json({ message: "Not found" });
    }
    res.status(200).json({ contact });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching contact" });
  }
});

router.post("/", async (req, res, next) => {
  try {
    const validationResult = contactsValidators.createContactsValidator(
      req.body
    );
    if (validationResult.error) {
      throw new HttpError(400, "Invalid contacts data!");
    }
    const { name, email, phone } = validationResult.value;
    if (!name || !email || !phone) {
      return res.status(400).json({ message: "missing required name field" });
    }

    const newContact = await Contact.create(req.body);
    res.status(201).json({
      msg: "Success!",
      contact: newContact,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error adding contact" });
  }
});

router.delete("/:contactId", async (req, res, next) => {
  try {
    const contactId = req.params.contactId;
    const deleteUser = await removeContact(contactId);

    if (!deleteUser) {
      return res.status(404).json({ message: "Not found" });
    }
    res.status(200).json({ message: "Contact deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting contact" });
  }
});

router.put("/:contactId", async (req, res, next) => {
  try {
    const contactId = req.params.contactId;
    const validationResult = contactsValidators.updateContactsValidator(
      req.body
    );
    const body = validationResult.value;
    if (validationResult.error) {
      return res.status(400).json({ message: "Validation error" });
    }

    if (!body || Object.keys(body).length === 0) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const updateContacts = await updateContact(contactId, body);

    if (!updateContact) {
      return res.status(404).json({ message: "Not found" });
    }
    res.status(200).json(updateContacts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating contact" });
  }
});

router.patch("/:contactId/favorite", async (req, res, next) => {
  const contactId = req.params.contactId;
  const { favorite } = req.body;

  if (favorite === undefined) {
    return res.status(400).json({ message: "missing field favorite" });
  }

  if (typeof favorite !== "boolean") {
    return res.status(400).json({ message: "favorite must be a boolean" });
  }

  try {
    const updateContact = await updateStatusContact(contactId, favorite);

    if (!updateContact) {
      return res.status(404).json({ message: "Not found" });
    }
    res.status(200).json(updateContact);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
