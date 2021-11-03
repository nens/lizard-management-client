import React, { useRef, useState } from 'react';
import { connect } from 'react-redux';
import ReactFlow, {
  addEdge,
  Connection,
  ConnectionLineType,
  Controls,
  Edge,
  Elements,
  getOutgoers,
  isEdge,
  isNode,
  MiniMap,
  Node,
  Position,
  ReactFlowProvider,
  removeElements,
  updateEdge,
  useUpdateNodeInternals
} from 'react-flow-renderer';
import { SideBar } from './blockComponents/SideBar';
import { Block } from './blockComponents/Block';
import { GroupBlock } from './blockComponents/GroupBlock';
import { RasterBlock } from './blockComponents/RasterBlock';
import { geoblockType } from '../../../types/geoBlockType';
import { getBlockData } from '../../../utils/geoblockUtils';
import { targetHandleValidator } from '../../../utils/geoblockValidators';
import { addNotification } from '../../../actions';

interface MyProps {
  elements: Elements,
  setElements: React.Dispatch<React.SetStateAction<Elements<any>>>
}

const GeoBlockVisualFlow = (props: MyProps & DispatchProps) => {
  const { elements, setElements, addNotification } = props;
  const reactFlowWrapper = useRef<any>(null);
  const updateNodeInternals = useUpdateNodeInternals();
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);

  // gets called after end of edge gets dragged to another source or target
  const onEdgeUpdate = (oldEdge: Edge, newConnection: Connection) => {
    setElements((els) => {
      const connectError = targetHandleValidator(els, newConnection);
      if (connectError) {
        console.error(connectError.errorMessage);
        addNotification(connectError.errorMessage, 2000);
        return els;
      };

      const newElements = els.map(el => {
        if (el.id === oldEdge.target) el.data.parameters[oldEdge.targetHandle!] = ''; // remove old value
        if (el.id === newConnection.target) el.data.parameters[newConnection.targetHandle!] = newConnection.source; // update new value
        return el;
      });

      return updateEdge(oldEdge, newConnection, newElements);
    });
    newConnection.target && updateNodeInternals(newConnection.target); // update node internals
  };

  const onConnect = (params: Edge | Connection) => {
    setElements((els) => {
      const connectError = targetHandleValidator(els, params);
      if (connectError) {
        console.error(connectError.errorMessage);
        addNotification(connectError.errorMessage, 2000);
        return els;
      };

      const newElements = els.map(el => {
        if (el.id === params.target) el.data.parameters[params.targetHandle!] = params.source; // update new value
        return el;
      });

      return addEdge({
        ...params,
        type: ConnectionLineType.SmoothStep,
        animated: true
      }, newElements);
    });
    params.target && updateNodeInternals(params.target); // update node internals
  };

  const onElementsRemove = (elementsToRemove: Elements) => {
    setElements((els) => {
      const newElements = els.map(el => {
        const edgesToRemove = elementsToRemove.filter(elm => isEdge(elm)) as Edge[];
        edgesToRemove.forEach(edge => {
          if (edge.target === el.id) el.data.parameters[edge.targetHandle!] = ''; // remove old value
        });
        return el;
      });
      return removeElements(elementsToRemove, newElements);
    });
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
          blockName === 'RasterBlock' ? blockName :
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
        height: 720
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
          Block: (block: Node) => <Block block={block} onElementsRemove={onElementsRemove} />,
          GroupBlock: (block: Node) => <GroupBlock block={block} onElementsRemove={onElementsRemove} />,
          RasterBlock: RasterBlock
        }}
      >
        {elements.length > 100 ? (
          <MiniMap
            nodeColor={(node) => {
              if (node.type === 'RasterBlock') return 'orange'; // raster block
              if (getOutgoers(node, elements).length === 0) return 'red'; // output block
              return 'lightgrey'; // normal block
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

const GeoBlockVisualComponent = (props: MyProps & DispatchProps) => (
  // Wrap the GeoBlockVisualFlow component inside the ReactFlowProvider
  // to have access to the useUpdateNodeInternals hook of react-flow.
  // the useUpdateNodeInternals hook is used to update the node manually
  // when there are changes that cannot be automatically updated to the node.
  <ReactFlowProvider>
    <GeoBlockVisualFlow
      elements={props.elements}
      setElements={props.setElements}
      addNotification={props.addNotification}
    />
  </ReactFlowProvider>
)

const mapDispatchToProps = (dispatch: any) => ({
  addNotification: (message: string | number, timeout?: number) => dispatch(addNotification(message, timeout))
});
type DispatchProps = ReturnType<typeof mapDispatchToProps>;

export default connect(null, mapDispatchToProps)(GeoBlockVisualComponent);