import React, { useState, useEffect } from "react";
import { RouteComponentProps } from 'react-router';
import MDSpinner from "react-md-spinner";
import {PersonalApiKeyForm} from "./PersonalApiKeyForm";

interface RouteParams {
  uuid: string;
};

export const EditPersonalApiKey: React.FC<RouteComponentProps<RouteParams>> = (props) => {
  const [currentRecord, setCurrentRecord] = useState<any | null>(null);

  const { uuid } = props.match.params;
  useEffect(() => {
    (async () => {
      const currentRecord = await fetch(`/api/v4/personalapikeys/${uuid}`, {
        credentials: "same-origin"
      }).then(response => response.json());
      
      setCurrentRecord(currentRecord);
    })();
  }, [uuid]);

  if (
    currentRecord 
  ) {
    return <PersonalApiKeyForm
      currentRecord={currentRecord}
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
};