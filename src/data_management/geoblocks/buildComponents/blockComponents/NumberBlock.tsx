import React from 'react';
import { Handle, Node, Position } from 'react-flow-renderer';

interface NumberBlockInput {
  value: number,
  onChange: (value: number) => void,
}

export const NumberBlock = (props: Node<NumberBlockInput>) => {
  const { value, onChange } = props.data!;
  return (
    <>
      <input
        type="number"
        onChange={e => onChange(parseFloat(e.target.value))}
        defaultValue={value}
        style={{
          width: 50,
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