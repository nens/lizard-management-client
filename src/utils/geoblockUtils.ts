import { Edge, Elements, isEdge, isNode } from "react-flow-renderer";
import { GeoBlockSource, geoblockType } from "../types/geoBlockType";

const position = { x: 0, y: 0 };

export const getBlockData = (
  blockName: string,
  numberOfBlocks: number,
  idOfNewBlock: string,
  setElements: React.Dispatch<React.SetStateAction<Elements<any>>>
) => {
  const dataOfRasterBlock = {
    label: 'LizardRasterSource_' + (numberOfBlocks + 1),
    value: '',
    classOfBlock: 'RasterBlock',
    onChange: (value: string) => onBlockValueChange(value, idOfNewBlock, setElements)
  };

  const dataOfBooleanBlock = {
    value: false,
    classOfBlock: 'BooleanBlock',
    onChange: (value: boolean) => onBlockValueChange(value, idOfNewBlock, setElements)
  };

  const dataOfNumberBlock = {
    value: 0,
    classOfBlock: 'NumberBlock',
    onChange: (value: number) => onBlockValueChange(value, idOfNewBlock, setElements)
  };

  const dataOfBuildBlock = {
    label: blockName + '_' + (numberOfBlocks + 1),
    // @ts-ignore
    classOfBlock: geoblockType[blockName].class,
    // @ts-ignore
    parameters: geoblockType[blockName].parameters,
    onOutputChange: (bool: boolean) => onBlockOutputChange(bool, idOfNewBlock, setElements)
  };

  if (blockName === 'RasterBlock') {
    return dataOfRasterBlock;
  } else if (blockName === 'NumberBlock') {
    return dataOfNumberBlock;
  } else if (blockName === 'BooleanBlock') {
    return dataOfBooleanBlock;
  } else {
    return dataOfBuildBlock;
  };
};

const getRasterElements = (
  blockNames: string[],
  graph: GeoBlockSource['graph'],
  setElements: React.Dispatch<React.SetStateAction<Elements<any>>>
): Elements => {
  // Note that block name of a raster block can be different from its type
  // because the type is RasterBlock but the block name can be either
  // LizardRasterSource and RasterStoreSource
  return blockNames.map(blockName => ({
    id: blockName,
    type: 'RasterBlock',
    data: {
      label: blockName,
      value: graph[blockName][1],
      classOfBlock: 'RasterBlock',
      onChange: (value: string) => onBlockValueChange(value, blockName, setElements)
    },
    position
  }));
};

const getBlockElements = (
  blockNames: string[],
  source: GeoBlockSource,
  setElements: React.Dispatch<React.SetStateAction<Elements<any>>>
): Elements => {
  const { name, graph } = source;
  return blockNames.map(blockName => {
    const blockValue = graph[blockName];
    const classOfBlock = blockValue[0];
    return {
      id: blockName,
      type: (
        classOfBlock === "dask_geomodeling.raster.combine.Group" ||
        classOfBlock === "dask_geomodeling.raster.elemwise.FillNoData" ?
        'GroupBlock' : 'Block'
      ),
      data: {
        label: blockName,
        classOfBlock,
        parameters: blockValue.slice(1),
        outputBlock: blockName === name,
        onOutputChange: (bool: boolean) => onBlockOutputChange(bool, blockName, setElements)
      },
      position
    };
  });
};

const getNumberElements = (
  blockElements: Elements,
  setElements: React.Dispatch<React.SetStateAction<Elements<any>>>
): Elements => {
  return blockElements.filter(
    elm => elm.data && elm.data.parameters && elm.data.parameters.filter((parameter: any) => typeof(parameter) === 'number').length // find blocks with connected number inputs
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
          onChange: (value: number) => onBlockValueChange(value, blockId, setElements)
        },
        position
      };
    });
  }).flat(1);
};

