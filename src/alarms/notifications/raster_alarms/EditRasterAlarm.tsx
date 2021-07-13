import React, { useState, useEffect } from "react";
import { RouteComponentProps } from 'react-router';
import RasterAlarmForm from "./RasterAlarmForm";
import { fetchRasterV4, RasterLayerFromAPI } from "../../../api/rasters";
import { getUuidFromUrl } from "../../../utils/getUuidFromUrl";
import SpinnerIfStandardSelectorsNotLoaded from '../../../components/SpinnerIfStandardSelectorsNotLoaded';
import {createFetchRecordFunctionFromUrl} from '../../../utils/createFetchRecordFunctionFromUrl';
import { usePaginatedFetch } from "../../../utils/usePaginatedFetch";

interface RouteParams {
  uuid: string;
};

interface RasterAlarm {
  organisation: {uuid: string}
}

export const EditRasterAlarm = (props: RouteComponentProps<RouteParams>) => {
  const [currentRecord, setCurrentRecord] = useState<RasterAlarm | null>(null);
  const [raster, setRaster] = useState<RasterLayerFromAPI | undefined>(undefined);

  const { uuid } = props.match.params;

  useEffect(() => {
    (async () => {
      const currentRecord = await createFetchRecordFunctionFromUrl(`/api/v4/rasteralarms/${uuid}/`)();
      setCurrentRecord(currentRecord);
    })();
  }, [uuid]);

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
  

  useEffect(() => {
    (async () => {
      if (currentRecord) {
        // @ts-ignore
        const rasterUrl = currentRecord.raster;
        const rasterUuid = getUuidFromUrl(rasterUrl);
        const raster = await fetchRasterV4(rasterUuid);
        setRaster(raster);
      }
    })();
  }, [currentRecord]);

  return (
    <SpinnerIfStandardSelectorsNotLoaded
      loaded={!!(currentRecord &&
        raster &&
        groupsFetchingState === 'RETRIEVED' &&
        templatesFetchingState === 'RETRIEVED')}
    >
      <RasterAlarmForm
        currentRecord={currentRecord}
        groups={groups || []}
        templates={templates || []}
        raster={raster}
      />
    </SpinnerIfStandardSelectorsNotLoaded>
    
  );
};