import React from "react";
import { useSelector } from "react-redux";
import { withRouter } from "react-router-dom";
import { RouteComponentProps } from 'react-router';
import MDSpinner from "react-md-spinner";

import RasterSourceForm from "./RasterSourceForm";
import {
  getColorMaps,
  getObservationTypes,
  getOrganisations,
  getSupplierIds
} from "../../reducers";

interface RouteParams {
  rasterType: 'raster_sources' | 'raster_layers';
};

const NewRasterModel: React.FC<RouteComponentProps<RouteParams>> = (props) => {
  const organisations = useSelector(getOrganisations);
  const observationTypes = useSelector(getObservationTypes);
  const colorMaps = useSelector(getColorMaps);
  const supplierIds = useSelector(getSupplierIds);

  const { rasterType } = props.match.params;

  if (
    organisations.isFetching === false &&
    observationTypes.isFetching === false &&
    colorMaps.isFetching === false &&
    supplierIds.isFetching === false
  ) {
    if (rasterType === 'raster_sources') {
      return <RasterSourceForm />;
    } else if (rasterType === 'raster_layers') {
      return <div />
    } else {
      return <div />
    }
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

const NewRaster = withRouter(NewRasterModel);

export { NewRaster };