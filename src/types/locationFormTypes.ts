export interface Location {
  lat: number,
  lng: number
}

export type Asset = any ;

export interface AssetLocationValue {
  asset: Asset | null;
  location: Location | null;
}