import React, { useEffect, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import MDSpinner from "react-md-spinner";
import MonitoringNetworkForm from "./MonitoringNetworkForm";

interface RouteProps {
  uuid: string
}

export const EditMonitoringNetwork = (props: RouteComponentProps<RouteProps>) => {
  const [currentNetwork, setCurrentNetwork] = useState(null);
  const { uuid } = props.match.params;

  useEffect (() => {
    (async () => {
      const monitoringNetwork = await fetch(`/api/v4/monitoringnetworks/${uuid}/`, {
        credentials: "same-origin"
      }).then(response => response.json());

      setCurrentNetwork(monitoringNetwork);
    })();
  }, [uuid])

  if (currentNetwork) {
    return (
      <MonitoringNetworkForm
        currentNetwork={currentNetwork}
      />
    );
  } else {
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
