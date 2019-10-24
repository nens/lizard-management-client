// Component to preview raster on a map.
// And optionally let the user select a point on it (maybe
// by searching for an asset and using its point)

// If raster is passed it needs to be in the format of our /rasters/
// endpoint, preferably the detail page; fields used are
//   spatial_bounds
//   options
//   wms_info

// Optional property 'setLocation' should be a function that sets the
// location, in the form {'lat': <lat>, 'lon': <lon>}; if it is not
// passed, user cannot choose a location and this component is for
// raster preview only.

// That same location should be passed in as the 'location' prop.

import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { Map, Marker, TileLayer, WMSTileLayer } from "react-leaflet";
import SelectAsset from "../components/SelectAsset";
import styles from "./RasterPreview.css";

// Center of the map if no raster yet
const DEFAULT_POSITION = [52.1858, 5.2677];


export default class RasterPreview extends Component {
  handleMapClick(e) {
    if (!this.props.setLocation) {
      return; // No map clicks if no setLocation
    }

    this.props.setLocation({
      lat: e.latlng.lat,
      lon: e.latlng.lng
    });
  }

  formatWMSStyles(rawStyles) {
    /*
       Needed for compound WMS styling, i.e. 'rain' which has three seperate raster stores
       behind the screens.
     */
    return typeof rawStyles === typeof {} ? rawStyles[0][0] : rawStyles;
  }
  formatWMSLayers(rawLayerNames) {
    /*
       Needed for compound WMS styling, i.e. 'rain' which has three seperate raster stores
       behind the screens.
     */
    return rawLayerNames.split(",")[0];
  }

  render() {
    const { raster, location, setLocation } = this.props;

    const marker = (
      location ? [location.lat, location.lon] : DEFAULT_POSITION);

    const chooseLocation = !!setLocation;

    let mapLocation;

    if (raster && raster.spatial_bounds) {
      mapLocation = {
        bounds: [
          [
            raster.spatial_bounds.south,
            raster.spatial_bounds.west
          ],
          [
            raster.spatial_bounds.north,
            raster.spatial_bounds.east
          ]
        ]
      };
    } else {
      mapLocation = {
        center: marker,
        zoom: 8
      };
    }

    return (
      <div>
        {chooseLocation ? (
          <p className="text-muted">
            <FormattedMessage
              id="notifications_app.set_the_location"
              defaultMessage="Set the location of this alarm by placing a marker (tap/click on the map)"
            />
          </p>) : null}

        {chooseLocation ? (
          <SelectAsset
            placeholderText={"Type to search an asset"}
            setAsset={this.handleSetAsset}
            spatialBounds={raster ? raster.spatial_bounds : null}
            setLocation={setLocation}
          />) : null}

        <Map
          onClick={this.handleMapClick.bind(this)}
          className={styles.MapStyle}
          {...mapLocation}
        >
          <TileLayer
            url="https://{s}.tiles.mapbox.com/v3/nelenschuurmans.5641a12c/{z}/{x}/{y}.png"
      attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
      setLocation={this.props.setLocation}
          />
          {raster ? (
            <WMSTileLayer
              url="/wms/"
              styles={this.formatWMSStyles(raster.options.styles)}
              layers={this.formatWMSLayers(raster.wms_info.layer)}
              opacity={0.9}
            />) : null}
          <TileLayer
            url="https://{s}.tiles.mapbox.com/v3/nelenschuurmans.0a5c8e74/{z}/{x}/{y}.png"
            attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
          />
          {location ?
           <Marker position={marker} />
          : null}
        </Map>
      </div>
    );
  }
}
