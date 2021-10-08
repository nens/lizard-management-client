import { Elements } from "react-flow-renderer";
import { GeoBlockSource } from "../types/geoBlockType";

export const convertGeoblockSourceToFlowElements = (
  source: GeoBlockSource,
  onChange: (value: string | number, blockId: string) => void
) => {
  const { name, graph } = source;

  const allBlockNames = Object.keys(graph);
  const rasterBlockNames = allBlockNames.filter(blockName => blockName.includes('LizardRasterSource') || blockName.includes('RasterStoreSource'));
  const blockNames = allBlockNames.filter(blockName => !rasterBlockNames.includes(blockName));
  const position = { x: 0, y: 0 };

  const blockStyle = {
    padding: 10,
    borderRadius: 5
  };

  const rasterElements: Elements = rasterBlockNames.map((blockName, i) => ({
    id: blockName,
    type: 'RasterBlock',
    data: {
      label: blockName,
      value: graph[blockName][1],
      onChange: (value: string) => onChange(value, blockName)
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
        parameters: blockValue.slice(1),
        outputBlock: blockName === name
      },
      style: {
        ...blockStyle,
        border: blockName === name ? '1px solid red' : '1px solid grey'
      },
      position
    }
  });

  const numberElements: Elements = blockElements.filter(
    elm => elm.data && elm.data.parameters && elm.data.parameters.filter((parameter: any) => !isNaN(parameter)).length // find blocks with connected number inputs
  ).map(elm => {
    const numbers: number[] = elm.data.parameters.filter((parameter: any) => !isNaN(parameter));
    return numbers.map((n, i) => {
      const blockId = elm.id + '-' + n + '-' + i;
      return {
        id: blockId,
        type: 'NumberBlock',
        data: {
          value: n,
          onChange: (value: number) => onChange(value, blockId)
        },
        style: {
          ...blockStyle,
          border: '1px solid green'
        },
        position
      };
    });
  }).flat(1);

  return blockElements.concat(rasterElements).concat(numberElements);
};