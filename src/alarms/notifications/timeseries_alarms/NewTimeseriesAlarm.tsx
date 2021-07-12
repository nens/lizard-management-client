import React from "react";
import TimeseriesAlarmForm from "./TimeseriesAlarmForm";
import SpinnerIfStandardSelectorsNotLoaded from '../../../components/SpinnerIfStandardSelectorsNotLoaded';

export const NewTimeseriesAlarm: React.FC = () => {
  return (
    <SpinnerIfStandardSelectorsNotLoaded
      loaded={true}
    >
      <TimeseriesAlarmForm />
    </SpinnerIfStandardSelectorsNotLoaded>
    );
};