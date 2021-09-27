import React, { useEffect, useState, useRef } from 'react';
import ReactFlow, {
  Elements,
  Edge,
  Connection,
  ConnectionLineType,
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
  useUpdateNodeInternals
} from 'react-flow-renderer';
import { createGraphLayout } from './createGraphLayout';
import styles from './GeoBlockDemo.module.css';
import buttonStyles from '../../styles/Buttons.module.css';

interface GeoBlockSource {
  name: string,
  graph: {
    [key: string]: (string | number)[]
  }
}

const rasterNodeStyle = {
  padding: 10,
  border: '1px solid blue',
  borderRadius: 5
};
const operationNodeStyle = {
  padding: 10,
  border: '1px solid grey',
  borderRadius: 5
};
const outputNodeStyle = {
  padding: 10,
  border: '1px solid red',
  borderRadius: 5
};

// function to get value of a building block
const getValueOfBlock = (block: string) => {
  if (block === 'Snap') {
    return 'dask_geomodeling.raster.temporal.Snap';
  } else if (block === 'Clip') {
    return 'dask_geomodeling.raster.misc.Clip';
  } else if (block === 'Add') {
    return 'dask_geomodeling.raster.elemwise.Add';
  } else if (block === 'Subtract') {
    return 'dask_geomodeling.raster.elemwise.Subtract';
  } else if (block === 'MaskBelow') {
    return 'dask_geomodeling.raster.misc.MaskBelow';
  } else if (block === 'Step') {
    return 'dask_geomodeling.raster.misc.Step';
  } else if (block === 'Multiply') {
    return 'dask_geomodeling.raster.elemwise.Multiply';
  } else {
    return block;
  };
};

// function to convert geoblock source to react-flow data
const convertGeoblockSourceToData = (source: GeoBlockSource) => {
  const { name, graph } = source;

  const nodes = Object.keys(graph);
  const outputNodeName = name;
  const outputNode = nodes.filter(node => node === outputNodeName);
  const rasterNodes = nodes.filter(node => node.includes('LizardRasterSource') || node.includes('RasterStoreSource'));
  const operationNodes = nodes.filter(node => !rasterNodes.includes(node) && !outputNode.includes(node));
  const position = { x: 0, y: 0 };

  const outputElement: Elements = outputNode.map(node => ({
    id: node,
    type: 'outputBlock',
    data: {
      label: node,
      value: graph[node][0],
      inputs: graph[node]
    },
    style: outputNodeStyle,
    position
  }));

  const rasterElements: Elements = rasterNodes.map((node, i) => {
    return {
      id: node,
      type: 'rasterSource',
      data: {
        label: node,
        value: graph[node][1]
      },
      style: rasterNodeStyle,
      position
    };
  });

  const operationElements: Elements = operationNodes.map((node, i) => {
    return {
      id: node,
      type: 'block',
      data: {
        label: node,
        value: graph[node][0],
        inputs: graph[node]
      },
      style: operationNodeStyle,
      position
    };
  });

  const numberElements: Elements = operationElements.filter(
    elm => elm.data && elm.data.inputs && elm.data.inputs.filter((input: any) => !isNaN(input)).length // find blocks with connected number inputs
  ).map(elm => {
    const numbers: number[] = elm.data.inputs.filter((input: any) => !isNaN(input));
    return numbers.map((n, i) => {
      return {
        id: elm.id + '-' + n,
        type: 'numberBlock',
        data: {
          label: n,
          value: n
        },
        style: operationNodeStyle,
        position
      };
    });
  }).flat(1);

  const connectionLines: Elements = operationNodes.concat(outputNode).map(node => {
    const sources = graph[node].slice(1);
    return {
      blockName: node,
      sources
    };
  }).map(elm => {
    const { blockName, sources } = elm;
    return sources.map((source, i) => {
      return {
        id: source + '-' + blockName,
        type: ConnectionLineType.SmoothStep,
        source: typeof(source) === 'string' ? source.toString() : blockName + '-' + source,
        target: blockName,
        targetHandle: 'handle-' + i,
        animated: true
      };
    });
  }).flat(1);

  // console.log('connectionLines', connectionLines);
  // console.log('outputElement', outputElement);
  // console.log('rasterElements', rasterElements);
  // console.log('operationElements', operationElements);
  // console.log('numberElements', numberElements);
  return operationElements.concat(outputElement).concat(rasterElements).concat(connectionLines).concat(numberElements);
};

