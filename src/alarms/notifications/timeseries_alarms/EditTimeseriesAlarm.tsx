import React, { useState, useEffect } from "react";
import { RouteComponentProps } from 'react-router';
import { getUuidFromUrl } from "../../../utils/getUuidFromUrl";
import { usePaginatedFetch } from "../../../utils/usePaginatedFetch";
import { TimeseriesFromTimeseriesEndpoint } from "../../../types/timeseriesType";
import TimeseriesAlarmForm from "./TimeseriesAlarmForm";
import SpinnerIfStandardSelectorsNotLoaded from '../../../components/SpinnerIfStandardSelectorsNotLoaded';
import {createFetchRecordFunctionFromUrl} from '../../../utils/createFetchRecordFunctionFromUrl';

interface RouteParams {
  uuid: string;
};

interface TimeseriesAlarm {
  timeseries: any;
  organisation: {uuid: string}
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

    const {
      results: groups,
      fetchingState: groupsFetchingState
    } = usePaginatedFetch({
      url: currentRecord ? `/api/v4/contactgroups/?organisation__uuid=${currentRecord.organisation.uuid}` : ''
    });

    const {
      results: templates,
      fetchingState: templatesFetchingState
    } = usePaginatedFetch({
      url: currentRecord ? `/api/v4/messages/?organisation__uuid=${currentRecord.organisation.uuid}` : ''
    });

    return (
      <SpinnerIfStandardSelectorsNotLoaded
        loaded={!!(
          currentRecord && timeseries &&
          groupsFetchingState === 'RETRIEVED' &&
          templatesFetchingState === 'RETRIEVED'
        )}
      >
        <TimeseriesAlarmForm
          currentRecord={currentRecord}
          timeseries={timeseries}
          groups={groups || []}
          templates={templates || []}
        />
      </SpinnerIfStandardSelectorsNotLoaded>
      
    );
  
};