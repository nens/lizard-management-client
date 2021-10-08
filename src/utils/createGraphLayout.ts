// Util function to automatically create a graph layout

import dagre from 'dagre';
import {
  ConnectionLineType,
  Elements,
  Position
} from 'react-flow-renderer';
import { BlockFlowData } from '../data_management/geoblocks/buildComponents/BlockComponents';

export const createGraphLayout = (elements: Elements<BlockFlowData>): Elements => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: 'LR' });

  const nodeWidth = 172;
  const nodeHeight = 36;

  elements.forEach(el => {
    dagreGraph.setNode(el.id, {
      // width: el.__rf.width,
      // height: el.__rf.height
      width: nodeWidth,
      height: nodeHeight
    });

    if (el.data && el.data.parameters) {
      el.data.parameters.forEach(parameter => {
        dagreGraph.setEdge(
          typeof(parameter) === 'string' ? parameter : el.id + '-' + parameter,
          el.id
        );
      });
    };
  });

  dagre.layout(dagreGraph);

  const nodes = elements.map(el => {
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
    return el.data!.parameters.map((parameter, i) => ({
      id: parameter + '-' + el.id,
      type: ConnectionLineType.SmoothStep,
      source: typeof(parameter) === 'string' ? parameter : el.id + '-' + parameter,
      target: el.id,
      targetHandle: 'handle-' + i,
      animated: true
    }));
  }).flat(1);

  // @ts-ignore
  return nodes.concat(edges);
};