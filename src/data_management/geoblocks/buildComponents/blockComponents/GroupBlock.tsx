import React, { useState } from 'react';
import { Handle, Node, Position } from 'react-flow-renderer';

interface GroupBlockInput {
  label: string,
  classOfBlock: string,
  parameters: (string | number | [])[],
  outputBlock?: boolean
}

export const GroupBlock = (props: Node<GroupBlockInput>) => {
  const { label, parameters, outputBlock } = props.data!;
  const [handles, setHandles] = useState<string[]>(parameters as string[]);

  return (
    <>
      {handles.map((_parameter, i) => (
        <Handle
          key={i}
          type="target"
          id={'handle-' + i}
          title={'source'}
          position={Position.Left}
          style={{
            top: 10 * (i + 1),
            background: 'orange'
          }}
        />
      ))}
      <div
        style={{
          fontSize: 12,
          display: 'flex',
          alignItems: 'center'
        }}
      >
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
        <span>{label}</span>
      </div>
      {!outputBlock ? (
        <Handle
          type="source"
          position={Position.Right}
        />
      ) : null}
    </>
  )
}