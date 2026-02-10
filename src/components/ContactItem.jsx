function ContactItem({ contact, onDelete, onEdit }) {
  return (
    <div className="contact-item">
      <div className="contact-info">
        <h3>
          {contact.firstName} {contact.lastName}
        </h3>
        <div className="contact-details">
          {contact.email && (
            <p>
              <span className="label">Email:</span>{" "}
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
            </p>
          )}
          {contact.phone && (
            <p>
              <span className="label">Phone:</span>{" "}
              <a href={`tel:${contact.phone}`}>{contact.phone}</a>
            </p>
          )}
          {contact.address && (
            <p>
              <span className="label">Address:</span> {contact.address}
            </p>
          )}
        </div>
      </div>
      <div className="contact-actions">
        <button
          className="btn btn-edit"
          onClick={() => onEdit(contact)}
          title="Edit contact"
        >
          Edit
        </button>
        <button
          className="btn btn-delete"
          onClick={() => {
            if (
              confirm(
                `Are you sure you want to delete ${contact.firstName} ${contact.lastName}?`,
              )
            ) {
              onDelete(contact.id);
            }
          }}
          title="Delete contact"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default ContactItem;
