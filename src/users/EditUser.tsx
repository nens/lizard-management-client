import React, { useState, useEffect } from "react";
import { RouteComponentProps } from 'react-router';
import { useSelector } from "react-redux";
import { getSelectedOrganisation } from "../reducers";
import UserForm from "./UserForm";
import SpinnerIfNotLoaded from '../components/SpinnerIfNotLoaded';
import {createFetchRecordFunctionFromUrl} from '../utils/createFetchRecordFunctionFromUrl';

interface RouteParams {
  id: string;
};

export const EditUser: React.FC<RouteComponentProps<RouteParams>> = (props) => {
  const selectedOrganisation = useSelector(getSelectedOrganisation);
  const [currentRecord, setCurrentRecord] = useState<Object | undefined>(undefined);

  const { id } = props.match.params;
  useEffect(() => {
    (async () => {
      if (selectedOrganisation && selectedOrganisation.uuid) {
        const currentRecord = await createFetchRecordFunctionFromUrl(`/api/v4/organisations/${selectedOrganisation.uuid}/users/${id}/`)();
        setCurrentRecord(currentRecord);
      }
    })();
  }, [id, selectedOrganisation]);

  return (
    <SpinnerIfNotLoaded
      loaded={!!currentRecord}
    >
      <UserForm
        currentRecord={currentRecord}
      />
    </SpinnerIfNotLoaded>
  );
};