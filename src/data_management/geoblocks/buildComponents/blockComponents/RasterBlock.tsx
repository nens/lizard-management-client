import React from 'react';
import { Handle, Node, Position } from 'react-flow-renderer';

interface RasterBlockInput {
  label: string,
  value: string,
  onChange: (value: string) => void,
}

export const RasterBlock = (props: Node<RasterBlockInput>) => {
  const { label, value, onChange } = props.data!;
  return (
    <>
      <div
        style={{
          fontSize: 12
        }}
      >
        {label}
      </div>
      <input
        type="text"
        onChange={e => onChange(e.target.value)}
        defaultValue={value}
        style={{
          fontSize: 10
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
      />
    </>
  )
}