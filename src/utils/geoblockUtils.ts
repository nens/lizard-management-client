import { Elements } from "react-flow-renderer";
import { GeoBlockSource } from "../types/geoBlockType";

export const convertGeoblockSourceToFlowElements = (source: GeoBlockSource) => {
  const { name, graph } = source;

  const allBlockNames = Object.keys(graph);
  const outputBlockName = name;
  const rasterBlockNames = allBlockNames.filter(blockName => blockName.includes('LizardRasterSource') || blockName.includes('RasterStoreSource'));
  const blockNames = allBlockNames.filter(blockName => !rasterBlockNames.includes(blockName) && blockName !== outputBlockName);
  const position = { x: 0, y: 0 };

  const blockStyle = {
    padding: 10,
    borderRadius: 5,
    border: '1px solid grey'
  };

  const outputElement = {
    id: outputBlockName,
    type: 'Block',
    data: {
      label: outputBlockName,
      classOfBlock: graph[outputBlockName][0],
      parameters: graph[outputBlockName].slice(1),
      outputBlock: true
    },
    style: {
      ...blockStyle,
      border: '1px solid red'
    },
    position
  };

  const rasterElements: Elements = rasterBlockNames.map((name, i) => ({
    id: name,
    type: 'InputBlock',
    data: {
      label: name
    },
    style: {
      ...blockStyle,
      border: '1px solid blue'
    },
    position
  }));

  const blockElements: Elements = blockNames.map((blockName, i) => {
    const blockValue = graph[blockName];
    const classOfBlock = blockValue[0];
    return {
      id: blockName,
      type: classOfBlock === "dask_geomodeling.raster.combine.Group" ? 'GroupBlock' : 'Block',
      data: {
        label: blockName,
        classOfBlock,
        parameters: blockValue.slice(1)
      },
      style: blockStyle,
      position
    }
  });

  const numberElements: Elements = blockElements.filter(
    elm => elm.data && elm.data.parameters && elm.data.parameters.filter((parameter: any) => !isNaN(parameter)).length // find blocks with connected number inputs
  ).map(elm => {
    const numbers: number[] = elm.data.parameters.filter((parameter: any) => !isNaN(parameter));
    return numbers.map((n, i) => {
      return {
        id: elm.id + '-' + n + '-' + i,
        type: 'InputBlock',
        data: {
          label: n,
          value: n
        },
        style: {
          ...blockStyle,
          border: '1px solid blue'
        },
        position
      };
    });
  }).flat(1);

  return blockElements.concat(outputElement).concat(rasterElements).concat(numberElements);
};