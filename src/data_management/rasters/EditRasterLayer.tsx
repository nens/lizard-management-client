import React, { useState, useEffect } from "react";
import { RouteComponentProps } from 'react-router';
import { fetchRasterV4, RasterLayerFromAPI } from "../../api/rasters";
import RasterLayerForm from "./RasterLayerForm";
import SpinnerIfNotLoaded from '../../components/SpinnerIfNotLoaded';

interface RouteParams {
  uuid: string;
};

export const EditRasterLayer: React.FC<RouteComponentProps<RouteParams>> = (props) => {
  const [currentRecord, setCurrentRecord] = useState<RasterLayerFromAPI | undefined>(undefined);

  const { uuid } = props.match.params;
  useEffect(() => {
    (async () => {
      const currentRecord = await fetchRasterV4(uuid);
      setCurrentRecord(currentRecord);
    })();
  }, [uuid]);

  return (
    <SpinnerIfNotLoaded
      loaded={!!currentRecord}
    >
      <RasterLayerForm
        currentRecord={currentRecord}
      />;
    </SpinnerIfNotLoaded>
  );
};