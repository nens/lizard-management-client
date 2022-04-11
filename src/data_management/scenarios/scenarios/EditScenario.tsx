import { useEffect, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import ScenarioForm from "./ScenarioForm";
import SpinnerIfNotLoaded from "../../../components/SpinnerIfNotLoaded";
import { createFetchRecordFunctionFromUrl } from "../../../utils/createFetchRecordFunctionFromUrl";
import { Scenario } from "../../../types/scenarioType";

interface RouteProps {
  uuid: string;
}

export const EditScenario = (props: RouteComponentProps<RouteProps>) => {
  const [currentRecord, setCurrentRecord] = useState<Scenario | null>(null);
  const { uuid } = props.match.params;
  useEffect(() => {
    (async () => {
      const currentRecord = await createFetchRecordFunctionFromUrl(`/api/v4/scenarios/${uuid}/`)();

      setCurrentRecord(currentRecord);
    })();
  }, [uuid]);

  return (
    <SpinnerIfNotLoaded loaded={!!currentRecord}>
      <ScenarioForm currentRecord={currentRecord!} />;
    </SpinnerIfNotLoaded>
  );
};
