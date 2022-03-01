import { useRef, useState } from "react";
import { connect } from "react-redux";
import { AppDispatch } from "../../..";
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
  useUpdateNodeInternals,
} from "react-flow-renderer";
import { SideBar } from "./blockComponents/SideBar";
import { Block } from "./blockComponents/Block";
import { GroupBlock } from "./blockComponents/GroupBlock";
import { RasterSource } from "./blockComponents/RasterSource";
import { geoblockType } from "../../../types/geoBlockType";
import { getBlockData } from "../geoblockUtils/geoblockUtils";
import { targetHandleValidator } from "../geoblockUtils/geoblockValidators";
import { addNotification } from "../../../actions";
import { v4 as uuid } from "uuid";

interface MyProps {
  elements: Elements;
  setElements: React.Dispatch<React.SetStateAction<Elements<any>>>;
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
      }

      const sourceNode = els.find((el) => el.id === newConnection.source)!;

      const newElements = els.map((el) => {
        if (el.id === oldEdge.target) el.data.parameters[oldEdge.targetHandle!] = ""; // remove old value
        if (el.id === newConnection.target)
          el.data.parameters[newConnection.targetHandle!] = sourceNode.data.label; // update new value
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
      }

      const sourceNode = els.find((el) => el.id === params.source)!;

      const newElements = els.map((el) => {
        if (el.id === params.target)
          el.data.parameters[params.targetHandle!] = sourceNode.data.label; // update new value
        return el;
      });

      return addEdge(
        {
          ...params,
          type: ConnectionLineType.SmoothStep,
          animated: true,
        },
        newElements
      );
    });
    params.target && updateNodeInternals(params.target); // update node internals
  };

  const onElementsRemove = (elementsToRemove: Elements) => {
    setElements((els) => {
      const newElements = els.map((el) => {
        const edgesToRemove = elementsToRemove.filter((elm) => isEdge(elm)) as Edge[];
        edgesToRemove.forEach((edge) => {
          if (edge.target === el.id) {
            const parameterIndex = parseInt(edge.targetHandle!);
            const { parameters, parameterTypes } = el.data!;
            const parameterType = Array.isArray(parameterTypes)
              ? parameterTypes[parameterIndex].type
              : [];

            if (parameterType.includes("boolean")) {
              // replace old value by false value in case of a boolean parameter field
              parameters[parameterIndex] = false;
            } else {
              // replace old value by an empty string
              parameters[parameterIndex] = "";
            }
          }
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
    event.dataTransfer.dropEffect = "move";
  };

  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (reactFlowWrapper && reactFlowWrapper.current) {
      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const blockName = event.dataTransfer.getData("application/reactflow");
      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });
      const sourcePosition = Position.Right;
      const targetPosition = Position.Left;

      // Keep track of number of block elements in the graph to create block id
      const numberOfBlocks = elements.filter((elm) => {
        // @ts-ignore
        return isNode(elm) && elm.data && elm.data.classOfBlock === geoblockType[blockName].class;
      }).length;

      const idOfNewBlock = uuid();

      const newBlock = {
        id: idOfNewBlock,
        type:
          blockName === "RasterSource"
            ? blockName
            : blockName === "Group" ||
              blockName === "GroupTemporal" ||
              blockName === "FillNoData" ||
              blockName === "Max"
            ? "GroupBlock"
            : "Block",
        position,
        sourcePosition,
        targetPosition,
        data: getBlockData(blockName, numberOfBlocks, idOfNewBlock, setElements),
      };
      console.log("newBlock", newBlock);
      setElements((es) => es.concat(newBlock));
    }
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 150px",
        columnGap: 10,
      }}
    >
      <ReactFlow
        ref={reactFlowWrapper}
        elements={elements}
        onElementsRemove={onElementsRemove}
        style={{
          position: "relative",
          border: "thin solid var(--color-header)",
        }}
        snapToGrid
        onEdgeUpdate={onEdgeUpdate}
        onConnect={onConnect}
        onLoad={onLoad}
        onDragOver={onDragOver}
        onDrop={onDrop}
        nodeTypes={{
          Block: (block: Node) => <Block block={block} onElementsRemove={onElementsRemove} />,
          GroupBlock: (block: Node) => (
            <GroupBlock block={block} onElementsRemove={onElementsRemove} />
          ),
          RasterSource,
        }}
        // use Backspace key for deletion on Mac instead of Delete key (for other platforms)
        deleteKeyCode={window.navigator.platform.startsWith("Mac") ? "Backspace" : "Delete"}
      >
        {elements.length > 100 ? (
          <MiniMap
            nodeColor={(node) => {
              if (node.type === "RasterSource") return "orange"; // raster source block
              if (getOutgoers(node, elements).length === 0) return "red"; // output block
              return "lightgrey"; // other blocks
            }}
            nodeStrokeWidth={3}
          />
        ) : null}
        <Controls />
      </ReactFlow>
      <SideBar />
    </div>
  );
};

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
);

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  addNotification: (message: string | number, timeout?: number) =>
    dispatch(addNotification(message, timeout)),
});
type DispatchProps = ReturnType<typeof mapDispatchToProps>;

export default connect(null, mapDispatchToProps)(GeoBlockVisualComponent);
