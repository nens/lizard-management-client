import React /*,{ useEffect, useState }*/ from "react";
// import { useSelector } from "react-redux";
import MDSpinner from "react-md-spinner";

import {PersonalApiKeyForm} from "./PersonalApiKeyForm";
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
  // const organisations = useSelector(getOrganisations);
  // const selectedOrganisation = useSelector(getSelectedOrganisation);
  // const observationTypes = useSelector(getObservationTypes);
  // const colorMaps = useSelector(getColorMaps);
  // const supplierIds = useSelector(getSupplierIds);
  // const datasets = useSelector(getDatasets);
  // const rasterSourceUUID = useSelector(getRasterSourceUUID);

  // const [rasterSources, setRasterSources] = useState<any[] | null>(null);
  // useEffect(() => {
  //   if (!rasterSourceUUID) {
  //     (async () => {
  //       const listOfRasterSources = await fetchRasterSourcesV4BySelectedOrganisation(selectedOrganisation.uuid);
  //       setRasterSources(listOfRasterSources.results);
  //     })();
  //   }
  // }, [rasterSourceUUID, selectedOrganisation]);

  if (
    // organisations.isFetching === false &&
    // observationTypes.isFetching === false &&
    // colorMaps.isFetching === false &&
    // supplierIds.isFetching === false &&
    // datasets.isFetching === false &&
    // (rasterSourceUUID || rasterSources !== null)
    true
  ) {
    return <PersonalApiKeyForm/>;
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