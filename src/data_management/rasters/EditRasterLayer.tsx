import React, { useState, useEffect } from "react";
import { RouteComponentProps } from 'react-router';
import { fetchRasterV4, RasterLayerFromAPI } from "../../api/rasters";
import RasterLayerForm from "./RasterLayerForm";
import SpinnerIfStandardSelectorsNotLoaded from '../../components/SpinnerIfStandardSelectorsNotLoaded';

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
    <SpinnerIfStandardSelectorsNotLoaded
      loaded={!!currentRecord}
    >
      <RasterLayerForm
        currentRecord={currentRecord}
      />;
    </SpinnerIfStandardSelectorsNotLoaded>
  );
};