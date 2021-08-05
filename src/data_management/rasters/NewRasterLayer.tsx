import React from "react";
import { useSelector } from "react-redux";
import MDSpinner from "react-md-spinner";

import RasterLayerForm from "./RasterLayerForm";
import {
  getOrganisations,
  getLayercollections,
} from "../../reducers";

export const NewRasterLayer: React.FC = () => {
  const organisations = useSelector(getOrganisations);
  const layercollections = useSelector(getLayercollections);

  if (
    organisations.isFetching === false &&
    layercollections.isFetching === false
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