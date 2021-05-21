import React, { useEffect, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { getUuidFromUrl } from "../../../utils/getUuidFromUrl";
import TimeseriesForm, { Datasource } from "./TimeseriesForm";
import MDSpinner from "react-md-spinner";

interface RouteProps {
  uuid: string
}

export const EditTimeseries = (props: RouteComponentProps<RouteProps>) => {
  const [currentTimeseries, setCurrentTimeseries] = useState<Object | null>(null);
  const [datasourceIsRequired, setDatasourceIsRequired] = useState<boolean | null>(null);
  const [datasource, setDatasource] = useState<Datasource | null>(null);
  const { uuid } = props.match.params;

  useEffect (() => {
    (async () => {
      const timeseries = await fetch(`/api/v4/timeseries/${uuid}/`, {
        credentials: "same-origin"
      }).then(
        response => response.json()
      );
      setCurrentTimeseries(timeseries);

      const datasourceField: string | null = timeseries.datasource;
      if (datasourceField) {
        setDatasourceIsRequired(true);
        const datasourceId = getUuidFromUrl(datasourceField);

        const currentDatasource = await fetch(`/api/v4/datasources/${datasourceId}/`, {
          credentials: "same-origin"
        }).then(
          response => response.json()
        );
        setDatasource(currentDatasource);
      } else {
        setDatasourceIsRequired(false);
      };
    })();
  }, [uuid])

  if (
    currentTimeseries &&
    datasourceIsRequired === false
  ) {
    return (
      <TimeseriesForm
        currentTimeseries={currentTimeseries}
      />
    )
  } else if (
    currentTimeseries &&
    datasourceIsRequired &&
    datasource
  ) {
    return (
      <TimeseriesForm
        currentTimeseries={currentTimeseries}
        datasource={datasource}
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