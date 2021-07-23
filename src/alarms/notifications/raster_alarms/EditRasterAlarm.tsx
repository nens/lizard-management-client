import React, { useState, useEffect } from "react";
import { RouteComponentProps } from 'react-router';
import RasterAlarmForm from "./RasterAlarmForm";
import { fetchRasterV4, RasterLayerFromAPI } from "../../../api/rasters";
import { getUuidFromUrl } from "../../../utils/getUuidFromUrl";
import SpinnerIfNotLoaded from '../../../components/SpinnerIfNotLoaded';
import { createFetchRecordFunctionFromUrl } from '../../../utils/createFetchRecordFunctionFromUrl';
import { useRecursiveFetch } from "../../../api/hooks";

interface RouteParams {
  uuid: string;
};

interface RasterAlarm {
  raster: string, // raster url
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
    data: groups,
    status: groupsFetchStatus
  } = useRecursiveFetch(
    '/api/v4/contactgroups/',
    currentRecord ? {organisation__uuid: currentRecord.organisation.uuid} : {}
  );

  const {
    data: templates,
    status: templatesFetchStatus
  } = useRecursiveFetch(
    '/api/v4/messages/',
    currentRecord ? {organisation__uuid: currentRecord.organisation.uuid} : {}
  );
  

  useEffect(() => {
    (async () => {
      if (currentRecord) {
        const rasterUrl = currentRecord.raster;
        const rasterUuid = getUuidFromUrl(rasterUrl);
        const raster = await fetchRasterV4(rasterUuid);
        setRaster(raster);
      }
    })();
  }, [currentRecord]);

  return (
    <SpinnerIfNotLoaded
      loaded={!!(currentRecord &&
        raster &&
        groupsFetchStatus === 'success' &&
        templatesFetchStatus === 'success')}
    >
      <RasterAlarmForm
        currentRecord={currentRecord}
        groups={groups || []}
        templates={templates || []}
        raster={raster}
      />
    </SpinnerIfNotLoaded>
    
  );
};