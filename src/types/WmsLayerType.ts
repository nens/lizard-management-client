import { Value } from '../form/SelectDropdown';
import { convertToSelectObject } from '../utils/convertToSelectObject';
import { SpatialBounds } from './mapTypes';

// TODO: reuse organisation type for rasterlayer in api/rasters.ts and this file from ./types/organisationType
export interface Organisation {
  name: string,
  uuid: string,
  url: string,
}

export interface WmsLayerReceivedFromApi {
  name: string;
  uuid?: string,
  slug: string;
  description: string;
  datasets: {slug:string}[];
  
  wms_url: string;
  download_url: string;
  legend_url: string;
  get_feature_info_url: string;

  tiled: boolean;
  min_zoom: number;
  max_zoom: number;
  spatial_bounds: SpatialBounds | null;
  options: string;

  organisation: Organisation;
  shared_with: Organisation[];
  access_modifier: string;
  supplier: string;
  supplier_code: string;
}

export const wmsLayerReceivedFromApiToForm = (wmsLayer: WmsLayerReceivedFromApi): WmsLayerFormType => {
  return { 
    ...wmsLayer,
    sharedWithCheckbox: wmsLayer.shared_with.length > 0? true : false,
    organisation: convertToSelectObject(wmsLayer.organisation.uuid, wmsLayer.organisation.name),
    shared_with: wmsLayer.shared_with.map(org => convertToSelectObject(org.uuid, org.name)),
    datasets: wmsLayer.datasets.map(dataset => convertToSelectObject(dataset.slug)),
    supplier: wmsLayer.supplier ? convertToSelectObject(wmsLayer.supplier) : null,
    options: JSON.stringify(wmsLayer.options)
  }
}

export type WmsLayerFormType = {
  name: string;
  uuid?: string,
  slug: string;
  description: string;
  datasets: Value[];
  
  wms_url: string;
  download_url: string;
  legend_url: string;
  get_feature_info_url: string;

  tiled: boolean;
  min_zoom: number;
  max_zoom: number;
  spatial_bounds: SpatialBounds | null;
  options: string;

  organisation: Value;
  sharedWithCheckbox: boolean;
  shared_with: Value[];
  access_modifier: string;
  supplier: Value | null;
  supplier_code: string;
}

export const wmsLayerGetDefaultFormValues = (organisation: Organisation): WmsLayerFormType => {
  return {
  name: "",
  uuid: "",
  slug: "",
  description: "",
  datasets: [],
  
  wms_url: "",
  // use next url to test spatial bounds button
  // wms_url: "https://maps1.project.lizard.net/geoserver/Q0007_sat4rice_2018/wms",
  download_url: "",
  legend_url: "",
  get_feature_info_url: "",

  tiled: true,
  min_zoom: 0,
  max_zoom: 31,
  spatial_bounds: null,
  options: '{"transparent": "True"}',

  organisation: convertToSelectObject(organisation.uuid, organisation.name),
  sharedWithCheckbox: false,
  shared_with: [],
  access_modifier: "Private",
  supplier: null,
  supplier_code: "",
  }
  
}



export const wmsLayerFormToFormSendToApi = (wmsLayer: WmsLayerFormType) => {
  return { 
      ...wmsLayer,
      uuid: wmsLayer.uuid === "" ? undefined :  wmsLayer.uuid,
      sharedWithCheckbox: undefined,
      get_feature_info: wmsLayer.get_feature_info_url === ""? false: true,
      organisation: wmsLayer.organisation && wmsLayer.organisation.value,
      supplier: wmsLayer.supplier && wmsLayer.supplier.label,
      shared_with: wmsLayer.sharedWithCheckbox ? wmsLayer.shared_with.map(org => org.value) : [],
      datasets: wmsLayer.datasets.map(dataset => dataset.value),
    }
}