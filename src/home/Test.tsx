import React, { useState, useRef } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  Elements,
  Edge,
  Connection,
  updateEdge,
  addEdge,
  // Controls,
  removeElements,
  Position
} from 'react-flow-renderer';

// test flow elements
// const initialElements: Elements = [
//   {
//     id: '1',
//     type: 'input',
//     data: { label: 'Raster 1' },
//     position: { x: 10, y: 50 }
//   },
//   {
//     id: '2',
//     type: 'input',
//     data: { label: 'Raster 2' },
//     position: { x: 200, y: 50 }
//   },
//   {
//     id: '3',
//     type: 'input',
//     data: { label: 'Raster 3' },
//     position: { x: 400, y: 50 }
//   },
//   {
//     id: '4',
//     type: 'input',
//     data: { label: 'Raster 4' },
//     position: { x: 600, y: 50 }
//   },
//   {
//     id: '5',
//     type: 'default',
//     data: { label: 'Group' },
//     position: { x: 300, y: 200 }
//   },
//   {
//     id: 'custom',
//     type: 'default',
//     data: { label: 'Custom' },
//     position: { x: 600, y: 200 }
//   },
//   {
//     id: '6',
//     type: 'output',
//     data: { label: 'Group 1234' },
//     position: { x: 300, y: 300 }
//   },
//   {
//     id: '1-5',
//     source: '1',
//     target: '5',
//     animated: true,
//     type: 'default'
//   },
//   {
//     id: '2-5',
//     source: '2',
//     target: '5',
//     animated: true,
//     type: 'default'
//   },
//   {
//     id: '3-5',
//     source: '3',
//     target: '5',
//     animated: true,
//     type: 'default'
//   },
//   {
//     id: '4-5',
//     source: '4',
//     target: '5',
//     animated: true,
//     type: 'default'
//   },
//   {
//     id: '5-6',
//     source: '5',
//     target: '6',
//     animated: true,
//     type: 'default'
//   },
// ];

// test source of a geoblock
const source = {
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
    type: 'input',
    data: {
      label: "8b803e44-5419-4c84-a54a-9e4270d14436"
    },
    sourcePosition: Position.Right,
    position: {x: 0, y: 0}
  },
  {
    id: "LizardRasterSource_2",
    type: 'input',
    data: {
      label: "377ba082-2e2b-484a-bed6-3480f67f5ea3"
    },
    sourcePosition: Position.Right,
    position: {x: 0, y: 200}
  },
  {
    id: 'Snap',
    type: 'default',
    data: {
      label: 'Snap'
    },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    position: {x: 200, y: 100}
  },
  {
    id: 'Clip',
    type: 'output',
    data: {
      label: 'Clip'
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
  }
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
      const type = event.dataTransfer.getData('application/reactflow');
      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });
      const sourcePosition = Position.Right;
      const targetPosition = Position.Left;
      const newNode = {
        id: 'node_' + Math.floor(Math.random() * 1000),
        type,
        position,
        sourcePosition,
        targetPosition,
        data: { label: type },
      };
      setElements((es) => es.concat(newNode));
    }
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
      <div
        className="reactflow-wrapper"
        ref={reactFlowWrapper}
      >
        <ReactFlow
          elements={elements}
          onElementsRemove={onElementsRemove}
          style={flowStyles}
          snapToGrid
          onEdgeUpdate={onEdgeUpdate}
          onConnect={onConnect}
          onLoad={onLoad}
          onDragOver={onDragOver}
          onDrop={onDrop}
        />
      </div>
      <SideBar />
      <button
        onClick={() => {
          console.log(elements)
        }}
      >
        Save
      </button>
    </ReactFlowProvider>
  )
};

const SideBar = () => {
  const onDragStart = (event: React.DragEvent<HTMLDivElement>, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside>
      <div
        className="dndnode input"
        onDragStart={(event) => onDragStart(event, 'input')}
        draggable
      >
        Input
      </div>
      <div
        className="dndnode"
        onDragStart={(event) => onDragStart(event, 'default')}
        draggable
      >
        Default
      </div>
      <div
        className="dndnode output"
        onDragStart={(event) => onDragStart(event, 'output')}
        draggable
      >
        Output
      </div>
    </aside>
  );
};