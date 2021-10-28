import React from 'react';
import { Handle, Node, Position } from 'react-flow-renderer';
import formStyles from './../../../../styles/Forms.module.css';
// import styles from './Block.module.css';

interface ArrayBlockInput {
  value: string,
  onChange: (value: string) => void,
}

export const ArrayBlock = (props: Node<ArrayBlockInput>) => {
  const { value } = props.data!;
  return (
    <div>
      <input
        type="text"
        title={JSON.stringify(value)}
        className={formStyles.FormControl}
        // onChange={e => onChange(e.target.value)}
        value={JSON.stringify(value)}
        readOnly
        style={{
          width: 140,
          fontSize: 12
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
      />
    </div>
  )
}