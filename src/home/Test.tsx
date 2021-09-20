import React, { useEffect, useState, useRef } from 'react';
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
  isNode,
  isEdge,
} from 'react-flow-renderer';

interface GeoBlockSource {
  name: string,
  graph: {
    [key: string]: (string | number)[]
  }
}

const customNodeStyle = {
  padding: 10,
  border: '1px solid grey',
  borderRadius: 5
};

// function to convert geoblock source to react-flow data
const convertGeoblockSourceToData = (source: GeoBlockSource) => {
  const { name, graph } = source;

  const nodes = Object.keys(graph);
  const outputNode = name;

  const rasterNodes = nodes.filter(node => {
    if (node.includes('LizardRasterSource')) {
      return true;
    } else if (node.includes('RasterStoreSource')) {
      return true;
    } else {
      return false;
    };
  });
  const operationNodes = nodes.filter(node => !rasterNodes.includes(node)).reverse();

  const rasterElements: Elements = rasterNodes.map((node, i) => {
    return {
      id: node,
      type: 'rasterSource',
      data: {
        label: node,
        value: graph[node][1]
      },
      style: customNodeStyle,
      sourcePosition: Position.Right,
      position: { x: 0, y: i * 200}
    };
  });

  const operationElements: Elements = operationNodes.map((node, i) => {
    return {
      id: node,
      type: node === outputNode ? 'output' : 'default',
      data: {
        label: node,
        value: graph[node][0]
      },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
      position: { x: (i + 1) * 200, y: 100 }
    };
  });

  const connectionLines: Elements = operationNodes.map(node => {
    const sources = graph[node].slice(1);
    return {
      operationName: node,
      sources
    };
  }).map(elm => {
    const { operationName, sources } = elm;
    return sources.map(source => {
      return {
        id: source + '-' + operationName,
        type: 'default',
        source: source.toString(),
        target: operationName,
        animated: true
      };
    });
  }).flat(1);

  // console.log('connectionLines', connectionLines);
  // console.log('outputNode', outputNode);
  // console.log('rasterElements', rasterElements);
  // console.log('operationElements', operationElements);
  return operationElements.concat(rasterElements).concat(connectionLines);
};

