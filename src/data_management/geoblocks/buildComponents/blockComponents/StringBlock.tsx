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
    <div>
      <input
        type="text"
        title={value}
        className={`${formStyles.FormControl} ${styles.StringBlock}`}
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