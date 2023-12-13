const fs = require("fs").promises;
const path = require("path");

const contactsPath = path.resolve("models/contacts.json");

const listContacts = async () => {
  try {
    const readResult = await fs.readFile(contactsPath);
    
    const arrayContacts = JSON.parse(readResult);
  
    return arrayContacts;
  } catch (err) {
    console.error("Error reading contacts file:", err);
    throw err;
  }
};

const getContactById = async (contactId) => {
  try {
    const contacts = await listContacts();
    
    const foundContactById = contacts.find(
      (contact) => contact.id === contactId
    );
 
    return foundContactById;
  } catch (err) {
    console.error("Error getting contact by ID:", err);
    throw err;
  }
};

const removeContact = async (contactId) => {
  try {
    const contacts = await listContacts();

    const findContactIndex = contacts.findIndex(
      (contact) => contact.id === contactId
    );

    if (findContactIndex < 0) {
    
      return null;
    } else {
      const removeContactById = contacts.splice(findContactIndex, 1)[0];
     
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
