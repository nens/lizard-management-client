import React, { useState, useEffect } from "react";
import { RouteComponentProps } from 'react-router';
import { fetchRasterSourceV4, RasterSourceFromAPI } from "../../api/rasters";
import RasterSourceForm from "./RasterSourceForm";
import SpinnerIfStandardSelectorsNotLoaded from '../../components/SpinnerIfStandardSelectorsNotLoaded';


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
    <SpinnerIfStandardSelectorsNotLoaded
      loaded={!!currentRecord}
    >
      <RasterSourceForm 
        currentRecord={currentRecord}
      />
    </SpinnerIfStandardSelectorsNotLoaded>
  );
};