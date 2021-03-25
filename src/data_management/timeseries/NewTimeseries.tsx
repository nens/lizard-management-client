import React from "react";
import { useSelector } from "react-redux";
import MDSpinner from "react-md-spinner";

import {TimeseriesForm} from "./TimeseriesForm";
import {
  getOrganisations,
} from "../../reducers";

export const NewTimeseries: React.FC = () => {
  const organisations = useSelector(getOrganisations);

  if (
    organisations.isFetching === false
  ) {
    return <TimeseriesForm 
    />;
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