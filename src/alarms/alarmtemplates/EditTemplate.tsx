import React,  {useState, useEffect} from "react";
import { RouteComponentProps } from 'react-router';
import TemplateForm from "./TemplateForm";
import {createFetchRecordFunctionFromUrl} from '../../utils/createFetchRecordFunctionFromUrl';
import SpinnerIfStandardSelectorsNotLoaded from '../../components/SpinnerIfStandardSelectorsNotLoaded';


interface RouteParams {
  id: string;
};

export const EditTemplate = (props: RouteComponentProps<RouteParams>) => {
  const { id } = props.match.params;

  const [ currentRecord , setCurrentRecord] = useState(null)

  useEffect(() => {
    (async () => {
      const currentRecord = await createFetchRecordFunctionFromUrl(`/api/v4/messages/${id}/`)();
      setCurrentRecord(currentRecord);
    })();
  }, [id]);

  return (
    <SpinnerIfStandardSelectorsNotLoaded
      loaded={!!currentRecord}
    >
      <TemplateForm
        currentRecord={currentRecord}
      />
    </SpinnerIfStandardSelectorsNotLoaded>
    
  );
};