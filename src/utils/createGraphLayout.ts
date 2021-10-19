// Util function to automatically create a graph layout

import dagre from 'dagre';
import {
  ConnectionLineType,
  Elements,
  Position
} from 'react-flow-renderer';
import { GeoBlockSource } from '../types/geoBlockType';
import edgeStyles from './../data_management/geoblocks/buildComponents/blockComponents/Edge.module.css';

interface BlockInput {
  parameters: (string | number | boolean | [])[]
}

export const createGraphLayout = (
  source: GeoBlockSource,
  elements: Elements<BlockInput>
): Elements => {
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
      const stringParameters = el.data.parameters.filter(parameter => typeof(parameter) === 'string');
      stringParameters.forEach(parameter => {
        dagreGraph.setEdge(
          parameter + '',
          el.id
        );
      });

      const numberParameters = el.data.parameters.filter(parameter => typeof(parameter) === 'number');
      numberParameters.forEach((parameter, i) => {
        dagreGraph.setEdge(
          el.id + '-' + parameter + '-' + i,
          el.id
        );
      });

      const booleanParameters = el.data.parameters.filter(parameter => typeof(parameter) === 'boolean');
      booleanParameters.forEach(parameter => {
        dagreGraph.setEdge(
          el.id + '-' + parameter,
          el.id
        );
      });

      const arrayParameters = el.data.parameters.filter(parameter => Array.isArray(parameter));
      arrayParameters.forEach(parameter => {
        dagreGraph.setEdge(
          el.id + '-' + JSON.stringify(parameter),
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
    const allBlockNames = Object.keys(source.graph);
    const numberParameters = parameters.filter(parameter => typeof(parameter) === 'number');

    return parameters.map((parameter, index) => {
      if (
        typeof(parameter) === 'string' &&
        allBlockNames.includes(parameter)
      ) {
        // edge from a block to another block
        return {
          id: parameter + '-' + el.id,
          className: edgeStyles.BlockEdge,
          type: ConnectionLineType.SmoothStep,
          source: parameter,
          target: el.id,
          targetHandle: 'handle-' + index,
          animated: true
        };
      } else if (
        typeof(parameter) === 'string' &&
        !allBlockNames.includes(parameter) &&
        !parameter.includes('RasterStoreSource' || 'LizardRasterSource')
      ) {
        // edge from a string value to another block
        return {
          id: parameter + '-' + el.id,
          className: edgeStyles.StringEdge,
          type: ConnectionLineType.SmoothStep,
          source: el.id + '-' + parameter,
          target: el.id,
          targetHandle: 'handle-' + index,
          animated: true
        };
      } else if (typeof(parameter) === 'number') {
        // edge from a number value to another block
        const indexOfParameter = numberParameters.indexOf(parameter);
        numberParameters[indexOfParameter] = NaN; // replace number with NaN to avoid duplicate numbers
        return {
          id: parameter + '-' + el.id + '-' + indexOfParameter,
          className: edgeStyles.NumberEdge,
          type: ConnectionLineType.SmoothStep,
          source: el.id + '-' + parameter + '-' + indexOfParameter,
          target: el.id,
          targetHandle: 'handle-' + index,
          animated: true
        };
      } else if (typeof(parameter) === 'boolean') {
        // edge from a boolean value to another block
        return {
          id: parameter + '-' + el.id,
          className: edgeStyles.BooleanEdge,
          type: ConnectionLineType.SmoothStep,
          source: el.id + '-' + parameter,
          target: el.id,
          targetHandle: 'handle-' + index,
          animated: true
        };
      } else {
        // edge from an array value to another block
        return {
          id: parameter + '-' + el.id,
          type: ConnectionLineType.SmoothStep,
          source: el.id + '-' + parameter,
          target: el.id,
          targetHandle: 'handle-' + index,
          animated: true
        };
      };
    });
  }).flat(1);

  return nodes.concat(edges);
};