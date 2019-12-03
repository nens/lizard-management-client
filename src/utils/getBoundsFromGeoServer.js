import X2JS from 'x2js';

export const getBoundsFromWmsLayer = (wmsSlug, wmsUrl, value, valueChanged) => {
    // Use /proxy/ to avoid the request is blocked by CORS policy
    // Note: in production, it will probably be working without the prefix /proxy/
    const proxyUrl = `/proxy/${wmsUrl}`;

    fetch(`${proxyUrl}/?request=getCapabilities`)
        .then(response => {
            if (!response.ok) throw new Error('Oops! Cannot get data from the GeoServer');
            return response.text();
        })
        .then(data => {
            // Use X2JS library to convert XML response to JSON format
            const xml2Json = new X2JS();
            const responseInJson = xml2Json.xml2js(data)

            // Get all WMS layers from the response
            const wmsLayers = responseInJson && responseInJson.WMS_Capabilities && responseInJson.WMS_Capabilities.Capability.Layer.Layer
            // Get the WMS layer by matching slug name with WMS layer name
            const wmsLayer = wmsLayers && wmsLayers.filter(layer => layer.Name === wmsSlug || wmsSlug.includes(layer.Name))
            // Get the bounding box of the WMS layer
            const wmsBounds = wmsLayer && wmsLayer.length > 0 ? {
                north: parseFloat(wmsLayer[0].EX_GeographicBoundingBox.northBoundLatitude),
                east: parseFloat(wmsLayer[0].EX_GeographicBoundingBox.eastBoundLongitude),
                south: parseFloat(wmsLayer[0].EX_GeographicBoundingBox.southBoundLatitude),
                west: parseFloat(wmsLayer[0].EX_GeographicBoundingBox.westBoundLongitude),
            } : null;
            valueChanged({
                ...value,
                spatialBounds: wmsBounds ? wmsBounds : value.spatialBounds
            });
        })
        .catch(e => alert(e));
};