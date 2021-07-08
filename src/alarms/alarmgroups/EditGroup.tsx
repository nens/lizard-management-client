import React from "react";
import { RouteComponentProps } from 'react-router';
import GroupForm from "./GroupForm";
import { getSelectedOrganisation} from '../../reducers';
import FormContainer from '../../components/FormContainer';
import {createFetchRecordFunctionFromUrl} from '../../utils/createFetchRecordFunctionFromUrl';

interface RouteParams {
  id: string;
};

export const EditGroup = (props: RouteComponentProps<RouteParams>) => {
  const { id } = props.match.params;
  return (
    <FormContainer
      selectorsToWaitFor={[getSelectedOrganisation]}
      FormComponent={GroupForm}
      retrieveCurrentFormDataFunction={createFetchRecordFunctionFromUrl(`/api/v4/contactgroups/${id}/`)}
      {...props}
    />
  );
};

