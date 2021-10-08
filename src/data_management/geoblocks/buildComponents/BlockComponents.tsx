import React, { useState } from 'react';
import { Handle, Node, Position } from 'react-flow-renderer';
import { geoblockType } from '../../../types/geoBlockType';

export interface BlockFlowData {
  label: string,
  classOfBlock: string,
  parameters: (string | number | [])[],
  outputBlock?: boolean
}

export const InputBlock = (props: Node<BlockFlowData>) => {
  const { label } = props.data!;
  return (
    <>
      <div
        style={{
          fontSize: 12,
          display: 'flex',
          alignItems: 'center'
        }}
      >
        {label}
      </div>
      <Handle
        type="source"
        position={Position.Right}
      />
    </>
  )
}

export const Block = (props: Node<BlockFlowData>) => {
  const { label, classOfBlock, outputBlock } = props.data!;
  const block = Object.values(geoblockType).find(
    geoblock => geoblock && geoblock.class && geoblock.class === classOfBlock
  );

  if (!block) {
    console.error('No type definition for this block: ' + classOfBlock);
    return;
  };

  const { parameters } = block;
  return (
    <>
      {Array.isArray(parameters) && parameters.map((parameter, i) => (
        <Handle
          key={i}
          type="target"
          id={'handle-' + i}
          title={parameter.name}
          position={Position.Left}
          style={{
            top: 10 * (i + 1),
            background: (
              parameter.type === 'raster_block' ? 'orange' :
              parameter.type === 'string' ? 'blue' :
              parameter.type === 'number' ? 'green' :
              undefined
            )
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
        {label}
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

export const GroupBlock = (props: Node<BlockFlowData>) => {
  const { label, parameters } = props.data!;
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
      <Handle
        type="source"
        position={Position.Right}
      />
    </>
  )
}