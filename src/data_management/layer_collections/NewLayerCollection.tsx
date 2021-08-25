import React from "react";
import LayerCollectionForm from "./LayerCollectionForm";
import SpinnerIfNotLoaded from '../../components/SpinnerIfNotLoaded';


export const NewLayerCollection: React.FC = () => {

  return (
    <SpinnerIfNotLoaded
      loaded={true}
    >
      <LayerCollectionForm />
    </SpinnerIfNotLoaded>

  );
}