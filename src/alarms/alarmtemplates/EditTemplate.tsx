import { useState, useEffect } from "react";
import { RouteComponentProps } from 'react-router';
import TemplateForm from "./TemplateForm";
import { Message } from "../../types/messageType";
import {createFetchRecordFunctionFromUrl} from '../../utils/createFetchRecordFunctionFromUrl';
import SpinnerIfNotLoaded from '../../components/SpinnerIfNotLoaded';


interface RouteParams {
  id: string;
};

export const EditTemplate = (props: RouteComponentProps<RouteParams>) => {
  const { id } = props.match.params;

  const [ currentRecord , setCurrentRecord] = useState<Message | null>(null)

  useEffect(() => {
    (async () => {
      const currentRecord = await createFetchRecordFunctionFromUrl(`/api/v4/messages/${id}/`)();
      setCurrentRecord(currentRecord);
    })();
  }, [id]);

  return (
    <SpinnerIfNotLoaded
      loaded={!!currentRecord}
    >
      <TemplateForm
        currentRecord={currentRecord!}
      />
    </SpinnerIfNotLoaded>
    
  );
};