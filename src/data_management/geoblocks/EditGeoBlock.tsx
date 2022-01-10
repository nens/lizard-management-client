import React, { useEffect, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import GeoBlockForm from "./GeoBlockForm";
import SpinnerIfNotLoaded from './../../components/SpinnerIfNotLoaded';
import { createFetchRecordFunctionFromUrl } from './../../utils/createFetchRecordFunctionFromUrl';
import { RasterLayerFromAPI } from "../../api/rasters";

interface RouteProps {
  uuid: string
}

export const EditGeoBlock = (props: RouteComponentProps<RouteProps>) => {
  const [currentRecord, setCurrentRecord] = useState<RasterLayerFromAPI | null>(null);
  const { uuid } = props.match.params;

  useEffect (() => {
    (async () => {
      const currentRecord = await createFetchRecordFunctionFromUrl(`/api/v4/rasters/${uuid}/`)();
      setCurrentRecord(currentRecord);
    })();
  }, [uuid])

  return (
    <SpinnerIfNotLoaded
      loaded={!!currentRecord}
    >
      <GeoBlockForm
        currentRecord={currentRecord}
      />
    </SpinnerIfNotLoaded>
  );
}