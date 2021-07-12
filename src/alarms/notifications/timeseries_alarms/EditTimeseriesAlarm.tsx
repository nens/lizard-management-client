import React, { useState, useEffect } from "react";
import { RouteComponentProps } from 'react-router';
import { getUuidFromUrl } from "../../../utils/getUuidFromUrl";
import { TimeseriesFromTimeseriesEndpoint } from "../../../types/timeseriesType";
import TimeseriesAlarmForm from "./TimeseriesAlarmForm";
import SpinnerIfStandardSelectorsNotLoaded from '../../../components/SpinnerIfStandardSelectorsNotLoaded';
import {createFetchRecordFunctionFromUrl} from '../../../utils/createFetchRecordFunctionFromUrl';

interface RouteParams {
  uuid: string;
};

interface TimeseriesAlarm {
  timeseries: any
}

export const EditTimeseriesAlarm: React.FC<RouteComponentProps<RouteParams>> = (props) => {
  const [currentRecord, setCurrentRecord] = useState<TimeseriesAlarm | null>(null);
  const [timeseries, setTimeseries] = useState<TimeseriesFromTimeseriesEndpoint | undefined>(undefined);

  const { uuid } = props.match.params;

  useEffect(() => {
    (async () => {
      const currentRecord = await createFetchRecordFunctionFromUrl(`/api/v4/timeseriesalarms/${uuid}/`)();
      setCurrentRecord(currentRecord);
    })();
  }, [uuid]);
  useEffect(() => {
    (async () => {
      if (currentRecord) {
        const timeseriesUrl = currentRecord.timeseries;
        const timeseriesUuid = getUuidFromUrl(timeseriesUrl);
        const timeseries = await createFetchRecordFunctionFromUrl(`/api/v4/timeseriesalarms/${timeseriesUuid}/`)();
        setTimeseries(timeseries);
      }
    })();
  }, [currentRecord]);

    return (
      <SpinnerIfStandardSelectorsNotLoaded
        loaded={!!(currentRecord && timeseries)}
      >
        <TimeseriesAlarmForm
          currentRecord={currentRecord}
          timeseries={timeseries}
        />
      </SpinnerIfStandardSelectorsNotLoaded>
      
    );
  
};