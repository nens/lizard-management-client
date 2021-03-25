import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RouteComponentProps, /*withRouter*/ } from "react-router-dom";
import { getOrganisations } from "../../../reducers";
import { LocationForm } from "./LocationForm";
import MDSpinner from "react-md-spinner";

interface RouteProps {
  uuid: string
}

const EditLocation = (props: RouteProps & RouteComponentProps) => {
  const organisations = useSelector(getOrganisations);
  const [currentRecord, setCurrentRecord] = useState(null);
  // @ts-ignore
  const { uuid } = props.match.params;
  useEffect (() => {
    (async () => {
      const currentRecord = await fetch(`/api/v4/locations/${uuid}/`, {
        credentials: "same-origin"
      }).then(response => response.json());

      setCurrentRecord(currentRecord);
    })();
  }, [uuid])

  if (
    currentRecord &&
    organisations.isFetching === false
  ) {
    return <LocationForm
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
}

export { EditLocation };
