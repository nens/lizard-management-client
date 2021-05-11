import React, { useEffect, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import TimeseriesForm from "./TimeseriesForm";
import MDSpinner from "react-md-spinner";

interface RouteProps {
  uuid: string
}

export const EditTimeseries = (props: RouteComponentProps<RouteProps>) => {
  const [currentTimeseries, setCurrentTimeseries] = useState<Object | null>(null);
  const { uuid } = props.match.params;

  useEffect (() => {
    (async () => {
      const timeseries = await fetch(`/api/v4/timeseries/${uuid}/`, {
        credentials: "same-origin"
      }).then(
        response => response.json()
      );

      setCurrentTimeseries(timeseries);
    })();
  }, [uuid])

  if (currentTimeseries) {
    return (
      <TimeseriesForm
        currentTimeseries={currentTimeseries}
      />
    )
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
  };
}