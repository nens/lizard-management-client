import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RouteComponentProps, /*withRouter*/ } from "react-router-dom";
import { getOrganisations } from "../../../reducers";
import { LocationForm } from "./LocationForm";
import MDSpinner from "react-md-spinner";

interface RouteProps {
  uuid: string
}

const EditLocation = (props: RouteProps & RouteComponentProps) => {
  const organisations = useSelector(getOrganisations);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [relatedAssetRequired, setRelatedAssetRequired] = useState(true);
  const [relatedAsset, setRelatedAsset] = useState(null);
  // @ts-ignore
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
      }
      setRelatedAsset(null);
      setCurrentRecord(currentRecord);
    })();
  }, [uuid])

  useEffect (() => {
    
      (async () => {
        // @ts-ignore
        if (relatedAssetRequired && currentRecord !==null && currentRecord.object) {
          // @ts-ignore
          const relatedAsset = await fetch(`/api/v3/${currentRecord.object.type}s/${currentRecord.object.id}/`, {
            credentials: "same-origin"
          }).then(response => response.json());

          setRelatedAsset(relatedAsset);
        }
      })();
    
  }, [currentRecord, relatedAssetRequired])

  if (
    currentRecord &&
    (relatedAsset || !relatedAssetRequired) &&
    organisations.isFetching === false
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
