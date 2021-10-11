import { Elements } from "react-flow-renderer";
import { GeoBlockSource, geoblockType } from "../types/geoBlockType";

const position = { x: 0, y: 0 };

const blockStyle = {
  padding: 10,
  borderRadius: 5
};

export const getBlockStyle = (blockName: string, outputBlockName?: string) => {
  return {
    ...blockStyle,
    border: (
      blockName === 'RasterBlock' ? '1px solid blue' :
      blockName === 'NumberBlock' ? '1px solid green' :
      blockName === outputBlockName ? '1px solid red' : '1px solid grey' // build blocks
    )
  };
};

export const getBlockData = (
  blockName: string,
  numberOfBlocks: number,
  idOfNewBlock: string,
  onChange: (value: string | number, id: string) => void
) => {
  const dataOfRasterBlock = {
    label: 'LizardRasterSource_' + (numberOfBlocks + 1),
    value: '',
    classOfBlock: 'RasterBlock',
    onChange: (value: string) => onChange(value, idOfNewBlock)
  };

  const dataOfNumberBlock = {
    label: '',
    value: 0,
    classOfBlock: 'NumberBlock',
    onChange: (value: number) => onChange(value, idOfNewBlock)
  };

  const dataOfBuildBlock = {
    label: numberOfBlocks ? blockName + '_' + numberOfBlocks : blockName,
    // @ts-ignore
    classOfBlock: geoblockType[blockName].class,
    // @ts-ignore
    parameters: geoblockType[blockName].parameters
  };

  if (blockName === 'RasterBlock') {
    return dataOfRasterBlock;
  } else if (blockName === 'NumberBlock') {
    return dataOfNumberBlock;
  } else {
    return dataOfBuildBlock;
  };
};

const getRasterElements = (
  blockNames: string[],
  graph: GeoBlockSource['graph'],
  onChange: Function
): Elements => {
  return blockNames.map(blockName => ({
    id: blockName,
    type: 'RasterBlock',
    data: {
      label: blockName,
      value: graph[blockName][1],
      classOfBlock: 'RasterBlock',
      onChange: (value: string) => onChange(value, blockName)
    },
    style: getBlockStyle(blockName),
    position
  }));
};

const getBlockElements = (
  blockNames: string[],
  source: GeoBlockSource
): Elements => {
  const { name, graph } = source;
  return blockNames.map(blockName => {
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
      style: getBlockStyle(blockName, name),
      position
    };
  });
};

const getNumberElements = (
  blockElements: Elements,
  onChange: Function
): Elements => {
  return blockElements.filter(
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
          classOfBlock: 'NumberBlock',
          onChange: (value: number) => onChange(value, blockId)
        },
        style: getBlockStyle('NumberBlock'),
        position
      };
    });
  }).flat(1);
};

export const convertGeoblockSourceToFlowElements = (
  source: GeoBlockSource,
  onChange: (value: string | number, blockId: string) => void
) => {
  // Get names of different types of blocks
  const allBlockNames = Object.keys(source.graph);
  const rasterBlockNames = allBlockNames.filter(blockName => blockName.includes('LizardRasterSource') || blockName.includes('RasterStoreSource'));
  const blockNames = allBlockNames.filter(blockName => !rasterBlockNames.includes(blockName));

  // get block elements
  const rasterElements = getRasterElements(rasterBlockNames, source.graph, onChange);
  const blockElements = getBlockElements(blockNames, source);
  const numberElements = getNumberElements(blockElements, onChange);

  return blockElements.concat(rasterElements).concat(numberElements);
};