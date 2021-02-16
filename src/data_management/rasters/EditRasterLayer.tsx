import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RouteComponentProps } from 'react-router';
import MDSpinner from "react-md-spinner";
import { fetchRasterV4, RasterLayerFromAPI } from "../../api/rasters";
import { getColorMaps, getObservationTypes, getOrganisations, getSupplierIds } from "../../reducers";
import RasterLayerForm from "./RasterLayerForm";

interface RouteParams {
  uuid: string;
};

export const EditRasterLayer: React.FC<RouteComponentProps<RouteParams>> = (props) => {
  const [currentRasterLayer, setCurrentRasterLayer] = useState<RasterLayerFromAPI | null>(null);
  const organisations = useSelector(getOrganisations);
  const observationTypes = useSelector(getObservationTypes);
  const colorMaps = useSelector(getColorMaps);
  const supplierIds = useSelector(getSupplierIds);

  const { uuid } = props.match.params;
  useEffect(() => {
    (async () => {
      const rasterLayer = await fetchRasterV4(uuid);
      setCurrentRasterLayer(rasterLayer);
    })();
  }, [uuid]);

  if (
    currentRasterLayer &&
    organisations.isFetching === false &&
    observationTypes.isFetching === false &&
    colorMaps.isFetching === false &&
    supplierIds.isFetching === false
  ) {
    return <RasterLayerForm
      currentRasterLayer={currentRasterLayer}
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