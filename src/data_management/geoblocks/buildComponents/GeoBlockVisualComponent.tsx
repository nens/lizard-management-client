import React, { useEffect, useRef, useState } from 'react';
import ReactFlow, {
  addEdge,
  Connection,
  ConnectionLineType,
  Controls,
  Edge,
  Elements,
  isNode,
  Position,
  ReactFlowProvider,
  removeElements,
  updateEdge,
  useUpdateNodeInternals
} from 'react-flow-renderer';
import { SideBar } from './blockComponents/SideBar';
import { Block } from './blockComponents/Block';
import { GroupBlock } from './blockComponents/GroupBlock';
import { NumberBlock } from './blockComponents/NumberBlock';
import { RasterBlock } from './blockComponents/RasterBlock';
import { GeoBlockSource, geoblockType } from '../../../types/geoBlockType';
import { createGraphLayout } from '../../../utils/createGraphLayout';
import {
  convertElementsToGeoBlockSource,
  convertGeoblockSourceToFlowElements,
  getBlockData,
  getBlockStyle
} from '../../../utils/geoblockUtils';

interface MyProps {
  source: GeoBlockSource,
  setJsonString: (e: string) => void
}

const GeoBlockVisualFlow = (props: MyProps) => {
  const { source } = props;
  const reactFlowWrapper = useRef<any>(null);
  const updateNodeInternals = useUpdateNodeInternals();
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const [elements, setElements] = useState<Elements>([]);

  // Helper function to change value of a block (e.g. UUID of a raster block or number input)
  const onBlockValueChange = (value: string | number, blockId: string) => {
    setElements(elms => {
      return elms.map(elm => {
        if (elm.id === blockId) {
          return {
            ...elm,
            data: {
              ...elm.data,
              value
            }
          }
        };
        return elm;
      });
    });
  };

  // useEffect to create geoblock elements and build the graph layout using dagre library
  useEffect(() => {
    const geoblockElements = convertGeoblockSourceToFlowElements(source, onBlockValueChange);
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
          blockName === 'RasterBlock' || blockName === 'NumberBlock' ? blockName :
          blockName === 'Group' || blockName === 'FillNoData' ? 'GroupBlock' : 'Block'
        ),
        position,
        sourcePosition,
        targetPosition,
        style: getBlockStyle(blockName),
        data: getBlockData(blockName, numberOfBlocks, idOfNewBlock, onBlockValueChange)
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
          GroupBlock: GroupBlock,
          RasterBlock: RasterBlock,
          NumberBlock: NumberBlock,
        }}
      >
        <Controls />
        <button
          onClick={() => {
            const elementsWithoutPosition = elements.filter(
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
            right: 100,
            bottom: 10,
            zIndex: 1000
          }}
        >
          Reset view
        </button>
        <button
          onClick={() => convertElementsToGeoBlockSource(elements, props.setJsonString)}
          style={{
            position: 'absolute',
            right: 10,
            bottom: 10,
            zIndex: 1000
          }}
        >
          Validate
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
      source={props.source}
      setJsonString={props.setJsonString}
    />
  </ReactFlowProvider>
)