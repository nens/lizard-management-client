import React, { useEffect, useState } from "react";
import { RouteComponentProps,} from "react-router-dom";
import { LabeltypeForm } from "./LabeltypeForm";
import SpinnerIfStandardSelectorsNotLoaded from '../../components/SpinnerIfStandardSelectorsNotLoaded';
import {createFetchRecordFunctionFromUrl} from '../../utils/createFetchRecordFunctionFromUrl';

interface RouteProps {
  uuid: string
}

const EditLabeltype = (props: RouteComponentProps<RouteProps>) => {
  const [currentRecord, setCurrentRecord] = useState(null);
  const { uuid } = props.match.params;
  useEffect (() => {
    (async () => {
      const currentRecord = await createFetchRecordFunctionFromUrl(`/api/v3/labeltypes/${uuid}/`)();
      setCurrentRecord(currentRecord);
    })();
  }, [uuid])

  
    return (
      <SpinnerIfStandardSelectorsNotLoaded
        loaded={!!currentRecord}
      >
        <LabeltypeForm
          currentRecord={currentRecord}
        />
      </SpinnerIfStandardSelectorsNotLoaded>
    );
  
}

export { EditLabeltype };
