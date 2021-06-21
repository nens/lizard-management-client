import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RouteComponentProps } from 'react-router';
import MDSpinner from "react-md-spinner";
import { fetchRasterSourceV4, RasterSourceFromAPI } from "../../api/rasters";
import { getOrganisations } from "../../reducers";
import RasterSourceForm from "./RasterSourceForm";

interface RouteParams {
  uuid: string;
};

export const EditRasterSource: React.FC<RouteComponentProps<RouteParams>> = (props) => {
  const [currentRasterSource, setCurrentRasterSource] = useState<RasterSourceFromAPI | null>(null);
  const organisations = useSelector(getOrganisations);

  const { uuid } = props.match.params;
  useEffect(() => {
    (async () => {
      const rasterSource = await fetchRasterSourceV4(uuid);
      setCurrentRasterSource(rasterSource);
    })();
  }, [uuid]);

  if (
    currentRasterSource &&
    organisations.isFetching === false
  ) {
    return <RasterSourceForm 
    currentRasterSource={currentRasterSource}
    />;
  }
  else {
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