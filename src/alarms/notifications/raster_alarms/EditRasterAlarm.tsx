import React, { useState, useEffect } from "react";
import { RouteComponentProps } from 'react-router';
import RasterAlarmForm from "./RasterAlarmForm";
import { fetchRasterV4, RasterLayerFromAPI } from "../../../api/rasters";
import { getUuidFromUrl } from "../../../utils/getUuidFromUrl";
import { usePaginatedFetch } from "../../../utils/usePaginatedFetch";
import MDSpinner from "react-md-spinner";

interface RouteParams {
  uuid: string;
};

export const EditRasterAlarm: React.FC<RouteComponentProps<RouteParams>> = (props) => {
  const [currentRasterAlarm, setCurrentRasterAlarm] = useState<any | null>(null);
  const [raster, setRaster] = useState<RasterLayerFromAPI | null>(null);

  const { uuid } = props.match.params;
  useEffect(() => {
    (async () => {
      const rasterAlarm = await fetch(`/api/v4/rasteralarms/${uuid}/`, {
        credentials: "same-origin"
      }).then(
        response => response.json()
      );

      const rasterUrl = rasterAlarm.raster;
      const rasterUuid = getUuidFromUrl(rasterUrl);
      const raster = await fetchRasterV4(rasterUuid);

      setCurrentRasterAlarm(rasterAlarm);
      setRaster(raster);
    })();
  }, [uuid]);

  const {
    results: groups,
    fetchingState: groupsFetchingState
  } = usePaginatedFetch({
    url: currentRasterAlarm ? `/api/v4/contactgroups/?organisation__uuid=${currentRasterAlarm.organisation.uuid}` : ''
  });

  const {
    results: templates,
    fetchingState: templatesFetchingState
  } = usePaginatedFetch({
    url: currentRasterAlarm ? `/api/v4/messages/?organisation__uuid=${currentRasterAlarm.organisation.uuid}` : ''
  });

  if (
    currentRasterAlarm &&
    raster &&
    groupsFetchingState && groupsFetchingState !== 'FETCHING' &&
    templatesFetchingState && templatesFetchingState !== 'FETCHING'
  ) {
    return (
      <RasterAlarmForm
        groups={groups || []}
        templates={templates || []}
        currentRasterAlarm={currentRasterAlarm}
        raster={raster}
      />
    )
  } else {
    return (
      <div
        style={{
          position: "relative",
          top: 50,
          height: 300,
          bottom: 50,
          marginLeft: "50%"
        }}
      >
        <MDSpinner size={24} />
      </div>
    );
  }
};