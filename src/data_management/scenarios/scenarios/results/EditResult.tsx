import { useEffect, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import SpinnerIfNotLoaded from "../../../../components/SpinnerIfNotLoaded";
import ResultForm from "./ResultForm";
import { ScenarioResult } from "../../../../types/scenarioType";
import { createFetchRecordFunctionFromUrl } from "../../../../utils/createFetchRecordFunctionFromUrl";

interface RouteProps {
  uuid: string;
  id: string;
}

export const EditResult = (props: RouteComponentProps<RouteProps>) => {
  const [currentRecord, setCurrentRecord] = useState<ScenarioResult | null>(null);
  const { uuid, id } = props.match.params;
  useEffect(() => {
    (async () => {
      const currentRecord: ScenarioResult = await createFetchRecordFunctionFromUrl(`/api/v4/scenarios/${uuid}/results/${id}/`)();
      setCurrentRecord(currentRecord);
    })();
  }, [uuid, id]);

  return (
    <SpinnerIfNotLoaded loaded={!!currentRecord}>
      <ResultForm currentRecord={currentRecord!} />;
    </SpinnerIfNotLoaded>
  );
};
