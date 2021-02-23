import React, { useState, useEffect } from "react";
import { RouteComponentProps } from 'react-router';
import MDSpinner from "react-md-spinner";
import { NotificationForm } from "./../NotificationForm";

interface RouteParams {
  uuid: string;
};

export const EditTimeseriesAlarm: React.FC<RouteComponentProps<RouteParams>> = (props) => {
  const [currentTimeseriesAlarm, setCurrentTimeseriesAlarm] = useState<Object | null>(null);

  const { uuid } = props.match.params;
  useEffect(() => {
    (async () => {
      const timeseriesAlarm = await fetch(`/api/v4/timeseriesalarms/${uuid}/`, {
        credentials: "same-origin"
      }).then(
        response => response.json()
      );
      setCurrentTimeseriesAlarm(timeseriesAlarm);
    })();
  }, [uuid]);

  if (currentTimeseriesAlarm) {
    return <NotificationForm
      currentNotification={currentTimeseriesAlarm}
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