import React, { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router-dom";
// import { getOrganisations } from "../../reducers";
import { LabeltypeForm } from "./LabeltypeForm";
import MDSpinner from "react-md-spinner";

interface RouteProps {
  uuid: string
}

const EditLabeltype: React.FC<RouteComponentProps<RouteProps>> = (props) => {
  // const organisations = useSelector(getOrganisations);
  const [currentRecord, setCurrentRecord] = useState(null);
  const { uuid } = props.match.params;
  useEffect (() => {
    (async () => {
      const currentScenario = await fetch(`/api/v3/labeltypes/${uuid}/`, {
        credentials: "same-origin"
      }).then(response => response.json());

      setCurrentRecord(currentScenario);
    })();
  }, [uuid])

  if (
    currentRecord //&&
    // organisations.isFetching === false
  ) {
    return <LabeltypeForm
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

const EditScenario = withRouter(EditLabeltype);

export { EditLabeltype };
