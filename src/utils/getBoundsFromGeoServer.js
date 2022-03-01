import X2JS from "x2js";

export const getBoundsFromWmsLayer = (wmsSlug, wmsUrl, value, valueChanged, showGeoServerError) => {
  // Use /proxy/ to avoid the request is blocked by CORS policy
  const proxyUrl = `/proxy/${wmsUrl}`;

  fetch(`${proxyUrl}/?request=getCapabilities`)
    .then((response) => {
      if (!response.ok) {
        showGeoServerError();
        throw new Error("Failed to get extent from GeoServer");
      }
      return response.text();
    })
    .then((data) => {
      // Use X2JS library to convert XML response to JSON format
      const xml2Json = new X2JS();
      const responseInJson = xml2Json.xml2js(data);

      // Get all WMS layers from the response
      const wmsLayers =
        responseInJson &&
        responseInJson.WMS_Capabilities &&
        responseInJson.WMS_Capabilities.Capability.Layer.Layer;
      let wmsLayer;
      if (wmsLayers.length > 1) {
        wmsLayer =
          wmsLayers &&
          wmsLayers.find((layer) => layer.Name === wmsSlug || wmsSlug.includes(layer.Name));
      } else {
        wmsLayer = wmsLayers;
      }
      // Get the bounding box of the WMS layer
      const wmsBounds = wmsLayer
        ? {
            north: parseFloat(wmsLayer.EX_GeographicBoundingBox.northBoundLatitude),
            east: parseFloat(wmsLayer.EX_GeographicBoundingBox.eastBoundLongitude),
            south: parseFloat(wmsLayer.EX_GeographicBoundingBox.southBoundLatitude),
            west: parseFloat(wmsLayer.EX_GeographicBoundingBox.westBoundLongitude),
          }
        : null;
      if (!wmsBounds) showGeoServerError();
      valueChanged(wmsBounds ? wmsBounds : value);
    })
    .catch((e) => {
      showGeoServerError();
      console.log(e);
    });
};
