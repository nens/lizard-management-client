// Util function to automatically create a graph layout

import dagre from 'dagre';
import {
  Elements,
  isNode,
  Position
} from 'react-flow-renderer';

export const createGraphLayout = (elements: Elements) => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: 'LR' });

  const nodeWidth = 172;
  const nodeHeight = 36;

  elements.forEach(el => {
    if (isNode(el)) {
      dagreGraph.setNode(el.id, {
        // width: el.__rf.width,
        // height: el.__rf.height
        width: nodeWidth,
        height: nodeHeight
      });
    } else {
      dagreGraph.setEdge(el.source, el.target);
    }
  });

  dagre.layout(dagreGraph);

  return elements.map(el => {
    if (isNode(el)) {
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
    };

    return el;
  });
};