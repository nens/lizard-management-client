import React, { useState, useRef } from 'react';
import ReactFlow, {
  Elements,
  Edge,
  Connection,
  Controls,
  Handle,
  Node,
  Position,
  ReactFlowProvider,
  addEdge,
  removeElements,
  updateEdge,
} from 'react-flow-renderer';

const customNodeStyle = {
  padding: 10,
  border: '1px solid grey',
  borderRadius: 5
};

// test source of a geoblock
const testSource = {
  name: 'Clip',
  graph: {
    Clip: [
        "dask_geomodeling.raster.misc.Clip",
        "LizardRasterSource_2",
        "Snap"
    ],
    Snap: [
        "dask_geomodeling.raster.temporal.Snap",
        "LizardRasterSource_1",
        "LizardRasterSource_2"
    ],
    LizardRasterSource_1: [
        "lizard_nxt.blocks.LizardRasterSource",
        "8b803e44-5419-4c84-a54a-9e4270d14436"
    ],
    LizardRasterSource_2: [
        "lizard_nxt.blocks.LizardRasterSource",
        "377ba082-2e2b-484a-bed6-3480f67f5ea3"
    ]
}};

// test graph elements
const graphElements: Elements = [
  {
    id: "LizardRasterSource_1",
    type: 'rasterSource',
    data: {
      label: 'LizardRasterSource_1',
      value: "8b803e44-5419-4c84-a54a-9e4270d14436"
    },
    style: customNodeStyle,
    sourcePosition: Position.Right,
    position: {x: 0, y: 0}
  },
  {
    id: "LizardRasterSource_2",
    type: 'rasterSource',
    data: {
      label: 'LizardRasterSource_2',
      value: "377ba082-2e2b-484a-bed6-3480f67f5ea3"
    },
    style: customNodeStyle,
    sourcePosition: Position.Right,
    position: {x: 0, y: 200}
  },
  {
    id: 'Snap',
    type: 'default',
    data: {
      label: 'Snap',
      value: "dask_geomodeling.raster.temporal.Snap"
    },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    position: {x: 200, y: 100}
  },
  {
    id: 'Clip',
    type: 'output',
    data: {
      label: 'Clip',
      value: 'dask_geomodeling.raster.misc.Clip'
    },
    targetPosition: Position.Left,
    position: {x: 400, y: 100}
  },
  {
    id: 'LizardRasterSource_1-Snap',
    type: 'default',
    source: 'LizardRasterSource_1',
    target: 'Snap',
    animated: true
  },
  {
    id: 'LizardRasterSource_2-Snap',
    type: 'default',
    source: 'LizardRasterSource_2',
    target: 'Snap',
    animated: true
  },
  {
    id: 'LizardRasterSource_2-Clip',
    type: 'default',
    source: 'LizardRasterSource_2',
    target: 'Clip',
    animated: true
  },
  {
    id: 'Snap-Clip',
    type: 'default',
    source: 'Snap',
    target: 'Clip',
    animated: true
  },
];

const flowStyles = {
  height: 600,
  margin: 20
};

export const BasicFlow = () => {
  const reactFlowWrapper = useRef<any>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const [elements, setElements] = useState<Elements>(graphElements);

  const onLoad = (_reactFlowInstance: any) => {
    setReactFlowInstance(_reactFlowInstance);
  };

  const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (reactFlowWrapper && reactFlowWrapper.current) {
      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const operation = event.dataTransfer.getData('application/reactflow');
      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });
      const sourcePosition = Position.Right;
      const targetPosition = Position.Left;
      const id = Math.floor(Math.random() * 1000).toString();

      const customeNodeData = {
        label: 'LizardRasterSource_' + id,
        value: '',
        onChange: (value: string) => {
          console.log(value);
          setElements(elms => {
            return elms.map(elm => {
              if (elm.id !== id) {
                return elm;
              };

              return {
                ...elm,
                data: {
                  ...elm.data,
                  value
                }
              }
            })
          })
        }
      };

      const newNode = operation ? {
        id,
        type: 'default',
        position,
        sourcePosition,
        targetPosition,
        data: { label: operation },
      } : {
        id,
        type: 'rasterSource',
        position,
        style: customNodeStyle,
        data: customeNodeData,
      };

      setElements((es) => es.concat(newNode));
    };
  };

  // gets called after end of edge gets dragged to another source or target
  const onEdgeUpdate = (oldEdge: Edge, newConnection: Connection) => {
    setElements((els) => updateEdge(oldEdge, newConnection, els));
  };

  const onConnect = (params: Edge | Connection) => {
    setElements((els) => addEdge({ ...params, animated: true }, els));
  };

  const onElementsRemove = (elementsToRemove: Elements) => {
    setElements((els) => removeElements(elementsToRemove, els))
  };

  return (
    <ReactFlowProvider>
      <ReactFlow
        ref={reactFlowWrapper}
        elements={elements}
        onElementsRemove={onElementsRemove}
        style={flowStyles}
        snapToGrid
        onEdgeUpdate={onEdgeUpdate}
        onConnect={onConnect}
        onLoad={onLoad}
        onDragOver={onDragOver}
        onDrop={onDrop}
        nodeTypes={{
          rasterSource: RasterSource
        }}
      >
        <Controls />
      </ReactFlow>
      <SideBar />
      <button
        onClick={() => {
          console.log('elements', elements);
        }}
      >
        Save
      </button>
    </ReactFlowProvider>
  )
};

const SideBar = () => {
  const onDragStart = (event: React.DragEvent<HTMLDivElement>, operation: string) => {
    event.dataTransfer.setData('application/reactflow', operation);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside>
      <div
        onDragStart={(event) => onDragStart(event, 'Clip')}
        draggable
      >
        Clip
      </div>
      <div
        onDragStart={(event) => onDragStart(event, 'Subtract')}
        draggable
      >
        Subtract
      </div>
      <div
        onDragStart={(event) => onDragStart(event, 'Snap')}
        draggable
      >
        Snap
      </div>
      <div
        onDragStart={(event) => onDragStart(event, 'Mask Below')}
        draggable
      >
        Mask Below
      </div>
      <div
        onDragStart={(event) => onDragStart(event, '')}
        draggable
      >
        Raster Source
      </div>
    </aside>
  );
};

// Custom raster source node with input field
const RasterSource = (props: Node) => {
  const { data } = props;
  return (
    <>
      <div
        style={{
          fontSize: 12
        }}
      >
        {data.label}
      </div>
      <input
        className="nodrag"
        type="text"
        onChange={(e) => data.onChange(e.target.value)}
        defaultValue={data.value}
        style={{
          width: '100%',
          fontSize: 10,
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
      />
    </>
  )
}