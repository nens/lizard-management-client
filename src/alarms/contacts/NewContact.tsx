import React from "react";

import ContactForm from "./ContactForm";
import SpinnerIfNotLoaded from '../../components/SpinnerIfNotLoaded';


export const NewContact = () => {
  return (
    <SpinnerIfNotLoaded
      loaded={true}
    >
      <ContactForm
      />
    </SpinnerIfNotLoaded>
    
  );
};