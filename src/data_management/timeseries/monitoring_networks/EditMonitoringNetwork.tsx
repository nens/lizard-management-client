import { useEffect, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import MonitoringNetworkForm from "./MonitoringNetworkForm";
import SpinnerIfNotLoaded from "../../../components/SpinnerIfNotLoaded";
import { createFetchRecordFunctionFromUrl } from "../../../utils/createFetchRecordFunctionFromUrl";
import { MonitoringNetwork } from "../../../types/monitoringNetworkType";

interface RouteProps {
  uuid: string;
}

export const EditMonitoringNetwork = (props: RouteComponentProps<RouteProps>) => {
  const [currentRecord, setCurrentRecord] = useState<MonitoringNetwork | null>(null);
  const { uuid } = props.match.params;

  useEffect(() => {
    (async () => {
      const currentRecord = await createFetchRecordFunctionFromUrl(
        `/api/v4/monitoringnetworks/${uuid}`
      )();
      setCurrentRecord(currentRecord);
    })();
  }, [uuid]);

  return (
    <SpinnerIfNotLoaded loaded={!!currentRecord}>
      <MonitoringNetworkForm currentRecord={currentRecord!} />
    </SpinnerIfNotLoaded>
  );
};
