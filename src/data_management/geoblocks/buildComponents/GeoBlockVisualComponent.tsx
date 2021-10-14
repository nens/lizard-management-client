import React, { useRef, useState } from 'react';
import ReactFlow, {
  addEdge,
  Connection,
  ConnectionLineType,
  Controls,
  Edge,
  Elements,
  isEdge,
  isNode,
  Position,
  ReactFlowProvider,
  removeElements,
  updateEdge,
  useUpdateNodeInternals
} from 'react-flow-renderer';
import { SideBar } from './blockComponents/SideBar';
import { Block } from './blockComponents/Block';
import { BooleanBlock } from './blockComponents/BooleanBlock';
import { GroupBlock } from './blockComponents/GroupBlock';
import { NumberBlock } from './blockComponents/NumberBlock';
import { RasterBlock } from './blockComponents/RasterBlock';
import { geoblockType } from '../../../types/geoBlockType';
import { createGraphLayout } from '../../../utils/createGraphLayout';
import {
  convertElementsToGeoBlockSource,
  convertGeoblockSourceToFlowElements,
  getBlockData
} from '../../../utils/geoblockUtils';
import edgeStyle from './blockComponents/Edge.module.css';

interface MyProps {
  elements: Elements,
  setElements: React.Dispatch<React.SetStateAction<Elements<any>>>
}

const GeoBlockVisualFlow = (props: MyProps) => {
  const { elements, setElements } = props;
  const reactFlowWrapper = useRef<any>(null);
  const updateNodeInternals = useUpdateNodeInternals();
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);

  // gets called after end of edge gets dragged to another source or target
  const onEdgeUpdate = (oldEdge: Edge, newConnection: Connection) => {
    setElements((els) => updateEdge(oldEdge, newConnection, els));
    newConnection.target && updateNodeInternals(newConnection.target); // update node internals
  };

  const onConnect = (params: Edge | Connection) => {
    setElements((els) => {
      const source = els.find(el => el.id === params.source)!;
      const target = els.find(el => el.id === params.target)!;
      const targetHandle = params.targetHandle!;

      const edges = els.filter(el => isEdge(el)) as Edge[];
      const edgeConnectedToTargetHandle = edges.find(edge => edge.target === target.id && edge.targetHandle === targetHandle);

      // Not allowed to connect to a target handle that is already used by another block
      if (edgeConnectedToTargetHandle) {
        console.error('Target handle has been used by another block.');
        return els;
      };

      const valueTypeOfSource = (
        source.type === 'NumberBlock' ? 'number' :
        source.type === 'BooleanBlock' ? 'boolean' :
        'raster_block'
      );

      const targetBlockParameters = Object.values(geoblockType).find(blockType => blockType!.class === target.data!.classOfBlock)!.parameters;

      const targetHandlers: {[key: string]: string | string[]} = {};

      let valueTypeOfTargetHandle: string | string[];

      if (Array.isArray(targetBlockParameters)) {
        targetBlockParameters.forEach((parameter, i) => {
          return targetHandlers['handle-' + i] = parameter.type;
        });
        valueTypeOfTargetHandle = targetHandlers[targetHandle];
      } else {
        valueTypeOfTargetHandle = 'raster_block';
      };

      // Not allowed to connect to a target handle with a wrong data type
      if (!valueTypeOfTargetHandle.includes(valueTypeOfSource)) {
        console.error('Invalid connection due to wrong data type.');
        return els;
      };

      return addEdge({
        ...params,
        type: ConnectionLineType.SmoothStep,
        animated: true,
        className: (
          source.type === 'NumberBlock' ? edgeStyle.NumberEdge : edgeStyle.BlockEdge
        )
      }, els);
    });
    params.target && updateNodeInternals(params.target); // update node internals
  };

  const onElementsRemove = (elementsToRemove: Elements) => {
    setElements((els) => removeElements(elementsToRemove, els))
  };

  const onLoad = (_reactFlowInstance: any) => {
    setReactFlowInstance(_reactFlowInstance);
  };

  // Drag and drop actions
  const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (reactFlowWrapper && reactFlowWrapper.current) {
      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const blockName = event.dataTransfer.getData('application/reactflow');
      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });
      const sourcePosition = Position.Right;
      const targetPosition = Position.Left;

      // Keep track of number of block elements in the graph to create block id
      const numberOfBlocks = elements.filter(elm => {
        // @ts-ignore
        return isNode(elm) && elm.data && elm.data.classOfBlock === geoblockType[blockName].class;
      }).length;
      const idOfNewBlock = blockName + numberOfBlocks;

      const newBlock = {
        id: idOfNewBlock,
        type: (
          blockName === 'RasterBlock' || blockName === 'NumberBlock' || blockName === 'BooleanBlock' ? blockName :
          blockName === 'Group' || blockName === 'FillNoData' ? 'GroupBlock' : 'Block'
        ),
        position,
        sourcePosition,
        targetPosition,
        data: getBlockData(blockName, numberOfBlocks, idOfNewBlock, setElements)
      };
      console.log('newBlock', newBlock);
      setElements((es) => es.concat(newBlock));
    };
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 150px',
        columnGap: 10,
        margin: '20px 0',
        height: 550
      }}
    >
      <ReactFlow
        ref={reactFlowWrapper}
        elements={elements}
        onElementsRemove={onElementsRemove}
        style={{
          position: 'relative',
          border: '1px solid lightgrey',
          borderRadius: 10
        }}
        snapToGrid
        onEdgeUpdate={onEdgeUpdate}
        onConnect={onConnect}
        onLoad={onLoad}
        onDragOver={onDragOver}
        onDrop={onDrop}
        nodeTypes={{
          Block: Block,
          BooleanBlock: BooleanBlock,
          GroupBlock: GroupBlock,
          RasterBlock: RasterBlock,
          NumberBlock: NumberBlock,
        }}
      >
        <Controls />
        <button
          onClick={() => {
            const geoBlockSource = convertElementsToGeoBlockSource(elements);
            if (!geoBlockSource) return;
            const newElements = convertGeoblockSourceToFlowElements(geoBlockSource, setElements);
            const elementsWithoutPosition = newElements.filter(
              el => isNode(el)
            ).map(el => ({
              ...el,
              position: { x: 0, y: 0 }
            }));
            const layoutedElements = createGraphLayout(elementsWithoutPosition);
            setElements(layoutedElements);
          }}
          style={{
            position: 'absolute',
            right: 10,
            bottom: 10,
            zIndex: 1000
          }}
        >
          Reset view
        </button>
      </ReactFlow>
      <SideBar />
    </div>
  )
}

export const GeoBlockVisualComponent = (props: MyProps) => (
  // Wrap the GeoBlockVisualFlow component inside the ReactFlowProvider
  // to have access to the useUpdateNodeInternals hook of react-flow.
  // the useUpdateNodeInternals hook is used to update the node manually
  // when there are changes that cannot be automatically updated to the node.
  <ReactFlowProvider>
    <GeoBlockVisualFlow
      elements={props.elements}
      setElements={props.setElements}
    />
  </ReactFlowProvider>
)