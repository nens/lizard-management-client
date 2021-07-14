import React from "react";

import RasterSourceForm from "./RasterSourceForm";
import SpinnerIfNotLoaded from '../../components/SpinnerIfNotLoaded';


export const NewRasterSource: React.FC = () => {
  return (
    <SpinnerIfNotLoaded
      loaded={true}
    >
      <RasterSourceForm />
    </SpinnerIfNotLoaded>
  );
};