export async function postNewNotification(state, organisationId) {
  const {
    alarmName,
    thresholds,
    comparison,
    messages,
    raster,
    markerPosition,
    timeseriesUuid,
    sourceType
  } = state;

  let url = "";
  let body = {
    name: alarmName,
    active: true,
    organisation: organisationId,
    thresholds: thresholds,
    comparison: comparison,
    messages: messages.map(message => {
      return {
        contact_group: message.groupName,
        message: message.messageName
      };
    })
  };
  if (sourceType.display === "Timeseries") {
    url = "/api/v3/timeseriesalarms/";
    body.timeseries = timeseriesUuid;
  } else {
    url = "/api/v3/rasteralarms/";
    body.intersection = {
      raster: raster.uuid,
      geometry: {
        type: "Point",
        coordinates: [markerPosition[1], markerPosition[0], 0.0]
      }
    };
  }

  const addedAlarm = await fetch(url, {
    credentials: "same-origin",
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  })
    .then(response => response.json())
    .then(data => {
      return data;
    });
  return addedAlarm;
}
