import React ,{ useEffect, useState } from "react";
// import { useSelector } from "react-redux";
import MDSpinner from "react-md-spinner";

import {PersonalApiKeyForm} from "./PersonalApiKeyForm";
import { DataRetrievalState} from '../types/retrievingDataTypes';
// import {
//   getColorMaps,
//   getObservationTypes,
//   getOrganisations,
//   getSupplierIds,
//   getDatasets,
//   getRasterSourceUUID,
//   getSelectedOrganisation,
// } from "../reducers";

export const NewPersonalApiKey: React.FC = () => {
  const [allPersonalApiKeys, setAllPersonalApiKeys] = useState([]);
  const [allPersonalApiKeysFetching, setallPersonalApiKeysFetching] = useState<DataRetrievalState>("NEVER_DID_RETRIEVE");

  useEffect(() => {
    setallPersonalApiKeysFetching("RETRIEVING");
    fetch('/api/v4/personalapikeys')
    .then(response=>{
      if (response.status === 200) {
        return response.json();
      } else {
          // props.addNotification(status, 2000);
          console.error(response);
          setallPersonalApiKeysFetching({status:"ERROR", errorMesssage: response.status+'', url:"/api/v4/personalapikeys"})
      }
    })
    .then(data=>{
      setAllPersonalApiKeys(data.results);
      setallPersonalApiKeysFetching("RETRIEVED");
    })
  },[])

  if (
    // organisations.isFetching === false &&
    // observationTypes.isFetching === false &&
    // colorMaps.isFetching === false &&
    // supplierIds.isFetching === false &&
    // datasets.isFetching === false &&
    // (rasterSourceUUID || rasterSources !== null)
    allPersonalApiKeysFetching === "RETRIEVED"
  ) {
    return ( 
      <PersonalApiKeyForm
        // @ts-ignore
        allPersonalApiKeys={allPersonalApiKeys}
      />
    );
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