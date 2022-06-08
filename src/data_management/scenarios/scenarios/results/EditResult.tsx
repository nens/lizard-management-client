import { useEffect, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import SpinnerIfNotLoaded from "../../../../components/SpinnerIfNotLoaded";
import ResultForm from "./ResultForm";
import { ScenarioResult } from "../../../../types/scenarioType";
import { createFetchRecordFunctionFromUrl } from "../../../../utils/createFetchRecordFunctionFromUrl";
import { RasterLayerFromAPI } from "../../../../api/rasters";
import { getUuidFromUrl } from "../../../../utils/getUuidFromUrl";

interface RouteProps {
  uuid: string;
  id: string;
}

export const EditResult = (props: RouteComponentProps<RouteProps>) => {
  const [currentRecord, setCurrentRecord] = useState<ScenarioResult | null>(null);
  const [rasterLayer, setRasterLayer] = useState<RasterLayerFromAPI | null>(null);
  const { uuid, id } = props.match.params;
  useEffect(() => {
    (async () => {
      const currentRecord: ScenarioResult = await createFetchRecordFunctionFromUrl(`/api/v4/scenarios/${uuid}/results/${id}/`)();
      const rasterLayer = currentRecord.raster ? await fetch(`/api/v4/rasters/${getUuidFromUrl(currentRecord.raster)}/`).then(res => res.json()) : null;

      setCurrentRecord(currentRecord);
      setRasterLayer(rasterLayer);
    })();
  }, [uuid, id]);

  return (
    <SpinnerIfNotLoaded loaded={!!currentRecord && (!currentRecord.raster || !!rasterLayer)}>
      <ResultForm currentRecord={currentRecord!} rasterLayer={rasterLayer} />;
    </SpinnerIfNotLoaded>
  );
};
