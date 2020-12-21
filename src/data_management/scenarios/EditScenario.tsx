import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { getOrganisations, getSupplierIds } from "../../reducers";
import { ScenarioForm } from "./ScenarioForm";
import MDSpinner from "react-md-spinner";

interface RouteProps {
  uuid: string
}

const EditScenarioModel: React.FC<RouteComponentProps<RouteProps>> = (props) => {
  const organisations = useSelector(getOrganisations);
  const supplierIds = useSelector(getSupplierIds);
  const [currentScenario, setCurrentScenario] = useState(null);
  const { uuid } = props.match.params;
  useEffect (() => {
    (async () => {
      const currentScenario = await fetch(`/api/v4/scenarios/${uuid}/`, {
        credentials: "same-origin"
      }).then(response => response.json());

      setCurrentScenario(currentScenario);
    })();
  }, [uuid])

  if (
    currentScenario &&
    organisations.isFetching === false &&
    supplierIds.isFetching === false
  ) {
    return <ScenarioForm
      currentScenario={currentScenario}
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

const EditScenario = withRouter(EditScenarioModel);

export { EditScenario };
