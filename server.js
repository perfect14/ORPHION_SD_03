import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;
const CONTACTS_FILE = path.join(__dirname, "contacts.json");

// Middleware
app.use(cors());
app.use(express.json());

// Initialize contacts file if it doesn't exist
function initializeContactsFile() {
  if (!fs.existsSync(CONTACTS_FILE)) {
    fs.writeFileSync(CONTACTS_FILE, JSON.stringify([], null, 2));
  }
}

// Read contacts from file
function readContacts() {
  try {
    const data = fs.readFileSync(CONTACTS_FILE, "utf-8");
    return JSON.parse(data) || [];
  } catch (error) {
    console.error("Error reading contacts:", error);
    return [];
  }
}

// Write contacts to file
function writeContacts(contacts) {
  try {
    fs.writeFileSync(CONTACTS_FILE, JSON.stringify(contacts, null, 2));
    return true;
  } catch (error) {
    console.error("Error writing contacts:", error);
    return false;
  }
}

// Generate unique ID
function generateId() {
  return Date.now().toString();
}

// GET all contacts
app.get("/api/contacts", (req, res) => {
  const contacts = readContacts();
  res.json(contacts);
});

// GET contact by ID
app.get("/api/contacts/:id", (req, res) => {
  const contacts = readContacts();
  const contact = contacts.find((c) => c.id === req.params.id);

  if (!contact) {
    return res.status(404).json({ error: "Contact not found" });
  }

  res.json(contact);
});

// POST - Add new contact
app.post("/api/contacts", (req, res) => {
  const { firstName, lastName, email, phone, address } = req.body;

  // Validation
  if (!firstName || !lastName) {
    return res
      .status(400)
      .json({ error: "First name and last name are required" });
  }

  if (email && !isValidEmail(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  const contacts = readContacts();
  const newContact = {
    id: generateId(),
    firstName,
    lastName,
    email: email || "",
    phone: phone || "",
    address: address || "",
    createdAt: new Date().toISOString(),
  };

  contacts.push(newContact);

  if (writeContacts(contacts)) {
    res.status(201).json(newContact);
  } else {
    res.status(500).json({ error: "Failed to save contact" });
  }
});

// PUT - Update contact
app.put("/api/contacts/:id", (req, res) => {
  const { firstName, lastName, email, phone, address } = req.body;

  if (!firstName || !lastName) {
    return res
      .status(400)
      .json({ error: "First name and last name are required" });
  }

  if (email && !isValidEmail(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  const contacts = readContacts();
  const contactIndex = contacts.findIndex((c) => c.id === req.params.id);

  if (contactIndex === -1) {
    return res.status(404).json({ error: "Contact not found" });
  }

  contacts[contactIndex] = {
    ...contacts[contactIndex],
    firstName,
    lastName,
    email: email || "",
    phone: phone || "",
    address: address || "",
    updatedAt: new Date().toISOString(),
  };

  if (writeContacts(contacts)) {
    res.json(contacts[contactIndex]);
  } else {
    res.status(500).json({ error: "Failed to update contact" });
  }
});

// DELETE - Remove contact
app.delete("/api/contacts/:id", (req, res) => {
  const contacts = readContacts();
  const contactIndex = contacts.findIndex((c) => c.id === req.params.id);

  if (contactIndex === -1) {
    return res.status(404).json({ error: "Contact not found" });
  }

  const deletedContact = contacts.splice(contactIndex, 1);

  if (writeContacts(contacts)) {
    res.json(deletedContact[0]);
  } else {
    res.status(500).json({ error: "Failed to delete contact" });
  }
});

// Email validation helper
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Initialize and start server
initializeContactsFile();

app.listen(PORT, () => {
  console.log(`Contact Management Server running on http://localhost:${PORT}`);
});
