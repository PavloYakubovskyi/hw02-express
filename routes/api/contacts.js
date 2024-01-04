const express = require("express");

const {
  listContacts,
  getContactById,
  removeContact,
  // addContact,
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
      return res.status(400).json({ message: "Missing required fields" });
    }
    const existingContact = await Contact.findOne({ email });

    if (existingContact) {
      return res
        .status(400)
        .json({ message: "Contact with this email already exists" });
    }

    const newContact = await Contact.create(req.body);
    res.status(201).json({
      msg: "Contact added successfully",
      contact: newContact,
    });
  } catch (err) {
    console.error(err);
    res
      .status(err.statusCode || 500)
      .json({ message: err.message || "Error adding contact" });
  }
});

router.delete("/:contactId", async (req, res, next) => {
  try {
    const contactId = req.params.contactId;
    const deletedContact = await removeContact(contactId);

    if (!deletedContact) {
      return res.status(404).json({ message: "Not found" });
    }
    res.status(200).json({ message: "Contact deleted", deletedContact });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting contact" });
  }
});

router.put("/:contactId", async (req, res, next) => {
  try {
    const contactId = req.params.contactId;
    const { value, error } = contactsValidators.updateContactsValidator(
      req.body
    );

    if (error) {
      return res.status(400).json({ message: "Validation error", error });
    }

    if (!value || Object.keys(value).length === 0) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const updatedContact = await updateContact(contactId, value);

    if (!updatedContact) {
      return res.status(404).json({ message: "Not found" });
    }
    res.status(200).json(updatedContact);
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
