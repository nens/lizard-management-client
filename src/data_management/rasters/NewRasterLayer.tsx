import React from "react";
import { useSelector } from "react-redux";
import RasterLayerForm from "./RasterLayerForm";
import {
  getLayercollections,
} from "../../reducers";
import SpinnerIfNotLoaded from '../../components/SpinnerIfNotLoaded';


export const NewRasterLayer: React.FC = () => {
  const layerCollections = useSelector(getLayercollections);

  return (
    <SpinnerIfNotLoaded
      loaded={layerCollections.isFetching === false}
    >
      <RasterLayerForm />
    </SpinnerIfNotLoaded>

  );
}