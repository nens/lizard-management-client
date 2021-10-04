// Util function to automatically create a graph layout

import dagre from 'dagre';
import {
  ConnectionLineType,
  Elements,
  Node,
  Position
} from 'react-flow-renderer';

export const createGraphLayout = (elements: Node[]): Elements => {
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

    if (el.data && el.data.inputs) {
      el.data.inputs.forEach((edge: any) => {
        dagreGraph.setEdge(
          typeof(edge) === 'string' ? edge : el.id + '-' + edge,
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
    el => el.data && el.data.inputs
  ).map(el => {
    return el.data.inputs.map((edge: any, i: number) => {
      return {
        id: edge + '-' + el.id,
        type: ConnectionLineType.SmoothStep,
        source: typeof(edge) === 'string' ? edge : el.id + '-' + edge,
        target: el.id,
        targetHandle: 'handle-' + i,
        animated: true
      };
    });
  }).flat(1);

  return nodes.concat(edges);
};