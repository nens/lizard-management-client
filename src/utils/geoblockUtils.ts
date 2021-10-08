import { ConnectionLineType, Elements } from "react-flow-renderer";
import { GeoBlockSource } from "../types/geoBlockType";

export const convertGeoblockSourceToFlowElements = (source: GeoBlockSource) => {
  const { name, graph } = source;

  const allBlockNames = Object.keys(graph);
  const outputBlockName = name;
  const rasterBlockNames = allBlockNames.filter(blockName => blockName.includes('LizardRasterSource') || blockName.includes('RasterStoreSource'));
  const blockNames = allBlockNames.filter(blockName => !rasterBlockNames.includes(blockName) && blockName !== outputBlockName);
  const position = { x: 0, y: 0 };

  const outputElement = {
    id: outputBlockName,
    type: 'Block',
    data: {
      label: outputBlockName,
      classOfBlock: graph[outputBlockName][0],
      parameters: graph[outputBlockName].slice(1)
    },
    style: {
      padding: 10,
      border: '1px solid red',
      borderRadius: 5
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
      padding: 10,
      border: '1px solid blue',
      borderRadius: 5
    },
    position
  }));

  const blockElements: Elements = blockNames.map((blockName, i) => ({
    id: blockName,
    type: 'Block',
    data: {
      label: blockName,
      classOfBlock: graph[blockName][0],
      parameters: graph[blockName].slice(1)
    },
    style: {
      padding: 10,
      border: '1px solid grey',
      borderRadius: 5
    },
    position
  }));

  const numberElements: Elements = blockElements.filter(
    elm => elm.data && elm.data.parameters && elm.data.parameters.filter((parameter: any) => !isNaN(parameter)).length // find blocks with connected number inputs
  ).map(elm => {
    const numbers: number[] = elm.data.parameters.filter((parameter: any) => !isNaN(parameter));
    return numbers.map((n, i) => {
      return {
        id: elm.id + '-' + n,
        type: 'InputBlock',
        data: {
          label: n,
          value: n
        },
        style: {
          padding: 10,
          border: '1px solid blue',
          borderRadius: 5
        },
        position
      };
    });
  }).flat(1);

  const connectionLines: Elements = blockNames.concat(outputBlockName).map(name => {
    const sources = graph[name].slice(1);
    return {
      blockName: name,
      sources
    };
  }).map(elm => {
    const { blockName, sources } = elm;
    return sources.map((source, i) => {
      return {
        id: source + '-' + blockName,
        type: ConnectionLineType.SmoothStep,
        source: typeof(source) === 'string' ? source.toString() : blockName + '-' + source,
        target: blockName,
        targetHandle: 'handle-' + i,
        animated: true
      };
    });
  }).flat(1);

  // console.log('connectionLines', connectionLines);
  // console.log('outputElement', outputElement);
  // console.log('rasterElements', rasterElements);
  // console.log('operationElements', operationElements);
  // console.log('numberElements', numberElements);
  return blockElements.concat(outputElement).concat(rasterElements).concat(connectionLines).concat(numberElements);
};