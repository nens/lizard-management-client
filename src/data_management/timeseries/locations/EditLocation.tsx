import React, { useEffect, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { LocationForm } from "./LocationForm";
import MDSpinner from "react-md-spinner";

interface RouteProps {
  uuid: string
}

export const EditLocation = (props: RouteProps & RouteComponentProps<RouteProps>) => {
  const [currentRecord, setCurrentRecord] = useState<any>(null);
  const [relatedAssetRequired, setRelatedAssetRequired] = useState<boolean>(true);
  const [relatedAsset, setRelatedAsset] = useState<any>(null);

  const { uuid } = props.match.params;
  useEffect (() => {
    (async () => {
      const currentRecord = await fetch(`/api/v4/locations/${uuid}/`, {
        credentials: "same-origin"
      }).then(response => response.json());

      if (currentRecord.object && currentRecord.object.type !== null && currentRecord.object.id !== null) {
        setRelatedAssetRequired(true);
      } else {
        setRelatedAssetRequired(false);
      };
      setRelatedAsset(null);
      setCurrentRecord(currentRecord);
    })();
  }, [uuid]);

  useEffect (() => {
    (async () => {
      if (relatedAssetRequired && currentRecord && currentRecord.object) {
        const relatedAsset = await fetch(`/api/v3/${currentRecord.object.type}s/${currentRecord.object.id}/`, {
          credentials: "same-origin"
        }).then(response => response.json());
        setRelatedAsset(relatedAsset);
      }
    })();
  }, [currentRecord, relatedAssetRequired]);

  if (
    currentRecord &&
    (relatedAsset || !relatedAssetRequired)
  ) {
    return <LocationForm
      currentRecord={currentRecord}
      relatedAsset={relatedAsset}
    />;
  } else {
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