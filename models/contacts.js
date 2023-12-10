const fs = require("fs").promises;
const path = require("path");

const contactsPath = path.resolve("models/contacts.json");
// console.log("contactsPath:", contactsPath);

const listContacts = async () => {
  try {
    // Повертає масив контактів.
    const readResult = await fs.readFile(contactsPath);
    // console.log("readResult:", readResult);
    const arrayContacts = JSON.parse(readResult);
    // console.log("listContacts:", arrayContacts);
    return arrayContacts;
  } catch (err) {
    console.error("Error reading contacts file:", err);
    throw err;
  }
};

const getContactById = async (contactId) => {
  try {
    const contacts = await listContacts();
    // console.log("contacts:", contacts);
    const foundContactById = contacts.find(
      (contact) => contact.id === contactId
    );
    // console.log("getContactById:", foundContactById);
    return foundContactById;
  } catch (err) {
    console.error("Error getting contact by ID:", err);
    throw err;
  }
};

const removeContact = async (contactId) => {
  try {
    const contacts = await listContacts();
    // console.log("contacts:", contacts);
    const findContactIndex = contacts.findIndex(
      (contact) => contact.id === contactId
    );

    if (findContactIndex < 0) {
      // console.error("message:", "Not found");
      return null;
    } else {
      const removeContactById = contacts.splice(findContactIndex, 1)[0];
      // console.log("removeContactById:", removeContactById);
      return removeContactById;
    }
  } catch (err) {
    console.error("Error removing contact:", err);
    throw err;
  }
};

const addContact = async (body) => {
  try {
    const contacts = await listContacts();

    contacts.push(body);
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    console.log("Added contact:", body);
    return contacts;
  } catch (err) {
    console.error("Error adding contact:", err);
    throw err;
  }
};

const updateContact = async (contactId, body) => {
  try {
    const contacts = await listContacts();
    const contactIndex = contacts.findIndex(
      (contact) => contact.id === contactId
    );

    if (contactIndex === -1) {
      return null;
    }

    Object.assign(contacts[contactIndex], body);

    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

    return contacts[contactIndex];
  } catch (err) {
    console.error(err);
    throw err;
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
