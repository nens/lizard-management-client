import React from "react";

import ContactForm from "./ContactForm";
import { getSelectedOrganisation} from '../../reducers';
import FormContainer from '../../components/FormContainer';

export const NewContact = () => {
  return (
    <FormContainer
      selectorsToWaitFor={[getSelectedOrganisation]}
      FormComponent={ContactForm}
    />
  );
};