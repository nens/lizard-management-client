import React, { useState, useEffect } from "react";
import { RouteComponentProps } from 'react-router';
import MDSpinner from "react-md-spinner";
import { NotificationForm } from "./../NotificationForm";

interface RouteParams {
  uuid: string;
};

export const EditRasterAlarm: React.FC<RouteComponentProps<RouteParams>> = (props) => {
  const [currentRasterAlarm, setCurrentRasterAlarm] = useState<Object | null>(null);

  const { uuid } = props.match.params;
  useEffect(() => {
    (async () => {
      const rasterAlarm = await fetch(`/api/v4/rasteralarms/${uuid}/`, {
        credentials: "same-origin"
      }).then(
        response => response.json()
      );
      setCurrentRasterAlarm(rasterAlarm);
    })();
  }, [uuid]);

  if (currentRasterAlarm) {
    return <NotificationForm
      currentNotification={currentRasterAlarm}
      wizardStyle={false}
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