// TODO: reuse organisation type for rasterlayer in api/rasters.ts and this file from ./types/organisationType
export interface Organisation {
  name: string,
  uuid: string,
  url: string,
}

interface WmsLayerPartInstance {
  name: string;
  access_modifier: string;
  description: string;
  supplier: string;
  supplier_code: string;
  temporal: boolean;
  interval?: string;
  uuid?: string,
}

export type WmsLayerInstanceFromForm = WmsLayerPartInstance & {
  organisation: string;
}

export type WmsLayerInstanceFromApi = WmsLayerPartInstance & {
  organisation: Organisation;
}