const getBooleanElements = (
  blockElements: Elements,
  setElements: React.Dispatch<React.SetStateAction<Elements<any>>>
): Elements => {
  return blockElements.filter(
    elm => elm.data && elm.data.parameters && elm.data.parameters.filter((parameter: any) => typeof(parameter) === 'boolean').length // find blocks with connected boolean inputs
  ).map(elm => {
    const booleanParameters: boolean[] = elm.data.parameters.filter((parameter: any) => typeof(parameter) === 'boolean');
    return booleanParameters.map((bool, i) => {
      const blockId = elm.id + '-' + bool;
      return {
        id: blockId,
        type: 'BooleanBlock',
        data: {
          value: bool,
          classOfBlock: 'BooleanBlock',
          onChange: (value: boolean) => onBlockValueChange(value, blockId, setElements)
        },
        position
      };
    });
  }).flat(1);
};

// Helper function to change value of a block (e.g. UUID of a raster block or number input)
const onBlockValueChange = (
  value: string | number | boolean,
  blockId: string,
  setElements: React.Dispatch<React.SetStateAction<Elements<any>>>
) => {
  setElements(elms => {
    return elms.map(elm => {
      if (elm.id === blockId) {
        return {
          ...elm,
          data: {
            ...elm.data,
            value
          }
        }
      };
      return elm;
    });
  });
};

// Helper function to change an output block
const onBlockOutputChange = (
  bool: boolean,
  blockId: string,
  setElements: React.Dispatch<React.SetStateAction<Elements<any>>>
) => {
  setElements(elms => {
    return elms.filter(
      // remove the output edge connected to the block
      elm => !(isEdge(elm) && elm.source === blockId)
    ).map(elm => {
      if (elm.id === blockId) {
        return {
          ...elm,
          style: {
            ...elm.style,
            borderColor: bool ? 'red' : 'grey'
          },
          data: {
            ...elm.data,
            outputBlock: bool
          }
        }
      };
      return elm;
    });
  });
};

export const convertGeoblockSourceToFlowElements = (
  source: GeoBlockSource,
  setElements: React.Dispatch<React.SetStateAction<Elements<any>>>
) => {
  // Get names of different types of blocks
  const allBlockNames = Object.keys(source.graph);
  const rasterBlockNames = allBlockNames.filter(blockName => blockName.includes('LizardRasterSource') || blockName.includes('RasterStoreSource'));
  const blockNames = allBlockNames.filter(blockName => !rasterBlockNames.includes(blockName));

  // get block elements
  const rasterElements = getRasterElements(rasterBlockNames, source.graph, setElements);
  const blockElements = getBlockElements(blockNames, source, setElements);
  const numberElements = getNumberElements(blockElements, setElements);
  const booleanElements = getBooleanElements(blockElements, setElements);

  return blockElements.concat(rasterElements).concat(numberElements).concat(booleanElements);
};

export const convertElementsToGeoBlockSource = (
  elements: Elements,
  setJsonString: (e: string) => void
) => {
  const edges = elements.filter(e => isEdge(e)) as Edge[];
  const blocks = elements.filter(e => isNode(e));
  const outputBlocks = blocks.filter(block => block.data && block.data.outputBlock);

  if (outputBlocks.length === 0) {
    console.error('No output node');
    return;
  } else if (outputBlocks.length > 1) {
    console.error('Only one output block is allowed');
    return;
  };

  // use reduce method to create the graph object
  const graph = blocks.filter(
    block => isNaN(block.data && block.data.value) // remove number nodes from graph
  ).reduce((graph, block) => {
    // find connected nodes and their labels
    const connectedNodes = edges.filter(
      e => e.target === block.id
    ).sort((a, b) => {
      // sort the connected nodes by their target handle (e.g. handle-0, handle-1, handle-2, etc)
      if (a.targetHandle && b.targetHandle) {
        return a.targetHandle.localeCompare(b.targetHandle);
      } else {
        return 0;
      };
    }).map(
      e => e.source
    ).map(blockId => {
      const sourceNode = blocks.find(block => block.id === blockId);

      if (!sourceNode) return blockId;
      return sourceNode.data.label || sourceNode.data.value;
    });

    return {
      ...graph,
      [block.data.label]: block.type === 'RasterBlock' ? [
        'lizard_nxt.blocks.LizardRasterSource',
        block.data.value
      ] : [
        block.data.classOfBlock,
        ...connectedNodes
      ]
    };
  }, {});

  const geoblockSource = {
    name: outputBlocks[0].data.label,
    graph
  };

  return setJsonString(JSON.stringify(geoblockSource, null, 4));
};