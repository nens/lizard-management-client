import React from "react";
import { useSelector } from "react-redux";
import RasterLayerForm from "./RasterLayerForm";
import {
  getDatasets,
} from "../../reducers";
import SpinnerIfStandardSelectorsNotLoaded from '../../components/SpinnerIfStandardSelectorsNotLoaded';


export const NewRasterLayer: React.FC = () => {
  const datasets = useSelector(getDatasets);

  return (
    <SpinnerIfStandardSelectorsNotLoaded
      loaded={datasets.isFetching === false}
    >
      <RasterLayerForm />
    </SpinnerIfStandardSelectorsNotLoaded>

  );
}