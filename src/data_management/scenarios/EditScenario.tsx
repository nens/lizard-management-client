import React, { useEffect, useState } from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { ScenarioForm } from "./ScenarioForm";
import SpinnerIfNotLoaded from '../../components/SpinnerIfNotLoaded';
import {createFetchRecordFunctionFromUrl} from '../../utils/createFetchRecordFunctionFromUrl';

interface RouteProps {
  uuid: string
}

const EditScenarioModel: React.FC<RouteComponentProps<RouteProps>> = (props) => {
  const [currentRecord, setCurrentRecord] = useState(null);
  const { uuid } = props.match.params;
  useEffect (() => {
    (async () => {
      const currentRecord = await createFetchRecordFunctionFromUrl(`/api/v4/scenarios/${uuid}`)();

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

const EditScenario = withRouter(EditScenarioModel);

export { EditScenario };
