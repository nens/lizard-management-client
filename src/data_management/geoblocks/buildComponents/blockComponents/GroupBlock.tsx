import React, { useState } from 'react';
import { Elements, Handle, Node, Position, useStoreState } from 'react-flow-renderer';
import styles from './Block.module.css';

interface GroupBlockInput {
  label: string,
  classOfBlock: string,
  parameters: string[],
}

interface GroupBlockProps {
  block: Node<GroupBlockInput>,
  onElementsRemove: (elementsToRemove: Elements) => void,
}

export const GroupBlock = (props: GroupBlockProps) => {
  const { block, onElementsRemove } = props;
  const { classOfBlock, label, parameters } = block.data!;
  const [handles, setHandles] = useState<string[]>(parameters);
  const numberOfHandles = handles.length;

  const edges = useStoreState(state => state.edges);

  return (
    <div
      className={styles.Block}
      tabIndex={1}
    >
      {handles.map((_parameter, i) => (
        <Handle
          key={i}
          type="target"
          id={i + ''}
          title={'source: raster_block'}
          position={Position.Left}
          style={{
            top: 10 * (i + 1)
          }}
        />
      ))}
      <div
        title={classOfBlock}
        style={{
          display: 'flex',
          alignItems: 'center',
          // calculate height of the Block if there are more than 7 handlers
          height: numberOfHandles > 7 ? numberOfHandles * 10 : 70
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginRight: 10,
            height: '100%'
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
            onClick={() => setHandles((handles: string[]) => {
              // First remove the edge that is connected to the last handle
              const connectedEdge = edges.find(
                edge => edge.target === block.id && edge.targetHandle === (handles.length - 1).toString()
              );
              if (connectedEdge) onElementsRemove([connectedEdge]);

              // remove the last handle
              const newHandles = handles.slice(0, -1);

              // Remove the last input value of the parameters
              parameters.pop();

              return newHandles;
            })}
          />
        </div>
        <div
          className={styles.BlockHeader}
        >
          <h4>{label}</h4>
          <small><i>({classOfBlock})</i></small>
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Right}
      />
    </div>
  )
}