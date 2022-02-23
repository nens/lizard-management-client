import { useEffect, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import LocationForm from "./LocationForm";
import SpinnerIfNotLoaded from '../../../components/SpinnerIfNotLoaded';
import {createFetchRecordFunctionFromUrl} from '../../../utils/createFetchRecordFunctionFromUrl';
import { AssetObject, LocationFromAPI } from "../../../types/locationFormTypes";


interface RouteProps {
  uuid: string
}

const EditLocation = (props: RouteProps & RouteComponentProps<RouteProps>) => {
  const [currentRecord, setCurrentRecord] = useState<LocationFromAPI | null>(null);
  const [relatedAssetRequired, setRelatedAssetRequired] = useState<boolean>(false);
  const [relatedAsset, setRelatedAsset] = useState<AssetObject | null>(null);

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
    <SpinnerIfNotLoaded
      loaded={!!( currentRecord && (!relatedAssetRequired || relatedAsset))}
    >
      <LocationForm
        currentRecord={currentRecord!}
        relatedAsset={relatedAsset}
      />;
    </SpinnerIfNotLoaded>
  );
}

export { EditLocation };
