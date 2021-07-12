import React from "react";
import TimeseriesForm from "./TimeseriesForm";
import SpinnerIfStandardSelectorsNotLoaded from '../../../components/SpinnerIfStandardSelectorsNotLoaded';

export const NewTimeseries = () => {
  return (
    <SpinnerIfStandardSelectorsNotLoaded
      loaded={true}
    >
      <TimeseriesForm />
    </SpinnerIfStandardSelectorsNotLoaded>
  );
};