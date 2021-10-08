import geoblock from '../utils/geoblockTypeDefinition.json';

export interface GeoBlockSource {
  name: string,
  graph: {
    [key: string]: (string | number)[]
  }
}

type parameter = {
  name: string,
  type: string | string[],
  [key: string]: any
}

enum InputBlockEnum {
  Number = "Number",
  RasterBlock = "RasterBlock"
}

enum GeoBlockEnum {
  Add = "Add",
  Classify = "Classify",
  Clip = "Clip",
  Cumulative = "Cumulative",
  MaskBelow = "MaskBelow",
  MemorySource = "MemorySource",
  Multiply = "Multiply",
  Place = "Place",
  Rasterize = "Rasterize",
  Snap = "Snap",
  Step = "Step",
  Subtract = "Subtract",
  TemporalAggregate = "TemporalAggregate"
}

enum GroupBlockEnum {
  Group = "Group"
}

type InputBlockType = {
  [key in InputBlockEnum]?: {
    class: string,
    description: string,
    parameters: parameter[]
  }
}

type GeoBlockType = {
  [key in GeoBlockEnum]?: {
    class: string,
    description: string,
    parameters: parameter[]
  }
}

type GroupBlockType = {
  [key in GroupBlockEnum]?: {
    class: string,
    description: string,
    parameters: {
      type: string,
      items: {
        type: string
      }
    }
  }
}

// @ts-ignore
export const geoblockType: GeoBlockType & InputBlockType & GroupBlockType = geoblock;