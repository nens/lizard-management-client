import React, { useEffect, useState } from 'react';
import { fetchRasterV4, RasterLayerFromAPI } from '../api/rasters';
import RasterPreview from '../components/RasterPreview';
import formStyles from "../styles/Forms.module.css";

interface Location {
  lat: number,
  lng: number
}

interface MyProps {
  title: string,
  name: string,
  rasterUuid: string | null,
  point: Location | null,
  valueChanged: (value: Location | null) => void,
  validated: boolean,
  errorMessage?: string | false,
  triedToSubmit?: boolean,
  onFocus?: (e: React.ChangeEvent<HTMLInputElement>) => void,
  onBlur?: () => void,
}

export const RasterPointSelection: React.FC<MyProps> = (props) => {
  const {
    name,
    title,
    rasterUuid,
    point,
    valueChanged,
    validated,
    errorMessage,
    triedToSubmit,
  } = props;

  const [raster, setRaster] = useState<RasterLayerFromAPI | null>(null);

  useEffect(() => {
    if (rasterUuid) {
      fetchRasterV4(rasterUuid).then(
        raster => setRaster(raster)
      ).catch(console.error);
    };
  }, [rasterUuid]);

  const setLocation = (location: Location | null) => {
    if (location !== null && raster !== null) {
      // Check if location fits within the raster
      const { lat, lng } = location;
      const bounds = raster.spatial_bounds;

      if (!bounds) return;

      const inBounds = (
        lat >= bounds.south && lat <= bounds.north &&
        lng >= bounds.west && lng <= bounds.east
      );

      if (!inBounds) return;
    };

    valueChanged(location);
  };

  return (
    <label
      htmlFor={name}
      className={formStyles.Label}
    >
      <span className={formStyles.LabelTitle}>
        {title}
      </span>
      <RasterPreview
        name={name}
        raster={raster}
        location={point}
        setLocation={setLocation}
        validated={validated}
        errorMessage={errorMessage}
        triedToSubmit={triedToSubmit}
      />
    </label>
  )
};