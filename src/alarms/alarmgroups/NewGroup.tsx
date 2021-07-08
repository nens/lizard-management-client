import React from "react";

import GroupForm from "./GroupForm";
import { getSelectedOrganisation} from '../../reducers';
import FormContainer from '../../components/FormContainer';


export const NewGroup = () => {
    return (
      <FormContainer
        selectorsToWaitFor={[getSelectedOrganisation]}
        FormComponent={GroupForm}
      />
    );
};