const convertFlowToSource = (elements: Elements) => {
  console.log('elements', elements);
  const edges = elements.filter(e => isEdge(e)) as Edge[];
  const nodes = elements.filter(e => isNode(e));
  const outputNode = nodes.find(e => e.type === 'outputBlock');

  if (!outputNode) {
    console.error('No output node');
    return;
  };

  // use reduce method to create the graph object
  const graph = nodes.filter(
    node => isNaN(node.data && node.data.value) // remove number nodes from graph
  ).reduce((graph, node) => {
    // find connected nodes and their labels
    const connectedNodes = edges.filter(
      e => e.target === node.id
    ).sort((a, b) => {
      // sort the connected nodes by their target handle (e.g. handle-0, handle-1, handle-2, etc)
      if (a.targetHandle && b.targetHandle) {
        return a.targetHandle.localeCompare(b.targetHandle);
      } else {
        return 0;
      };
    }).map(
      e => e.source
    ).map(nodeId => {
      const sourceNode = nodes.find(node => node.id === nodeId);

      if (!sourceNode) return nodeId;
      return sourceNode.data.label;
    });

    return {
      ...graph,
      [node.data.label]: node.type === 'rasterSource' ? [
        'lizard_nxt.blocks.LizardRasterSource',
        node.data.value
      ] : [
        node.data.value,
        ...connectedNodes
      ]
    };
  }, {});

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

const hoanGeo1 = {
  name: "Add_2",
  graph: {
    Add_1: [
      "dask_geomodeling.raster.elemwise.Add",
      "LizardRasterSource_2",
      0.5
    ],
    Add_2: [
      "dask_geomodeling.raster.elemwise.Add",
      "Multiply",
      "Step"
    ],
    Snap: [
      "dask_geomodeling.raster.temporal.Snap",
      "LizardRasterSource_3",
      "LizardRasterSource_1"
    ],
    Step: [
      "dask_geomodeling.raster.misc.Step",
      "MaskBelow",
      0.5,
      1,
      0.25,
      // 0.5
    ],
    Multiply: [
      "dask_geomodeling.raster.elemwise.Multiply",
      "MaskBelow",
      "Add_1"
    ],
    Subtract: [
      "dask_geomodeling.raster.elemwise.Subtract",
      "LizardRasterSource_1",
      "Snap"
    ],
    MaskBelow: [
      "dask_geomodeling.raster.misc.MaskBelow",
      "Subtract",
      0
    ],
    LizardRasterSource_1: [
      "lizard_nxt.blocks.LizardRasterSource",
      "29a411c7-9ac7-4e29-a6ff-2aef632689c5"
    ],
    LizardRasterSource_2: [
      "lizard_nxt.blocks.LizardRasterSource",
      "a823440e-9718-43c8-8edb-52e57fa78098"
    ],
    LizardRasterSource_3: [
      "lizard_nxt.blocks.LizardRasterSource",
      "79bd5c32-325f-48e6-8719-480527adf118"
    ]
  }
}

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

const flowStyles = {
  height: 600,
  border: '1px solid lightgrey',
  borderRadius: 10,
};

export const GeoBlockDemo = () => {
  return (
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
  )
}

const Flow = () => {
  const geoblockSource = hoanGeo1;
  const reactFlowWrapper = useRef<any>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const [elements, setElements] = useState<Elements>([]);
  const [id, setId] = useState<number>(1);
  const updateNodeInternals = useUpdateNodeInternals();

  useEffect(() => {
    const geoblockElements = convertGeoblockSourceToData(geoblockSource);
    const layoutedElements = createGraphLayout(geoblockElements);
    setElements(layoutedElements);
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

      const newNode = (operation === 'RasterSource') ? {
        id: id.toString(),
        type: 'rasterSource',
        position,
        style: rasterNodeStyle,
        data: customeNodeData,
      } : (operation === 'Number') ? {
        id: id.toString(),
        type: 'numberBlock',
        position,
        style: operationNodeStyle,
        sourcePosition,
        targetPosition,
        data: {
          label: 0,
          value: 0
        },
      } : {
        id: id.toString(),
        type: 'customOperationBlock',
        position,
        style: operationNodeStyle,
        sourcePosition,
        targetPosition,
        data: {
          label: operation,
          value: getValueOfBlock(operation)
        },
      };

      setId(id + 1);
      setElements((es) => es.concat(newNode));
    };
  };

  // gets called after end of edge gets dragged to another source or target
  const onEdgeUpdate = (oldEdge: Edge, newConnection: Connection) => {
    setElements((els) => updateEdge(oldEdge, newConnection, els));
    newConnection.target && updateNodeInternals(newConnection.target); // update node internals
  };

  const onConnect = (params: Edge | Connection) => {
    setElements((els) => addEdge({ ...params, animated: true }, els));
    params.target && updateNodeInternals(params.target); // update node internals
  };

  const onElementsRemove = (elementsToRemove: Elements) => {
    setElements((els) => removeElements(elementsToRemove, els))
  };

  return (
    <>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '9fr 1fr',
          columnGap: 10,
          margin: '20px 0',
        }}
      >
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
            rasterSource: RasterSource,
            block: Block,
            outputBlock: OutputBlock,
            customOperationBlock: CustomOperationBlock,
            numberBlock: NumberBlock
          }}
        >
          <Controls />
        </ReactFlow>
        <SideBar />
      </div>
      <button
        onClick={() => convertFlowToSource(elements)}
        className={buttonStyles.NewButton}
      >
        Save
      </button>
    </>
  )
};

