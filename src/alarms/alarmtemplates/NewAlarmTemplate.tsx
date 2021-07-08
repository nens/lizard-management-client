import React from "react";

import TemplateForm from "./TemplateForm";

import { getSelectedOrganisation} from '../../reducers';
import FormContainer from '../../components/FormContainer';

export const NewTemplate = () => {
  return (
    <FormContainer
      selectorsToWaitFor={[getSelectedOrganisation]}
      FormComponent={TemplateForm}
    />
  );
};
