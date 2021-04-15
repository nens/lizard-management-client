import React, { useEffect, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import LocationForm from "./LocationForm";
import MDSpinner from "react-md-spinner";

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
      const currentRecord = await fetch(`/api/v4/locations/${uuid}/`, {
        credentials: "same-origin"
      }).then(response => response.json());
      setCurrentRecord(currentRecord);

      const assetObject = currentRecord.object;
      if (assetObject && assetObject.type !== null && assetObject.id !== null) {
        setRelatedAssetRequired(true);
        const currentRelatedAsset = await fetch(`/api/v3/${assetObject.type}s/${assetObject.id}/`, {
          credentials: "same-origin"
        }).then(response => response.json());
        setRelatedAsset(currentRelatedAsset);
      };
    })();
  }, [uuid]);

  if (
    currentRecord
    && (!relatedAssetRequired || relatedAsset)
  ) {
    return <LocationForm
      currentRecord={currentRecord}
      relatedAsset={relatedAsset}
    />;
  }
  else {
    return (
      <div
        style={{
          position: "relative",
          top: 50,
          height: 300,
          bottom: 50,
          marginLeft: "50%"
        }}
      >
        <MDSpinner size={24} />
      </div>
    );
  }
}

export { EditLocation };
