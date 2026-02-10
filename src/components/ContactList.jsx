import ContactItem from "./ContactItem";

function ContactList({ contacts, onDelete, onEdit, searchTerm = "" }) {
  const filteredContacts = contacts.filter((contact) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      contact.firstName.toLowerCase().includes(searchLower) ||
      contact.lastName.toLowerCase().includes(searchLower) ||
      contact.email.toLowerCase().includes(searchLower) ||
      contact.phone.includes(searchTerm)
    );
  });

  if (contacts.length === 0) {
    return (
      <div className="empty-state">
        <p>No contacts yet. Add your first contact!</p>
      </div>
    );
  }

  if (filteredContacts.length === 0) {
    return (
      <div className="empty-state">
        <p>No contacts matching "{searchTerm}"</p>
      </div>
    );
  }

  return (
    <div className="contact-list">
      <h2>Contacts ({filteredContacts.length})</h2>
      <div className="contacts-container">
        {filteredContacts.map((contact) => (
          <ContactItem
            key={contact.id}
            contact={contact}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        ))}
      </div>
    </div>
  );
}

export default ContactList;
