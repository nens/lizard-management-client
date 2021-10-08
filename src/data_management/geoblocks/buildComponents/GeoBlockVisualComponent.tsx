import React, { useEffect, useRef, useState } from 'react';
import ReactFlow, {
  addEdge,
  Connection,
  ConnectionLineType,
  Controls,
  Edge,
  Elements,
  ReactFlowProvider,
  removeElements,
  updateEdge,
  useUpdateNodeInternals
} from 'react-flow-renderer';
import { Block, GroupBlock, InputBlock } from './BlockComponents';
import { GeoBlockSource } from '../../../types/geoBlockType';
import { convertGeoblockSourceToFlowElements } from '../../../utils/geoblockUtils';
import { createGraphLayout } from '../../../utils/createGraphLayout';

interface MyProps {
  source: GeoBlockSource
}

const GeoBlockVisualFlow = (props: MyProps) => {
  const { source } = props;
  const reactFlowWrapper = useRef<any>(null);
  const updateNodeInternals = useUpdateNodeInternals();
  const [elements, setElements] = useState<Elements>([]);

  useEffect(() => {
    const geoblockElements = convertGeoblockSourceToFlowElements(source);
    const layoutedElements = createGraphLayout(geoblockElements);
    setElements(layoutedElements);
  }, [source]);

  // gets called after end of edge gets dragged to another source or target
  const onEdgeUpdate = (oldEdge: Edge, newConnection: Connection) => {
    setElements((els) => updateEdge(oldEdge, newConnection, els));
    newConnection.target && updateNodeInternals(newConnection.target); // update node internals
  };

  const onConnect = (params: Edge | Connection) => {
    setElements((els) => addEdge({ ...params, type: ConnectionLineType.SmoothStep, animated: true }, els));
    params.target && updateNodeInternals(params.target); // update node internals
  };

  const onElementsRemove = (elementsToRemove: Elements) => {
    setElements((els) => removeElements(elementsToRemove, els))
  };

  return (
    <ReactFlow
      ref={reactFlowWrapper}
      elements={elements}
      onElementsRemove={onElementsRemove}
      style={{
        height: '90%',
        border: '1px solid lightgrey',
        borderRadius: 10
      }}
      snapToGrid
      onEdgeUpdate={onEdgeUpdate}
      onConnect={onConnect}
      nodeTypes={{
        InputBlock: InputBlock,
        GroupBlock: GroupBlock,
        Block: Block
      }}
    >
      <Controls />
    </ReactFlow>
  )
}

export const GeoBlockVisualComponent = (props: MyProps) => (
  // Wrap the GeoBlockVisualFlow component inside the ReactFlowProvider
  // to have access to the useUpdateNodeInternals hook of react-flow.
  // the useUpdateNodeInternals hook is used to update the node manually
  // when there are changes that cannot be automatically updated to the node.
  <ReactFlowProvider>
    <GeoBlockVisualFlow
      source={props.source}
    />
  </ReactFlowProvider>
)