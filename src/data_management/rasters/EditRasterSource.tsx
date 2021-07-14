import React, { useState, useEffect } from "react";
import { RouteComponentProps } from 'react-router';
import { fetchRasterSourceV4, RasterSourceFromAPI } from "../../api/rasters";
import RasterSourceForm from "./RasterSourceForm";
import SpinnerIfNotLoaded from '../../components/SpinnerIfNotLoaded';


interface RouteParams {
  uuid: string;
};

export const EditRasterSource: React.FC<RouteComponentProps<RouteParams>> = (props) => {
  const [currentRecord, setCurrentRecord] = useState<RasterSourceFromAPI | undefined>(undefined);

  const { uuid } = props.match.params;
  useEffect(() => {
    (async () => {
      const currentRecord = await fetchRasterSourceV4(uuid);
      setCurrentRecord(currentRecord);
    })();
  }, [uuid]);

  return (
    <SpinnerIfNotLoaded
      loaded={!!currentRecord}
    >
      <RasterSourceForm 
        currentRecord={currentRecord}
      />
    </SpinnerIfNotLoaded>
  );
};