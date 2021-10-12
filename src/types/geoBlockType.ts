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
  BooleanBlock = "BooleanBlock",
  NumberBlock = "NumberBlock",
  RasterBlock = "RasterBlock"
}

enum GeoBlockEnum {
  Add = "Add",
  And = "And",
  Classify = "Classify",
  Clip = "Clip",
  Cumulative = "Cumulative",
  Divide = "Divide",
  Equal = "Equal",
  Exp = "Exp",
  Greater = "Greater",
  GreaterEqual = "GreaterEqual",
  Invert = "Invert",
  IsData = "IsData",
  IsNoData = "IsNoData",
  Less = "Less",
  LessEqual = "LessEqual",
  Log = "Log",
  Log10 = "Log10",
  MaskBelow = "MaskBelow",
  MemorySource = "MemorySource",
  Multiply = "Multiply",
  NotEqual = "NotEqual",
  Or = "Or",
  Place = "Place",
  Power = "Power",
  Rasterize = "Rasterize",
  Reclassify = "Reclassify",
  Snap = "Snap",
  Step = "Step",
  Subtract = "Subtract",
  TemporalAggregate = "TemporalAggregate",
  Xor = "Xor"
}

enum GroupBlockEnum {
  Group = "Group",
  FillNoData = "FillNoData",
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