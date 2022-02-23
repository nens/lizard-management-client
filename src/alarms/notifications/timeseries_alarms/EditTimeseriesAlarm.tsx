import React, { useState, useEffect } from "react";
import { RouteComponentProps } from 'react-router';
import { getUuidFromUrl } from "../../../utils/getUuidFromUrl";
import { useRecursiveFetch } from "../../../api/hooks";
import { TimeseriesFromTimeseriesEndpoint } from "../../../types/timeseriesType";
import { createFetchRecordFunctionFromUrl } from '../../../utils/createFetchRecordFunctionFromUrl';
import { TimeseriesAlarm } from "../../../types/alarmType";
import TimeseriesAlarmForm from "./TimeseriesAlarmForm";
import SpinnerIfNotLoaded from '../../../components/SpinnerIfNotLoaded';

interface RouteParams {
  uuid: string;
};

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
        const timeseries = await createFetchRecordFunctionFromUrl(`/api/v4/timeseries/${timeseriesUuid}/`)();
        setTimeseries(timeseries);
      }
    })();
  }, [currentRecord]);

  const {
    data: groups,
    status: groupsFetchStatus
  } = useRecursiveFetch(
    '/api/v4/contactgroups/',
    { organisation__uuid: currentRecord ? currentRecord.organisation.uuid : '' },
    { enabled: !!currentRecord }
  );

  const {
    data: templates,
    status: templatesFetchStatus
  } = useRecursiveFetch(
    '/api/v4/messages/',
    { organisation__uuid: currentRecord ? currentRecord.organisation.uuid : '' },
    { enabled: !!currentRecord }
  );

    return (
      <SpinnerIfNotLoaded
        loaded={!!(
          currentRecord && timeseries &&
          groupsFetchStatus === 'success' &&
          templatesFetchStatus === 'success'
        )}
      >
        <TimeseriesAlarmForm
          currentRecord={currentRecord!}
          timeseries={timeseries}
          groups={groups || []}
          templates={templates || []}
        />
      </SpinnerIfNotLoaded>
      
    );
  
};