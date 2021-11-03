import { storeDispatch } from "..";
import { addNotification } from "../actions";
import { Elements, getOutgoers, isNode, Node } from "react-flow-renderer";
import { GeoBlockSource, geoblockType } from "../types/geoBlockType";
import { geoBlockValidator } from "./geoblockValidators";

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
    classOfBlock: 'lizard_nxt.blocks.LizardRasterSource',
    onChange: (value: string) => onRasterBlockChange(value, idOfNewBlock, setElements)
  };

  // @ts-ignore
  const blockDefinition = geoblockType[blockName];
  const blockParameters = (
    blockDefinition.class === "dask_geomodeling.raster.combine.Group" ||
    blockDefinition.class === "dask_geomodeling.raster.elemwise.FillNoData" ? (
      ['handle-1', 'handle-2'] // 2 default parameters for Group and FillNoData blocks
    ) : (
      new Array(blockDefinition.parameters.length)
    )
  );

  const dataOfBuildBlock = {
    label: blockName + '_' + (numberOfBlocks + 1),
    classOfBlock: blockDefinition.class,
    parameters: blockParameters,
    onChange: (value: number, i: number) => onBlockChange(value, i, idOfNewBlock, setElements)
  };

  if (blockName === 'RasterBlock') {
    return dataOfRasterBlock;
  } else {
    return dataOfBuildBlock;
  };
};

const getRasterElements = (
  graph: GeoBlockSource['graph'],
  setElements: React.Dispatch<React.SetStateAction<Elements<any>>>
): Elements => {
  const allBlockNames = Object.keys(graph);
  const rasterBlockNames = allBlockNames.filter(blockName => {
    const classOfBlock = graph[blockName][0];
    return classOfBlock === 'lizard_nxt.blocks.LizardRasterSource';
  });

  return rasterBlockNames.map(blockName => ({
    id: blockName,
    type: 'RasterBlock',
    data: {
      label: blockName,
      value: graph[blockName][1],
      classOfBlock: 'lizard_nxt.blocks.LizardRasterSource',
      onChange: (value: string) => onRasterBlockChange(value, blockName, setElements)
    },
    position
  }));
};

const getBlockElements = (
  graph: GeoBlockSource['graph'],
  setElements: React.Dispatch<React.SetStateAction<Elements<any>>>
): Elements => {
  const allBlockNames = Object.keys(graph);
  const blockNames = allBlockNames.filter(blockName => {
    const classOfBlock = graph[blockName][0];
    return classOfBlock !== 'lizard_nxt.blocks.LizardRasterSource';
  });

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
        onChange: (value: number, i: number) => onBlockChange(value, i, blockName, setElements)
      },
      position
    };
  });
};

// Helper function to change parameter value of a block
const onBlockChange = (
  value: string | number | boolean,
  index: number,
  blockId: string,
  setElements: React.Dispatch<React.SetStateAction<Elements<any>>>
) => {
  setElements(elms => {
    return elms.map(elm => {
      if (elm.id === blockId) elm.data.parameters[index] = value;
      return elm;
    });
  });
};

// Helper function to change UUID of a raster
const onRasterBlockChange = (
  value: string,
  blockId: string,
  setElements: React.Dispatch<React.SetStateAction<Elements<any>>>
) => {
  setElements(elms => {
    return elms.map(elm => {
      if (elm.id === blockId) elm.data.value = value;
      return elm;
    });
  });
};

export const convertGeoblockSourceToFlowElements = (
  source: GeoBlockSource | null,
  setElements: React.Dispatch<React.SetStateAction<Elements<any>>>
) => {
  // Return empty array if it is a new geoblock or the geoblock has no value yet
  if (!source || !source.graph) return [];

  const rasterElements = getRasterElements(source.graph, setElements);
  const blockElements = getBlockElements(source.graph, setElements);

  return blockElements.concat(rasterElements);
};

export const convertElementsToGeoBlockSource = (
  elements: Elements,
  source: GeoBlockSource | null,
  setSource?: (e: GeoBlockSource) => void
): GeoBlockSource | undefined => {
  // check if the geoblock is validated
  const errors = geoBlockValidator(elements);
  if (errors.length >= 1) {
    errors.forEach(e => {
      console.error(e.errorMessage);
      storeDispatch(addNotification(e.errorMessage));
    });
    return;
  };

  const blocks = elements.filter(e => isNode(e)) as Node[];
  const outputBlocks = blocks.filter(block => getOutgoers(block, elements).length === 0);

  // use reduce method to create the graph object
  const graph = blocks.reduce((graph, block) => {
    return {
      ...graph,
      [block.data.label]: block.type === 'RasterBlock' ? [
        'lizard_nxt.blocks.LizardRasterSource',
        block.data.value
      ] : [
        block.data.classOfBlock,
        ...block.data.parameters
      ]
    };
  }, {});

  const geoBlockSource = {
    ...source,
    name: outputBlocks[0].data.label,
    graph
  };

  if (setSource) setSource(geoBlockSource);
  return geoBlockSource;
};