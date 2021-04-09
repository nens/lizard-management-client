import { Value } from "../form/SelectDropdown";

export interface Location {
  lat: number,
  lng: number
}

export type Asset = any;

export interface AssetLocationValue {
  asset: Asset | null;
  location: Location | null;
}

export const assetTypes: Value[] = [
  {
    value: 'culvert',
    label: 'Culvert'
  },
  {
    value: 'groundwaterstation',
    label: 'Groundwater station'
  },
  {
    value: 'measuringstation',
    label: 'Measuring station'
  },
  {
    value: 'monitoringwell',
    label: 'Monitoring well'
  },
  {
    value: 'overflow',
    label: 'Overflow'
  },
  {
    value: 'pumpstation',
    label: 'Pumpstation'
  },
  {
    value: 'sluice',
    label: 'Sluice'
  },
  {
    value: 'wastewatertreatmentplant',
    label: 'Wastewater treatment plant'
  },
  {
    value: 'weir',
    label: 'Weir'
  },
  {
    value: 'parcel',
    label: 'Parcel'
  },
  // below asset types are not yet supported in the search endpoint
  // {
  //   value: 'filter',
  //   label: 'Filter'
  // },
  // {
  //   value: 'pump',
  //   label: 'Pump'
  // },
  // {
  //   value: 'fixeddrainagelevelarea',
  //   label: 'Fixed drainage level area'
  // },
];