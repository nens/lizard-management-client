import React from "react";
import LocationForm from "./LocationForm";
import SpinnerIfNotLoaded from '../../../components/SpinnerIfNotLoaded';


export const NewLocation: React.FC = () => {
  return (
    <SpinnerIfNotLoaded
      loaded={true}
    >
      <LocationForm />
    </SpinnerIfNotLoaded>
  );
};