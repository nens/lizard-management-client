import React from "react";

import RasterSourceForm from "./RasterSourceForm";
import SpinnerIfStandardSelectorsNotLoaded from '../../components/SpinnerIfStandardSelectorsNotLoaded';


export const NewRasterSource: React.FC = () => {
  return (
    <SpinnerIfStandardSelectorsNotLoaded
      loaded={true}
    >
      <RasterSourceForm />
    </SpinnerIfStandardSelectorsNotLoaded>
  );
};