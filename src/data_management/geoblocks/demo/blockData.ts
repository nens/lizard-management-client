export const testGeoBlock = {
  name: "Add_2",
  graph: {
    Add_1: [
      "dask_geomodeling.raster.elemwise.Add",
      "LizardRasterSource_2",
      0.5
    ],
    Add_2: [
      "dask_geomodeling.raster.elemwise.Add",
      "Multiply",
      "Step"
    ],
    Snap: [
      "dask_geomodeling.raster.temporal.Snap",
      "LizardRasterSource_3",
      "LizardRasterSource_1"
    ],
    Step: [
      "dask_geomodeling.raster.misc.Step",
      "MaskBelow",
      0.5,
      1,
      0.25,
      // 0.5
    ],
    Multiply: [
      "dask_geomodeling.raster.elemwise.Multiply",
      "MaskBelow",
      "Add_1"
    ],
    Subtract: [
      "dask_geomodeling.raster.elemwise.Subtract",
      "LizardRasterSource_1",
      "Snap"
    ],
    MaskBelow: [
      "dask_geomodeling.raster.misc.MaskBelow",
      "Subtract",
      0
    ],
    LizardRasterSource_1: [
      "lizard_nxt.blocks.LizardRasterSource",
      "29a411c7-9ac7-4e29-a6ff-2aef632689c5"
    ],
    LizardRasterSource_2: [
      "lizard_nxt.blocks.LizardRasterSource",
      "a823440e-9718-43c8-8edb-52e57fa78098"
    ],
    LizardRasterSource_3: [
      "lizard_nxt.blocks.LizardRasterSource",
      "79bd5c32-325f-48e6-8719-480527adf118"
    ]
  }
}

export const testGeoBlock2 = {
  name: 'Clip',
  graph: {
    Clip: [
        "dask_geomodeling.raster.misc.Clip",
        "LizardRasterSource_2",
        "Snap"
    ],
    Snap: [
        "dask_geomodeling.raster.temporal.Snap",
        "LizardRasterSource_1",
        "LizardRasterSource_2"
    ],
    LizardRasterSource_1: [
        "lizard_nxt.blocks.LizardRasterSource",
        "8b803e44-5419-4c84-a54a-9e4270d14436"
    ],
    LizardRasterSource_2: [
        "lizard_nxt.blocks.LizardRasterSource",
        "377ba082-2e2b-484a-bed6-3480f67f5ea3"
    ]
  }
}

export const testGeoBlock3 = {
  name: "Clip",
  graph: {
    Clip: [
      "dask_geomodeling.raster.misc.Clip",
      "RasterStoreSource_1",
      "RasterStoreSource_2"
    ],
    RasterStoreSource_1: [
      "lizard_nxt.blocks.LizardRasterSource",
      "7ba9243b-d3fc-4eb9-8999-47a473e28f91"
    ],
    RasterStoreSource_2: [
      "lizard_nxt.blocks.LizardRasterSource",
      "f0b456d8-b17c-401b-93d2-d591caa19cf8"
    ]
  }
}