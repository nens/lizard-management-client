import React from "react";
import LocationForm from "./LocationForm";
import SpinnerIfStandardSelectorsNotLoaded from '../../../components/SpinnerIfStandardSelectorsNotLoaded';


export const NewLocation: React.FC = () => {
  return (
    <SpinnerIfStandardSelectorsNotLoaded
      loaded={true}
    >
      <LocationForm />
    </SpinnerIfStandardSelectorsNotLoaded>
  );
};