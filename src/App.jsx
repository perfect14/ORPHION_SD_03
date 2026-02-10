import { useState, useEffect } from "react";
import ContactForm from "./components/ContactForm";
import ContactList from "./components/ContactList";
import "./App.css";

function App() {
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingContact, setEditingContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = "http://localhost:3001/api/contacts";

  // Fetch all contacts on component mount
  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Failed to fetch contacts");
      const data = await response.json();
      setContacts(data);
      setError(null);
    } catch (err) {
      setError(
        "Unable to connect to the server. Make sure the backend is running on port 3001.",
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddContact = async (formData) => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add contact");
      }

      const newContact = await response.json();
      setContacts([...contacts, newContact]);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error(err);
    }
  };

  const handleUpdateContact = async (formData) => {
    try {
      const response = await fetch(`${API_URL}/${editingContact.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update contact");
      }

      const updatedContact = await response.json();
      setContacts(
        contacts.map((c) => (c.id === editingContact.id ? updatedContact : c)),
      );
      setEditingContact(null);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error(err);
    }
  };

  const handleDeleteContact = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete contact");
      }

      setContacts(contacts.filter((c) => c.id !== id));
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error(err);
    }
  };

  const handleEditContact = (contact) => {
    setEditingContact(contact);
    window.scrollTo(0, 0);
  };

  const handleFormSubmit = (formData) => {
    if (editingContact) {
      handleUpdateContact(formData);
    } else {
      handleAddContact(formData);
    }
  };

  const handleCancelEdit = () => {
    setEditingContact(null);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>📇 Contact Management System</h1>
        <p>Organize and manage your contacts efficiently</p>
      </header>

      {error && <div className="error-banner">{error}</div>}

      <div className="app-content">
        <aside className="sidebar">
          {editingContact ? (
            <div>
              <ContactForm
                onSubmit={handleFormSubmit}
                initialData={{
                  firstName: editingContact.firstName,
                  lastName: editingContact.lastName,
                  email: editingContact.email,
                  phone: editingContact.phone,
                  address: editingContact.address,
                }}
                isEditing={true}
              />
              <button
                className="btn btn-secondary"
                onClick={handleCancelEdit}
                style={{ width: "100%", marginTop: "10px" }}
              >
                Cancel Edit
              </button>
            </div>
          ) : (
            <ContactForm onSubmit={handleFormSubmit} />
          )}
        </aside>

        <main className="main-content">
          <div className="search-bar">
            <input
              type="text"
              placeholder="🔍 Search contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          {loading ? (
            <div className="loading">Loading contacts...</div>
          ) : (
            <ContactList
              contacts={contacts}
              onDelete={handleDeleteContact}
              onEdit={handleEditContact}
              searchTerm={searchTerm}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
