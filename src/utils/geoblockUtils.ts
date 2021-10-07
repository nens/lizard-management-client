import { ConnectionLineType, Elements } from "react-flow-renderer";
import { GeoBlockSource } from "../types/geoBlockType";

export const convertGeoblockSourceToFlowElements = (source: GeoBlockSource) => {
  const { name, graph } = source;

  const nodes = Object.keys(graph);
  const outputNodeName = name;
  const outputNode = nodes.filter(node => node === outputNodeName);
  const rasterNodes = nodes.filter(node => node.includes('LizardRasterSource') || node.includes('RasterStoreSource'));
  const operationNodes = nodes.filter(node => !rasterNodes.includes(node) && !outputNode.includes(node));
  const position = { x: 0, y: 0 };

  const outputElement: Elements = outputNode.map(node => ({
    id: node,
    data: {
      label: node
    },
    position
  }));

  const rasterElements: Elements = rasterNodes.map((node, i) => {
    return {
      id: node,
      data: {
        label: node
      },
      position
    };
  });

  const operationElements: Elements = operationNodes.map((node, i) => {
    return {
      id: node,
      data: {
        label: node
      },
      position
    };
  });

  const numberElements: Elements = operationElements.filter(
    elm => elm.data && elm.data.inputs && elm.data.inputs.filter((input: any) => !isNaN(input)).length // find blocks with connected number inputs
  ).map(elm => {
    const numbers: number[] = elm.data.inputs.filter((input: any) => !isNaN(input));
    return numbers.map((n, i) => {
      return {
        id: elm.id + '-' + n,
        type: 'NumberBlock',
        data: {
          label: n,
          value: n
        },
        position
      };
    });
  }).flat(1);

  const connectionLines: Elements = operationNodes.concat(outputNode).map(node => {
    const sources = graph[node].slice(1);
    return {
      blockName: node,
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
  return operationElements.concat(outputElement).concat(rasterElements).concat(connectionLines).concat(numberElements);
};