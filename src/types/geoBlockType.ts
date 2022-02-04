import geoblock from '../data_management/geoblocks/geoblockUtils/geoblockTypeDefinition.json';

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
  RasterSource = "RasterSource"
}

enum GeoBlockEnum {
  Add = "Add",
  And = "And",
  Classify = "Classify",
  Clip = "Clip",
  Cumulative = "Cumulative",
  Dilate = "Dilate",
  Divide = "Divide",
  Equal = "Equal",
  Exp = "Exp",
  Greater = "Greater",
  GreaterEqual = "GreaterEqual",
  HillShade = "HillShade",
  Invert = "Invert",
  IsData = "IsData",
  IsNoData = "IsNoData",
  Less = "Less",
  LessEqual = "LessEqual",
  Log = "Log",
  Log10 = "Log10",
  Mask = "Mask",
  MaskBelow = "MaskBelow",
  MovingMax = "MovingMax",
  Multiply = "Multiply",
  NotEqual = "NotEqual",
  Or = "Or",
  Place = "Place",
  Power = "Power",
  RasterizeWKT = "RasterizeWKT",
  Reclassify = "Reclassify",
  Shift = "Shift",
  Smooth = "Smooth",
  Snap = "Snap",
  Step = "Step",
  Subtract = "Subtract",
  TemporalAggregate = "TemporalAggregate",
  Xor = "Xor"
}

enum GroupBlockEnum {
  Group = "Group",
  GroupTemporal = "GroupTemporal",
  FillNoData = "FillNoData",
  Max = "Max",
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