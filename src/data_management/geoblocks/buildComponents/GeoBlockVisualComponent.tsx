import React, { useRef, useState } from 'react';
import ReactFlow, {
  addEdge,
  Connection,
  ConnectionLineType,
  Controls,
  Edge,
  Elements,
  isNode,
  MiniMap,
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
import { StringBlock } from './blockComponents/StringBlock';
import { ArrayBlock } from './blockComponents/ArrayBlock';
import { geoblockType } from '../../../types/geoBlockType';
import { getBlockData } from '../../../utils/geoblockUtils';
import { targetHandleValidator } from '../../../utils/geoblockValidators';
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
    const connectError = targetHandleValidator(elements, params);
    if (connectError) return console.error(connectError.errorMessage);

    setElements((els) => {
      const source = els.find(el => el.id === params.source)!;
      return addEdge({
        ...params,
        type: ConnectionLineType.SmoothStep,
        animated: true,
        className: (
          source.type === 'NumberBlock' ? edgeStyle.NumberEdge :
          source.type === 'StringBlock' ? edgeStyle.StringEdge :
          source.type === 'BooleanBlock' ? edgeStyle.BooleanEdge :
          edgeStyle.BlockEdge
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
          blockName === 'RasterBlock' || blockName === 'NumberBlock' || blockName === 'BooleanBlock' || blockName === 'StringBlock' ? blockName :
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
          StringBlock: StringBlock,
          ArrayBlock: ArrayBlock
        }}
      >
        {elements.length > 100 ? (
          <MiniMap
            nodeColor={(node) => {
              if (node.type === 'RasterBlock') return 'orange';
              if (node.type === 'Block' && node.data.outputBlock) return 'red';
              if (node.type === 'Block' || node.type === 'GroupBlock') return 'green';
              return 'lightgrey';
            }}
            nodeStrokeWidth={3}
          />
        ) : null}
        <Controls />
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