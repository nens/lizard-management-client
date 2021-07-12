import React from "react";
import SpinnerIfStandardSelectorsNotLoaded from '../../components/SpinnerIfStandardSelectorsNotLoaded';
import WmsLayerForm from "./WmsLayerForm";

export const NewWmsLayer = () => {
    return (
      <SpinnerIfStandardSelectorsNotLoaded
        loaded={true}
      >
        <WmsLayerForm />
      </SpinnerIfStandardSelectorsNotLoaded>
    );    
}

