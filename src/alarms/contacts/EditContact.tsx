import React, {useState, useEffect} from "react";
import { RouteComponentProps } from 'react-router';
import ContactForm from "./ContactForm";
import SpinnerIfNotLoaded from '../../components/SpinnerIfNotLoaded';
import {createFetchRecordFunctionFromUrl} from '../../utils/createFetchRecordFunctionFromUrl';

interface RouteParams {
  id: string;
};

export const EditContact = (props: RouteComponentProps<RouteParams>) => {
  const { id } = props.match.params;
  const [ currentRecord , setCurrentRecord] = useState(null)

  useEffect(() => {
    (async () => {
      const currentRecord = await createFetchRecordFunctionFromUrl(`/api/v4/contacts/${id}/`)();
      setCurrentRecord(currentRecord);
    })();
  }, [id]);

  return (
    <SpinnerIfNotLoaded
      loaded={!!currentRecord}
    >
      <ContactForm
        currentRecord={currentRecord}
      />
    </SpinnerIfNotLoaded>
    
  );
};