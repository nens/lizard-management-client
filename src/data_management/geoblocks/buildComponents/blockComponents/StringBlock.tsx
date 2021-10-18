import React from 'react';
import { Handle, Node, Position } from 'react-flow-renderer';
import formStyles from './../../../../styles/Forms.module.css';
import styles from './Block.module.css';

interface StringBlockInput {
  value: string,
  onChange: (value: string) => void,
}

export const StringBlock = (props: Node<StringBlockInput>) => {
  const { value, onChange } = props.data!;
  return (
    <div
      className={`${styles.Block} ${styles.StringBlock}`}
      tabIndex={1}
    >
      <input
        type="text"
        className={`${formStyles.FormControl}`}
        onChange={e => onChange(e.target.value)}
        defaultValue={value}
      />
      <Handle
        type="source"
        position={Position.Right}
      />
    </div>
  )
}