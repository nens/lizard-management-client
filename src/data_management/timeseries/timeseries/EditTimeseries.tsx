import { useEffect, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { getUuidFromUrl } from "../../../utils/getUuidFromUrl";
import TimeseriesForm, { Datasource } from "./TimeseriesForm";
import SpinnerIfNotLoaded from '../../../components/SpinnerIfNotLoaded';
import {createFetchRecordFunctionFromUrl} from '../../../utils/createFetchRecordFunctionFromUrl';
import { TimeseriesFromTimeseriesEndpoint } from "../../../types/timeseriesType";

interface RouteProps {
  uuid: string
}

export const EditTimeseries = (props: RouteComponentProps<RouteProps>) => {
  const [currentRecord, setCurrentRecord] = useState<TimeseriesFromTimeseriesEndpoint | null>(null);
  const [datasourceIsRequired, setDatasourceIsRequired] = useState<boolean | null>(null);
  const [datasource, setDatasource] = useState<Datasource | undefined>(undefined);
  const { uuid } = props.match.params;

  useEffect (() => {
    (async () => {
      const currentRecord = await createFetchRecordFunctionFromUrl(`/api/v4/timeseries/${uuid}/`)();
      setCurrentRecord(currentRecord);

      const datasourceField: string | null = currentRecord.datasource;
      if (datasourceField) {
        setDatasourceIsRequired(true);
        const datasourceId = getUuidFromUrl(datasourceField);

        const currentDatasource = await createFetchRecordFunctionFromUrl(`/api/v4/datasources/${datasourceId}/`)();
        setDatasource(currentDatasource);
      } else {
        setDatasourceIsRequired(false);
      };
    })();
  }, [uuid])

  return (
    <SpinnerIfNotLoaded
      loaded={!!(
        currentRecord &&
        (datasourceIsRequired === false || datasource) 
      )}
    >
      <TimeseriesForm
        currentRecord={currentRecord!}
        datasource={datasourceIsRequired? datasource: undefined}
      />
    </SpinnerIfNotLoaded>
  );
}