import React, { useState, useEffect } from "react";
import { RouteComponentProps } from "react-router-dom";
import SpinnerIfNotLoaded from "../../components/SpinnerIfNotLoaded";
import { createFetchRecordFunctionFromUrl } from "../../utils/createFetchRecordFunctionFromUrl";
import WmsLayerForm from "./WmsLayerForm";
import { WmsLayerReceivedFromApi } from "../../types/WmsLayerType";

interface RouteProps {
  id: string;
}

export const EditWmsLayer = (props: RouteComponentProps<RouteProps>) => {
  const { id } = props.match.params;
  const [currentRecord, setCurrentRecord] = useState<WmsLayerReceivedFromApi | undefined>(
    undefined
  );

  useEffect(() => {
    (async () => {
      const currentWmsLayer = await createFetchRecordFunctionFromUrl(`/api/v4/wmslayers/${id}/`)();

      setCurrentRecord(currentWmsLayer);
    })();
  }, [id]);

  return (
    <SpinnerIfNotLoaded loaded={!!currentRecord}>
      <WmsLayerForm currentRecord={currentRecord} />
    </SpinnerIfNotLoaded>
  );
};
