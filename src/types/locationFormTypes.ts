export interface Location {
  lat: number,
  lng: number
}

export type Asset = any | null;

export interface AssetLocationValue {
  asset: Asset;
  location: Location;
}