import React, { useEffect, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import ScenarioForm from "./ScenarioForm";
import SpinnerIfNotLoaded from '../../components/SpinnerIfNotLoaded';
import { createFetchRecordFunctionFromUrl } from '../../utils/createFetchRecordFunctionFromUrl';

interface RouteProps {
  uuid: string
}

export const EditScenario = (props: RouteComponentProps<RouteProps>) => {
  const [currentRecord, setCurrentRecord] = useState(null);
  const { uuid } = props.match.params;
  useEffect (() => {
    (async () => {
      const currentRecord = await createFetchRecordFunctionFromUrl(`/api/v4/scenarios/${uuid}/`)();

      setCurrentRecord(currentRecord);
    })();
  }, [uuid])

  return (
    <SpinnerIfNotLoaded
      loaded={!!currentRecord}
    >
      <ScenarioForm
        currentRecord={currentRecord}
      />;
    </SpinnerIfNotLoaded>
  );
}