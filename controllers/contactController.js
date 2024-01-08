const { Contact } = require("../models/contactModel");
const { httpError, ctrlWrapper } = require("../helpers");

const getAllContacts = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 20, favorite } = req.query;
  const skip = (page - 1) * limit;
  const allContacts = await Contact.find({ owner }, "", { skip, limit });

  let favoriteContacts;
  if (favorite === "true") {
    favoriteContacts = allContacts.filter((item) => item.favorite === true);
  } else if (favorite === "false") {
    favoriteContacts = allContacts.filter((item) => item.favorite === false);
  } else {
    favoriteContacts = allContacts;
  }

  res.status(200).json(favorite ? favoriteContacts : allContacts);
};

const getContactById = async (req, res) => {
  const { contactId } = req.params;
  const foundContactById = await Contact.findById(contactId);
  if (!foundContactById) {
    throw httpError(404, "Not Found");
  }
  res.status(200).json(foundContactById);
};

const addContact = async (req, res) => {
  const { _id: owner } = req.user;
  const newContact = await Contact.create({ ...req.body, owner });
  res.status(201).json(newContact);
};

const removeContactById = async (req, res) => {
  const { contactId } = req.params;
  const removeContact = await Contact.findByIdAndDelete(contactId);

  if (!removeContact) {
    throw httpError(404, "Not Found");
  }
  res.status(200).json({ message: "contact deleted" });
};

const updateContactById = async (req, res) => {
  const { contactId } = req.params;
  const updatedContact = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });
  if (!updatedContact) {
    throw httpError(404, "Not Found");
  }
  res.status(200).json(updatedContact);
};

const updateStatusContact = async (req, res) => {
  const { contactId } = req.params;
  const updateStatus = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });
  if (!updateStatus) {
    throw httpError(404, "Not Found");
  }
  res.status(200).json(updateStatus);
};

module.exports = {
  getAllContacts: ctrlWrapper(getAllContacts),
  getContactById: ctrlWrapper(getContactById),
  removeContactById: ctrlWrapper(removeContactById),
  addContact: ctrlWrapper(addContact),
  updateContactById: ctrlWrapper(updateContactById),
  updateStatusContact: ctrlWrapper(updateStatusContact),
};
