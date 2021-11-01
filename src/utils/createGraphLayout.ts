// Util function to automatically create a graph layout

import dagre from 'dagre';
import {
  ConnectionLineType,
  Elements,
  Position
} from 'react-flow-renderer';
import { GeoBlockSource } from '../types/geoBlockType';

interface BlockInput {
  parameters: (string | number | boolean | [])[]
}

export const createGraphLayout = (
  jsonString: string,
  elements: Elements<BlockInput>
): Elements => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: 'LR' });

  const nodeWidth = 240;
  const nodeHeight = 260;

  const source: GeoBlockSource = JSON.parse(jsonString);
  const allBlockNames = source && source.graph ? Object.keys(source.graph) : [];

  elements.forEach(el => {
    dagreGraph.setNode(el.id, {
      // width: el.__rf.width,
      // height: el.__rf.height
      width: nodeWidth,
      height: nodeHeight
    });

    if (el.data && el.data.parameters) {
      const blockParameters = el.data.parameters.filter(parameter =>
        typeof(parameter) === 'string' &&
        allBlockNames.includes(parameter)
      );
      blockParameters.forEach(parameter => {
        dagreGraph.setEdge(
          parameter + '',
          el.id
        );
      });
    };
  });

  dagre.layout(dagreGraph);

  const nodes: Elements = elements.map(el => {
    const node = dagreGraph.node(el.id);
    return {
      ...el,
      targetPosition: Position.Left,
      sourcePosition: Position.Right,
      position: {
        x: node.x - node.width / 2 + Math.random() / 1000,
        y: node.y - node.height / 2
      }
    };
  });

  const edges = elements.filter(
    el => el.data && el.data.parameters
  ).map(el => {
    const { parameters } = el.data!;

    return parameters.filter(parameter =>
      typeof(parameter) === 'string' &&
      allBlockNames.includes(parameter)
    ).map((parameter, index) => ({
      id: parameter + '-' + el.id,
      type: ConnectionLineType.SmoothStep,
      source: parameter,
      target: el.id,
      targetHandle: index + '',
      animated: true
    }));
  }).flat(1);

  // @ts-ignore
  return nodes.concat(edges);
};