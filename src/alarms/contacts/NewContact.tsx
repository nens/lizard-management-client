import React from "react";

import ContactForm from "./ContactForm";
import SpinnerIfStandardSelectorsNotLoaded from '../../components/SpinnerIfStandardSelectorsNotLoaded';


export const NewContact = () => {
  return (
    <SpinnerIfStandardSelectorsNotLoaded
      loaded={true}
    >
      <ContactForm
      />
    </SpinnerIfStandardSelectorsNotLoaded>
    
  );
};