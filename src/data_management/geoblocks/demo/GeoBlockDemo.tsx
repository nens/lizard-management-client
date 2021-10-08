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
import { testGeoBlock } from './blockData';
import styles from './GeoBlockDemo.module.css';
import buttonStyles from '../../../styles/Buttons.module.css';
import { geoblockType } from './geoblockType';

interface GeoBlockSource {
  name: string,
  graph: {
    [key: string]: (string | number)[]
  }
}

const flowStyles = {
  height: 600,
  border: '1px solid lightgrey',
  borderRadius: 10,
};

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
    type: 'OutputBlock',
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
      type: 'RasterBlock',
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
      type: 'Block',
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
        type: 'NumberBlock',
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
  const outputNode = nodes.find(e => e.type === 'OutputBlock');

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
      [node.data.label]: node.type === 'RasterBlock' ? [
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

export const GeoBlockDemo = () => {
  return (
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
  )
}

const Flow = () => {
  const geoblockSource = testGeoBlock;
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
  const numberOfSources = elements.filter(elm => isNode(elm) && elm.type === 'RasterBlock').length;

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

      const customNodeData = {
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

      const newNode = (operation === 'RasterBlock') ? {
        id: id.toString(),
        type: operation,
        position,
        style: rasterNodeStyle,
        data: customNodeData,
      } : (operation === 'Number') ? {
        id: id.toString(),
        type: 'NumberBlock',
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
        type: 'CustomOperationBlock',
        position,
        style: operationNodeStyle,
        sourcePosition,
        targetPosition,
        data: {
          label: operation,
          // @ts-ignore
          value: geoblockType[operation].class,
          // @ts-ignore
          parameters: geoblockType[operation].parameters
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
    setElements((els) => addEdge({ ...params, type: ConnectionLineType.SmoothStep, animated: true }, els));
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
          gridTemplateColumns: '1fr 150px',
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
            RasterBlock: RasterBlock,
            Block: Block,
            OutputBlock: OutputBlock,
            CustomOperationBlock: CustomOperationBlock,
            NumberBlock: NumberBlock,
          }}
        >
          <Controls />
        </ReactFlow>
        <SideBar />
      </div>
      <button
        onClick={() => {
          const elementsWithoutPosition = elements.map(el => {
            if (isNode(el)) {
              return {
                ...el,
                position: { x: 0, y: 0 }
              };
            };
            return el;
          });
          const layoutedElements = createGraphLayout(elementsWithoutPosition);
          setElements(layoutedElements);
        }}
        className={buttonStyles.NewButton}
      >
        Reset
      </button>
      <button
        onClick={() => console.log('validate the graph')}
        className={buttonStyles.NewButton}
        style={{ margin: '0 20px'}}
      >
        Validate
      </button>
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
      {Object.keys(geoblockType).map(blockName => (
        <div
          key={blockName}
          className={styles.Block}
          onDragStart={(event) => onDragStart(event, blockName)}
          draggable
        >
          {blockName}
        </div>
      ))}
    </div>
  );
};

// Custom raster source node with input field
const RasterBlock = (props: Node) => {
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
  const initialHandles = Array.isArray(data.parameters) ? data.parameters : [];
  const [handles, setHandles] = useState<string[]>(initialHandles);
  return (
    <>
      {handles.map((parameter: any, i: number) => {
        return (
          <Handle
            key={parameter.name}
            title={parameter.name}
            type="target"
            position={Position.Left}
            id={'handle-' + parameter.name}
            style={{
              top: 10 * (i + 1),
              background: (
                parameter.type === "number" ? "red" :
                parameter.type === "string" ? "green" :
                parameter.type === "raster_block" ? "blue" :
                undefined
              )
            }}
          />
      )})}
      <BlockArea
        label={data.label}
        setHandles={data.parameters.type === "array" ? (e: any) => setHandles(e) : undefined}
      />
      <Handle
        type="source"
        position={Position.Right}
      />
    </>
  )
};

const BlockArea = (props: {
  label: string,
  setHandles?: Function
}) => {
  const { label, setHandles } = props;
  return (
    <div
      style={{
        fontSize: 12,
        display: 'flex',
        alignItems: 'center'
      }}
    >
      {setHandles ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 10
          }}
        >
          <i
            className={'fa fa-plus'}
            style={{
              cursor: 'pointer'
            }}
            onClick={() => setHandles((handles: string[]) => handles.concat('new-handle'))}
          />
          <i
            className={'fa fa-minus'}
            style={{
              cursor: 'pointer'
            }}
            onClick={() => setHandles((handles: string[]) => handles.slice(0, -1))}
          />
        </div>
      ) : null}
      {label}
    </div>
  )
}