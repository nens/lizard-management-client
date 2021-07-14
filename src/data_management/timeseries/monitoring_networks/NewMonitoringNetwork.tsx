import React from "react";
import MonitoringNetworkForm from "./MonitoringNetworkForm";
import SpinnerIfNotLoaded from '../../../components/SpinnerIfNotLoaded';


export const NewMonitoringNetwork = () => {
  return (
    <SpinnerIfNotLoaded
      loaded={true}
    >
      <MonitoringNetworkForm />
    </SpinnerIfNotLoaded>
    
  );
};