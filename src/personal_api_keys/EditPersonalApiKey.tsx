import React, { useState, useEffect } from "react";
// import { useSelector } from "react-redux";
import { RouteComponentProps } from 'react-router';
import MDSpinner from "react-md-spinner";
// import { fetchRasterV4, RasterLayerFromAPI } from "../../api/rasters";
// import { getColorMaps, getObservationTypes, getOrganisations, getSupplierIds } from "../reducers";
import {PersonalApiKeyForm} from "./PersonalApiKeyForm";

interface RouteParams {
  uuid: string;
};

export const EditPersonalApiKey: React.FC<RouteComponentProps<RouteParams>> = (props) => {
  const [currentRecord, setCurrentRecord] = useState<any | null>(null);
  // const organisations = useSelector(getOrganisations);
  // const observationTypes = useSelector(getObservationTypes);
  // const colorMaps = useSelector(getColorMaps);
  // const supplierIds = useSelector(getSupplierIds);

  const { uuid } = props.match.params;
  useEffect(() => {
    (async () => {
      const currentRecord = await fetch(`/api/v4/personalapikeys/${uuid}`, {
        credentials: "same-origin"
      }).then(response => response.json());
      
      console.log("currentRecord", currentRecord);
      setCurrentRecord(currentRecord);
    })();
  }, [uuid]);

  if (
    currentRecord 
    // &&
    // organisations.isFetching === false &&
    // observationTypes.isFetching === false &&
    // colorMaps.isFetching === false &&
    // supplierIds.isFetching === false
  ) {
    return <PersonalApiKeyForm
      currentRecord={currentRecord}
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