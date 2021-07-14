import React from "react";
import TimeseriesForm from "./TimeseriesForm";
import SpinnerIfNotLoaded from '../../../components/SpinnerIfNotLoaded';

export const NewTimeseries = () => {
  return (
    <SpinnerIfNotLoaded
      loaded={true}
    >
      <TimeseriesForm />
    </SpinnerIfNotLoaded>
  );
};