export interface GeoBlock {
  Snap: Snap,
  Step: Step,
  Shift: Shift,
  Group: Group,
  Add: Add,
  And: And,
  Classify: Classify,
  Reclassify: Reclassify,
  Rasterize: Rasterize,
  RasterizeWKT: RasterizeWKT,
  MemorySource: MemorySource,
  RasterFileSource: RasterFileSource,
  Place: Place,
  TemporalAggregate: TemporalAggregate,
  Cumulative: Cumulative,
}

type integer = number;
type float = number;

interface RasterBlock {
  [key: string]: string
}

interface GeometryBlock {
  [key: string]: string
}

interface Snap {
  class: 'dask_geomodeling.raster.temporal.Snap',
  description: "This operations allows to take the cell values from one raster (‘store’) and the temporal properties of another raster (‘index’).",
  parameters: {
    store: string,
    index: string
  }
}

interface Step {
  class: 'dask_geomodeling.raster.misc.Step',
  description: "This operation classifies the elements of a raster into three categories: less than, equal to, and greater than a value.",
  parameters: {
    store: RasterBlock,
    left: number | 0,
    right: number | 1,
    value: number | 0,
    at?: number
  }
}

interface Shift {
  class: 'dask_geomodeling.raster.temporal.Shift',
  description: 'Shift a temporal raster by some timedelta.',
  parameters: {
    store: RasterBlock,
    time: integer
  }
}

interface Group {
  class: 'dask_geomodeling.raster.combine.Group',
  description: 'Combine multiple rasters into a single one.',
  parameters: RasterBlock[]
}

interface Add {
  class: 'dask_geomodeling.raster.elemwise.Add',
  description: 'Combine multiple rasters into a single one.',
  parameters: {
    a: RasterBlock | number,
    b: RasterBlock | number
  }
}

interface And {
  class: 'dask_geomodeling.raster.elemwise.And',
  description: 'Returns True where both inputs are True.',
  parameters: {
    a: RasterBlock | boolean,
    b: RasterBlock | boolean
  }
}

interface Classify {
  class: 'dask_geomodeling.misc.Classify',
  description: 'Reclassify a raster of integer values.',
  parameters: {
    store: RasterBlock,
    bin: [boolean | integer, number][],
    right: boolean | False
  }
}

interface Reclassify {
  class: 'dask_geomodeling.misc.Reclassify',
  description: 'Reclassify a raster of integer values.',
  parameters: {
    store: RasterBlock,
    bin: [boolean | integer, number][],
    select: boolean | False
  }
}

interface Rasterize {
  class: 'dask_geomodeling.misc.Rasterize',
  description: 'Converts geometry source to raster.',
  parameters: {
    source: GeometryBlock,
    column_name?: string,
    dtype: string | 'int32' | 'bool'
  }
}

interface RasterizeWKT {
  class: 'dask_geomodeling.misc.RasterizeWKT',
  description: 'Converts a single geometry to a raster mask.',
  parameters: {
    wkt: string,
    projection: string
  }
}

interface MemorySource {
  class: 'dask_geomodeling.sources.MemorySource',
  description: 'A raster source that interfaces data from memory.',
  parameters: {
    data: number,
    no_data_value: number,
    projection: string,
    pixel_size: float,
    pixel_origin: float,
    time_first: integer,
    time_delta: integer,
    metadata: any[]
  }
}

interface RasterFileSource {
  class: 'dask_geomodeling.sources.RasterFileSource',
  description: 'A raster source that interfaces data from a file path.',
  parameters: {
    url: string,
    time_first: integer,
    time_delta: integer,
  }
}

interface Place {
  class: 'dask_geomodeling.raster.spatial.Place',
  description: 'Place an input raster at given coordinates.',
  parameters: {
    store: RasterBlock,
    place_projection: string,
    anchor: [number, number],
    coordinates: [number, number][],
    statistic: 'last' | 'first' | 'count' | 'sum' | 'mean' | 'min' | 'max' | 'argmin' | 'argmax' | 'product' | 'std' | 'var' | 'p<number>'
  }
}

interface TemporalAggregate {
  class: 'dask_geomodeling.raster.temporal.TemporalAggregate',
  description: 'Resample a raster in time.',
  parameters: {
    source: RasterBlock,
    frequency: string | 'None',
    statistic: 'sum' | 'count' | 'mean' | 'min' | 'max' | 'median' | 'std' | 'var' | 'p<percentile>',
    closed: 'left' | 'right' | 'None',
    label: 'left' | 'right' | 'None',
    timezone: string | 'UTC'
  }
}

interface Cumulative {
  class: 'dask_geomodeling.raster.temporal.Cumulative',
  description: 'Compute the cumulative of a raster over time.',
  parameters: {
    source: RasterBlock,
    statistic: 'sum' | 'count',
    frequency: string | 'None',
    timezone: string | 'UTC'
  }
}