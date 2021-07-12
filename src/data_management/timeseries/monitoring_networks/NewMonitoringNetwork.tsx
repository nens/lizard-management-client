import React from "react";
import MonitoringNetworkForm from "./MonitoringNetworkForm";
import SpinnerIfStandardSelectorsNotLoaded from '../../../components/SpinnerIfStandardSelectorsNotLoaded';


export const NewMonitoringNetwork = () => {
  return (
    <SpinnerIfStandardSelectorsNotLoaded
      loaded={true}
    >
      <MonitoringNetworkForm />
    </SpinnerIfStandardSelectorsNotLoaded>
    
  );
};