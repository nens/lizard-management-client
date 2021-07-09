import React, {useState, useEffect} from "react";
import { RouteComponentProps } from 'react-router';
import GroupForm from "./GroupForm";
import SpinnerIfStandardSelectorsNotLoaded from '../../components/SpinnerIfStandardSelectorsNotLoaded';
import {createFetchRecordFunctionFromUrl} from '../../utils/createFetchRecordFunctionFromUrl';

interface RouteParams {
  id: string;
};

export const EditGroup = (props: RouteComponentProps<RouteParams>) => {
  const { id } = props.match.params;

  const [ currentRecord , setCurrentRecord] = useState(null)

  useEffect(() => {
    (async () => {
      const currentRecord = await createFetchRecordFunctionFromUrl(`/api/v4/contactgroups/${id}/`)();
      setCurrentRecord(currentRecord);
    })();
  }, [id]);

  return (
    <SpinnerIfStandardSelectorsNotLoaded
      loaded={!!currentRecord}
    >
      <GroupForm
        currentRecord={currentRecord}
      />
    </SpinnerIfStandardSelectorsNotLoaded>
    
  );
};

