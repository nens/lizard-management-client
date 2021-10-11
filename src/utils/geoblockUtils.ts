import { Edge, Elements, isEdge, isNode } from "react-flow-renderer";
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
    label: blockName + '_' + (numberOfBlocks + 1),
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
      onChange: (value: string) => onChange(value, blockName)
    },
    style: getBlockStyle('RasterBlock'),
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

export const convertElementsToGeoBlockSource = (elements: Elements, setJsonString: (e: string) => void) => {
  console.log('elements', elements);
  const edges = elements.filter(e => isEdge(e)) as Edge[];
  const nodes = elements.filter(e => isNode(e));
  const outputNode = nodes.find(e => e.data && e.data.outputBlock);

  if (!outputNode) {
    console.error('No output node');
    return;
  };

  // use reduce method to create the graph object
  const graph = nodes.filter(
    node => isNaN(node.data && node.data.value) // remove number nodes from graph
  ).reduce((graph, node) => {
    // find connected nodes and their labels
    const connectedNodes = edges.filter(
      e => e.target === node.id
    ).sort((a, b) => {
      // sort the connected nodes by their target handle (e.g. handle-0, handle-1, handle-2, etc)
      if (a.targetHandle && b.targetHandle) {
        return a.targetHandle.localeCompare(b.targetHandle);
      } else {
        return 0;
      };
    }).map(
      e => e.source
    ).map(nodeId => {
      const sourceNode = nodes.find(node => node.id === nodeId);

      if (!sourceNode) return nodeId;
      return sourceNode.data.label;
    });

    return {
      ...graph,
      [node.data.label]: node.type === 'RasterBlock' ? [
        'lizard_nxt.blocks.LizardRasterSource',
        node.data.value
      ] : [
        node.data.classOfBlock,
        ...connectedNodes
      ]
    };
  }, {});

  const geoblockSource = {
    name: outputNode.data.label,
    graph
  };

  console.log('geoblock source', geoblockSource);

  return setJsonString(JSON.stringify(geoblockSource, null, 4));
};