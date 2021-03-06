import React from "react";
import { useSelector } from "react-redux";
import MDSpinner from "react-md-spinner";

import RasterLayerForm from "./RasterLayerForm";
import {
  getColorMaps,
  getObservationTypes,
  getOrganisations,
  getSupplierIds,
  getDatasets,
} from "../../reducers";

export const NewRasterLayer: React.FC = () => {
  const organisations = useSelector(getOrganisations);
  const observationTypes = useSelector(getObservationTypes);
  const colorMaps = useSelector(getColorMaps);
  const supplierIds = useSelector(getSupplierIds);
  const datasets = useSelector(getDatasets);

  if (
    organisations.isFetching === false &&
    observationTypes.isFetching === false &&
    colorMaps.isFetching === false &&
    supplierIds.isFetching === false &&
    datasets.isFetching === false
  ) {
    return <RasterLayerForm />;
  } else {
    return <div
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
  }
}