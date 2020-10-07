// Pick a raster, select a point from that raster on the map

// Value is a data structure of the form

// {
//  "raster": <uuid>,
//  "point": {"lat": <lat>, "lng": lng}
// }

import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import RasterPreview from "../components/RasterPreview";
import SelectRaster from "../components/SelectRaster";
import { validatorResult } from "./validators";
import { fetchRasterV3 } from "../api/rasters";

// Types

interface Bounds {
  south: number,
  west: number,
  north: number,
  east: number
}

interface Raster {
  uuid: string,
  name: string,
  spatial_bounds: Bounds
  // And other fields we don't tell TS about as we don't use them here...
}

interface Location {
  "lat": number,
  "lon": number
}

interface RasterPointSelectionT {
  raster: string | null,
  point:  Location | null
}

interface RasterPointSelectionState {
  raster: Raster | null,
}

interface RasterPointSelectionProps {
  name: string,
  opened: boolean,
  value: RasterPointSelectionT | null,
  validators?: Function[],
  validated: boolean,
  valueChanged: Function
  readonly?: boolean
};

// Validator for this component

export const rasterAndPointChosen =
  (value: RasterPointSelectionT | null): validatorResult => {
    if (value === null || value.raster === null || value.point === null) {
      return "Please choose both a raster and a location.";
    }
    return false;
  };

export default class RasterPointSelection
    extends Component<RasterPointSelectionProps, RasterPointSelectionState> {
  constructor(props: RasterPointSelectionProps) {
    super(props);

    // As the state kept by the form only keeps the UUID, and we need some
    // more fields from the API, this field keeps track of the raster object
    // itself and needs to keep them in sync.
    this.state = {
      raster: null
    }
  }

  componentDidMount() {
    if (this.props.value && this.props.value.raster &&
        this.state.raster === null) {
      // We are apparently in an edit-form as we have a
      // raster-uuid but no whole raster in the state. We need
      // to get it from the API.
      fetchRasterV3(this.props.value.raster).then(json => {
        this.setState({raster: json});
      });
    }
  }

  setRaster(raster: Raster | null) {
    const value = this.props.value;

    // Updating the state is easy
    this.setState({raster});

    // But the value to send to the form is more complicated,
    // as we need to make sure that the point fits in the boundary
    // of the raster, if any
    if (raster === null) {
      // Just set raster to null, point is unchanged
      this.props.valueChanged({
        raster: null,
        point: value && value.point ? value.point : null
      });
    } else if (!value || !value.point) {
        // Just set raster, value is empty
        this.props.valueChanged({
          raster: raster.uuid,
          point: null
        });
    } else {
      // Empty point if it is outside of the raster
      const { lat, lon } = value.point;
      const bounds = raster.spatial_bounds;
      const inBounds = (
        lat >= bounds.south && lat <= bounds.north &&
        lon >= bounds.west && lon <= bounds.east
      );
      if (inBounds) {
        this.props.valueChanged({
          raster: raster.uuid,
          point: value.point
        });
      } else {
        this.props.valueChanged({
          raster: raster.uuid,
          point: null
        });
      }
    }
  }

  setLocation(location: Location | null) {
    if (location !== null && this.state.raster !== null) {
      // Check if location fits within the raster
      const { lat, lon } = location;
      const bounds = this.state.raster.spatial_bounds;
      const inBounds = (
        lat >= bounds.south && lat <= bounds.north &&
        lon >= bounds.west && lon <= bounds.east
      );

      if (!inBounds) {
        // Ignore the change
        return;
      }
    }

    const value = this.props.value;

    this.props.valueChanged({
      raster: value && value.raster ? value.raster : null,
      point: location
    });
  }

  render() {
    let { value } = this.props;

    let raster = null, point = null;

    if (value) {
      raster = this.state.raster;
      point = value.point;
    }

    return (
      <div>
        <p className="text-muted">
          <FormattedMessage
            id="notifications_app.which_temporal_raster_to_use"
            defaultMessage="Which temporal raster do you want to use?"
          />
        </p>
        <SelectRaster
          raster={raster}
          setRaster={this.setRaster.bind(this)}
        />
        <br />

        {/* Only draw this when opened, otherwise Leaflet gets confused */}
        {this.props.opened ? (
          <RasterPreview
            raster={raster}
            location={point}
            setLocation={this.setLocation.bind(this)}
          />) : null}
      </div>
    );
  }
}
