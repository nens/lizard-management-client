import React from 'react';
import { Handle, Node, Position } from 'react-flow-renderer';
import { geoblockType } from '../../../types/geoBlockType';

interface BlockData {
  label: string,
  classOfBlock: string,
  parameters: (string | number | [])[],
}

export const InputBlock = (props: Node<BlockData>) => {
  if (!props.data) return;
  const { label } = props.data;
  return (
    <>
      <BlockArea
        label={label}
      />
      <Handle
        type="source"
        position={Position.Right}
      />
    </>
  )
}

export const Block = (props: Node<BlockData>) => {
  if (!props.data) return;

  const { label, classOfBlock } = props.data;
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
      <BlockArea
        label={label}
      />
      <Handle
        type="source"
        position={Position.Right}
      />
    </>
  )
}

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
      <span>{label}</span>
    </div>
  )
}