import React, { useState, useEffect } from "react";
import { RouteComponentProps } from 'react-router';
import MDSpinner from "react-md-spinner";
import ContactForm from "./ContactForm";

interface RouteParams {
  id: string;
};

export const EditContact: React.FC<RouteComponentProps<RouteParams>> = (props) => {
  const [currentContact, setCurrentContact] = useState<Object | null>(null);

  const { id } = props.match.params;
  useEffect(() => {
    (async () => {
      const contact = await fetch(`/api/v4/contacts/${id}/`, {
        credentials: "same-origin"
      }).then(
        response => response.json()
      );
      setCurrentContact(contact);
    })();
  }, [id]);

  if (currentContact) {
    return <ContactForm
      currentContact={currentContact}
    />;
  }
  else {
    return (
      <div
        style={{
          position: "relative",
          top: 50,
          height: 300,
          bottom: 50,
          marginLeft: "50%"
        }}
      >
        <MDSpinner size={24} />
      </div>
    );
  }
};