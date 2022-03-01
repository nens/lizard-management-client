import React, { useEffect, useState } from "react";
import { fetchRasterV4, RasterLayerFromAPI } from "../api/rasters";
import { MapAssetAndPointSelection } from "./MapAssetAndPointSelection";
import { GeometryField } from "./GeometryField";
import { geometryValidator } from "./validators";

interface Location {
  lat: number;
  lng: number;
}

interface MyProps {
  title: string;
  name: string;
  rasterUuid: string | null;
  point: Location | null;
  valueChanged: (value: Location | null) => void;
  triedToSubmit?: boolean;
  onFocus?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
}

// Helper function to validate if selected point is inside Raster's bounds
const pointWithinRasterBoundsValidator = (
  raster: RasterLayerFromAPI | null,
  location: Location | null
) => {
  if (location !== null && geometryValidator(location) && raster !== null) {
    // Check if location fits within the raster
    const { lat, lng } = location;
    const bounds = raster.spatial_bounds;

    if (!bounds) return false; // do not check if raster has no spatial bounds

    const inBounds =
      lat >= bounds.south && lat <= bounds.north && lng >= bounds.west && lng <= bounds.east;

    if (!inBounds) {
      return "Please select a point within the Raster's bounds";
    }

    return false;
  } else {
    return false;
  }
};

export const RasterPointSelection: React.FC<MyProps> = (props) => {
  const { name, title, rasterUuid, point, valueChanged, triedToSubmit, onFocus, onBlur } = props;

  const [raster, setRaster] = useState<RasterLayerFromAPI | null>(null);

  useEffect(() => {
    if (rasterUuid) {
      fetchRasterV4(rasterUuid)
        .then((raster) => setRaster(raster))
        .catch(console.error);
    }
  }, [rasterUuid]);

  const setLocation = (location: Location | null) => {
    if (!pointWithinRasterBoundsValidator(raster, location)) {
      valueChanged(location);
    }
  };

  return (
    <div>
      <MapAssetAndPointSelection
        title={title}
        name={name}
        raster={raster}
        value={{
          asset: null, // no related asset
          location: point,
        }}
        valueChanged={(value) => setLocation(value.location)}
        onFocus={onFocus}
        onBlur={onBlur}
      />
      <GeometryField
        title={"Geometry *"}
        name={"geometry"}
        value={point}
        valueChanged={valueChanged}
        validated={!!point && !pointWithinRasterBoundsValidator(raster, point)}
        errorMessage={
          pointWithinRasterBoundsValidator(raster, point) || "Please fill in both X and Y fields"
        }
        triedToSubmit={triedToSubmit}
        onFocus={onFocus}
        onBlur={onBlur}
      />
    </div>
  );
};
