import React from "react";
import { RouteComponentProps } from 'react-router';
import ContactForm from "./ContactForm";

import { getSelectedOrganisation} from '../../reducers';
import FormContainer from '../../components/FormContainer';
import {createFetchRecordFunctionFromUrl} from '../../utils/createFetchRecordFunctionFromUrl';

interface RouteParams {
  id: string;
};

export const EditContact = (props: RouteComponentProps<RouteParams>) => {
  const { id } = props.match.params;
  return (
    <FormContainer
      selectorsToWaitFor={[getSelectedOrganisation]}
      FormComponent={ContactForm}
      retrieveCurrentFormDataFunction={createFetchRecordFunctionFromUrl(`/api/v4/contacts/${id}/`)}
    />
  );
};