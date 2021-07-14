import React from "react";
import SpinnerIfNotLoaded from '../../components/SpinnerIfNotLoaded';
import WmsLayerForm from "./WmsLayerForm";

export const NewWmsLayer = () => {
    return (
      <SpinnerIfNotLoaded
        loaded={true}
      >
        <WmsLayerForm />
      </SpinnerIfNotLoaded>
    );    
}

