import React, { useEffect, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import MonitoringNetworkForm from "./MonitoringNetworkForm";
import SpinnerIfStandardSelectorsNotLoaded from '../../../components/SpinnerIfStandardSelectorsNotLoaded';
import {createFetchRecordFunctionFromUrl} from '../../../utils/createFetchRecordFunctionFromUrl';

interface RouteProps {
  uuid: string
}

export const EditMonitoringNetwork = (props: RouteComponentProps<RouteProps>) => {
  const [currentRecord, setCurrentRecord] = useState(null);
  const { uuid } = props.match.params;

  useEffect (() => {
    (async () => {
      const currentRecord = await createFetchRecordFunctionFromUrl(`/api/v4/monitoringnetworks/${uuid}`)();
      setCurrentRecord(currentRecord);
    })();
  }, [uuid])

  return (
    <SpinnerIfStandardSelectorsNotLoaded
      loaded={!!currentRecord}
    >
      <MonitoringNetworkForm
        currentRecord={currentRecord}
      />
    </SpinnerIfStandardSelectorsNotLoaded>
  );
}
