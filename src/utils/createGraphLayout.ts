// Util function to automatically create a graph layout

import dagre from 'dagre';
import { GeoBlockSource } from '../types/geoBlockType';
import {
  ConnectionLineType,
  Elements,
  Position
} from 'react-flow-renderer';

interface BlockInput {
  parameters: (string | number | boolean | [])[]
}

export const createGraphLayout = (
  source: GeoBlockSource | null,
  elements: Elements<BlockInput>
): Elements => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: 'LR' });

  const nodeWidth = 240;
  const nodeHeight = 260;

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

  const edges: Elements = elements.filter(
    el => el.data && el.data.parameters
  ).map(el => {
    const { parameters } = el.data!;
    return parameters.map((parameter, i) => {
      if (
        typeof(parameter) === 'string' &&
        allBlockNames.includes(parameter)
      ) {
        return {
          id: parameter + '-' + el.id,
          type: ConnectionLineType.SmoothStep,
          source: parameter,
          target: el.id,
          targetHandle: i.toString(),
          animated: true
        };
      } else {
        return [];
      };
    }).flat(1);
  }).flat(1);

  return nodes.concat(edges);
};