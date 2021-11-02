import React, { useState } from 'react';
import { Handle, Node, Position } from 'react-flow-renderer';
import styles from './Block.module.css';

interface GroupBlockInput {
  label: string,
  classOfBlock: string,
  parameters: string[],
}

export const GroupBlock = (props: Node<GroupBlockInput>) => {
  const { classOfBlock, label, parameters } = props.data!;
  const initialHandles = parameters ? parameters : ['handle-1', 'handle-2'];
  const [handles, setHandles] = useState<string[]>(initialHandles);
  const numberOfHandles = handles.length;

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
            top: 10 * (i + 1),
            background: 'green'
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
            onClick={() => setHandles((handles: string[]) => handles.slice(0, -1))}
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