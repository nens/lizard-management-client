import React from "react";
import { useSelector } from "react-redux";
import RasterLayerForm from "./RasterLayerForm";
import {
  getDatasets,
} from "../../reducers";
import SpinnerIfNotLoaded from '../../components/SpinnerIfNotLoaded';


export const NewRasterLayer: React.FC = () => {
  const datasets = useSelector(getDatasets);

  return (
    <SpinnerIfNotLoaded
      loaded={datasets.isFetching === false}
    >
      <RasterLayerForm />
    </SpinnerIfNotLoaded>

  );
}