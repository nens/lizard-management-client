import React, { useEffect, useState } from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { ScenarioForm } from "./ScenarioForm";
import SpinnerIfStandardSelectorsNotLoaded from '../../components/SpinnerIfStandardSelectorsNotLoaded';
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
    <SpinnerIfStandardSelectorsNotLoaded
      loaded={!!currentRecord}
    >
      <ScenarioForm
        currentRecord={currentRecord}
      />;
    </SpinnerIfStandardSelectorsNotLoaded>
  );
}

const EditScenario = withRouter(EditScenarioModel);

export { EditScenario };
