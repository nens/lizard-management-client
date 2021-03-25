import React from "react";
import { useSelector } from "react-redux";
import MDSpinner from "react-md-spinner";

import {LocationForm} from "./LocationForm";
import {
  getOrganisations,
} from "../../../reducers";

export const NewLocation: React.FC = () => {
  const organisations = useSelector(getOrganisations);

  if (
    organisations.isFetching === false
  ) {
    return <LocationForm 
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