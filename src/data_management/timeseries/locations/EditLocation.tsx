import React, { useEffect, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import LocationForm from "./LocationForm";
import SpinnerIfStandardSelectorsNotLoaded from '../../../components/SpinnerIfStandardSelectorsNotLoaded';
import {createFetchRecordFunctionFromUrl} from '../../../utils/createFetchRecordFunctionFromUrl';


interface RouteProps {
  uuid: string
}

const EditLocation = (props: RouteProps & RouteComponentProps<RouteProps>) => {
  const [currentRecord, setCurrentRecord] = useState<any>(null);
  const [relatedAssetRequired, setRelatedAssetRequired] = useState<boolean>(false);
  const [relatedAsset, setRelatedAsset] = useState<any | null>(null);

  const { uuid } = props.match.params;
  useEffect (() => {
    (async () => {
      const currentRecord = await createFetchRecordFunctionFromUrl(`/api/v4/locations/${uuid}/`)();
      setCurrentRecord(currentRecord);

      const assetObject = currentRecord.object;
      if (assetObject && assetObject.type !== null && assetObject.id !== null) {
        setRelatedAssetRequired(true);
        const currentRelatedAsset = await createFetchRecordFunctionFromUrl(`/api/v3/${assetObject.type}s/${assetObject.id}/`)();
        setRelatedAsset(currentRelatedAsset);
      };
    })();
  }, [uuid]);

  return (
    <SpinnerIfStandardSelectorsNotLoaded
      loaded={!!( currentRecord && (!relatedAssetRequired || relatedAsset))}
    >
      <LocationForm
        currentRecord={currentRecord}
        relatedAsset={relatedAsset}
      />;
    </SpinnerIfStandardSelectorsNotLoaded>
  );
}

export { EditLocation };