const convertFlowToSource = (elements: Elements) => {
  console.log('elements', elements);
  const edges = elements.filter(e => isEdge(e)) as Edge[];
  const nodes = elements.filter(e => isNode(e));
  const outputNode = nodes.find(e => e.type === 'output');

  if (!outputNode) {
    console.error('No output node');
    return;
  };

  const graph = nodes.reduce((graph, node) => (
    {
      ...graph,
      [node.data.label]: node.type === 'rasterSource' ? [
        'lizard_nxt.blocks.LizardRasterSource',
        node.data.value
      ] : [
        node.data.value,
        ...edges.filter(e => e.target === node.data.label).map(e => e.source)
      ]
    }
  ), {});

  console.log('geoblock source', {
    name: outputNode.data.label,
    graph
  });

  return {
    name: outputNode.data.label,
    graph
  };
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

// const hoanGeo1 = {
//   name: "Add_2",
//   graph: {
//     Add_1: [
//       "dask_geomodeling.raster.elemwise.Add",
//       "LizardRasterSource_2",
//       0.5
//     ],
//     Add_2: [
//       "dask_geomodeling.raster.elemwise.Add",
//       "Multiply",
//       "Step"
//     ],
//     Snap: [
//       "dask_geomodeling.raster.temporal.Snap",
//       "LizardRasterSource_3",
//       "LizardRasterSource_1"
//     ],
//     Step: [
//       "dask_geomodeling.raster.misc.Step",
//       "MaskBelow",
//       0.5,
//       1,
//       0.25,
//       0.5
//     ],
//     Multiply: [
//       "dask_geomodeling.raster.elemwise.Multiply",
//       "MaskBelow",
//       "Add_1"
//     ],
//     Subtract: [
//       "dask_geomodeling.raster.elemwise.Subtract",
//       "LizardRasterSource_1",
//       "Snap"
//     ],
//     MaskBelow: [
//       "dask_geomodeling.raster.misc.MaskBelow",
//       "Subtract",
//       0
//     ],
//     LizardRasterSource_1: [
//       "lizard_nxt.blocks.LizardRasterSource",
//       "29a411c7-9ac7-4e29-a6ff-2aef632689c5"
//     ],
//     LizardRasterSource_2: [
//       "lizard_nxt.blocks.LizardRasterSource",
//       "a823440e-9718-43c8-8edb-52e57fa78098"
//     ],
//     LizardRasterSource_3: [
//       "lizard_nxt.blocks.LizardRasterSource",
//       "79bd5c32-325f-48e6-8719-480527adf118"
//     ]
//   }
// }

// const hoanGeo2 = {
//   name: "Clip",
//   graph: {
//     Clip: [
//       "dask_geomodeling.raster.misc.Clip",
//       "RasterStoreSource_1",
//       "RasterStoreSource_2"
//     ],
//     RasterStoreSource_1: [
//       "lizard_nxt.blocks.LizardRasterSource",
//       "7ba9243b-d3fc-4eb9-8999-47a473e28f91"
//     ],
//     RasterStoreSource_2: [
//       "lizard_nxt.blocks.LizardRasterSource",
//       "f0b456d8-b17c-401b-93d2-d591caa19cf8"
//     ]
//   }
// };

// test graph elements
// const graphElements: Elements = [
//   {
//     id: "LizardRasterSource_1",
//     type: 'rasterSource',
//     data: {
//       label: 'LizardRasterSource_1',
//       value: "8b803e44-5419-4c84-a54a-9e4270d14436"
//     },
//     style: customNodeStyle,
//     sourcePosition: Position.Right,
//     position: {x: 0, y: 0}
//   },
//   {
//     id: "LizardRasterSource_2",
//     type: 'rasterSource',
//     data: {
//       label: 'LizardRasterSource_2',
//       value: "377ba082-2e2b-484a-bed6-3480f67f5ea3"
//     },
//     style: customNodeStyle,
//     sourcePosition: Position.Right,
//     position: {x: 0, y: 200}
//   },
//   {
//     id: 'Snap',
//     type: 'default',
//     data: {
//       label: 'Snap',
//       value: "dask_geomodeling.raster.temporal.Snap"
//     },
//     sourcePosition: Position.Right,
//     targetPosition: Position.Left,
//     position: {x: 200, y: 100}
//   },
//   {
//     id: 'Clip',
//     type: 'output',
//     data: {
//       label: 'Clip',
//       value: 'dask_geomodeling.raster.misc.Clip'
//     },
//     targetPosition: Position.Left,
//     position: {x: 400, y: 100}
//   },
//   {
//     id: 'LizardRasterSource_1-Snap',
//     type: 'default',
//     source: 'LizardRasterSource_1',
//     target: 'Snap',
//     animated: true
//   },
//   {
//     id: 'LizardRasterSource_2-Snap',
//     type: 'default',
//     source: 'LizardRasterSource_2',
//     target: 'Snap',
//     animated: true
//   },
//   {
//     id: 'LizardRasterSource_2-Clip',
//     type: 'default',
//     source: 'LizardRasterSource_2',
//     target: 'Clip',
//     animated: true
//   },
//   {
//     id: 'Snap-Clip',
//     type: 'default',
//     source: 'Snap',
//     target: 'Clip',
//     animated: true
//   },
// ];

const flowStyles = {
  height: 600,
  margin: 20
};

export const BasicFlow = () => {
  const geoblockSource = testSource;
  const reactFlowWrapper = useRef<any>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const [elements, setElements] = useState<Elements>([]);
  const [id, setId] = useState<number>(1);

  useEffect(() => {
    const geoblockElements = convertGeoblockSourceToData(geoblockSource);
    setElements(geoblockElements);
  }, [geoblockSource]);

  // Keep track of number of source elements in the graph
  const numberOfSources = elements.filter(elm => isNode(elm) && elm.type === 'rasterSource').length;

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

      const customeNodeData = {
        label: 'LizardRasterSource_' + (numberOfSources + 1),
        value: '',
        onChange: (value: string) => {
          setElements(elms => {
            return elms.map(elm => {
              if (elm.id !== id.toString()) {
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
        id: id.toString(),
        type: 'default',
        position,
        sourcePosition,
        targetPosition,
        data: { label: operation },
      } : {
        id: id.toString(),
        type: 'rasterSource',
        position,
        style: customNodeStyle,
        data: customeNodeData,
      };

      setId(id + 1);
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
        onClick={() => convertFlowToSource(elements)}
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