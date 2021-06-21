import React from "react";
import { useSelector } from "react-redux";
import MDSpinner from "react-md-spinner";

import RasterLayerForm from "./RasterLayerForm";
import {
  getOrganisations,
  getDatasets,
} from "../../reducers";

export const NewRasterLayer: React.FC = () => {
  const organisations = useSelector(getOrganisations);
  const datasets = useSelector(getDatasets);

  if (
    organisations.isFetching === false &&
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