const SideBar = () => {
  const onDragStart = (event: React.DragEvent<HTMLDivElement>, operation: string) => {
    event.dataTransfer.setData('application/reactflow', operation);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      className={styles.SideBar}
    >
      <div
        className={styles.Block}
        onDragStart={(event) => onDragStart(event, 'Clip')}
        draggable
      >
        Clip
      </div>
      <div
        className={styles.Block}
        onDragStart={(event) => onDragStart(event, 'Subtract')}
        draggable
      >
        Subtract
      </div>
      <div
        className={styles.Block}
        onDragStart={(event) => onDragStart(event, 'Snap')}
        draggable
      >
        Snap
      </div>
      <div
        className={styles.Block}
        onDragStart={(event) => onDragStart(event, 'MaskBelow')}
        draggable
      >
        MaskBelow
      </div>
      <div
        className={styles.Block}
        onDragStart={(event) => onDragStart(event, 'Number')}
        draggable
      >
        Number
      </div>
      <div
        className={styles.Block}
        onDragStart={(event) => onDragStart(event, 'RasterSource')}
        draggable
      >
        Raster Source
      </div>
    </div>
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

// custom blocks with multiple inputs
const Block = (props: Node) => {
  const { data } = props;
  const initialHandles = data.inputs.slice(1); // first item is not input
  const [handles, setHandles] = useState<string[]>(initialHandles);
  return (
    <>
      {handles.map((_handles: string, i: number) => (
        <Handle
          key={i}
          type="target"
          position={Position.Left}
          id={'handle-' + i}
          style={{ top: 10 * (i + 1) }}
        />
      ))}
      <BlockArea
        label={data.label}
        setHandles={setHandles}
      />
      <Handle
        type="source"
        position={Position.Right}
      />
    </>
  )
}

// Number block
const NumberBlock = (props: Node) => {
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
      <Handle
        type="source"
        position={Position.Right}
      />
    </>
  )
}

// custom output node
const OutputBlock = (props: Node) => {
  const { data } = props;
  const initialHandles = data.inputs.slice(1); // first item is not input
  const [handles, setHandles] = useState<string[]>(initialHandles);
  return (
    <>
      {handles.map((_handles: string, i: number) => (
        <Handle
          key={i}
          type="target"
          position={Position.Left}
          id={'handle-' + i}
          style={{ top: 10 * (i + 1) }}
        />
      ))}
      <BlockArea
        label={data.label}
        setHandles={setHandles}
      />
    </>
  )
}

const CustomOperationBlock = (props: Node) => {
  const { data } = props;
  const [handles, setHandles] = useState([data.label]);
  return (
    <>
      {handles.map((_handle: string, i: number) => {
        return (
        <Handle
          key={i}
          type="target"
          position={Position.Left}
          id={'handle-' + i}
          style={{ top: 10 * (i + 1) }}
        />
      )})}
      <BlockArea
        label={data.label}
        setHandles={setHandles}
      />
      <Handle
        type="source"
        position={Position.Right}
      />
    </>
  )
};

const BlockArea = (props: { label: string, setHandles: Function }) => {
  const { label, setHandles } = props;
  return (
    <div
      style={{
        fontSize: 12
      }}
    >
      <i
        className={'fa fa-plus'}
        style={{
          marginRight: 5,
          cursor: 'pointer'
        }}
        onClick={() => setHandles((handles: string[]) => handles.concat('new-handle'))}
      />
      {label}
      <i
        className={'fa fa-minus'}
        style={{
          marginLeft: 5,
          cursor: 'pointer'
        }}
        onClick={() => setHandles((handles: string[]) => handles.slice(0, -1))}
      />
    </div>
  )
}