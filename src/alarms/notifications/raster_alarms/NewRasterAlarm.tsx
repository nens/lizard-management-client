import React from "react";
import RasterAlarmForm from "./RasterAlarmForm";
import SpinnerIfStandardSelectorsNotLoaded from '../../../components/SpinnerIfStandardSelectorsNotLoaded';


export const NewRasterAlarm = () => {
  return (
    <SpinnerIfStandardSelectorsNotLoaded
      loaded={true}
    >
      <RasterAlarmForm />
    </SpinnerIfStandardSelectorsNotLoaded>
    
  );
};