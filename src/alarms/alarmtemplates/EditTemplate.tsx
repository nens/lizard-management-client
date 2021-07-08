import React from "react";
import { RouteComponentProps } from 'react-router';
import TemplateForm from "./TemplateForm";
import { getSelectedOrganisation} from '../../reducers';
import FormContainer from '../../components/FormContainer';
import {createFetchRecordFunctionFromUrl} from '../../utils/createFetchRecordFunctionFromUrl';

interface RouteParams {
  id: string;
};

export const EditTemplate = (props: RouteComponentProps<RouteParams>) => {
  const { id } = props.match.params;
  return (
    <FormContainer
      selectorsToWaitFor={[getSelectedOrganisation]}
      FormComponent={TemplateForm}
      retrieveCurrentFormDataFunction={createFetchRecordFunctionFromUrl(`/api/v4/messages/${id}/`)}
    />
  );
};